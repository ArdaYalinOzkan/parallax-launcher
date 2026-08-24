/* ==============================================================
   PLATFORM
   ==============================================================
   Everything the launcher needs to know about the machine it is
   running on, in one place. main.js should never test
   process.platform directly — it asks this module instead.

   The project started on Windows, so most of what is here is the
   Linux and macOS half that was missing, plus the Steam plumbing
   that is genuinely different on each OS.
   ============================================================== */

const fs = require('fs');
const path = require('path');
const os = require('os');
// execFile rather than exec: the process listings below take fixed
// arguments and never a shell, so nothing a game is called can be
// read as one.
const { execFile } = require('child_process');

const IS_WINDOWS = process.platform === 'win32';
const IS_LINUX = process.platform === 'linux';
const IS_MAC = process.platform === 'darwin';

const HOME = os.homedir();


/* --------------------------------------------------------------
   VDF / ACF
   Valve's config files. Not JSON, but a flat regex is enough for
   the handful of keys we care about, and it cannot throw the way
   a hand-written recursive parser can on an unexpected file.
   -------------------------------------------------------------- */

function vdfValue(text, key) {
    const m = text.match(new RegExp(`"${key}"\\s*"([^"]*)"`, 'i'));
    return m ? m[1] : null;
}

function vdfAllValues(text, key) {
    const out = [];
    const re = new RegExp(`"${key}"\\s*"([^"]*)"`, 'gi');
    let m;
    while ((m = re.exec(text)) !== null) out.push(m[1]);
    return out;
}


/* --------------------------------------------------------------
   STEAM
   -------------------------------------------------------------- */

/** Places Steam might be installed, most likely first. */
function steamRootCandidates() {
    if (IS_WINDOWS) {
        const pf86 = process.env['ProgramFiles(x86)'] || 'C:\\Program Files (x86)';
        const pf = process.env.ProgramFiles || 'C:\\Program Files';
        return [
            path.join(pf86, 'Steam'),
            path.join(pf, 'Steam'),
            'C:\\Steam',
            'D:\\Steam'
        ];
    }
    if (IS_MAC) {
        return [path.join(HOME, 'Library', 'Application Support', 'Steam')];
    }
    // Linux: native, the .steam symlinks, Flatpak, and Snap
    return [
        path.join(HOME, '.local', 'share', 'Steam'),
        path.join(HOME, '.steam', 'steam'),
        path.join(HOME, '.steam', 'root'),
        path.join(HOME, '.var', 'app', 'com.valvesoftware.Steam', 'data', 'Steam'),
        path.join(HOME, 'snap', 'steam', 'common', '.local', 'share', 'Steam')
    ];
}

function steamRoot() {
    for (const p of steamRootCandidates()) {
        try {
            if (fs.existsSync(path.join(p, 'steamapps'))) return p;
        } catch (e) { /* unreadable candidate, try the next */ }
    }
    return null;
}

/**
 * Every Steam library on this machine, not just the default one.
 * Games routinely live on a second drive, which is the main reason
 * the old folder-guessing missed so much.
 */
function steamLibraries() {
    const root = steamRoot();
    if (!root) return [];

    const libs = new Set();
    libs.add(path.join(root, 'steamapps'));

    const vdf = path.join(root, 'steamapps', 'libraryfolders.vdf');
    try {
        if (fs.existsSync(vdf)) {
            const text = fs.readFileSync(vdf, 'utf-8');
            // Modern format uses "path"; older ones put the path
            // straight into a numbered key.
            const paths = vdfAllValues(text, 'path');
            for (const p of paths) {
                const apps = path.join(p, 'steamapps');
                if (fs.existsSync(apps)) libs.add(apps);
            }
            if (paths.length === 0) {
                for (const m of text.matchAll(/"\d+"\s*"([^"]+)"/g)) {
                    const apps = path.join(m[1].replace(/\\\\/g, path.sep), 'steamapps');
                    if (fs.existsSync(apps)) libs.add(apps);
                }
            }
        }
    } catch (e) {
        console.error('[Platform] libraryfolders.vdf okunamadı:', e.message);
    }

    return [...libs];
}

// Steam installs its own runtimes and redistributables the same way
// it installs games, and they show up in the manifests. They are not
// things anyone wants in a library.
const STEAM_TOOL = /^(Steam Linux Runtime|Proton |Proton$|Steamworks Common|Steam Controller|SteamVR|Steam Runtime)/i;

