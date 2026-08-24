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

    HERO_H1: 'One shelf for every game you own.',
    HERO_LEDE: 'Parallax Launcher finds the games already on your disk, fills in their artwork, and starts them. Everything it knows stays on your computer — no account, no telemetry, and a library you can open in a text editor.',
    HERO_SOURCE: 'Read the source',
    HERO_NOTE: 'Free software under the GNU GPL v3. No install — make it executable and run it.',
    SHOT_LIBRARY: 'The library — a wall of cover art',

    LBL_WHAT: 'What it does',
    WHAT_H2: 'It reads what Steam already knows.',
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
    UPCLOSE_H2: 'Everything it will do, before it does it.',
    UPCLOSE_LEDE: 'Compatibility settings the way Steam lays them out — and one line the others leave out: the exact command that is about to run.',
    SHOT_GAME: "A game's page — cover, playtime, Play",
    SHOT_SETTINGS: 'Properties — runtime, launch options, what will run',

    LBL_LANGS: 'Languages',
    LANGS_H2: 'Eight, all the way through.',
    LANGS_LEDE: 'Every string in the app exists in all of them — not a partial translation that falls back to English halfway down a screen.',

    LBL_GET: 'Download',
    GET_H2: 'Take the one for your system.',
    GET_LEDE: 'All three are built from the same source by the same automated run, and all three keep themselves up to date.',

    CHIP_UPDATES: 'Updates itself',
    APPIMAGE_FOR: 'Any distribution',
    APPIMAGE_P_html: 'One file. Your browser downloads it without permission to run, so give it that first — right-click, Properties, tick <em>allow executing</em>, or <code>chmod +x</code> on the file. Then open it. It adds itself to your application menu on first run, and because it is a single file it can replace itself: it watches for new releases and offers to fetch one.',
    APPIMAGE_NOTE_html: 'Nothing happens when you open it? An AppImage needs <code>libfuse2</code>, which Ubuntu has not installed by default since 22.04. Either install it — <code>sudo apt install libfuse2</code> — or run the file once with <code>--appimage-extract-and-run</code>, which needs no such thing. On Debian and Ubuntu the .deb below avoids the question entirely.',
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
    NAV_SOURCE: 'Kaynak',

    HERO_H1: 'Sahip olduğun her oyun için tek bir raf.',
    HERO_LEDE: 'Parallax Launcher diskinde zaten duran oyunları bulur, kapaklarını tamamlar ve başlatır. Bildiği her şey senin bilgisayarında kalır — hesap yok, telemetri yok, kütüphanen ise bir metin düzenleyicide açılabilecek kadar sade.',
    HERO_SOURCE: 'Kaynağı oku',
    HERO_NOTE: 'GNU GPL v3 altında özgür yazılım. Kurulum yok — çalıştırma izni ver ve aç.',
    SHOT_LIBRARY: 'Kütüphane — baştan başa kapak resmi',

    LBL_WHAT: 'Ne yapar',
    WHAT_H2: "Steam'in zaten bildiğini okur.",
    WHAT_LEDE: "Klasörleri tarayıp şansa güvenmek yok. Parallax, Steam'in kendi kurulum kayıtlarını açar; yani sana gösterdiği şey diskte gerçekten duran şeydir.",

    F1_LBL: 'Bulma',
    F1_H: 'Kurulu oyunların, eksiksiz',
    F1_P: "Steam'in kütüphane klasörlerini ve kurulum kayıtlarını doğrudan okur — her diskte, her birinin gerçek adı ve uygulama kimliğiyle birlikte.",
    F2_LBL: 'Başlatma',
    F2_H: "Steam üzerinden ya da Steam'e uğramadan",
    F2_P: "Oyunu Steam'e devret ya da doğrudan çalıştır; böylece Steam penceresi önüne atlamaz. Oyun başına ayarlanır ve çalışacak komutu önce sana gösterir.",
    F3_LBL: 'Kapaklar',
    F3_H: 'Anahtarsız kapak resmi',
    F3_P: "Resmî kapakları ve afişleri Steam'in açık görsellerinden çeker — ücretsiz, kayıt yok, kota yok. SteamGridDB anahtarı eklersen topluluğun emeği de açılır.",
    F4_LBL: 'Oynama süresi',
    F4_H: 'Zaten kazandığın saatler',
    F4_P: "Kendi başlattığı oturumları sayar ve sen bunu açmadan önce Steam'in kaydettiklerini de katar — büyük olan sayıyı alır, hiçbir zaman üstüne yazmaz.",
    F5_LBL: 'Uyumluluk',
    F5_H: 'Proton, Wine ve gerisi',
    F5_P_html: "Oyun başına çalışma ortamı, Steam'in <code>%command%</code> yazımıyla başlatma seçenekleri, ortam değişkenleri, GameMode ve MangoHud.",
    F6_LBL: 'Senin',
    F6_H: 'Kendi makinende, düz metin olarak',
    F6_P: 'Kütüphane bir metin dosyası. Görseller sıradan görseller. Hiçbir yere hiçbir şey yüklenmiyor ve açılacak bir hesap yok.',

    LBL_UPCLOSE: 'Yakından',
    UPCLOSE_H2: 'Ne yapacağını, yapmadan önce.',
    UPCLOSE_LEDE: "Uyumluluk ayarları Steam'in dizdiği gibi — artı diğerlerinin atladığı tek satır: az sonra çalışacak olan komutun kendisi.",
    SHOT_GAME: 'Bir oyunun sayfası — kapak, süre, Oynat',
    SHOT_SETTINGS: 'Özellikler — çalışma ortamı, başlatma seçenekleri, ne çalışacağı',

    LBL_LANGS: 'Diller',
    LANGS_H2: 'Sekiz dil, baştan sona.',
    LANGS_LEDE: 'Uygulamadaki her metin sekizinde de var — ekranın yarısında İngilizceye düşen yarım bir çeviri değil.',

    LBL_GET: 'İndir',
    GET_H2: 'Sistemine uyanı al.',
    GET_LEDE: 'Üçü de aynı kaynaktan, aynı otomatik derlemeyle üretiliyor ve üçü de kendini güncel tutuyor.',

    CHIP_UPDATES: 'Kendini günceller',
    APPIMAGE_FOR: 'Her dağıtım',
    APPIMAGE_P_html: 'Tek dosya. Tarayıcın onu çalıştırma izni olmadan indirir, o izni önce sen ver — sağ tık, Özellikler, <em>çalıştırmaya izin ver</em>, ya da dosyaya <code>chmod +x</code>. Sonra aç. İlk açılışta kendini uygulama menüne ekler ve tek dosya olduğu için kendi yerine geçebilir: yeni sürümleri kollar ve indirmeyi teklif eder.',
    APPIMAGE_NOTE_html: 'Açtığında hiçbir şey olmuyor mu? AppImage <code>libfuse2</code> ister; Ubuntu 22.04\'ten beri onu varsayılan olarak kurmuyor. Ya kur — <code>sudo apt install libfuse2</code> — ya da dosyayı bir kez <code>--appimage-extract-and-run</code> ile çalıştır, o hiçbir şey istemez. Debian ve Ubuntu\'da aşağıdaki .deb bu soruyu tamamen ortadan kaldırır.',
    BTN_APPIMAGE: "AppImage'ı indir",

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Diğer yazılımların gibi kurulur ve menünde onlarla birlikte görünür. Kendini de günceller, <code>dpkg</code> üzerinden — yani her kurulum gibi parolanı sorar. Aşağıdaki depoyu eklersen bu işi sistemin devralır.',
    BTN_DEB: '.deb indir',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Sıradan bir kurulum programı — nereye kurulacağını sorar ve kısayolları yapar. Yeni sürümleri kollar ve sen söyleyince kendini değiştirir.',
    EXE_WARN: 'Windows ilk seferde engelliyor — nasıl aşılacağı burada',
    BTN_WIN: 'Windows için indir',
    BTN_DL_LINUX: 'Linux için indir',

    REMOVAL_H: 'Kaldırma',
    REMOVAL_DATA_html: "Kütüphanen, ayarların ve kapakların Linux'ta <code>~/.config/parallax-launcher</code>, Windows'ta <code>%APPDATA%\\parallax-launcher</code> içinde durur. Aşağıdaki adımların hiçbiri o klasöre dokunmaz; yani yeniden kurunca kaldığın yerden devam edersin — her şey gitsin istiyorsan onu kendin sil.",
    REMOVAL_APPIMAGE_P: 'Dosyayı sil. Kendini menüne eklediği için arkasında bir menü girdisi ve bir ikon da bıraktı:',
    REMOVAL_DEB_P: 'Her şeyi kaldırdığın gibi kaldır. Depoyu eklediysen onu da at:',
    REMOVAL_WIN_P: 'Ayarlar, Uygulamalar, Parallax Launcher, Kaldır. Diğerlerinden farkı yok.',
    COPY: 'Kopyala',
    COPIED: 'Kopyalandı',
    COPY_FAIL: 'Elle seç',
    COPY_ARIA: 'Bu komutları kopyala',

    REPO_NOTE_html: 'Debian ya da Ubuntu kullanıyorsan bunun yerine paket deposunu ekleyip güncellemeyi sisteme bırakabilirsin — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">komutlar burada</a>. Kaynaktan çalıştırmak ise <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">benioku dosyasında</a>.',

    FOOT_BY_html: 'Parallax Launcher — Arda Yalın Özkan tarafından yapıldı.<br><a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a> altında özgür yazılım.',
    FOOT_SOURCE: 'Kaynak',
    FOOT_RELEASES: 'Sürümler',
    FOOT_ISSUES: 'Sorun bildir',
    FOOT_FINE: 'Ekran görüntülerindeki oyunlar bir kişinin kendi kütüphanesidir. Adları ve görselleri yayıncılarına aittir; hiçbiri sponsor değildir ve bu projeyi desteklediği anlamına gelmez.',

    DL_STARTING: 'İndirme başlıyor…',
    DL_RETRY: 'Başlamadı mı? Tekrar tıkla',
    LANG_ARIA: 'Dil'
},

