// Author & Digital Architect: Arda Yalın Özkan

// ================================================================
// TRANSLATIONS
// ================================================================
/* Translations live in translations.js, loaded before this file. */

// ================================================================
// APP STATE & CONSTANTS
// ================================================================
let currentLanguage = 'en';

/* The application's version, read from package.json by way of the main
 * process. It is written down in exactly one place — package.json —
 * and every text that mentions it carries a {version} placeholder that
 * is filled in when the text is drawn. Releasing a new version is then
 * a single edit rather than nine, and no language can be left behind.
 *
 * Empty until start-up has asked for it; translateApp() is called
 * again right afterwards, so nothing is ever drawn without it. */
let appVersion = '';

let appSettings = {
    language: 'en',
    showNotInstalledLabel: false,
    showPlaytimeOnCard: true,
    ambientRgb: '60, 110, 180',
    // How the shelf is ordered. Unlike the two filters beside it, this
    // is a lasting preference rather than a way of looking at the
    // library for a moment, so it survives closing the app.
    sortBy: 'none',
    uiSounds: false,
    uiVolume: 100,
    autoCheckUpdates: true,
    lastUpdateCheck: 0
};

// ================================================================
// THEME & TRANSLATIONS
// ================================================================
function applyTheme() {
    if (!appSettings.ambientRgb) appSettings.ambientRgb = '60, 110, 180';
    document.documentElement.style.setProperty('--ambient-rgb', appSettings.ambientRgb);

    // Update swatches in UI
    const swatches = document.querySelectorAll('.theme-swatch');
    swatches.forEach(s => {
        if (s.dataset.rgb === appSettings.ambientRgb) s.classList.add('active');
        else s.classList.remove('active');
    });
}

function translateApp() {
    const lang = translations[currentLanguage];

    // Tell the document which language it is now in. Nothing in the
    // logic reads this, but the stylesheet does: Chinese and Korean
    // share most of their code points with Japanese while drawing
    // several of them differently, and without a language to go on the
    // font system picks one CJK face for all of them and gets some
    // characters visibly wrong.
    document.documentElement.lang = currentLanguage;

    // A few strings are drawn with a leading glyph that is part of the
    // design rather than the sentence, so it is kept outside the
    // translation and re-attached here.
    const GLYPH = { ADD_GAME: '+', BACK_TO_COLLECTION: '\u2190', EDIT: '\u270E' };

    // Two strings highlight one word inside themselves. The word being
    // highlighted is itself translated, which is why this cannot be
    // baked into the string.
    const EMPHASISE = {
        DELETE_CONFIRM_MSG: [() => lang.DELETE_WORD,
            w => `<strong style="color:#fff;">${w}</strong>`],
        DELETE_TO_CONFIRM: [() => lang.DELETE_WORD,
            w => `<span style="color:#fff; border-bottom:2px solid #ff2828;">${w}</span>`],
        WIPE_TO_EXECUTE: [() => lang.WIPE_WORD,
            w => `<span style="color:#fff; border-bottom:2px solid #ff2828;">${w}</span>`]
    };

    /* Placeholders are filled at the moment a string is drawn rather
     * than by rewriting the dictionary, so the dictionary stays exactly
     * as it was written and a value arriving late simply appears the
     * next time anything is translated. */
    const fill = (text) => String(text).replace(/\{version\}/g, appVersion);

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const raw = lang[key];
        if (raw === undefined) return;
        const value = fill(raw);

        if (EMPHASISE[key]) {
            const [word, wrap] = EMPHASISE[key];
            const w = word();
            el.innerHTML = w ? value.replace(w, wrap(w)) : value;
            return;
        }

        if (GLYPH[key]) {
            // Strip any glyph the translation already carries so it is
            // never doubled, then put ours back.
            el.textContent = `${GLYPH[key]} ${value.replace(/^[+\u2190\u270E]\s*/, '')}`;
            return;
        }

        // Some strings are written with markup — a <code> sample, a
        // <br> between paragraphs. Detecting it beats keeping a list
        // that has to be edited every time a string gains a tag.
        // These come from the bundled dictionary, never from input.
        if (/<[a-z][\s\S]*>/i.test(value)) el.innerHTML = value;
        else el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (lang[key] !== undefined) el.placeholder = lang[key];
    });

    document.querySelectorAll('[data-i18n-title]').forEach(el => {
        const key = el.getAttribute('data-i18n-title');
        if (lang[key] !== undefined) el.title = lang[key];
    });
}
// ================================================================
// DOM REFERENCES
// ================================================================
const gatewayScreen = document.getElementById('gateway');
const accountList = document.getElementById('accountList');
const addAccountBtn = document.getElementById('addAccountBtn');
const addAccountModal = document.getElementById('addAccountModal');
const createNewAccountBtn = document.getElementById('createNewAccountBtn');
const importAccountBtn = document.getElementById('importAccountBtn');
const cancelAddAccountBtn = document.getElementById('cancelAddAccountBtn');

const libraryScreen = document.getElementById('library');
const gameDetailsScreen = document.getElementById('gameDetails');
const gameGrid = document.getElementById('gameGrid');
const addGameBtn = document.getElementById('addGameBtn');
const searchInput = document.getElementById('searchInput');
const platformFilter = document.getElementById('platformFilter');
const statusFilter = document.getElementById('statusFilter');
const sortFilter = document.getElementById('sortFilter');

// backToLibraryBtn removed as it was missing an ID in HTML
const editGameBtn = document.getElementById('editGame');
const detailsTitle = document.getElementById('detailsTitle');
const detailsBanner = document.getElementById('detailsBanner');
const detailsBannerImg = document.getElementById('detailsBannerImg');
const detailsNotes = document.getElementById('detailsNotes');
const detailsPlayTime = document.getElementById('detailsPlayTime');
const detailsPlatform = document.getElementById('detailsPlatform');
const detailsStatus = document.getElementById('detailsStatus');
const platformSelect = document.getElementById('platformSelect');
const playBtn = document.getElementById('playBtn');

// Adjuster Elements
const assetAdjuster = document.getElementById('assetAdjuster');
const adjusterTitle = document.getElementById('adjusterTitle');
const adjustImage = document.getElementById('adjustImage');
const adjustSlider = document.getElementById('adjustSlider');
const saveAdjust = document.getElementById('saveAdjust');
const cancelAdjust = document.getElementById('cancelAdjust');
const cropArea = document.getElementById('cropArea');

const assetEditMode = document.getElementById('assetEditMode');
const editCoverBtn = document.getElementById('editCoverBtn');
const editBannerBtn = document.getElementById('editBannerBtn');
const previewCover = document.getElementById('previewCover');
const previewBanner = document.getElementById('previewBanner');
const browseBtn = document.getElementById('browseBtn');
const clearPathBtn = document.getElementById('clearPathBtn');
const locationPath = document.getElementById('locationPath');
const dangerZone = document.getElementById('dangerZone');
const deleteGameBtn = document.getElementById('deleteGameBtn');

// Cleanup button removed as it is now automatic
// const cleanupVaultBtn = document.getElementById('cleanupVaultBtn');

// Profile Elements
const profileDetailsScreen = document.getElementById('profileDetails');
const profileDisplayName = document.getElementById('profileDisplayName');
const headerProfile = document.getElementById('headerProfile');
const headerUserName = document.getElementById('headerUserName');
const headerAvatar = document.getElementById('headerAvatar');
const profileAvatarImg = document.getElementById('profileAvatarImg');
const previewProfilePhoto = document.getElementById('previewProfilePhoto');
const profileBannerImg = document.getElementById('profileBannerImg');
const previewProfileBanner = document.getElementById('previewProfileBanner');
const profileBanner = document.getElementById('profileBanner');
const profileAbout = document.getElementById('profileAbout');
const profileBadge = document.getElementById('profileBadge');

// Settings Elements
const settingsUsernameInput = document.getElementById('settingsUsernameInput');
const settingsBioInput = document.getElementById('settingsBioInput');
const saveProfileSettingsBtn = document.getElementById('saveProfileSettingsBtn');
const openMainSettingsBtn = document.getElementById('openMainSettingsBtn');
const mainSettingsModal = document.getElementById('mainSettingsModal');
const closeMainSettingsModalBtn = document.getElementById('closeMainSettingsModalBtn');
const settingsTabs = document.querySelectorAll('.settings-tab');
const settingsPanes = document.querySelectorAll('.settings-pane');
const profileAssetEditMode = document.getElementById('profileAssetEditMode');
const editProfileBtn = document.getElementById('editProfile');
const editProfilePhotoBtn = document.getElementById('editProfilePhotoBtn');
const editProfileBannerBtn = document.getElementById('editProfileBannerBtn');

// Paste Buttons
const pasteCoverBtn = document.getElementById('pasteCoverBtn');
const pasteBannerBtn = document.getElementById('pasteBannerBtn');
const pasteProfilePhotoBtn = document.getElementById('pasteProfilePhotoBtn');
const pasteProfileBannerBtn = document.getElementById('pasteProfileBannerBtn');

// Account Creation UI references
const addAccountSelection = document.getElementById('addAccountSelection');
const accountCreationForm = document.getElementById('accountCreationForm');
const newAccountNameInput = document.getElementById('newAccountNameInput');
const confirmAccountCreationBtn = document.getElementById('confirmAccountCreationBtn');
const backToSelectionBtn = document.getElementById('backToSelectionBtn');
const recoveryBtn = document.getElementById('recoveryBtn');
const accountRecoveryForm = document.getElementById('accountRecoveryForm');
const recoveryList = document.getElementById('recoveryList');
const backToSelectionFromRecoveryBtn = document.getElementById('backToSelectionFromRecoveryBtn');
const backToLibraryBtns = document.querySelectorAll('.back-to-library');
const navLibraryBtn = document.getElementById('navLibraryBtn');
const navSocialBtn = document.getElementById('navSocialBtn');
const libraryMainView = document.getElementById('libraryMainView');
const socialMainView = document.getElementById('socialMainView');

// Account Deletion references
const profileDangerZone = document.getElementById('profileDangerZone');
const deleteAccountInitBtn = document.getElementById('deleteAccountInitBtn');
const deleteAccountModal = document.getElementById('deleteAccountModal');
const deleteConfirmInput = document.getElementById('deleteConfirmInput');
const confirmAccountDeleteFinalBtn = document.getElementById('confirmAccountDeleteFinalBtn');
const cancelAccountDeleteBtn = document.getElementById('cancelAccountDeleteBtn');
const exportAccountBtn = document.getElementById('exportAccountBtn');

// IGDB Elements
const igdbSearchModal = document.getElementById('igdbSearchModal');
const igdbSearchInput = document.getElementById('igdbSearchInput');
const igdbSearchBtn = document.getElementById('igdbSearchBtn');
const igdbResultsGrid = document.getElementById('igdbResultsGrid');
const closeIgdbSearchBtn = document.getElementById('closeIgdbSearchBtn');
const openIgdbConfigBtn = document.getElementById('openIgdbConfigBtn');
const igdbConfigModal = document.getElementById('igdbConfigModal');
const igdbClientId = document.getElementById('igdbClientId');
const igdbClientSecret = document.getElementById('igdbClientSecret');
const saveIgdbConfigBtn = document.getElementById('saveIgdbConfigBtn');
const cancelIgdbConfigBtn = document.getElementById('cancelIgdbConfigBtn');
const appLanguageSelect = document.getElementById('appLanguageSelect');

const importSteamBtn = document.getElementById('importSteamBtn');
const steamImportModal = document.getElementById('steamImportModal');
const steamIdInput = document.getElementById('steamIdInput');
const confirmSteamImportBtn = document.getElementById('confirmSteamImportBtn');
const cancelSteamImportBtn = document.getElementById('cancelSteamImportBtn');

// Steam Profile & Preview Elements
const importSteamProfileBtn = document.getElementById('importSteamProfileBtn');
const steamPreviewModal = document.getElementById('steamPreviewModal');
const steamPreviewList = document.getElementById('steamPreviewList');
const confirmSteamPreviewBtn = document.getElementById('confirmSteamPreviewBtn');
const cancelSteamPreviewBtn = document.getElementById('cancelSteamPreviewBtn');

let pendingSteamGames = []; // List of games fetched but not yet confirmed

const findCoverBtn = document.getElementById('findCoverBtn');
const findBannerBtn = document.getElementById('findBannerBtn');
const findCoverBtnAsset = document.getElementById('findCoverBtnAsset');
const findBannerBtnAsset = document.getElementById('findBannerBtnAsset');
const findProfilePhotoBtn = document.getElementById('findProfilePhotoBtn');
const findProfileBannerBtn = document.getElementById('findProfileBannerBtn');

// Error Modal
const errorModal = document.getElementById('errorModal');
const errorMessage = document.getElementById('errorMessage');
const closeErrorBtn = document.getElementById('closeErrorBtn');

// Success Modal
const successModal = document.getElementById('successModal');
const successMessage = document.getElementById('successMessage');
const closeSuccessBtn = document.getElementById('closeSuccessBtn');

// Add Game UI references
const addGameModal = document.getElementById('addGameModal');
const gameSearchInput = document.getElementById('gameSearchInput');
const gameSuggestions = document.getElementById('gameSuggestions');
const triggerSearchBtn = document.getElementById('triggerSearchBtn');
const addManualGameBtn = document.getElementById('addManualGameBtn');
const cancelAddGameBtn = document.getElementById('cancelAddGameBtn');
let selectedSteamApp = null;

// ================================================================
// GLOBAL STATE
// ================================================================
let runningGames = new Set();
let isEditMode = false;
let isProfileEditMode = false;
let currentLibrary = [];
let currentAccountId = '';
let pendingAssetFetches = new Set();
// Vector placeholders, so an empty slot looks designed rather than
// broken and stays crisp at any card size. The old PNGs are still in
// Assets_Default if these ever need to be reverted.
const PLACEHOLDER_COVER = '../Assets_Default/PlaceholderCover.svg';
const PLACEHOLDER_BANNER = '../Assets_Default/PlaceholderBanner.svg';
const PLACEHOLDER_PROFILE = '../Assets_Default/PlaceholderProfile.svg';
const SPECIAL_CODE = "542897352987643597684367583465784328754623568723652345624395432657842";


let userProfile = {
    name: "Arda",
    avatar: PLACEHOLDER_PROFILE,
    avatarTransform: { x: 0, y: 0, s: 1 },
    banner: PLACEHOLDER_BANNER,
    bannerTransform: { x: 0, y: 0, s: 1 },
    about: translations[currentLanguage].WELCOME_COLLECTION
};

let userDataPath = '';

// ================================================================
// UTILS
// ================================================================
function resolvePath(p) {
    if (!p) return '';
    if (p.includes('file://') || p.includes('http')) return p;

    // Standardize slashes
    let safe = p.replace(/\\/g, '/');

    // Helper to encode segments but keep slashes
    const encodePath = (str) => str.split('/').map(part => encodeURIComponent(part)).join('/');

    // 1. Account-specific relative paths (starting with ./)
    if (safe.startsWith('./')) {
        if (!currentAccountId || !userDataPath) return safe;
        // Construct absolute path to AppData
        const fullAbs = `${userDataPath}/Parallax_Accounts/${currentAccountId}/${safe.substring(2)}`.replace(/\\/g, '/');
        return `file:///${encodePath(fullAbs)}`;
    }

    // 2. App-wide placeholder/default assets (Assets_Default)
    if (safe.includes('Assets_Default/')) {
        if (!userDataPath) return safe;
        const filename = safe.split('/').pop();
        const fullAbs = `${userDataPath}/Assets_Default/${filename}`.replace(/\\/g, '/');
        return `file:///${encodePath(fullAbs)}`;
    }

    // 3. Absolute paths
    if (safe.match(/^[a-zA-Z]:\//) || safe.startsWith('/')) {
        return `file:///${encodePath(safe)}`;
    }

    return safe;
}

// ================================================================
// ADJUSTER STATE & EVENTS
// ================================================================
let curAdjust = {
    type: '', // 'avatar', 'banner', 'game-banner'
    x: 0, // Image-space Offset X (Relative to image center)
    y: 0, // Image-space Offset Y
    s: 1, // User Zoom Level
    isDragging: false,
    startX: 0,
    startY: 0,
    baseS: 1 // Base scale to fit container
};


// Banner and Profile click triggers handled safely
if (editBannerBtn) {
    editBannerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerBannerEdit();
    });
}

if (editCoverBtn) {
    editCoverBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        triggerCoverEdit();
    });
}

// Profile Editing
if (headerProfile) {
    headerProfile.addEventListener('click', () => {
        openProfile();
    });
}

const switchAccountBtn = document.getElementById('switchAccountBtn');
if (switchAccountBtn) {
    switchAccountBtn.addEventListener('click', async () => {
        let activeScreen = libraryScreen;
        if (!gameDetailsScreen.classList.contains('hidden')) activeScreen = gameDetailsScreen;
        if (!profileDetailsScreen.classList.contains('hidden')) activeScreen = profileDetailsScreen;

        transitionScreen(activeScreen, gatewayScreen, async () => {
            gameGrid.innerHTML = '';
            runningGames.clear();
            currentLibrary = [];
            loadAccounts();
        });
    });
}

// Banner and Profile click triggers removed as requested.

if (editProfilePhotoBtn) editProfilePhotoBtn.addEventListener('click', () => triggerProfilePhotoEdit());
if (editProfileBannerBtn) editProfileBannerBtn.addEventListener('click', () => triggerProfileBannerEdit());
if (editProfileBtn) editProfileBtn.addEventListener('click', () => toggleProfileEditMode());

// Scroll detection for mini-titles
document.querySelectorAll('.details-container').forEach(container => {
    container.addEventListener('scroll', () => {
        const miniTitle = container.querySelector('.mini-title');
        if (miniTitle) {
            if (container.scrollTop > 180) {
                miniTitle.classList.add('visible');
            } else {
                miniTitle.classList.remove('visible');
            }
        }
    });
});

if (addGameBtn) {
    addGameBtn.addEventListener('click', () => {
        addGameModal.classList.remove('hidden');
        refreshKeyNotes();
        gameSearchInput.value = '';
        selectedSteamApp = null;
        gameSuggestions.classList.add('hidden');
        gameSearchInput.focus();
    });
}

function switchLibraryTab(tab) {
    if (tab === 'library') {
        if (navLibraryBtn) navLibraryBtn.classList.add('active');
        if (navSocialBtn) navSocialBtn.classList.remove('active');
        if (libraryMainView) libraryMainView.classList.remove('hidden');
        if (socialMainView) socialMainView.classList.add('hidden');
        if (addGameBtn) addGameBtn.classList.remove('hidden');
    } else {
        if (navLibraryBtn) navLibraryBtn.classList.remove('active');
        if (navSocialBtn) navSocialBtn.classList.add('active');
        if (libraryMainView) libraryMainView.classList.add('hidden');
        if (socialMainView) socialMainView.classList.remove('hidden');
        if (addGameBtn) addGameBtn.classList.add('hidden');
    }
}

