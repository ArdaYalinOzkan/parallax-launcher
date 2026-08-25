/* Parallax from a command line.
   ==============================

   Written for programs, not for people — though people can use it. An
   agent asked to "start Terraria" or "which of my games have I never
   played" has no way in otherwise: the library is a text file it would
   have to learn the format of, and starting a game means knowing about
   Proton, Steam ids and compatibility tools. All of that already exists
   in this codebase; this puts a door on it.

   What it deliberately cannot do: delete a game, delete or create an
   account, or wipe anything. Those are the operations you cannot take
   back, and nothing that reads a page off the internet and decides what
   to do next should be holding them. Reading, starting, adding and
   editing are enough to be useful and cheap to undo.

   Output is human-readable by default and JSON with --json. Agents
   should pass --json; every command's JSON shape is stable and
   documented at https://help.parallaxlauncher.com/agents.html
*/

const fs = require('fs');
const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

const LibraryManager = require('./LibraryManager');
const Platform = require('./Platform');

const SURUM = '1';

/* ------------------------------------------------------------------
   Where things are
   ------------------------------------------------------------------
   The same directory Electron would hand back from getPath('userData'),
   worked out without loading Electron. This runs as plain Node so that
   it starts in milliseconds and needs no display.
   ------------------------------------------------------------------ */

