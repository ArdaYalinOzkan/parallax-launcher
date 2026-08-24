/*
 * Parallax Launcher
 * Copyright (C) 2024-2026 Arda Yalın Özkan
 *
 * Free software under the GNU General Public License version 3, with
 * additional terms under section 7 requiring that the author attribution
 * be preserved and that modified versions be marked as different from
 * the original. See LICENSE and NOTICE in the project root.
 */

const { app, BrowserWindow, ipcMain, dialog, clipboard } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const { execSync, spawn, exec } = require('child_process');
const LibraryManager = require('./LibraryManager');
const Platform = require('./Platform');
const Artwork = require('./Artwork');

/* One Steam Web API key ships with this app; the SteamGridDB one does not.
 *
 * The bundled key is the author's own, included so that importing a
 * Steam library works the moment somebody opens the app, with nothing
 * to sign up for first. It is public — it sits in this file in a public
 * repository — and it is shared by everyone who runs an unmodified copy.
 *
 * Two things follow from that, and they are the reason the setting still
 * exists. Valve counts requests per key, so the bundled one draws on a
 * single 100,000-a-day bucket shared by every user at once; a busy day
 * can exhaust it for everyone. And Valve holds the person the key was
 * issued to responsible for what is done with it. So anyone who imports
 * often, or who would rather not queue behind strangers, should paste
 * their own key into Settings -> API: it takes a minute, it is free, and
 * it is read first wherever it is set.
 *
 * Neither key is needed for most of what the launcher does. Installed
 * games come from Steam's own local manifests and covers come from
 * Steam's public images; neither is authenticated. The Steam key buys
 * one thing — the games you own but have not installed — and the
 * SteamGridDB key, which nobody's copy carries, buys community artwork.
 */

/** The Steam Web API key the author's own account issued, shipped so a
 *  fresh copy can import a library straight away. Shared by everyone who
 *  has not set their own; see the note above. */
const BUNDLED_STEAM_KEY = 'AC78310630F7E9B22D35F24154991ED8';

/** The user's own Steam Web API key if they set one, otherwise the
 *  bundled one. A key typed into settings always wins: it is that
 *  person's own quota rather than the shared bucket. */
function readSteamKey() {
    try {
        if (fs.existsSync(apiKeysPath)) {
            const cfg = JSON.parse(fs.readFileSync(apiKeysPath, 'utf-8'));
            if (cfg.steamKey) return String(cfg.steamKey).trim();
        }
    } catch (e) { /* unreadable file falls through to the bundled key */ }
    return BUNDLED_STEAM_KEY;
}

const userDataPath = app.getPath('userData');
const accountsPath = path.join(userDataPath, 'Parallax_Accounts');

// --- Brand Transformation Migration Logic ---
function performBrandMigration() {
    const appDataRoot = app.getPath('appData');
    // We check for both possible old names (based on productName or name in previous package.json)
    const possibleOldApps = ['paralax-launcher', 'Paralax Launcher'];
    const newAppPath = userDataPath;

    try {
        possibleOldApps.forEach(oldAppName => {
            const oldAppPath = path.join(appDataRoot, oldAppName);
            if (fs.existsSync(oldAppPath) && oldAppPath !== newAppPath) {
                // Check if current accounts exist, if not, migrate from old
                const newAccountsExist = fs.existsSync(accountsPath);

                // Old could have 'Paralax_Accounts' or 'Parallax_Accounts' if partially migrated
                const oldAccountsInnerNames = ['Paralax_Accounts', 'Parallax_Accounts'];

                oldAccountsInnerNames.forEach(oldInner => {
                    const oldInnerPath = path.join(oldAppPath, oldInner);
                    if (fs.existsSync(oldInnerPath)) {
                        // Check if we actually have accounts to migrate
                        const oldFolders = fs.readdirSync(oldInnerPath).filter(f => fs.lstatSync(path.join(oldInnerPath, f)).isDirectory());
                        if (oldFolders.length > 0) {
                            // Only migrate if the target accounts folder is empty
                            const currentAccounts = fs.existsSync(accountsPath) ? fs.readdirSync(accountsPath) : [];
                            if (currentAccounts.length === 0) {
                                console.log(`Migrating data vault from ${oldAppName}/${oldInner}...`);
                                if (!fs.existsSync(accountsPath)) fs.mkdirSync(accountsPath, { recursive: true });
                                copyFolderSync(oldInnerPath, accountsPath);
                                console.log('Data vault migration complete.');
                            }
                        }
                    }
                });
            }
        });

        // 2. Internal Nomenclature Migration (Paralax_Accounts -> Parallax_Accounts)
        // Also handle cases where oldApp was migrated but inner name wasn't
        const legacyInnerPath = path.join(userDataPath, 'Paralax_Accounts');
        if (fs.existsSync(legacyInnerPath) && !fs.existsSync(accountsPath)) {
            fs.renameSync(legacyInnerPath, accountsPath);
            console.log('Synchronized internal account nomenclature to Parallax.');
        }
    } catch (e) {
        console.error('Migration Engine Failure:', e);
    }
}

performBrandMigration();

const assetsDefaultPath = path.join(userDataPath, 'Assets_Default');
const igdbConfigPath = path.join(userDataPath, 'igdb_config.json');
const appSettingsPath = path.join(userDataPath, 'app_settings.json');
const apiKeysPath = path.join(userDataPath, 'api_keys.json');
const steamAppListPath = path.join(userDataPath, 'steam_apps.json');
let cachedSteamApps = [];

function copyFolderSync(from, to) {
    if (!fs.existsSync(from)) return;
    if (!fs.existsSync(to)) fs.mkdirSync(to, { recursive: true });
    fs.readdirSync(from).forEach(element => {
        const fromPath = path.join(from, element);
        const toPath = path.join(to, element);
        if (fs.lstatSync(fromPath).isFile()) {
            fs.copyFileSync(fromPath, toPath);
        } else {
            copyFolderSync(fromPath, toPath);
        }
    });
}

const SquirrelEvents = {
    handle: function () {
        if (process.argv.length === 1) return false;
        const ChildProcess = require('child_process');
        const path = require('path');
        const appFolder = path.resolve(process.execPath, '..');
        const rootAtomFolder = path.resolve(appFolder, '..');
        const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
        const exeName = path.basename(process.execPath);

        const spawn = function (command, args) {
            let spawnedProcess;
            try {
                spawnedProcess = ChildProcess.spawn(command, args, { detached: true });
            } catch (error) { }
            return spawnedProcess;
        };

        const spawnUpdate = function (args) {
            return spawn(updateDotExe, args);
        };

        const squirrelEvent = process.argv[1];
        switch (squirrelEvent) {
            case '--squirrel-install':
            case '--squirrel-updated':
                spawnUpdate(['--createShortcut', exeName]);
                setTimeout(app.quit, 1000);
                return true;
            case '--squirrel-uninstall':
                spawnUpdate(['--removeShortcut', exeName]);
                setTimeout(app.quit, 1000);
                return true;
            case '--squirrel-obsolete':
                app.quit();
                return true;
        }
        return false;
    }
};

if (SquirrelEvents.handle()) {
    // Already handled by Squirrel
}