if (navLibraryBtn) navLibraryBtn.onclick = () => switchLibraryTab('library');
if (navSocialBtn) navSocialBtn.onclick = () => switchLibraryTab('social');

/* --- Search ---------------------------------------------------
   The clear button only exists while there is something to clear,
   and Escape does the same thing from the keyboard. */
const searchClearBtn = document.getElementById('searchClear');

function syncSearchClear() {
    if (!searchClearBtn) return;
    searchClearBtn.classList.toggle('hidden', !searchInput.value);
}

function clearSearch() {
    if (!searchInput.value) return;
    searchInput.value = '';
    syncSearchClear();
    handleFilters();
    searchInput.focus();
}

if (searchInput) {
    searchInput.addEventListener('input', () => { syncSearchClear(); handleFilters(); });
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') { e.preventDefault(); clearSearch(); }
    });
}
if (searchClearBtn) searchClearBtn.addEventListener('click', clearSearch);
if (platformFilter) platformFilter.addEventListener('change', () => handleFilters());
if (statusFilter) statusFilter.addEventListener('change', () => handleFilters());
if (sortFilter) sortFilter.addEventListener('change', async () => {
    appSettings.sortBy = sortFilter.value;
    await saveAppSettings();
    handleFilters();
});

// --- UTILS ---
function generateUniqueId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = '';
    for (let i = 0; i < 6; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    // Check for collision in current library
    if (currentLibrary.some(g => g.Id === id)) return generateUniqueId();
    return id;
}

function handleFilters() {
    const searchTerm = searchInput.value.toLowerCase();
    const platformValue = platformFilter.value;
    const statusValue = statusFilter.value;
    const sortValue = sortFilter.value;

    let filteredGames = currentLibrary.filter(game => {
        // Also match the store name, so a game renamed in the library
        // is still findable by what it is actually called.
        const matchesSearch = !searchTerm ||
            game.Name.toLowerCase().includes(searchTerm) ||
            (game.OriginalName || '').toLowerCase().includes(searchTerm);
        const matchesPlatform = platformValue === 'All' || game.Platform === platformValue;

        const currentStatus = game.Status || (game.Path ? 'Installed' : 'Uninstalled');
        const matchesStatus = statusValue === 'All' || currentStatus === statusValue;

        return matchesSearch && matchesPlatform && matchesStatus;
    });

    // Apply Sorting
    if (sortValue === 'playtime') {
        filteredGames.sort((a, b) => {
            const timeA = parseFloat(a.PlayTime || "0.0");
            const timeB = parseFloat(b.PlayTime || "0.0");
            return timeB - timeA; // High to Low
        });
    } else if (sortValue === 'alphabetical') {
        filteredGames.sort((a, b) => a.Name.localeCompare(b.Name));
    } else {
        // Default: Newest to oldest (Reverse of addition order)
        filteredGames.reverse();
    }

    renderGames(filteredGames);
}

async function triggerBannerEdit() {
    const gameId = detailsTitle.dataset.gameId;
    const filePath = await window.api.selectImage();
    if (filePath) {
        if (gameId) pendingAssetFetches.add(gameId);
        handleFilters(); // Trigger loading UI
        updateAssetPreviews({ Id: gameId }); // Trigger details loading UI

        const vaultPath = await window.api.saveToVault(currentAccountId, filePath);
        if (vaultPath) {
            const game = currentLibrary.find(g => g.Id === gameId);
            if (game) {
                game.Banner = vaultPath;
                game.BannerTransform = { x: 0, y: 0, s: 1 };
                if (gameId) pendingAssetFetches.delete(gameId);
                updateAssetPreviews(game);
                openAdjuster('game-banner', vaultPath);
            }
        } else {
            if (gameId) pendingAssetFetches.delete(gameId);
            handleFilters();
        }
    }
}

async function triggerCoverEdit() {
    const gameId = detailsTitle.dataset.gameId;
    const filePath = await window.api.selectImage();
    if (filePath) {
        if (gameId) pendingAssetFetches.add(gameId);
        handleFilters();
        updateAssetPreviews({ Id: gameId });

        const vaultPath = await window.api.saveToVault(currentAccountId, filePath);
        if (vaultPath) {
            const game = currentLibrary.find(g => g.Id === gameId);
            if (game) {
                game.Cover = vaultPath;
                if (gameId) pendingAssetFetches.delete(gameId);
                previewCover.src = resolvePath(vaultPath);
                updateAssetPreviews(game);
                handleFilters();
            }
        } else {
            if (gameId) pendingAssetFetches.delete(gameId);
            handleFilters();
        }
    }
}

// Profile Asset Handlers
async function triggerProfilePhotoEdit() {
    const filePath = await window.api.selectImage();
    if (filePath) {
        const vaultPath = await window.api.saveToVault(currentAccountId, filePath);
        if (vaultPath) {
            userProfile.avatar = vaultPath;
            userProfile.avatarTransform = { x: 0, y: 0, s: 1 };
            // triggerVaultCleanup(); // Cleanup will happen on saveProfile
            openAdjuster('avatar', vaultPath);
        }
    }
}

async function triggerProfileBannerEdit() {
    const filePath = await window.api.selectImage();
    if (filePath) {
        const vaultPath = await window.api.saveToVault(currentAccountId, filePath);
        if (vaultPath) {
            userProfile.banner = vaultPath;
            userProfile.bannerTransform = { x: 0, y: 0, s: 1 };
            // triggerVaultCleanup(); // Cleanup will happen on saveProfile
            openAdjuster('banner', vaultPath);
        }
    }
}

// Clipboard Paste Handlers
pasteCoverBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const gameId = detailsTitle.dataset.gameId;
    if (gameId) pendingAssetFetches.add(gameId);
    handleFilters();
    updateAssetPreviews({ Id: gameId });

    const vaultPath = await window.api.pasteFromClipboard(currentAccountId);
    if (vaultPath) {
        const game = currentLibrary.find(g => g.Id === gameId);
        if (game) {
            game.Cover = vaultPath;
            if (gameId) pendingAssetFetches.delete(gameId);
            previewCover.src = resolvePath(vaultPath);
            updateAssetPreviews(game);
            handleFilters();
        }
    } else {
        if (gameId) pendingAssetFetches.delete(gameId);
        handleFilters();
        showError(translations[currentLanguage].NO_IMAGE_IN_CLIPBOARD);
    }
});

pasteBannerBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const gameId = detailsTitle.dataset.gameId;
    if (gameId) pendingAssetFetches.add(gameId);
    handleFilters();
    updateAssetPreviews({ Id: gameId });

    const vaultPath = await window.api.pasteFromClipboard(currentAccountId);
    if (vaultPath) {
        const game = currentLibrary.find(g => g.Id === gameId);
        if (game) {
            game.Banner = vaultPath;
            game.BannerTransform = { x: 0, y: 0, s: 1 };
            if (gameId) pendingAssetFetches.delete(gameId);
            updateAssetPreviews(game);
            openAdjuster('game-banner', vaultPath);
        }
    } else {
        if (gameId) pendingAssetFetches.delete(gameId);
        handleFilters();
        showError(translations[currentLanguage].NO_IMAGE_IN_CLIPBOARD);
    }
});

pasteProfilePhotoBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const vaultPath = await window.api.pasteFromClipboard(currentAccountId);
    if (vaultPath) {
        userProfile.avatar = vaultPath;
        userProfile.avatarTransform = { x: 0, y: 0, s: 1 };
        // triggerVaultCleanup(); // Cleanup will happen on saveProfile
        openAdjuster('avatar', vaultPath);
    } else showError(translations[currentLanguage].NO_IMAGE_IN_CLIPBOARD);
});

pasteProfileBannerBtn.addEventListener('click', async (e) => {
    e.stopPropagation();
    const vaultPath = await window.api.pasteFromClipboard(currentAccountId);
    if (vaultPath) {
        userProfile.banner = vaultPath;
        userProfile.bannerTransform = { x: 0, y: 0, s: 1 };
        // triggerVaultCleanup(); // Cleanup will happen on saveProfile
        openAdjuster('banner', vaultPath);
    } else showError(translations[currentLanguage].NO_IMAGE_IN_CLIPBOARD);
});

// Adjuster Logic
function getDominantColor(imgEl) {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 10; // Use small sample
        canvas.height = 10;
        if (imgEl.complete) {
            ctx.drawImage(imgEl, 0, 0, 10, 10);
            const data = ctx.getImageData(0, 0, 10, 10).data;
            let r = 0, g = 0, b = 0;
            for (let i = 0; i < data.length; i += 4) {
                r += data[i]; g += data[i + 1]; b += data[i + 2];
            }
            const count = data.length / 4;
            resolve(`rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`);
        } else {
            imgEl.onload = () => {
                ctx.drawImage(imgEl, 0, 0, 10, 10);
                const data = ctx.getImageData(0, 0, 10, 10).data;
                let r = 0, g = 0, b = 0;
                for (let i = 0; i < data.length; i += 4) {
                    r += data[i]; g += data[i + 1]; b += data[i + 2];
                }
                const count = data.length / 4;
                resolve(`rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`);
            };
        }
    });
}

function openAdjuster(type, imgPath) {
    curAdjust.type = type;
    const safePath = resolvePath(imgPath);
    adjustImage.src = safePath;

    assetAdjuster.classList.remove('hidden');
    assetAdjuster.className = `modal ${type === 'avatar' ? 'circular-crop' : 'rect-crop'}`;
    adjusterTitle.textContent = type === 'avatar' ? translations[currentLanguage].ADJUST_PHOTO : translations[currentLanguage].ADJUST_BANNER;

    adjustImage.onload = () => {
        // Find stored transform if exists
        let existingT = { x: 0, y: 0, s: 1 };
        if (curAdjust.type === 'avatar') existingT = userProfile.avatarTransform || existingT;
        else if (curAdjust.type === 'banner') existingT = userProfile.bannerTransform || existingT;
        else if (curAdjust.type === 'game-banner') {
            const gameId = detailsTitle.dataset.gameId;
            const game = currentLibrary.find(g => g.Id === gameId);
            if (game) existingT = game.BannerTransform || existingT;
        }

        const rect = cropArea.getBoundingClientRect();
        const maskW = type === 'avatar' ? 300 : rect.width * 0.9;
        const maskH = type === 'avatar' ? 300 : rect.height * 0.6;

        const imgW = adjustImage.naturalWidth;
        const imgH = adjustImage.naturalHeight;

        curAdjust.baseS = Math.max(maskW / imgW, maskH / imgH);
        curAdjust.s = existingT.s || 1;
        curAdjust.x = existingT.x || 0;
        curAdjust.y = existingT.y || 0;

        adjustSlider.value = curAdjust.s;
        updateAdjusterPreview();
    };
}

function updateAdjusterPreview() {
    const finalS = curAdjust.baseS * curAdjust.s;
    const imgW = adjustImage.naturalWidth;
    const imgH = adjustImage.naturalHeight;

    const rect = cropArea.getBoundingClientRect();
    const mW = curAdjust.type === 'avatar' ? 300 : rect.width * 0.9;
    const mH = curAdjust.type === 'avatar' ? 300 : rect.height * 0.6;

    // Boundary check: Ensure image covers the mask
    // Image space units: x and y are pixels in the original image
    // Maximum allowed offset from center: (ScaledImageDim - MaskDim) / 2
    const limitX = Math.max(0, (imgW * finalS - mW) / 2) / finalS;
    const limitY = Math.max(0, (imgH * finalS - mH) / 2) / finalS;

    curAdjust.x = Math.max(-limitX, Math.min(limitX, curAdjust.x));
    curAdjust.y = Math.max(-limitY, Math.min(limitY, curAdjust.y));

    adjustImage.style.transform = `translate(-50%, -50%) scale(${finalS}) translate(${curAdjust.x}px, ${curAdjust.y}px)`;
}

// Modal Events
cancelAdjust.onclick = () => assetAdjuster.classList.add('hidden');

saveAdjust.onclick = async () => {
    const transform = { x: curAdjust.x, y: curAdjust.y, s: curAdjust.s };

    if (curAdjust.type === 'avatar') {
        userProfile.avatarTransform = transform;
        await saveProfile();
        applyProfileToUI();
    } else if (curAdjust.type === 'banner') {
        userProfile.bannerTransform = transform;
        await saveProfile();
        applyProfileToUI();
    } else if (curAdjust.type === 'game-banner') {
        const gameId = detailsTitle.dataset.gameId;
        const game = currentLibrary.find(g => g.Id === gameId);
        if (game) {
            game.BannerTransform = transform;
            applyBannerToUI(game);
            updateAssetPreviews(game);
            await saveGameChanges();
        }
    }

    assetAdjuster.classList.add('hidden');
};

adjustSlider.oninput = (e) => {
    curAdjust.s = parseFloat(e.target.value);
    updateAdjusterPreview();
};

cropArea.onmousedown = (e) => {
    curAdjust.isDragging = true;
    curAdjust.startX = e.clientX;
    curAdjust.startY = e.clientY;
};

let lastUpdate = 0;
window.onmousemove = (e) => {
    if (!curAdjust.isDragging) return;

    // Relative movement scaled by current zoom level
    const dx = e.clientX - curAdjust.startX;
    const dy = e.clientY - curAdjust.startY;
    const s = curAdjust.baseS * curAdjust.s;

    curAdjust.x += dx / s;
    curAdjust.y += dy / s;

    curAdjust.startX = e.clientX;
    curAdjust.startY = e.clientY;

    if (Date.now() - lastUpdate > 10) {
        updateAdjusterPreview();
        lastUpdate = Date.now();
    }
};

window.onmouseup = () => {
    if (curAdjust.isDragging) {
        updateAdjusterPreview(); // Final snap to bounds
    }
    curAdjust.isDragging = false;
};

// ================================================================
// PROFILE
// ================================================================
function applyProfileToUI() {
    const nameDisplays = [headerUserName, profileDisplayName];
    nameDisplays.forEach(el => { if (el) el.textContent = userProfile.name; });

    const nameGroup = document.querySelector('.profile-name-group');

    if (profileBadge) {
        if (userProfile.SpecialCode === SPECIAL_CODE) {
            profileBadge.textContent = translations[currentLanguage].DEVELOPER;
            profileBadge.classList.remove('hidden');
            if (nameGroup) nameGroup.style.justifyContent = "center";
        } else {
            profileBadge.classList.add('hidden');
            if (nameGroup) nameGroup.style.justifyContent = "center";
        }
    }


    const safeAvatarUrl = resolvePath(userProfile.avatar);

    const avatars = [
        { id: 'headerAvatar', el: headerAvatar, size: 40 },
        { id: 'profileAvatarImg', el: profileAvatarImg, size: 120 }
    ];

    const t = userProfile.avatarTransform || { x: 0, y: 0, s: 1 };
    const img = new Image();
    img.src = safeAvatarUrl;
    img.onload = async () => {
        avatars.forEach(item => {
            if (!item.el) return;
            item.el.src = safeAvatarUrl;
            item.el.onerror = () => { item.el.src = PLACEHOLDER_PROFILE; };

            const baseS = Math.max(item.size / img.naturalWidth, item.size / img.naturalHeight);
            const zoom = t.s || 1;
            const finalS = baseS * zoom;

            // Image-space translation (same order as Adjuster)
            item.el.style.transform = `translate(-50%, -50%) scale(${finalS}) translate(${t.x}px, ${t.y}px)`;
        });
        img.onerror = () => {
            avatars.forEach(item => { if (item.el) item.el.src = PLACEHOLDER_PROFILE; });
        };
    };

    profileAbout.textContent = userProfile.about;
    previewProfilePhoto.src = safeAvatarUrl;
    previewProfilePhoto.onerror = () => { previewProfilePhoto.src = PLACEHOLDER_PROFILE; };

    if (userProfile.banner) {
        const bannerUrl = resolvePath(userProfile.banner);
        profileBannerImg.src = bannerUrl;
        profileBannerImg.onerror = () => { profileBannerImg.src = PLACEHOLDER_BANNER; };
        previewProfileBanner.src = bannerUrl;
        previewProfileBanner.onerror = () => { previewProfileBanner.src = PLACEHOLDER_BANNER; };

        const bT = userProfile.bannerTransform || { x: 0, y: 0, s: 1 };
        const bannerImgEl = new Image();
        bannerImgEl.src = bannerUrl;

        const runScaling = async () => {
            const bW = (profileBanner && profileBanner.offsetWidth > 0) ? profileBanner.offsetWidth : 0;
            const bH = (profileBanner && profileBanner.offsetHeight > 0) ? profileBanner.offsetHeight : 550;

            if (bW === 0) return; // Still hidden, wait for next cycle

            const bBaseS = Math.max(bW / bannerImgEl.naturalWidth, bH / bannerImgEl.naturalHeight);
            profileBannerImg.style.transform = `translate(-50%, -50%) scale(${bBaseS * bT.s}) translate(${bT.x}px, ${bT.y}px)`;

            const color = await getDominantColor(bannerImgEl);
            // Ambient color logic...
        };

        bannerImgEl.onload = runScaling;
        bannerImgEl.onerror = () => {
            profileBannerImg.src = PLACEHOLDER_BANNER;
            previewProfileBanner.src = PLACEHOLDER_BANNER;
        };

        if (bannerImgEl.complete && bannerImgEl.naturalWidth > 0) runScaling();
    }

    // Calculate Stats
    const totalGames = currentLibrary.length;
    let totalMinutes = 0;
    currentLibrary.forEach(g => {
        totalMinutes += parseFloat(g.PlayTime || "0") * 60;
    });
    const totalHours = totalMinutes / 60;

    const gamesEl = document.getElementById('profileTotalGames');
    const timeEl = document.getElementById('profileTotalPlayTime');
    const words = translations[currentLanguage];

    // Past a day, hours stop meaning anything — 1,463.5 is a number nobody
    // reads. Only this total switches to days; a single game's playtime is
    // always in hours, because that is the figure people compare.
    const journey = totalHours < 24
        ? totalHours.toFixed(1) + " " + words.HOURS
        : (totalHours / 24).toFixed(1) + " " + words.DAYS;

    if (gamesEl) gamesEl.textContent = totalGames;
    if (timeEl) timeEl.textContent = journey;
}


async function saveProfile() {
    await window.api.updateLibrary({ profile: userProfile, games: currentLibrary });
}

function triggerVaultCleanup() {
    if (!currentAccountId || !currentLibrary) return;
    const usedPaths = [];
    if (userProfile) {
        if (userProfile.avatar) usedPaths.push(userProfile.avatar);
        if (userProfile.banner) usedPaths.push(userProfile.banner);
    }
    currentLibrary.forEach(g => {
        if (g.Cover) usedPaths.push(g.Cover);
        if (g.Banner) usedPaths.push(g.Banner);
    });
    const distinctUsed = [...new Set(usedPaths.filter(p => p && p.includes('Vault_Assets')))];
    window.api.cleanupVault(currentAccountId, distinctUsed);
}

