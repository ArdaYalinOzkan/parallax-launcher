#!/usr/bin/env bash
# Serve the sites from this machine, so they can be looked at before
# anybody else sees them.
#
#     tools/preview.sh          start both, print the addresses
#     tools/preview.sh stop     stop them
#
# The guides are served from the working copy, which is where the
# rewriting happens — so a reload shows whatever was last saved, with
# no commit and no deploy in between.

set -euo pipefail

YARDIM="/home/arda/Projects/parallax-help"
ANA="/home/arda/Projects/Parallax Launcher/docs"
P_YARDIM=4321
P_ANA=4322

durdur() {
    local n=0
    for p in $P_YARDIM $P_ANA; do
        # Yalnızca bu portlardaki sunucular; deseni köşeli parantezle
        # yazmak pkill'in kendi komut satırını yakalamasını önlüyor.
        if pkill -f "[h]ttp.server $p" 2>/dev/null; then n=$((n + 1)); fi
    done
    echo "durduruldu: $n sunucu"
}

[ "${1:-start}" = stop ] && { durdur; exit 0; }

durdur >/dev/null 2>&1 || true

basla() {
    local dizin="$1" port="$2"
    [ -d "$dizin" ] || { echo "yok: $dizin"; return 1; }
    setsid python3 -m http.server "$port" --directory "$dizin" \
        >/dev/null 2>&1 < /dev/null &
    disown
}

basla "$YARDIM" $P_YARDIM
basla "$ANA" $P_ANA
sleep 2

printf '\n'
for ad_port in "Rehberler:$P_YARDIM" "Ana site:$P_ANA"; do
    ad="${ad_port%%:*}"; port="${ad_port##*:}"
    kod="$(curl -s -o /dev/null -w '%{http_code}' "http://127.0.0.1:$port/" || echo 000)"
    printf '  %-10s http://localhost:%s   (%s)\n' "$ad" "$port" "$kod"
done
printf '\n  Dili değiştirmek için:  http://localhost:%s/?lang=de\n' "$P_YARDIM"
printf '  Durdurmak için:         tools/preview.sh stop\n\n'
