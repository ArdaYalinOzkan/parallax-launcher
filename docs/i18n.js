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
    APPIMAGE_FOR: 'Any Linux distribution',
    APPIMAGE_P_html: 'A single file that requires no installation. Downloaded files are not executable by default, so allow execution first: right-click, Properties, and enable the option to run the file as a program.',
    BTN_APPIMAGE: 'Download AppImage',
    BTN_DEB: 'Download .deb',
    BTN_DL_LINUX: 'Download for Linux',
    BTN_WIN: 'Download for Windows',
    CHIP_UPDATES: 'Updates itself',
    COPIED: 'Copied',
    COPY: 'Copy',
    COPY_ARIA: 'Copy these commands',
    COPY_FAIL: 'Select it',
    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Installs in the same way as your other software and appears in the application menu. Updates are installed through <code>dpkg</code>, which asks for your password.',
    DL_RETRY: 'Not started? Click again',
    DL_STARTING: 'Starting the download…',
    DOWNLOADS: 'downloads',
    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'A standard installer that asks where to install the program and creates the shortcuts. It checks for new versions and installs them when you confirm.',
    EXE_WARN: 'Windows blocks it the first time — here is how to get past it',
    F1_H: 'Installed games',
    F1_LBL: 'Detection',
    F1_P: 'Steam library folders and installation manifests are read directly, across every drive, including the correct title and application id for each game.',
    F2_H: 'Starting a game',
    F2_LBL: 'Launching',
    F2_P: 'A game can be started through Steam or run directly, so that the Steam window does not open. The method is set per game, and the exact command to be run is shown before it runs.',
    F3_H: 'Cover images',
    F3_LBL: 'Artwork',
    F3_P: 'Cover images and banners for Steam games are downloaded from Steam and require no account or API key. Adding a SteamGridDB key extends this to games sold elsewhere.',
    F4_H: 'Recorded hours',
    F4_LBL: 'Play time',
    F4_P: 'Parallax records the sessions it starts and merges them with the play time Steam recorded previously. The higher value is used, so existing records are never reduced.',
    F5_H: 'Proton and Wine',
    F5_LBL: 'Compatibility',
    F5_P_html: 'Runtime selection per game, launch options using Steam\'s <code>%command%</code> syntax, environment variables, GameMode and MangoHud.',
    F6_H: 'Local storage',
    F6_LBL: 'Data',
    F6_P: 'The library is a plain text file and the images are ordinary image files. Nothing is uploaded and no account is required.',
    FOOT_BY_html: 'Parallax Launcher — created by Arda Yalın Özkan.<br> Free software under the <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_FINE: 'The games shown in the screenshots are from one user\'s library. Their titles and artwork belong to their publishers and are not part of this project.',
    FOOT_ISSUES: 'Report a problem',
    FOOT_RELEASES: 'Releases',
    FOOT_SOURCE: 'Source',
    GET_H2: 'Download',
    GET_LEDE: 'All three packages are built from the same source by the same automated process, and each updates itself.',
    HERO_H1: 'Parallax Launcher',
    HERO_LEDE: 'A desktop application that collects the games installed on your computer into a single library, adds their cover art and starts them. It reads Steam\'s own installation records, and all of its data is stored on your machine.',
    HERO_NOTE: 'Free software under the GNU GPL v3.',
    HERO_SOURCE: 'Read the source',
    LANGS_H2: 'Available in eight languages',
    LANGS_LEDE: 'The interface is fully translated into English, Turkish, German, Russian, Ukrainian, Portuguese, Simplified Chinese and Korean.',
    LANG_ARIA: 'Language',
    LBL_GET: 'Download',
    LBL_LANGS: 'Languages',
    LBL_UPCLOSE: 'Compatibility',
    LBL_WHAT: 'Features',
    NAV_DOWNLOAD: 'Download',
    NAV_HELP: 'Help',
    NAV_SOURCE: 'Source',
    REMOVAL_APPIMAGE_P: 'Delete the file. The menu entry and icon it created remain and can be removed with:',
    REMOVAL_DATA_html: 'Your library, settings and artwork are stored in <code>~/.config/parallax-launcher</code> on Linux and <code>%APPDATA%\\parallax-launcher</code> on Windows. None of the steps below affect that folder, so reinstalling continues from the same state. Delete it manually if you want everything removed.',
    REMOVAL_DEB_P: 'Remove it as you would any other package. If you added the repository, remove that as well:',
    REMOVAL_H: 'Removing Parallax',
    REMOVAL_WIN_P: 'Open Settings, then Apps, select Parallax Launcher and choose Uninstall.',
    REPO_NOTE_html: 'On Debian and Ubuntu you can add the package repository instead and let your system manage updates. The commands are listed in the guides.',
    SHOT_GAME: 'A game\'s page — cover, playtime, Play',
    SHOT_LIBRARY: 'The library — a wall of cover art',
    SHOT_SETTINGS: 'Properties — runtime, launch options, what will run',
    UPCLOSE_H2: 'Compatibility settings',
    UPCLOSE_LEDE: 'Each game has its own runtime settings. The command that will be used to start the game is shown as the settings are changed.',
    WHAT_H2: 'How Parallax finds your games',
    WHAT_LEDE: 'Parallax reads the installation records Steam keeps on disk rather than searching folders, so the library reflects what is actually installed.'
},