function loadProfile(profileData) {
    // RESET to defaults first to avoid leakage from previous account
    userProfile = {
        name: currentAccountId || "Arda",
        avatar: PLACEHOLDER_PROFILE,
        avatarTransform: { x: 0, y: 0, s: 1 },
        banner: PLACEHOLDER_BANNER,
        bannerTransform: { x: 0, y: 0, s: 1 },
        about: translations[currentLanguage].WELCOME_COLLECTION,
        SpecialCode: '',
        email: '',
        cloudLinked: 'false'
    };

    if (profileData) {
        // Handle flexible casing from Library.txt
        const findVal = (root, targets) => {
            for (const t of targets) {
                if (root[t] !== undefined) return root[t];
            }
            return undefined;
        };

        // The display name is the profile's own, not the folder it lives
        // in. It used to be taken from the account id, which meant
        // editing it did nothing that survived a reload — the id was
        // read straight back over the top of it.
        userProfile.name = findVal(profileData, ['Name', 'name']) || currentAccountId || "Arda";

        // A profile created before these assets were redrawn stored the
        // path of whatever placeholder shipped at the time, so it keeps
        // showing that file forever — including the banner still
        // carrying the app's name from two versions ago. Treat any
        // bundled placeholder as "never set" so it follows the current
        // one instead of freezing history in place.
        const isStalePlaceholder = (v) =>
            typeof v === 'string' && /Assets_Default\/Placeholder/i.test(v);
        const realOrNull = (v) => (!v || isStalePlaceholder(v)) ? null : v;

        userProfile.avatar = realOrNull(findVal(profileData, ['Avatar', 'avatar'])) || userProfile.avatar;
        userProfile.avatarTransform = findVal(profileData, ['AvatarTransform', 'avatarTransform']) || userProfile.avatarTransform;
        userProfile.banner = realOrNull(findVal(profileData, ['Banner', 'banner'])) || userProfile.banner;
        userProfile.bannerTransform = findVal(profileData, ['BannerTransform', 'bannerTransform']) || userProfile.bannerTransform;
        userProfile.about = findVal(profileData, ['About', 'about']) || userProfile.about;
        userProfile.SpecialCode = profileData.SpecialCode || '';
        userProfile.email = findVal(profileData, ['Email', 'email']) || '';
        userProfile.cloudLinked = findVal(profileData, ['CloudLinked', 'cloudLinked']) || 'false';
    }
    applyProfileToUI();
}


function updateAssetPreviews(game) {
    const coverPath = resolvePath(game.Cover) || PLACEHOLDER_COVER;
    const bannerPath = resolvePath(game.Banner) || PLACEHOLDER_BANNER;

    const isAutoFetching = pendingAssetFetches.has(game.Id);

    previewCover.src = coverPath;
    previewCover.onerror = () => { previewCover.src = PLACEHOLDER_COVER; };
    if (isAutoFetching) previewCover.parentElement.classList.add('pulse-loading');
    else previewCover.parentElement.classList.remove('pulse-loading');

    previewBanner.src = bannerPath;
    previewBanner.onerror = () => { previewBanner.src = PLACEHOLDER_BANNER; };
    if (isAutoFetching) previewBanner.parentElement.classList.add('pulse-loading');
    else previewBanner.parentElement.classList.remove('pulse-loading');
}

function applyBannerToUI(game) {
    if (!game) return;
    const isAutoFetching = pendingAssetFetches.has(game.Id);

    if (isAutoFetching) {
        detailsBanner.classList.add('pulse-loading');
        // Add a temporary loading text/overlay to the banner if it's the main details screen
        if (!document.getElementById('bannerSyncNotice')) {
            const notice = document.createElement('div');
            notice.id = 'bannerSyncNotice';
            notice.className = 'asset-sync-overlay';
            notice.innerHTML = '<div class="sync-spinner"></div><div class="sync-text">FETCHING HIGH-RES ASSETS</div>';
            detailsBanner.appendChild(notice);
        }
    } else {
        detailsBanner.classList.remove('pulse-loading');
        const notice = document.getElementById('bannerSyncNotice');
        if (notice) notice.remove();
    }

    const bImg = game.Name === 'Gamer-6464' ? PLACEHOLDER_BANNER : (game.Banner || PLACEHOLDER_BANNER);
    const bannerUrl = resolvePath(bImg);

    /* An <img> keeps showing the picture it has until the next one has
       decoded. Opening one game straight after another meant a flash of
       the previous game's banner — brief, but long enough to see and
       exactly the sort of thing that makes a page feel unfinished.
       So the element is emptied first and only shown once the new
       picture is ready to paint. */
    if (detailsBannerImg.dataset.for !== String(game.Id)) {
        detailsBannerImg.dataset.for = String(game.Id);
        detailsBannerImg.style.opacity = '0';
    }

    detailsBannerImg.onerror = () => {
        const fallback = resolvePath(PLACEHOLDER_BANNER);
        if (detailsBannerImg.src !== fallback) detailsBannerImg.src = fallback;
        detailsBannerImg.style.opacity = '1';
    };
    detailsBannerImg.onload = () => { detailsBannerImg.style.opacity = '1'; };
    detailsBannerImg.src = bannerUrl;

    // A picture already in the cache fires no load event in some paths;
    // decode() settles either way, and resolves immediately when it is
    // already decoded.
    if (detailsBannerImg.decode) {
        detailsBannerImg.decode()
            .then(() => { detailsBannerImg.style.opacity = '1'; })
            .catch(() => { detailsBannerImg.style.opacity = '1'; });
    } else if (detailsBannerImg.complete) {
        detailsBannerImg.style.opacity = '1';
    }

    const bT = game.BannerTransform || { x: 0, y: 0, s: 1 };
    const bannerImgEl = new Image();
    bannerImgEl.src = bannerUrl;

    const runScaling = async () => {
        const bW = detailsBanner.offsetWidth || 1200;
        const bH = detailsBanner.offsetHeight || 550;

        if (bW === 0) return; // Still hidden, wait for next cycle

        const bBaseS = Math.max(bW / bannerImgEl.naturalWidth, bH / bannerImgEl.naturalHeight);
        detailsBannerImg.style.transform = `translate(-50%, -50%) scale(${bBaseS * bT.s}) translate(${bT.x}px, ${bT.y}px)`;

        // Update ambient color only if visible
        const color = await getDominantColor(bannerImgEl);
        // document.documentElement.style.setProperty('--ambient-color', color);
    };

    bannerImgEl.onload = runScaling;
    bannerImgEl.onerror = () => {
        const fallback = resolvePath(PLACEHOLDER_BANNER);
        if (bannerImgEl.src !== fallback) {
            bannerImgEl.src = fallback;
        }
    };

    // Force a re-run if it was already loaded but width was 0
    if (bannerImgEl.complete && bannerImgEl.naturalWidth > 0) runScaling();
}

// loginBtn listener removed as it's handled by account selection now

backToLibraryBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        if (isEditMode) toggleEditMode();
        if (isProfileEditMode) toggleProfileEditMode();
        transitionScreen(gameDetailsScreen, libraryScreen);
        transitionScreen(profileDetailsScreen, libraryScreen);
        applyProfileToUI(); // Restore atmospheric glow
    });
});

editGameBtn.addEventListener('click', () => {
    toggleEditMode();
});

function toggleEditMode() {
    isEditMode = !isEditMode;
    const browseMode = document.getElementById('browseMode');

    if (isEditMode) {
        editGameBtn.classList.add('active');
        document.body.classList.add('edit-mode-active');
        detailsTitle.contentEditable = "true";
        detailsNotes.contentEditable = "true";
        detailsPlayTime.contentEditable = "true";

        const gameId = detailsTitle.dataset.gameId;
        const game = currentLibrary.find(g => g.Id === gameId);
        if (game) {
            updateAssetPreviews(game);
            platformSelect.value = game.Platform || 'PC';
        }

        detailsPlatform.classList.add('hidden');
        platformSelect.classList.remove('hidden');

        // Remove the time unit suffix for easier editing
        const hoursLabel = translations[currentLanguage].HOURS;
        detailsPlayTime.textContent = detailsPlayTime.textContent.replace(' ' + hoursLabel, '').trim();

        playBtn.classList.add('hidden');
        assetEditMode.classList.remove('hidden');
        if (browseMode) browseMode.classList.remove('hidden');
        dangerZone.classList.remove('hidden');
        resetDeleteButton();
    } else {
        editGameBtn.classList.remove('active');
        document.body.classList.remove('edit-mode-active');
        detailsTitle.contentEditable = "false";
        detailsNotes.contentEditable = "false";
        detailsPlayTime.contentEditable = "false";

        const gameId = detailsTitle.dataset.gameId;
        const game = currentLibrary.find(g => g.Id === gameId);
        if (game) {
            game.Name = detailsTitle.innerText.trim();
            game.Notes = detailsNotes.innerText.trim();
            game.Platform = platformSelect.value;
            game.PlayTime = detailsPlayTime.textContent.trim();

            // Re-sync UI with translated labels
            detailsTitle.dataset.originalName = game.Name; // Keep for asset search fallback if needed
            detailsPlatform.textContent = translations[currentLanguage][game.Platform.toUpperCase()] || game.Platform;

            const hoursLabel = translations[currentLanguage].HOURS;
            if (!detailsPlayTime.textContent.includes(hoursLabel)) {
                detailsPlayTime.textContent = game.PlayTime + " " + hoursLabel;
            }
        }

        detailsPlatform.classList.remove('hidden');
        platformSelect.classList.add('hidden');

        hideWithExit(assetEditMode);
        if (browseMode) browseMode.classList.add('hidden');
        dangerZone.classList.add('hidden');

        saveGameChanges();
    }
}

/**
 * Hides a panel by letting it leave first.
 *
 * `.hidden` is `display: none`, which cannot be transitioned — the
 * panel vanished between one frame and the next. This plays the
 * reverse of its entrance, then hides it once that has finished.
 */
function hideWithExit(el) {
    if (!el || el.classList.contains('hidden') || el.classList.contains('is-leaving')) return;

    let finished = false;
    const done = () => {
        if (finished) return;
        finished = true;
        el.classList.remove('is-leaving');
        el.classList.add('hidden');
        el.removeEventListener('animationend', done);
    };

    el.classList.add('is-leaving');
    el.addEventListener('animationend', done, { once: true });
    // If animations are disabled the event never arrives, so make
    // sure the panel still ends up hidden.
    setTimeout(done, 420);
}

async function toggleProfileEditMode() {
    isProfileEditMode = !isProfileEditMode;

    if (isProfileEditMode) {
        if (editProfileBtn) editProfileBtn.classList.add('active');
        document.body.classList.add('edit-mode-active');
        profileDisplayName.contentEditable = "true";
        profileAbout.contentEditable = "true";
        profileAssetEditMode.classList.remove('hidden');
        profileDangerZone.classList.remove('hidden');
    } else {
        if (editProfileBtn) editProfileBtn.classList.remove('active');
        document.body.classList.remove('edit-mode-active');
        profileDisplayName.contentEditable = "false";
        profileAbout.contentEditable = "false";
        hideWithExit(profileAssetEditMode);
        hideWithExit(profileDangerZone);
        resetAccountDeleteButton();

        // Update data from UI
        const newName = profileDisplayName.innerText.trim();

        // Changing the name no longer moves the account folder. That
        // coupling meant a display name had to be a valid directory
        // name, a rename could fail on a filesystem error and silently
        // revert, and every stored path pointed at a folder that had
        // just moved underneath it. The folder id stays put; the name
        // is simply a field on the profile.
        // No reserved names. One used to be held back with an "ERROR
        // CODE: 403", which only ever got in the way of the person it
        // was meant to protect.
        if (newName) userProfile.name = newName;
    }

    userProfile.about = profileAbout.innerText.trim();
    await saveProfile(); // Use await here
    applyProfileToUI();
}

function openProfile() {
    loadProfile(userProfile);

    // Reset scroll and mini-title
    const container = profileDetailsScreen.querySelector('.details-container');
    container.scrollTop = 0;
    const mini = document.getElementById('profileMiniTitle');
    mini.textContent = userProfile.name.toUpperCase();
    mini.classList.remove('visible');

    transitionScreen(libraryScreen, profileDetailsScreen);

    // Recalculate profile aspect ratios AFTER transition starts
    setTimeout(() => {
        applyProfileToUI();
    }, 450);
}

if (browseBtn) {
    browseBtn.addEventListener('click', async () => {
        const path = await window.api.selectExe();
        if (path) {
            locationPath.textContent = path;
            updateStatusTextImmediately('Installed');
        }
    });
}

if (clearPathBtn) {
    clearPathBtn.addEventListener('click', () => {
        locationPath.textContent = translations[currentLanguage].NOT_SET;
        updateStatusTextImmediately('Uninstalled');
    });
}

if (deleteGameBtn) {
    deleteGameBtn.addEventListener('click', async () => {
        if (!deleteGameBtn.classList.contains('confirm')) {
            deleteGameBtn.classList.add('confirm');
            deleteGameBtn.textContent = translations[currentLanguage].ARE_YOU_SURE_DELETE;
        } else {
            const gameId = detailsTitle.dataset.gameId;
            const gameIndex = currentLibrary.findIndex(g => g.Id === gameId);

            if (gameIndex !== -1) {
                currentLibrary.splice(gameIndex, 1);
                await window.api.updateLibrary({ profile: userProfile, games: currentLibrary });
                triggerVaultCleanup(); // Call cleanup after deletion

                // Clean up and navigate back
                if (isEditMode) toggleEditMode();
                transitionScreen(gameDetailsScreen, libraryScreen);
                renderGames(currentLibrary);
                console.log(`Deleted ${gameName} from collection.`);
            }
        }
    });
}

function resetDeleteButton() {
    deleteGameBtn.classList.remove('confirm');
    deleteGameBtn.textContent = translations[currentLanguage].DELETE_GAME;
}

function updateStatusTextImmediately(status) {
    detailsStatus.textContent = translations[currentLanguage][status.toUpperCase()] || status;
    if (status === 'Uninstalled') {
        detailsStatus.classList.add('uninstalled');
    } else {
        detailsStatus.classList.remove('uninstalled');
    }
}

async function saveGameChanges() {
    const updatedName = detailsTitle.innerText.trim();
    const updatedNotes = detailsNotes.innerText;
    const updatedPlatform = platformSelect.value;
    const updatedPlayTime = detailsPlayTime.textContent.split(' ')[0].trim() || '0.0';
    const updatedPath = (locationPath.textContent !== translations[currentLanguage].NOT_SET && locationPath.textContent !== 'NOT SET') ? locationPath.textContent : '';
    const updatedStatus = updatedPath ? 'Installed' : 'Uninstalled';

    const gameId = detailsTitle.dataset.gameId;
    const gameIndex = currentLibrary.findIndex(g => g.Id === gameId);
    if (gameIndex !== -1) {
        currentLibrary[gameIndex].Name = updatedName;
        currentLibrary[gameIndex].Notes = updatedNotes;
        currentLibrary[gameIndex].Category = updatedPlatform;
        currentLibrary[gameIndex].Platform = updatedPlatform;
        currentLibrary[gameIndex].PlayTime = updatedPlayTime;
        currentLibrary[gameIndex].Status = updatedStatus;
        currentLibrary[gameIndex].Path = updatedPath;

        await window.api.updateLibrary({ profile: userProfile, games: currentLibrary });
        triggerVaultCleanup(); // Call cleanup after saving game changes

        handleFilters();

        if (currentLibrary[gameIndex].Path && !isEditMode) {
            playBtn.classList.remove('hidden');
        }

        console.log("Changes saved.");
    }
}

// ================================================================
// LIBRARY
// ================================================================
/* Pull in anything played straight from Steam before reading the
   library, so hours spent outside the launcher are not lost. It reads
   Steam's local config — no API key, no network, no rate limit — and
   only ever raises a number, never lowers one. Runs on every load, so
   it stays current without anyone having to ask for it. */
let playtimeSynced = false;

async function loadLibrary() {
    try {
        if (!playtimeSynced && window.api.syncPlaytime) {
            playtimeSynced = true;
            try {
                const r = await window.api.syncPlaytime();
                if (r && r.success && r.updated > 0) {
                    console.log(`[Playtime] ${r.updated} games updated from Steam (+${r.gainedHours}h)`);
                }
            } catch (e) {
                console.warn('[Playtime] sync skipped:', e);
            }
        }

        const data = await window.api.getLibrary();
        currentLibrary = data.games || [];

        // Migration: Ensure all games have a unique ID and OriginalName
        let needsUpdate = false;
        currentLibrary.forEach(g => {
            if (!g.Id) {
                g.Id = generateUniqueId();
                needsUpdate = true;
            }
            if (!g.OriginalName) {
                g.OriginalName = g.Name;
                needsUpdate = true;
            }
        });

        if (needsUpdate) {
            await window.api.updateLibrary({ profile: data.profile, games: currentLibrary });
        }

        loadProfile(data.profile);
        handleFilters();

        // Migration: If profile doesn't exist in file yet, save it now
        if (!data.profile) {
            console.log("Profile not found in library file, saving default profile...");
            saveProfile();
        }
    } catch (error) {
        console.error("Failed to load library:", error);
    }
}

/* ----------------------------------------------------------------
   An empty shelf
   ----------------------------------------------------------------
   A new account starts with nothing in it, and what somebody saw was
   a blank screen — no games, no message, and no indication that the
   two things they need are behind buttons elsewhere.

   Two different emptinesses, and they need different answers. A
   library with nothing in it is a beginning: say so, and offer the
   two ways to fill it. A library whose filters match nothing is a
   dead end: say that instead, and offer the way out.
   ---------------------------------------------------------------- */
function renderEmptyLibrary() {
    const t = translations[currentLanguage];
    const wrap = document.createElement('div');
    wrap.className = 'empty-shelf';
    wrap.innerHTML = `
        <svg class="empty-shelf__mark" viewBox="0 0 100 100" fill="none" aria-hidden="true">
            <g stroke="currentColor" stroke-width="4" stroke-linejoin="round">
                <path d="M50.00 15.00 L32.68 25.00 L32.68 45.00 L50.00 55.00 L67.32 45.00 L67.32 25.00 Z"/>
                <path d="M32.68 45.00 L15.36 55.00 L15.36 75.00 L32.68 85.00 L50.00 75.00 L50.00 55.00 Z"/>
                <path d="M67.32 45.00 L50.00 55.00 L50.00 75.00 L67.32 85.00 L84.64 75.00 L84.64 55.00 Z"/>
            </g>
        </svg>
        <h2 data-i18n="EMPTY_TITLE">${t.EMPTY_TITLE}</h2>
        <p data-i18n="EMPTY_BODY">${t.EMPTY_BODY}</p>
        <div class="empty-shelf__actions">
            <button id="emptyImportBtn" class="premium-btn" data-i18n="IMPORT_STEAM">${t.IMPORT_STEAM}</button>
            <button id="emptyAddBtn" class="premium-btn secondary-btn" data-i18n="ADD_GAME_PLAIN">${t.ADD_GAME_PLAIN}</button>
        </div>
    `;
    gameGrid.appendChild(wrap);

    const imp = document.getElementById('emptyImportBtn');
    const add = document.getElementById('emptyAddBtn');
    // Reuse the buttons in the header rather than repeating what they
    // do — one behaviour, two places to reach it.
    // Straight to the panel each one leads to. The header's Add Game
    // button is reused; importing lives behind the profile screen, so
    // it is opened directly rather than walking somebody through two
    // menus to reach the thing they were just told to do.
    if (imp) imp.onclick = () => {
        const modal = document.getElementById('steamImportModal');
        if (modal) modal.classList.remove('hidden');
    };
    if (add) add.onclick = () => { if (addGameBtn) addGameBtn.click(); };
}