function userDataPath() {
    const ad = 'parallax-launcher';
    if (process.platform === 'win32') {
        return path.join(process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming'), ad);
    }
    if (process.platform === 'darwin') {
        return path.join(os.homedir(), 'Library', 'Application Support', ad);
    }
    return path.join(process.env.XDG_CONFIG_HOME || path.join(os.homedir(), '.config'), ad);
}

const KOK = userDataPath();
const HESAPLAR = path.join(KOK, 'Parallax_Accounts');

function readAppSettings() {
    try {
        return JSON.parse(fs.readFileSync(path.join(KOK, 'app_settings.json'), 'utf-8'));
    } catch {
        return {};
    }
}

/* The account to work on. Named with --account, otherwise the one the
   app used last, otherwise the only one there is. Guessing between
   several would be picking somebody's library for them. */
function accountList() {
    if (!fs.existsSync(HESAPLAR)) return [];
    return fs.readdirSync(HESAPLAR, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name)
        .sort();
}

function resolveAccount(istenen) {
    const hepsi = accountList();
    if (hepsi.length === 0) throw new Hata('NO_ACCOUNTS', 'No Parallax accounts found in ' + HESAPLAR);

    if (istenen) {
        const tam = hepsi.find(a => a.toLowerCase() === istenen.toLowerCase());
        if (!tam) throw new Hata('NO_SUCH_ACCOUNT', 'No account named "' + istenen + '". Have: ' + hepsi.join(', '));
        return tam;
    }

    const son = readAppSettings().lastAccount;
    if (son && hepsi.includes(son)) return son;
    if (hepsi.length === 1) return hepsi[0];

    throw new Hata('AMBIGUOUS_ACCOUNT',
        'More than one account (' + hepsi.join(', ') + '). Say which with --account.');
}

class Hata extends Error {
    constructor(kod, mesaj) { super(mesaj); this.kod = kod; }
}

/* ------------------------------------------------------------------
   Finding a game by whatever the caller happened to have
   ------------------------------------------------------------------
   An agent will have a name, and the name it has will be the one a
   person said out loud — "half life 2", not "Half-Life 2". So: exact id
   first, then exact name, then a loose match, and if more than one game
   answers to a loose match it says so rather than picking.
   ------------------------------------------------------------------ */

function normalize(s) {
    return String(s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findGame(games, aranan) {
    if (!aranan) throw new Hata('NO_QUERY', 'Which game?');

    const byId = games.find(g => g.Id === aranan);
    if (byId) return byId;

    const n = normalize(aranan);
    const tam = games.filter(g => normalize(g.Name) === n);
    if (tam.length === 1) return tam[0];
    if (tam.length > 1) return tam[0];   // same name twice: the first is as good as any

    const kismi = games.filter(g => normalize(g.Name).includes(n));
    if (kismi.length === 1) return kismi[0];
    if (kismi.length > 1) {
        throw new Hata('AMBIGUOUS_GAME',
            '"' + aranan + '" matches ' + kismi.length + ' games: ' +
            kismi.slice(0, 8).map(g => g.Name).join(', ') +
            (kismi.length > 8 ? ', …' : '') + '. Use the id.');
    }
    throw new Hata('NO_SUCH_GAME', 'No game matching "' + aranan + '".');
}

/* What a game looks like from outside. The stored record carries fields
   that are ours to worry about, not a caller's; this is the part that is
   stable enough to promise. */
function publicGame(g) {
    return {
        id: g.Id || '',
        name: g.Name || '',
        platform: g.Platform || 'PC',
        status: g.Status || (g.Path ? 'Installed' : 'Uninstalled'),
        installed: (g.Status || (g.Path ? 'Installed' : 'Uninstalled')) === 'Installed',
        path: g.Path || null,
        playTimeHours: parseFloat(g.PlayTime) || 0,
        steamAppId: g.SteamAppId || null,
        category: g.Category || null,
        launchOptions: g.LaunchOptions || null,
        compatTool: g.CompatTool || 'auto'
    };
}

/* ------------------------------------------------------------------
   Editing
   ------------------------------------------------------------------
   A fixed list, because "set any field you like" on a file the program
   also reads is a way to end up with a library it cannot parse. Names
   are given in the form callers see them in output.
   ------------------------------------------------------------------ */

const DUZENLENEBILIR = {
    name: 'Name',
    path: 'Path',
    platform: 'Platform',
    category: 'Category',
    playtime: 'PlayTime',
    playtimehours: 'PlayTime',
    status: 'Status',
    steamappid: 'SteamAppId',
    launchoptions: 'LaunchOptions',
    compattool: 'CompatTool',
    wineprefix: 'WinePrefix',
    envvars: 'EnvVars',
    usegamemode: 'UseGameMode',
    usemangohud: 'UseMangoHud',
    cover: 'Cover',
    banner: 'Banner'
};

function applyEdit(game, alan, deger) {
    const anahtar = DUZENLENEBILIR[String(alan).toLowerCase().replace(/[^a-z]/g, '')];
    if (!anahtar) {
        throw new Hata('NO_SUCH_FIELD',
            'Cannot set "' + alan + '". Fields: ' + [...new Set(Object.values(DUZENLENEBILIR))].join(', '));
    }

    if (anahtar === 'PlayTime') {
        const n = parseFloat(deger);
        if (isNaN(n) || n < 0) throw new Hata('BAD_VALUE', 'Play time must be a number of hours.');
        deger = String(n);
    }

    if (anahtar === 'Status') {
        const d = String(deger).toLowerCase();
        if (d !== 'installed' && d !== 'uninstalled') {
            throw new Hata('BAD_VALUE', 'Status must be Installed or Uninstalled.');
        }
        deger = d === 'installed' ? 'Installed' : 'Uninstalled';
    }

    // Saying a game is installed without saying where is a claim the
    // program cannot act on, so the two are kept honest together.
    if (anahtar === 'Path') {
        deger = String(deger);
        if (deger && !fs.existsSync(deger)) {
            throw new Hata('NO_SUCH_PATH', 'Nothing at ' + deger);
        }
        game.Status = deger ? 'Installed' : 'Uninstalled';
    }

    game[anahtar] = deger;
    return anahtar;
}

/* ------------------------------------------------------------------
   Starting a game
   ------------------------------------------------------------------ */

function openExternal(uri) {
    const cmd = process.platform === 'win32' ? 'cmd'
        : process.platform === 'darwin' ? 'open' : 'xdg-open';
    const args = process.platform === 'win32' ? ['/c', 'start', '', uri] : [uri];
    spawn(cmd, args, { detached: true, stdio: 'ignore' }).unref();
}

function launchGame(game) {
    const plan = Platform.planLaunch(game, readAppSettings());

    if (plan.kind === 'none') {
        throw new Hata(plan.reason || 'CANNOT_LAUNCH',
            'Cannot start "' + (game.Name || '') + '": ' + (plan.reason || 'unknown'));
    }

    if (plan.kind === 'uri') {
        openExternal(plan.uri);
        return { started: true, via: plan.uri.split(':')[0], uri: plan.uri, tracked: false };
    }

    if (plan.env && plan.env.STEAM_COMPAT_DATA_PATH) {
        fs.mkdirSync(plan.env.STEAM_COMPAT_DATA_PATH, { recursive: true });
    }

    const child = spawn(plan.cmd, plan.args, {
        cwd: plan.cwd,
        detached: true,
        stdio: 'ignore',
        env: Object.assign({}, process.env, plan.env || {})
    });
    child.unref();

    return {
        started: true,
        via: plan.kind,
        pid: child.pid,
        proton: plan.protonName || null,
        tracked: false
    };
}

/* ------------------------------------------------------------------
   Argument parsing
   ------------------------------------------------------------------ */

function parseArgs(argv) {
    const konum = [];
    const bayrak = {};
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a.startsWith('--')) {
            const [ad, ...kalan] = a.slice(2).split('=');
            if (kalan.length) bayrak[ad] = kalan.join('=');
            else if (argv[i + 1] && !argv[i + 1].startsWith('--')) bayrak[ad] = argv[++i];
            else bayrak[ad] = true;
        } else {
            konum.push(a);
        }
    }
    return { konum, bayrak };
}

/* ------------------------------------------------------------------
   Printing
   ------------------------------------------------------------------ */

let jsonMode = false;

function ok(veri, insanaGore) {
    if (jsonMode) {
        process.stdout.write(JSON.stringify(Object.assign({ ok: true }, veri), null, 2) + '\n');
    } else if (insanaGore) {
        process.stdout.write(insanaGore + '\n');
    }
    return 0;
}

function fail(kod, mesaj) {
    if (jsonMode) {
        process.stdout.write(JSON.stringify({ ok: false, error: kod, message: mesaj }, null, 2) + '\n');
    } else {
        process.stderr.write('parallax: ' + mesaj + '\n');
    }
    return 1;
}

function table(rows, headers) {
    const w = headers.map((h, i) => Math.max(h.length, ...rows.map(r => String(r[i] ?? '').length)));
    const line = (cells) => cells.map((c, i) => String(c ?? '').padEnd(w[i])).join('  ').trimEnd();
    return [line(headers), line(w.map(n => '-'.repeat(n))), ...rows.map(line)].join('\n');
}

/* ------------------------------------------------------------------
   Commands
   ------------------------------------------------------------------ */

const KULLANIM = `Parallax Launcher — command line (v${SURUM})

  parallax accounts                       every account on this machine
  parallax games [--installed] [--search TEXT] [--sort name|playtime]
  parallax game <id|name>                 one game, in full
  parallax launch <id|name>               start a game
  parallax find <name> [--appid N]        where a game is installed
  parallax add <name> [--path P] [--steam-appid N] [--platform P]
  parallax set <id|name> <field> <value>  change one field
  parallax scan                           recheck what is installed
  parallax fields                         what "set" accepts

Options
  --account NAME    which library (default: the one the app used last)
  --json            machine-readable output; use this from a program

Deleting games, and anything to do with accounts, is deliberately not
here. Full reference: https://help.parallaxlauncher.com/agents.html`;

function komutAccounts() {
    const hepsi = accountList();
    let aktif = null;
    try { aktif = resolveAccount(null); } catch { /* ambiguous is fine here */ }
    return ok(
        { accounts: hepsi.map(a => ({ name: a, active: a === aktif })) },
        hepsi.length
            ? hepsi.map(a => (a === aktif ? '* ' : '  ') + a).join('\n')
            : 'No accounts found.'
    );
}

function kutuphane(bayrak) {
    const hesap = resolveAccount(bayrak.account);
    const lm = new LibraryManager(path.join(HESAPLAR, hesap));
    const { profile, games } = lm.readLibrary();
    return { hesap, lm, profile, games };
}

function komutGames(bayrak) {
    const { hesap, games } = kutuphane(bayrak);
    let liste = games.map(publicGame);

    if (bayrak.installed === true || bayrak.installed === 'true') {
        liste = liste.filter(g => g.installed);
    }
    if (bayrak.search) {
        const n = normalize(bayrak.search);
        liste = liste.filter(g => normalize(g.name).includes(n));
    }

    const sirala = String(bayrak.sort || 'name').toLowerCase();
    if (sirala === 'playtime') liste.sort((a, b) => b.playTimeHours - a.playTimeHours);
    else liste.sort((a, b) => a.name.localeCompare(b.name));

    return ok(
        { account: hesap, count: liste.length, games: liste },
        table(
            liste.map(g => [g.name, g.platform, g.installed ? 'installed' : '-', g.playTimeHours.toFixed(1) + 'h']),
            ['NAME', 'PLATFORM', 'STATE', 'PLAYED']
        ) + '\n\n' + liste.length + ' games in ' + hesap
    );
}

function komutGame(konum, bayrak) {
    const { hesap, games } = kutuphane(bayrak);
    const g = findGame(games, konum[1]);
    const p = publicGame(g);
    return ok(
        { account: hesap, game: p },
        Object.entries(p).map(([k, v]) => k.padEnd(14) + (v === null ? '-' : v)).join('\n')
    );
}

function komutLaunch(konum, bayrak) {
    const { games } = kutuphane(bayrak);
    const g = findGame(games, konum[1]);
    const sonuc = launchGame(g);
    return ok({ game: publicGame(g), launch: sonuc }, 'Started ' + g.Name + ' (' + sonuc.via + ')');
}

function komutFind(konum, bayrak) {
    const ad = konum.slice(1).join(' ');
    if (!ad) throw new Hata('NO_QUERY', 'Which game?');
    const bulunan = Platform.findGameLocation({ name: ad, appid: bayrak.appid || bayrak['steam-appid'] });
    return ok(
        { query: ad, found: bulunan.length, locations: bulunan },
        bulunan.length
            ? bulunan.map(b => b.path + (b.exe ? '\n  -> ' + b.exe : '')).join('\n')
            : 'Not found on this computer.'
    );
}

function komutAdd(konum, bayrak) {
    const ad = konum.slice(1).join(' ').trim();
    if (!ad) throw new Hata('NO_NAME', 'A name is needed.');

    const { hesap, lm, profile, games } = kutuphane(bayrak);
    if (games.some(g => normalize(g.Name) === normalize(ad))) {
        throw new Hata('ALREADY_THERE', '"' + ad + '" is already in this library.');
    }

    const appid = bayrak['steam-appid'] || bayrak.appid || '';
    let konumBilgi = bayrak.path || '';

    // Same courtesy the window gives: look before making the caller say.
    if (!konumBilgi) {
        const bulunan = Platform.findGameLocation({ name: ad, appid });
        if (bulunan.length) konumBilgi = bulunan[0].path;
    }
    if (konumBilgi && !fs.existsSync(konumBilgi)) {
        throw new Hata('NO_SUCH_PATH', 'Nothing at ' + konumBilgi);
    }

    const yeni = {
        Id: 'cli-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8),
        Name: ad,
        OriginalName: ad,
        Category: bayrak.category || 'Games',
        Platform: bayrak.platform || (appid ? 'Steam' : 'PC'),
        Status: konumBilgi ? 'Installed' : 'Uninstalled',
        Path: konumBilgi,
        PlayTime: '0.0',
        SteamAppId: appid ? String(appid) : ''
    };

    games.push(yeni);
    lm.updateLibrary(profile, games);

    return ok(
        { account: hesap, game: publicGame(yeni) },
        'Added ' + ad + (konumBilgi ? ' (found at ' + konumBilgi + ')' : ' (no location yet)')
    );
}

function komutSet(konum, bayrak) {
    const [, hedef, alan, ...kalan] = konum;
    const deger = kalan.join(' ');
    if (!hedef || !alan) throw new Hata('BAD_USAGE', 'Usage: parallax set <game> <field> <value>');

    const { hesap, lm, profile, games } = kutuphane(bayrak);
    const g = findGame(games, hedef);
    const yazilan = applyEdit(g, alan, deger);
    lm.updateLibrary(profile, games);

    return ok(
        { account: hesap, game: publicGame(g), changed: yazilan },
        g.Name + ': ' + yazilan + ' = ' + (g[yazilan] || '-')
    );
}

/* Steam is the authority on whether a Steam game is installed, and it
   disagrees with the library often enough to be worth asking.

   The question is whether the manifest exists, not whether StateFlags
   reads exactly 4. A game with an update waiting carries flags of 6 and
   is sitting right there on the disk — treating that as "not installed"
   would have this command quietly uninstall people's games on paper
   every time Valve shipped a patch.

   A game pointed at by hand has no manifest to consult, so it is judged
   the only way it can be: whether the folder is still there. */
function komutScan(bayrak) {
    const { hesap, lm, profile, games } = kutuphane(bayrak);
    const degisen = [];

    const kaydet = (g, simdiki, olmali) => {
        if (olmali === simdiki) return;
        g.Status = olmali;
        degisen.push({ name: g.Name, from: simdiki, to: olmali });
    };

    for (const g of games) {
        const simdiki = g.Status || (g.Path ? 'Installed' : 'Uninstalled');

        if (g.SteamAppId) {
            const state = Platform.appInstallState(g.SteamAppId);
            if (state.found && state.path) g.Path = state.path;
            kaydet(g, simdiki, state.found ? 'Installed' : 'Uninstalled');
            continue;
        }

        if (simdiki !== 'Installed') continue;
        if (g.Path && !fs.existsSync(g.Path)) kaydet(g, simdiki, 'Uninstalled');
    }

    if (degisen.length) lm.updateLibrary(profile, games);

    return ok(
        { account: hesap, changed: degisen.length, changes: degisen },
        degisen.length
            ? degisen.map(d => d.name + ': ' + d.from + ' -> ' + d.to).join('\n')
            : 'Nothing changed.'
    );
}

function komutFields() {
    const adlar = [...new Set(Object.values(DUZENLENEBILIR))];
    return ok({ fields: adlar }, adlar.join('\n'));
}

/* ------------------------------------------------------------------ */

function run(argv) {
    const { konum, bayrak } = parseArgs(argv);
    jsonMode = bayrak.json === true || bayrak.json === 'true';

    const komut = (konum[0] || '').toLowerCase();

    if (!komut || komut === 'help' || bayrak.help) {
        if (jsonMode) return ok({ usage: KULLANIM, version: SURUM });
        process.stdout.write(KULLANIM + '\n');
        return 0;
    }
    if (komut === 'version') return ok({ version: SURUM }, SURUM);

    switch (komut) {
        case 'accounts': return komutAccounts();
        case 'games': case 'list': return komutGames(bayrak);
        case 'game': case 'show': return komutGame(konum, bayrak);
        case 'launch': case 'play': return komutLaunch(konum, bayrak);
        case 'find': case 'locate': return komutFind(konum, bayrak);
        case 'add': return komutAdd(konum, bayrak);
        case 'set': return komutSet(konum, bayrak);
        case 'scan': return komutScan(bayrak);
        case 'fields': return komutFields();
        default:
            throw new Hata('NO_SUCH_COMMAND', 'No command "' + komut + '". Try: parallax help');
    }
}

function main(argv) {
    try {
        return run(argv);
    } catch (err) {
        if (err instanceof Hata) return fail(err.kod, err.message);
        return fail('INTERNAL', err && err.message ? err.message : String(err));
    }
}

module.exports = { main, run };

if (require.main === module) {
    process.exit(main(process.argv.slice(2)));
}