tr: {
    APPIMAGE_FOR: 'Tüm Linux dağıtımları',
    APPIMAGE_P_html: 'Kurulum gerektirmeyen tek bir dosya. İndirilen dosyalar varsayılan olarak çalıştırılabilir değildir, bu nedenle önce izin verin: sağ tıklayın, Özellikler\'i açın ve dosyanın program olarak çalıştırılmasına izin veren seçeneği etkinleştirin.',
    BTN_APPIMAGE: 'AppImage indir',
    BTN_DEB: '.deb indir',
    BTN_DL_LINUX: 'Linux için indir',
    BTN_WIN: 'Windows için indir',
    CHIP_UPDATES: 'Kendini günceller',
    COPIED: 'Kopyalandı',
    COPY: 'Kopyala',
    COPY_ARIA: 'Bu komutları kopyala',
    COPY_FAIL: 'Elle seç',
    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Diğer yazılımlarınızla aynı şekilde kurulur ve uygulama menüsünde görünür. Güncellemeler, parolanızı isteyen <code>dpkg</code> üzerinden kurulur.',
    DL_RETRY: 'Başlamadı mı? Tekrar tıkla',
    DL_STARTING: 'İndirme başlıyor…',
    DOWNLOADS: 'indirme',
    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Programın nereye kurulacağını soran ve kısayolları oluşturan standart bir kurulum dosyası. Yeni sürümleri denetler ve onayladığınızda kurar.',
    EXE_WARN: 'Windows ilk seferde engelliyor — nasıl geçileceği burada',
    F1_H: 'Kurulu oyunlar',
    F1_LBL: 'Algılama',
    F1_P: 'Steam kütüphane klasörleri ve kurulum kayıtları, her sürücüde doğrudan okunur; her oyunun doğru adı ve uygulama kimliği de buradan alınır.',
    F2_H: 'Oyun başlatma',
    F2_LBL: 'Başlatma',
    F2_P: 'Bir oyun Steam üzerinden başlatılabilir ya da doğrudan çalıştırılarak Steam penceresinin açılması önlenebilir. Yöntem oyun başına belirlenir ve çalıştırılacak komut, çalıştırılmadan önce gösterilir.',
    F3_H: 'Kapak görselleri',
    F3_LBL: 'Kapaklar',
    F3_P: 'Steam oyunlarının kapak görselleri ve afişleri Steam\'den indirilir; hesap veya API anahtarı gerektirmez. SteamGridDB anahtarı eklendiğinde bu, başka mağazalarda satılan oyunları da kapsar.',
    F4_H: 'Kayıtlı saatler',
    F4_LBL: 'Oynama süresi',
    F4_P: 'Parallax başlattığı oturumları kaydeder ve bunları Steam\'in daha önce kaydettiği süreyle birleştirir. Büyük olan değer kullanılır, böylece mevcut kayıtlar hiçbir zaman azalmaz.',
    F5_H: 'Proton ve Wine',
    F5_LBL: 'Uyumluluk',
    F5_P_html: 'Oyun başına çalışma ortamı seçimi, Steam\'in <code>%command%</code> sözdizimiyle başlatma seçenekleri, ortam değişkenleri, GameMode ve MangoHud.',
    F6_H: 'Yerel depolama',
    F6_LBL: 'Veri',
    F6_P: 'Kütüphane düz bir metin dosyası, görseller ise sıradan görsel dosyalarıdır. Hiçbir şey yüklenmez ve hesap gerekmez.',
    FOOT_BY_html: 'Parallax Launcher — Arda Yalın Özkan yaptı.<br><a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a> ile özgür yazılım.',
    FOOT_FINE: 'Ekran görüntülerinde görünen oyunlar bir kullanıcının kütüphanesinden alınmıştır. Adları ve görselleri yayıncılarına aittir ve bu projenin parçası değildir.',
    FOOT_ISSUES: 'Sorun bildir',
    FOOT_RELEASES: 'Sürümler',
    FOOT_SOURCE: 'Kaynak kodu',
    GET_H2: 'İndirme',
    GET_LEDE: 'Üç paket de aynı kaynaktan, aynı otomatik süreçle derlenir ve her biri kendini günceller.',
    HERO_H1: 'Parallax Launcher',
    HERO_LEDE: 'Bilgisayarınızda kurulu oyunları tek bir kütüphanede toplayan, kapak görsellerini ekleyen ve oyunları başlatan bir masaüstü uygulaması. Steam\'in kendi kurulum kayıtlarını okur ve tüm verisini makinenizde saklar.',
    HERO_NOTE: 'GNU GPL v3 altında özgür yazılım.',
    HERO_SOURCE: 'Kaynak koduna bak',
    LANGS_H2: 'Sekiz dilde kullanılabilir',
    LANGS_LEDE: 'Arayüz İngilizce, Türkçe, Almanca, Rusça, Ukraynaca, Portekizce, Basitleştirilmiş Çince ve Korece dillerine tam olarak çevrilmiştir.',
    LANG_ARIA: 'Dil',
    LBL_GET: 'İndir',
    LBL_LANGS: 'Diller',
    LBL_UPCLOSE: 'Uyumluluk',
    LBL_WHAT: 'Özellikler',
    NAV_DOWNLOAD: 'İndir',
    NAV_HELP: 'Yardım',
    NAV_SOURCE: 'Kaynak kodu',
    REMOVAL_APPIMAGE_P: 'Dosyayı silin. Oluşturduğu menü kaydı ve simge yerinde kalır; şu komutlarla kaldırılabilir:',
    REMOVAL_DATA_html: 'Kütüphaneniz, ayarlarınız ve görselleriniz Linux\'ta <code>~/.config/parallax-launcher</code>, Windows\'ta <code>%APPDATA%\\parallax-launcher</code> konumunda saklanır. Aşağıdaki adımların hiçbiri bu klasörü etkilemez, bu nedenle yeniden kurulum aynı durumdan devam eder. Her şeyin kaldırılmasını istiyorsanız klasörü elle silin.',
    REMOVAL_DEB_P: 'Diğer paketler gibi kaldırın. Depoyu eklediyseniz onu da kaldırın:',
    REMOVAL_H: 'Parallax\'ı kaldırma',
    REMOVAL_WIN_P: 'Ayarlar\'ı, ardından Uygulamalar\'ı açın, Parallax Launcher\'ı seçin ve Kaldır\'a tıklayın.',
    REPO_NOTE_html: 'Debian ve Ubuntu\'da bunun yerine paket deposunu ekleyip güncellemeleri sisteminize bırakabilirsiniz. Komutlar rehberlerde listelenmiştir.',
    SHOT_GAME: 'Bir oyunun sayfası — kapak, süre, Oynat',
    SHOT_LIBRARY: 'Kütüphane — baştan başa kapak resmi',
    SHOT_SETTINGS: 'Özellikler — çalışma ortamı, başlatma seçenekleri, ne çalışacağı',
    UPCLOSE_H2: 'Uyumluluk ayarları',
    UPCLOSE_LEDE: 'Her oyunun kendi çalışma ortamı ayarları vardır. Ayarlar değiştikçe, oyunu başlatmak için kullanılacak komut gösterilir.',
    WHAT_H2: 'Parallax oyunlarınızı nasıl buluyor',
    WHAT_LEDE: 'Parallax klasörleri taramak yerine Steam\'in diskte tuttuğu kurulum kayıtlarını okur; böylece kütüphane gerçekte kurulu olanı yansıtır.'
},