de: {
    NAV_DOWNLOAD: 'Download',
    NAV_HELP: 'Hilfe',
    NAV_SOURCE: 'Quellcode',

    HERO_H1: 'Ein Regal für jedes Spiel, das dir gehört.',
    HERO_LEDE: 'Parallax Launcher findet die Spiele, die schon auf deiner Festplatte liegen, ergänzt ihre Bilder und startet sie. Alles, was er weiß, bleibt auf deinem Rechner — kein Konto, keine Telemetrie, und eine Bibliothek, die du in einem Texteditor öffnen kannst.',
    HERO_SOURCE: 'Quellcode lesen',
    HERO_NOTE: 'Freie Software unter der GNU GPL v3. Keine Installation — ausführbar machen und starten.',
    SHOT_LIBRARY: 'Die Bibliothek — eine Wand aus Titelbildern',

    LBL_WHAT: 'Was er tut',
    WHAT_H2: 'Er liest, was Steam ohnehin weiß.',
    WHAT_LEDE: 'Kein Durchsuchen von Ordnern auf gut Glück. Parallax öffnet Steams eigene Installationsdaten — was er dir zeigt, liegt also wirklich auf der Platte.',

    F1_LBL: 'Finden',
    F1_H: 'Deine installierten Spiele, genau',
    F1_P: 'Liest Steams Bibliotheksordner und Installationsdateien direkt — über alle Laufwerke hinweg, mit echtem Namen und App-ID.',
    F2_LBL: 'Starten',
    F2_H: 'Über Steam oder daran vorbei',
    F2_P: 'Übergib das Spiel an Steam oder starte es direkt, damit sich das Steam-Fenster nie in den Vordergrund drängt. Pro Spiel einstellbar — und der genaue Befehl steht vorher da.',
    F3_LBL: 'Bilder',
    F3_H: 'Titelbilder, ohne Schlüssel',
    F3_P: 'Holt offizielle Titelbilder und Banner aus Steams öffentlichen Bildern — kostenlos, ohne Anmeldung, ohne Limit. Mit einem SteamGridDB-Schlüssel kommt die Arbeit der Community dazu.',
    F4_LBL: 'Spielzeit',
    F4_H: 'Stunden, die dir schon gehören',
    F4_P: 'Zählt die Sitzungen, die er selbst startet, und rechnet dazu, was Steam vorher aufgezeichnet hat — er nimmt die größere Zahl und überschreibt nie.',
    F5_LBL: 'Kompatibilität',
    F5_H: 'Proton, Wine und der Rest',
    F5_P_html: 'Laufzeitumgebung pro Spiel, Startoptionen mit Steams <code>%command%</code>-Syntax, Umgebungsvariablen, GameMode und MangoHud.',
    F6_LBL: 'Deins',
    F6_H: 'Auf deinem Rechner, im Klartext',
    F6_P: 'Die Bibliothek ist eine Textdatei. Die Bilder sind gewöhnliche Bilder. Nichts wird irgendwohin hochgeladen, und es gibt kein Konto anzulegen.',

    LBL_UPCLOSE: 'Aus der Nähe',
    UPCLOSE_H2: 'Alles, was er tun wird — bevor er es tut.',
    UPCLOSE_LEDE: 'Kompatibilitätseinstellungen so angeordnet wie bei Steam — und eine Zeile, die die anderen weglassen: der genaue Befehl, der gleich läuft.',
    SHOT_GAME: 'Die Seite eines Spiels — Bild, Spielzeit, Start',
    SHOT_SETTINGS: 'Eigenschaften — Laufzeit, Startoptionen, was ausgeführt wird',

    LBL_LANGS: 'Sprachen',
    LANGS_H2: 'Acht, durchgehend.',
    LANGS_LEDE: 'Jeder Text der Anwendung existiert in allen acht — keine halbe Übersetzung, die auf halber Seite ins Englische zurückfällt.',

    LBL_GET: 'Download',
    GET_H2: 'Nimm die für dein System.',
    GET_LEDE: 'Alle drei entstehen aus derselben Quelle im selben automatischen Durchlauf, und alle drei halten sich selbst aktuell.',

    CHIP_UPDATES: 'Aktualisiert sich selbst',
    APPIMAGE_FOR: 'Jede Distribution',
    APPIMAGE_P_html: 'Eine Datei. Dein Browser lädt sie ohne Ausführungsrecht herunter, also gib es ihr zuerst — Rechtsklick, Eigenschaften, <em>Ausführen erlauben</em>, oder <code>chmod +x</code> auf die Datei. Dann öffnen. Beim ersten Start trägt sie sich in dein Anwendungsmenü ein, und weil sie eine einzelne Datei ist, kann sie sich selbst ersetzen: sie achtet auf neue Versionen und bietet sie an.',
    APPIMAGE_NOTE_html: 'Es passiert gar nichts beim Öffnen? Ein AppImage braucht <code>libfuse2</code>, das Ubuntu seit 22.04 nicht mehr vorinstalliert. Entweder installieren — <code>sudo apt install libfuse2</code> — oder die Datei einmal mit <code>--appimage-extract-and-run</code> starten, das braucht nichts dergleichen. Unter Debian und Ubuntu erspart dir das .deb weiter unten die Frage ganz.',
    BTN_APPIMAGE: 'AppImage laden',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Installiert sich wie deine übrige Software und erscheint mit allem anderen im Menü. Es aktualisiert sich ebenfalls selbst, über <code>dpkg</code> — es fragt also nach deinem Passwort wie jede Installation. Füge das Repository unten hinzu, dann übernimmt dein System das.',
    BTN_DEB: '.deb laden',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Ein gewöhnliches Installationsprogramm — es fragt, wohin, und legt die Verknüpfungen an. Es achtet auf neue Versionen und ersetzt sich, wenn du es erlaubst.',
    EXE_WARN: 'Windows blockiert es beim ersten Mal — so kommst du daran vorbei',
    BTN_WIN: 'Für Windows laden',
    BTN_DL_LINUX: 'Für Linux laden',

    REMOVAL_H: 'Entfernen',
    REMOVAL_DATA_html: 'Deine Bibliothek, deine Einstellungen und deine Bilder liegen unter Linux in <code>~/.config/parallax-launcher</code> und unter Windows in <code>%APPDATA%\\parallax-launcher</code>. Keiner der Schritte unten rührt diesen Ordner an — eine Neuinstallation macht also dort weiter, wo du aufgehört hast. Wenn wirklich alles weg soll, lösche ihn selbst.',
    REMOVAL_APPIMAGE_P: 'Lösche die Datei. Sie hat außerdem einen Menüeintrag und ein Symbol hinterlassen, weil sie sich selbst ins Menü eingetragen hat:',
    REMOVAL_DEB_P: 'Entferne es wie alles andere. Wenn du das Repository hinzugefügt hast, wirf es auch weg:',
    REMOVAL_WIN_P: 'Einstellungen, Apps, Parallax Launcher, Deinstallieren. Wie bei allem anderen.',
    COPY: 'Kopieren',
    COPIED: 'Kopiert',
    COPY_FAIL: 'Selbst markieren',
    COPY_ARIA: 'Diese Befehle kopieren',

    REPO_NOTE_html: 'Unter Debian oder Ubuntu kannst du stattdessen das Paket-Repository hinzufügen und die Aktualisierung deinem System überlassen — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">die Befehle stehen hier</a>. Das Ausführen aus dem Quellcode steht <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">in der Readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — erstellt von Arda Yalın Özkan.<br>Freie Software unter der <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Quellcode',
    FOOT_RELEASES: 'Versionen',
    FOOT_ISSUES: 'Problem melden',
    FOOT_FINE: 'Die in den Screenshots gezeigten Spiele sind die private Bibliothek einer Person. Namen und Bilder gehören ihren Herausgebern; keiner davon ist Sponsor oder unterstützt dieses Projekt.',

    DL_STARTING: 'Download beginnt…',
    DL_RETRY: 'Nicht gestartet? Noch einmal klicken',
    LANG_ARIA: 'Sprache'
},

