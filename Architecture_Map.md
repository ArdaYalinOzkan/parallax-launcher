# PARALLAX LAUNCHER BÜYÜK YAPI HARİTASI
*Bu doküman projenin omurgasıdır. Kodda yapılan her yeni sistem ve değişiklik bu deftere kaydedilecektir.*

---

## ⚙️ ARKA PLAN SİSTEMLERİ (Backend / Process)

### 1. `App_Core/SocialManager.js` (Firebase & Bulut İşlemleri)
*   **BÖLÜM 1: SİSTEM BAŞLATMA VE SENKRONİZASYON**
    *   *Uygulamanın ilk ayağa kalktığı ve bulut hesabını eşleştirdiği yer.*
    *   `initialize(config)`: Firebase kütüphanesini anahtarlarımızla başlatırız.
    *   `syncUser()`: Auth sistemindeki UID numarası kullanılarak, 'Users' koleksiyonundaki gerçek dokümanı bulur ve verileri eşitler.
    *   `waitForAuth()`: Arayüz yüklenirken geçici donmaları engellemek için, girişin tamamlanmasını güvenle bekletir.
*   **BÖLÜM 2: KAYIT VE GİRİŞ SİSTEMİ (AUTH / REGISTER / LOGIN)**
    *   `register()`: Aynı isme sahip (Case-Sensitive) kullanıcı var mı diye bakar, yoksa Auth'tan hesap oluşturup "Users/KullanıcıAdı" hedefine künyeyi setDoc ile yazar.
    *   `login()`: E-mail/şifre ile standart giriş yapar ve syncUser tetikler.
*   **BÖLÜM 3: HESAP YÖNETİMİ VE TEMİZLİK KODLARI (DELETE / LOGOUT)**
    *   `deleteUser()`: İlk olarak Firestore veritabanından 'Users/Adı' dokümanını tamamen siler, ardından Auth panelinden hesabı temizler.
    *   `logout()`: Güvenli çıkış yapıp RAM'i temizler.

### 2. `App_Core/preload.js` (Güvenlik Köprüsü)
*   *Frontend'in backend komutlarını çalıştırabilmesine olanak tanıyan IPC köprüsü.*
*   **BÖLÜM 1: TEMEL KÜTÜPHANE VE OYUN İŞLEMLERİ** (Oyun başlama, exe seçme, kapatma)
*   **BÖLÜM 2: YEREL HESAP (LOCAL ACCOUNT) YÖNETİMİ**
*   **BÖLÜM 3: KASA (VAULT) / GÖRSEL YÖNETİMİ** (Panodan yapıştırma, temizlik)
*   **BÖLÜM 4: KURTARMA, AYARLAR VE SİSTEM** (deleted_vault mekanizmaları)
*   **BÖLÜM 5: DIŞ API SİSTEMLERİ (STEAM / IGDB)**
*   **BÖLÜM 6: BULUT SİSTEMİ (FIREBASE / SOCIAL)**

### 3. `App_Core/LibraryManager.js` (Yerel Dosya ve Oyun Motoru)
*   *Hard-disk üzerindeki Library.txt okuma/yazma işlemleri.*
*   **BÖLÜM 1: GÜVENLİK VE ALTYAPI**
    *   `makeRelative()`: Tüm resim/Oyun yollarını taşınabilir formata (Bağıl/Relative) çevirir.
*   **BÖLÜM 2: VERİ OKUMA SİSTEMİ (PARSER)**
    *   `readLibrary()`: Metin dosyasını parçalar arası '---' işaretlerinden bölerek Javascript objesine (Profil ve Oyunlar dizisine) çevirir.
*   **BÖLÜM 3: VERİ YAZMA VE GÜNCELLEME (WRITER)**
    *   `updateLibrary()`: Kaydedilen değişikliklerin tamamını Hard-Disk'e basar.
    *   `bulkAddGames()`: Dosya sonuna performanslı ekleme (Append) yapar.

### 4. `App_Core/main.js` (Ana Çekirdek İşletim Sistemi Bantları)
*   *İşletim sistemiyle doğrudan bağ kuran ana işlem (Main Process).*
*   **BÖLÜM 1: LINUX & PROTON/STEAM BULMA MOTORU**
    *   `scanProtonVersions()`: Linux ortamındaki WINE/Proton dizinlerini tarar.
