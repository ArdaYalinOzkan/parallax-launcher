#!/usr/bin/env bash
# Take a site down, or put it back.
# =================================
#
#     tools/site.sh down            both sites
#     tools/site.sh down help       just the guides
#     tools/site.sh up main         just the main site
#     tools/site.sh status
#
# Down means every page is removed from the published commit and the
# not-found page is put in their place, so any address on the domain
# answers with it. The commit records which revision the pages came
# from, and up restores them from exactly that revision — so it does
# not matter what else has been committed in between, and there is no
# second copy of the site to drift out of date.
#
# GitHub Pages redeploys on push, so it takes a minute or two either
# way; the script waits and tells you when the change is actually live.

set -euo pipefail

ANA="/home/arda/Projects/Parallax Launcher"
ANA_ALT="docs"
YARDIM="/home/arda/Projects/parallax-help"
ISARET="[site-down]"

kirmizi() { printf '\033[31m%s\033[0m\n' "$*"; }
yesil()   { printf '\033[32m%s\033[0m\n' "$*"; }
bilgi()   { printf '  %s\n' "$*"; }

# --- bir sitenin depo kökü ve sayfa dizini
depo_kok()  { [ "$1" = main ] && echo "$ANA" || echo "$YARDIM"; }
sayfa_dizin() { [ "$1" = main ] && echo "$ANA/$ANA_ALT" || echo "$YARDIM"; }
adres()     { [ "$1" = main ] && echo "https://parallaxlauncher.com" || echo "https://help.parallaxlauncher.com"; }

durum_oku() {
    local kok; kok="$(depo_kok "$1")"
    git -C "$kok" log -1 --format='%s' | grep -qF "$ISARET" && echo kapali || echo acik
}

indir() {
    local site="$1" kok dizin
    kok="$(depo_kok "$site")"; dizin="$(sayfa_dizin "$site")"

    if [ "$(durum_oku "$site")" = kapali ]; then
        bilgi "$site zaten kapalı."
        return 0
    fi

    # Tek gerçek 404 sayfası; geri kalan her sayfa commit'ten çıkıyor.
    if [ ! -f "$dizin/404.html" ]; then
        kirmizi "$dizin/404.html yok — önce onu oluştur."
        return 1
    fi

    local silinen=0
    while IFS= read -r f; do
        [ "$(basename "$f")" = "404.html" ] && continue
        git -C "$kok" rm -q --ignore-unmatch "$f"
        silinen=$((silinen + 1))
    done < <(git -C "$kok" ls-files "${dizin#$kok/}/*.html" 2>/dev/null || git -C "$kok" ls-files '*.html')

    cp "$dizin/404.html" "$dizin/index.html"
    git -C "$kok" add "${dizin#$kok/}/index.html" 2>/dev/null || git -C "$kok" add index.html

    local geri
    geri="$(git -C "$kok" rev-parse HEAD)"
    git -C "$kok" commit -q -m "$ISARET take $site offline

Every page is removed from the published commit and the not-found page
answers in their place.

restore-from: $geri
Restore with: tools/site.sh up $site"
    git -C "$kok" push -q origin main
    yesil "$site kapatıldı ($silinen sayfa çekildi, 404 yerine kondu)."
}

kaldir() {
    local site="$1" kok
    kok="$(depo_kok "$site")"

    if [ "$(durum_oku "$site")" = acik ]; then
        bilgi "$site zaten açık."
        return 0
    fi

    local commit geri
    commit="$(git -C "$kok" log --format='%H %s' -40 | grep -F "$ISARET" | head -1 | cut -d' ' -f1)"
    [ -z "$commit" ] && { kirmizi "$site: kapatma commit'i bulunamadı."; return 1; }

    geri="$(git -C "$kok" log -1 --format='%b' "$commit" | sed -n 's/^restore-from: //p')"
    [ -z "$geri" ] && { kirmizi "$site: geri dönüş noktası yazılmamış, elle geri al."; return 1; }

    # Sayfaları o revizyondan olduğu gibi geri getir. Aradan başka
    # commit'ler geçmiş olması önemli değil; kaynak sabit.
    local dizin_gore
    dizin_gore="$(sayfa_dizin "$site")"; dizin_gore="${dizin_gore#$kok/}"
    [ "$dizin_gore" = "$kok" ] && dizin_gore="."
    git -C "$kok" checkout "$geri" -- "$dizin_gore" 2>/dev/null || {
        kirmizi "$site: $geri içinden sayfalar alınamadı."; return 1; }

    git -C "$kok" commit -q -m "Put $site back online

Restored from $geri, the revision recorded when it was taken down."
    git -C "$kok" push -q origin main
    yesil "$site geri açıldı."
}

bekle() {
    local site="$1" beklenen="$2" u i govde
    u="$(adres "$site")/?cb=$RANDOM"
    for i in $(seq 1 45); do
        govde="$(curl -s --max-time 10 "$u" || true)"
        if [ "$beklenen" = kapali ] && echo "$govde" | grep -q 'id="nfTitle"'; then
            yesil "$site yayında güncellendi: kapalı."; return 0
        fi
        if [ "$beklenen" = acik ] && ! echo "$govde" | grep -q 'id="nfTitle"'; then
            yesil "$site yayında güncellendi: açık."; return 0
        fi
        sleep 20
    done
    kirmizi "$site: dağıtım beklenenden uzun sürdü, elle kontrol et."
}

komut="${1:-status}"
hedef="${2:-all}"
case "$hedef" in
    all)         siteler="main help" ;;
    main|help)   siteler="$hedef" ;;
    *)           kirmizi "hedef: main | help | all"; exit 1 ;;
esac

case "$komut" in
    down)
        for s in $siteler; do indir "$s"; done
        for s in $siteler; do bekle "$s" kapali; done
        ;;
    up)
        for s in $siteler; do kaldir "$s"; done
        for s in $siteler; do bekle "$s" acik; done
        ;;
    status)
        for s in main help; do
            printf '%-6s %-8s %s\n' "$s" "$(durum_oku "$s")" "$(adres "$s")"
        done
        ;;
    *)
        echo "kullanım: tools/site.sh {down|up|status} [main|help|all]"
        exit 1
        ;;
esac