/**
 * What Steam actually has installed, straight from its own
 * manifests. This is authoritative: it carries the appid, the real
 * folder name, and the install state — none of which can be
 * guessed reliably from a store name.
 */
function installedSteamApps() {
    const found = [];

    for (const lib of steamLibraries()) {
        let entries;
        try {
            entries = fs.readdirSync(lib);
        } catch (e) { continue; }

        for (const entry of entries) {
            if (!/^appmanifest_\d+\.acf$/i.test(entry)) continue;
            try {
                const text = fs.readFileSync(path.join(lib, entry), 'utf-8');
                const appid = vdfValue(text, 'appid');
                const name = vdfValue(text, 'name');
                const installdir = vdfValue(text, 'installdir');
                if (!appid || !installdir) continue;

                const label = name || installdir;
                if (STEAM_TOOL.test(label)) continue;

                const dir = path.join(lib, 'common', installdir);
                if (!fs.existsSync(dir)) continue;   // manifest left behind

                found.push({ appid, name: label, installdir, path: dir });
            } catch (e) { /* skip the bad manifest, keep the rest */ }
        }
    }

    return found;
}

/**
 * What Steam is currently doing with one app, read from its own
 * manifest. Steam writes download progress there while it works, so a
 * launcher can show it without the user ever opening Steam's window.
 *
 * StateFlags is a bitfield; bit 2 (value 4) means fully installed, and
 * the update/download bits are set while it is working.
 */
function appInstallState(appid) {
    if (!appid) return { found: false };

    for (const lib of steamLibraries()) {
        const file = path.join(lib, `appmanifest_${appid}.acf`);
        let text;
        try {
            if (!fs.existsSync(file)) continue;
            text = fs.readFileSync(file, 'utf-8');
        } catch (e) { continue; }

        const num = (k) => parseInt(vdfValue(text, k) || '0', 10) || 0;
        const flags = num('StateFlags');
        const toDownload = num('BytesToDownload');
        const downloaded = num('BytesDownloaded');

        // Steam leaves the byte counters equal and non-zero once a
        // download finishes, so "busy" has to come from the flags.
        const installed = (flags & 4) !== 0 && (flags & ~4) === 0;
        const busy = !installed;

        return {
            found: true,
            appid: String(appid),
            name: vdfValue(text, 'name') || '',
            installdir: vdfValue(text, 'installdir') || '',
            path: path.join(lib, 'common', vdfValue(text, 'installdir') || ''),
            stateFlags: flags,
            installed,
            busy,
            bytesDownloaded: downloaded,
            bytesToDownload: toDownload,
            percent: toDownload > 0 ? Math.min(100, (downloaded / toDownload) * 100) : (installed ? 100 : 0)
        };
    }

    return { found: false, appid: String(appid) };
}

/**
 * Playtime for every app Steam has a record of, in minutes, read from
 * the local config rather than the Web API.
 *
 * This matters because it needs no API key, no network and no rate
 * limit, and Steam keeps the file current — it is the same number the
 * client shows. Measured against the Web API on this machine, every
 * overlapping entry matched exactly.
 *
 * What it does not have: games that have never been launched. Those
 * simply have no entry, so this is a source to merge in, never a
 * source to overwrite from.
 */
function steamPlaytimes() {
    const out = {};
    const root = steamRoot();
    if (!root) return out;

    const userdata = path.join(root, 'userdata');
    let accounts;
    try { accounts = fs.readdirSync(userdata); } catch (e) { return out; }

    for (const acc of accounts) {
        const file = path.join(userdata, acc, 'config', 'localconfig.vdf');
        let text;
        try {
            if (!fs.existsSync(file)) continue;
            text = fs.readFileSync(file, 'utf-8');
        } catch (e) { continue; }

        // Flat blocks of `"<appid>" { "Playtime" "<minutes>" ... }`.
        // A non-nested match is enough: these entries hold no children.
        const re = /"(\d+)"\s*\{([^{}]*)\}/g;
        let m;
        while ((m = re.exec(text)) !== null) {
            const mins = /"Playtime"\s*"(\d+)"/.exec(m[2]);
            if (!mins) continue;
            const appid = m[1];
            const value = parseInt(mins[1], 10) || 0;
            // Several accounts may have played the same game; keep the
            // largest rather than whichever was read last.
            if (!out[appid] || value > out[appid]) out[appid] = value;
        }
    }

    return out;
}