ru: {
    NAV_DOWNLOAD: 'Скачать',
    NAV_HELP: 'Помощь',
    NAV_SOURCE: 'Исходный код',

    HERO_H1: 'Одна полка для всех ваших игр.',
    HERO_LEDE: 'Parallax Launcher находит игры, которые уже лежат на диске, подставляет обложки и запускает их. Всё, что он знает, остаётся на вашем компьютере — ни учётной записи, ни телеметрии, а библиотеку можно открыть в текстовом редакторе.',
    HERO_SOURCE: 'Посмотреть исходный код',
    HERO_NOTE: 'Свободное программное обеспечение под GNU GPL v3. Без установки — сделайте файл исполняемым и запустите.',
    SHOT_LIBRARY: 'Библиотека — стена из обложек',

    LBL_WHAT: 'Что он делает',
    WHAT_H2: 'Читает то, что Steam уже знает.',
    WHAT_LEDE: 'Никакого перебора папок наугад. Parallax открывает собственные записи Steam об установках, поэтому показывает именно то, что действительно лежит на диске.',

    F1_LBL: 'Поиск',
    F1_H: 'Ваши установленные игры, точно',
    F1_P: 'Читает библиотечные папки и манифесты установки Steam напрямую — на всех дисках, с настоящим названием и app id каждой игры.',
    F2_LBL: 'Запуск',
    F2_H: 'Через Steam или мимо него',
    F2_P: 'Передайте игру Steam или запустите напрямую, чтобы окно Steam не выскакивало на передний план. Настраивается для каждой игры, и сначала показывается точная команда.',
    F3_LBL: 'Обложки',
    F3_H: 'Обложки без ключа',
    F3_P: 'Берёт официальные обложки и баннеры из открытых изображений Steam — бесплатно, без регистрации и ограничений. Добавьте ключ SteamGridDB, и откроется работа сообщества.',
    F4_LBL: 'Время в игре',
    F4_H: 'Часы, которые вы уже наиграли',
    F4_P: 'Считает сессии, которые запускает сам, и добавляет то, что Steam записал до того, как вы это открыли — берёт большее число и никогда не перезаписывает.',
    F5_LBL: 'Совместимость',
    F5_H: 'Proton, Wine и остальное',
    F5_P_html: 'Среда выполнения для каждой игры, параметры запуска с синтаксисом Steam <code>%command%</code>, переменные окружения, GameMode и MangoHud.',
    F6_LBL: 'Ваше',
    F6_H: 'На вашей машине, обычным текстом',
    F6_P: 'Библиотека — это текстовый файл. Изображения — обычные изображения. Никуда ничего не загружается, и учётную запись создавать не нужно.',

    LBL_UPCLOSE: 'Вблизи',
    UPCLOSE_H2: 'Всё, что он сделает, — до того, как сделает.',
    UPCLOSE_LEDE: 'Настройки совместимости в том же порядке, что и в Steam, — плюс строка, которую остальные опускают: точная команда, которая сейчас выполнится.',
    SHOT_GAME: 'Страница игры — обложка, время, «Играть»',
    SHOT_SETTINGS: 'Свойства — среда выполнения, параметры запуска, что именно запустится',

    LBL_LANGS: 'Языки',
    LANGS_H2: 'Восемь, до самого конца.',
    LANGS_LEDE: 'Каждая строка приложения есть на всех восьми — это не половинчатый перевод, который посреди экрана срывается на английский.',

    LBL_GET: 'Скачать',
    GET_H2: 'Возьмите тот, что подходит вашей системе.',
    GET_LEDE: 'Все три собираются из одного исходного кода одним и тем же автоматическим прогоном, и все три обновляются сами.',

    CHIP_UPDATES: 'Обновляется сам',
    APPIMAGE_FOR: 'Любой дистрибутив',
    APPIMAGE_P_html: 'Один файл. Браузер скачивает его без права на запуск, так что дайте это право сами — правой кнопкой, «Свойства», отметьте <em>разрешить выполнение</em>, или <code>chmod +x</code> на файл. Затем откройте. При первом запуске он добавляет себя в меню приложений, а поскольку это один файл, он может заменить сам себя: следит за новыми выпусками и предлагает их скачать.',
    APPIMAGE_NOTE_html: 'Открываете — и ничего не происходит? AppImage требует <code>libfuse2</code>, который Ubuntu не ставит по умолчанию с версии 22.04. Либо установите — <code>sudo apt install libfuse2</code> — либо запустите файл один раз с <code>--appimage-extract-and-run</code>, ему это не нужно. В Debian и Ubuntu пакет .deb ниже снимает вопрос целиком.',
    BTN_APPIMAGE: 'Скачать AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Устанавливается так же, как остальные ваши программы, и появляется в меню вместе с ними. Он тоже обновляется сам, через <code>dpkg</code> — а значит, спрашивает пароль, как любая установка. Добавьте репозиторий ниже, и это возьмёт на себя система.',
    BTN_DEB: 'Скачать .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Обычный установщик — спрашивает, куда всё положить, и создаёт ярлыки. Следит за новыми версиями и заменяет себя, когда вы разрешите.',
    EXE_WARN: 'Windows блокирует его в первый раз — вот как это обойти',
    BTN_WIN: 'Скачать для Windows',
    BTN_DL_LINUX: 'Скачать для Linux',

    REMOVAL_H: 'Как удалить',
    REMOVAL_DATA_html: 'Ваша библиотека, настройки и обложки лежат в <code>~/.config/parallax-launcher</code> в Linux и в <code>%APPDATA%\\parallax-launcher</code> в Windows. Ни один из шагов ниже эту папку не трогает, поэтому после переустановки всё продолжится с того же места — если хотите стереть всё, удалите её сами.',
    REMOVAL_APPIMAGE_P: 'Удалите файл. Он также оставил после себя пункт меню и значок, потому что сам добавил себя в меню:',
    REMOVAL_DEB_P: 'Удалите его так же, как всё остальное. Если добавляли репозиторий, уберите и его:',
    REMOVAL_WIN_P: 'Параметры, Приложения, Parallax Launcher, Удалить. Как и всё прочее.',
    COPY: 'Копировать',
    COPIED: 'Скопировано',
    COPY_FAIL: 'Выделите сами',
    COPY_ARIA: 'Скопировать эти команды',

    REPO_NOTE_html: 'В Debian или Ubuntu можно вместо этого добавить репозиторий и оставить обновления системе — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">команды здесь</a>. Запуск из исходного кода описан <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">в readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — создан Arda Yalın Özkan.<br>Свободное ПО под <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Исходный код',
    FOOT_RELEASES: 'Выпуски',
    FOOT_ISSUES: 'Сообщить о проблеме',
    FOOT_FINE: 'Игры на снимках экрана — личная библиотека одного человека. Их названия и изображения принадлежат издателям; никто из них не спонсирует этот проект и не поддерживает его.',

    DL_STARTING: 'Загрузка начинается…',
    DL_RETRY: 'Не началась? Нажмите ещё раз',
    LANG_ARIA: 'Язык'
},

