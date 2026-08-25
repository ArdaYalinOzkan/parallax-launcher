const fs = require('fs');
const path = require('path');

class LibraryManager {
    constructor(basePath) {
        this.basePath = basePath;
        this.libraryPath = path.join(basePath, 'Library.txt');
        this.ensureLibraryExists();
    }

    ensureLibraryExists() {
        if (!fs.existsSync(this.libraryPath)) {
            fs.writeFileSync(this.libraryPath, '', 'utf-8');
        }
    }

    makeRelative(absPath) {
        if (!absPath || typeof absPath !== 'string') return absPath;
        if (absPath.includes('./') || absPath.includes('../')) return absPath;

        try {
            const lowPath = absPath.toLowerCase().replace(/\\/g, '/');
            const lowBase = this.basePath.toLowerCase().replace(/\\/g, '/');

            // 1. Check if inside account folder
            if (lowPath.startsWith(lowBase)) {
                const rel = path.relative(this.basePath, absPath);
                return './' + rel.replace(/\\/g, '/');
            }

            // 2. Check if inside common Assets_Default (sibling to Parallax_Accounts)
            const parentOfAccounts = path.join(this.basePath, '..', '..');
            const lowAssets = path.join(parentOfAccounts, 'Assets_Default').toLowerCase().replace(/\\/g, '/');
            if (lowPath.startsWith(lowAssets)) {
                const rel = path.relative(this.basePath, absPath);
                return rel.replace(/\\/g, '/'); // This will be ../../Assets_Default/...
            }
        } catch (e) {
            console.error("Path conversion error:", e);
        }
        return absPath;
    }

    /**
     * Parses the Library.txt file into profile and games.
     */
    readLibrary() {
        const content = fs.readFileSync(this.libraryPath, 'utf-8');
        let profile = null;
        const games = [];
        const blocks = content.split('---').map(b => b.trim()).filter(b => b.length > 0);

        const parseSafe = (val) => {
            if (!val || typeof val !== 'string') return val;
            if (val.trim().startsWith('{')) {
                try { return JSON.parse(val); } catch (e) { return val; }
            }
            return val;
        };

        const findKey = (root, target) => {
            const lowTarget = target.toLowerCase();
            for (const k in root) if (k.toLowerCase() === lowTarget) return root[k];
            return null;
        };

        blocks.forEach(block => {
            const data = {};
            const lines = block.split(/\r?\n/);
            lines.forEach(line => {
                const parts = line.split(':');
                if (parts.length >= 2) {
                    const key = parts[0].trim();
                    let value = parts.slice(1).join(':').trim();
                    if (value && typeof value === 'string') {
                        value = value.replace(/\\n/g, '\n');
                    }
                    data[key] = value;
                }
            });

            const normalizedData = {};
            for (const k in data) normalizedData[k.toUpperCase()] = data[k];

            if (normalizedData.TYPE && normalizedData.TYPE.startsWith('PROFILE')) {
                profile = data;
                const typeParts = normalizedData.TYPE.split(' ');
                if (typeParts.length > 1) profile.SpecialCode = typeParts[1].trim();

                profile.AvatarTransform = parseSafe(findKey(data, 'AvatarTransform'));
                profile.BannerTransform = parseSafe(findKey(data, 'BannerTransform'));
            } else {
                // Ensure game transforms are also parsed
                data.BannerTransform = parseSafe(findKey(data, 'BannerTransform'));
                games.push(data);
            }
        });

        return { profile, games };
    }

    /**
     * Overwrites the library file with profile and games.
     * @param {Object} profile - User profile object.
     * @param {Array} games - Array of all game objects.
     */
    updateLibrary(profile, games) {
        let content = '';

        if (profile) {
            content += `---
TYPE: PROFILE ${profile.specialCode || profile.SpecialCode || ''}
Name: ${profile.name || profile.Name || ''}
Avatar: ${this.makeRelative(profile.avatar || profile.Avatar || '')}
AvatarTransform: ${JSON.stringify(profile.avatarTransform || profile.AvatarTransform || { x: 0, y: 0, s: 1 })}
Banner: ${this.makeRelative(profile.banner || profile.Banner || '')}
BannerTransform: ${JSON.stringify(profile.bannerTransform || profile.BannerTransform || { x: 0, y: 0, s: 1 })}
About: ${(profile.about || profile.About || '').replace(/(\r\n|\n|\r)/g, '\\n')}
Email: ${profile.Email || profile.email || ''}
CloudLinked: ${profile.CloudLinked || profile.cloudLinked || 'false'}
---
`;
        }

        games.forEach(game => {
            content += `---
Name: ${game.Name || ''}
Category: ${game.Category || 'Uncategorized'}
Platform: ${game.Platform || 'PC'}
Status: ${game.Status || 'Uninstalled'}
Path: ${game.Path || ''}
Cover: ${this.makeRelative(game.Cover || '')}
Banner: ${this.makeRelative(game.Banner || '')}
BannerTransform: ${JSON.stringify(game.BannerTransform || { x: 0, y: 0, s: 1 })}
PlayTime: ${game.PlayTime || '0.0'}
SteamAppId: ${game.SteamAppId || ''}
LaunchOptions: ${(game.LaunchOptions || '').replace(/(\r\n|\n|\r)/g, ' ')}
CompatTool: ${game.CompatTool || 'auto'}
WinePrefix: ${game.WinePrefix || ''}
EnvVars: ${(game.EnvVars || '').replace(/(\r\n|\n|\r)/g, '\\n')}
UseGameMode: ${game.UseGameMode || 'inherit'}
UseMangoHud: ${game.UseMangoHud || 'inherit'}
Id: ${game.Id || ''}
OriginalName: ${game.OriginalName || game.Name || ''}
---
`;
        });
        fs.writeFileSync(this.libraryPath, content, 'utf-8');
    }

    addGame(game) {
        this.bulkAddGames([game]);
    }

    /**
     * Appends multiple new games to the Library.txt file.
     * @param {Array} games - Array of game objects
     */
    bulkAddGames(games) {
        let content = '';
        games.forEach(game => {
            content += `---
Name: ${game.Name || 'New Game'}
Category: ${game.Category || 'Games'}
Platform: ${game.Platform || 'PC'}
Status: ${game.Status || 'Uninstalled'}
Path: ${game.Path || ''}
Cover: ${this.makeRelative(game.Cover || '')}
Banner: ${this.makeRelative(game.Banner || '')}
BannerTransform: ${JSON.stringify(game.BannerTransform || { x: 0, y: 0, s: 1 })}
PlayTime: ${game.PlayTime || '0.0'}
SteamAppId: ${game.SteamAppId || ''}
LaunchOptions: ${(game.LaunchOptions || '').replace(/(\r\n|\n|\r)/g, ' ')}
CompatTool: ${game.CompatTool || 'auto'}
WinePrefix: ${game.WinePrefix || ''}
EnvVars: ${(game.EnvVars || '').replace(/(\r\n|\n|\r)/g, '\\n')}
UseGameMode: ${game.UseGameMode || 'inherit'}
UseMangoHud: ${game.UseMangoHud || 'inherit'}
Id: ${game.Id || ''}
OriginalName: ${game.OriginalName || game.Name || ''}
---
`;
        });
        fs.appendFileSync(this.libraryPath, content, 'utf-8');
    }
}

module.exports = LibraryManager;