/**
 * Proton builds available for running Windows games on Linux —
 * both Valve's own and anything dropped into compatibilitytools.d
 * (Proton-GE and friends). The old Architecture_Map claimed this
 * function existed; it did not, so .exe entries fell through to a
 * bare `wine` call with no prefix.
 */
function protonVersions() {
    if (!IS_LINUX) return [];

    const root = steamRoot();
    const dirs = [];
    if (root) dirs.push(path.join(root, 'compatibilitytools.d'));
    dirs.push(path.join(HOME, '.steam', 'root', 'compatibilitytools.d'));
    for (const lib of steamLibraries()) dirs.push(path.join(lib, 'common'));

    const versions = [];
    const seen = new Set();

    for (const dir of dirs) {
        let entries;
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { continue; }

        for (const e of entries) {
            if (!e.isDirectory()) continue;
            if (!/proton/i.test(e.name)) continue;

            const full = path.join(dir, e.name);
            if (seen.has(full)) continue;

            // A usable build has a `proton` runner script at its root.
            const runner = path.join(full, 'proton');
            if (!fs.existsSync(runner)) continue;

            seen.add(full);
            versions.push({ name: e.name, path: full, runner });
        }
    }

    // Newest-looking build first: Experimental, then highest number.
    versions.sort((a, b) => {
        const ax = /experimental/i.test(a.name) ? 1 : 0;
        const bx = /experimental/i.test(b.name) ? 1 : 0;
        if (ax !== bx) return bx - ax;
        return b.name.localeCompare(a.name, undefined, { numeric: true });
    });

    return versions;
}

/**
 * Steam accounts that have signed in on this machine, newest first.
 * Saves asking the user for a 64-bit id they would have to go and
 * look up.
 */
function steamAccounts() {
    const root = steamRoot();
    if (!root) return [];

    const file = path.join(root, 'config', 'loginusers.vdf');
    let text;
    try { text = fs.readFileSync(file, 'utf-8'); } catch (e) { return []; }

    const out = [];
    // Each block starts with the 64-bit id as its key.
    const re = /"(\d{17})"\s*\{([^}]*)\}/g;
    let m;
    while ((m = re.exec(text)) !== null) {
        const body = m[2];
        out.push({
            steamId: m[1],
            accountName: vdfValue(body, 'AccountName') || '',
            personaName: vdfValue(body, 'PersonaName') || '',
            mostRecent: vdfValue(body, 'MostRecent') === '1'
        });
    }

    out.sort((a, b) => (b.mostRecent ? 1 : 0) - (a.mostRecent ? 1 : 0));
    return out;
}

/** Is this command on PATH? */
function commandExists(name) {
    const dirs = (process.env.PATH || '').split(path.delimiter);
    return dirs.some(d => {
        try { return fs.existsSync(path.join(d, name)); } catch (e) { return false; }
    });
}

function wineAvailable() {
    if (!IS_LINUX && !IS_MAC) return false;
    return commandExists('wine');
}

/**
 * Tools that wrap a game rather than replace it — the same ones
 * Steam and Heroic offer. Each is only offered if it is installed.
 */
function wrapperTools() {
    if (!IS_LINUX) return [];
    return [
        { id: 'gamemode', cmd: 'gamemoderun', label: 'GameMode', available: commandExists('gamemoderun') },
        { id: 'mangohud', cmd: 'mangohud', label: 'MangoHud', available: commandExists('mangohud') }
    ];
}

/**
 * Splits a launch-options string into argv, honouring quotes the way
 * a shell would, so `-w 1920 -name "My Save"` survives intact.
 */
function splitArgs(str) {
    if (!str) return [];
    const out = [];
    const re = /"([^"]*)"|'([^']*)'|(\S+)/g;
    let m;
    while ((m = re.exec(str)) !== null) out.push(m[1] ?? m[2] ?? m[3]);
    return out;
}