de: {
    APPIMAGE_FOR: 'Jede Linux-Distribution',
    APPIMAGE_P_html: 'Eine einzelne Datei, die keine Installation erfordert. Heruntergeladene Dateien sind standardmäßig nicht ausführbar; erlauben Sie die Ausführung zuerst: Rechtsklick, Eigenschaften, und die Option aktivieren, die Datei als Programm auszuführen.',
    BTN_APPIMAGE: 'AppImage laden',
    BTN_DEB: '.deb laden',
    BTN_DL_LINUX: 'Für Linux laden',
    BTN_WIN: 'Für Windows laden',
    CHIP_UPDATES: 'Aktualisiert sich selbst',
    COPIED: 'Kopiert',
    COPY: 'Kopieren',
    COPY_ARIA: 'Diese Befehle kopieren',
    COPY_FAIL: 'Selbst markieren',
    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Wird wie Ihre übrige Software installiert und erscheint im Anwendungsmenü. Updates werden über <code>dpkg</code> installiert, das nach Ihrem Passwort fragt.',
    DL_RETRY: 'Nicht gestartet? Noch einmal klicken',
    DL_STARTING: 'Download beginnt…',
    DOWNLOADS: 'Downloads',
    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Ein gewöhnliches Installationsprogramm, das nach dem Installationsort fragt und die Verknüpfungen anlegt. Es prüft auf neue Versionen und installiert sie nach Ihrer Bestätigung.',
    EXE_WARN: 'Windows blockiert beim ersten Mal — hier steht, wie du weiterkommst',
    F1_H: 'Installierte Spiele',
    F1_LBL: 'Erkennung',
    F1_P: 'Die Bibliotheksordner und Installationsdateien von Steam werden direkt gelesen, auf jedem Laufwerk, einschließlich des korrekten Titels und der Anwendungs-ID jedes Spiels.',
    F2_H: 'Ein Spiel starten',
    F2_LBL: 'Starten',
    F2_P: 'Ein Spiel kann über Steam gestartet oder direkt ausgeführt werden, sodass sich das Steam-Fenster nicht öffnet. Die Methode wird je Spiel festgelegt, und der auszuführende Befehl wird vor dem Start angezeigt.',
    F3_H: 'Titelbilder',
    F3_LBL: 'Titelbilder',
    F3_P: 'Titelbilder und Banner für Steam-Spiele werden von Steam heruntergeladen und benötigen weder Konto noch API-Schlüssel. Mit einem SteamGridDB-Schlüssel gilt das auch für anderswo verkaufte Spiele.',
    F4_H: 'Erfasste Stunden',
    F4_LBL: 'Spielzeit',
    F4_P: 'Parallax erfasst die von ihm gestarteten Sitzungen und führt sie mit der von Steam zuvor erfassten Spielzeit zusammen. Verwendet wird der höhere Wert, sodass bestehende Aufzeichnungen nie verringert werden.',
    F5_H: 'Proton und Wine',
    F5_LBL: 'Kompatibilität',
    F5_P_html: 'Laufzeitauswahl je Spiel, Startoptionen mit der <code>%command%</code>-Syntax von Steam, Umgebungsvariablen, GameMode und MangoHud.',
    F6_H: 'Lokale Speicherung',
    F6_LBL: 'Daten',
    F6_P: 'Die Bibliothek ist eine einfache Textdatei, und die Bilder sind gewöhnliche Bilddateien. Es wird nichts hochgeladen und kein Konto benötigt.',
    FOOT_BY_html: 'Parallax Launcher — entwickelt von Arda Yalın Özkan.<br>Freie Software unter der <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_FINE: 'Die in den Bildschirmfotos gezeigten Spiele stammen aus der Bibliothek eines Nutzers. Ihre Titel und Bilder gehören den jeweiligen Herausgebern und sind nicht Teil dieses Projekts.',
    FOOT_ISSUES: 'Problem melden',
    FOOT_RELEASES: 'Versionen',
    FOOT_SOURCE: 'Quellcode',
    GET_H2: 'Download',
    GET_LEDE: 'Alle drei Pakete werden aus derselben Quelle im selben automatisierten Vorgang gebaut, und jedes aktualisiert sich selbst.',
    HERO_H1: 'Parallax Launcher',
    HERO_LEDE: 'Eine Desktop-Anwendung, die die auf Ihrem Rechner installierten Spiele in einer Bibliothek zusammenführt, ihre Titelbilder ergänzt und sie startet. Sie liest die Installationsaufzeichnungen von Steam, und alle Daten bleiben auf Ihrem Rechner.',
    HERO_NOTE: 'Freie Software unter der GNU GPL v3.',
    HERO_SOURCE: 'Quellcode ansehen',
    LANGS_H2: 'In acht Sprachen verfügbar',
    LANGS_LEDE: 'Die Oberfläche ist vollständig übersetzt in Englisch, Türkisch, Deutsch, Russisch, Ukrainisch, Portugiesisch, vereinfachtes Chinesisch und Koreanisch.',
    LANG_ARIA: 'Sprache',
    LBL_GET: 'Download',
    LBL_LANGS: 'Sprachen',
    LBL_UPCLOSE: 'Kompatibilität',
    LBL_WHAT: 'Funktionen',
    NAV_DOWNLOAD: 'Herunterladen',
    NAV_HELP: 'Hilfe',
    NAV_SOURCE: 'Quellcode',
    REMOVAL_APPIMAGE_P: 'Löschen Sie die Datei. Der angelegte Menüeintrag und das Symbol bleiben bestehen und lassen sich so entfernen:',
    REMOVAL_DATA_html: 'Ihre Bibliothek, Einstellungen und Bilder liegen unter Linux in <code>~/.config/parallax-launcher</code> und unter Windows in <code>%APPDATA%\\parallax-launcher</code>. Keiner der folgenden Schritte betrifft diesen Ordner, sodass eine Neuinstallation im selben Zustand fortsetzt. Löschen Sie ihn von Hand, wenn alles entfernt werden soll.',
    REMOVAL_DEB_P: 'Entfernen Sie es wie jedes andere Paket. Wenn Sie das Repository hinzugefügt haben, entfernen Sie auch dieses:',
    REMOVAL_H: 'Parallax entfernen',
    REMOVAL_WIN_P: 'Öffnen Sie die Einstellungen, dann Apps, wählen Sie Parallax Launcher und anschließend Deinstallieren.',
    REPO_NOTE_html: 'Unter Debian und Ubuntu können Sie stattdessen das Paket-Repository einbinden und die Updates Ihrem System überlassen. Die Befehle stehen in den Anleitungen.',
    SHOT_GAME: 'Die Seite eines Spiels — Titelbild, Spielzeit, Start',
    SHOT_LIBRARY: 'Die Bibliothek — eine Wand aus Titelbildern',
    SHOT_SETTINGS: 'Eigenschaften — Laufzeitumgebung, Startoptionen, was ausgeführt wird',
    UPCLOSE_H2: 'Kompatibilitätseinstellungen',
    UPCLOSE_LEDE: 'Jedes Spiel hat eigene Laufzeiteinstellungen. Während diese geändert werden, wird der Befehl angezeigt, mit dem das Spiel gestartet wird.',
    WHAT_H2: 'Wie Parallax Ihre Spiele findet',
    WHAT_LEDE: 'Parallax liest die Installationsaufzeichnungen, die Steam auf der Festplatte führt, statt Ordner zu durchsuchen. Die Bibliothek gibt damit wieder, was tatsächlich installiert ist.'
},