function renderNoMatches() {
    const t = translations[currentLanguage];
    const wrap = document.createElement('div');
    wrap.className = 'empty-shelf empty-shelf--filtered';
    wrap.innerHTML = `
        <h2 data-i18n="NO_MATCHES_TITLE">${t.NO_MATCHES_TITLE}</h2>
        <p data-i18n="NO_MATCHES_BODY">${t.NO_MATCHES_BODY}</p>
        <div class="empty-shelf__actions">
            <button id="clearFiltersBtn" class="premium-btn secondary-btn"
                data-i18n="CLEAR_FILTERS">${t.CLEAR_FILTERS}</button>
        </div>
    `;
    gameGrid.appendChild(wrap);

    const clear = document.getElementById('clearFiltersBtn');
    if (clear) clear.onclick = () => {
        if (searchInput) searchInput.value = '';
        if (platformFilter) platformFilter.value = 'All';
        if (statusFilter) statusFilter.value = 'All';
        if (typeof syncSearchClear === 'function') syncSearchClear();
        handleFilters();
    };
}

function renderGames(games) {
    gameGrid.innerHTML = '';

    if (games.length === 0) {
        // Nothing at all, or nothing that matches? The answer differs.
        if (currentLibrary.length === 0) renderEmptyLibrary();
        else renderNoMatches();
        return;
    }

    /* Built off to one side and put in once. Appending each card to the
       live grid made the browser reconsider the layout two hundred-odd
       times on the way in; a fragment is not in the document, so none of
       that happens until the single append at the end. */
    const shelf = document.createDocumentFragment();

    games.forEach(game => {
        const card = document.createElement('div');
        const isUninstalled = (game.Status === 'Uninstalled' || !game.Path);

        // Dimming is now automatically tied to the Label setting
        const shouldDim = isUninstalled && appSettings.showNotInstalledLabel;
        card.className = `game-card ${shouldDim ? 'uninstalled' : ''}`;
        // So a cover arriving later can find its own card without the
        // whole shelf being rebuilt around it.
        card.dataset.id = game.Id;

        let imagePath = resolvePath(game.Cover) || PLACEHOLDER_COVER;

        // Settings: Show Not Installed Label
        const showLabel = isUninstalled && appSettings.showNotInstalledLabel;

        // Settings: Playtime on Card (Always show if setting is ON)
        const showCardPlaytime = appSettings.showPlaytimeOnCard;
        const rawTime = parseFloat(game.PlayTime || 0);
        const displayPlayTime = rawTime.toFixed(1);

        const isAutoFetching = pendingAssetFetches.has(game.Id);

        card.innerHTML = `
            <div class="card-image-container">
                <img src="${imagePath}" alt="${game.Name}" class="card-image"
                     loading="lazy" decoding="async"
                     onerror="this.src='${PLACEHOLDER_COVER}'">
                <div class="card-overlay"></div>
                ${showLabel ? `<div class="card-status-badge">${translations[currentLanguage].NOT_INSTALLED}</div>` : ''}
                ${isAutoFetching ? `
                    <div class="asset-sync-overlay">
                        <div class="sync-spinner"></div>
                        <div class="sync-text" data-i18n="SYNCING">${translations[currentLanguage].SYNCING}</div>
                    </div>
                ` : ''}
            </div>
            <div class="card-info" style="position: relative;">
                <h3 class="card-title">${game.Name}</h3>
                <div class="card-footer-row">
                    <span class="card-category">${translations[currentLanguage][(game.Platform || 'PC').toUpperCase()] || (game.Platform || 'PC')}</span>
                    ${(showCardPlaytime && rawTime > 0) ? `<span class="card-playtime">${displayPlayTime}h</span>` : ''}
                </div>
            </div>
        `;

        card.addEventListener('click', () => showGameDetails(game));
        shelf.appendChild(card);
    });

    gameGrid.appendChild(shelf);
}

// ================================================================
// GAME DETAILS
// ================================================================
function showGameDetails(game) {
    detailsTitle.innerText = game.Name;
    detailsTitle.dataset.gameId = game.Id;
    detailsTitle.dataset.originalName = game.Name; // Restore for legacy lookup compatibility
    detailsNotes.innerText = game.Notes || "";
    detailsPlayTime.textContent = (game.PlayTime || '0.0') + " " + translations[currentLanguage].HOURS;
    detailsPlatform.textContent = translations[currentLanguage][(game.Platform || 'PC').toUpperCase()] || (game.Platform || 'PC');
    platformSelect.value = game.Platform || 'PC';

    const status = game.Status || (game.Path ? 'Installed' : 'Uninstalled');
    detailsStatus.textContent = translations[currentLanguage][status.toUpperCase()] || status;
    if (status === 'Uninstalled') {
        detailsStatus.classList.add('uninstalled');
    } else {
        detailsStatus.classList.remove('uninstalled');
    }

    const pathText = game.Path || translations[currentLanguage].NOT_SET;
    locationPath.textContent = pathText;

    // Update asset previews for the new panel
    updateAssetPreviews(game);
    updatePlayButtonState(game);

    // Reset scroll and mini-title
    const container = gameDetailsScreen.querySelector('.details-container');
    if (container) container.scrollTop = 0;

    const mini = document.getElementById('detailsMiniTitle');
    if (mini) {
        mini.textContent = game.Name.toUpperCase();
        mini.classList.remove('visible');
    }

    // Sets the picture going while the shelf is still on screen.
    applyBannerToUI(game);

    /* The banner is measured a second time once the page is actually
       visible, because its size cannot be read while it is display:none.
       That second pass used to run on a 450ms timer, which put it in the
       middle of the transition — the most expensive frame of the whole
       thing landed exactly where the movement was. Hanging it off the
       end of the transition instead costs the same work at a moment
       when nothing is moving. */
    transitionScreen(libraryScreen, gameDetailsScreen, () => applyBannerToUI(game));
}

function updatePlayButtonState(game) {
    const installBtn = document.getElementById('installBtn');
    const hideExtras = () => {
        if (installBtn) installBtn.classList.add('hidden');
    };

    if (isEditMode) {
        playBtn.classList.add('hidden');
        hideExtras();
        return;
    }

    if (!game || !game.Path || game.Status === 'Uninstalled') {
        playBtn.classList.add('hidden');

        // A game you own but have not installed used to leave this
        // screen with nothing on it at all. Steam can install it, so
        // offer that instead of a dead end.
        const canInstall = game && game.SteamAppId;
        if (installBtn) installBtn.classList.toggle('hidden', !canInstall);
        return;
    }

    hideExtras();
    playBtn.classList.remove('hidden');

    if (runningGames.has(game.Path)) {
        playBtn.textContent = translations[currentLanguage].QUIT;
        playBtn.classList.add('running');
    } else {
        playBtn.textContent = translations[currentLanguage].PLAY;
        playBtn.classList.remove('running');
    }
}

// ================================================================
// TRANSITIONS & FEEDBACK
// ================================================================
function transitionScreen(from, to, callback) {
    if (!to || from === to) return;

    // The sky reads which screen it is behind from here.
    document.body.dataset.screen = to.id || '';

    // Phase 1: Fade OUT 'from' screen
    if (from) {
        from.style.opacity = '0';
        from.style.pointerEvents = 'none';

        // Ensure classes are cleaned up after the CSS transition finishes (0.5s)
        setTimeout(() => {
            if (!from.classList.contains('active')) {
                from.classList.add('hidden');
                from.style.opacity = ''; // Reset for future use
            }
        }, 550);
    }

    // Phase 2: Fade IN 'to' screen
    // Step A: Prepare state (invisible but in layout)
    to.style.transition = 'none';
    to.style.opacity = '0';
    to.classList.remove('hidden');
    to.classList.add('active');
    to.style.pointerEvents = 'auto';

    // Step B: Force browser to calculate styles (The 'Magic' Reflow)
    void to.offsetWidth;

    // Step C: Trigger transition
    requestAnimationFrame(() => {
        to.style.transition = 'opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
        to.style.opacity = '1';

        if (callback) {
            // Callback after transition finishes
            setTimeout(callback, 500);
        }
    });

    // Mark current source as inactive
    if (from) from.classList.remove('active');
}

function showError(msg) {
    if (!errorMessage || !errorModal) {
        alert(msg); // Fallback
        return;
    }
    errorMessage.textContent = msg;
    errorModal.classList.remove('hidden');
    if (window.SFX) window.SFX.play('err');
}

/**
 * Plain information — no tick, no "success". Used when the launcher
 * has done its part and the person still has something to do.
 */
function showInfo(msg, title) {
    const modal = document.getElementById('infoModal');
    const body = document.getElementById('infoMessage');
    const head = document.getElementById('infoTitle');
    if (!modal || !body) { alert(msg); return; }
    if (head && title) head.textContent = title;
    body.innerHTML = msg;
    modal.classList.remove('hidden');
}

['closeInfoBtn', 'infoModalOverlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('click', () => {
        const m = document.getElementById('infoModal');
        if (m) m.classList.add('hidden');
    });
});

function showSuccess(msg) {
    if (!successMessage || !successModal) {
        alert(msg); // Fallback
        return;
    }
    successMessage.textContent = msg;
    successModal.classList.remove('hidden');
    if (window.SFX) window.SFX.play('ok');
}

closeErrorBtn.addEventListener('click', () => {
    errorModal.classList.add('hidden');
});

closeSuccessBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
});

playBtn.addEventListener('click', async () => {
    const gameId = detailsTitle.dataset.gameId;
    const game = currentLibrary.find(g => g.Id === gameId);
    if (!game) return;

    // The path is the key everything is tracked by. Choosing *how*
    // to start the game — Steam URI, native binary, Proton — is the
    // main process's job now, because only it can see the machine.
    const launchPath = game.Path;
    if (!launchPath) return;

    if (runningGames.has(launchPath)) {
        // The game goes with it: stopping may have to find the process
        // by name, and only this side knows which game is meant.
        const result = await window.api.killGame(launchPath, game);
        if (!result.success) showError(translations[currentLanguage].STOP_FAILED || `Could not stop the game: ${result.error}`);
        return;
    }

    playBtn.disabled = true;
    const result = await window.api.launchGame(game);
    playBtn.disabled = false;

    if (!result.success) {
        showError(launchFailureMessage(result.reason, result.error));
        updatePlayButtonState(game);
        return;
    }

    // Steam launches give us no process to watch, so the button must
    // not pretend the game is running — Steam owns it from here.
    if (result.tracked === false) {
        showSuccess(translations[currentLanguage].HANDED_TO_STEAM || 'Handed to Steam. Steam will start the game.');
    }
});

/** Turns a launch failure into something a person can act on. */
function launchFailureMessage(reason, detail) {
    const t = translations[currentLanguage];
    switch (reason) {
        case 'NO_PATH':
            return t.LF_NO_PATH || 'This game has no location set. Use Edit to point it at the game.';
        case 'PATH_MISSING':
            return t.LF_PATH_MISSING || 'The folder this game points to no longer exists.';
        case 'NO_EXECUTABLE_FOUND':
            return t.LF_NO_EXE || 'No program to run was found in that folder. Use Edit to pick the game file yourself.';
        case 'NO_WINDOWS_RUNTIME':
            return t.LF_NO_RUNTIME || 'This is a Windows game and no Proton build or Wine was found to run it.';
        case 'ALREADY_RUNNING':
            return t.LF_RUNNING || 'That game is already running.';
        default:
            return (t.LF_GENERIC || 'Could not start the game') + (detail ? `: ${detail}` : '');
    }
}

// Game Status Listener
window.api.onGameStatus((data) => {
    console.log(`Game Status Update: ${data.path} is ${data.status} `);

    if (data.status === 'running') {
        runningGames.add(data.path);
    } else {
        runningGames.delete(data.path);
        if (data.status === 'error') {
            alert(`Game Error: ${data.error} `);
        }
    }

    // Refresh UI if the current game's status changed
    const currentGameId = detailsTitle.dataset.gameId;
    const currentGame = currentLibrary.find(g => g.Id === currentGameId);
    if (currentGame && currentGame.Path === data.path) {
        updatePlayButtonState(currentGame);
        playBtn.disabled = false;
    }

    // Save library when a game stops to persist playtime changes
    if (data.status === 'exited' || data.status === 'error') {
        window.api.updateLibrary({ profile: userProfile, games: currentLibrary });
    }
});

// Play Time Tracking Interval (Runs every minute)
setInterval(() => {
    if (runningGames.size === 0) return;

    let libraryChanged = false;
    runningGames.forEach(path => {
        const game = currentLibrary.find(g => g.Path === path);
        if (game) {
            // We use a temp value to keep high precision internal to prevent rounding drift
            let currentTime = parseFloat(game.PlayTime || "0.0");
            currentTime += (1 / 60);

            // Keep precision in object but format for display and save
            game.PlayTime = currentTime.toFixed(4); // Internal precision

            libraryChanged = true;

            // Update UI with requested 234.6 (one decimal) format
            if (detailsTitle.innerText === game.Name && !isEditMode) {
                detailsPlayTime.textContent = parseFloat(game.PlayTime).toFixed(1) + " " + translations[currentLanguage].HOURS;
            }
        }
    });

    if (libraryChanged) {
        // Save with one decimal to Library.txt
        const saveCopy = currentLibrary.map(g => ({
            ...g,
            PlayTime: parseFloat(g.PlayTime || "0.0").toFixed(1)
        }));
        window.api.updateLibrary({ profile: userProfile, games: saveCopy });
    }
}, 60000); // Track every minute

// ================================================================
// INIT
// ================================================================
async function initApp() {
    try {
        userDataPath = await window.api.getUserDataPath();

        // Load persisted settings
        let settings = null;
        try {
            settings = await window.api.appGetSettings();
        } catch (e) {
            console.error("Settings load failed:", e);
        }

        if (settings) {
            appSettings = { ...appSettings, ...settings };
        }

        currentLanguage = appSettings.language || 'en';

        if (appLanguageSelect) appLanguageSelect.value = currentLanguage;

        // UI Checkboxes (Switches)
        if (document.getElementById('settingShowNotInstalled'))
            document.getElementById('settingShowNotInstalled').checked = !!appSettings.showNotInstalledLabel;
        if (document.getElementById('settingShowPlaytime'))
            document.getElementById('settingShowPlaytime').checked = !!appSettings.showPlaytimeOnCard;
        if (document.getElementById('settingUiSounds'))
            document.getElementById('settingUiSounds').checked = !!appSettings.uiSounds;
        if (appSettings.uiVolume === undefined) appSettings.uiVolume = 100;
        if (appSettings.autoCheckUpdates === undefined) appSettings.autoCheckUpdates = true;
        if (document.getElementById('settingAutoUpdateCheck'))
            document.getElementById('settingAutoUpdateCheck').checked = !!appSettings.autoCheckUpdates;
        applyVolumeToUI();
        if (window.SFX) {
            window.SFX.setVolume(appSettings.uiVolume);
            window.SFX.setEnabled(!!appSettings.uiSounds);
        }

        // Put the shelf back in the order it was left in. Assigning
        // `.value` raises no event, so the grid is sorted by the
        // handleFilters() that runs once the library is on screen.
        if (sortFilter && appSettings.sortBy) sortFilter.value = appSettings.sortBy;

        applyTheme();
        gatewayScreen.style.transition = 'none';
        gatewayScreen.style.opacity = '1';
        gatewayScreen.classList.remove('hidden');
        gatewayScreen.classList.add('active');

        // Setup Account Creation Listeners
        setupAccountCreationListeners();

        // Load initially
        await loadAccounts();

        appVersion = await window.api.getAppVersion();
        const cur = document.getElementById('updateCurrent');
        if (cur) cur.textContent = 'v' + appVersion;

        translateApp();
        scheduleUpdateCheck();
    } catch (error) {
        console.error("App initialization failed:", error);
        if (typeof showError === 'function') {
            showError(translations[currentLanguage].INIT_ERROR + ' ' + error.message);
        } else {
            alert("CRITICAL ERROR during startup: " + error.message);
        }
    }
}

// ================================================================
// ACCOUNT MANAGEMENT
// ================================================================
async function loadAccounts() {
    try {
        const accounts = await window.api.getAccounts();
        accountList.innerHTML = '';

        if (accounts.length === 0) {
            // Removed "No accounts" message as requested for extreme minimalism
        }

        // Temporary ordering: User 1 (Left), NovaWave (Middle), User 2 (Right)
        accounts.sort((a, b) => {
            const order = { 'User 1': 1, 'NovaWave': 2, 'User 2': 3 };
            const orderA = order[a.name] || 99;
            const orderB = order[b.name] || 99;
            return orderA - orderB;
        });

        accounts.forEach(acc => {
            const card = document.createElement('div');
            card.className = 'account-card';

            const oldId = currentAccountId;
            currentAccountId = acc.id;
            let avatarPath = resolvePath(acc.avatar) || PLACEHOLDER_PROFILE;

            currentAccountId = oldId;

            const img = new Image();
            img.src = avatarPath;
            img.className = 'account-avatar-img';

            card.innerHTML = `
            <div class="account-avatar-container">
                    <!--Image will be appended here-->
                </div>
            <span class="account-name">${acc.name}</span>
        `;

            const container = card.querySelector('.account-avatar-container');
            container.appendChild(img);

            img.onload = () => {
                const t = acc.avatarTransform || { x: 0, y: 0, s: 1 };
                const size = 110; // New account card avatar size

                const baseS = Math.max(size / img.naturalWidth, size / img.naturalHeight);
                const zoom = t.s || 1;
                const finalS = baseS * zoom;

                img.style.transform = `translate(-50%, -50%) scale(${finalS}) translate(${t.x || 0}px, ${t.y || 0}px)`;
            };

            img.onerror = () => {
                img.src = PLACEHOLDER_PROFILE;
            };

            card.addEventListener('click', () => loginAs(acc.id));
            accountList.appendChild(card);
        });

        // Integrated Add Account Card
        const addCard = document.createElement('div');
        addCard.className = 'add-account-card';
        addCard.innerHTML = `
            <div class="plus-icon">+</div>
            <span class="add-account-label">${translations[currentLanguage].ADD_ACCOUNT || 'Add Account'}</span>
        `;
        addCard.onclick = () => {
            accountCreationForm.classList.add('hidden');
            accountRecoveryForm.classList.add('hidden');
            addAccountSelection.classList.remove('hidden');
            addAccountModal.classList.remove('hidden');
        };
        accountList.appendChild(addCard);
    } catch (error) {
        console.error("Failed to load accounts:", error);
    }
}