uk: {
    NAV_DOWNLOAD: 'Завантажити',
    NAV_HELP: 'Довідка',
    NAV_SOURCE: 'Вихідний код',

    HERO_H1: 'Одна полиця для всіх ваших ігор.',
    HERO_LEDE: 'Parallax Launcher знаходить ігри, які вже лежать на диску, підставляє обкладинки й запускає їх. Усе, що він знає, лишається на вашому комп’ютері — ні облікового запису, ні телеметрії, а бібліотеку можна відкрити в текстовому редакторі.',
    HERO_SOURCE: 'Переглянути код',
    HERO_NOTE: 'Вільне програмне забезпечення під GNU GPL v3. Без встановлення — зробіть файл виконуваним і запустіть.',
    SHOT_LIBRARY: 'Бібліотека — стіна з обкладинок',

    LBL_WHAT: 'Що він робить',
    WHAT_H2: 'Читає те, що Steam уже знає.',
    WHAT_LEDE: 'Жодного перебору тек навмання. Parallax відкриває власні записи Steam про встановлення, тож показує саме те, що справді лежить на диску.',

    F1_LBL: 'Пошук',
    F1_H: 'Ваші встановлені ігри, точно',
    F1_P: 'Читає бібліотечні теки та маніфести встановлення Steam напряму — на всіх дисках, зі справжньою назвою й app id кожної гри.',
    F2_LBL: 'Запуск',
    F2_H: 'Через Steam або повз нього',
    F2_P: 'Передайте гру Steam або запустіть напряму, щоб вікно Steam не вистрибувало наперед. Налаштовується для кожної гри, і спершу показується точна команда.',
    F3_LBL: 'Обкладинки',
    F3_H: 'Обкладинки без ключа',
    F3_P: 'Бере офіційні обкладинки й банери з відкритих зображень Steam — безкоштовно, без реєстрації та обмежень. Додайте ключ SteamGridDB — і відкриється робота спільноти.',
    F4_LBL: 'Час у грі',
    F4_H: 'Години, які ви вже награли',
    F4_P: 'Рахує сеанси, які запускає сам, і додає те, що Steam записав до того, як ви це відкрили — бере більше число й ніколи не перезаписує.',
    F5_LBL: 'Сумісність',
    F5_H: 'Proton, Wine та решта',
    F5_P_html: 'Середовище виконання для кожної гри, параметри запуску із синтаксисом Steam <code>%command%</code>, змінні середовища, GameMode і MangoHud.',
    F6_LBL: 'Ваше',
    F6_H: 'На вашій машині, звичайним текстом',
    F6_P: 'Бібліотека — це текстовий файл. Зображення — звичайні зображення. Нікуди нічого не завантажується, і жодного облікового запису створювати не треба.',

    LBL_UPCLOSE: 'Зблизька',
    UPCLOSE_H2: 'Усе, що він зробить, — перш ніж зробить.',
    UPCLOSE_LEDE: 'Налаштування сумісності в тому ж порядку, що й у Steam, — плюс рядок, який решта пропускає: точна команда, яка зараз виконається.',
    SHOT_GAME: 'Сторінка гри — обкладинка, час, «Грати»',
    SHOT_SETTINGS: 'Властивості — середовище, параметри запуску, що саме запуститься',

    LBL_LANGS: 'Мови',
    LANGS_H2: 'Вісім, до самого кінця.',
    LANGS_LEDE: 'Кожен рядок застосунку є в усіх восьми — це не половинчастий переклад, що посеред екрана зривається на англійську.',

    LBL_GET: 'Завантажити',
    GET_H2: 'Візьміть той, що підходить вашій системі.',
    GET_LEDE: 'Усі три збираються з одного коду одним і тим самим автоматичним прогоном, і всі три оновлюються самі.',

    CHIP_UPDATES: 'Оновлюється сам',
    APPIMAGE_FOR: 'Будь-який дистрибутив',
    APPIMAGE_P_html: 'Один файл. Браузер завантажує його без права на запуск, тож дайте це право самі — права кнопка, «Властивості», позначте <em>дозволити виконання</em>, або <code>chmod +x</code> на файл. Тоді відкрийте. Під час першого запуску він додає себе до меню програм, а оскільки це один файл, він може замінити сам себе: стежить за новими випусками й пропонує їх завантажити.',
    APPIMAGE_NOTE_html: 'Відкриваєте — і нічого не відбувається? AppImage потребує <code>libfuse2</code>, який Ubuntu не встановлює типово з версії 22.04. Або встановіть — <code>sudo apt install libfuse2</code> — або запустіть файл один раз із <code>--appimage-extract-and-run</code>, йому це не потрібно. У Debian та Ubuntu пакунок .deb нижче знімає питання цілком.',
    BTN_APPIMAGE: 'Завантажити AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Встановлюється так само, як інші ваші програми, і з’являється в меню разом із ними. Він теж оновлюється сам, через <code>dpkg</code> — а отже, питає пароль, як будь-яке встановлення. Додайте репозиторій нижче, і це візьме на себе система.',
    BTN_DEB: 'Завантажити .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Звичайний інсталятор — питає, куди все покласти, і створює ярлики. Стежить за новими версіями й замінює себе, коли ви дозволите.',
    EXE_WARN: 'Windows блокує його першого разу — ось як це обійти',
    BTN_WIN: 'Завантажити для Windows',
    BTN_DL_LINUX: 'Завантажити для Linux',

    REMOVAL_H: 'Як видалити',
    REMOVAL_DATA_html: 'Ваша бібліотека, налаштування й обкладинки лежать у <code>~/.config/parallax-launcher</code> в Linux і в <code>%APPDATA%\\parallax-launcher</code> у Windows. Жоден із кроків нижче цієї теки не чіпає, тож після перевстановлення все триватиме з того самого місця — якщо хочете стерти все, видаліть її самі.',
    REMOVAL_APPIMAGE_P: 'Видаліть файл. Він також лишив по собі пункт меню та піктограму, бо сам додав себе до меню:',
    REMOVAL_DEB_P: 'Видаліть його так само, як усе інше. Якщо додавали репозиторій, приберіть і його:',
    REMOVAL_WIN_P: 'Параметри, Програми, Parallax Launcher, Видалити. Як і все решта.',
    COPY: 'Копіювати',
    COPIED: 'Скопійовано',
    COPY_FAIL: 'Виділіть самі',
    COPY_ARIA: 'Скопіювати ці команди',

    REPO_NOTE_html: 'У Debian чи Ubuntu можна натомість додати репозиторій і лишити оновлення системі — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">команди тут</a>. Запуск із вихідного коду описано <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">у readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — створив Arda Yalın Özkan.<br>Вільне ПЗ під <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Вихідний код',
    FOOT_RELEASES: 'Випуски',
    FOOT_ISSUES: 'Повідомити про проблему',
    FOOT_FINE: 'Ігри на знімках екрана — особиста бібліотека однієї людини. Їхні назви та зображення належать видавцям; ніхто з них не спонсорує цей проєкт і не підтримує його.',

    DL_STARTING: 'Завантаження починається…',
    DL_RETRY: 'Не почалося? Натисніть ще раз',
    LANG_ARIA: 'Мова'
},