ru: {
    APPIMAGE_FOR: 'Любой дистрибутив Linux',
    APPIMAGE_P_html: 'Один файл, не требующий установки. Скачанные файлы по умолчанию не являются исполняемыми, поэтому сначала разрешите выполнение: щёлкните правой кнопкой, откройте «Свойства» и включите параметр, разрешающий запускать файл как программу.',
    BTN_APPIMAGE: 'Скачать AppImage',
    BTN_DEB: 'Скачать .deb',
    BTN_DL_LINUX: 'Скачать для Linux',
    BTN_WIN: 'Скачать для Windows',
    CHIP_UPDATES: 'Обновляется сам',
    COPIED: 'Скопировано',
    COPY: 'Копировать',
    COPY_ARIA: 'Скопировать эти команды',
    COPY_FAIL: 'Выделите сами',
    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Устанавливается так же, как остальное ваше программное обеспечение, и появляется в меню приложений. Обновления устанавливаются через <code>dpkg</code>, который запрашивает пароль.',
    DL_RETRY: 'Не началась? Нажмите ещё раз',
    DL_STARTING: 'Загрузка начинается…',
    DOWNLOADS: 'загрузок',
    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Обычный установщик, который спрашивает, куда установить программу, и создаёт ярлыки. Он проверяет наличие новых версий и устанавливает их после вашего подтверждения.',
    EXE_WARN: 'В первый раз Windows не пускает — вот как пройти',
    F1_H: 'Установленные игры',
    F1_LBL: 'Обнаружение',
    F1_P: 'Папки библиотек Steam и файлы установки читаются напрямую на всех дисках, включая правильное название и идентификатор приложения для каждой игры.',
    F2_H: 'Запуск игры',
    F2_LBL: 'Запуск',
    F2_P: 'Игру можно запустить через Steam или выполнить напрямую, чтобы окно Steam не открывалось. Способ задаётся для каждой игры, а команда, которая будет выполнена, показывается до запуска.',
    F3_H: 'Обложки',
    F3_LBL: 'Обложки',
    F3_P: 'Обложки и баннеры для игр Steam загружаются из Steam и не требуют ни учётной записи, ни ключа API. Добавление ключа SteamGridDB распространяет это и на игры, продаваемые в других местах.',
    F4_H: 'Записанные часы',
    F4_LBL: 'Время игры',
    F4_P: 'Parallax записывает запущенные им сессии и объединяет их со временем, ранее записанным Steam. Используется большее значение, поэтому существующие записи никогда не уменьшаются.',
    F5_H: 'Proton и Wine',
    F5_LBL: 'Совместимость',
    F5_P_html: 'Выбор среды выполнения для каждой игры, параметры запуска с синтаксисом Steam <code>%command%</code>, переменные окружения, GameMode и MangoHud.',
    F6_H: 'Локальное хранение',
    F6_LBL: 'Данные',
    F6_P: 'Библиотека — обычный текстовый файл, а изображения — обычные файлы изображений. Ничего не выгружается, и учётная запись не требуется.',
    FOOT_BY_html: 'Parallax Launcher — автор Arda Yalın Özkan.<br>Свободная программа под лицензией <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_FINE: 'Игры на снимках экрана взяты из библиотеки одного пользователя. Их названия и изображения принадлежат их издателям и не являются частью этого проекта.',
    FOOT_ISSUES: 'Сообщить о проблеме',
    FOOT_RELEASES: 'Выпуски',
    FOOT_SOURCE: 'Исходный код',
    GET_H2: 'Загрузка',
    GET_LEDE: 'Все три пакета собираются из одного исходного кода одним и тем же автоматизированным процессом, и каждый из них обновляется сам.',
    HERO_H1: 'Parallax Launcher',
    HERO_LEDE: 'Настольное приложение, которое собирает установленные на компьютере игры в одну библиотеку, добавляет обложки и запускает их. Оно читает собственные записи Steam об установке, и все его данные хранятся на вашей машине.',
    HERO_NOTE: 'Свободная программа по лицензии GNU GPL v3.',
    HERO_SOURCE: 'Посмотреть исходный код',
    LANGS_H2: 'Доступно на восьми языках',
    LANGS_LEDE: 'Интерфейс полностью переведён на английский, турецкий, немецкий, русский, украинский, португальский, упрощённый китайский и корейский.',
    LANG_ARIA: 'Язык',
    LBL_GET: 'Скачать',
    LBL_LANGS: 'Языки',
    LBL_UPCLOSE: 'Совместимость',
    LBL_WHAT: 'Возможности',
    NAV_DOWNLOAD: 'Скачать',
    NAV_HELP: 'Помощь',
    NAV_SOURCE: 'Исходный код',
    REMOVAL_APPIMAGE_P: 'Удалите файл. Созданные им запись в меню и значок остаются и удаляются так:',
    REMOVAL_DATA_html: 'Библиотека, настройки и изображения хранятся в <code>~/.config/parallax-launcher</code> в Linux и в <code>%APPDATA%\\parallax-launcher</code> в Windows. Ни один из приведённых ниже шагов не затрагивает эту папку, поэтому повторная установка продолжает работу с того же состояния. Удалите её вручную, если хотите убрать всё.',
    REMOVAL_DEB_P: 'Удалите его как любой другой пакет. Если вы добавляли репозиторий, удалите и его:',
    REMOVAL_H: 'Удаление Parallax',
    REMOVAL_WIN_P: 'Откройте «Параметры», затем «Приложения», выберите Parallax Launcher и нажмите «Удалить».',
    REPO_NOTE_html: 'В Debian и Ubuntu можно вместо этого добавить репозиторий и поручить обновления системе. Команды приведены в руководствах.',
    SHOT_GAME: 'Страница игры — обложка, время, «Играть»',
    SHOT_LIBRARY: 'Библиотека — стена из обложек',
    SHOT_SETTINGS: 'Свойства — среда выполнения, параметры запуска, что именно запустится',
    UPCLOSE_H2: 'Настройки совместимости',
    UPCLOSE_LEDE: 'У каждой игры свои настройки среды выполнения. По мере их изменения показывается команда, которая будет использована для запуска игры.',
    WHAT_H2: 'Как Parallax находит ваши игры',
    WHAT_LEDE: 'Parallax читает записи об установке, которые Steam хранит на диске, вместо того чтобы просматривать папки, поэтому библиотека отражает то, что действительно установлено.'
},