function ensureAppDataSetup() {
    // 1. Check for legacy folder (master-collection) and migrate
    const oldAppDataDir = path.join(app.getPath('appData'), 'master-collection');
    const newAppDataDir = userDataPath; // This IS app.getPath('userData') which is 'parallax-launcher'

    // Version-specific migration flag (Only for 2.2.0)
    // We check if the migration has already happened by looking for a marker
    const migrationMarker = path.join(userDataPath, '.migrated_2_2_0');

    if (!fs.existsSync(migrationMarker) && fs.existsSync(oldAppDataDir)) {
        console.log("CRITICAL: Legacy AppData (master-collection) found. Starting migration for v2.2.0...");

        try {
            // A. Migrate Accounts
            const oldAccountsPath = path.join(oldAppDataDir, 'Master_Accounts');
            if (fs.existsSync(oldAccountsPath)) {
                copyFolderSync(oldAccountsPath, accountsPath);
                console.log("-> Accounts migrated.");
            }

            // B. Migrate Settings
            const filesToMigrate = ['app_settings.json', 'igdb_config.json'];
            filesToMigrate.forEach(file => {
                const oldFilePath = path.join(oldAppDataDir, file);
                const newFilePath = path.join(userDataPath, file);
                if (fs.existsSync(oldFilePath)) {
                    fs.copyFileSync(oldFilePath, newFilePath);
                    console.log(`-> ${file} migrated.`);
                }
            });

            // C. Create Marker
            fs.writeFileSync(migrationMarker, `Migrated at ${new Date().toISOString()}`);
            console.log("Migration successful.");
        } catch (err) {
            console.error("Migration failed:", err);
        }
    }

    // Standard Setup
    if (!fs.existsSync(accountsPath)) fs.mkdirSync(accountsPath, { recursive: true });

    // Mirror the bundled defaults into the user's folder, copying any
    // file that is not already there. This used to run only when the
    // folder was missing entirely, which meant an existing install
    // never received an asset added in a later version — a new
    // placeholder would resolve to a path with nothing behind it and
    // render as a broken image. Existing files are left alone so a
    // user's own edits survive.
    const internalAssets = path.join(__dirname, 'Assets_Default');
    if (fs.existsSync(internalAssets)) {
        if (!fs.existsSync(assetsDefaultPath)) fs.mkdirSync(assetsDefaultPath, { recursive: true });
        for (const file of fs.readdirSync(internalAssets)) {
            const dest = path.join(assetsDefaultPath, file);
            if (fs.existsSync(dest)) continue;
            try {
                fs.copyFileSync(path.join(internalAssets, file), dest);
            } catch (e) {
                console.error('[Assets] could not copy', file, e.message);
            }
        }
    }
}

ensureAppDataSetup();
// Init Memory Cache
if (fs.existsSync(steamAppListPath)) {
    try { cachedSteamApps = JSON.parse(fs.readFileSync(steamAppListPath, 'utf-8')); } catch (e) { }
}
updateSteamAppList();

function updateSteamAppList() {
    return new Promise((resolve) => {
        console.log("Starting Streaming Update for Steam App List...");
        const url = `https://api.steampowered.com/ISteamApps/GetAppList/v2/?key=${readSteamKey()}`;

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        };

        const file = fs.createWriteStream(steamAppListPath);
        https.get(url, options, (res) => {
            if (res.statusCode !== 200) {
                console.error(`Steam API returned status: ${res.statusCode}`);
                resolve(false);
                return;
            }
            let rawData = '';
            // For JSON, we still need to parse it eventually, but let's stream it to file first
            res.pipe(file);

            file.on('finish', () => {
                file.close();
                console.log("Download complete. Analyzing file...");
                try {
                    // Check if file is valid JSON
                    const content = fs.readFileSync(steamAppListPath, 'utf-8');
                    const json = JSON.parse(content);
                    if (json && json.applist && json.applist.apps) {
                        cachedSteamApps = json.applist.apps;
                        // Overwrite with just the apps array to save space and speed up future loads
                        fs.writeFileSync(steamAppListPath, JSON.stringify(json.applist.apps), 'utf-8');
                        console.log("Steam Database ready. Games: " + cachedSteamApps.length);
                        resolve(true);
                    } else {
                        console.error("Invalid Steam JSON structure.");
                        resolve(false);
                    }
                } catch (e) {
                    console.error("Failed to parse downloaded Steam Database:", e.message);
                    resolve(false);
                }
            });
        }).on('error', (err) => {
            fs.unlink(steamAppListPath, () => { }); // Delete partial file
            console.error("Steam API Connection Error:", err.message);
            resolve(false);
        });
    });
}

let libraryManager = null;
// Parallax Architect: Arda Yalın Özkan

/** The one window, kept so update progress has somewhere to be sent. */
let mainWindow = null;