async function loginAs(accountId) {
    playtimeSynced = false;   // her hesabın kendi kütüphanesi ayrı senkronlanmalı
    try {
        currentAccountId = accountId;
        await window.api.setAccount(accountId);
        await loadLibrary();
        transitionScreen(gatewayScreen, libraryScreen);
    } catch (error) {
        console.error("Login failed:", error);
        showError(`${translations[currentLanguage].LOGIN_FAILED} ${error.message}`);
    }
}

function setupAccountCreationListeners() {
    if (createNewAccountBtn) {
        createNewAccountBtn.onclick = () => {
            addAccountSelection.classList.add('hidden');
            accountRecoveryForm.classList.add('hidden');
            accountCreationForm.classList.remove('hidden');
            if (newAccountNameInput) {
                newAccountNameInput.value = '';
                newAccountNameInput.focus();
            }
        };
    }

    if (backToSelectionBtn) {
        backToSelectionBtn.onclick = () => {
            accountCreationForm.classList.add('hidden');
            accountRecoveryForm.classList.add('hidden');
            addAccountSelection.classList.remove('hidden');
        };
    }

    if (confirmAccountCreationBtn) {
        confirmAccountCreationBtn.onclick = async () => {
            const name = newAccountNameInput ? newAccountNameInput.value.trim() : '';
            if (!name) return;

            try {
                const exists = await window.api.checkAccountExists(name);
                if (exists) {
                    showError(translations[currentLanguage].NAME_TAKEN);
                    return;
                }
                await window.api.setAccount(name);
                addAccountModal.classList.add('hidden');
                accountCreationForm.classList.add('hidden');
                addAccountSelection.classList.remove('hidden');
                await loginAs(name);
            } catch (error) {
                console.error("Account creation failed:", error);
                showError(`${translations[currentLanguage].PROFILE_CREATION_FAILED} ${error.message}`);
            }
        };
    }

    setupProfileActionListeners();
}

// ================================================================
// PROFILE ACTIONS
// ================================================================
function setupProfileActionListeners() {
    const logoutActionBtn = document.getElementById('logoutActionBtn');
    const logoutChoiceModal = document.getElementById('logoutChoiceModal');
    const logoutExportBtn = document.getElementById('logoutExportBtn');
    const logoutDeleteBtn = document.getElementById('logoutDeleteBtn');
    const cancelLogoutBtn = document.getElementById('cancelLogoutBtn');

    const openImportModalBtn = document.getElementById('openImportModalBtn');
    const importChoiceModal = document.getElementById('importChoiceModal');
    const closeImportModalBtn = document.getElementById('closeImportModalBtn');
    const importParallaxBtn = document.getElementById('importParallaxBtn');
    const importSteamLibraryBtn = document.getElementById('importSteamLibraryBtn');

    // Logout flow
    if (logoutActionBtn && logoutChoiceModal) {
        logoutActionBtn.onclick = () => {
            console.log("[Profile] Logout Actions Triggered");
            logoutChoiceModal.classList.remove('hidden');
        };
    }

    const logoutOnlyBtn = document.getElementById('logoutOnlyBtn');
    if (logoutOnlyBtn) {
        logoutOnlyBtn.onclick = async () => {
            if (logoutChoiceModal) logoutChoiceModal.classList.add('hidden');
            logoutUser();
        };
    }

    if (cancelLogoutBtn && logoutChoiceModal) {
        cancelLogoutBtn.onclick = () => logoutChoiceModal.classList.add('hidden');
    }

    if (logoutExportBtn) {
        logoutExportBtn.onclick = async () => {
            if (logoutChoiceModal) logoutChoiceModal.classList.add('hidden');
            const res = await window.api.exportAccount(currentAccountId);
            if (res && res.success) {
                showSuccess(translations[currentLanguage].EXPORTED_LOGGING_OUT);
                setTimeout(() => logoutUser(), 1500);
            }
        };
    }

    if (logoutDeleteBtn) {
        logoutDeleteBtn.onclick = () => {
            console.log("[Profile] Permanent Delete Requested - Opening Verification Modal");
            if (logoutChoiceModal) logoutChoiceModal.classList.add('hidden');
            if (deleteAccountModal) {
                deleteConfirmInput.value = '';
                deleteAccountModal.classList.remove('hidden');
                deleteConfirmInput.focus();
            }
        };
    }

    // Import flow
    if (openImportModalBtn && importChoiceModal) {
        openImportModalBtn.onclick = () => {
            console.log("[Profile] Opening Import Choice Modal");
            importChoiceModal.classList.remove('hidden');
        };
    }
    if (closeImportModalBtn && importChoiceModal) {
        closeImportModalBtn.onclick = () => importChoiceModal.classList.add('hidden');
    }

    if (importParallaxBtn) {
        importParallaxBtn.onclick = async () => {
            console.log("[Profile] Import Parallax Vault Clicked");
            if (importChoiceModal) importChoiceModal.classList.add('hidden');
            const folder = await window.api.selectFolder();
            if (folder) {
                const res = await window.api.importAccount(folder);
                if (res.success) loadAccounts();
            }
        };
    }

    if (importSteamLibraryBtn) {
        importSteamLibraryBtn.onclick = () => {
            console.log("[Profile] Import Steam Library Clicked");
            if (importChoiceModal) importChoiceModal.classList.add('hidden');
            if (steamImportModal) steamImportModal.classList.remove('hidden');
        };
    }

    // Independent Export
    const profileExportBtn = document.getElementById('profileExportBtn');
    if (profileExportBtn) {
        profileExportBtn.onclick = async () => {
            console.log("[Profile] Independent Export Clicked");
            const res = await window.api.exportAccount(currentAccountId);
            if (res && res.success) {
                showSuccess(`${translations[currentLanguage].EXPORTED_TO} ${res.path}`);
            }
        };
    }

    // Wipe All Data (Danger Zone)
    // Support Enter key for verification inputs
    [deleteConfirmInput].forEach(inp => {
        if (inp) {
            inp.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    if (inp === deleteConfirmInput) confirmAccountDeleteFinalBtn.click();
                }
            };
        }
    });
}

// ================================================================
// LOGOUT
// ================================================================
function logoutUser() {
    currentAccountId = null;
    currentLibrary = [];
    gameGrid.innerHTML = '';

    // Determine screen to transition from
    let origin = profileDetailsScreen;
    if (!profileDetailsScreen.classList.contains('active')) origin = libraryScreen;

    transitionScreen(origin, gatewayScreen, () => {
        loadAccounts();
    });
}

// ================================================================
// GAME SEARCH & ADD
// ================================================================
async function handleGameSearch() {
    const query = gameSearchInput.value.trim();
    if (!query) return;

    gameSuggestions.innerHTML = '<div class="suggestion-item" style="opacity:0.5; cursor:default;">Searching Global & Steam...</div>';
    gameSuggestions.classList.remove('hidden');

    try {
        /* Two searches, and they must not be able to take each other
         * down. Steam's store search needs no key and finds anything
         * sold there; SteamGridDB needs one and finds everything else.
         *
         * Without a key the second returns { error: 'NO_API_KEY' } — an
         * object, not a list — and calling forEach on it threw, which
         * sent the whole function to its catch and discarded the Steam
         * results that had arrived perfectly well. Somebody with no key
         * saw the search fail completely rather than return the half
         * that works. Each side is now taken only if it is a list. */
        const settled = await Promise.allSettled([
            window.api.onlineSteamSearch(query),
            window.api.igdbNameSearch(query)
        ]);

        const listOf = (r) =>
            (r.status === 'fulfilled' && Array.isArray(r.value)) ? r.value : [];

        const steamResults = listOf(settled[0]);
        const globalResults = listOf(settled[1]);

        let combined = [];
        const seenNames = new Set();
        const lowQuery = query.toLowerCase();

        // 1. Merge and Deduplicate
        // Priority for Steam results in case of name clash (usually has appid)
        steamResults.forEach(r => {
            combined.push({ ...r, isGlobal: false });
            seenNames.add(r.name.toLowerCase());
        });

        globalResults.forEach(r => {
            if (!seenNames.has(r.name.toLowerCase())) {
                combined.push({ ...r, isGlobal: true });
                seenNames.add(r.name.toLowerCase());
            }
        });

        // 2. Advanced Ranking (Sorting)
        combined.sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();

            // A: Exact Match (Highest Priority)
            if (nameA === lowQuery && nameB !== lowQuery) return -1;
            if (nameB === lowQuery && nameA !== lowQuery) return 1;

            // B: Starts with Query
            const startsA = nameA.startsWith(lowQuery);
            const startsB = nameB.startsWith(lowQuery);
            if (startsA && !startsB) return -1;
            if (!startsA && startsB) return 1;

            // C: Contains Query
            const incA = nameA.includes(lowQuery);
            const incB = nameB.includes(lowQuery);
            if (incA && !incB) return -1;
            if (!incA && incB) return 1;

            // D: Alphabetical for consistency
            return nameA.localeCompare(nameB);
        });

        renderSuggestions(combined.slice(0, 10)); // Show top 10 hybrid results
    } catch (e) {
        console.error("Hybrid Search Error:", e);
        renderSuggestions([]);
    }
}

if (triggerSearchBtn) {
    triggerSearchBtn.addEventListener('click', handleGameSearch);
}

/* ----------------------------------------------------------------
   Saying what a missing key costs, where it costs it
   ----------------------------------------------------------------
   Without a SteamGridDB key the search still works — it just only
   knows what Steam sells. Somebody looking for a game from GOG or a
   disc got an empty list and no reason for it. The note appears only
   when the key is absent, only on the screen where it matters, and
   carries the two buttons that end the problem.
   ---------------------------------------------------------------- */
async function refreshKeyNotes() {
    const note = document.getElementById('addGameKeyNote');
    if (!note || !window.api.getApiKeys) return;
    try {
        const have = await window.api.getApiKeys();
        note.classList.toggle('hidden', !!(have && have.sgdb));
    } catch (e) { /* leave it hidden rather than guess */ }
}

if (document.getElementById('addGameGetKeyBtn')) {
    document.getElementById('addGameGetKeyBtn').onclick =
        () => window.api.openKeyPage('sgdb');
}

if (document.getElementById('addGameOpenApiBtn')) {
    document.getElementById('addGameOpenApiBtn').onclick = () => {
        if (addGameModal) addGameModal.classList.add('hidden');
        openMainSettings();
        const tab = document.querySelector('.settings-tab[data-tab="api"]');
        if (tab) tab.click();
    };
}

if (gameSearchInput) {
    gameSearchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleGameSearch();
        }
    });
}

function renderSuggestions(results) {
    if (!gameSuggestions) return;
    gameSuggestions.innerHTML = '';
    if (results.length === 0) {
        gameSuggestions.classList.add('hidden');
        return;
    }

    results.forEach(app => {
        const div = document.createElement('div');
        div.className = 'suggestion-item';

        /* Built as nodes rather than a template string. These names come
         * back from Steam and SteamGridDB — they are somebody else's
         * text, and a title containing markup would have been parsed as
         * markup. The layout that was set inline here lives in the
         * stylesheet now, where it can also stop long titles running off
         * the edge. */
        const name = document.createElement('span');
        name.className = 'suggestion-name';
        name.textContent = app.name;
        name.title = app.name;          // the full title, for the ones that are cut
        div.appendChild(name);

        if (app.isGlobal) {
            const tag = document.createElement('span');
            tag.className = 'global-tag';
            tag.textContent = 'GLOBAL';
            div.appendChild(tag);
        }

        div.onclick = async () => {
            gameSearchInput.value = app.name;
            selectedSteamApp = (app.appid) ? app : null; // Only set if it's a real Steam app
            gameSuggestions.classList.add('hidden');
            await executeAddGame(app.name, app.appid ? app : (app.isGlobal ? { name: app.name, appid: null } : null));
        };
        gameSuggestions.appendChild(div);
    });

    gameSuggestions.classList.remove('hidden');
}

async function executeAddGame(name, steamApp) {
    const newGame = {
        Id: generateUniqueId(),
        OriginalName: name,
        Name: name,
        Path: "",
        Category: 'Games',
        Platform: (steamApp && steamApp.appid) ? 'Steam' : 'PC',
        Status: 'Uninstalled',
        Cover: PLACEHOLDER_COVER,
        Banner: PLACEHOLDER_BANNER,
        Notes: translations[currentLanguage].ADD_STORY || 'Add your story here.',
        SteamAppId: (steamApp && steamApp.appid) ? steamApp.appid.toString() : ''
    };

    const success = await window.api.addGame(newGame);
    if (success) {
        // Start showing sync state IMMEDIATELY
        pendingAssetFetches.add(newGame.Id);

        await loadLibrary();
        closeGameSuggestions();
        addGameModal.classList.add('hidden');
        gameSearchInput.value = '';
        selectedSteamApp = null;
        handleFilters(); // Refresh display - will show "Syncing"

        // TRIGGER AUTO-FETCH FOR ALL GAMES
        autoFetchAssets(newGame.Id, name);
    }
}

async function autoFetchAssets(gameId, originalName) {
    try {
        // Fetch Cover
        const coverResults = await window.api.igdbSearch({ query: originalName, target: 'cover', specialCode: userProfile.SpecialCode });
        if (Array.isArray(coverResults) && coverResults.length > 0) {
            const coverPath = await window.api.igdbDownloadAsset(currentAccountId, coverResults[0].highRes);
            if (coverPath) {
                const game = currentLibrary.find(g => g.Id === gameId);
                if (game) {
                    game.Cover = coverPath;
                    await window.api.updateLibrary({ profile: userProfile, games: currentLibrary });
                    handleFilters(); // Refresh grid to show cover
                    if (detailsTitle.dataset.gameId === gameId) updateAssetPreviews(game);
                }
            }
        }

        // Fetch Banner
        const bannerResults = await window.api.igdbSearch({ query: originalName, target: 'banner', specialCode: userProfile.SpecialCode });
        if (Array.isArray(bannerResults) && bannerResults.length > 0) {
            const bannerPath = await window.api.igdbDownloadAsset(currentAccountId, bannerResults[0].highRes);
            if (bannerPath) {
                const game = currentLibrary.find(g => g.Id === gameId);
                if (game) {
                    game.Banner = bannerPath;
                    game.BannerTransform = { x: 0, y: 0, s: 1 };
                    await window.api.updateLibrary({ profile: userProfile, games: currentLibrary });
                    if (detailsTitle.dataset.gameId === gameId) {
                        updateAssetPreviews(game);
                        applyBannerToUI(game);
                    }
                }
            }
        }
    } catch (e) {
        console.error("Auto-fetch failed:", e);
    } finally {
        pendingAssetFetches.delete(gameId);
        // Important: Use setTimeout to ensure UI has finished any other work 
        // and has a chance to show the final state
        setTimeout(() => handleFilters(), 100);
    }
}

// Manual Add button was removed in favor of integrated search results

if (cancelAddGameBtn) {
    cancelAddGameBtn.addEventListener('click', () => {
        closeGameSuggestions();
        addGameModal.classList.add('hidden');
        gameSearchInput.value = '';
        selectedSteamApp = null;
    });
}

/* ----------------------------------------------------------------
   Dismissing the game suggestions
   ----------------------------------------------------------------
   The list is drawn above the panel it belongs to — it has to be, or
   it would be clipped — and it is long enough to reach past the
   bottom of that panel and cover Cancel. Nothing closed it, so once
   it had opened there was no way out of the dialog but to pick
   something.

   Three ways out now, which are the three a list like this is
   expected to have: press Escape, click anywhere else, or empty the
   field it came from.
   ---------------------------------------------------------------- */
function closeGameSuggestions() {
    if (gameSuggestions) gameSuggestions.classList.add('hidden');
}

if (gameSuggestions) {
    document.addEventListener('click', (e) => {
        if (gameSuggestions.classList.contains('hidden')) return;
        const el = e.target instanceof Element ? e.target : null;
        // A click inside the list is a choice; on the field or its
        // button, an attempt to search again. Anything else dismisses.
        if (el && (el.closest('#gameSuggestions') ||
                   el.closest('#gameSearchInput') ||
                   el.closest('#triggerSearchBtn'))) return;
        closeGameSuggestions();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeGameSuggestions();
    });

    gameSearchInput.addEventListener('input', () => {
        if (!gameSearchInput.value.trim()) closeGameSuggestions();
    });
}

if (newAccountNameInput) {
    newAccountNameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmAccountCreationBtn.click();
    });
}

// ================================================================
// ACCOUNT DELETION
// ================================================================

/**
 * The delete button no longer exists on every screen — it was taken
 * out of the markup when the account modals were reworked. This ran
 * unguarded and threw on null, and because it is called partway
 * through leaving profile edit mode, the throw aborted the rest of
 * that function: the new name was read afterwards, so editing your
 * name silently did nothing at all.
 */
function resetAccountDeleteButton() {
    if (!deleteAccountInitBtn) return;
    deleteAccountInitBtn.classList.remove('confirm');
    deleteAccountInitBtn.textContent = translations[currentLanguage].DELETE_ACCOUNT;
}

if (deleteAccountInitBtn) {
    deleteAccountInitBtn.addEventListener('click', () => {
        if (!deleteAccountInitBtn.classList.contains('confirm')) {
            deleteAccountInitBtn.classList.add('confirm');
            deleteAccountInitBtn.textContent = translations[currentLanguage].ARE_YOU_SURE;
        } else {
            deleteConfirmInput.value = '';
            deleteAccountModal.classList.remove('hidden');
            deleteConfirmInput.focus();
            resetAccountDeleteButton(); // Reset the button text/state after opening modal
        }
    });
}

if (cancelAccountDeleteBtn) {
    cancelAccountDeleteBtn.addEventListener('click', () => {
        deleteAccountModal.classList.add('hidden');
    });
}

if (confirmAccountDeleteFinalBtn) {
    confirmAccountDeleteFinalBtn.addEventListener('click', async () => {
        try {
            console.log("[Delete] Final confirmation button clicked.");
            const input = deleteConfirmInput.value.trim();
            const LangDeleteWord = translations[currentLanguage].DELETE_WORD;

            if (input.toUpperCase() === LangDeleteWord.toUpperCase()) {
                console.log(`[Delete] Verification matched. Triggering IPC for: ${currentAccountId}`);
                const result = await window.api.deleteAccount(currentAccountId);

                if (result.success) {
                    console.log("[Delete] Success returned from Main.");
                    deleteAccountModal.classList.add('hidden');
                    if (isProfileEditMode) toggleProfileEditMode();

                    showSuccess(translations[currentLanguage].ACCOUNT_TERMINATED);
                    setTimeout(() => logoutUser(), 1000);
                } else {
                    console.error("[Delete] Error from Main:", result.error);
                    showError(`${translations[currentLanguage].DELETE_ACCOUNT_FAILED}${result.error ? ': ' + result.error : ''}`);
                }
            } else {
                console.warn(`[Delete] Input mismatch: ${input} != ${LangDeleteWord}`);
                showError(translations[currentLanguage].VERIFY_MISMATCH.replace('{word}', LangDeleteWord));
            }
        } catch (error) {
            console.error("[Delete] Unexpected Frontend Error:", error);
            showError(`${translations[currentLanguage].DELETE_ACCOUNT_FAILED}: ${error.message}`);
        }
    });
}

