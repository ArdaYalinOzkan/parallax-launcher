/* ==============================================================
   ARTWORK
   ==============================================================
   Fills a library with cover and banner images.

   Steam serves the official art for every game it sells straight
   off its CDN, addressed by app id, with no API key and no quota.
   That makes it the right floor: after an import the library is
   never a wall of blank cards, and it costs nothing to fill.

   It is a floor and not a ceiling on purpose — Steam has exactly
   one official image per type, take it or leave it. Picking
   something nicer is what SteamGridDB is for, one game at a time.
   ============================================================== */

const fs = require('fs');
const path = require('path');

const STEAM_CDN = 'https://cdn.cloudflare.steamstatic.com/steam/apps';

/* Best first. If none of these exist the game keeps its placeholder
   rather than being given something the wrong shape: `header.jpg` is
   460x215, and cropping that into a 2:3 card looks worse than an
   honest empty slot. Those games are reported back so they can be
   sent to SteamGridDB instead. */
const COVER_CHAIN = ['library_600x900_2x.jpg', 'library_600x900.jpg'];

/* Banners are wide to begin with, so the fallbacks all fit. */
const BANNER_CHAIN = ['library_hero.jpg', 'page_bg_generated_v6b.jpg', 'header.jpg'];

const SGDB_API = 'https://www.steamgriddb.com/api/v2';

const norm = (v) => (v || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');


/**
 * SteamGridDB, asked directly by Steam app id.
 *
 * Worth doing as a fallback because Steam simply has no official
 * capsule for a fair number of games — delisted ones, playtests, and
 * anything released before the library capsule existed. Measured on
 * this library: Steam covered 191 of 225, and SteamGridDB had covers
 * for 31 of the 34 it missed.
 *
 * Going in by app id skips the name-search endpoint entirely, which
 * is both the rate-limited one and the one that guesses wrong on
 * names like "Half-Life 2".
 */
async function fromSteamGridDB(appid, kind, apiKey) {
    if (!apiKey) return null;

    // 600x900 for covers keeps the aspect right; heroes are wide by
    // definition so they need no filter.
    const query = kind === 'grids' ? '?dimensions=600x900' : '';

    try {
        const res = await fetch(`${SGDB_API}/${kind}/steam/${appid}${query}`, {
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                // Cloudflare fronts this API and rejects some default
                // agents outright, so say who we are.
                'User-Agent': 'ParallaxLauncher/3.0'
            }
        });
        if (!res.ok) return null;

        const body = await res.json();
        if (!body.success || !body.data || body.data.length === 0) return null;

        // Community votes are the only quality signal available.
        const best = body.data
            .filter(a => !a.nsfw && !a.humor)
            .sort((a, b) => (b.score || 0) - (a.score || 0))[0];
        if (!best || !best.url) return null;

        const img = await fetch(best.url);
        if (!img.ok) return null;

        const buffer = Buffer.from(await img.arrayBuffer());
        if (buffer.length < 2048) return null;

        const ext = (best.mime === 'image/png') ? 'png' : 'jpg';
        return { buffer, ext };
    } catch (e) {
        return null;
    }
}