uk: {
    APPIMAGE_FOR: 'Будь-який дистрибутив Linux',
    APPIMAGE_P_html: 'Один файл, який не потребує встановлення. Завантажені файли типово не є виконуваними, тож спершу дозвольте виконання: клацніть правою кнопкою, відкрийте «Властивості» й увімкніть параметр, що дозволяє запускати файл як програму.',
    BTN_APPIMAGE: 'Завантажити AppImage',
    BTN_DEB: 'Завантажити .deb',
    BTN_DL_LINUX: 'Завантажити для Linux',
    BTN_WIN: 'Завантажити для Windows',
    CHIP_UPDATES: 'Оновлюється сам',
    COPIED: 'Скопійовано',
    COPY: 'Копіювати',
    COPY_ARIA: 'Скопіювати ці команди',
    COPY_FAIL: 'Виділіть самі',
    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Встановлюється так само, як решта вашого програмного забезпечення, і з\'являється в меню програм. Оновлення встановлюються через <code>dpkg</code>, який запитує пароль.',
    DL_RETRY: 'Не почалося? Натисніть ще раз',
    DL_STARTING: 'Завантаження починається…',
    DOWNLOADS: 'завантажень',
    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Звичайний інсталятор, який запитує, куди встановити програму, і створює ярлики. Він перевіряє наявність нових версій і встановлює їх після вашого підтвердження.',
    EXE_WARN: 'Першого разу Windows не пропускає — ось як пройти',
    F1_H: 'Встановлені ігри',
    F1_LBL: 'Виявлення',
    F1_P: 'Теки бібліотек Steam і файли встановлення читаються безпосередньо на всіх дисках, разом із правильною назвою та ідентифікатором програми для кожної гри.',
    F2_H: 'Запуск гри',
    F2_LBL: 'Запуск',
    F2_P: 'Гру можна запустити через Steam або виконати безпосередньо, щоб вікно Steam не відкривалося. Спосіб задається для кожної гри, а команда, яку буде виконано, показується перед запуском.',
    F3_H: 'Обкладинки',
    F3_LBL: 'Обкладинки',
    F3_P: 'Обкладинки та банери для ігор Steam завантажуються зі Steam і не потребують ні облікового запису, ні ключа API. Додавання ключа SteamGridDB поширює це й на ігри, що продаються в інших місцях.',
    F4_H: 'Записані години',
    F4_LBL: 'Час гри',
    F4_P: 'Parallax записує запущені ним сеанси та поєднує їх із часом, який раніше записав Steam. Використовується більше значення, тож наявні записи ніколи не зменшуються.',
    F5_H: 'Proton і Wine',
    F5_LBL: 'Сумісність',
    F5_P_html: 'Вибір середовища виконання для кожної гри, параметри запуску з синтаксисом Steam <code>%command%</code>, змінні середовища, GameMode і MangoHud.',
    F6_H: 'Локальне зберігання',
    F6_LBL: 'Дані',
    F6_P: 'Бібліотека — звичайний текстовий файл, а зображення — звичайні файли зображень. Нічого не вивантажується, і обліковий запис не потрібен.',
    FOOT_BY_html: 'Parallax Launcher — автор Arda Yalın Özkan.<br>Вільна програма за ліцензією <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_FINE: 'Ігри на знімках екрана взято з бібліотеки одного користувача. Їхні назви та зображення належать їхнім видавцям і не є частиною цього проєкту.',
    FOOT_ISSUES: 'Повідомити про проблему',
    FOOT_RELEASES: 'Випуски',
    FOOT_SOURCE: 'Вихідний код',
    GET_H2: 'Завантаження',
    GET_LEDE: 'Усі три пакунки збираються з одного вихідного коду тим самим автоматизованим процесом, і кожен із них оновлюється сам.',
    HERO_H1: 'Parallax Launcher',
    HERO_LEDE: 'Настільна програма, що збирає встановлені на комп\'ютері ігри в одну бібліотеку, додає обкладинки та запускає їх. Вона читає власні записи Steam про встановлення, і всі її дані зберігаються на вашій машині.',
    HERO_NOTE: 'Вільна програма за ліцензією GNU GPL v3.',
    HERO_SOURCE: 'Переглянути вихідний код',
    LANGS_H2: 'Доступно вісьмома мовами',
    LANGS_LEDE: 'Інтерфейс повністю перекладено англійською, турецькою, німецькою, російською, українською, португальською, спрощеною китайською та корейською.',
    LANG_ARIA: 'Мова',
    LBL_GET: 'Завантажити',
    LBL_LANGS: 'Мови',
    LBL_UPCLOSE: 'Сумісність',
    LBL_WHAT: 'Можливості',
    NAV_DOWNLOAD: 'Завантажити',
    NAV_HELP: 'Довідка',
    NAV_SOURCE: 'Вихідний код',
    REMOVAL_APPIMAGE_P: 'Вилучіть файл. Створені ним запис у меню та піктограма залишаються і вилучаються так:',
    REMOVAL_DATA_html: 'Бібліотека, налаштування та зображення зберігаються в <code>~/.config/parallax-launcher</code> у Linux і в <code>%APPDATA%\\parallax-launcher</code> у Windows. Жоден із наведених нижче кроків не торкається цієї теки, тож повторне встановлення продовжує роботу з того самого стану. Вилучіть її вручну, якщо хочете прибрати все.',
    REMOVAL_DEB_P: 'Вилучіть його як будь-який інший пакунок. Якщо ви додавали сховище, вилучіть і його:',
    REMOVAL_H: 'Вилучення Parallax',
    REMOVAL_WIN_P: 'Відкрийте «Параметри», далі «Програми», виберіть Parallax Launcher і натисніть «Видалити».',
    REPO_NOTE_html: 'У Debian та Ubuntu можна натомість додати сховище пакунків і доручити оновлення системі. Команди наведено в посібниках.',
    SHOT_GAME: 'Сторінка гри — обкладинка, час, «Грати»',
    SHOT_LIBRARY: 'Бібліотека — стіна з обкладинок',
    SHOT_SETTINGS: 'Властивості — середовище, параметри запуску, що саме запуститься',
    UPCLOSE_H2: 'Налаштування сумісності',
    UPCLOSE_LEDE: 'Кожна гра має власні налаштування середовища виконання. У міру їх зміни показується команда, яку буде використано для запуску гри.',
    WHAT_H2: 'Як Parallax знаходить ваші ігри',
    WHAT_LEDE: 'Parallax читає записи про встановлення, які Steam зберігає на диску, замість того щоб переглядати теки, тож бібліотека відображає те, що справді встановлено.'
},