/** `KEY=VALUE` per line, blank lines and `#` comments ignored. */
function parseEnv(text) {
    const env = {};
    if (!text) return env;
    for (const raw of text.replace(/\\n/g, '\n').split('\n')) {
        const line = raw.trim();
        if (!line || line.startsWith('#')) continue;
        const i = line.indexOf('=');
        if (i < 1) continue;
        env[line.slice(0, i).trim()] = line.slice(i + 1).trim();
    }
    return env;
}


/* --------------------------------------------------------------
   EXECUTABLES
   -------------------------------------------------------------- */

// Installers, crash handlers and redistributables live next to the
// real binary and would otherwise win on sort order.
const JUNK = /(unins|uninstall|setup|installer|vcredist|dxsetup|dotnet|directx|crashhandler|crashreport|launcher_helper|touchup|oalinst|steamerror)/i;

// Shared libraries are ELF images too, so the magic-number test alone
// happily picks `bin/client.so` as a game's entry point. Rule them out
// by extension before it gets that far.
const NOT_A_PROGRAM = /\.(so|dylib|dll|a|o|lib|node)(\.\d+)*$/i;

/**
 * Steam depots ship a lot of data files with the execute bit set —
 * Half-Life 2's `bin/halflife2.fgd` is one, and it beat the real
 * binary on name alone. So on Unix the execute bit only gets a file
 * considered; what settles it is whether the bytes are actually an
 * ELF image or a script with a shebang.
 */
function looksRunnable(full) {
    let fd;
    try {
        fd = fs.openSync(full, 'r');
        const buf = Buffer.alloc(4);
        const read = fs.readSync(fd, buf, 0, 4, 0);
        if (read < 2) return false;
        if (buf[0] === 0x7f && buf[1] === 0x45 && buf[2] === 0x4c && buf[3] === 0x46) return true; // ELF
        if (buf[0] === 0x23 && buf[1] === 0x21) return true;                                       // #!
        return false;
    } catch (e) {
        return false;
    } finally {
        if (fd !== undefined) { try { fs.closeSync(fd); } catch (e) { /* ignore */ } }
    }
}

function isExecutableFile(full) {
    if (NOT_A_PROGRAM.test(full)) return false;
    try {
        const st = fs.statSync(full);
        if (!st.isFile()) return false;
        if (IS_WINDOWS) return /\.(exe|bat|cmd)$/i.test(full);

        // A Windows binary on Linux is still a candidate — Proton or
        // Wine will run it. It just will not carry a Unix execute bit.
        if (/\.(exe|bat|cmd)$/i.test(full)) return true;

        if ((st.mode & 0o111) === 0) return false;
        return looksRunnable(full);
    } catch (e) {
        return false;
    }
}

/**
 * Turn whatever the library stored into something that can actually
 * be run. Steam imports record the game's *folder*, and handing a
 * folder to spawn fails with "Is a directory" — which is why none
 * of the imported games would start.
 *
 * @returns {string|null} a path to an executable, or null
 */
function resolveExecutable(target, hintName) {
    if (!target) return null;

    let st;
    try { st = fs.statSync(target); } catch (e) { return null; }

    if (st.isFile()) return target;
    if (!st.isDirectory()) return null;

    const candidates = [];

    // Two levels is enough for the usual `Game/bin/game.exe` shape
    // without turning into a full filesystem walk.
    const walk = (dir, depth) => {
        let entries;
        try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch (e) { return; }

        for (const e of entries) {
            const full = path.join(dir, e.name);
            if (e.isDirectory()) {
                if (depth > 0 && !/^(redist|_CommonRedist|support|dotnet)/i.test(e.name)) {
                    walk(full, depth - 1);
                }
                continue;
            }
            if (JUNK.test(e.name)) continue;
            if (!isExecutableFile(full)) continue;
            candidates.push(full);
        }
    };
    walk(target, 2);

    if (candidates.length === 0) return null;

    const folder = path.basename(target).toLowerCase();
    const hint = (hintName || '').toLowerCase();
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9]/g, '');

    const score = (full) => {
        const base = path.basename(full, path.extname(full));
        let s = 0;
        if (norm(base) === norm(folder)) s += 100;
        if (hint && norm(base) === norm(hint)) s += 90;
        if (hint && norm(base).includes(norm(hint))) s += 30;
        if (norm(folder).includes(norm(base))) s += 20;
        if (IS_LINUX && /\.(x86_64|x86|sh)$/i.test(full)) s += 15;
        // A native build always beats shipping the same game through
        // Proton. Source games carry both hl2.sh and hl2.exe side by
        // side, and without this the Windows one wins on a name tie.
        if (!IS_WINDOWS && /\.exe$/i.test(full)) s -= 40;
        // A game's entry point is almost never a batch file. Source
        // games ship a whole SDK of them in bin/, and Faceposer.bat
        // was outranking hl2.exe.
        if (/\.(bat|cmd)$/i.test(full)) s -= 70;
        // Prefer something shallow — the top-level binary is usually
        // the launcher, and deep ones are usually helpers.
        s -= path.relative(target, full).split(path.sep).length * 5;
        return s;
    };

    candidates.sort((a, b) => score(b) - score(a));
    return candidates[0];
}