pt: {
    NAV_DOWNLOAD: 'Baixar',
    NAV_HELP: 'Ajuda',
    NAV_SOURCE: 'Código',

    HERO_H1: 'Uma prateleira para cada jogo que é seu.',
    HERO_LEDE: 'O Parallax Launcher encontra os jogos que já estão no seu disco, preenche as artes e os inicia. Tudo o que ele sabe fica no seu computador — sem conta, sem telemetria, e uma biblioteca que você pode abrir num editor de texto.',
    HERO_SOURCE: 'Ler o código',
    HERO_NOTE: 'Software livre sob a GNU GPL v3. Sem instalação — torne o arquivo executável e abra.',
    SHOT_LIBRARY: 'A biblioteca — uma parede de capas',

    LBL_WHAT: 'O que ele faz',
    WHAT_H2: 'Ele lê o que a Steam já sabe.',
    WHAT_LEDE: 'Nada de vasculhar pastas na esperança. O Parallax abre os próprios registros de instalação da Steam, então o que ele mostra é o que está de fato no disco.',

    F1_LBL: 'Encontrar',
    F1_H: 'Seus jogos instalados, exatamente',
    F1_P: 'Lê as pastas de biblioteca e os manifestos de instalação da Steam diretamente — em todos os discos, com o nome real e o app id de cada um.',
    F2_LBL: 'Iniciar',
    F2_H: 'Pela Steam, ou passando por fora dela',
    F2_P: 'Entregue o jogo à Steam ou execute-o direto, para que a janela da Steam nunca salte à frente. Configurável por jogo, e o comando exato aparece antes.',
    F3_LBL: 'Artes',
    F3_H: 'Capas, sem chave',
    F3_P: 'Busca capas e banners oficiais nas imagens públicas da Steam — de graça, sem cadastro, sem limite. Adicione uma chave da SteamGridDB e o trabalho da comunidade também se abre.',
    F4_LBL: 'Tempo de jogo',
    F4_H: 'As horas que você já fez',
    F4_P: 'Conta as sessões que ele mesmo inicia e soma o que a Steam registrou antes de você abrir isto — fica com o número maior e nunca sobrescreve.',
    F5_LBL: 'Compatibilidade',
    F5_H: 'Proton, Wine e o resto',
    F5_P_html: 'Runtime por jogo, opções de inicialização com a sintaxe <code>%command%</code> da Steam, variáveis de ambiente, GameMode e MangoHud.',
    F6_LBL: 'Seu',
    F6_H: 'Na sua máquina, em texto puro',
    F6_P: 'A biblioteca é um arquivo de texto. As imagens são imagens comuns. Nada é enviado para lugar nenhum, e não há conta a criar.',

    LBL_UPCLOSE: 'De perto',
    UPCLOSE_H2: 'Tudo o que ele vai fazer, antes de fazer.',
    UPCLOSE_LEDE: 'As opções de compatibilidade na mesma ordem que a Steam usa — mais uma linha que os outros omitem: o comando exato que está prestes a rodar.',
    SHOT_GAME: 'A página de um jogo — capa, tempo, Jogar',
    SHOT_SETTINGS: 'Propriedades — runtime, opções de inicialização, o que vai rodar',

    LBL_LANGS: 'Idiomas',
    LANGS_H2: 'Oito, do começo ao fim.',
    LANGS_LEDE: 'Cada texto do aplicativo existe nos oito — não é uma tradução parcial que volta para o inglês no meio da tela.',

    LBL_GET: 'Baixar',
    GET_H2: 'Pegue o que serve ao seu sistema.',
    GET_LEDE: 'Os três saem do mesmo código na mesma execução automática, e os três se mantêm atualizados sozinhos.',

    CHIP_UPDATES: 'Atualiza sozinho',
    APPIMAGE_FOR: 'Qualquer distribuição',
    APPIMAGE_P_html: 'Um arquivo só. Seu navegador o baixa sem permissão de execução, então dê essa permissão primeiro — botão direito, Propriedades, marque <em>permitir execução</em>, ou <code>chmod +x</code> no arquivo. Depois abra. Na primeira execução ele se coloca no seu menu de aplicativos, e por ser um arquivo único pode se substituir: fica de olho em novas versões e oferece a próxima.',
    APPIMAGE_NOTE_html: 'Abriu e não aconteceu nada? Um AppImage precisa do <code>libfuse2</code>, que o Ubuntu não instala por padrão desde a 22.04. Ou instale — <code>sudo apt install libfuse2</code> — ou rode o arquivo uma vez com <code>--appimage-extract-and-run</code>, que não precisa disso. No Debian e no Ubuntu, o .deb abaixo evita a questão por completo.',
    BTN_APPIMAGE: 'Baixar AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Instala como o resto dos seus programas e aparece no menu junto com eles. Ele também se atualiza sozinho, pelo <code>dpkg</code> — ou seja, pede sua senha como qualquer instalação. Adicione o repositório abaixo e quem cuida disso passa a ser o sistema.',
    BTN_DEB: 'Baixar .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Um instalador comum — pergunta onde colocar as coisas e cria os atalhos. Fica de olho em novas versões e se substitui quando você mandar.',
    EXE_WARN: 'O Windows bloqueia na primeira vez — veja como passar',
    BTN_WIN: 'Baixar para Windows',
    BTN_DL_LINUX: 'Baixar para Linux',

    REMOVAL_H: 'Como remover',
    REMOVAL_DATA_html: 'Sua biblioteca, suas configurações e suas artes ficam em <code>~/.config/parallax-launcher</code> no Linux e em <code>%APPDATA%\\parallax-launcher</code> no Windows. Nenhum dos passos abaixo toca nessa pasta, então reinstalar retoma de onde você parou — apague-a você mesmo se quiser tudo fora.',
    REMOVAL_APPIMAGE_P: 'Apague o arquivo. Ele também deixou um item de menu e um ícone, já que se colocou no seu menu:',
    REMOVAL_DEB_P: 'Remova como removeria qualquer outra coisa. Se você adicionou o repositório, tire-o também:',
    REMOVAL_WIN_P: 'Configurações, Aplicativos, Parallax Launcher, Desinstalar. Igual a qualquer outro.',
    COPY: 'Copiar',
    COPIED: 'Copiado',
    COPY_FAIL: 'Selecione',
    COPY_ARIA: 'Copiar estes comandos',

    REPO_NOTE_html: 'No Debian ou no Ubuntu você pode adicionar o repositório de pacotes e deixar as atualizações com o sistema — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">os comandos estão aqui</a>. Rodar a partir do código está <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">no readme</a>.',

    FOOT_BY_html: 'Parallax Launcher — criado por Arda Yalın Özkan.<br>Software livre sob a <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_SOURCE: 'Código',
    FOOT_RELEASES: 'Versões',
    FOOT_ISSUES: 'Relatar um problema',
    FOOT_FINE: 'Os jogos das capturas de tela são a biblioteca pessoal de uma pessoa. Seus nomes e artes pertencem às respectivas publicadoras; nenhuma delas patrocina nem endossa este projeto.',

    DL_STARTING: 'Começando o download…',
    DL_RETRY: 'Não começou? Clique de novo',
    LANG_ARIA: 'Idioma'
},