pt: {
    APPIMAGE_FOR: 'Qualquer distribuição Linux',
    APPIMAGE_P_html: 'Um único ficheiro que não exige instalação. Os ficheiros transferidos não são executáveis por predefinição, por isso permita primeiro a execução: clique com o botão direito, abra Propriedades e active a opção que permite executar o ficheiro como um programa.',
    BTN_APPIMAGE: 'Baixar AppImage',
    BTN_DEB: 'Baixar .deb',
    BTN_DL_LINUX: 'Baixar para Linux',
    BTN_WIN: 'Baixar para Windows',
    CHIP_UPDATES: 'Atualiza sozinho',
    COPIED: 'Copiado',
    COPY: 'Copiar',
    COPY_ARIA: 'Copiar estes comandos',
    COPY_FAIL: 'Selecione',
    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: 'Instala-se da mesma forma que o restante software e aparece no menu de aplicações. As actualizações são instaladas através do <code>dpkg</code>, que pede a sua palavra-passe.',
    DL_RETRY: 'Não começou? Clique de novo',
    DL_STARTING: 'Começando o download…',
    DOWNLOADS: 'downloads',
    EXE_FOR: 'Windows 10 · 11',
    EXE_P: 'Um instalador comum que pergunta onde instalar o programa e cria os atalhos. Verifica se existem versões novas e instala-as depois de o utilizador confirmar.',
    EXE_WARN: 'Na primeira vez o Windows barra — veja como passar',
    F1_H: 'Jogos instalados',
    F1_LBL: 'Detecção',
    F1_P: 'As pastas de biblioteca e os ficheiros de instalação da Steam são lidos directamente, em todas as unidades, incluindo o título correcto e o identificador de aplicação de cada jogo.',
    F2_H: 'Iniciar um jogo',
    F2_LBL: 'Abrir',
    F2_P: 'Um jogo pode ser iniciado através da Steam ou executado directamente, para que a janela da Steam não se abra. O método é definido por jogo, e o comando que vai ser executado é mostrado antes do arranque.',
    F3_H: 'Imagens de capa',
    F3_LBL: 'Capas',
    F3_P: 'As imagens de capa e os banners dos jogos da Steam são transferidos da Steam e não exigem conta nem chave de API. Acrescentar uma chave da SteamGridDB estende isto a jogos vendidos noutros sítios.',
    F4_H: 'Horas registadas',
    F4_LBL: 'Tempo de jogo',
    F4_P: 'O Parallax regista as sessões que inicia e combina-as com o tempo de jogo registado anteriormente pela Steam. É usado o valor mais alto, pelo que os registos existentes nunca são reduzidos.',
    F5_H: 'Proton e Wine',
    F5_LBL: 'Compatibilidade',
    F5_P_html: 'Selecção do ambiente de execução por jogo, opções de arranque com a sintaxe <code>%command%</code> da Steam, variáveis de ambiente, GameMode e MangoHud.',
    F6_H: 'Armazenamento local',
    F6_LBL: 'Dados',
    F6_P: 'A biblioteca é um ficheiro de texto simples e as imagens são ficheiros de imagem comuns. Nada é enviado e não é necessária qualquer conta.',
    FOOT_BY_html: 'Parallax Launcher — feito por Arda Yalın Özkan.<br>Software livre sob a licença <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>.',
    FOOT_FINE: 'Os jogos apresentados nas imagens pertencem à biblioteca de um utilizador. Os seus títulos e imagens pertencem às respectivas editoras e não fazem parte deste projecto.',
    FOOT_ISSUES: 'Relatar um problema',
    FOOT_RELEASES: 'Versões',
    FOOT_SOURCE: 'Código-fonte',
    GET_H2: 'Transferência',
    GET_LEDE: 'Os três pacotes são compilados a partir do mesmo código pelo mesmo processo automatizado, e cada um actualiza-se a si próprio.',
    HERO_H1: 'Parallax Launcher',
    HERO_LEDE: 'Uma aplicação para computador que reúne numa única biblioteca os jogos instalados no seu computador, acrescenta as imagens de capa e inicia-os. Lê os registos de instalação da própria Steam, e todos os seus dados ficam guardados na sua máquina.',
    HERO_NOTE: 'Software livre sob a licença GNU GPL v3.',
    HERO_SOURCE: 'Ver o código-fonte',
    LANGS_H2: 'Disponível em oito idiomas',
    LANGS_LEDE: 'A interface está totalmente traduzida para inglês, turco, alemão, russo, ucraniano, português, chinês simplificado e coreano.',
    LANG_ARIA: 'Idioma',
    LBL_GET: 'Baixar',
    LBL_LANGS: 'Idiomas',
    LBL_UPCLOSE: 'Compatibilidade',
    LBL_WHAT: 'Funcionalidades',
    NAV_DOWNLOAD: 'Baixar',
    NAV_HELP: 'Ajuda',
    NAV_SOURCE: 'Código-fonte',
    REMOVAL_APPIMAGE_P: 'Apague o ficheiro. A entrada de menu e o ícone que criou permanecem e podem ser removidos com:',
    REMOVAL_DATA_html: 'A sua biblioteca, definições e imagens ficam guardadas em <code>~/.config/parallax-launcher</code> no Linux e em <code>%APPDATA%\\parallax-launcher</code> no Windows. Nenhum dos passos seguintes afecta essa pasta, pelo que reinstalar continua a partir do mesmo estado. Apague-a manualmente se pretender remover tudo.',
    REMOVAL_DEB_P: 'Remova-o como removeria qualquer outro pacote. Se acrescentou o repositório, remova-o também:',
    REMOVAL_H: 'Remover o Parallax',
    REMOVAL_WIN_P: 'Abra as Definições, depois Aplicações, seleccione o Parallax Launcher e escolha Desinstalar.',
    REPO_NOTE_html: 'No Debian e no Ubuntu pode acrescentar o repositório de pacotes e deixar o sistema tratar das actualizações. Os comandos estão indicados nos guias.',
    SHOT_GAME: 'A página de um jogo — capa, tempo, Jogar',
    SHOT_LIBRARY: 'A biblioteca — uma parede de capas',
    SHOT_SETTINGS: 'Propriedades — runtime, opções de inicialização, o que vai rodar',
    UPCLOSE_H2: 'Definições de compatibilidade',
    UPCLOSE_LEDE: 'Cada jogo tem as suas próprias definições de execução. À medida que estas são alteradas, é mostrado o comando que será usado para iniciar o jogo.',
    WHAT_H2: 'Como o Parallax encontra os seus jogos',
    WHAT_LEDE: 'O Parallax lê os registos de instalação que a Steam mantém no disco em vez de percorrer pastas, pelo que a biblioteca reflecte o que está efectivamente instalado.'
},

