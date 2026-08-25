/* The site in eight languages.

   Every piece of text on the page carries a data-i18n key, and the table
   below carries that key in each language. Nothing is fetched: the whole
   thing is one file, so switching is instant and works with no network.

   Two kinds of key. A plain one replaces an element's text. One ending
   in _html replaces its markup, and is used only where a sentence has a
   link or a piece of code inside it — the markup is written out per
   language because word order moves the link around.

   The choice is remembered per site. The help pages live on another
   subdomain, which is a different origin and therefore a different
   localStorage, so links between the two carry ?lang= and the other
   side picks it up. */

const PARALLAX_LANGS = {
    en: 'English',
    tr: 'Türkçe',
    de: 'Deutsch',
    ru: 'Русский',
    uk: 'Українська',
    pt: 'Português',
    zh: '简体中文',
    ko: '한국어'
};

const PARALLAX_STRINGS = {

en: {
    NAV_DOWNLOAD: 'Download',
    NAV_HELP: 'Help',
    NAV_SOURCE: 'Source',

    HERO_H1: "All your games in one place.",
    HERO_LEDE: 'Parallax Launcher finds the games already on your disk, fills in their artwork, and starts them. Everything it knows stays on your computer — no account, no telemetry, and a library you can open in a text editor.',
    HERO_SOURCE: 'Read the source',
    HERO_NOTE: 'Free software under the GNU GPL v3. No install — make it executable and run it.',
    SHOT_LIBRARY: 'The library — a wall of cover art',

    LBL_WHAT: 'What it does',
    WHAT_H2: "It finds your installed games in Steam's own records.",
    WHAT_LEDE: "No scanning folders and hoping. Parallax opens Steam's own installation records, so what it shows you is what is actually on the disk.",

    F1_LBL: 'Finding',
    F1_H: 'Your installed games, exactly',
    F1_P: "Reads Steam's library folders and install manifests directly — across every drive, with the real name and app id for each one.",
    F2_LBL: 'Launching',
    F2_H: 'Through Steam, or straight past it',
    F2_P: 'Hand the game to Steam, or run it directly so the Steam window never jumps to the front. Set per game, and it shows the exact command first.',
    F3_LBL: 'Artwork',
    F3_H: 'Covers, without a key',
    F3_P: "Pulls official covers and banners from Steam's public images — free, no sign-up, no rate limit. Add a SteamGridDB key and the community's work opens up too.",
    F4_LBL: 'Playtime',
    F4_H: 'Hours you already earned',
    F4_P: 'Counts the sessions it starts, and merges in what Steam recorded before you ever opened this — taking the larger number, never overwriting.',
    F5_LBL: 'Compatibility',
    F5_H: 'Proton, Wine, and the rest',
    F5_P_html: "Per-game runtime, launch options with Steam's <code>%command%</code> syntax, environment variables, GameMode and MangoHud.",
    F6_LBL: 'Yours',
    F6_H: 'On your machine, in plain text',
    F6_P: 'The library is a text file. The images are ordinary images. Nothing is uploaded anywhere, and there is no account to make.',

    LBL_UPCLOSE: 'Up close',
    UPCLOSE_H2: "The game page, and its settings.",
    UPCLOSE_LEDE: 'Compatibility settings the way Steam lays them out — and one line the others leave out: the exact command that is about to run.',
    SHOT_GAME: "A game's page — cover, playtime, Play",
    SHOT_SETTINGS: 'Properties — runtime, launch options, what will run',

    LBL_LANGS: 'Languages',
    LANGS_H2: "Available in eight languages.",
    LANGS_LEDE: 'Every string in the app exists in all of them — not a partial translation that falls back to English halfway down a screen.',

    LBL_GET: 'Download',
    GET_H2: "Choose the file for your system.",
    GET_LEDE: 'All three are built from the same source by the same automated run, and all three keep themselves up to date.',

    CHIP_UPDATES: 'Updates itself',
    APPIMAGE_FOR: 'Any distribution',
    APPIMAGE_P_html: 'One file. Your browser downloads it without permission to run, so give it that first — right-click, Properties, tick <em>allow executing</em>, or <code>chmod +x</code> on the file. Then open it. It adds itself to your application menu on first run, and because it is a single file it can replace itself: it watches for new releases and offers to fetch one.',
    BTN_APPIMAGE: 'Download AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Installs the way your other software does and shows up in your menu with everything else. It updates itself too, through <code>dpkg</code> — which means it asks for your password the way any install does. Add the repository below and your system takes that over instead.',
    BTN_DEB: 'Download .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'An ordinary installer — it asks where to put things and makes the shortcuts. It watches for new versions and replaces itself when you say so.',
    EXE_WARN: 'Windows blocks it the first time — here is how to get past it',
    BTN_WIN: 'Download for Windows',
    BTN_DL_LINUX: 'Download for Linux',

    REMOVAL_H: 'Removing it',
    REMOVAL_DATA_html: 'Your library, your settings and your artwork live in <code>~/.config/parallax-launcher</code> on Linux and <code>%APPDATA%\\parallax-launcher</code> on Windows. None of the steps below touch that folder, so reinstalling picks up where you left off — delete it yourself if you want everything gone.',
    REMOVAL_APPIMAGE_P: 'Delete the file. It also left a menu entry and an icon behind, since it put itself in your menu:',
    REMOVAL_DEB_P: 'Remove it the way you would anything else. If you added the repository, drop that too:',
    REMOVAL_WIN_P: 'Settings, Apps, Parallax Launcher, Uninstall. Same as anything else.',
    COPY: 'Copy',
    COPIED: 'Copied',
    COPY_FAIL: 'Select it',
    COPY_ARIA: 'Copy these commands',

    REPO_NOTE_html: 'On Debian or Ubuntu you can add the package repository instead and let your system handle updates — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">the commands are here</a>. Running from source is <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">in the readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — created by Arda Yalın Özkan.<br>Free software under the <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Source',
    FOOT_RELEASES: 'Releases',
    FOOT_ISSUES: 'Report a problem',
    FOOT_FINE: "Games shown in the screenshots are one person's own library. Their names and artwork belong to their publishers, and none of them are sponsors or endorse this project.",

    DL_STARTING: 'Starting the download…',
    DL_RETRY: 'Not started? Click again',
    LANG_ARIA: 'Language'
},

tr: {
    NAV_DOWNLOAD: 'İndir',
    NAV_HELP: 'Yardım',
    NAV_SOURCE: 'Kaynak kodu',

    HERO_H1: 'Bütün oyunların tek bir yerde.',
    HERO_LEDE: 'Parallax Launcher diskinde zaten kurulu olan oyunları bulur, kapaklarını tamamlar ve başlatır. Bildiği her şey senin bilgisayarında kalır: hesap yok, telemetri yok, kütüphanen de metin düzenleyicide açabileceğin bir dosyadan ibaret.',
    HERO_SOURCE: 'Kaynak koduna bak',
    HERO_NOTE: 'GNU GPL v3 ile özgür yazılım. Kurulum yok, çalıştırma izni verip aç.',
    SHOT_LIBRARY: 'Kütüphane — baştan başa kapak resmi',

    LBL_WHAT: 'Ne yapar',
    WHAT_H2: 'Kurulu oyunlarını Steam\'in kayıtlarından bulur.',
    WHAT_LEDE: 'Klasörleri tarayıp şansa bırakmıyor. Steam kurduğu her oyunun kaydını zaten tutuyor; Parallax da doğrudan o kayıtları okuyor. Yani gördüğün liste diskte gerçekten duran şey.',

    F1_LBL: 'Bulma',
    F1_H: 'Kurulu oyunların, eksiksiz',
    F1_P: 'Steam\'in kütüphane klasörlerini ve kurulum kayıtlarını doğrudan okuyor. Bütün disklerdekiler, gerçek adı ve uygulama numarasıyla birlikte geliyor.',
    F2_LBL: 'Başlatma',
    F2_H: 'Steam üzerinden ya da Steam\'siz',
    F2_P: 'Oyunu Steam\'e devredebilir ya da doğrudan çalıştırabilirsin; ikincisinde Steam penceresi önüne atlamıyor. Her oyun için ayrı ayarlanıyor ve çalışacak komut önceden gösteriliyor.',
    F3_LBL: 'Kapaklar',
    F3_H: 'Anahtar istemeyen kapaklar',
    F3_P: 'Resmî kapak ve afişler Steam\'in herkese açık görsellerinden geliyor: bedava, kayıt yok, kota yok. SteamGridDB anahtarı eklersen topluluğun hazırladıkları da devreye giriyor.',
    F4_LBL: 'Oynama süresi',
    F4_H: 'Zaten biriktirdiğin saatler',
    F4_P: 'Kendi başlattığı oturumları sayıyor, üstüne sen bu programı açmadan önce Steam\'in tuttuğu süreyi ekliyor. İki kayıttan büyüğünü alıyor, hiçbirinin üstüne yazmıyor.',
    F5_LBL: 'Uyumluluk',
    F5_H: 'Proton, Wine ve gerisi',
    F5_P_html: 'Oyun başına çalışma ortamı, Steam\'in <code>%command%</code> yazımıyla başlatma seçenekleri, ortam değişkenleri, GameMode ve MangoHud.',
    F6_LBL: 'Senin',
    F6_H: 'Kendi makinende, düz metin olarak',
    F6_P: 'Kütüphane bir metin dosyası, görseller de sıradan görseller. Hiçbir şey hiçbir yere yüklenmiyor ve açman gereken bir hesap yok.',

    LBL_UPCLOSE: 'Yakından',
    UPCLOSE_H2: 'Oyun sayfası ve ayarları.',
    UPCLOSE_LEDE: 'Uyumluluk ayarları Steam\'deki düzenin aynısı. Üstüne bir de diğerlerinin göstermediği şey var: az sonra çalışacak komutun kendisi.',
    SHOT_GAME: 'Bir oyunun sayfası — kapak, süre, Oynat',
    SHOT_SETTINGS: 'Özellikler — çalışma ortamı, başlatma seçenekleri, ne çalışacağı',

    LBL_LANGS: 'Diller',
    LANGS_H2: 'Sekiz dilde kullanılabilir.',
    LANGS_LEDE: 'Programdaki her metin sekizinde de var. Ekranın ortasında İngilizceye düşen yarım bir çeviri değil.',

    LBL_GET: 'İndir',
    GET_H2: 'Sistemine uygun dosyayı seç.',
    GET_LEDE: 'Üçü de aynı kaynaktan, aynı otomatik derlemeyle çıkıyor ve üçü de kendini güncel tutuyor.',

    CHIP_UPDATES: 'Kendini günceller',
    APPIMAGE_FOR: 'Her dağıtım',
    APPIMAGE_P_html: 'Tek dosya. Tarayıcı onu çalıştırma izni olmadan indiriyor, o izni sen vereceksin: sağ tık, Özellikler, <em>çalıştırmaya izin ver</em>, ya da dosyaya <code>chmod +x</code>. Sonra açman yeterli. İlk açılışta kendini uygulama menüne ekliyor; tek dosya olduğu için de kendi yerine geçebiliyor, yeni sürüm çıkınca haber verip indirmeyi teklif ediyor.',
    BTN_APPIMAGE: 'AppImage indir',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Diğer programların gibi kuruluyor ve menüde onlarla yan yana duruyor. Kendini <code>dpkg</code> ile güncelliyor, yani her kurulum gibi parola soruyor. Aşağıdaki depoyu eklersen bu işi sistemin devralıyor.',
    BTN_DEB: '.deb indir',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Sıradan bir kurulum programı: nereye kurulacağını soruyor, kısayolları kendisi yapıyor. Yeni sürüm çıkınca haber veriyor ve sen onaylayınca kendini değiştiriyor.',
    EXE_WARN: 'Windows ilk seferde engelliyor — nasıl geçileceği burada',
    BTN_WIN: 'Windows için indir',
    BTN_DL_LINUX: 'Linux için indir',

    REMOVAL_H: 'Kaldırma',
    REMOVAL_DATA_html: 'Kütüphanen, ayarların ve kapakların Linux\'ta <code>~/.config/parallax-launcher</code>, Windows\'ta <code>%APPDATA%\\parallax-launcher</code> içinde duruyor. Aşağıdaki adımların hiçbiri o klasöre dokunmuyor; yeniden kurarsan kaldığın yerden devam edersin. Her şeyin gitmesini istiyorsan klasörü kendin sil.',
    REMOVAL_APPIMAGE_P: 'Dosyayı sil. Kendini menüne eklediği için arkasında bir menü girdisiyle bir ikon da kalıyor:',
    REMOVAL_DEB_P: 'Başka bir programı nasıl kaldırıyorsan öyle kaldır. Depoyu eklediysen onu da çıkar:',
    REMOVAL_WIN_P: 'Ayarlar, Uygulamalar, Parallax Launcher, Kaldır. Diğerlerinden farkı yok.',
    COPY: 'Kopyala',
    COPIED: 'Kopyalandı',
    COPY_FAIL: 'Elle seç',
    COPY_ARIA: 'Bu komutları kopyala',

    REPO_NOTE_html: 'Debian ya da Ubuntu kullanıyorsan paket deposunu ekleyip güncellemeyi sisteme bırakabilirsin — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">komutlar burada</a>. Kaynaktan çalıştırma ise <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">benioku dosyasında</a>.',

    FOOT_BY_html: 'Parallax Launcher — Arda Yalın Özkan yaptı.<br><a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a> ile özgür yazılım.',
    FOOT_SOURCE: 'Kaynak kodu',
    FOOT_RELEASES: 'Sürümler',
    FOOT_ISSUES: 'Sorun bildir',
    FOOT_FINE: 'Ekran görüntülerindeki oyunlar bir kişinin kendi kütüphanesi. Adları ve görselleri yayıncılarına ait; hiçbiri sponsor değil ve bu projeyi desteklediği anlamına gelmiyor.',

    DL_STARTING: 'İndirme başlıyor…',
    DL_RETRY: 'Başlamadı mı? Tekrar tıkla',
    LANG_ARIA: 'Dil'
},

de: {
    NAV_DOWNLOAD: 'Herunterladen',
    NAV_HELP: 'Hilfe',
    NAV_SOURCE: 'Quellcode',

    HERO_H1: 'Alle deine Spiele an einem Ort.',
    HERO_LEDE: 'Parallax Launcher findet die Spiele, die schon auf deiner Festplatte liegen, ergänzt ihre Titelbilder und startet sie. Alles, was es weiß, bleibt auf deinem Rechner: kein Konto, keine Telemetrie, und die Bibliothek ist eine Datei, die du im Texteditor öffnen kannst.',
    HERO_SOURCE: 'Quellcode ansehen',
    HERO_NOTE: 'Freie Software unter der GNU GPL v3. Keine Installation — ausführbar machen und starten.',
    SHOT_LIBRARY: 'Die Bibliothek — eine Wand aus Titelbildern',

    LBL_WHAT: 'Was es tut',
    WHAT_H2: 'Es findet deine installierten Spiele in Steams eigenen Daten.',
    WHAT_LEDE: 'Kein Absuchen von Ordnern auf gut Glück. Steam führt ohnehin Buch über jedes installierte Spiel, und genau diese Daten liest Parallax. Was du siehst, liegt also wirklich auf der Platte.',

    F1_LBL: 'Finden',
    F1_H: 'Deine installierten Spiele, vollständig',
    F1_P: 'Liest die Bibliotheksordner und Installationsdaten von Steam direkt aus. Über alle Laufwerke hinweg, jeweils mit richtigem Namen und App-ID.',
    F2_LBL: 'Starten',
    F2_H: 'Über Steam oder ohne Steam',
    F2_P: 'Du kannst das Spiel an Steam übergeben oder direkt starten; im zweiten Fall drängt sich das Steam-Fenster nicht in den Vordergrund. Pro Spiel einstellbar, und der Befehl steht vorher da.',
    F3_LBL: 'Titelbilder',
    F3_H: 'Titelbilder ohne Schlüssel',
    F3_P: 'Offizielle Titelbilder und Banner kommen aus Steams öffentlichen Bildern: kostenlos, ohne Anmeldung, ohne Limit. Mit einem SteamGridDB-Schlüssel kommt dazu, was die Community gemacht hat.',
    F4_LBL: 'Spielzeit',
    F4_H: 'Stunden, die du schon gesammelt hast',
    F4_P: 'Zählt die Sitzungen, die es selbst startet, und rechnet die Zeit dazu, die Steam schon vor deinem ersten Start erfasst hatte. Von beiden Werten nimmt es den größeren und überschreibt keinen.',
    F5_LBL: 'Kompatibilität',
    F5_H: 'Proton, Wine und der Rest',
    F5_P_html: 'Laufzeitumgebung pro Spiel, Startoptionen mit Steams <code>%command%</code>-Syntax, Umgebungsvariablen, GameMode und MangoHud.',
    F6_LBL: 'Deins',
    F6_H: 'Auf deinem Rechner, im Klartext',
    F6_P: 'Die Bibliothek ist eine Textdatei, die Bilder sind gewöhnliche Bilder. Nichts wird irgendwohin hochgeladen, und ein Konto musst du auch nicht anlegen.',

    LBL_UPCLOSE: 'Aus der Nähe',
    UPCLOSE_H2: 'Die Spielseite und ihre Einstellungen.',
    UPCLOSE_LEDE: 'Die Kompatibilitätseinstellungen sind genauso angeordnet wie in Steam. Dazu kommt etwas, das die anderen nicht zeigen: der Befehl, der gleich ausgeführt wird.',
    SHOT_GAME: 'Die Seite eines Spiels — Titelbild, Spielzeit, Start',
    SHOT_SETTINGS: 'Eigenschaften — Laufzeitumgebung, Startoptionen, was ausgeführt wird',

    LBL_LANGS: 'Sprachen',
    LANGS_H2: 'In acht Sprachen verfügbar.',
    LANGS_LEDE: 'Jeder Text im Programm existiert in allen acht. Keine halbe Übersetzung, die mitten auf dem Bildschirm ins Englische zurückfällt.',

    LBL_GET: 'Download',
    GET_H2: 'Wähle die Datei für dein System.',
    GET_LEDE: 'Alle drei entstehen aus derselben Quelle im selben automatischen Durchlauf, und alle drei halten sich selbst aktuell.',

    CHIP_UPDATES: 'Aktualisiert sich selbst',
    APPIMAGE_FOR: 'Jede Distribution',
    APPIMAGE_P_html: 'Eine einzige Datei. Der Browser lädt sie ohne Ausführungsrecht herunter, das gibst du ihr: Rechtsklick, Eigenschaften, <em>Ausführen erlauben</em>, oder <code>chmod +x</code> auf die Datei. Danach öffnen, fertig. Beim ersten Start trägt sie sich ins Anwendungsmenü ein; und weil sie aus einer Datei besteht, kann sie sich selbst ersetzen — erscheint eine neue Version, meldet sie sich und bietet den Download an.',
    BTN_APPIMAGE: 'AppImage laden',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Installiert sich wie deine übrigen Programme und steht im Menü neben ihnen. Aktualisiert sich über <code>dpkg</code> und fragt dabei wie jede Installation nach dem Kennwort. Bindest du das Repository unten ein, übernimmt dein System diese Aufgabe.',
    BTN_DEB: '.deb laden',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Ein gewöhnliches Installationsprogramm: Es fragt, wohin, und legt die Verknüpfungen selbst an. Erscheint eine neue Version, meldet es sich und ersetzt sich nach deiner Bestätigung.',
    EXE_WARN: 'Windows blockiert beim ersten Mal — hier steht, wie du weiterkommst',
    BTN_WIN: 'Für Windows laden',
    BTN_DL_LINUX: 'Für Linux laden',

    REMOVAL_H: 'Entfernen',
    REMOVAL_DATA_html: 'Deine Bibliothek, deine Einstellungen und deine Titelbilder liegen unter Linux in <code>~/.config/parallax-launcher</code>, unter Windows in <code>%APPDATA%\\parallax-launcher</code>. Keiner der Schritte unten rührt diesen Ordner an; installierst du neu, geht es dort weiter, wo du aufgehört hast. Soll wirklich alles weg, lösch den Ordner selbst.',
    REMOVAL_APPIMAGE_P: 'Lösch die Datei. Weil sie sich ins Menü eingetragen hat, bleiben ein Menüeintrag und ein Symbol zurück:',
    REMOVAL_DEB_P: 'Entfernen wie jedes andere Programm. Hast du das Repository eingebunden, nimm es auch wieder raus:',
    REMOVAL_WIN_P: 'Einstellungen, Apps, Parallax Launcher, Deinstallieren. Wie bei allem anderen auch.',
    COPY: 'Kopieren',
    COPIED: 'Kopiert',
    COPY_FAIL: 'Selbst markieren',
    COPY_ARIA: 'Diese Befehle kopieren',

    REPO_NOTE_html: 'Unter Debian oder Ubuntu kannst du stattdessen das Paket-Repository einbinden und die Updates deinem System überlassen — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">die Befehle stehen hier</a>. Wie du aus dem Quellcode startest, steht <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">in der Readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — entwickelt von Arda Yalın Özkan.<br>Freie Software unter der <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Quellcode',
    FOOT_RELEASES: 'Versionen',
    FOOT_ISSUES: 'Problem melden',
    FOOT_FINE: 'Die Spiele auf den Screenshots sind die private Bibliothek einer Person. Namen und Bilder gehören den jeweiligen Herausgebern; keiner von ihnen ist Sponsor, und eine Empfehlung ist damit nicht verbunden.',

    DL_STARTING: 'Download beginnt…',
    DL_RETRY: 'Nicht gestartet? Noch einmal klicken',
    LANG_ARIA: 'Sprache'
},

ru: {
    NAV_DOWNLOAD: 'Скачать',
    NAV_HELP: 'Помощь',
    NAV_SOURCE: 'Исходный код',

    HERO_H1: 'Все ваши игры в одном месте.',
    HERO_LEDE: 'Parallax Launcher находит игры, которые уже стоят у вас на диске, подставляет обложки и запускает их. Всё, что он знает, остаётся на вашем компьютере: ни учётной записи, ни телеметрии, а библиотека — обычный файл, который открывается в текстовом редакторе.',
    HERO_SOURCE: 'Посмотреть исходный код',
    HERO_NOTE: 'Свободная программа под GNU GPL v3. Без установки: разрешите запуск и откройте.',
    SHOT_LIBRARY: 'Библиотека — стена из обложек',

    LBL_WHAT: 'Что он делает',
    WHAT_H2: 'Находит установленные игры в собственных записях Steam.',
    WHAT_LEDE: 'Никакого перебора папок наугад. Steam и так ведёт учёт всего, что установил, — эти записи Parallax и читает. Значит, в списке ровно то, что действительно лежит на диске.',

    F1_LBL: 'Поиск',
    F1_H: 'Все установленные игры',
    F1_P: 'Читает библиотечные папки и файлы установки Steam напрямую. Со всех дисков, у каждой игры настоящее название и app id.',
    F2_LBL: 'Запуск',
    F2_H: 'Через Steam или без него',
    F2_P: 'Игру можно отдать Steam, а можно запустить напрямую — тогда окно Steam не лезет на передний план. Настраивается для каждой игры, и команда показывается заранее.',
    F3_LBL: 'Обложки',
    F3_H: 'Обложки без всякого ключа',
    F3_P: 'Официальные обложки и баннеры берутся из открытых картинок Steam: бесплатно, без регистрации, без лимитов. Добавите ключ SteamGridDB — подтянется и то, что сделало сообщество.',
    F4_LBL: 'Время в игре',
    F4_H: 'Часы, которые вы уже наиграли',
    F4_P: 'Считает сессии, которые запускает сам, и прибавляет то, что Steam записал ещё до первого запуска программы. Из двух значений берёт большее и ничего не затирает.',
    F5_LBL: 'Совместимость',
    F5_H: 'Proton, Wine и остальное',
    F5_P_html: 'Среда выполнения для каждой игры, параметры запуска с синтаксисом Steam <code>%command%</code>, переменные окружения, GameMode и MangoHud.',
    F6_LBL: 'Ваше',
    F6_H: 'На вашей машине, обычным текстом',
    F6_P: 'Библиотека — текстовый файл, картинки — обычные картинки. Никуда ничего не загружается, и заводить учётную запись не нужно.',

    LBL_UPCLOSE: 'Вблизи',
    UPCLOSE_H2: 'Страница игры и её настройки.',
    UPCLOSE_LEDE: 'Настройки совместимости расставлены так же, как в Steam. Плюс то, чего другие не показывают: сама команда, которая сейчас выполнится.',
    SHOT_GAME: 'Страница игры — обложка, время, «Играть»',
    SHOT_SETTINGS: 'Свойства — среда выполнения, параметры запуска, что именно запустится',

    LBL_LANGS: 'Языки',
    LANGS_H2: 'Доступен на восьми языках.',
    LANGS_LEDE: 'Каждая надпись в программе есть на всех восьми. Это не половинчатый перевод, который посреди экрана срывается на английский.',

    LBL_GET: 'Скачать',
    GET_H2: 'Выберите файл для вашей системы.',
    GET_LEDE: 'Все три собираются из одного исходного кода одним и тем же автоматическим прогоном, и все три обновляются сами.',

    CHIP_UPDATES: 'Обновляется сам',
    APPIMAGE_FOR: 'Любой дистрибутив',
    APPIMAGE_P_html: 'Один-единственный файл. Браузер скачивает его без права на запуск — это право даёте вы: правой кнопкой, «Свойства», <em>разрешить выполнение</em>, либо <code>chmod +x</code> по файлу. Дальше просто откройте. При первом запуске он добавляет себя в меню приложений, а поскольку файл один, умеет заменить сам себя: выйдет новая версия — сообщит и предложит скачать.',
    BTN_APPIMAGE: 'Скачать AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Ставится как остальные ваши программы и стоит в меню рядом с ними. Обновляется через <code>dpkg</code> и, как любая установка, спрашивает пароль. Подключите репозиторий ниже — и эту работу возьмёт на себя система.',
    BTN_DEB: 'Скачать .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Обычный установщик: спрашивает, куда ставить, и сам создаёт ярлыки. Выйдет новая версия — сообщит и заменит себя, когда вы согласитесь.',
    EXE_WARN: 'В первый раз Windows не пускает — вот как пройти',
    BTN_WIN: 'Скачать для Windows',
    BTN_DL_LINUX: 'Скачать для Linux',

    REMOVAL_H: 'Как удалить',
    REMOVAL_DATA_html: 'Библиотека, настройки и обложки лежат в <code>~/.config/parallax-launcher</code> на Linux и в <code>%APPDATA%\\parallax-launcher</code> на Windows. Ни один шаг ниже эту папку не трогает: переустановите — и всё продолжится с того же места. Хотите стереть всё — удалите папку сами.',
    REMOVAL_APPIMAGE_P: 'Удалите файл. Он добавлял себя в меню, поэтому после него остаются пункт меню и значок:',
    REMOVAL_DEB_P: 'Удаляйте как любую другую программу. Подключали репозиторий — уберите и его:',
    REMOVAL_WIN_P: 'Параметры, Приложения, Parallax Launcher, Удалить. Как и всё прочее.',
    COPY: 'Копировать',
    COPIED: 'Скопировано',
    COPY_FAIL: 'Выделите сами',
    COPY_ARIA: 'Скопировать эти команды',

    REPO_NOTE_html: 'На Debian или Ubuntu можно вместо этого подключить репозиторий и оставить обновления системе — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">команды здесь</a>. Как запустить из исходного кода, написано <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">в readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — автор Arda Yalın Özkan.<br>Свободная программа под лицензией <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Исходный код',
    FOOT_RELEASES: 'Выпуски',
    FOOT_ISSUES: 'Сообщить о проблеме',
    FOOT_FINE: 'Игры на скриншотах — личная библиотека одного человека. Названия и изображения принадлежат издателям; никто из них проект не спонсирует и не поддерживает.',

    DL_STARTING: 'Загрузка начинается…',
    DL_RETRY: 'Не началась? Нажмите ещё раз',
    LANG_ARIA: 'Язык'
},

uk: {
    NAV_DOWNLOAD: 'Завантажити',
    NAV_HELP: 'Довідка',
    NAV_SOURCE: 'Вихідний код',

    HERO_H1: 'Усі ваші ігри в одному місці.',
    HERO_LEDE: 'Parallax Launcher знаходить ігри, які вже стоять у вас на диску, підставляє обкладинки й запускає їх. Усе, що він знає, лишається на вашому комп’ютері: ні облікового запису, ні телеметрії, а бібліотека — звичайний файл, який відкривається в текстовому редакторі.',
    HERO_SOURCE: 'Переглянути вихідний код',
    HERO_NOTE: 'Вільна програма за ліцензією GNU GPL v3. Без встановлення: дозвольте запуск і відкрийте.',
    SHOT_LIBRARY: 'Бібліотека — стіна з обкладинок',

    LBL_WHAT: 'Що він робить',
    WHAT_H2: 'Знаходить встановлені ігри у власних записах Steam.',
    WHAT_LEDE: 'Жодного перебору тек навмання. Steam і так веде облік усього, що встановив, — саме ці записи Parallax і читає. Отже, у списку рівно те, що справді лежить на диску.',

    F1_LBL: 'Пошук',
    F1_H: 'Усі встановлені ігри',
    F1_P: 'Читає бібліотечні теки та файли встановлення Steam напряму. З усіх дисків, у кожної гри справжня назва й app id.',
    F2_LBL: 'Запуск',
    F2_H: 'Через Steam або без нього',
    F2_P: 'Гру можна віддати Steam, а можна запустити напряму — тоді вікно Steam не лізе наперед. Налаштовується для кожної гри, і команда показується заздалегідь.',
    F3_LBL: 'Обкладинки',
    F3_H: 'Обкладинки без жодного ключа',
    F3_P: 'Офіційні обкладинки й банери беруться з відкритих зображень Steam: безкоштовно, без реєстрації, без обмежень. Додасте ключ SteamGridDB — підтягнеться й те, що зробила спільнота.',
    F4_LBL: 'Час у грі',
    F4_H: 'Години, які ви вже награли',
    F4_P: 'Рахує сеанси, які запускає сам, і додає те, що Steam записав ще до першого запуску програми. З двох значень бере більше й нічого не затирає.',
    F5_LBL: 'Сумісність',
    F5_H: 'Proton, Wine та решта',
    F5_P_html: 'Середовище виконання для кожної гри, параметри запуску із синтаксисом Steam <code>%command%</code>, змінні середовища, GameMode і MangoHud.',
    F6_LBL: 'Ваше',
    F6_H: 'На вашій машині, звичайним текстом',
    F6_P: 'Бібліотека — текстовий файл, зображення — звичайні зображення. Нікуди нічого не завантажується, і заводити обліковий запис не треба.',

    LBL_UPCLOSE: 'Зблизька',
    UPCLOSE_H2: 'Сторінка гри та її налаштування.',
    UPCLOSE_LEDE: 'Налаштування сумісності розставлені так само, як у Steam. Плюс те, чого інші не показують: сама команда, яка зараз виконається.',
    SHOT_GAME: 'Сторінка гри — обкладинка, час, «Грати»',
    SHOT_SETTINGS: 'Властивості — середовище, параметри запуску, що саме запуститься',

    LBL_LANGS: 'Мови',
    LANGS_H2: 'Доступний вісьмома мовами.',
    LANGS_LEDE: 'Кожен напис у програмі є в усіх восьми. Це не половинчастий переклад, що посеред екрана зривається на англійську.',

    LBL_GET: 'Завантажити',
    GET_H2: 'Виберіть файл для вашої системи.',
    GET_LEDE: 'Усі три збираються з одного коду одним і тим самим автоматичним прогоном, і всі три оновлюються самі.',

    CHIP_UPDATES: 'Оновлюється сам',
    APPIMAGE_FOR: 'Будь-який дистрибутив',
    APPIMAGE_P_html: 'Один-єдиний файл. Браузер завантажує його без права на запуск — це право даєте ви: права кнопка, «Властивості», <em>дозволити виконання</em>, або <code>chmod +x</code> по файлу. Далі просто відкрийте. Під час першого запуску він додає себе до меню програм, а оскільки файл один, вміє замінити сам себе: вийде нова версія — повідомить і запропонує завантажити.',
    BTN_APPIMAGE: 'Завантажити AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Ставиться як решта ваших програм і стоїть у меню поруч із ними. Оновлюється через <code>dpkg</code> і, як будь-яке встановлення, питає пароль. Підключіть репозиторій нижче — і цю роботу візьме на себе система.',
    BTN_DEB: 'Завантажити .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Звичайний інсталятор: питає, куди ставити, і сам створює ярлики. Вийде нова версія — повідомить і замінить себе, коли ви погодитеся.',
    EXE_WARN: 'Першого разу Windows не пропускає — ось як пройти',
    BTN_WIN: 'Завантажити для Windows',
    BTN_DL_LINUX: 'Завантажити для Linux',

    REMOVAL_H: 'Як видалити',
    REMOVAL_DATA_html: 'Бібліотека, налаштування й обкладинки лежать у <code>~/.config/parallax-launcher</code> на Linux і в <code>%APPDATA%\\parallax-launcher</code> у Windows. Жоден крок нижче цієї теки не чіпає: перевстановите — і все триватиме з того самого місця. Хочете стерти все — видаліть теку самі.',
    REMOVAL_APPIMAGE_P: 'Видаліть файл. Він додавав себе до меню, тож після нього лишаються пункт меню й піктограма:',
    REMOVAL_DEB_P: 'Видаляйте як будь-яку іншу програму. Підключали репозиторій — приберіть і його:',
    REMOVAL_WIN_P: 'Параметри, Програми, Parallax Launcher, Видалити. Як і все решта.',
    COPY: 'Копіювати',
    COPIED: 'Скопійовано',
    COPY_FAIL: 'Виділіть самі',
    COPY_ARIA: 'Скопіювати ці команди',

    REPO_NOTE_html: 'На Debian чи Ubuntu можна натомість підключити репозиторій і лишити оновлення системі — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">команди тут</a>. Як запустити з вихідного коду, написано <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">у readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — автор Arda Yalın Özkan.<br>Вільна програма за ліцензією <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Вихідний код',
    FOOT_RELEASES: 'Випуски',
    FOOT_ISSUES: 'Повідомити про проблему',
    FOOT_FINE: 'Ігри на знімках екрана — особиста бібліотека однієї людини. Назви та зображення належать видавцям; ніхто з них проєкт не спонсорує й не підтримує.',

    DL_STARTING: 'Завантаження починається…',
    DL_RETRY: 'Не почалося? Натисніть ще раз',
    LANG_ARIA: 'Мова'
},

pt: {
    NAV_DOWNLOAD: 'Baixar',
    NAV_HELP: 'Ajuda',
    NAV_SOURCE: 'Código-fonte',

    HERO_H1: 'Todos os seus jogos em um só lugar.',
    HERO_LEDE: 'O Parallax Launcher acha os jogos que já estão no seu disco, preenche as capas e abre eles. Tudo o que ele sabe fica no seu computador: sem conta, sem telemetria, e a biblioteca é um arquivo que você abre num editor de texto.',
    HERO_SOURCE: 'Ver o código-fonte',
    HERO_NOTE: 'Software livre sob a GNU GPL v3. Sem instalação: libere a execução e abra.',
    SHOT_LIBRARY: 'A biblioteca — uma parede de capas',

    LBL_WHAT: 'O que ele faz',
    WHAT_H2: 'Encontra seus jogos instalados nos registros da própria Steam.',
    WHAT_LEDE: 'Nada de vasculhar pastas na sorte. A Steam já anota tudo o que instalou, e é isso que o Parallax lê. Então a lista que aparece é o que está de fato no disco.',

    F1_LBL: 'Encontrar',
    F1_H: 'Todos os seus jogos instalados',
    F1_P: 'Lê direto as pastas de biblioteca e os arquivos de instalação da Steam. De todos os discos, cada um com o nome real e o app id.',
    F2_LBL: 'Abrir',
    F2_H: 'Pela Steam ou sem ela',
    F2_P: 'Você pode entregar o jogo à Steam ou abrir direto; no segundo caso a janela da Steam não pula na sua frente. Dá para escolher por jogo, e o comando aparece antes.',
    F3_LBL: 'Capas',
    F3_H: 'Capas sem precisar de chave',
    F3_P: 'As capas e banners oficiais vêm das imagens públicas da Steam: de graça, sem cadastro, sem limite. Colocando uma chave da SteamGridDB, entra também o que a comunidade fez.',
    F4_LBL: 'Tempo de jogo',
    F4_H: 'As horas que você já fez',
    F4_P: 'Conta as sessões que ele mesmo abre e soma o tempo que a Steam já tinha registrado antes de você usar o programa. Entre os dois números fica com o maior e não apaga nenhum.',
    F5_LBL: 'Compatibilidade',
    F5_H: 'Proton, Wine e o resto',
    F5_P_html: 'Runtime por jogo, opções de inicialização com a sintaxe <code>%command%</code> da Steam, variáveis de ambiente, GameMode e MangoHud.',
    F6_LBL: 'Seu',
    F6_H: 'Na sua máquina, em texto puro',
    F6_P: 'A biblioteca é um arquivo de texto e as imagens são imagens comuns. Nada é enviado para lugar nenhum, e não tem conta para criar.',

    LBL_UPCLOSE: 'De perto',
    UPCLOSE_H2: 'A página do jogo e suas configurações.',
    UPCLOSE_LEDE: 'As opções de compatibilidade estão na mesma ordem da Steam. Mais uma coisa que os outros não mostram: o comando que vai rodar agora.',
    SHOT_GAME: 'A página de um jogo — capa, tempo, Jogar',
    SHOT_SETTINGS: 'Propriedades — runtime, opções de inicialização, o que vai rodar',

    LBL_LANGS: 'Idiomas',
    LANGS_H2: 'Disponível em oito idiomas.',
    LANGS_LEDE: 'Cada texto do programa existe nos oito. Não é tradução pela metade, daquelas que voltam para o inglês no meio da tela.',

    LBL_GET: 'Baixar',
    GET_H2: 'Escolha o arquivo para o seu sistema.',
    GET_LEDE: 'Os três saem do mesmo código na mesma execução automática, e os três se mantêm atualizados sozinhos.',

    CHIP_UPDATES: 'Atualiza sozinho',
    APPIMAGE_FOR: 'Qualquer distribuição',
    APPIMAGE_P_html: 'Um arquivo só. O navegador baixa sem permissão de execução, e essa permissão quem dá é você: botão direito, Propriedades, <em>permitir execução</em>, ou <code>chmod +x</code> no arquivo. Depois é só abrir. Na primeira vez ele se coloca no menu de aplicativos; e como é um arquivo só, consegue se substituir — quando sai versão nova, ele avisa e oferece o download.',
    BTN_APPIMAGE: 'Baixar AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Instala como os seus outros programas e fica no menu ao lado deles. Atualiza pelo <code>dpkg</code> e pede sua senha, como qualquer instalação. Adicionando o repositório abaixo, quem cuida disso passa a ser o sistema.',
    BTN_DEB: 'Baixar .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Um instalador comum: pergunta onde colocar e cria os atalhos sozinho. Quando sai versão nova, ele avisa e se substitui depois que você confirma.',
    EXE_WARN: 'Na primeira vez o Windows barra — veja como passar',
    BTN_WIN: 'Baixar para Windows',
    BTN_DL_LINUX: 'Baixar para Linux',

    REMOVAL_H: 'Como remover',
    REMOVAL_DATA_html: 'Sua biblioteca, suas configurações e suas capas ficam em <code>~/.config/parallax-launcher</code> no Linux e em <code>%APPDATA%\\parallax-launcher</code> no Windows. Nenhum passo abaixo mexe nessa pasta: se reinstalar, continua de onde parou. Se quiser apagar tudo mesmo, apague a pasta você.',
    REMOVAL_APPIMAGE_P: 'Apague o arquivo. Como ele se colocou no menu, sobram um item de menu e um ícone:',
    REMOVAL_DEB_P: 'Remova como removeria qualquer outro. Se adicionou o repositório, tire ele também:',
    REMOVAL_WIN_P: 'Configurações, Aplicativos, Parallax Launcher, Desinstalar. Igual a qualquer outro.',
    COPY: 'Copiar',
    COPIED: 'Copiado',
    COPY_FAIL: 'Selecione',
    COPY_ARIA: 'Copiar estes comandos',

    REPO_NOTE_html: 'No Debian ou no Ubuntu dá para adicionar o repositório e deixar as atualizações com o sistema — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">os comandos estão aqui</a>. Como rodar a partir do código está <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">no readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — feito por Arda Yalın Özkan.<br>Software livre sob a licença <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Código-fonte',
    FOOT_RELEASES: 'Versões',
    FOOT_ISSUES: 'Relatar um problema',
    FOOT_FINE: 'Os jogos das capturas são a biblioteca pessoal de uma pessoa. Nomes e artes pertencem às respectivas publicadoras; nenhuma patrocina nem endossa este projeto.',

    DL_STARTING: 'Começando o download…',
    DL_RETRY: 'Não começou? Clique de novo',
    LANG_ARIA: 'Idioma'
},

zh: {
    NAV_DOWNLOAD: '下载',
    NAV_HELP: '帮助',
    NAV_SOURCE: '源代码',

    HERO_H1: '你所有的游戏，都在一处。',
    HERO_LEDE: 'Parallax Launcher 会把硬盘上已经装好的游戏找出来，补上封面，然后启动它们。它知道的一切都留在你自己的电脑上：不用账号，没有遥测，游戏库就是一个用文本编辑器就能打开的文件。',
    HERO_SOURCE: '查看源代码',
    HERO_NOTE: '依据 GNU GPL v3 发布的自由软件。不用安装，给它执行权限就能打开。',
    SHOT_LIBRARY: '游戏库 — 一整面墙的封面',

    LBL_WHAT: '它做什么',
    WHAT_H2: '从 Steam 自己的记录里找出已安装的游戏。',
    WHAT_LEDE: '不用漫无目的地翻文件夹。Steam 本来就记着自己装了哪些游戏，Parallax 读的正是这些记录。所以你看到的列表，就是硬盘上真实存在的东西。',

    F1_LBL: '查找',
    F1_H: '装了哪些游戏，一个不落',
    F1_P: '直接读取 Steam 的库文件夹和安装记录。所有磁盘上的都能找到，每一个都带着真实名称和 app id。',
    F2_LBL: '启动',
    F2_H: '走 Steam，或者不走',
    F2_P: '游戏可以交给 Steam，也可以直接运行；后者不会让 Steam 窗口跳到最前面。每个游戏都能单独设置，而且命令会先显示出来。',
    F3_LBL: '封面',
    F3_H: '不需要密钥的封面',
    F3_P: '官方封面和横幅来自 Steam 的公开图片：免费、不用注册、没有次数限制。填上 SteamGridDB 的密钥，社区做的那些也会一起进来。',
    F4_LBL: '游戏时长',
    F4_H: '你早就攒下的时间',
    F4_P: '它统计自己启动的时长，再加上你用这个程序之前 Steam 已经记下的时间。两个数字里取大的那个，谁也不覆盖。',
    F5_LBL: '兼容性',
    F5_H: 'Proton、Wine，以及其他',
    F5_P_html: '每个游戏单独的运行环境、用 Steam <code>%command%</code> 写法的启动选项、环境变量、GameMode 和 MangoHud。',
    F6_LBL: '属于你',
    F6_H: '在你的机器上，纯文本保存',
    F6_P: '游戏库是一个文本文件，图片就是普通图片。没有任何东西被传到别处，也不需要注册账号。',

    LBL_UPCLOSE: '细看',
    UPCLOSE_H2: '游戏页面及其设置。',
    UPCLOSE_LEDE: '兼容性选项的排布跟 Steam 一样。另外还有一样别人不给看的东西：马上要执行的那条命令。',
    SHOT_GAME: '单个游戏页面 — 封面、时长、开始游戏',
    SHOT_SETTINGS: '属性 — 运行环境、启动选项、究竟会运行什么',

    LBL_LANGS: '语言',
    LANGS_H2: '提供八种语言。',
    LANGS_LEDE: '程序里的每一句话，八种语言里都有。不是翻到一半、屏幕中间又冒出英文的那种半成品。',

    LBL_GET: '下载',
    GET_H2: '选择适合你系统的文件。',
    GET_LEDE: '三个都由同一份源代码、同一次自动构建产出，也都会自己保持更新。',

    CHIP_UPDATES: '自动更新',
    APPIMAGE_FOR: '任意发行版',
    APPIMAGE_P_html: '只有一个文件。浏览器下载时不会给它执行权限，这个权限由你来给：右键、属性、勾上<em>允许执行</em>，或者对文件执行 <code>chmod +x</code>。之后打开就行。第一次运行时它会把自己加进应用菜单；又因为只有一个文件，它能替换掉自己——有新版本时会提醒你并问要不要下载。',
    BTN_APPIMAGE: '下载 AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: '和你其他软件一样安装，也和它们一起出现在菜单里。它通过 <code>dpkg</code> 更新，跟任何安装一样会要密码。加上下面的软件源，这件事就归系统管了。',
    BTN_DEB: '下载 .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: '一个普通的安装程序：问你装在哪里，然后自己建好快捷方式。有新版本时会提醒你，你同意之后它替换掉自己。',
    EXE_WARN: '第一次 Windows 会拦下来 — 这里是过关方法',
    BTN_WIN: '下载 Windows 版',
    BTN_DL_LINUX: '下载 Linux 版',

    REMOVAL_H: '如何卸载',
    REMOVAL_DATA_html: '你的游戏库、设置和封面在 Linux 上放在 <code>~/.config/parallax-launcher</code>，在 Windows 上放在 <code>%APPDATA%\\parallax-launcher</code>。下面的步骤都不会碰这个文件夹，重装之后一切照旧。想彻底清空的话，请自己把它删掉。',
    REMOVAL_APPIMAGE_P: '删掉文件就行。因为它把自己加进过菜单，还会留下一个菜单项和一个图标：',
    REMOVAL_DEB_P: '跟卸载别的软件一样卸载。加过软件源的话，也一并去掉：',
    REMOVAL_WIN_P: '设置、应用、Parallax Launcher、卸载。跟其他程序没区别。',
    COPY: '复制',
    COPIED: '已复制',
    COPY_FAIL: '请手动选择',
    COPY_ARIA: '复制这些命令',

    REPO_NOTE_html: '在 Debian 或 Ubuntu 上，也可以改成添加软件源，把更新交给系统去做 — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">命令在这里</a>。从源代码运行的说明在 <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">readme</a> 里。',

    FOOT_BY_html: 'Parallax Launcher，作者 Arda Yalın Özkan。<br>依据 <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a> 发布的自由软件。',
    FOOT_SOURCE: '源代码',
    FOOT_RELEASES: '版本',
    FOOT_ISSUES: '反馈问题',
    FOOT_FINE: '截图里的游戏是某一个人的私人游戏库。它们的名称和美术资源归各自发行商所有；其中没有任何一方是赞助方，也不代表其认可本项目。',

    DL_STARTING: '开始下载…',
    DL_RETRY: '没有开始？再点一次',
    LANG_ARIA: '语言'
},

ko: {
    NAV_DOWNLOAD: '다운로드',
    NAV_HELP: '도움말',
    NAV_SOURCE: '소스 코드',

    HERO_H1: '당신의 모든 게임을 한곳에.',
    HERO_LEDE: 'Parallax Launcher는 디스크에 이미 깔려 있는 게임을 찾아내고, 표지를 채우고, 실행해 줍니다. 아는 것은 전부 사용자의 컴퓨터에만 남습니다. 계정도 없고 텔레메트리도 없으며, 라이브러리는 텍스트 편집기로 열리는 파일 하나입니다.',
    HERO_SOURCE: '소스 코드 보기',
    HERO_NOTE: 'GNU GPL v3으로 배포하는 자유 소프트웨어. 설치는 없고, 실행 권한만 주면 열립니다.',
    SHOT_LIBRARY: '라이브러리 — 표지로 가득한 벽',

    LBL_WHAT: '하는 일',
    WHAT_H2: '설치된 게임을 Steam 자체 기록에서 찾습니다.',
    WHAT_LEDE: '폴더를 뒤지며 요행을 바라지 않습니다. Steam은 자기가 설치한 게임을 이미 기록해 두고, Parallax는 바로 그 기록을 읽습니다. 그래서 목록에 보이는 것이 곧 디스크에 실제로 있는 것입니다.',

    F1_LBL: '찾기',
    F1_H: '설치된 게임 전부',
    F1_P: 'Steam의 라이브러리 폴더와 설치 기록을 그대로 읽습니다. 모든 드라이브에 걸쳐, 각각의 실제 이름과 app id까지 함께 가져옵니다.',
    F2_LBL: '실행',
    F2_H: 'Steam을 거치거나, 거치지 않거나',
    F2_P: '게임을 Steam에 넘겨도 되고 바로 실행해도 됩니다. 뒤쪽을 고르면 Steam 창이 앞으로 튀어나오지 않습니다. 게임마다 따로 정할 수 있고, 실행될 명령을 미리 보여 줍니다.',
    F3_LBL: '표지',
    F3_H: '키가 필요 없는 표지',
    F3_P: '공식 표지와 배너는 Steam의 공개 이미지에서 가져옵니다. 무료이고 가입도 횟수 제한도 없습니다. SteamGridDB 키를 넣으면 커뮤니티가 만든 것들도 함께 들어옵니다.',
    F4_LBL: '플레이 시간',
    F4_H: '이미 쌓아 둔 시간',
    F4_P: '직접 시작한 시간을 세고, 이 프로그램을 쓰기 전에 Steam이 기록해 둔 시간을 더합니다. 두 값 가운데 큰 쪽을 택하며 어느 쪽도 덮어쓰지 않습니다.',
    F5_LBL: '호환성',
    F5_H: 'Proton, Wine, 그리고 나머지',
    F5_P_html: '게임별 런타임, Steam의 <code>%command%</code> 문법을 쓰는 실행 옵션, 환경 변수, GameMode와 MangoHud.',
    F6_LBL: '당신의 것',
    F6_H: '당신의 기기에, 평문으로',
    F6_P: '라이브러리는 텍스트 파일이고 이미지는 평범한 이미지입니다. 어디로도 올라가지 않고, 만들 계정도 없습니다.',

    LBL_UPCLOSE: '가까이서',
    UPCLOSE_H2: '게임 페이지와 그 설정.',
    UPCLOSE_LEDE: '호환성 설정은 Steam과 같은 순서로 놓여 있습니다. 여기에 다른 곳에서는 보여 주지 않는 것이 하나 더 있습니다. 곧 실행될 명령 그 자체입니다.',
    SHOT_GAME: '게임 한 편의 페이지 — 표지, 플레이 시간, 실행',
    SHOT_SETTINGS: '속성 — 런타임, 실행 옵션, 무엇이 실행될지',

    LBL_LANGS: '언어',
    LANGS_H2: '여덟 개 언어로 제공됩니다.',
    LANGS_LEDE: '프로그램의 모든 문구가 여덟 언어에 다 있습니다. 화면 중간에서 영어로 되돌아가는 반쪽짜리 번역이 아닙니다.',

    LBL_GET: '다운로드',
    GET_H2: '당신의 시스템에 맞는 파일을 고르세요.',
    GET_LEDE: '셋 다 같은 소스에서 같은 자동 빌드로 나오고, 셋 다 스스로 최신 상태를 지킵니다.',

    CHIP_UPDATES: '스스로 업데이트',
    APPIMAGE_FOR: '모든 배포판',
    APPIMAGE_P_html: '파일 하나가 전부입니다. 브라우저는 실행 권한 없이 내려받으니 그 권한은 사용자가 줍니다. 마우스 오른쪽, 속성, <em>실행 허용</em>에 체크하거나 파일에 <code>chmod +x</code>. 그다음 열면 됩니다. 처음 실행할 때 스스로 응용 프로그램 메뉴에 등록되고, 파일이 하나뿐이라 자기 자신을 바꿔 놓을 수 있습니다. 새 버전이 나오면 알려 주고 내려받을지 물어봅니다.',
    BTN_APPIMAGE: 'AppImage 받기',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: '다른 프로그램과 같은 방식으로 설치되고 메뉴에도 나란히 놓입니다. <code>dpkg</code>로 업데이트하며, 다른 설치와 마찬가지로 암호를 묻습니다. 아래 저장소를 추가하면 이 일을 시스템이 맡습니다.',
    BTN_DEB: '.deb 받기',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: '평범한 설치 프로그램입니다. 어디에 둘지 묻고 바로 가기도 알아서 만듭니다. 새 버전이 나오면 알려 주고, 동의하면 자기 자신을 바꿔 놓습니다.',
    EXE_WARN: '처음에는 Windows가 막습니다 — 넘어가는 방법은 여기',
    BTN_WIN: 'Windows용 받기',
    BTN_DL_LINUX: 'Linux용 받기',

    REMOVAL_H: '삭제하기',
    REMOVAL_DATA_html: '라이브러리와 설정, 표지는 Linux에서는 <code>~/.config/parallax-launcher</code>, Windows에서는 <code>%APPDATA%\\parallax-launcher</code>에 있습니다. 아래 어떤 단계도 이 폴더를 건드리지 않으니 다시 설치하면 하던 곳에서 이어집니다. 전부 지우고 싶다면 폴더는 직접 삭제하세요.',
    REMOVAL_APPIMAGE_P: '파일을 지우면 됩니다. 스스로 메뉴에 등록했기 때문에 메뉴 항목과 아이콘이 남습니다:',
    REMOVAL_DEB_P: '다른 프로그램을 지우듯 지우면 됩니다. 저장소를 추가했다면 그것도 함께 빼세요:',
    REMOVAL_WIN_P: '설정, 앱, Parallax Launcher, 제거. 다른 프로그램과 똑같습니다.',
    COPY: '복사',
    COPIED: '복사됨',
    COPY_FAIL: '직접 선택',
    COPY_ARIA: '이 명령들 복사',

    REPO_NOTE_html: 'Debian이나 Ubuntu에서는 패키지 저장소를 추가해 업데이트를 시스템에 맡길 수도 있습니다 — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">명령은 여기</a>. 소스에서 실행하는 방법은 <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">readme</a>에 있습니다.',

    FOOT_BY_html: 'Parallax Launcher — 만든 사람 Arda Yalın Özkan.<br><a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>으로 배포하는 자유 소프트웨어.',
    FOOT_SOURCE: '소스 코드',
    FOOT_RELEASES: '릴리스',
    FOOT_ISSUES: '문제 알리기',
    FOOT_FINE: '스크린샷에 보이는 게임들은 한 사람의 개인 라이브러리입니다. 이름과 이미지는 각 배급사의 것이며, 어느 곳도 이 프로젝트를 후원하거나 보증하지 않습니다.',

    DL_STARTING: '다운로드를 시작합니다…',
    DL_RETRY: '시작되지 않았나요? 다시 클릭하세요',
    LANG_ARIA: '언어'
}
};