/* --------------------------------------------------------------
   LAUNCH PLAN
   -------------------------------------------------------------- */

/**
 * Decide how a given game should be started on this machine.
 *
 * Per-game settings win over the global defaults, and the global
 * defaults win over "whatever looks sensible". That order is what
 * makes the properties screen predictable.
 *
 * @param {Object} game      { Path, SteamAppId, Name, CompatTool,
 *                             LaunchOptions, WinePrefix, EnvVars,
 *                             UseGameMode, UseMangoHud }
 * @param {Object} settings  global defaults from app_settings.json
 * @returns {Object} plan
 *   kind     'uri' | 'native' | 'proton' | 'wine' | 'none'
 *   tracked  whether we get a real child process to watch
 *   reason   why it cannot run, when kind is 'none'
 */
function planLaunch(game, settings) {
    game = game || {};
    settings = settings || {};

    const rawPath = game.Path || '';
    const appId = (game.SteamAppId || '').toString().trim();
    const tool = (game.CompatTool || 'auto').toLowerCase();

    // 1. An explicit URI always wins.
    if (/^[a-z][a-z0-9+.-]*:\/\//i.test(rawPath)) {
        return { kind: 'uri', uri: rawPath, tracked: false };
    }

    // 2. A Steam game with a known appid normally goes through Steam,
    //    which handles Proton, cloud saves, the overlay and any DRM the
    //    game expects. The cost is that Steam raises its own window on
    //    the way, and we get no child process to watch.
    //
    //    `directLaunch` trades that away: we run the game's executable
    //    ourselves, so nothing of Steam's appears. It still works for
    //    most games as long as the Steam client is running in the
    //    background, because that is what the game's own Steam library
    //    talks to. If the executable cannot be resolved we fall back to
    //    the URI rather than failing.
    const steamAllowed = (tool === 'auto' || tool === 'steam');
    const isSteamGame = appId && /^\d+$/.test(appId);
    const steamUri = { kind: 'uri', uri: `steam://rungameid/${appId}`, tracked: false };

    if (isSteamGame && steamAllowed && !settings.directLaunch) {
        return steamUri;
    }

    if (!rawPath) {
        if (isSteamGame && steamAllowed) return steamUri;
        return { kind: 'none', tracked: false, reason: 'NO_PATH' };
    }

    // 3. Otherwise run it ourselves.
    const exe = resolveExecutable(rawPath, game.Name);
    if (!exe) {
        // Direct launch was only a preference, not a demand — if there
        // is nothing to run, Steam still knows how.
        if (isSteamGame && steamAllowed) return steamUri;
        return {
            kind: 'none',
            tracked: false,
            reason: fs.existsSync(rawPath) ? 'NO_EXECUTABLE_FOUND' : 'PATH_MISSING'
        };
    }

    const cwd = path.dirname(exe);
    const isWindowsBinary = /\.(exe|bat|cmd)$/i.test(exe);

    // --- environment ------------------------------------------------
    const env = Object.assign(
        {},
        parseEnv(settings.defaultEnv),
        parseEnv(game.EnvVars)
    );

    // --- launch options, Steam style --------------------------------
    // `mangohud %command% -w 1920` puts everything before %command% in
    // front of the executable and everything after it behind — the same
    // contract Steam and Heroic use, so people can paste what they
    // already have from ProtonDB.
    const options = (game.LaunchOptions || '').trim();
    let preWrap = [];
    let trailingArgs = [];
    if (options.includes('%command%')) {
        const [before, after] = options.split('%command%');
        preWrap = splitArgs(before);
        trailingArgs = splitArgs(after);
    } else {
        trailingArgs = splitArgs(options);
    }

    // --- the runner -------------------------------------------------
    let cmd, args, kind, protonName;

    const pickProton = () => {
        const all = protonVersions();
        if (all.length === 0) return null;
        if (tool !== 'auto' && tool !== 'proton' && tool !== 'steam') {
            const named = all.find(p => p.name.toLowerCase() === tool);
            if (named) return named;
        }
        if (settings.defaultProton) {
            const preferred = all.find(p => p.name === settings.defaultProton);
            if (preferred) return preferred;
        }
        return all[0];
    };

    if (tool === 'native' || (!isWindowsBinary && tool !== 'wine')) {
        kind = 'native';
        cmd = exe;
        args = [];
    } else if (isWindowsBinary && IS_WINDOWS) {
        kind = 'native';
        cmd = exe;
        args = [];
    } else if (tool === 'wine') {
        if (!wineAvailable()) return { kind: 'none', tracked: false, reason: 'NO_WINDOWS_RUNTIME' };
        kind = 'wine';
        cmd = 'wine';
        args = [exe];
    } else {
        const proton = pickProton();
        if (proton) {
            kind = 'proton';
            protonName = proton.name;
            cmd = proton.runner;
            args = ['run', exe];

            // Proton needs somewhere to keep the Windows prefix and
            // needs to know where Steam lives; without both it exits
            // immediately with a compat-path error.
            const prefix = game.WinePrefix || path.join(
                HOME, '.local', 'share', 'parallax-launcher', 'prefixes',
                path.basename(cwd).replace(/[^\w.-]/g, '_')
            );
            env.STEAM_COMPAT_DATA_PATH = prefix;
            env.STEAM_COMPAT_CLIENT_INSTALL_PATH =
                steamRoot() || path.join(HOME, '.steam', 'steam');
        } else if (wineAvailable()) {
            kind = 'wine';
            cmd = 'wine';
            args = [exe];
            if (game.WinePrefix) env.WINEPREFIX = game.WinePrefix;
        } else {
            return { kind: 'none', tracked: false, reason: 'NO_WINDOWS_RUNTIME' };
        }
    }

    args = args.concat(trailingArgs);

    // --- wrappers ---------------------------------------------------
    // Applied outermost-last so the order reads gamemoderun → mangohud
    // → runner → game, which is what both tools expect.
    const wrappers = [];
    const wants = (perGame, global) =>
        perGame === 'on' ? true : perGame === 'off' ? false : !!global;

    for (const w of wrapperTools()) {
        if (!w.available) continue;
        const on = w.id === 'gamemode'
            ? wants(game.UseGameMode, settings.gameMode)
            : wants(game.UseMangoHud, settings.mangoHud);
        if (on) wrappers.push(w.cmd);
    }
    wrappers.push(...preWrap);

    if (wrappers.length > 0) {
        args = wrappers.slice(1).concat([cmd], args);
        cmd = wrappers[0];
    }

    return { kind, cmd, args, cwd, env, tracked: true, protonName, executable: exe };
}