*   **BÖLÜM 3A: KÜTÜPHANE YÖNETİMİ** (LibraryManager tetikleyicileri)
*   **BÖLÜM 3B: YEREL HESAP VE PROFİL YÖNETİMİ** 
*   **BÖLÜM 3D: DOSYA SEÇİCİ PENCERELER**
*   **BÖLÜM 3E: OYUN BAŞLATMA VE DURDURMA MOTORU** (Exec / Spawn / Kill komutları)
*   **BÖLÜM 3F: GÜVENLİ KASA (VAULT) SİSTEMİ**
*   **BÖLÜM 3G: KURTARMA VE ÇÖP KUTUSU SİSTEMİ**
*   **BÖLÜM 3H: API BAĞLANTILARI - STEAM & OYUN ARAMALARI**
*   **BÖLÜM 3I: API BAĞLANTILARI - IGDB VE GÖRSEL ÇEKME**
*   **BÖLÜM 3J: BULUT SİSTEMİ BİLDİRİMLERİ (SOCIAL FIREBASE)**

---

## 🎨 ARAYÜZ SİSTEMLERİ (Frontend / Renderer)

### 5. `App_Core/renderer/index.html` (Önyüz İskeleti)
*   **EKRAN 1: GATEWAY (Giriş Kapısı)** (Uygulamanın karşılama menüsü, logo, yerel hesaplar)
*   **BÖLÜM 1A: KİMLİK DOĞRULAMA PORTALI (AUTH PORTAL)** (Cloud/Local Giriş Seçimleri)
*   **EKRAN 2: KÜTÜPHANE - ANA UYGULAMA (Library Grid)** (Sağ taraftaki ana oyun kapakları ekranı)
*   **EKRAN 3: OYUN DETAY EKRANI (Game Details Screen)** (Kapağa tıklanınca açılan bannerlı play tuşu ekranı)
*   **EKRAN 4: KİŞİSEL PROFİL AYARLARI (Profile Details Screen)** (Profil resmi ayarlama ekranı)
*   **ARAÇ 1: EVRENSEL GÖRSEL KAYDIRICI (Universal Asset Adjuster)** (Resmi sağa sola oklarla/fareyle çektiğimiz kırpıcı araç)
*   **ARAÇ 2: YENİ OYUN ARAMA MOTORU MODALI** (+ butonu ile açılan IGDB/Steam arama)
*   **ARAÇ 3: SOSYAL AĞ / ARKADAŞLIK SİSTEMİ** (Taslak aşamasında, Firebase entegreli bildirim panosu)

### 6. `App_Core/renderer/app.js` (Arayüz Beyni / Büyük Patron)
*   *Kullanıcının yaptığı her tıklamanın, sürüklemenin veya animasyonun gerçekleştiği devasa alan.*
*   **BÖLÜM 1: PROFİL GÖRSELLERİ VE ASSET ÇEKİRDEĞİ** (Seçilenleri anında UI'ye yansıtan fonksiyonlar)
*   **BÖLÜM 2: GÖRSEL KIRPMA (ADJUSTER) MOTORU** (Matematik/Matris kaydırmaları ve tekerlek zoom işlemleri)
*   **BÖLÜM 3: YENİ OYUN EKLEME VE KAYDETME MOTORU** 
*   **BÖLÜM 4: HESAP YÖNETİMİ / SİLİNME İŞLEMLERİ** (Hesap silme tuşundaki onayın sadece butonda sorulması ve Frontend'in anında backend'i tetiklemesi)
*   **BÖLÜM 5: IGDB (OYUN KAPAK VERİTABANI) ARAYÜZÜ** 
*   **BÖLÜM 6: STEAM ENTEGRASYONU VE TARAMA EKRANI** 

**🔴 GÜNLÜK KAYDI (LOGS):**
*   **[GÜNCELLEME - 1]:** `deleteAccountModal` (Şifre yazarak hesabı kalıcı silme penceresi) `index.html` üzerinden kökünden söküldü. Arayüzde "DELETE" yazma zorunluluğu yok edildi. (Uygulanan dosya: `index.html` & `app.js`).
*   **[GÜNCELLEME - 2]:** Backend tarafındaki `CRYPTO-LOCK` güvenlik duvarı kaldırıldı. Eski veya bağlantısı kopuk bir bulut hesabını bile yerel depolamadan silmek artık kullanıcıyı bloklamıyor. Doğrudan anında siliniyor! (Uygulanan dosya: `main.js`).

### 7. CSS Dosyaları (friend_system.css / styles.css)
*   Görselin temeli, değişkenler (CSS Variables) ve glow (aydınlanma)/blur arkaplanlarının depolandığı bölge.