function createWindow() {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        show: false, // Don't show immediately to prevent white flash
        backgroundColor: '#050505', // Deep matte black
        icon: path.join(__dirname, 'Assets_Default', 'AppLogo.ico'),
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true
        },
        autoHideMenuBar: true,
    });

    mainWindow = win;
    win.on('closed', () => { mainWindow = null; });

    win.loadFile('renderer/index.html');

    win.once('ready-to-show', () => {
        win.maximize(); // Maximize before showing
        win.show();
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

const activeProcesses = new Map();

/* ----------------------------------------------------------------
   Watching a game we did not spawn
   ----------------------------------------------------------------
   Holding the child we started is not enough, and fails in the two
   cases that come up most.

   A Steam game launched through `steam://` gives us no child at all,
   so the Play button never became Stop. And on Windows a Steam game
   launched directly very often notices it was not started by Steam
   and relaunches itself through it — our process is gone within a
   second while the game is only just loading, and the app decided it
   had already closed. Both were reported from a real machine.

   So after every launch the executable is watched for by name. It
   does not matter who started it or how many times it restarted
   itself: if something with that name is running, the game is up.
   ---------------------------------------------------------------- */

const watchers = new Map();

/** How long to wait for a game to appear before giving up on it. */
const APPEAR_TIMEOUT_MS = 3 * 60 * 1000;
const POLL_MS = 2500;

/**
 * What to look for in the process list for a given game. The plan's
 * own executable when we have one, and otherwise whatever the game's
 * folder resolves to — which is how a `steam://` launch, that never
 * resolved anything, still gets a name to watch.
 */
function executableNames(game, resolved) {
    const names = new Set();
    const add = (p) => { if (p) names.add(path.basename(p)); };

    add(resolved);
    if (!resolved && game && game.Path) {
        try { add(Platform.resolveExecutable(game.Path, game.Name)); } catch (e) { /* none */ }
    }
    return [...names];
}

function stopWatching(key) {
    const w = watchers.get(key);
    if (w) {
        clearInterval(w.timer);
        watchers.delete(key);
    }
}

/**
 * @param {string} key      the game's path, as the renderer knows it
 * @param {string[]} names  executables that mean "this game is running"
 * @param {Function} send   how to tell the window
 */
function watchForExit(key, names, send) {
    if (!names.length) return;
    stopWatching(key);

    const started = Date.now();
    const state = { seen: false, checking: false, pids: [] };

    state.timer = setInterval(async () => {
        // Polls overlap on a slow machine; one at a time is plenty.
        if (state.checking) return;
        state.checking = true;
        let running = [];
        try {
            running = await Platform.findProcesses(names);
        } catch (e) { /* a failed listing is not an exit */ }
        state.checking = false;

        if (running.length) {
            state.seen = true;
            state.pids = running.map(p => p.pid);
            return;
        }

        if (state.seen) {
            // It was there and now it is not.
            stopWatching(key);
            activeProcesses.delete(key);
            send({ path: key, status: 'exited', code: 0 });
            return;
        }

        // Never turned up. Steam may have refused, or the game may
        // have failed to start; either way the button should not sit
        // on Stop for ever.
        if (Date.now() - started > APPEAR_TIMEOUT_MS) {
            stopWatching(key);
            activeProcesses.delete(key);
            send({ path: key, status: 'exited', code: 0 });
        }
    }, POLL_MS);

    watchers.set(key, state);
}

// Helper to ensure unique account folder names
function getUniqueAccountName(originalName) {
    let name = originalName;
    let counter = 1;
    while (fs.existsSync(path.join(accountsPath, name))) {
        name = `${originalName} (${counter})`;
        counter++;
    }
    return name;
}

// IPC Handlers
ipcMain.handle('get-library', () => {
    if (!libraryManager) return { profile: null, games: [] };
    return libraryManager.readLibrary();
});

ipcMain.handle('add-game', (event, game) => {
    if (libraryManager) libraryManager.addGame(game);
    return true;
});

ipcMain.handle('update-library', (event, { profile, games }) => {
    if (libraryManager) libraryManager.updateLibrary(profile, games);
    return true;
});

ipcMain.handle('get-accounts', async () => {
    const folders = fs.readdirSync(accountsPath, { withFileTypes: true })
        .filter(dirent => dirent.isDirectory())
        .map(dirent => dirent.name);

    const accounts = [];
    for (const name of folders) {
        const fullPath = path.join(accountsPath, name);
        const lm = new LibraryManager(fullPath);
        const data = lm.readLibrary();
        const profile = data.profile || {};
        // A stored path pointing at a bundled placeholder is not a
        // choice the user made — it is whichever default shipped when
        // the profile was created. Report it as unset so the gateway
        // draws the current one instead of a two-year-old asset.
        const chosen = profile.Avatar || profile.avatar || null;
        const isBundledPlaceholder =
            typeof chosen === 'string' && /Assets_Default[\\/]Placeholder/i.test(chosen);

        accounts.push({
            id: name,
            name: profile.Name || profile.name || name,
            avatar: isBundledPlaceholder ? null : chosen,
            avatarTransform: profile.AvatarTransform || profile.avatarTransform || null,
            path: fullPath
        });
    }
    return accounts;
});

ipcMain.handle('set-account', (event, accountId) => {
    console.log(`Setting account to: ${accountId}`);
    const fullPath = path.join(accountsPath, accountId);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
    }

    // Ensure Vault_Assets exists for this account
    const vaultPath = path.join(fullPath, 'Vault_Assets');
    if (!fs.existsSync(vaultPath)) {
        fs.mkdirSync(vaultPath, { recursive: true });
    }

    libraryManager = new LibraryManager(fullPath);
    return true;
});

ipcMain.handle('select-folder', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory']
    });
    if (result.canceled || result.filePaths.length === 0) return null;
    return result.filePaths[0];
});