zh: {
    NAV_DOWNLOAD: '下载',
    NAV_HELP: '帮助',
    NAV_SOURCE: '源代码',

    HERO_H1: '你拥有的每一款游戏，都在同一个架子上。',
    HERO_LEDE: 'Parallax Launcher 会找出硬盘里已经装好的游戏，补齐封面，然后启动它们。它知道的一切都留在你自己的电脑上——不用账号，没有遥测，游戏库本身就是一个用文本编辑器就能打开的文件。',
    HERO_SOURCE: '阅读源代码',
    HERO_NOTE: '基于 GNU GPL v3 的自由软件。无需安装——赋予可执行权限后直接运行。',
    SHOT_LIBRARY: '游戏库——一整面墙的封面',

    LBL_WHAT: '它做什么',
    WHAT_H2: '它读取 Steam 早就知道的东西。',
    WHAT_LEDE: '不用漫无目的地扫描文件夹。Parallax 直接打开 Steam 自己的安装记录，所以它给你看的，就是硬盘上真正存在的。',

    F1_LBL: '查找',
    F1_H: '你装了哪些游戏，一个不差',
    F1_P: '直接读取 Steam 的库文件夹和安装清单——覆盖每一个磁盘，并带上每款游戏的真实名称和 app id。',
    F2_LBL: '启动',
    F2_H: '经由 Steam，或者绕开它',
    F2_P: '把游戏交给 Steam，或者直接运行，这样 Steam 窗口就不会跳到最前面。可以逐个游戏设置，并且会先把确切的命令显示出来。',
    F3_LBL: '封面',
    F3_H: '不用密钥的封面',
    F3_P: '从 Steam 的公开图片里获取官方封面和横幅——免费、无需注册、没有次数限制。填入 SteamGridDB 密钥，社区的作品也会一并打开。',
    F4_LBL: '游戏时长',
    F4_H: '你早就攒下的小时数',
    F4_P: '它统计自己启动的时长，并把你使用本程序之前 Steam 记录的时长合并进来——取较大的那个数字，绝不覆盖。',
    F5_LBL: '兼容性',
    F5_H: 'Proton、Wine，以及其余',
    F5_P_html: '逐个游戏的运行环境、使用 Steam <code>%command%</code> 语法的启动选项、环境变量、GameMode 与 MangoHud。',
    F6_LBL: '属于你',
    F6_H: '在你的机器上，以纯文本保存',
    F6_P: '游戏库是一个文本文件。图片就是普通图片。没有任何东西被上传到别处，也没有账号需要注册。',

    LBL_UPCLOSE: '细看',
    UPCLOSE_H2: '在它动手之前，先告诉你它要做什么。',
    UPCLOSE_LEDE: '兼容性设置按照 Steam 的排布方式呈现——外加别人都不写的那一行：即将执行的确切命令。',
    SHOT_GAME: '单个游戏页面——封面、时长、开始游戏',
    SHOT_SETTINGS: '属性——运行环境、启动选项、究竟会运行什么',

    LBL_LANGS: '语言',
    LANGS_H2: '八种语言，从头到尾。',
    LANGS_LEDE: '应用里的每一句话在八种语言中都有——不是那种翻到半屏就退回英文的半成品翻译。',

    LBL_GET: '下载',
    GET_H2: '挑一个适合你系统的。',
    GET_LEDE: '三者由同一份源代码、同一次自动构建产出，并且三者都会自行保持更新。',

    CHIP_UPDATES: '自动更新',
    APPIMAGE_FOR: '任意发行版',
    APPIMAGE_P_html: '只有一个文件。浏览器下载时不会给它执行权限，所以先由你来给——右键、属性、勾选<em>允许执行</em>，或者对文件执行 <code>chmod +x</code>。然后打开即可。首次运行时它会把自己加进应用菜单；因为只是单个文件，它可以替换自己：留意新版本并主动询问是否下载。',
    APPIMAGE_NOTE_html: '打开之后什么都没发生？AppImage 需要 <code>libfuse2</code>，而 Ubuntu 自 22.04 起默认不再安装它。要么装上——<code>sudo apt install libfuse2</code>——要么用 <code>--appimage-extract-and-run</code> 运行一次，这种方式不需要它。在 Debian 和 Ubuntu 上，下面的 .deb 可以彻底避开这个问题。',
    BTN_APPIMAGE: '下载 AppImage',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: '像你其他软件一样安装，也和它们一起出现在菜单里。它同样会自行更新，通过 <code>dpkg</code>——也就是说，会像任何安装那样询问你的密码。添加下面的软件源，这件事就交给系统了。',
    BTN_DEB: '下载 .deb',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: '一个普通的安装程序——询问装在哪里，并创建快捷方式。它留意新版本，并在你同意时替换自己。',
    EXE_WARN: 'Windows 第一次会拦下它——这里是绕过的方法',
    BTN_WIN: '下载 Windows 版',
    BTN_DL_LINUX: '下载 Linux 版',

    REMOVAL_H: '如何卸载',
    REMOVAL_DATA_html: '你的游戏库、设置和封面在 Linux 上位于 <code>~/.config/parallax-launcher</code>，在 Windows 上位于 <code>%APPDATA%\\parallax-launcher</code>。下面的步骤都不会碰这个文件夹，所以重新安装后一切照旧——想彻底清空的话，请自己删掉它。',
    REMOVAL_APPIMAGE_P: '删掉文件即可。由于它把自己加进了菜单，还会留下一个菜单项和一个图标：',
    REMOVAL_DEB_P: '像卸载其他软件一样卸载它。如果你添加过软件源，也一并去掉：',
    REMOVAL_WIN_P: '设置、应用、Parallax Launcher、卸载。和其他程序没有区别。',
    COPY: '复制',
    COPIED: '已复制',
    COPY_FAIL: '请手动选择',
    COPY_ARIA: '复制这些命令',

    REPO_NOTE_html: '在 Debian 或 Ubuntu 上，你也可以改为添加软件源，把更新交给系统处理——<a href="https://github.com/ArdaYalinOzkan/parallax-apt">命令在这里</a>。从源代码运行的说明在 <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">readme</a> 里。',

    FOOT_BY_html: 'Parallax Launcher — 由 Arda Yalın Özkan 制作。<br>基于 <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a> 的自由软件。',
    FOOT_SOURCE: '源代码',
    FOOT_RELEASES: '版本',
    FOOT_ISSUES: '报告问题',
    FOOT_FINE: '截图中出现的游戏来自某一个人的私人游戏库。它们的名称与美术资源归各自的发行商所有；其中没有任何一方是赞助商，也不代表其认可本项目。',

    DL_STARTING: '开始下载…',
    DL_RETRY: '没有开始？再点一次',
    LANG_ARIA: '语言'
},