// Support Enter key for deletion verification
if (typeof deleteConfirmInput !== 'undefined' && deleteConfirmInput && typeof confirmAccountDeleteFinalBtn !== 'undefined' && confirmAccountDeleteFinalBtn) {
    deleteConfirmInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') confirmAccountDeleteFinalBtn.click();
    });
}

// ================================================================
// RECOVERY & EXPORT
// ================================================================

if (typeof recoveryBtn !== 'undefined' && recoveryBtn) {
    recoveryBtn.addEventListener('click', async () => {
        addAccountSelection.classList.add('hidden');
        accountRecoveryForm.classList.remove('hidden');
        await loadRecoveryList();
    });
}

if (typeof backToSelectionFromRecoveryBtn !== 'undefined' && backToSelectionFromRecoveryBtn) {
    backToSelectionFromRecoveryBtn.addEventListener('click', () => {
        accountRecoveryForm.classList.add('hidden');
        addAccountSelection.classList.remove('hidden');
    });
}

async function loadRecoveryList() {
    recoveryList.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 20px;">${translations[currentLanguage].SCANNING_VAULT}</div>`;
    const deleted = await window.api.getDeletedAccounts();
    recoveryList.innerHTML = '';

    if (deleted.length === 0) {
        recoveryList.innerHTML = `<div style="color: var(--text-secondary); text-align: center; padding: 20px; border: 1px dashed rgba(255,255,255,0.05);">${translations[currentLanguage].NO_RECOVERY}</div>`;
        return;
    }

    deleted.forEach(acc => {
        const item = document.createElement('div');
        item.style = "display: flex; justify-content: space-between; align-items: center; padding: 15px; background: rgba(255,255,255,0.03); border-radius: 8px; margin-bottom: 10px; border: 1px solid rgba(255,255,255,0.05);";

        const date = new Date(acc.time).toLocaleDateString();
        item.innerHTML = `
            <div>
                <strong style="display: block; color: #fff; font-size: 0.95rem;">${acc.name}</strong>
                <span style="font-size: 0.75rem; color: var(--text-secondary);">${translations[currentLanguage].DELETED_ON} ${date}</span>
            </div>
            <button class="m-btn primary" style="padding: 8px 15px; font-size: 0.7rem; letter-spacing: 1px; background: var(--accent); color: #000; border: none; border-radius: 4px; cursor: pointer; font-weight: 700;">${translations[currentLanguage].RESTORE}</button>
        `;

        item.querySelector('button').onclick = async () => {
            const res = await window.api.restoreAccount(acc.id);
            if (res.success) {
                addAccountModal.classList.add('hidden');
                accountRecoveryForm.classList.add('hidden');
                addAccountSelection.classList.remove('hidden');
                await loadAccounts();
                console.log(`Account restored as: ${res.name} `);
            } else {
                showError(`${translations[currentLanguage].RESTORE_FAILED}: ${res.error}`);
            }
        };

        recoveryList.appendChild(item);
    });
}

if (exportAccountBtn) {
    exportAccountBtn.addEventListener('click', async () => {
        const res = await window.api.exportAccount(currentAccountId);
        if (res && res.success) {
            console.log(`Exported to: ${res.path} `);
            // Successful export feedback could be added here
        } else if (res && !res.success) {
            showError(`${translations[currentLanguage].EXPORT_FAILED}: ${res.error}`);
        }
    });
}

// Update cancel modal to reset recovery state too
cancelAddAccountBtn.addEventListener('click', () => {
    addAccountModal.classList.add('hidden');
    accountCreationForm.classList.add('hidden');
    accountRecoveryForm.classList.add('hidden');
    addAccountSelection.classList.remove('hidden');
});

// ================================================================
// IGDB / STEAMGRIDDB DISCOVERY
// ================================================================

let igdbTarget = ''; // 'cover', 'banner', 'profile-photo', 'profile-banner'
let igdbRateLimitInterval = null;

function openIgdbDiscovery(target) {
    igdbTarget = target;
    igdbSearchModal.classList.remove('hidden');
    igdbResultsGrid.innerHTML = `<div class="loading-placeholder">${translations[currentLanguage].READY_TO_DISCOVER}</div>`;

    // Auto-fill search with current game name if applicable
    if (target === 'cover' || target === 'banner') {
        const gameId = detailsTitle.dataset.gameId;
        const game = currentLibrary.find(g => g.Id === gameId);
        const searchName = game ? (game.OriginalName || game.Name) : detailsTitle.innerText.trim();

        if (searchName !== translations[currentLanguage].NEW_ENTRY && searchName !== 'New Masterpiece' && searchName !== 'GAME NAME') {
            igdbSearchInput.value = searchName;
        }
    }
    igdbSearchInput.focus();
}

async function performIgdbSearch() {
    const query = igdbSearchInput.value.trim();
    if (!query) return;

    igdbResultsGrid.innerHTML = `<div class="loading-placeholder">${translations[currentLanguage].SEARCHING_IGDB || 'Searching IGDB...'}</div>`;

    if (igdbRateLimitInterval) clearInterval(igdbRateLimitInterval);
    let results;
    try {
        results = await window.api.igdbSearch({
            query,
            target: igdbTarget,
            specialCode: userProfile.SpecialCode
        });

    } catch (e) {
        console.error("IGDB Search Error:", e);
        igdbResultsGrid.innerHTML = `
            <div class="loading-placeholder">
                <p>Search Failed</p>
                <p style="font-size:0.6rem; margin-top:5px; opacity:0.6;">Check your connection or API keys.</p>
            </div>`;
        return;
    }

    if (results.error === 'RATE_LIMIT') {
        let timeLeft = results.nextAvailable;
        igdbResultsGrid.innerHTML = `
            <div class="loading-placeholder">
                <p>Discovery Overload</p>
                <p style="font-size:0.6rem; margin-top:5px; opacity:0.6;">Please wait <span id="rateLimitTimer">${timeLeft}</span>s before searching again.</p>
            </div>`;

        igdbRateLimitInterval = setInterval(() => {
            timeLeft--;
            const timerSpan = document.getElementById('rateLimitTimer');
            if (timerSpan) timerSpan.innerText = timeLeft;
            if (timeLeft <= 0) {
                clearInterval(igdbRateLimitInterval);
                igdbResultsGrid.innerHTML = '<div class="loading-placeholder">Limit reset. You can search again.</div>';
            }
        }, 1000);
        return;
    }

    if (results.error === 'AUTH_REQUIRED' || results.error === 'CONFIG_MISSING' || results.error === 'API_KEY_INVALID') {
        const errorMsg = results.error === 'API_KEY_INVALID' ? (translations[currentLanguage].INVALID_API_KEY || "Invalid API Key") : translations[currentLanguage].API_KEY_REQUIRED;
        igdbResultsGrid.innerHTML = `
            <div class="loading-placeholder">
                <p>${errorMsg}</p>
                <button onclick="openIgdbConfig()" class="confirm-btn" style="margin-top:15px; padding: 8px 20px;">${translations[currentLanguage].SETTINGS}</button>
            </div>`;
        return;
    }

    if (results.error === 'FETCH_ERROR') {
        igdbResultsGrid.innerHTML = `
            <div class="loading-placeholder">
                <p>Connection Error</p>
                <p style="font-size:0.6rem; margin-top:5px; opacity:0.6;">${results.message || ""}</p>
            </div>`;
        return;
    }

    if (results.error === 'API_ERROR' || results.error === 'NON_JSON_RESPONSE') {
        igdbResultsGrid.innerHTML = `
            <div class="loading-placeholder">
                <p>Service Error</p>
                <p style="font-size:0.6rem; margin-top:5px; opacity:0.6;">SteamGridDB returned an unexpected response (${results.status || 'HTML'}).</p>
            </div>`;
        return;
    }

    if (!Array.isArray(results) || results.length === 0) {
        igdbResultsGrid.innerHTML = `<div class="loading-placeholder">No games found on SteamGridDB.</div>`;
        return;
    }

    igdbResultsGrid.innerHTML = '';

    // Switch grid layout based on target
    const isWideTarget = igdbTarget === 'banner' || igdbTarget === 'profile-banner';
    if (isWideTarget) {
        igdbResultsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(320px, 1fr))';
    } else {
        igdbResultsGrid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(130px, 1fr))';
    }

    const currentSearchTarget = igdbTarget;

    results.forEach(asset => {
        const card = document.createElement('div');
        card.className = `igdb-result-card ${isWideTarget ? 'wide-card' : ''}`;
        card.innerHTML = `
            <img src="${asset.thumb}" class="igdb-result-img" loading="lazy" onerror="this.src='../Vault_Assets/default_cover.png'">
                <div class="igdb-result-info">
                    <div class="igdb-result-name">${asset.name}</div>
                </div>
        `;
        card.onclick = () => downloadIgdbAsset(asset.highRes, currentSearchTarget);
        igdbResultsGrid.appendChild(card);
    });
}

async function downloadIgdbAsset(imageUrl, targetContext) {
    igdbSearchModal.classList.add('hidden');
    const gameId = detailsTitle.dataset.gameId;

    if (gameId && (targetContext === 'cover' || targetContext === 'banner')) {
        pendingAssetFetches.add(gameId);
        handleFilters();
        updateAssetPreviews({ Id: gameId });
        if (targetContext === 'banner') applyBannerToUI({ Id: gameId });
    }

    const vaultPath = await window.api.igdbDownloadAsset(currentAccountId, imageUrl);

    if (vaultPath) {
        if (targetContext === 'cover') {
            const game = currentLibrary.find(g => g.Id === gameId);
            if (game) {
                game.Cover = vaultPath;
                if (gameId) pendingAssetFetches.delete(gameId);
                previewCover.src = resolvePath(vaultPath);
                updateAssetPreviews(game);
                renderGames(currentLibrary);
                await saveGameChanges();
            }
        } else if (targetContext === 'banner') {
            const game = currentLibrary.find(g => g.Id === gameId);
            if (game) {
                game.Banner = vaultPath;
                game.BannerTransform = { x: 0, y: 0, s: 1 };
                if (gameId) pendingAssetFetches.delete(gameId);
                updateAssetPreviews(game);
                applyBannerToUI(game);
                await saveGameChanges();
            }
        } else if (targetContext === 'profile-photo') {
            userProfile.avatar = vaultPath;
            userProfile.avatarTransform = { x: 0, y: 0, s: 1 };
            applyProfileToUI();
            openAdjuster('avatar', vaultPath);
        } else if (targetContext === 'profile-banner') {
            userProfile.banner = vaultPath;
            userProfile.bannerTransform = { x: 0, y: 0, s: 1 };
            applyProfileToUI();
            openAdjuster('banner', vaultPath);
        }
    } else {
        if (gameId) pendingAssetFetches.delete(gameId);
        handleFilters();
        showError(translations[currentLanguage].API_DOWNLOAD_ERROR || "An error occurred while downloading the asset.");
    }
}

// ================================================================
// SETTINGS
// ================================================================

async function openMainSettings() {
    console.log("Opening Settings Modal...");



    // Default to first tab if exists
    if (settingsTabs.length > 0 && settingsPanes.length > 0) {
        settingsTabs.forEach(t => t.classList.remove('active'));
        settingsPanes.forEach(p => p.classList.remove('active'));
        settingsTabs[0].classList.add('active');
        settingsPanes[0].classList.add('active');
    }

    if (mainSettingsModal) mainSettingsModal.classList.remove('hidden');
}

if (closeMainSettingsModalBtn) closeMainSettingsModalBtn.onclick = () => mainSettingsModal.classList.add('hidden');

settingsTabs.forEach(tab => {
    tab.onclick = () => {
        const target = tab.getAttribute('data-tab');
        settingsTabs.forEach(t => t.classList.remove('active'));
        settingsPanes.forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        const pane = document.getElementById(`settings-${target}`);
        if (pane) pane.classList.add('active');
    };
});

// Global scope for onclick handlers
window.openMainSettings = openMainSettings;

if (findCoverBtnAsset) findCoverBtnAsset.onclick = () => openIgdbDiscovery('cover');
if (findBannerBtnAsset) findBannerBtnAsset.onclick = () => openIgdbDiscovery('banner');

if (igdbSearchBtn) igdbSearchBtn.onclick = performIgdbSearch;
if (igdbSearchInput) {
    igdbSearchInput.onkeydown = (e) => { if (e.key === 'Enter') performIgdbSearch(); };
}

if (closeIgdbSearchBtn) {
    closeIgdbSearchBtn.onclick = () => {
        igdbSearchModal.classList.add('hidden');
        if (igdbRateLimitInterval) clearInterval(igdbRateLimitInterval);
    };
}

if (openMainSettingsBtn) openMainSettingsBtn.onclick = openMainSettings;
if (openIgdbConfigBtn) openIgdbConfigBtn.onclick = openMainSettings;

// --- Auto-Save Settings ---
async function saveAppSettings() {
    await window.api.appSetSettings(appSettings);
}

if (appLanguageSelect) {
    appLanguageSelect.onchange = async () => {
        appSettings.language = appLanguageSelect.value;
        currentLanguage = appSettings.language;
        await saveAppSettings();
        translateApp();
        applyProfileToUI();
    };
}

const checkUiSounds = document.getElementById('settingUiSounds');
const sliderUiVolume = document.getElementById('settingUiVolume');
const labelUiVolume = document.getElementById('uiVolumeValue');
const rowUiVolume = document.getElementById('uiVolumeRow');

/**
 * Puts the slider, its readout and its dimmed state in agreement.
 * Looks the elements up itself rather than closing over the consts
 * above: settings are applied during start-up, which can run before
 * this point in the file, and a const read too early throws.
 */
function applyVolumeToUI() {
    const v = appSettings.uiVolume;
    const slider = document.getElementById('settingUiVolume');
    const label = document.getElementById('uiVolumeValue');
    const row = document.getElementById('uiVolumeRow');
    if (slider) slider.value = v;
    if (label) label.textContent = v;
    if (row) row.classList.toggle('is-off', !appSettings.uiSounds);
}

if (checkUiSounds) {
    checkUiSounds.onchange = async () => {
        appSettings.uiSounds = checkUiSounds.checked;
        if (window.SFX) {
            window.SFX.setEnabled(appSettings.uiSounds);
            // Play the switch itself, so turning it on demonstrates
            // what was turned on instead of only promising it.
            if (appSettings.uiSounds) window.SFX.play('toggleOn');
        }
        applyVolumeToUI();
        await saveAppSettings();
    };
}

if (sliderUiVolume) {
    // `input` rather than `change`, so the level follows the handle
    // while it is being dragged — the only way to hear what you are
    // setting is to hear it as you set it.
    sliderUiVolume.addEventListener('input', () => {
        appSettings.uiVolume = Number(sliderUiVolume.value);
        if (labelUiVolume) labelUiVolume.textContent = appSettings.uiVolume;
        if (window.SFX) {
            window.SFX.setVolume(appSettings.uiVolume);
            window.SFX.play('tap');
        }
    });
    // Dragging fires `input` continuously; the file is only written
    // once the handle is let go.
    sliderUiVolume.addEventListener('change', () => saveAppSettings());
}

const checkNotInstalled = document.getElementById('settingShowNotInstalled');
if (checkNotInstalled) {
    checkNotInstalled.onchange = async () => {
        appSettings.showNotInstalledLabel = checkNotInstalled.checked;
        await saveAppSettings();
        handleFilters();
    };
}

const checkShowPlaytime = document.getElementById('settingShowPlaytime');
if (checkShowPlaytime) {
    checkShowPlaytime.onchange = async () => {
        appSettings.showPlaytimeOnCard = checkShowPlaytime.checked;
        await saveAppSettings();
        handleFilters();
    };
}

// Theme Selection Listeners (Auto-save)
document.querySelectorAll('.theme-palette .theme-swatch').forEach(swatch => {
    swatch.onclick = async () => {
        appSettings.ambientRgb = swatch.dataset.rgb;
        applyTheme();
        await saveAppSettings();
    };
});

const resetThemeBtn = document.getElementById('resetThemeBtn');
if (resetThemeBtn) {
    resetThemeBtn.onclick = async () => {
        appSettings.ambientRgb = '60, 110, 180';
        applyTheme();
        await saveAppSettings();
    };
}

// ================================================================
// STEAM IMPORT
// ================================================================
if (importSteamProfileBtn) {
    importSteamProfileBtn.onclick = () => {
        steamImportModal.classList.remove('hidden');
        steamIdInput.focus();
    };
}

if (cancelSteamImportBtn) {
    cancelSteamImportBtn.onclick = () => steamImportModal.classList.add('hidden');
}

if (confirmSteamImportBtn) {
    confirmSteamImportBtn.onclick = async () => {
        const steamId = steamIdInput.value.trim();
        if (!steamId) return;

        confirmSteamImportBtn.disabled = true;
        confirmSteamImportBtn.innerText = "...";

        const result = await window.api.steamFetchGames(steamId);

        if (result.success) {
            pendingSteamGames = result.games;
            steamImportModal.classList.add('hidden');
            renderSteamPreviewList();
            steamPreviewModal.classList.remove('hidden');
        } else {
            showError(translations[currentLanguage].STEAM_IMPORT_ERROR + "\n" + result.error);
        }

        confirmSteamImportBtn.disabled = false;
        confirmSteamImportBtn.innerText = translations[currentLanguage].CONFIRM;
    };
}

function renderSteamPreviewList() {
    steamPreviewList.innerHTML = '';

    const searchTerm = document.getElementById('steamPreviewSearch').value.toLowerCase();
    const sortValue = document.getElementById('steamPreviewSort').value;

    let displayGames = [...pendingSteamGames];

    // Filter
    if (searchTerm) {
        displayGames = displayGames.filter(g => g.name.toLowerCase().includes(searchTerm));
    }

    // Sort
    if (sortValue === 'name') {
        displayGames.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortValue === 'playtime') {
        displayGames.sort((a, b) => b.playtime_forever - a.playtime_forever);
    }

    displayGames.forEach((game) => {
        const row = document.createElement('div');
        row.className = 'steam-preview-row';
        row.style = "display: flex; justify-content: space-between; align-items: center; padding: 15px 20px; border-bottom: 1px solid rgba(255,255,255,0.03);";

        row.innerHTML = `
            <div style="display: flex; flex-direction: column;">
                <span style="font-size: 0.95rem; color: #fff; font-weight: 500; letter-spacing: 0.5px;">${game.name}</span>
            </div>
            <button class="delete-game-btn" style="padding: 6px 14px; font-size: 0.65rem; border-radius: 6px; background: rgba(255,50,50,0.05); color: #ff4444; border: 1px solid rgba(255,50,50,0.1); cursor: pointer; transition: all 0.2s ease;">X</button>
        `;

        row.querySelector('button').onclick = () => {
            const idx = pendingSteamGames.findIndex(g => g.appid === game.appid);
            if (idx !== -1) {
                pendingSteamGames.splice(idx, 1);
                renderSteamPreviewList();
            }
        };

        steamPreviewList.appendChild(row);
    });
}