ipcMain.handle('import-account', async (event, folderPath) => {
    const originalName = path.basename(folderPath);
    const uniqueName = getUniqueAccountName(originalName);
    const destPath = path.join(accountsPath, uniqueName);

    try {
        fs.cpSync(folderPath, destPath, { recursive: true });
        return { success: true, id: uniqueName };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('rename-account', async (event, { oldId, newId }) => {
    const oldPath = path.join(accountsPath, oldId);
    const newPath = path.join(accountsPath, newId);

    if (fs.existsSync(newPath)) {
        return { success: false, error: 'Account with this name already exists' };
    }

    try {
        fs.renameSync(oldPath, newPath);
        // Re-initialize manager for the new path
        libraryManager = new LibraryManager(newPath);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('check-account-exists', (event, accountId) => {
    return fs.existsSync(path.join(accountsPath, accountId));
});

ipcMain.handle('delete-account', async (event, accountId) => {
    const accountPath = path.join(accountsPath, accountId);
    if (!fs.existsSync(accountPath)) return { success: false, error: 'Account not found.' };

    try {
        const deletedDir = path.join(__dirname, '.deleted_vault');
        if (!fs.existsSync(deletedDir)) fs.mkdirSync(deletedDir, { recursive: true });
        const timestamp = Date.now();
        const destPath = path.join(deletedDir, `${accountId}_${timestamp}`);
        fs.renameSync(accountPath, destPath);

        const folders = fs.readdirSync(deletedDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => ({ path: path.join(deletedDir, d.name), time: fs.statSync(path.join(deletedDir, d.name)).mtimeMs }))
            .sort((a, b) => b.time - a.time);
        if (folders.length > 3) {
            folders.slice(3).forEach(f => fs.rmSync(f.path, { recursive: true, force: true }));
        }

        libraryManager = null;
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('wipe-all-data', async () => {
    try {
        if (fs.existsSync(accountsPath)) fs.rmSync(accountsPath, { recursive: true, force: true });
        const deletedDir = path.join(__dirname, '.deleted_vault');
        if (fs.existsSync(deletedDir)) fs.rmSync(deletedDir, { recursive: true, force: true });
        fs.mkdirSync(accountsPath, { recursive: true });
        libraryManager = null;
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('select-image', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'webp'] }
        ]
    });

    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }
    return result.filePaths[0];
});

ipcMain.handle('select-exe', async () => {
    const result = await dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            { name: 'Executables', extensions: ['exe'] }
        ]
    });

    if (result.canceled || result.filePaths.length === 0) {
        return null;
    }
    return result.filePaths[0];
});

/** Global settings, read fresh so a change applies to the next launch. */
function readAppSettings() {
    try {
        if (fs.existsSync(appSettingsPath)) {
            return JSON.parse(fs.readFileSync(appSettingsPath, 'utf-8'));
        }
    } catch (e) {
        console.error('[Settings] okunamadı:', e.message);
    }
    return {};
}

ipcMain.handle('launch-game', (event, payload) => {
    // Accepts the whole game so the platform layer can see the appid
    // and the name, not just a path. A bare string still works, so
    // older callers keep running.
    const game = (typeof payload === 'string') ? { Path: payload } : (payload || {});

    // Everything the renderer tracks is keyed by the stored path, so
    // that is what has to come back on the status events — not the
    // executable we resolved underneath it.
    const key = game.Path || '';
    if (!key) return { success: false, error: 'No path provided', reason: 'NO_PATH' };

    const plan = Platform.planLaunch(game, readAppSettings());

    if (plan.kind === 'none') {
        console.warn(`[Launch] "${game.Name || key}" başlatılamadı: ${plan.reason}`);
        return { success: false, reason: plan.reason, error: plan.reason };
    }

    // Handed to Steam (or the OS). Steam deals with Proton, cloud
    // saves, the overlay and DRM, and we get no child process back —
    // but the game still turns up in the process list under its own
    // name, so it can be watched for and stopped like any other.
    if (plan.kind === 'uri') {
        const { shell } = require('electron');
        shell.openExternal(plan.uri);
        console.log(`[Launch] "${game.Name || key}" -> ${plan.uri}`);

        const names = executableNames(game);
        if (names.length) {
            activeProcesses.set(key, null);   // running, but nothing of ours to hold
            event.sender.send('game-status', { path: key, status: 'running' });
            watchForExit(key, names, (msg) => event.sender.send('game-status', msg));
            return { success: true, tracked: true, watched: true, via: plan.uri.split(':')[0] };
        }

        // No executable to watch for — an uninstalled game, or one
        // whose folder we have never been told about.
        return { success: true, tracked: false, via: plan.uri.split(':')[0] };
    }

    if (activeProcesses.has(key)) {
        return { success: false, error: 'Game is already running', reason: 'ALREADY_RUNNING' };
    }

    try {
        // Proton refuses to start unless its prefix directory exists.
        if (plan.env && plan.env.STEAM_COMPAT_DATA_PATH) {
            fs.mkdirSync(plan.env.STEAM_COMPAT_DATA_PATH, { recursive: true });
        }

        // No `shell: true` here. With a shell in the way the child we
        // hold is the shell, not the game: it exits immediately, the
        // Play button flips back while the game is still up, and Quit
        // kills the shell instead of the game. detached also makes the
        // child a process-group leader so the whole tree can be
        // signalled later.
        const child = spawn(plan.cmd, plan.args, {
            cwd: plan.cwd,
            detached: true,
            stdio: 'ignore',
            env: Object.assign({}, process.env, plan.env || {})
        });

        activeProcesses.set(key, child);
        console.log(`[Launch] "${game.Name || key}" -> ${plan.kind}` +
            (plan.protonName ? ` (${plan.protonName})` : '') + ` pid ${child.pid}`);

        event.sender.send('game-status', { path: key, status: 'running' });

        child.on('exit', (code) => {
            // Our process ending does not mean the game did. A Steam
            // game started directly will often relaunch itself through
            // Steam, and this fires a second or two in. So the name is
            // watched for instead, and only that decides.
            const names = executableNames(game, plan.executable);
            if (names.length) {
                watchForExit(key, names, (msg) => event.sender.send('game-status', msg));
                return;
            }
            activeProcesses.delete(key);
            event.sender.send('game-status', { path: key, status: 'exited', code });
        });

        child.on('error', (err) => {
            activeProcesses.delete(key);
            event.sender.send('game-status', { path: key, status: 'error', error: err.message });
        });

        child.unref();

        return { success: true, tracked: true, kind: plan.kind, executable: plan.cmd };
    } catch (err) {
        console.error('[Launch] Error launching game:', err);
        return { success: false, error: err.message, reason: 'SPAWN_FAILED' };
    }
});

ipcMain.handle('kill-game', async (event, gamePath, game) => {
    if (!activeProcesses.has(gamePath)) {
        return { success: false, error: 'Game not running' };
    }

    const child = activeProcesses.get(gamePath);
    let killed = false;

    /* Stop means stop, not "ask nicely and wait" — the user chose it
       knowing nothing is saved. A game is also a tree: launcher,
       anti-cheat, crash handler. Killing one of those and leaving the
       rest can leave the screen held by something invisible. */

    // The process we started, when there was one.
    if (child && child.pid) {
        try { await Platform.killTree(child.pid); killed = true; }
        catch (e) { console.error('[Kill] child:', e.message); }
    }

    // And whatever is actually running under that name — which for a
    // Steam launch is the only thing there is, and for a game that
    // relaunched itself is the copy that outlived ours.
    try {
        const names = executableNames(game || {});
        if (names.length) {
            const found = await Platform.findProcesses(names);
            for (const proc of found) {
                await Platform.killTree(proc.pid);
                killed = true;
            }
        }
    } catch (e) {
        console.error('[Kill] by name:', e.message);
    }

    stopWatching(gamePath);
    activeProcesses.delete(gamePath);

    if (!killed) return { success: false, error: 'Nothing to stop' };
    return { success: true };
});

/* --------------------------------------------------------------
   PLATFORM AWARENESS
   -------------------------------------------------------------- */

/**
 * What would happen if this game were started right now, without
 * starting it. The properties screen shows this so the settings are
 * not guesswork — you can see the actual command before committing.
 */
ipcMain.handle('preview-launch', (event, game) => {
    try {
        const plan = Platform.planLaunch(game || {}, readAppSettings());
        return {
            kind: plan.kind,
            reason: plan.reason || null,
            tracked: !!plan.tracked,
            protonName: plan.protonName || null,
            executable: plan.executable || null,
            command: plan.kind === 'uri'
                ? plan.uri
                : [plan.cmd].concat(plan.args || []).join(' '),
            env: plan.env || {}
        };
    } catch (err) {
        return { kind: 'none', reason: 'ERROR', command: '', error: err.message };
    }
});

/**
 * Fills every game that has no artwork from Steam's CDN, linking
 * app ids on the way. Free and unmetered, so an imported library
 * stops being a wall of blank cards.
 */
/** The user's SteamGridDB key, or '' if they have not set one. */
/**
 * The user's own SteamGridDB key, or '' if they have not set one.
 *
 * Unlike the Steam key, none ships. Community artwork is the one thing
 * here that costs somebody else money to serve, and handing every copy
 * of the app the same key would spend one person's quota on everybody.
 */
function readSgdbKey() {
    try {
        if (fs.existsSync(apiKeysPath)) {
            const cfg = JSON.parse(fs.readFileSync(apiKeysPath, 'utf-8'));
            if (cfg.sgdbKey) return String(cfg.sgdbKey).trim();
        }
    } catch (e) { /* fall through */ }
    // Older builds kept it here; keep reading it so nobody has to
    // type their key in again after updating.
    try {
        if (fs.existsSync(igdbConfigPath)) {
            const cfg = JSON.parse(fs.readFileSync(igdbConfigPath, 'utf-8'));
            if (cfg.clientId) return String(cfg.clientId).trim();
        }
    } catch (e) { /* no key set */ }
    return '';
}

/**
 * Hands an install over to Steam.
 *
 * Parallax has no download engine and should not grow one: Steam
 * already knows how to fetch, verify and patch its own games, and it
 * is the only thing allowed to. Handing it a steam:// URI gets the
 * user the outcome they wanted with no credentials involved at all —
 * the same delegation the Play button already uses.
 */
ipcMain.handle('steam-uri', (event, { action, appId }) => {
    const allowed = ['install', 'uninstall', 'store', 'validate'];
    if (!allowed.includes(action)) return { success: false, error: 'BAD_ACTION' };
    if (!/^\d+$/.test(String(appId || ''))) return { success: false, error: 'BAD_APPID' };

    try {
        const { shell } = require('electron');
        shell.openExternal(`steam://${action}/${appId}`);
        return { success: true };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('backfill-artwork', async (event, opts) => {
    if (!libraryManager) return { success: false, error: 'No account loaded' };

    const accountId = (opts && opts.accountId) || '';
    const vaultDir = path.join(accountsPath, accountId, 'Vault_Assets');

    // The signed-in Steam account on this machine, so nobody has to
    // go and look up a 64-bit id.
    let steamId = (opts && opts.steamId) || '';
    if (!steamId) {
        const accounts = Platform.steamAccounts();
        if (accounts.length === 0) return { success: false, error: 'NO_STEAM_ACCOUNT' };
        steamId = accounts[0].steamId;
    }

    try {
        const { profile, games } = libraryManager.readLibrary();

        const result = await Artwork.fillFromSteam({
            games, vaultDir, steamKey: readSteamKey(), steamId,
            sgdbKey: readSgdbKey(),
            onProgress: (p) => {
                if (!event.sender.isDestroyed()) event.sender.send('artwork-progress', p);
            }
        });

        if (result.error) return { success: false, error: result.error };

        libraryManager.updateLibrary(profile, games);
        return { success: true, ...result.stats };
    } catch (err) {
        console.error('[Artwork] failed:', err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle('get-steam-accounts', () => {
    try { return Platform.steamAccounts(); } catch (e) { return []; }
});

ipcMain.handle('get-api-keys', () => {
    // Report only whether a key is present. The renderer never needs
    // the value, and not shipping it across the bridge means it cannot
    // leak into a devtools transcript or an error report.
    return { steam: !!readSteamKey(), sgdb: !!readSgdbKey() };
});

ipcMain.handle('set-api-keys', (event, keys) => {
    try {
        const current = fs.existsSync(apiKeysPath)
            ? JSON.parse(fs.readFileSync(apiKeysPath, 'utf-8')) : {};
        // An empty string clears a key; undefined leaves it alone.
        if (typeof keys.steamKey === 'string') current.steamKey = keys.steamKey.trim();
        if (typeof keys.sgdbKey === 'string') current.sgdbKey = keys.sgdbKey.trim();
        fs.writeFileSync(apiKeysPath, JSON.stringify(current, null, 2), 'utf-8');
        return { success: true, steam: !!current.steamKey, sgdb: !!current.sgdbKey };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

/**
 * Merges Steam's own playtime into the library.
 *
 * The launcher counts time for the games it starts, but anything
 * played straight from Steam is invisible to it. Steam keeps that
 * number locally, so this reconciles the two without an API key —
 * taking whichever is larger, never overwriting a bigger local count
 * with a smaller or missing Steam one.
 */
ipcMain.handle('sync-playtime', () => {
    if (!libraryManager) return { success: false, error: 'No account loaded' };

    try {
        const steam = Platform.steamPlaytimes();
        const { profile, games } = libraryManager.readLibrary();

        let updated = 0;
        let gained = 0;

        for (const game of games) {
            const appid = (game.SteamAppId || '').toString().trim();
            if (!appid || !(appid in steam)) continue;

            const steamHours = steam[appid] / 60;
            const ourHours = parseFloat(game.PlayTime || '0') || 0;

            if (steamHours > ourHours + 0.05) {
                gained += steamHours - ourHours;
                game.PlayTime = steamHours.toFixed(1);
                updated++;
            }
        }

        if (updated > 0) libraryManager.updateLibrary(profile, games);
        return { success: true, updated, gainedHours: Number(gained.toFixed(1)), known: Object.keys(steam).length };
    } catch (err) {
        console.error('[Playtime] sync failed:', err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle('install-state', (event, appId) => {
    try { return Platform.appInstallState(appId); }
    catch (err) { return { found: false, error: err.message }; }
});

ipcMain.handle('get-platform-info', () => {
    try {
        return Platform.describe();
    } catch (err) {
        console.error('[Platform] describe failed:', err);
        return { os: process.platform, error: err.message };
    }
});

/**
 * Reconciles the library against what Steam actually has installed,
 * using Steam's own manifests rather than guessing that a folder is
 * named the same as the store listing. That guess is why 225 games
 * showed as not installed.
 */
ipcMain.handle('scan-installed', () => {
    if (!libraryManager) return { success: false, error: 'No account loaded' };

    const norm = (v) => (v || '').toString().toLowerCase().replace(/[^a-z0-9]/g, '');

    try {
        const steamApps = Platform.installedSteamApps();

        // Names first, folders only as a fallback. Half-Life 2, Lost
        // Coast and both episodes all install into a folder called
        // "Half-Life 2", so letting the folder key overwrite the name
        // key handed the Half-Life 2 entry Episode Two's app id — it
        // would have launched the wrong game.
        const byName = new Map();
        for (const app of steamApps) byName.set(norm(app.name), app);
        for (const app of steamApps) {
            const key = norm(app.installdir);
            if (!byName.has(key)) byName.set(key, app);
        }

        const { profile, games } = libraryManager.readLibrary();
        let matched = 0, linked = 0, dropped = 0;

        for (const game of games) {
            const app = byName.get(norm(game.Name)) || byName.get(norm(game.OriginalName));

            if (app) {
                if (game.SteamAppId !== app.appid) { game.SteamAppId = app.appid; linked++; }
                game.Path = app.path;
                game.Status = 'Installed';
                matched++;
                continue;
            }

            // Only demote entries whose recorded folder is really gone.
            // A game the user pointed at by hand stays exactly as it is.
            if (game.Status === 'Installed' && game.Path && !fs.existsSync(game.Path)) {
                game.Status = 'Uninstalled';
                dropped++;
            }
        }

        libraryManager.updateLibrary(profile, games);
        return { success: true, matched, linked, dropped, steamApps: steamApps.length };
    } catch (err) {
        console.error('[Scan] failed:', err);
        return { success: false, error: err.message };
    }
});

ipcMain.handle('save-to-vault', async (event, { accountId, sourcePath }) => {
    if (!accountId || !sourcePath) return null;
    const accountDir = path.join(accountsPath, accountId);
    const vaultDir = path.join(accountDir, 'Vault_Assets');

    if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir, { recursive: true });

    const fileName = `asset_${Date.now()}_${path.basename(sourcePath)}`;
    const destPath = path.join(vaultDir, fileName);

    try {
        fs.copyFileSync(sourcePath, destPath);
        return `./Vault_Assets/${fileName}`;
    } catch (err) {
        console.error("Save to vault error:", err);
        return null;
    }
});

ipcMain.handle('paste-from-clipboard', async (event, accountId) => {
    if (!accountId) return null;

    const accountDir = path.join(accountsPath, accountId);
    const vaultDir = path.join(accountDir, 'Vault_Assets');
    if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir, { recursive: true });

    // 1. Try to see if it's a raw image (e.g., "Copy Image" from browser)
    const image = clipboard.readImage();
    if (!image.isEmpty()) {
        const fileName = `pasted_${Date.now()}.png`;
        const destPath = path.join(vaultDir, fileName);
        try {
            fs.writeFileSync(destPath, image.toPNG());
            return `./Vault_Assets/${fileName}`;
        } catch (err) {
            console.error("Paste image error:", err);
            return null;
        }
    }

    // 2. Try to see if it's a file path (e.g., "Copy" file from Explorer)
    // On Windows, copying a file often puts the path in the text clipboard too.
    const text = clipboard.readText().trim();
    if (text) {
        // Basic check for local file path
        const isLocalPath = (process.platform === 'win32' && /^[a-zA-Z]:\\/.test(text)) || text.startsWith('/');
        if (isLocalPath && fs.existsSync(text) && fs.lstatSync(text).isFile()) {
            const fileName = `pasted_file_${Date.now()}_${path.basename(text)}`;
            const destPath = path.join(vaultDir, fileName);
            try {
                fs.copyFileSync(text, destPath);
                return `./Vault_Assets/${fileName}`;
            } catch (err) {
                console.error("Paste file error:", err);
                return null;
            }
        }
    }

    return null;
});

ipcMain.handle('cleanup-vault', async (event, { accountId, usedPaths }) => {
    if (!accountId || !usedPaths) return;
    const vaultDir = path.join(accountsPath, accountId, 'Vault_Assets');
    if (!fs.existsSync(vaultDir)) return;

    try {
        const files = fs.readdirSync(vaultDir);
        // Protect ANY file that is mentioned in usedPaths, regardless of path format
        const usedFilenames = usedPaths
            .filter(p => p)
            .map(p => {
                // Handle both unix and windows slashes, get just the filename
                const parts = p.replace(/\\/g, '/').split('/');
                return parts[parts.length - 1];
            });

        files.forEach(file => {
            if (usedFilenames.includes(file)) return;

            const filePath = path.join(vaultDir, file);
            fs.unlinkSync(filePath);
            console.log(`Cleaned up unused asset: ${file}`);
        });
    } catch (err) {
        console.error("Vault cleanup error:", err);
    }
});

ipcMain.handle('get-deleted-accounts', async () => {
    const deletedDir = path.join(__dirname, '.deleted_vault');
    if (!fs.existsSync(deletedDir)) return [];
    try {
        const folders = fs.readdirSync(deletedDir, { withFileTypes: true })
            .filter(d => d.isDirectory())
            .map(d => ({
                id: d.name,
                name: d.name.split('_')[0],
                time: fs.statSync(path.join(deletedDir, d.name)).mtimeMs
            }))
            .sort((a, b) => b.time - a.time);
        return folders;
    } catch (err) {
        return [];
    }
});

ipcMain.handle('restore-account', async (event, folderId) => {
    const deletedDir = path.join(__dirname, '.deleted_vault');
    const sourcePath = path.join(deletedDir, folderId);
    const originalName = folderId.split('_')[0];

    // Ensure name is unique in active accounts
    const uniqueName = getUniqueAccountName(originalName);
    const destPath = path.join(accountsPath, uniqueName);

    try {
        fs.renameSync(sourcePath, destPath);
        return { success: true, name: uniqueName };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('export-account', async (event, accountId) => {
    const result = await dialog.showOpenDialog({
        properties: ['openDirectory', 'createDirectory'],
        title: 'Select Export Destination'
    });

    if (result.canceled || result.filePaths.length === 0) return null;

    const sourcePath = path.join(accountsPath, accountId);
    const destPath = path.join(result.filePaths[0], accountId);

    try {
        if (!fs.existsSync(destPath)) fs.mkdirSync(destPath, { recursive: true });

        // Recursive copy
        const copyDir = (src, dest) => {
            fs.mkdirSync(dest, { recursive: true });
            const entries = fs.readdirSync(src, { withFileTypes: true });
            for (let entry of entries) {
                const srcPath = path.join(src, entry.name);
                const destPath = path.join(dest, entry.name);
                if (entry.isDirectory()) copyDir(srcPath, destPath);
                else fs.copyFileSync(srcPath, destPath);
            }
        };

        copyDir(sourcePath, destPath);
        return { success: true, path: destPath };
    } catch (err) {
        return { success: false, error: err.message };
    }
});

ipcMain.handle('get-user-data-path', () => {
    return userDataPath;
});

ipcMain.handle('get-app-version', () => {
    return app.getVersion();
});


/* ================================================================
   UPDATES
   ================================================================
   The app watches its own GitHub releases and can replace itself.

   How it replaces itself depends on how it was installed, and the
   difference is not cosmetic:

     AppImage — one file, which the updater overwrites with the newer
                one. No password, no package manager.
     .deb     — a real system package, so the new one has to go through
                dpkg, which means asking for an administrator password.
                The prompt comes from the system (pkexec), not from us.
     installer— the Windows and macOS packages, which electron-updater
                drives on its own.
     source   — nothing to replace; the answer is `git pull`.
     other    — installed by something we do not know how to drive
                (a distribution package, a Flatpak); we say so and
                point at the releases page rather than meddle.

   Which of those we are is decided below rather than left to
   electron-updater's own guess. Its guess reads a `package-type` file
   that electron-builder writes into the resources directory, and that
   directory is shared by both Linux targets during a build — so an
   AppImage can end up carrying a file that says "deb". The AppImage
   runtime sets $APPIMAGE, which cannot be wrong, so that is asked
   first.

   Nothing is downloaded without being asked for. A hundred and
   twenty megabytes arriving unannounced on someone's connection is
   not a courtesy, so `autoDownload` is off and the update is fetched
   only after somebody presses the button.
   ================================================================ */

/**
 * How this copy was installed: 'appimage', 'deb', 'installer' (the
 * Windows and macOS packages), 'source', or 'managed' for anything
 * else.
 */
function updateKind() {
    if (!app.isPackaged) return 'source';
    if (process.env.APPIMAGE) return 'appimage';
    if (process.platform !== 'linux') return 'installer';
    try {
        const marker = path.join(process.resourcesPath, 'package-type');
        if (fs.existsSync(marker) && fs.readFileSync(marker, 'utf8').trim() === 'deb') {
            // A .deb can install its own replacement — but not if apt is
            // already watching this package. Whoever added the repository
            // asked their system to keep it current, and two updaters
            // chasing the same package means the same version offered
            // twice and a password prompt nobody expected. Where the
            // repository is configured, apt wins and the app says so.
            if (fs.existsSync('/etc/apt/sources.list.d/parallax.list')) return 'managed';
            return 'deb';
        }
    } catch (_) { /* unreadable resources: treat as managed */ }
    return 'managed';
}

/** Whether this copy is one that can replace itself. */
function canSelfUpdate() {
    const kind = updateKind();
    return kind === 'appimage' || kind === 'deb' || kind === 'installer';
}

/**
 * The updater matching this install, built once.
 *
 * Constructed by hand for the two Linux cases so the choice follows
 * `updateKind()` above instead of the library's file sniffing.
 */
const autoUpdater = (() => {
    const u = require('electron-updater');
    if (process.platform !== 'linux') return u.autoUpdater;
    return updateKind() === 'deb' ? new u.DebUpdater() : new u.AppImageUpdater();
})();

autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = false;
autoUpdater.logger = null;

function sendToWindow(channel, payload) {
    if (mainWindow && !mainWindow.isDestroyed()) {
        mainWindow.webContents.send(channel, payload);
    }
}

autoUpdater.on('download-progress', (p) => {
    sendToWindow('update-progress', {
        percent: Math.round(p.percent || 0),
        transferred: p.transferred,
        total: p.total
    });
});

autoUpdater.on('update-downloaded', (info) => {
    sendToWindow('update-ready', { version: info.version });
});

autoUpdater.on('error', (err) => {
    sendToWindow('update-error', { message: String(err && err.message || err) });
});

/**
 * Asks GitHub whether anything newer exists. Never throws at the
 * caller: a machine that is offline, or a rate limit, is an ordinary
 * thing to run into and not worth an error dialog.
 */
ipcMain.handle('check-for-update', async () => {
    const kind = updateKind();
    const current = app.getVersion();

    if (!canSelfUpdate()) {
        // Still worth looking, so somebody running from source or
        // from a package we cannot drive learns a new version exists
        // — they just have to fetch it themselves.
        try {
            const r = await fetch(
                'https://api.github.com/repos/ArdaYalinOzkan/parallax-launcher/releases/latest',
                { headers: { Accept: 'application/vnd.github+json' } });
            // A 404 from this endpoint means the repository has no
            // releases yet — which is a real answer, not a failure.
            // Reporting it as one would tell somebody the network is
            // broken when in fact there is simply nothing published.
            if (r.status === 404) return { kind, current, checked: true, available: false };
            if (!r.ok) return { kind, current, checked: false, error: 'HTTP ' + r.status };
            const j = await r.json();
            const latest = String(j.tag_name || '').replace(/^v/, '');

            // The size of whichever file suits this install, so the
            // dialog can say what a download would cost before it
            // starts. A copy running from source has no file of its
            // own, and gets none.
            const want = kind === 'deb' ? '.deb' : (kind === 'installer' ? '.exe' : '.appimage');
            const asset = (j.assets || []).find(a =>
                String(a.name || '').toLowerCase().endsWith(want));

            return {
                kind, current, checked: true,
                available: !!latest && latest !== current,
                version: latest,
                size: (asset && asset.size) || 0,
                notes: j.body || '',
                url: j.html_url
            };
        } catch (e) {
            return { kind, current, checked: false, error: String(e.message || e) };
        }
    }

    try {
        const res = await autoUpdater.checkForUpdates();
        const info = res && res.updateInfo;
        const latest = info ? info.version : null;

        // How large it is, so that can be said before anyone commits to
        // fetching it. The updater describes the files it would use;
        // the one meant for this platform is the first of them.
        const file = info && Array.isArray(info.files) ? info.files[0] : null;

        return {
            kind, current, checked: true,
            available: !!latest && latest !== current,
            version: latest,
            size: (file && file.size) || 0,
            notes: (info && info.releaseNotes) || '',
            url: 'https://github.com/ArdaYalinOzkan/parallax-launcher/releases/latest'
        };
    } catch (e) {
        return { kind, current, checked: false, error: String(e.message || e) };
    }
});

/**
 * Opens the releases page in the browser.
 *
 * It takes no argument on purpose. The page could pass the URL it got
 * back from GitHub, but then the renderer would decide what the system
 * browser opens, and a link is not something a page should be trusted
 * to choose. The destination is fixed here instead.
 */
ipcMain.handle('open-release-page', () => {
    const { shell } = require('electron');
    shell.openExternal('https://github.com/ArdaYalinOzkan/parallax-launcher/releases/latest');
    return { success: true };
});

/** Fetches the update. Progress arrives on the `update-progress` channel. */
ipcMain.handle('download-update', async () => {
    if (!canSelfUpdate()) return { success: false, error: 'NOT_SELF_UPDATABLE' };
    try {
        await autoUpdater.downloadUpdate();
        return { success: true };
    } catch (e) {
        return { success: false, error: String(e.message || e) };
    }
});

/**
 * Closes and comes back as the new version. Called only after the
 * download has finished, so the worst case is a restart, not a
 * half-written application.
 */
ipcMain.handle('install-update', () => {
    if (!canSelfUpdate()) return { success: false, error: 'NOT_SELF_UPDATABLE' };
    setImmediate(() => autoUpdater.quitAndInstall(false, true));
    return { success: true };
});

// --- STEAM API HANDLERS ---
// The Steam key is read per call from api_keys.json.

ipcMain.handle('steam-fetch-games', async (event, input) => {
    let steamId = input.trim();

    // 1. Extract from URL if present
    const profileMatch = steamId.match(/steamcommunity\.com\/profiles\/([0-9]+)/);
    const idMatch = steamId.match(/steamcommunity\.com\/id\/([a-zA-Z0-9_-]+)/);

    if (profileMatch) {
        steamId = profileMatch[1];
    } else if (idMatch) {
        steamId = idMatch[1];
    } else {
        // Clean trailing slashes and potential path junk
        steamId = steamId.replace(/\/$/, "").split('/').pop();
    }

    const fetchSteam = (url) => new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { resolve(null); }
            });
        }).on('error', () => resolve(null));
    });

    // 2. Resolve Vanity URL if it's not a numeric ID
    if (!/^\d+$/.test(steamId)) {
        const resolveUrl = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v0001/?key=${readSteamKey()}&vanityurl=${steamId}`;
        const resolveJson = await fetchSteam(resolveUrl);
        if (resolveJson && resolveJson.response && resolveJson.response.success === 1) {
            steamId = resolveJson.response.steamid;
        } else {
            return { success: false, error: 'Could not resolve Steam ID from Name or URL.' };
        }
    }

    // 3. Fetch Games
    const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${readSteamKey()}&steamid=${steamId}&format=json&include_appinfo=1&include_played_free_games=1`;
    const json = await fetchSteam(url);

    if (json && json.response && json.response.games) {
        return { success: true, games: json.response.games };
    } else {
        return { success: false, error: 'No games found or profile is private.' };
    }
});

ipcMain.handle('bulk-add-games', async (event, { profile, games }) => {
    const accountPath = path.join(accountsPath, profile);
    const lib = new LibraryManager(accountPath);
    lib.bulkAddGames(games);
    return true;
});

ipcMain.handle('steam-find-local-paths', async (event, games) => {
    const results = {};
    let commonSteamPath = "";

    if (process.platform === 'win32') {
        commonSteamPath = "C:\\Program Files (x86)\\Steam\\steamapps\\common";
    } else if (process.platform === 'linux') {
        const home = app.getPath('home');
        const possiblePaths = [
            path.join(home, '.local/share/Steam/steamapps/common'),
            path.join(home, '.steam/steam/steamapps/common'),
            path.join(home, '.var/app/com.valvesoftware.Steam/data/Steam/steamapps/common')
        ];

        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                commonSteamPath = p;
                break;
            }
        }
    }

    games.forEach(game => {
        results[game.appid] = "";
        if (fs.existsSync(commonSteamPath)) {
            const gameDir = path.join(commonSteamPath, game.name);
            if (fs.existsSync(gameDir)) {
                results[game.appid] = gameDir;
            }
        }
    });
    return results;
});

ipcMain.handle('search-steam-games', async (event, query) => {
    if (cachedSteamApps.length === 0) {
        if (fs.existsSync(steamAppListPath)) {
            try { cachedSteamApps = JSON.parse(fs.readFileSync(steamAppListPath, 'utf-8')); } catch (e) { }
        }
        if (cachedSteamApps.length === 0) {
            await updateSteamAppList();
        }
    }
    try {
        const apps = cachedSteamApps;
        const lowQuery = query.toLowerCase();

        const fuzzyMatch = (str, pattern) => {
            pattern = pattern.split("").reduce((a, b) => a + ".*" + b);
            return new RegExp(pattern).test(str);
        };

        // Filter and score results
        const matches = apps.filter(app => {
            const lowName = app.name.toLowerCase();
            if (lowName.includes(lowQuery)) return true;
            // Basic fuzzy check for typos
            if (lowQuery.length > 3) {
                return fuzzyMatch(lowName, lowQuery);
            }
            return false;
        });

        // Sort: Exact matches first, then prefix matches, then others
        matches.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            if (nameA === lowQuery) return -1;
            if (nameB === lowQuery) return 1;

            const startA = nameA.startsWith(lowQuery);
            const startB = nameB.startsWith(lowQuery);

            if (startA && !startB) return -1;
            if (!startA && startB) return 1;

            return nameA.localeCompare(nameB);
        });

        return matches.slice(0, 5);
    } catch (e) {
        return [];
    }
});

ipcMain.handle('online-steam-search', async (event, query) => {
    // Steam Store Search API (No key required, highly reliable for names)
    const url = `https://store.steampowered.com/api/storesearch/?term=${encodeURIComponent(query)}&l=english&cc=US`;

    return new Promise((resolve) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json && json.items) {
                        // Map to our app format: { name, appid }
                        const results = json.items.map(item => ({
                            name: item.name,
                            appid: item.id
                        }));
                        resolve(results);
                    } else {
                        resolve([]);
                    }
                } catch (e) {
                    resolve([]);
                }
            });
        }).on('error', (err) => {
            console.error("Online Search Error:", err.message);
            resolve([]);
        });
    });
});
// No bundled SteamGridDB key either — see the note at the top.

// Rate limiting state
let searchHistory = [];

ipcMain.handle('igdb-get-config', () => {
    if (fs.existsSync(igdbConfigPath)) {
        try {
            const config = JSON.parse(fs.readFileSync(igdbConfigPath, 'utf-8'));
            return {
                clientId: config.clientId || '',
                // ClientSecret removed for SteamGridDB
            };
        } catch (e) {
            return { clientId: '' };
        }
    }
    return { clientId: '' };
});

ipcMain.handle('igdb-set-config', (event, config) => {
    fs.writeFileSync(igdbConfigPath, JSON.stringify(config, null, 2), 'utf-8');
    // Reset auth if config changes
    igdbAuth = { accessToken: null, expiresAt: 0 };
    return true;
});

// Token logic removed as SteamGridDB uses static API Key

ipcMain.handle('igdb-search', async (event, { query, target, specialCode }) => {
    /* The 30-searches-a-minute cap that used to sit here existed to
       protect a bundled API key from the people using it. There is no
       bundled key any more: every request below is spent against the
       key its own user pasted in, so rationing it would only be
       throttling someone on their own behalf. The magic bypass string
       went with it — a backdoor written into shipped source was never
       a secret from anyone who opened the file. */


    const apiKey = readSgdbKey();
    if (!apiKey) return { error: 'NO_API_KEY' };

    try {
        const fetchOptions = {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        };

        // Step 1: Search for game
        const searchRes = await fetch(`https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(query)}`, fetchOptions);

        if (!searchRes.ok) {
            return { error: 'API_ERROR', status: searchRes.status };
        }

        const contentType = searchRes.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
            const text = await searchRes.text();
            console.error("SGDB Non-JSON Search Response:", text.substring(0, 100));
            return { error: 'NON_JSON_RESPONSE' };
        }

        const searchData = await searchRes.json();

        if (!searchData.success) {
            return { error: 'API_KEY_INVALID', message: searchData.errors ? searchData.errors[0] : 'Unknown API Error' };
        }

        if (searchData.data.length === 0) return [];

        // Sort by popularity or just take first
        const game = searchData.data[0];
        const gameId = game.id;

        // Step 2: Fetch assets based on target
        // 'cover' -> grids (usually vertical)
        // 'banner' or 'profile-banner' -> heroes (wide)
        const isWide = target === 'banner' || target === 'profile-banner';
        const endpoint = isWide ? 'heroes' : 'grids';

        const assetsRes = await fetch(`https://www.steamgriddb.com/api/v2/${endpoint}/game/${gameId}`, fetchOptions);

        if (!assetsRes.ok) {
            return { error: 'API_ERROR', status: assetsRes.status };
        }

        const assetsContentType = assetsRes.headers.get('content-type');
        if (!assetsContentType || !assetsContentType.includes('application/json')) {
            return { error: 'NON_JSON_RESPONSE' };
        }

        const assetsData = await assetsRes.json();

        if (!assetsData.success) return [];

        return assetsData.data.map(asset => ({
            id: asset.id,
            name: game.name,
            thumb: asset.thumb,
            highRes: asset.url
        }));

    } catch (e) {
        console.error("SteamGridDB Search Error:", e);
        return { error: 'FETCH_ERROR', message: e.message };
    }
});