zh: {
    APPIMAGE_FOR: '任意 Linux 发行版',
    APPIMAGE_P_html: '无需安装的单个文件。下载的文件默认不可执行，因此请先允许运行：右键单击，打开“属性”，启用允许将该文件作为程序运行的选项。',
    BTN_APPIMAGE: '下载 AppImage',
    BTN_DEB: '下载 .deb',
    BTN_DL_LINUX: '下载 Linux 版',
    BTN_WIN: '下载 Windows 版',
    CHIP_UPDATES: '自动更新',
    COPIED: '已复制',
    COPY: '复制',
    COPY_ARIA: '复制这些命令',
    COPY_FAIL: '请手动选择',
    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: '与您的其他软件以相同方式安装，并出现在应用程序菜单中。更新通过 <code>dpkg</code> 安装，它会要求输入密码。',
    DL_RETRY: '没有开始？再点一次',
    DL_STARTING: '开始下载…',
    DOWNLOADS: '次下载',
    EXE_FOR: 'Windows 10 · 11',
    EXE_P: '一个常规安装程序，会询问程序的安装位置并创建快捷方式。它会检查新版本，并在您确认后安装。',
    EXE_WARN: '第一次 Windows 会拦下来 — 这里是过关方法',
    F1_H: '已安装的游戏',
    F1_LBL: '识别',
    F1_P: '直接读取各个驱动器上的 Steam 库文件夹和安装清单，其中包含每款游戏的正确标题和应用 ID。',
    F2_H: '启动游戏',
    F2_LBL: '启动',
    F2_P: '游戏可以通过 Steam 启动，也可以直接运行，从而不打开 Steam 窗口。该方式按游戏分别设定，并在运行前显示将要执行的完整命令。',
    F3_H: '封面图片',
    F3_LBL: '封面',
    F3_P: 'Steam 游戏的封面图片和横幅从 Steam 下载，无需账号或 API 密钥。添加 SteamGridDB 密钥后，这一功能同样适用于在其他商店销售的游戏。',
    F4_H: '已记录的时长',
    F4_LBL: '游戏时长',
    F4_P: 'Parallax 记录由它启动的游戏时段，并与 Steam 此前记录的时长合并。采用其中较大的数值，因此已有记录不会被减少。',
    F5_H: 'Proton 与 Wine',
    F5_LBL: '兼容性',
    F5_P_html: '按游戏选择运行环境，使用 Steam 的 <code>%command%</code> 语法设置启动选项，以及环境变量、GameMode 和 MangoHud。',
    F6_H: '本地存储',
    F6_LBL: '数据',
    F6_P: '库是一个纯文本文件，图片是普通的图片文件。没有任何内容被上传，也不需要注册账号。',
    FOOT_BY_html: 'Parallax Launcher，作者 Arda Yalın Özkan。<br>依据 <a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a> 发布的自由软件。',
    FOOT_FINE: '截图中显示的游戏来自某位用户的库。其名称和图片归各自发行商所有，并非本项目的一部分。',
    FOOT_ISSUES: '反馈问题',
    FOOT_RELEASES: '版本',
    FOOT_SOURCE: '源代码',
    GET_H2: '下载',
    GET_LEDE: '三种软件包均由同一套源代码、同一自动化流程构建，且各自都能自我更新。',
    HERO_H1: 'Parallax Launcher',
    HERO_LEDE: '一款桌面应用程序，将计算机上已安装的游戏汇集到一个库中，补齐封面图片并启动它们。它读取 Steam 自身的安装记录，全部数据都保存在您的计算机上。',
    HERO_NOTE: '依据 GNU GPL v3 发布的自由软件。',
    HERO_SOURCE: '查看源代码',
    LANGS_H2: '提供八种语言',
    LANGS_LEDE: '界面已完整翻译为英语、土耳其语、德语、俄语、乌克兰语、葡萄牙语、简体中文和韩语。',
    LANG_ARIA: '语言',
    LBL_GET: '下载',
    LBL_LANGS: '语言',
    LBL_UPCLOSE: '兼容性',
    LBL_WHAT: '功能',
    NAV_DOWNLOAD: '下载',
    NAV_HELP: '帮助',
    NAV_SOURCE: '源代码',
    REMOVAL_APPIMAGE_P: '删除该文件。它创建的菜单条目和图标仍会保留，可用以下命令删除：',
    REMOVAL_DATA_html: '您的库、设置和图片保存在 Linux 上的 <code>~/.config/parallax-launcher</code> 和 Windows 上的 <code>%APPDATA%\\parallax-launcher</code>。下列步骤都不会影响该文件夹，因此重新安装会从相同状态继续。若要彻底清除，请自行删除该文件夹。',
    REMOVAL_DEB_P: '像卸载其他软件包一样卸载它。若您添加过软件源，也请一并删除：',
    REMOVAL_H: '卸载 Parallax',
    REMOVAL_WIN_P: '打开“设置”，进入“应用”，选择 Parallax Launcher，然后选择卸载。',
    REPO_NOTE_html: '在 Debian 和 Ubuntu 上，您也可以添加软件源，把更新交给系统处理。相关命令列在指南中。',
    SHOT_GAME: '单个游戏页面 — 封面、时长、开始游戏',
    SHOT_LIBRARY: '游戏库 — 一整面墙的封面',
    SHOT_SETTINGS: '属性 — 运行环境、启动选项、究竟会运行什么',
    UPCLOSE_H2: '兼容性设置',
    UPCLOSE_LEDE: '每款游戏都有各自的运行环境设置。在修改这些设置的同时，会显示启动该游戏将要使用的命令。',
    WHAT_H2: 'Parallax 如何找到您的游戏',
    WHAT_LEDE: 'Parallax 读取 Steam 保存在磁盘上的安装记录，而不是逐个扫描文件夹，因此库中显示的就是实际已安装的内容。'
},