// Add event listeners for Steam preview filters
if (document.getElementById('steamPreviewSearch')) {
    document.getElementById('steamPreviewSearch').oninput = renderSteamPreviewList;
}
if (document.getElementById('steamPreviewSort')) {
    document.getElementById('steamPreviewSort').onchange = renderSteamPreviewList;
}


if (cancelSteamPreviewBtn) {
    cancelSteamPreviewBtn.onclick = () => steamPreviewModal.classList.add('hidden');
}

if (confirmSteamPreviewBtn) {
    confirmSteamPreviewBtn.onclick = async () => {
        if (pendingSteamGames.length === 0) return;

        confirmSteamPreviewBtn.disabled = true;
        const originalText = confirmSteamPreviewBtn.innerText;
        confirmSteamPreviewBtn.innerText = "...";

        try {
            const localPaths = await window.api.steamFindLocalPaths(pendingSteamGames);

            const gamesToImport = pendingSteamGames.map(game => {
                const localPath = localPaths[game.appid];
                return {
                    Name: game.name,
                    Platform: 'Steam',
                    Status: localPath ? 'Installed' : 'Uninstalled',
                    Path: localPath || '',
                    // Without this the game cannot be addressed later:
                    // no Steam launch, and no artwork from Steam's CDN.
                    // It was in hand the whole time and never written.
                    SteamAppId: game.appid ? String(game.appid) : '',
                    PlayTime: (game.playtime_forever / 60).toFixed(1),
                    Category: 'Steam Library',
                    Notes: translations[currentLanguage].STEAM_IMPORT_NOTES
                };
            });

            await window.api.bulkAddGames({ profile: currentAccountId, games: gamesToImport });
            triggerVaultCleanup();

            if (steamPreviewModal) steamPreviewModal.classList.add('hidden');
            await loadLibrary();
            showSuccess(translations[currentLanguage].STEAM_IMPORT_SUCCESS || "Import successful!");

            // A library that lands as two hundred grey placeholders does
            // not look like the import worked. Unless it was turned off,
            // the covers are fetched straight away — and each one goes
            // onto its card as it arrives, so the shelf visibly fills.
            const wantArt = document.getElementById('importFillArtwork');
            if (!wantArt || wantArt.checked) fillArtworkForLibrary();
        } catch (e) {
            console.error(e);
            showError(translations[currentLanguage].STEAM_CONNECTION_ERROR);
        } finally {
            confirmSteamPreviewBtn.disabled = false;
            confirmSteamPreviewBtn.innerText = originalText;
        }
    }
}


async function initAll() {
    await initApp();
    triggerVaultCleanup();
}

initAll();

// Side Nav Initializers
// switchAccountBtn logic moved to line 580 for consistency

const sideSettingsBtn = document.getElementById('sideSettingsBtn');
if (sideSettingsBtn) {
    sideSettingsBtn.onclick = () => {
        if (typeof openMainSettings === 'function') openMainSettings();
    };
}



/* ================================================================
   PLATFORM AWARENESS
   ================================================================
   The launcher asks the main process what machine it is on, then
   shows and offers only what that machine can actually do. On
   Windows the Linux compatibility controls are not disabled — they
   are not there at all, because an option you can never use is
   just noise.
   ================================================================ */

let platformInfo = null;

async function loadPlatformInfo() {
    try {
        platformInfo = await window.api.getPlatformInfo();
    } catch (e) {
        console.error('[Platform] okunamadı', e);
        platformInfo = { os: 'unknown', isLinux: false };
    }

    // Hide everything that only makes sense on Linux.
    if (!platformInfo.isLinux) {
        document.querySelectorAll('.props-linux-only').forEach(el => el.classList.add('hidden'));
    }

    renderSystemPane();
    return platformInfo;
}

function renderSystemPane() {
    const readout = document.getElementById('sysReadout');
    if (!readout || !platformInfo) return;

    const p = platformInfo;
    const t = translations[currentLanguage];
    const none = t.NONE_FOUND || 'none found';

    const rows = [
        [t.OPERATING_SYSTEM || 'Operating system', `${p.os} · ${p.arch}`],
        [t.KERNEL || 'Kernel', p.release || '—'],
        [t.STEAM || 'Steam', p.steamRoot || (t.NOT_FOUND || 'not found')],
        [t.STEAM_LIBRARIES || 'Steam libraries',
            (p.steamLibraries && p.steamLibraries.length) ? String(p.steamLibraries.length) : '0'],
        [t.GAMES_INSTALLED || 'Games installed', String(p.installedSteamApps ?? 0)]
    ];

    if (p.isLinux) {
        rows.push([t.PROTON_BUILDS || 'Proton builds', (p.proton && p.proton.length) ? p.proton.join(', ') : none]);
        rows.push(['Wine', p.wine ? (t.AVAILABLE || 'available') : none]);
        for (const w of (p.wrappers || [])) {
            rows.push([w.label, w.available ? (t.AVAILABLE || 'available') : (t.NOT_INSTALLED_TOOL || 'not installed')]);
        }
    }

    readout.innerHTML = rows.map(([k, v]) => `
        <div class="sys-line">
            <span class="sys-key">${k}</span>
            <span class="sys-val">${escapeHtml(v)}</span>
        </div>`).join('');

    // Default Proton picker
    const sel = document.getElementById('defaultProtonSelect');
    if (sel) {
        const builds = p.proton || [];
        sel.innerHTML = `<option value="">${t.NEWEST_AVAILABLE || 'Newest available'}</option>` +
            builds.map(b => `<option value="${escapeHtml(b)}">${escapeHtml(b)}</option>`).join('');
        sel.value = appSettings.defaultProton || '';
        sel.disabled = builds.length === 0;
    }

    const gm = document.getElementById('globalGameModeToggle');
    const mh = document.getElementById('globalMangoHudToggle');
    const env = document.getElementById('defaultEnvInput');
    const dl = document.getElementById('directLaunchToggle');
    if (dl) dl.checked = !!appSettings.directLaunch;
    if (gm) gm.checked = !!appSettings.gameMode;
    if (mh) mh.checked = !!appSettings.mangoHud;
    if (env) env.value = (appSettings.defaultEnv || '').replace(/\\n/g, '\n');

    // A tool that is not installed cannot be switched on.
    const wrapperState = {};
    for (const w of (p.wrappers || [])) wrapperState[w.id] = w.available;
    if (gm) gm.disabled = p.isLinux ? !wrapperState.gamemode : true;
    if (mh) mh.disabled = p.isLinux ? !wrapperState.mangohud : true;

    // On Windows and macOS none of this section applies.
    document.querySelectorAll('#settings-system .settings-row-checkbox, #settings-system .sys-row')
        .forEach(el => el.classList.toggle('hidden', !p.isLinux));
}

function escapeHtml(v) {
    return String(v ?? '').replace(/[&<>"']/g, c =>
        ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

function saveSystemSettings() {
    const sel = document.getElementById('defaultProtonSelect');
    const gm = document.getElementById('globalGameModeToggle');
    const mh = document.getElementById('globalMangoHudToggle');
    const env = document.getElementById('defaultEnvInput');

    const dl = document.getElementById('directLaunchToggle');
    if (dl) appSettings.directLaunch = dl.checked;
    if (sel) appSettings.defaultProton = sel.value;
    if (gm) appSettings.gameMode = gm.checked;
    if (mh) appSettings.mangoHud = mh.checked;
    if (env) appSettings.defaultEnv = env.value.replace(/\n/g, '\\n');

    window.api.appSetSettings(appSettings);
}

['defaultProtonSelect', 'globalGameModeToggle', 'globalMangoHudToggle', 'defaultEnvInput', 'directLaunchToggle']
    .forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('change', saveSystemSettings);
    });

const rescanBtn = document.getElementById('rescanInstalledBtn');
if (rescanBtn) {
    rescanBtn.onclick = async () => {
        const out = document.getElementById('rescanResult');
        const t = translations[currentLanguage];
        rescanBtn.disabled = true;
        if (out) out.textContent = t.SCANNING || 'Reading Steam’s install records…';

        const res = await window.api.scanInstalled();
        rescanBtn.disabled = false;

        if (!res.success) {
            if (out) out.textContent = (t.SCAN_FAILED || 'Scan failed') + ': ' + res.error;
            return;
        }
        if (out) {
            out.textContent = (t.SCAN_DONE ||
                'Matched {matched} installed, linked {linked} to Steam, marked {dropped} as missing.')
                .replace('{matched}', res.matched)
                .replace('{linked}', res.linked)
                .replace('{dropped}', res.dropped);
        }
        await loadLibrary();
    };
}


/* ================================================================
   GAME PROPERTIES
   ================================================================
   Per-game compatibility. Everything here is optional: a game with
   nothing set follows the defaults in Settings > System, and a game
   with nothing set anywhere follows whatever the machine suggests.

   The preview line at the bottom is the reason the screen is worth
   having — it shows the exact command the launcher will run, so
   changing a setting has a visible consequence before you commit.
   ================================================================ */

const gamePropsModal = document.getElementById('gamePropsModal');
const propsFields = {
    name: document.getElementById('propsGameName'),
    tool: document.getElementById('propsCompatTool'),
    hint: document.getElementById('propsCompatHint'),
    options: document.getElementById('propsLaunchOptions'),
    prefix: document.getElementById('propsWinePrefix'),
    env: document.getElementById('propsEnvVars'),
    gameMode: document.getElementById('propsGameMode'),
    mangoHud: document.getElementById('propsMangoHud'),
    preview: document.getElementById('propsPreview'),
    prefixField: document.getElementById('propsPrefixField')
};

let propsGameId = null;

function buildCompatOptions(game) {
    const t = translations[currentLanguage];
    const p = platformInfo || {};
    const opts = [];

    const hasAppId = !!(game && game.SteamAppId);
    opts.push({
        v: 'auto',
        label: hasAppId
            ? (t.COMPAT_AUTO_STEAM || 'Automatic — hand to Steam')
            : (t.COMPAT_AUTO || 'Automatic')
    });
    opts.push({ v: 'native', label: t.COMPAT_NATIVE || 'Run the game directly' });

    if (p.isLinux) {
        for (const build of (p.proton || [])) opts.push({ v: build.toLowerCase(), label: build });
        if (p.wine) opts.push({ v: 'wine', label: 'Wine' });
    }
    return opts;
}

function compatHintFor(value, game) {
    const t = translations[currentLanguage];
    if (value === 'auto') {
        return (game && game.SteamAppId)
            ? (t.HINT_AUTO_STEAM || 'Steam starts the game, so it handles Proton, cloud saves and the overlay. Playtime is counted by Steam, not here.')
            : (t.HINT_AUTO || 'The launcher picks the best way to start this game on this machine.');
    }
    if (value === 'native') return t.HINT_NATIVE || 'Runs the game file directly, bypassing Steam. Playtime is counted here.';
    if (value === 'wine') return t.HINT_WINE || 'Runs the Windows build through Wine.';
    return t.HINT_PROTON || 'Runs the Windows build through this Proton version, in its own Windows prefix.';
}

async function refreshPropsPreview() {
    if (!propsFields.preview) return;
    const game = currentLibrary.find(g => g.Id === propsGameId);
    if (!game) return;

    const draft = Object.assign({}, game, collectPropsDraft());
    const plan = await window.api.previewLaunch(draft);
    const t = translations[currentLanguage];

    if (!plan || plan.kind === 'none') {
        propsFields.preview.textContent = launchFailureMessage(plan && plan.reason);
        propsFields.preview.classList.add('props-preview-bad');
        return;
    }
    propsFields.preview.classList.remove('props-preview-bad');

    let text = plan.command;
    const envKeys = Object.keys(plan.env || {});
    if (envKeys.length) text = envKeys.map(k => `${k}=${plan.env[k]}`).join(' ') + ' ' + text;
    propsFields.preview.textContent = text;

    if (propsFields.hint) {
        // The 'auto' hint already explains that Steam counts the time,
        // so only the other modes need the note appended.
        const needsNote = !plan.tracked && propsFields.tool.value !== 'auto';
        propsFields.hint.textContent = compatHintFor(propsFields.tool.value, game) +
            (needsNote ? ' ' + (t.NOT_TRACKED || 'Playtime will not be counted for this one.') : '');
    }
}

function collectPropsDraft() {
    return {
        CompatTool: propsFields.tool ? propsFields.tool.value : 'auto',
        LaunchOptions: propsFields.options ? propsFields.options.value.trim() : '',
        WinePrefix: propsFields.prefix ? propsFields.prefix.value.trim() : '',
        EnvVars: propsFields.env ? propsFields.env.value.replace(/\n/g, '\\n') : '',
        UseGameMode: propsFields.gameMode ? propsFields.gameMode.value : 'inherit',
        UseMangoHud: propsFields.mangoHud ? propsFields.mangoHud.value : 'inherit'
    };
}

function openGameProperties(game) {
    if (!game || !gamePropsModal) return;
    propsGameId = game.Id;

    if (propsFields.name) propsFields.name.textContent = game.Name || '';

    if (propsFields.tool) {
        const opts = buildCompatOptions(game);
        propsFields.tool.innerHTML = opts
            .map(o => `<option value="${escapeHtml(o.v)}">${escapeHtml(o.label)}</option>`).join('');
        const stored = (game.CompatTool || 'auto').toLowerCase();
        propsFields.tool.value = opts.some(o => o.v === stored) ? stored : 'auto';
    }

    if (propsFields.options) propsFields.options.value = game.LaunchOptions || '';
    if (propsFields.prefix) propsFields.prefix.value = game.WinePrefix || '';
    if (propsFields.env) propsFields.env.value = (game.EnvVars || '').replace(/\\n/g, '\n');
    if (propsFields.gameMode) propsFields.gameMode.value = game.UseGameMode || 'inherit';
    if (propsFields.mangoHud) propsFields.mangoHud.value = game.UseMangoHud || 'inherit';

    updatePrefixVisibility();
    gamePropsModal.classList.remove('hidden');
    refreshPropsPreview();
}

// The prefix only means anything when a Windows runtime is involved.
function updatePrefixVisibility() {
    if (!propsFields.prefixField || !propsFields.tool) return;
    const v = propsFields.tool.value;
    const windowsRuntime = (v !== 'native' && v !== 'auto') || v === 'wine';
    const relevant = (platformInfo && platformInfo.isLinux) && windowsRuntime;
    propsFields.prefixField.classList.toggle('hidden', !relevant);
}

function closeGameProperties() {
    if (gamePropsModal) gamePropsModal.classList.add('hidden');
    propsGameId = null;
}

async function saveGameProperties() {
    const game = currentLibrary.find(g => g.Id === propsGameId);
    if (!game) return closeGameProperties();

    Object.assign(game, collectPropsDraft());
    await window.api.updateLibrary({ profile: userProfile, games: currentLibrary });
    closeGameProperties();
    showSuccess(translations[currentLanguage].PROPS_SAVED || 'Properties saved.');
}

// --- wiring ---
const gamePropsBtn = document.getElementById('gamePropsBtn');
if (gamePropsBtn) {
    gamePropsBtn.onclick = () => {
        const game = currentLibrary.find(g => g.Id === detailsTitle.dataset.gameId);
        openGameProperties(game);
    };
}

['propsCloseBtn', 'propsCancelBtn', 'gamePropsOverlay'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.onclick = closeGameProperties;
});

const propsSaveBtn = document.getElementById('propsSaveBtn');
if (propsSaveBtn) propsSaveBtn.onclick = saveGameProperties;

if (propsFields.tool) {
    propsFields.tool.addEventListener('change', () => {
        updatePrefixVisibility();
        refreshPropsPreview();
    });
}

['options', 'prefix', 'env', 'gameMode', 'mangoHud'].forEach(k => {
    const el = propsFields[k];
    if (!el) return;
    el.addEventListener('change', refreshPropsPreview);
    el.addEventListener('input', debouncePreview);
});

let previewTimer = null;
function debouncePreview() {
    clearTimeout(previewTimer);
    previewTimer = setTimeout(refreshPropsPreview, 220);
}

const propsBrowsePrefix = document.getElementById('propsBrowsePrefix');
if (propsBrowsePrefix) {
    propsBrowsePrefix.onclick = async () => {
        const folder = await window.api.selectFolder();
        if (folder && propsFields.prefix) {
            propsFields.prefix.value = folder;
            refreshPropsPreview();
        }
    };
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && gamePropsModal && !gamePropsModal.classList.contains('hidden')) {
        closeGameProperties();
    }
});

// The gateway is what is on screen before any transition happens.
document.body.dataset.screen =
    (document.querySelector('.screen.active') || {}).id || 'gateway';

loadPlatformInfo();


/* ================================================================
   ARTWORK BACKFILL
   ================================================================
   Steam's CDN serves the official cover and banner for anything it
   sells, addressed by app id, with no key and no quota. So a freshly
   imported library has no reason to be a wall of blank cards.
   ================================================================ */

const fillArtworkBtn = document.getElementById('fillArtworkBtn');
const artworkResult = document.getElementById('artworkResult');

if (window.api.onArtworkProgress) {
    window.api.onArtworkProgress(({ done, total, name, id, cover, banner }) => {
        if (artworkResult) artworkResult.textContent = `${done} / ${total} — ${name}`;

        /* Each cover goes onto its card the moment it lands, rather
         * than the whole library changing at the end. Filling two
         * hundred of them takes minutes, and for all of that time the
         * shelf looked exactly as it had — no way to tell it was
         * working, or how far along it was. */
        if (!id) return;

        const game = currentLibrary.find(g => g.Id === id);
        if (game) {
            if (cover) game.Cover = cover;
            if (banner) game.Banner = banner;
        }

        const card = gameGrid && gameGrid.querySelector(`.game-card[data-id="${CSS.escape(id)}"]`);
        if (!card || !cover) return;

        const img = card.querySelector('.card-image');
        if (img) {
            img.src = resolvePath(cover);
            card.classList.add('art-arrived');
        }
        pendingAssetFetches.delete(id);
        const sync = card.querySelector('.asset-sync-overlay');
        if (sync) sync.remove();
    });
}

/**
 * Fetches whatever artwork is missing across the library.
 *
 * Called from the button in Settings, and on its own after an import or
 * after a game is added by hand — the two moments when a shelf is most
 * obviously bare. Never runs twice at once; the second caller is simply
 * ignored, because the first is already fetching everything missing.
 */
let artworkRunning = false;

async function fillArtworkForLibrary() {
    if (artworkRunning) return { success: false, error: 'ALREADY_RUNNING' };
    artworkRunning = true;
    try {
        return await window.api.backfillArtwork({ accountId: currentAccountId });
    } finally {
        artworkRunning = false;
    }
}