(() => {
    const FALLBACK = 'en';
    const STORE = 'parallaxLang';

    /* Which language to start in, in order of how much it means:
       the address bar (a link from the other site), then what the
       reader chose here before, then what the browser asks for. */
    function initial() {
        const asked = new URLSearchParams(location.search).get('lang');
        if (asked && PARALLAX_STRINGS[asked]) return asked;

        let saved = null;
        try { saved = localStorage.getItem(STORE); } catch { }
        if (saved && PARALLAX_STRINGS[saved]) return saved;

        for (const tag of navigator.languages || [navigator.language || '']) {
            const short = String(tag).toLowerCase().split('-')[0];
            if (PARALLAX_STRINGS[short]) return short;
        }
        return FALLBACK;
    }

    let current = initial();

    function apply(lang) {
        const table = PARALLAX_STRINGS[lang] || PARALLAX_STRINGS[FALLBACK];
        const fall = PARALLAX_STRINGS[FALLBACK];
        current = lang;
        document.documentElement.lang = lang;

        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.dataset.i18n;
            const html = key.endsWith('_html');
            const value = table[key] !== undefined ? table[key] : fall[key];
            if (value === undefined) return;
            if (html) el.innerHTML = value;
            else el.textContent = value;
        });

        // Attributes, which have no text node to replace.
        document.querySelectorAll('[data-i18n-attr]').forEach(el => {
            // "alt:SHOT_GAME" or "aria-label:COPY_ARIA, title:COPY"
            el.dataset.i18nAttr.split(',').forEach(pair => {
                const [attr, key] = pair.split(':').map(s => s.trim());
                const value = table[key] !== undefined ? table[key] : fall[key];
                if (attr && value !== undefined) el.setAttribute(attr, value);
            });
        });

        // Links to the help site carry the choice across: it is a
        // different subdomain, so it cannot read this one's storage.
        document.querySelectorAll('a[href*="help.parallaxlauncher.com"]').forEach(a => {
            try {
                const url = new URL(a.href);
                url.searchParams.set('lang', lang);
                a.href = url.toString();
            } catch { }
        });

        document.dispatchEvent(new CustomEvent('parallax:lang', { detail: { lang, table } }));
    }

    /* The picker. Built here rather than written into every page, so a
       new language is one entry in the table above and nothing else. */
    function mount() {
        const host = document.querySelector('[data-lang-mount]');
        if (!host) return;

        const select = document.createElement('select');
        select.className = 'langpick';
        select.setAttribute('aria-label', (PARALLAX_STRINGS[current] || {}).LANG_ARIA || 'Language');

        for (const [code, name] of Object.entries(PARALLAX_LANGS)) {
            const option = document.createElement('option');
            option.value = code;
            option.textContent = name;
            if (code === current) option.selected = true;
            select.appendChild(option);
        }

        select.addEventListener('change', () => {
            try { localStorage.setItem(STORE, select.value); } catch { }
            apply(select.value);
            select.setAttribute('aria-label', PARALLAX_STRINGS[select.value].LANG_ARIA);
        });

        host.appendChild(select);
    }

    const start = () => { mount(); apply(current); };
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
    else start();

    // So the rest of the page can ask what is in force.
    window.parallaxI18n = {
        get lang() { return current; },
        t(key) {
            const table = PARALLAX_STRINGS[current] || {};
            return table[key] !== undefined ? table[key] : PARALLAX_STRINGS[FALLBACK][key];
        }
    };
})();
