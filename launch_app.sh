#!/usr/bin/env bash
# Parallax Launcher — başlat, ya da zaten açıksa ona geç.
#
# Kaynaktan çalıştırıyor, derlenmiş bir kopyadan değil: App_Core/ içinde
# ne varsa o açılıyor. Yani geliştirme sırasında bir dosyayı kaydedip
# tuşa basmak son hâlini görmeye yetiyor, ayrıca paketleme adımı yok.
#
# Bir tuşa bağlı olduğu için ikinci bir kopya açmıyor. Uygulamanın kendi
# tek-örnek kilidi yok, o yüzden kontrol burada yapılıyor: pencere zaten
# varsa ona odaklanılıyor.

set -euo pipefail

APP_DIR="/home/arda/Projects/Parallax Launcher/App_Core"
ELECTRON="$APP_DIR/node_modules/electron/dist/electron"
CLASS="parallax-launcher"

# Zaten açıksa yeni kopya açma: bulunduğu workspace'e geç ve odaklan.
# `read` kullanmıyoruz — çıktı boş olduğunda 1 döndürüyor ve `set -e`
# scripti tam orada, hiçbir şey yapmadan sonlandırıyor.
if command -v hyprctl >/dev/null 2>&1; then
    FOUND=$(hyprctl clients -j 2>/dev/null | python3 -c "
import json, sys
try:
    for c in json.load(sys.stdin):
        if c.get('class') == '$CLASS':
            print(c['address'], c['workspace']['id'])
            break
except Exception:
    pass
" 2>/dev/null || true)

    if [ -n "$FOUND" ]; then
        ADDR="${FOUND%% *}"
        WS="${FOUND##* }"
        hyprctl dispatch workspace "$WS" >/dev/null 2>&1 || true
        hyprctl dispatch focuswindow "address:$ADDR" >/dev/null 2>&1 || true
        exit 0
    fi
fi

if [ ! -x "$ELECTRON" ]; then
    command -v notify-send >/dev/null 2>&1 && notify-send "Parallax Launcher" \
        "Electron bulunamadı. App_Core içinde 'npm install' çalıştır."
    exit 1
fi

cd "$APP_DIR"

# Oturumdan koparıp geri dönüyoruz. `exec` kullanmıyoruz: o, scripti
# uygulamanın kendisine dönüştürüp bekletirdi — tuşa basınca sorun olmaz
# ama terminalden çağrıldığında kilitler.
setsid "$ELECTRON" . --no-sandbox >/dev/null 2>&1 < /dev/null &
disown
exit 0