if (fillArtworkBtn) {
    fillArtworkBtn.onclick = async () => {
        const t = translations[currentLanguage];
        fillArtworkBtn.disabled = true;
        if (artworkResult) artworkResult.textContent = t.ARTWORK_STARTING || 'Asking Steam what it has…';

        const res = await fillArtworkForLibrary();
        fillArtworkBtn.disabled = false;

        if (!res.success) {
            const why = res.error === 'NO_STEAM_ACCOUNT'
                ? (t.NO_STEAM_ACCOUNT || 'No Steam account is signed in on this machine.')
                : res.error;
            if (artworkResult) artworkResult.textContent = (t.ARTWORK_FAILED || 'Could not fill artwork') + ': ' + why;
            return;
        }

        const parts = [];
        parts.push((t.ARTWORK_COVERS || '{n} covers').replace('{n}', res.covers));
        parts.push((t.ARTWORK_BANNERS || '{n} banners').replace('{n}', res.banners));
        if (res.linked) parts.push((t.ARTWORK_LINKED || '{n} newly linked to Steam').replace('{n}', res.linked));
        if (res.noArt && res.noArt.length) {
            // Without a SteamGridDB key the community half was never
            // searched, so say that rather than implying the artwork
            // does not exist.
            const key = res.hasSgdbKey ? 'ARTWORK_NONE' : 'ARTWORK_NONE_NO_KEY';
            const fallback = res.hasSgdbKey
                ? '{n} have no artwork anywhere'
                : '{n} still empty — add a SteamGridDB key to search community artwork';
            parts.push((t[key] || fallback).replace('{n}', res.noArt.length));
        }
        if (artworkResult) artworkResult.textContent = parts.join(' · ');

        await loadLibrary();
    };
}


/* ================================================================
   API KEYS
   ================================================================
   Nothing is bundled with the app. A key belongs to the person who
   generated it: Valve's terms make the holder responsible for
   everything done with theirs, and a key shipped inside an ASAR is
   readable by anyone who extracts it — so shipping one would hand
   every user a credential that stays the author's liability.

   Both are optional, and the launcher is useful without either.
   ================================================================ */

const keyFields = {
    steam: {
        input: document.getElementById('steamKeyInput'),
        save: document.getElementById('steamKeySave'),
        status: document.getElementById('steamKeyStatus')
    },
    sgdb: {
        input: document.getElementById('sgdbKeyInput'),
        save: document.getElementById('sgdbKeySave'),
        status: document.getElementById('sgdbKeyStatus')
    }
};

function paintKeyStatus(which, present) {
    const f = keyFields[which];
    if (!f || !f.status) return;
    const t = translations[currentLanguage];
    f.status.textContent = present ? (t.KEY_SET || 'set') : (t.KEY_NOT_SET || 'not set');
    f.status.classList.toggle('is-set', present);
    if (f.input) f.input.placeholder = present
        ? (t.KEY_STORED || '•••••••• stored — type a new one to replace')
        : (t.KEY_NONE || 'Not set');
}

async function loadApiKeyStatus() {
    if (!keyFields.steam.input) return;
    try {
        const state = await window.api.getApiKeys();
        paintKeyStatus('steam', state.steam);
        paintKeyStatus('sgdb', state.sgdb);
    } catch (e) { /* leave the fields blank */ }
}

function wireKeySave(which, field) {
    const f = keyFields[which];
    if (!f || !f.save) return;
    f.save.onclick = async () => {
        // The value is only ever sent one way. It is never read back
        // out of the main process, so it cannot end up in a log here.
        const res = await window.api.setApiKeys({ [field]: f.input.value });
        if (res.success) {
            f.input.value = '';
            paintKeyStatus('steam', res.steam);
            paintKeyStatus('sgdb', res.sgdb);
            showSuccess(translations[currentLanguage].KEY_SAVED || 'Key saved.');
        } else {
            showError(res.error || 'Could not save the key.');
        }
    };
}

wireKeySave('steam', 'steamKey');
wireKeySave('sgdb', 'sgdbKey');
loadApiKeyStatus();


/* ================================================================
   INSTALL VIA STEAM
   ================================================================
   Parallax does not download games and should not learn how. Steam
   already fetches, verifies and patches its own library, and it is
   the only thing entitled to — so an install is handed to it the
   same way a launch is.
   ================================================================ */

const installBtnEl = document.getElementById('installBtn');

function detailsGameForAction() {
    return currentLibrary.find(g => g.Id === detailsTitle.dataset.gameId);
}

if (installBtnEl) {
    installBtnEl.onclick = async () => {
        const game = detailsGameForAction();
        if (!game || !game.SteamAppId) return;

        const res = await window.api.steamUri('install', game.SteamAppId);
        if (!res.success) {
            showError(translations[currentLanguage].INSTALL_FAILED || `Could not reach Steam: ${res.error}`);
            return;
        }
        // Steam opens its own download dialog and waits for a click —
        // say so plainly, because otherwise nothing appears to happen
        // and the download never starts.
        showInfo(
            (translations[currentLanguage].INSTALL_INFO ||
             'Steam has opened its download window for <strong>{name}</strong>. ' +
             'Press <strong>Download</strong> there to start it.<br><br>' +
             'You can come back here afterwards — the progress will show on this screen, ' +
             'and the game switches to Play on its own when it finishes.')
                .replace('{name}', game.Name),
            translations[currentLanguage].INSTALL_INFO_TITLE || 'One step in Steam'
        );

        // Steam does the downloading, but you should not have to go and
        // watch it there — follow its own manifest and show it here.
        watchInstall(game);
    };
}

/* ----------------------------------------------------------------
   Steam writes, we read.
   Steam records its own download progress in the app manifest, so
   following that file lets the progress show up here. We are not
   doing the downloading — we are removing the need to go and watch
   Steam do it.
   ---------------------------------------------------------------- */

const installProgressEl = document.getElementById('installProgress');
const installFillEl = document.getElementById('installProgressFill');
const installTextEl = document.getElementById('installProgressText');
let installWatchTimer = null;
let installWatchId = null;

function humanBytes(n) {
    if (!n) return '0 MB';
    const gb = n / 1073741824;
    return gb >= 1 ? `${gb.toFixed(1)} GB` : `${Math.round(n / 1048576)} MB`;
}

/* ----------------------------------------------------------------
   Following an install that Steam is doing
   ----------------------------------------------------------------
   Pressing Install hands the job to Steam and nothing else happens
   here — no bar, no "waiting", no change to the button. Steam may
   take a while to open, the person may not press Download, or they
   may decide against it; a progress bar during any of that is a
   promise the app cannot keep, and the old one sat at "Waiting for
   Steam…" for ever when they cancelled.

   Instead the manifest is read quietly in the background. The bar
   appears only once Steam is genuinely fetching bytes, and goes away
   again if that stops — which is what cancelling looks like from
   here.
   ---------------------------------------------------------------- */

/** How long to keep looking before assuming they changed their mind. */
const INSTALL_WATCH_TIMEOUT_MS = 15 * 60 * 1000;

function stopInstallWatch() {
    if (installWatchTimer) clearInterval(installWatchTimer);
    installWatchTimer = null;
    installWatchId = null;
    if (installProgressEl) installProgressEl.classList.add('hidden');
}

/** Puts the details screen back to "not installed, here is the button". */
function resetInstallUI() {
    stopInstallWatch();
    if (installBtnEl) installBtnEl.classList.remove('hidden');
}

async function watchInstall(game) {
    const t = translations[currentLanguage];
    stopInstallWatch();
    installWatchId = game.Id;

    // Deliberately nothing on screen yet. The button stays as it was.
    const startedAt = Date.now();
    let everStarted = false;

    const tick = async () => {
        // Stop if they have moved on to a different game.
        if (detailsTitle.dataset.gameId !== installWatchId) return stopInstallWatch();

        const st = await window.api.installState(game.SteamAppId);
        const downloading = !!(st && st.found && st.busy && st.bytesToDownload > 0);

        if (st && st.found && st.installed) {
            stopInstallWatch();
            showSuccess((t.INSTALL_DONE || '{name} is installed.').replace('{name}', game.Name));
            await window.api.scanInstalled();
            await loadLibrary();
            const fresh = currentLibrary.find(g => g.Id === game.Id);
            if (fresh) showGameDetails(fresh);
            return;
        }

        if (downloading) {
            // First sign of real progress: now the bar has something
            // true to show.
            if (!everStarted) {
                everStarted = true;
                if (installBtnEl) installBtnEl.classList.add('hidden');
                if (installProgressEl) installProgressEl.classList.remove('hidden');
            }
            const pct = st.percent || 0;
            if (installFillEl) installFillEl.style.width = `${pct.toFixed(1)}%`;
            if (installTextEl) {
                installTextEl.textContent =
                    `${pct.toFixed(0)}%  ·  ${humanBytes(st.bytesDownloaded)} / ${humanBytes(st.bytesToDownload)}`;
            }
            return;
        }

        // It was downloading and now it is not, and it did not finish.
        // Cancelled, or paused — either way there is nothing to show.
        if (everStarted) {
            resetInstallUI();
            return;
        }

        // Never started. Give up quietly rather than watching for ever.
        if (Date.now() - startedAt > INSTALL_WATCH_TIMEOUT_MS) stopInstallWatch();
    };

    await tick();
    installWatchTimer = setInterval(tick, 1500);
}

// Stop watching when the details screen is left.
document.querySelectorAll('.back-to-library').forEach(b => {
    b.addEventListener('click', stopInstallWatch);
});


/* ================================================================
   UPDATES
   ================================================================
   Three things can be true and the panel says which: this copy can
   replace itself, or it can only point at the download, or there is
   nothing newer. Anything else — offline, rate-limited, GitHub having
   a moment — is reported as itself rather than as "up to date", which
   would be a lie that keeps somebody on an old version.
   ================================================================ */

const el = (id) => document.getElementById(id);

let updateState = { checking: false, downloading: false, ready: false, info: null };

function updateT(key) {
    return (translations[currentLanguage] && translations[currentLanguage][key]) || key;
}

/* The same words in both places. There are two panels now — the one in
   settings and the dialog that opens on its own — and whichever the
   reader is looking at has to be the one telling the truth. */
function setUpdateStatus(key, extra) {
    const text = extra ? updateT(key).replace('{v}', extra) : updateT(key);
    for (const id of ['updateStatus', 'updateModalStatus']) {
        const node = el(id);
        if (!node) continue;
        // Written by hand here, so translateApp must not rewrite it on
        // the next language change.
        node.removeAttribute('data-i18n');
        node.textContent = text;
    }
}

function showUpdateButtons({ check = false, download = false, restart = false, open = false }) {
    const set = (id, on) => { const b = el(id); if (b) b.classList.toggle('hidden', !on); };
    for (const p of ['update', 'mUpdate']) {
        set(p + 'CheckBtn', check);
        set(p + 'DownloadBtn', download);
        set(p + 'RestartBtn', restart);
        set(p + 'OpenBtn', open);
    }
}

/** Both progress bars, since either panel may be the visible one. */
function setUpdateBar(percent, visible) {
    for (const [barId, fillId] of [['updateBar', 'updateBarFill'], ['updateModalBar', 'updateModalBarFill']]) {
        const bar = el(barId), fill = el(fillId);
        if (bar) bar.classList.toggle('hidden', !visible);
        if (fill && percent !== null) fill.style.width = percent + '%';
    }
}

/** The installs that can replace themselves; see UPDATES in main.js. */
function canInstallItself(kind) {
    return kind === 'appimage' || kind === 'deb' || kind === 'installer';
}

/* The release notes used to be shown here. They are written for the
   commit log, not for this box: the text arrived with its own markup
   in it and with paragraphs about internals nobody using the app has
   any use for. What matters at this moment is the version and the
   size, and both are on the dialog already. */

async function runUpdateCheck({ silent = false } = {}) {
    if (updateState.checking || updateState.downloading) return;
    if (!window.api || !window.api.checkForUpdate) return;

    updateState.checking = true;
    if (!silent) {
        setUpdateStatus('UPDATE_CHECKING');
        showUpdateButtons({});
    }

    let r;
    try {
        r = await window.api.checkForUpdate();
    } catch (e) {
        r = { checked: false, error: String(e && e.message || e) };
    }
    updateState.checking = false;
    updateState.info = r;

    appSettings.lastUpdateCheck = Date.now();
    saveAppSettings();

    const cur = el('updateCurrent');
    if (cur && r && r.current) cur.textContent = 'v' + r.current;

    if (!r || !r.checked) {
        if (silent) return;
        setUpdateStatus('UPDATE_CHECK_FAILED');
        showUpdateButtons({ check: true });
        return;
    }

    if (!r.available) {
        if (silent) return;
        setUpdateStatus('UPDATE_NONE');
        showUpdateButtons({ check: true });
        return;
    }

    setUpdateStatus('UPDATE_AVAILABLE', r.version);

    if (r.kind === 'deb') {
        // A .deb can be replaced too, but only through dpkg — which
        // means a password prompt. Saying so before the button is
        // pressed is the difference between an expected dialog and a
        // suspicious one.
        setUpdateStatus('UPDATE_AVAILABLE_DEB', r.version);
        showUpdateButtons({ download: true });
    } else if (canInstallItself(r.kind)) {
        showUpdateButtons({ download: true });
    } else {
        // A copy running from source has no file to replace, and one
        // installed by something we do not drive is not ours to touch,
        // so the honest offer is a link.
        setUpdateStatus(r.kind === 'source' ? 'UPDATE_FROM_SOURCE' : 'UPDATE_MANAGED', r.version);
        showUpdateButtons({ open: true });
    }
}

async function startUpdateDownload() {
    updateState.downloading = true;
    setUpdateStatus('UPDATE_DOWNLOADING');
    showUpdateButtons({});
    setUpdateBar(0, true);

    const res = await window.api.downloadUpdate();
    if (!res || !res.success) {
        updateState.downloading = false;
        setUpdateBar(null, false);
        setUpdateStatus('UPDATE_DOWNLOAD_FAILED');
        showUpdateButtons({ check: true });
    }
    // Success is announced by the update-ready event, not here —
    // downloadUpdate resolves when the transfer starts finishing, and
    // the file is only usable once the event says so.
}

/* One action, two buttons. The panel in settings and the dialog carry
   the same four, and either can be the one somebody is looking at. */
const UPDATE_ACTIONS = {
    CheckBtn: () => runUpdateCheck(),
    DownloadBtn: startUpdateDownload,
    RestartBtn: () => window.api.installUpdate(),
    OpenBtn: () => window.api.openReleasePage()
};

for (const [suffix, action] of Object.entries(UPDATE_ACTIONS)) {
    for (const prefix of ['update', 'mUpdate']) {
        const btn = el(prefix + suffix);
        if (btn) btn.onclick = action;
    }
}

if (window.api && window.api.onUpdateProgress) {
    window.api.onUpdateProgress((p) => {
        setUpdateBar(p.percent || 0, true);
        setUpdateStatus('UPDATE_DOWNLOADING_PCT', String(p.percent || 0));
    });

    window.api.onUpdateReady((info) => {
        updateState.downloading = false;
        updateState.ready = true;
        setUpdateBar(null, false);
        const debInstall = updateState.info && updateState.info.kind === 'deb';
        setUpdateStatus(debInstall ? 'UPDATE_READY_DEB' : 'UPDATE_READY', info && info.version);
        showUpdateButtons({ restart: true });
        if (window.SFX) window.SFX.play('ok');
    });

    window.api.onUpdateError((e) => {
        updateState.downloading = false;
        setUpdateBar(null, false);
        setUpdateStatus('UPDATE_CHECK_FAILED');
        showUpdateButtons({ check: true });
        console.warn('[Update]', e && e.message);
    });
}

/* The same switch in both panels, kept in step with each other. */
for (const id of ['settingAutoUpdateCheck', 'modalAutoUpdateCheck']) {
    const box = el(id);
    if (!box) continue;
    box.onchange = async () => {
        appSettings.autoCheckUpdates = box.checked;
        for (const other of ['settingAutoUpdateCheck', 'modalAutoUpdateCheck']) {
            const b = el(other);
            if (b && b !== box) b.checked = box.checked;
        }
        await saveAppSettings();
    };
}

/* ----------------------------------------------------------------
   Telling somebody a new version exists
   ----------------------------------------------------------------
   Settings is the wrong place to learn this: nobody opens Settings to
   check. So the check runs on every launch, and when there is
   something newer it is shown once, on the way into the library — the
   step from one version to the next, how large it is, and what
   changed.

   Once per launch. Dismissing means dismissed until next time, and
   the switch in Settings stops it asking at all.
   ---------------------------------------------------------------- */

let updateModalShown = false;

function openUpdateModal(info) {
    const modal = el('updateModal');
    if (!modal || updateModalShown) return;
    updateModalShown = true;

    const put = (id, text) => { const n = el(id); if (n) n.textContent = text; };
    put('updateFromVersion', info.current || appVersion || '—');
    put('updateToVersion', info.version || '—');

    // Worth saying before somebody starts a download on a connection
    // they are paying for by the megabyte.
    put('updateSize', info.size ? Math.round(info.size / 1048576) + ' MB' : '');

    // The dialog used to close itself and open settings so the download
    // could run there. Being moved somewhere else to finish what you
    // started here is the sort of thing that makes an update feel like
    // a chore, so it all happens in place now: the status line, the
    // bar, and Restart when it is done.
    const canInstall = canInstallItself(info.kind);
    showUpdateButtons(canInstall ? { download: true } : { open: true });
    setUpdateStatus(
        info.kind === 'deb' ? 'UPDATE_AVAILABLE_DEB'
            : canInstall ? 'UPDATE_AVAILABLE'
                : info.kind === 'source' ? 'UPDATE_FROM_SOURCE' : 'UPDATE_MANAGED',
        info.version
    );
    setUpdateBar(0, false);

    const auto = el('modalAutoUpdateCheck');
    if (auto) auto.checked = !!appSettings.autoCheckUpdates;

    modal.classList.remove('hidden');
    if (window.SFX) window.SFX.play('open');
}

function closeUpdateModal() {
    const modal = el('updateModal');
    if (modal) modal.classList.add('hidden');
}

if (el('updateModalClose')) el('updateModalClose').onclick = closeUpdateModal;
if (el('updateLaterBtn')) el('updateLaterBtn').onclick = closeUpdateModal;

/**
 * The check that runs on launch. Silent when there is nothing to
 * report, and held back a few seconds so it never competes with the
 * library loading.
 */
function scheduleUpdateCheck() {
    if (!appSettings.autoCheckUpdates) return;
    setTimeout(() => runUpdateCheck({ silent: true }).then(() => {
        const r = updateState.info;
        if (!r || !r.checked || !r.available) return;

        // Keep the panel in step for whoever opens it later.
        setUpdateStatus(r.kind === 'deb' ? 'UPDATE_AVAILABLE_DEB' : 'UPDATE_AVAILABLE', r.version);
        showUpdateButtons(canInstallItself(r.kind) ? { download: true } : { open: true });

        openUpdateModal(r);
    }), 6000);
}
