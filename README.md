<div align="center">

<img src="App_Core/Assets_Default/AppIcon.png" width="96" alt="">

# Parallax Launcher

**One shelf for every game you own, kept on your own machine.**

[![Licence: GPL v3](https://img.shields.io/badge/licence-GPL--3.0-8A94A5?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Linux%20%7C%20Windows-8A94A5?style=flat-square)](#running-it)
[![Languages](https://img.shields.io/badge/languages-8-8A94A5?style=flat-square)](#languages)

</div>

---

Parallax Launcher gathers the games you already have into one library and lets
you start them from there. It reads Steam's own installation records to find
what is on your disk, fills in cover art, keeps track of how long you have
played, and stays out of your way otherwise.

Everything it knows lives in a plain text file on your computer. There is no
account, no telemetry, and nothing is uploaded anywhere.

## What it does

- **Finds your Steam games.** Reads Steam's library folders and install
  manifests directly, so it knows what is actually installed rather than
  guessing from folder names.
- **Starts them.** Hands the game to Steam, or runs it directly without
  bringing the Steam window to the front — your choice, per game.
- **Fills in the artwork.** Pulls official covers and banners from Steam's
  public images. Free, no API key, no rate limit. Add a SteamGridDB key and
  community artwork opens up too — often hundreds of alternatives per game.
- **Counts playtime,** and merges in the hours Steam already recorded so
  nothing is lost.
- **Handles Proton and Wine.** Per-game compatibility settings, launch
  options, environment variables, GameMode and MangoHud — laid out the way
  Steam does it, because that is what people already know.
- **Speaks eight languages.** See below.

## Running it

The app runs straight from source. There is no build step.

```bash
git clone https://github.com/<user>/parallax-launcher.git
cd "parallax-launcher/App_Core"
npm install
npm start
```

`launch_app.sh` in the project root does the same thing and focuses the
existing window instead of opening a second copy — useful if you bind it to a
key or install the bundled `.desktop` file.

### API keys

Both are optional and none ship with the app.

| Key | What it unlocks | Where to get it |
|---|---|---|
| Steam Web API | Importing your whole Steam library, including games you have not installed. Needed once. | [steamcommunity.com/dev/apikey](https://steamcommunity.com/dev/apikey) |
| SteamGridDB | Community artwork, instead of Steam's single official cover. | [steamgriddb.com/profile/api](https://steamgriddb.com/profile/api) |

Without either one, the launcher still finds your installed games and covers
them with Steam's public artwork. Keys are typed into Settings → API and
stored in your own config directory — never in this repository.

## Languages

English · Türkçe · Deutsch · Português (Brasil) · Русский · Українська ·
简体中文 · 한국어

Every piece of text in the app exists in all eight. If you add a string,
add it to all of them — `App_Core/renderer/translations.js` is the single
place they live.

## How it is put together

```
App_Core/
├── main.js            the Electron main process and every IPC handler
├── preload.js         the only bridge between the page and the system
├── Platform.js        all operating-system knowledge lives here
├── Artwork.js         cover and banner fetching
├── LibraryManager.js  reading and writing the library file
└── renderer/
    ├── index.html
    ├── app.js         the application
    ├── translations.js  eight languages, one object
    ├── theme.css      the design layer
    ├── parallax.js    the moving sky, and the tilt under the cursor
    ├── select.js      a dropdown that can actually be styled
    └── sfx.js         interface sound, synthesised — no audio files
```

`Platform.js` is worth knowing about: every path, every binary, every
difference between operating systems is behind it. Nothing else in the app
needs to know which system it is running on.

## Licence

Free software under the **GNU General Public License version 3**. Use it,
study it, change it, pass it on — and anything built from it stays free
software under the same licence.

Two conditions are added under section 7 of that licence: the credit
*"Parallax Launcher, originally created by Arda Yalın Özkan"* must stay
visible in any version, and a modified version must be marked as different
from the original. Neither restricts what you may do with the program; they
keep the record of where it came from intact.

The full licence text is in [LICENSE](LICENSE); the additional terms are in [NOTICE](NOTICE).

---

<div align="center">
<sub>Copyright © 2024-2026 Arda Yalın Özkan</sub>
</div>