/** Every game on the account, with app ids. One request. */
async function ownedGames(steamKey, steamId) {
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/` +
        `?key=${steamKey}&steamid=${steamId}&include_appinfo=1&include_played_free_games=1`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`Steam API ${res.status}`);

    const body = await res.json();
    const games = (body.response && body.response.games) || [];
    return games.map(g => ({ appid: String(g.appid), name: g.name || '' }));
}


/** First image in the chain that actually exists, or null. */
async function firstAvailable(appid, chain) {
    for (const file of chain) {
        try {
            const res = await fetch(`${STEAM_CDN}/${appid}/${file}`);
            if (!res.ok) continue;
            const buf = Buffer.from(await res.arrayBuffer());
            // Steam answers some missing assets with a tiny placeholder
            // rather than a 404, so anything trivially small is a miss.
            if (buf.length < 2048) continue;
            return { buffer: buf, file };
        } catch (e) { /* try the next one in the chain */ }
    }
    return null;
}


function saveToVault(vaultDir, buffer, name) {
    if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir, { recursive: true });
    fs.writeFileSync(path.join(vaultDir, name), buffer);
    return `./Vault_Assets/${name}`;
}


/** Runs `worker` over `items`, `limit` at a time. */
async function pool(items, limit, worker) {
    let cursor = 0;
    const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
        while (cursor < items.length) {
            const i = cursor++;
            await worker(items[i], i);
        }
    });
    await Promise.all(runners);
}


/**
 * Links games to their Steam app id, then downloads whatever art
 * Steam has for them.
 *
 * Games that already carry an image are left alone, so this is safe
 * to run again and a second run costs almost nothing.
 *
 * @param {Object}   opts
 * @param {Array}    opts.games      library entries, mutated in place
 * @param {string}   opts.vaultDir   where images are written
 * @param {string}   opts.steamKey   Steam Web API key
 * @param {string}   opts.steamId    64-bit Steam id
 * @param {Function} opts.onProgress ({done, total, name}) => void
 */
async function fillFromSteam({ games, vaultDir, steamKey, steamId, sgdbKey, onProgress }) {
    // `hasSgdbKey` is reported back so the summary can tell the
    // difference between "no artwork exists anywhere" and "community
    // artwork was never searched because no key is set" — those look
    // identical otherwise, and only one of them is fixable.
    const stats = {
        linked: 0, covers: 0, banners: 0, fromSgdb: 0,
        noArt: [], skipped: 0, hasSgdbKey: !!sgdbKey
    };

    // 1. Backfill app ids. The Steam import already had these in hand
    //    and simply never wrote them, which is why nothing could be
    //    addressed on the CDN.
    let owned = [];
    try {
        owned = await ownedGames(steamKey, steamId);
    } catch (e) {
        return { error: `STEAM_API: ${e.message}`, stats };
    }

    const byName = new Map();
    for (const g of owned) byName.set(norm(g.name), g.appid);

    for (const game of games) {
        if (game.SteamAppId) continue;
        const appid = byName.get(norm(game.Name)) || byName.get(norm(game.OriginalName));
        if (appid) {
            game.SteamAppId = appid;
            stats.linked++;
        }
    }

    // 2. Only games that are missing something. A game that already
    //    has artwork is never touched — that is what makes this safe
    //    to run again after adding a key: the second pass fills the
    //    gaps the first pass could not, and leaves the rest alone.
    const targets = games.filter(g =>
        g.SteamAppId && (!g.Cover || !g.Banner));
    stats.skipped = games.length - targets.length;

    let done = 0;
    await pool(targets, 6, async (game) => {
        const id = game.SteamAppId;

        if (!game.Cover) {
            const hit = await firstAvailable(id, COVER_CHAIN);
            if (hit) {
                game.Cover = saveToVault(vaultDir, hit.buffer, `steam_${id}_cover.jpg`);
                stats.covers++;
            } else {
                const alt = await fromSteamGridDB(id, 'grids', sgdbKey);
                if (alt) {
                    game.Cover = saveToVault(vaultDir, alt.buffer, `sgdb_${id}_cover.${alt.ext}`);
                    stats.covers++;
                    stats.fromSgdb++;
                } else {
                    stats.noArt.push(game.Name);
                }
            }
        }

        if (!game.Banner) {
            const hit = await firstAvailable(id, BANNER_CHAIN);
            if (hit) {
                game.Banner = saveToVault(vaultDir, hit.buffer, `steam_${id}_banner.jpg`);
                stats.banners++;
            } else {
                const alt = await fromSteamGridDB(id, 'heroes', sgdbKey);
                if (alt) {
                    game.Banner = saveToVault(vaultDir, alt.buffer, `sgdb_${id}_banner.${alt.ext}`);
                    stats.banners++;
                }
            }
        }

        done++;
        if (onProgress) onProgress({ done, total: targets.length, name: game.Name });
    });

    return { stats };
}

module.exports = { fillFromSteam, ownedGames, firstAvailable, fromSteamGridDB, COVER_CHAIN, BANNER_CHAIN };