/* --------------------------------------------------------------
   REPORT
   -------------------------------------------------------------- */

/** A snapshot of the machine, for the Settings > System pane. */
function describe() {
    const protons = protonVersions();
    return {
        os: IS_WINDOWS ? 'Windows' : IS_LINUX ? 'Linux' : IS_MAC ? 'macOS' : process.platform,
        platform: process.platform,
        isLinux: IS_LINUX,
        isWindows: IS_WINDOWS,
        isMac: IS_MAC,
        arch: process.arch,
        release: os.release(),
        steamRoot: steamRoot(),
        steamLibraries: steamLibraries(),
        installedSteamApps: installedSteamApps().length,
        proton: protons.map(p => p.name),
        wine: wineAvailable(),
        wrappers: wrapperTools()
    };
}

/* ================================================================
   WATCHING A GAME THAT IS ALREADY RUNNING
   ================================================================
   Holding the child process we spawned is the obvious way to know
   whether a game is still up, and it fails in the two cases that
   matter most.

   A Steam game started through `steam://` gives us no child at all —
   Steam launches it, so there is nothing of ours to watch, and the
   Stop button never appeared. And on Windows a Steam game started
   directly will very often notice it was not launched by Steam and
   relaunch itself through it: our process exits within a second or
   two while the game is only just starting, so the app decided the
   game had already closed.

   Looking for the process by name sidesteps both. It does not matter
   who started it or how many times it restarted itself — if something
   with that name is running, the game is up.
   ================================================================ */