ko: {
    APPIMAGE_FOR: '모든 리눅스 배포판',
    APPIMAGE_P_html: '설치가 필요 없는 단일 파일입니다. 내려받은 파일은 기본적으로 실행할 수 없으므로 먼저 실행을 허용하십시오. 오른쪽 클릭 후 속성을 열고, 파일을 프로그램으로 실행하도록 허용하는 항목을 켜시면 됩니다.',
    BTN_APPIMAGE: 'AppImage 받기',
    BTN_DEB: '.deb 받기',
    BTN_DL_LINUX: 'Linux용 받기',
    BTN_WIN: 'Windows용 받기',
    CHIP_UPDATES: '스스로 업데이트',
    COPIED: '복사됨',
    COPY: '복사',
    COPY_ARIA: '이 명령들 복사',
    COPY_FAIL: '직접 선택',
    DEB_FOR: 'Debian · Ubuntu · Mint',
    DEB_P_html: '다른 소프트웨어와 같은 방식으로 설치되며 응용 프로그램 메뉴에 표시됩니다. 업데이트는 <code>dpkg</code>를 통해 설치되며 암호를 요구합니다.',
    DL_RETRY: '시작되지 않았나요? 다시 클릭하세요',
    DL_STARTING: '다운로드를 시작합니다…',
    DOWNLOADS: '회 다운로드',
    EXE_FOR: 'Windows 10 · 11',
    EXE_P: '설치 위치를 묻고 바로 가기를 만드는 일반적인 설치 프로그램입니다. 새 버전을 확인하고 사용자가 확인하면 설치합니다.',
    EXE_WARN: '처음에는 Windows가 막습니다 — 넘어가는 방법은 여기',
    F1_H: '설치된 게임',
    F1_LBL: '인식',
    F1_P: '모든 드라이브에서 Steam의 라이브러리 폴더와 설치 기록을 직접 읽으며, 각 게임의 정확한 제목과 애플리케이션 ID도 함께 가져옵니다.',
    F2_H: '게임 실행',
    F2_LBL: '실행',
    F2_P: '게임은 Steam을 통해 실행하거나, Steam 창이 열리지 않도록 직접 실행할 수 있습니다. 방식은 게임마다 지정하며, 실행될 명령은 실행 전에 표시됩니다.',
    F3_H: '표지 이미지',
    F3_LBL: '표지',
    F3_P: 'Steam 게임의 표지 이미지와 배너는 Steam에서 내려받으며 계정이나 API 키가 필요하지 않습니다. SteamGridDB 키를 추가하면 다른 곳에서 판매되는 게임에도 적용됩니다.',
    F4_H: '기록된 시간',
    F4_LBL: '플레이 시간',
    F4_P: 'Parallax는 자신이 시작한 세션을 기록하고, Steam이 이전에 기록한 플레이 시간과 합칩니다. 더 큰 값을 사용하므로 기존 기록이 줄어드는 일은 없습니다.',
    F5_H: 'Proton과 Wine',
    F5_LBL: '호환성',
    F5_P_html: '게임별 실행 환경 선택, Steam의 <code>%command%</code> 문법을 사용하는 실행 옵션, 환경 변수, GameMode, MangoHud.',
    F6_H: '로컬 저장',
    F6_LBL: '데이터',
    F6_P: '라이브러리는 일반 텍스트 파일이고 이미지는 평범한 이미지 파일입니다. 업로드되는 것은 없으며 계정도 필요하지 않습니다.',
    FOOT_BY_html: 'Parallax Launcher — 만든 사람 Arda Yalın Özkan.<br><a href="https://github.com/ArdaYalinOzkan/parallax-launcher/blob/main/LICENSE">GNU GPL v3</a>으로 배포하는 자유 소프트웨어.',
    FOOT_FINE: '화면 사진에 보이는 게임은 한 사용자의 라이브러리에서 가져온 것입니다. 제목과 이미지는 각 배급사의 것이며 이 프로젝트의 일부가 아닙니다.',
    FOOT_ISSUES: '문제 알리기',
    FOOT_RELEASES: '릴리스',
    FOOT_SOURCE: '소스 코드',
    GET_H2: '내려받기',
    GET_LEDE: '세 가지 패키지 모두 같은 소스에서 같은 자동화 과정을 거쳐 빌드되며, 각각 스스로 업데이트합니다.',
    HERO_H1: 'Parallax Launcher',
    HERO_LEDE: '컴퓨터에 설치된 게임을 하나의 라이브러리로 모으고, 표지 이미지를 채워 넣고, 게임을 실행하는 데스크톱 응용 프로그램입니다. Steam 자체의 설치 기록을 읽으며, 모든 데이터는 사용자의 컴퓨터에 저장됩니다.',
    HERO_NOTE: 'GNU GPL v3에 따른 자유 소프트웨어입니다.',
    HERO_SOURCE: '소스 코드 보기',
    LANGS_H2: '여덟 개 언어 지원',
    LANGS_LEDE: '인터페이스는 영어, 터키어, 독일어, 러시아어, 우크라이나어, 포르투갈어, 중국어 간체, 한국어로 모두 번역되어 있습니다.',
    LANG_ARIA: '언어',
    LBL_GET: '다운로드',
    LBL_LANGS: '언어',
    LBL_UPCLOSE: '호환성',
    LBL_WHAT: '기능',
    NAV_DOWNLOAD: '다운로드',
    NAV_HELP: '도움말',
    NAV_SOURCE: '소스 코드',
    REMOVAL_APPIMAGE_P: '파일을 삭제하십시오. 파일이 만든 메뉴 항목과 아이콘은 남아 있으며 다음 명령으로 지울 수 있습니다:',
    REMOVAL_DATA_html: '라이브러리와 설정, 이미지는 리눅스에서는 <code>~/.config/parallax-launcher</code>, Windows에서는 <code>%APPDATA%\\parallax-launcher</code>에 저장됩니다. 아래 단계는 이 폴더에 영향을 주지 않으므로 다시 설치하면 같은 상태에서 이어집니다. 전부 지우시려면 폴더를 직접 삭제하십시오.',
    REMOVAL_DEB_P: '다른 패키지와 같은 방식으로 삭제하십시오. 저장소를 추가하셨다면 그것도 함께 삭제하십시오:',
    REMOVAL_H: 'Parallax 삭제',
    REMOVAL_WIN_P: '설정을 열고 앱으로 이동한 뒤 Parallax Launcher를 선택하고 제거를 누르십시오.',
    REPO_NOTE_html: 'Debian과 Ubuntu에서는 대신 패키지 저장소를 추가해 업데이트를 시스템에 맡기실 수 있습니다. 명령은 안내서에 나와 있습니다.',
    SHOT_GAME: '게임 한 편의 페이지 — 표지, 플레이 시간, 실행',
    SHOT_LIBRARY: '라이브러리 — 표지로 가득한 벽',
    SHOT_SETTINGS: '속성 — 런타임, 실행 옵션, 무엇이 실행될지',
    UPCLOSE_H2: '호환성 설정',
    UPCLOSE_LEDE: '게임마다 고유한 실행 환경 설정이 있습니다. 설정을 바꾸는 동안, 그 게임을 실행할 때 사용될 명령이 함께 표시됩니다.',
    WHAT_H2: 'Parallax가 게임을 찾는 방식',
    WHAT_LEDE: 'Parallax는 폴더를 훑는 대신 Steam이 디스크에 보관하는 설치 기록을 읽습니다. 따라서 라이브러리에는 실제로 설치된 것이 표시됩니다.'
}
};

(() => {
    const FALLBACK = 'en';
    const STORE = 'parallaxLang';
    /* The site and its help pages are two subdomains, which is to say
       two origins with two separate localStorages. A cookie set on the
       shared parent domain is one setting for both, so choosing Korean
       anywhere is choosing it everywhere. localStorage is kept as well,
       for the case where cookies are refused. */
    const DOMAIN = 'parallaxlauncher.com';

    function readCookie() {
        try {
            const hit = document.cookie.split('; ').find(c => c.startsWith(STORE + '='));
            return hit ? decodeURIComponent(hit.slice(STORE.length + 1)) : null;
        } catch {
            return null;
        }
    }

    function remember(lang) {
        try { localStorage.setItem(STORE, lang); } catch { }
        try {
            // The domain attribute only applies on the real site; on
            // localhost it would silently void the cookie.
            const shared = location.hostname.endsWith(DOMAIN) ? '; domain=.' + DOMAIN : '';
            const secure = location.protocol === 'https:' ? '; Secure' : '';
            document.cookie = STORE + '=' + encodeURIComponent(lang) +
                '; path=/; max-age=31536000; SameSite=Lax' + shared + secure;
        } catch { }
    }

    /* Which language to start in, in order of how much it means: the
       address bar, then the shared cookie, then this origin's own
       storage, then what the browser asks for. */
    function initial() {
        const asked = new URLSearchParams(location.search).get('lang');
        if (asked && PARALLAX_STRINGS[asked]) {
            // A choice arriving by link is still a choice, and it used
            // not to be written down — so the next page forgot it and
            // fell back to English. That was the bug where one page of
            // the site was Turkish and the next one was not.
            remember(asked);
            return asked;
        }

        const shared = readCookie();
        if (shared && PARALLAX_STRINGS[shared]) return shared;

        let saved = null;
        try { saved = localStorage.getItem(STORE); } catch { }
        if (saved && PARALLAX_STRINGS[saved]) {
            // Seen before this site used a cookie; carry it over.
            remember(saved);
            return saved;
        }

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
            remember(select.value);
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