ipcMain.handle('igdb-name-search', async (event, query) => {
    const apiKey = readSgdbKey();
    if (!apiKey) return { error: 'NO_API_KEY' };

    try {
        const fetchOptions = {
            headers: { 'Authorization': `Bearer ${apiKey}` }
        };
        const searchRes = await fetch(`https://www.steamgriddb.com/api/v2/search/autocomplete/${encodeURIComponent(query)}`, fetchOptions);
        if (!searchRes.ok) return [];
        const searchData = await searchRes.json();
        if (!searchData.success) return [];

        return searchData.data.map(game => ({
            name: game.name,
            id: game.id,
            isGlobal: true
        }));
    } catch (e) {
        return [];
    }
});


// Download helper to fetch image and save to vault
ipcMain.handle('igdb-download-asset', async (event, { accountId, imageUrl }) => {
    if (!accountId || !imageUrl) return null;

    // Convert to high-res, with fallbacks (IGDB Specific replacement)
    let urlsToTry = [];
    if (imageUrl.includes('t_thumb')) {
        urlsToTry.push(imageUrl.replace('t_thumb', 't_720p'));
        urlsToTry.push(imageUrl.replace('t_thumb', 't_cover_big'));
    }
    urlsToTry.push(imageUrl); // Original/SGDB as fallback

    urlsToTry = urlsToTry.map(u => u.startsWith('http') ? u : 'https:' + u);

    for (let url of urlsToTry) {
        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await fetch(url, { signal: controller.signal });
            clearTimeout(timeoutId);

            if (response.ok) {
                const buffer = Buffer.from(await response.arrayBuffer());
                const accountDir = path.join(accountsPath, accountId);
                const vaultDir = path.join(accountDir, 'Vault_Assets');
                if (!fs.existsSync(vaultDir)) fs.mkdirSync(vaultDir, { recursive: true });

                const ext = url.split('.').pop().split('?')[0] || 'png';
                const fileName = `igdb_${Date.now()}.${ext}`;
                const destPath = path.join(vaultDir, fileName);

                fs.writeFileSync(destPath, buffer);
                return `./Vault_Assets/${fileName}`;
            }
        } catch (e) {
            console.error(`Failed to download from ${url}:`, e);
        }
    }

    return null;
});

// App Settings Handlers
ipcMain.handle('app-get-settings', () => {
    if (fs.existsSync(appSettingsPath)) {
        try {
            return JSON.parse(fs.readFileSync(appSettingsPath, 'utf-8'));
        } catch (e) {
            return { language: 'en' };
        }
    }
    return { language: 'en' };
});

ipcMain.handle('app-set-settings', (event, settings) => {
    try {
        fs.writeFileSync(appSettingsPath, JSON.stringify(settings, null, 2), 'utf-8');
        return true;
    } catch (e) {
        return false;
    }
});