ko: {
    NAV_DOWNLOAD: '다운로드',
    NAV_HELP: '도움말',
    NAV_SOURCE: '소스',

    HERO_H1: '가지고 있는 모든 게임을 한 선반에.',
    HERO_LEDE: 'Parallax Launcher는 이미 디스크에 있는 게임을 찾아내고, 아트워크를 채우고, 실행합니다. 이 프로그램이 아는 모든 것은 당신의 컴퓨터에 남습니다 — 계정도, 텔레메트리도 없고, 라이브러리는 텍스트 편집기로 열어볼 수 있습니다.',
    HERO_SOURCE: '소스 보기',
    HERO_NOTE: 'GNU GPL v3 자유 소프트웨어. 설치 없음 — 실행 권한만 주고 실행하세요.',
    SHOT_LIBRARY: '라이브러리 — 표지로 가득한 벽',

    LBL_WHAT: '하는 일',
    WHAT_H2: 'Steam이 이미 아는 것을 읽습니다.',
    WHAT_LEDE: '폴더를 뒤지며 요행을 바라지 않습니다. Parallax는 Steam 자신의 설치 기록을 열기 때문에, 보여주는 것이 곧 디스크에 실제로 있는 것입니다.',

    F1_LBL: '찾기',
    F1_H: '설치된 게임을, 정확히',
    F1_P: 'Steam의 라이브러리 폴더와 설치 매니페스트를 직접 읽습니다 — 모든 드라이브에 걸쳐, 각각의 실제 이름과 app id까지.',
    F2_LBL: '실행',
    F2_H: 'Steam을 거치거나, 그냥 지나치거나',
    F2_P: '게임을 Steam에 넘기거나 직접 실행해 Steam 창이 앞으로 튀어나오지 않게 할 수 있습니다. 게임마다 설정할 수 있고, 실행될 명령을 먼저 보여줍니다.',
    F3_LBL: '아트워크',
    F3_H: '키 없이 받는 표지',
    F3_P: 'Steam의 공개 이미지에서 공식 표지와 배너를 가져옵니다 — 무료, 가입 불필요, 횟수 제한 없음. SteamGridDB 키를 넣으면 커뮤니티의 작업물도 열립니다.',
    F4_LBL: '플레이 시간',
    F4_H: '이미 쌓아둔 시간',
    F4_P: '직접 시작한 세션을 세고, 이 프로그램을 열기 전에 Steam이 기록해 둔 시간을 합칩니다 — 더 큰 쪽을 택하며, 절대 덮어쓰지 않습니다.',
    F5_LBL: '호환성',
    F5_H: 'Proton, Wine, 그리고 나머지',
    F5_P_html: '게임별 런타임, Steam의 <code>%command%</code> 문법을 쓰는 실행 옵션, 환경 변수, GameMode와 MangoHud.',
    F6_LBL: '당신의 것',
    F6_H: '당신의 기기에, 평문으로',
    F6_P: '라이브러리는 텍스트 파일입니다. 이미지는 평범한 이미지입니다. 어디에도 업로드되지 않고, 만들 계정도 없습니다.',

    LBL_UPCLOSE: '가까이서',
    UPCLOSE_H2: '무엇을 할지, 하기 전에 전부.',
    UPCLOSE_LEDE: 'Steam이 배치한 방식 그대로의 호환성 설정 — 그리고 다른 곳에서는 빠뜨리는 한 줄: 곧 실행될 정확한 명령.',
    SHOT_GAME: '게임 한 편의 페이지 — 표지, 플레이 시간, 실행',
    SHOT_SETTINGS: '속성 — 런타임, 실행 옵션, 무엇이 실행될지',

    LBL_LANGS: '언어',
    LANGS_H2: '여덟 개, 끝까지.',
    LANGS_LEDE: '앱의 모든 문구가 여덟 언어 모두에 있습니다 — 화면 중간에서 영어로 돌아가 버리는 반쪽짜리 번역이 아닙니다.',

    LBL_GET: '다운로드',
    GET_H2: '당신의 시스템에 맞는 것을 고르세요.',
    GET_LEDE: '셋 다 같은 소스에서 같은 자동 빌드로 만들어지고, 셋 다 스스로 최신 상태를 유지합니다.',

    CHIP_UPDATES: '스스로 업데이트',
    APPIMAGE_FOR: '모든 배포판',
    APPIMAGE_P_html: '파일 하나. 브라우저는 실행 권한 없이 내려받으므로 그 권한을 먼저 주세요 — 마우스 오른쪽, 속성, <em>실행 허용</em> 체크, 또는 파일에 <code>chmod +x</code>. 그다음 열면 됩니다. 처음 실행할 때 스스로 응용 프로그램 메뉴에 등록되고, 파일 하나이기 때문에 자기 자신을 교체할 수 있습니다: 새 릴리스를 지켜보다가 받아올지 물어봅니다.',
    APPIMAGE_NOTE_html: '열었는데 아무 일도 없나요? AppImage에는 <code>libfuse2</code>가 필요한데, Ubuntu는 22.04부터 기본으로 설치하지 않습니다. 설치하거나 — <code>sudo apt install libfuse2</code> — 파일을 한 번 <code>--appimage-extract-and-run</code>으로 실행하세요. 후자는 아무것도 요구하지 않습니다. Debian과 Ubuntu라면 아래 .deb가 이 문제를 통째로 없애줍니다.',
    BTN_APPIMAGE: 'AppImage 받기',

    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: '다른 소프트웨어와 같은 방식으로 설치되고, 메뉴에도 함께 나타납니다. 이것도 <code>dpkg</code>를 통해 스스로 업데이트합니다 — 즉, 여느 설치처럼 비밀번호를 묻습니다. 아래 저장소를 추가하면 그 일을 시스템이 대신합니다.',
    BTN_DEB: '.deb 받기',

    EXE_FOR: 'Windows 10 · 11',
    EXE_P: '평범한 설치 프로그램입니다 — 어디에 둘지 묻고 바로 가기를 만듭니다. 새 버전을 지켜보다가 허락하면 스스로 교체합니다.',
    EXE_WARN: 'Windows가 처음에 차단합니다 — 넘어가는 방법은 여기',
    BTN_WIN: 'Windows용 받기',
    BTN_DL_LINUX: 'Linux용 받기',

    REMOVAL_H: '삭제하기',
    REMOVAL_DATA_html: '라이브러리와 설정, 아트워크는 Linux에서는 <code>~/.config/parallax-launcher</code>, Windows에서는 <code>%APPDATA%\\parallax-launcher</code>에 있습니다. 아래 어떤 단계도 이 폴더를 건드리지 않으므로 다시 설치하면 하던 곳에서 이어집니다 — 전부 지우고 싶다면 직접 삭제하세요.',
    REMOVAL_APPIMAGE_P: '파일을 지우세요. 스스로 메뉴에 등록했기 때문에 메뉴 항목과 아이콘도 남겨두었습니다:',
    REMOVAL_DEB_P: '다른 것을 지우듯 지우면 됩니다. 저장소를 추가했다면 그것도 함께 빼세요:',
    REMOVAL_WIN_P: '설정, 앱, Parallax Launcher, 제거. 다른 프로그램과 똑같습니다.',
    COPY: '복사',
    COPIED: '복사됨',
    COPY_FAIL: '직접 선택',
    COPY_ARIA: '이 명령들 복사',

    REPO_NOTE_html: 'Debian이나 Ubuntu에서는 대신 패키지 저장소를 추가해 업데이트를 시스템에 맡길 수 있습니다 — <a href="https://github.com/ArdaYalinOzkan/parallax-apt">명령은 여기</a>. 소스에서 실행하는 방법은 <a href="https://github.com/ArdaYalinOzkan/parallax-launcher#running-it">readme</a>에 있습니다.',

    FOOT_BY_html: 'Parallax Launcher — Arda Yalın Özkan 제작.<br><a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a> 자유 소프트웨어.',
    FOOT_SOURCE: '소스',
    FOOT_RELEASES: '릴리스',
    FOOT_ISSUES: '문제 신고',
    FOOT_FINE: '스크린샷에 보이는 게임들은 한 사람의 개인 라이브러리입니다. 이름과 아트워크는 각 배급사의 것이며, 어느 쪽도 이 프로젝트의 후원자가 아니고 이를 보증하지도 않습니다.',

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
