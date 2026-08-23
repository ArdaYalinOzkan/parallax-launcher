const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
    getLibrary: () => ipcRenderer.invoke('get-library'),
    addGame: (game) => ipcRenderer.invoke('add-game', game),
    updateLibrary: (data) => ipcRenderer.invoke('update-library', data),
    // Pass the whole game: the platform layer needs the Steam appid
    // and the name to decide how to start it, not just a path.
    launchGame: (game) => ipcRenderer.invoke('launch-game', game),

    // What OS we are on, where Steam is, which Proton builds exist.
    getPlatformInfo: () => ipcRenderer.invoke('get-platform-info'),
    scanInstalled: () => ipcRenderer.invoke('scan-installed'),
    previewLaunch: (game) => ipcRenderer.invoke('preview-launch', game),
    backfillArtwork: (opts) => ipcRenderer.invoke('backfill-artwork', opts),
    steamUri: (action, appId) => ipcRenderer.invoke('steam-uri', { action, appId }),
    installState: (appId) => ipcRenderer.invoke('install-state', appId),
    syncPlaytime: () => ipcRenderer.invoke('sync-playtime'),
    getApiKeys: () => ipcRenderer.invoke('get-api-keys'),
    setApiKeys: (keys) => ipcRenderer.invoke('set-api-keys', keys),
    getSteamAccounts: () => ipcRenderer.invoke('get-steam-accounts'),
    onArtworkProgress: (cb) => ipcRenderer.on('artwork-progress', (e, d) => cb(d)),
    killGame: (gamePath) => ipcRenderer.invoke('kill-game', gamePath),
    selectExe: () => ipcRenderer.invoke('select-exe'),
    selectImage: () => ipcRenderer.invoke('select-image'),
    onGameStatus: (callback) => ipcRenderer.on('game-status', (event, data) => callback(data)),

    // Account Management
    getAccounts: () => ipcRenderer.invoke('get-accounts'),
    setAccount: (accountId) => ipcRenderer.invoke('set-account', accountId),
    selectFolder: () => ipcRenderer.invoke('select-folder'),
    importAccount: (folderPath) => ipcRenderer.invoke('import-account', folderPath),
    renameAccount: (oldId, newId) => ipcRenderer.invoke('rename-account', { oldId, newId }),
    checkAccountExists: (accountId) => ipcRenderer.invoke('check-account-exists', accountId),
    deleteAccount: (accountId) => ipcRenderer.invoke('delete-account', accountId),

    // Vault Asset Management
    saveToVault: (accountId, sourcePath) => ipcRenderer.invoke('save-to-vault', { accountId, sourcePath }),
    pasteFromClipboard: (accountId) => ipcRenderer.invoke('paste-from-clipboard', accountId),
    cleanupVault: (accountId, usedPaths) => ipcRenderer.invoke('cleanup-vault', { accountId, usedPaths }),

    // Recovery & Export
    getDeletedAccounts: () => ipcRenderer.invoke('get-deleted-accounts'),
    restoreAccount: (folderId) => ipcRenderer.invoke('restore-account', folderId),
    exportAccount: (accountId) => ipcRenderer.invoke('export-account', accountId),
    getUserDataPath: () => ipcRenderer.invoke('get-user-data-path'),
    getAppVersion: () => ipcRenderer.invoke('get-app-version'),

    // App Settings
    appGetSettings: () => ipcRenderer.invoke('app-get-settings'),
    appSetSettings: (settings) => ipcRenderer.invoke('app-set-settings', settings),

    // IGDB API
    igdbGetConfig: () => ipcRenderer.invoke('igdb-get-config'),
    igdbSetConfig: (config) => ipcRenderer.invoke('igdb-set-config', config),
    igdbSearch: (query) => ipcRenderer.invoke('igdb-search', query),
    igdbNameSearch: (query) => ipcRenderer.invoke('igdb-name-search', query),
    igdbDownloadAsset: (accountId, imageUrl) => ipcRenderer.invoke('igdb-download-asset', { accountId, imageUrl }),

    // Steam API
    steamFetchGames: (steamId) => ipcRenderer.invoke('steam-fetch-games', steamId),
    steamFindLocalPaths: (games) => ipcRenderer.invoke('steam-find-local-paths', games),
    bulkAddGames: (data) => ipcRenderer.invoke('bulk-add-games', data),
    searchSteamGames: (query) => ipcRenderer.invoke('search-steam-games', query),
    onlineSteamSearch: (query) => ipcRenderer.invoke('online-steam-search', query),

    // Wipe
    wipeAllData: () => ipcRenderer.invoke('wipe-all-data')
});