/**
 * Every running process whose executable name matches one of `names`.
 * Names are compared without their extension and case-insensitively,
 * because Windows reports `Game.exe` where the file on disk is
 * `game.exe`.
 *
 * @param {string[]} names  executable base names, e.g. ['hl2.exe']
 * @returns {Promise<Array<{pid:number, name:string}>>}
 */
function findProcesses(names) {
    const want = new Set(
        (names || [])
            .filter(Boolean)
            .map(n => path.basename(String(n)).replace(/\.(exe|bat|cmd|sh)$/i, '').toLowerCase())
    );
    if (!want.size) return Promise.resolve([]);

    // Matches a wanted name where it sits in a command line: at the
    // start, or after a path separator, with or without an extension.
    // Names are escaped before they become a pattern, because a game
    // may legitimately be called `Rock, Paper, Scissors (2+)`.
    const patterns = [...want].map(n =>
        new RegExp('(^|[/\\\\ ])' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') +
            '(\\.(exe|bat|cmd|sh))?($|\\s)', 'i'));

    return new Promise((resolve) => {
        // Read-only listings, run without a shell and parsed rather
        // than matched, so nothing a game is called can be executed.
        //
        // Linux is asked for the full command line, not `comm`: comm is
        // the thread name and is cut at fifteen characters, so `node`
        // came back as `node-MainThread` and a game with a long name
        // came back truncated. The full path is both complete and
        // unambiguous.
        const cmd = IS_WINDOWS
            ? { file: 'tasklist', args: ['/FO', 'CSV', '/NH'] }
            : { file: 'ps', args: ['-eo', 'pid=,args='] };

        execFile(cmd.file, cmd.args, { maxBuffer: 16 * 1024 * 1024 }, (err, stdout) => {
            if (err || !stdout) return resolve([]);
            const found = [];

            for (const line of String(stdout).split(/\r?\n/)) {
                if (!line.trim()) continue;

                let pid, name;
                if (IS_WINDOWS) {
                    // "Image Name","PID","Session Name","Session#","Mem Usage"
                    const m = line.match(/^"([^"]*)","(\d+)"/);
                    if (!m) continue;
                    name = m[1];
                    pid = Number(m[2]);
                    const bare = path.basename(name).replace(/\.(exe|bat|cmd|sh)$/i, '').toLowerCase();
                    if (want.has(bare)) found.push({ pid, name });
                    continue;
                }

                const m = line.trim().match(/^(\d+)\s+(.+)$/);
                if (!m) continue;
                pid = Number(m[1]);
                name = m[2];
                if (patterns.some(re => re.test(name))) found.push({ pid, name });
            }

            resolve(found);
        });
    });
}

/**
 * Ends a process and whatever it started.
 *
 * A game is a tree — launcher, anti-cheat, crash handler — and killing
 * only the one we found leaves the rest behind, sometimes still
 * holding the screen.
 */
function killTree(pid) {
    return new Promise((resolve) => {
        if (!pid) return resolve(false);
        if (IS_WINDOWS) {
            execFile('taskkill', ['/F', '/T', '/PID', String(pid)], () => resolve(true));
            return;
        }
        // Negative pid is the process group, which is how a detached
        // child's helpers are reached. If it was not a group leader
        // that throws, and the process itself is the fallback.
        try { process.kill(-pid, 'SIGKILL'); return resolve(true); } catch (e) { /* not a leader */ }
        try { process.kill(pid, 'SIGKILL'); return resolve(true); } catch (e) { resolve(false); }
    });
}

module.exports = {
    findProcesses,
    killTree,
    IS_WINDOWS,
    wrapperTools,
    commandExists,
    IS_LINUX,
    IS_MAC,
    steamRoot,
    steamAccounts,
    steamLibraries,
    installedSteamApps,
    appInstallState,
    steamPlaytimes,
    protonVersions,
    wineAvailable,
    resolveExecutable,
    planLaunch,
    describe
};
