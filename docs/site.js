/* ==============================================================
   Parallax Launcher — the page's two moving parts
   ==============================================================
   A sky that answers the pointer, and download buttons that ask
   GitHub what the current release is rather than being told at the
   time the page was written. A version number typed into a landing
   page is wrong the day after the next release, and nobody notices
   until somebody downloads the wrong thing.
   ============================================================== */

(function () {
    'use strict';

    const REPO = 'ArdaYalinOzkan/parallax-launcher';

    /* ---- the sky ---------------------------------------------- */

    const W = 2400, H = 1400;

    /** A field of stars as an SVG data URI. */
    function starLayer(count, rMin, rMax, oMin, oMax) {
        let s = '';
        for (let i = 0; i < count; i++) {
            const x = (Math.random() * W).toFixed(1);
            const y = (Math.random() * H).toFixed(1);
            const r = (rMin + Math.random() * (rMax - rMin)).toFixed(2);
            const o = (oMin + Math.random() * (oMax - oMin)).toFixed(2);
            // A few run warm and a few run cold. A monochrome field
            // reads as noise rather than as sky.
            const t = Math.random();
            const fill = t > 0.93 ? '#FFE6C4' : (t > 0.82 ? '#CFE0FF' : '#FFFFFF');
            s += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${o}"/>`;
        }
        const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${s}</svg>`;
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }

    function grain() {
        const svg = '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">' +
            '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="3" ' +
            'stitchTiles="stitch"/></filter><rect width="200" height="200" filter="url(#n)"/></svg>';
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }

    const far = document.getElementById('skyFar');
    const near = document.getElementById('skyNear');
    const haze = document.querySelector('.sky__haze');
    const noise = document.getElementById('skyGrain');

    if (far && near) {
        far.style.backgroundImage = starLayer(340, 0.4, 0.95, 0.16, 0.5);
        near.style.backgroundImage = starLayer(95, 0.9, 1.7, 0.4, 0.95);
        for (const el of [far, near]) {
            el.style.backgroundSize = W + 'px ' + H + 'px';
            el.style.backgroundPosition = 'center';
            el.style.backgroundRepeat = 'no-repeat';
        }
    }
    if (noise) noise.style.backgroundImage = grain();

    // Travel in pixels at the edge of the window. The star fields move
    // AGAINST the pointer and the near one further than the far one —
    // that is what depth looks like from a viewpoint that shifts. The
    // haze moves with it instead, as though it were a light you carry.
    const LAYERS = [
        { el: haze, depth: 24, sign: 1 },
        { el: far, depth: 9, sign: -1 },
        { el: near, depth: 30, sign: -1 }
    ].filter(l => l.el);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let tx = 0, ty = 0, cx = 0, cy = 0, running = false;

    function frame() {
        cx += (tx - cx) * 0.075;
        cy += (ty - cy) * 0.075;
        for (const { el, depth, sign } of LAYERS) {
            el.style.transform =
                `translate3d(${(sign * cx * depth).toFixed(2)}px, ${(sign * cy * depth).toFixed(2)}px, 0)`;
        }
        if (Math.abs(tx - cx) < 0.0005 && Math.abs(ty - cy) < 0.0005) { running = false; return; }
        requestAnimationFrame(frame);
    }

    function kick() {
        if (running || reduced.matches) return;
        running = true;
        requestAnimationFrame(frame);
    }

    window.addEventListener('pointermove', (e) => {
        tx = (e.clientX / window.innerWidth) * 2 - 1;
        ty = (e.clientY / window.innerHeight) * 2 - 1;
        kick();
    }, { passive: true });

    window.addEventListener('pointerleave', () => { tx = 0; ty = 0; kick(); });

    /* ---- the release ------------------------------------------ */

    const MB = (n) => (n / 1048576).toFixed(0) + ' MB';

    function set(id, text) {
        const el = document.getElementById(id);
        if (el && text) el.textContent = text;
    }

    function link(id, url) {
        const el = document.getElementById(id);
        if (el && url) el.href = url;
    }

    async function loadRelease() {
        try {
            const r = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
                headers: { Accept: 'application/vnd.github+json' }
            });
            // No releases yet, or a rate limit. Either way the buttons
            // already point at the releases page, which is the right
            // place to land — so there is nothing to correct.
            if (!r.ok) return;
            const rel = await r.json();

            const version = String(rel.tag_name || '').replace(/^v/, '');
            const assets = rel.assets || [];
            const find = (ext) => assets.find(a => a.name.toLowerCase().endsWith(ext));

            const appImage = find('.appimage');
            const deb = find('.deb');
            const win = find('.exe');

            if (appImage) {
                link('dlAppImage', appImage.browser_download_url);
                set('sizeAppImage', MB(appImage.size));
            }
            if (deb) {
                link('dlDeb', deb.browser_download_url);
                set('sizeDeb', MB(deb.size));
            }
            if (win) {
                link('dlWin', win.browser_download_url);
                set('sizeWin', MB(win.size));
            }

            // The big button follows whoever is reading. Offering a
            // Linux AppImage to somebody on Windows is a download they
            // would get halfway through before finding out.
            //
            // It goes to the install page rather than straight at the
            // file: that page starts the download itself and then says
            // what to do with it, which the file on its own does not.
            const onWindows = /Windows/i.test(navigator.userAgent);
            const kind = onWindows ? 'Installer' : 'AppImage';

            // Written by hand rather than through data-i18n, because which
            // of the two it says depends on the reader's system. Marked so
            // a language change can redraw it — see the listener below.
            const primary = document.getElementById('dlPrimaryLabel');
            if (primary) primary.dataset.i18n = onWindows ? 'BTN_WIN' : 'BTN_DL_LINUX';
            set('dlPrimaryLabel', window.parallaxI18n
                ? window.parallaxI18n.t(onWindows ? 'BTN_WIN' : 'BTN_DL_LINUX')
                : (onWindows ? 'Download for Windows' : 'Download for Linux'));
            if (version) set('dlVersion', 'v' + version + ' · ' + kind);
        } catch (e) {
            /* Offline, blocked, or GitHub having a moment. The page was
               already correct before this ran; leave it alone. */
        }
    }

    loadRelease();

    /* ---- screenshots not in yet -------------------------------
       A missing screenshot should not leave a broken image icon in
       the middle of the page. Each slot falls back to a drawn panel
       of the right shape, labelled with what belongs there — so the
       layout is already final and dropping the file in is the only
       remaining step.
       ------------------------------------------------------------ */
    function emptySlot(img) {
        const slot = document.createElement('div');
        slot.className = 'shot--empty';
        const label = document.createElement('span');
        label.textContent = img.dataset.slot || 'Screenshot';
        slot.appendChild(label);
        img.replaceWith(slot);
    }

    document.querySelectorAll('img[data-shot]').forEach(img => {
        // The listener alone is not enough. This script runs at the end
        // of the body, by which time an image that was never going to
        // load has already failed and fired its error — with nobody
        // listening. So the finished-and-empty case is checked outright,
        // and the listener covers only the ones still in flight.
        if (img.complete) {
            if (!img.naturalWidth) emptySlot(img);
            return;
        }
        img.addEventListener('error', () => emptySlot(img), { once: true });
    });

    /* ---- download feedback -------------------------------------
       A browser gives no sign that a 120 MB file has begun; the page
       just sits there, and the natural reading is that the button did
       nothing. So the button says what is happening and, after a few
       seconds, offers to try again — because sometimes it really did
       not start, and the honest answer is to make retrying easy rather
       than to insist everything is fine.
       ------------------------------------------------------------ */
    document.querySelectorAll('a.btn[id^="dl"]:not(#dlPrimary)').forEach(btn => {
        btn.addEventListener('click', () => {
            if (btn.dataset.busy === '1') return;
            btn.dataset.busy = '1';

            // The label is its own element on the primary button and a
            // bare text node elsewhere; the size chip must not be touched.
            const meta = btn.querySelector('.btn__meta');
            const label = btn.querySelector('span:not(.btn__meta)');
            const textNode = label ? null :
                [...btn.childNodes].find(n => n.nodeType === 3 && n.textContent.trim());

            const original = label ? label.textContent
                : (textNode ? textNode.textContent : '');
            const write = (t) => {
                if (label) label.textContent = t;
                else if (textNode) textNode.textContent = t + ' ';
            };

            const say = k => (window.parallaxI18n ? window.parallaxI18n.t(k) : null);
            write(say('DL_STARTING') || 'Starting the download…');
            if (meta) meta.style.opacity = '.4';

            setTimeout(() => {
                write(say('DL_RETRY') || 'Not started? Click again');
                btn.classList.add('btn--retry');
            }, 4500);

            setTimeout(() => {
                write(original);
                btn.classList.remove('btn--retry');
                if (meta) meta.style.opacity = '';
                btn.dataset.busy = '0';
            }, 15000);
        });
    });
})();

/* Copying the removal commands.

   Three lines nobody wants to select by hand. The clipboard API needs a
   secure context, which the site has; where it is refused anyway the
   button says so rather than pretending it worked, and the text is
   still there to select. */
(() => {
    document.querySelectorAll('[data-copy]').forEach(btn => {
        const block = btn.closest('.snippet');
        const code = block && block.querySelector('code');
        if (!code) return;

        const phrase = k => (window.parallaxI18n ? window.parallaxI18n.t(k) : null);
        let timer;
        const say = (text, ok) => {
            btn.textContent = text;
            btn.dataset.done = ok ? '1' : '0';
            clearTimeout(timer);
            timer = setTimeout(() => {
                btn.textContent = phrase('COPY') || 'Copy';
                btn.dataset.done = '0';
            }, 1800);
        };

        btn.addEventListener('click', async () => {
            try {
                await navigator.clipboard.writeText(code.textContent);
                say(phrase('COPIED') || 'Copied', true);
            } catch {
                say(phrase('COPY_FAIL') || 'Select it', false);
            }
        });
    });
})();

/* When the language changes, the two labels that scripts wrote rather
   than the table — the big button, and whatever a copy button is
   currently saying — are drawn again. Everything else the engine has
   already replaced by the time this fires. */
document.addEventListener('parallax:lang', (e) => {
    const t = e.detail.table;

    const primary = document.getElementById('dlPrimaryLabel');
    if (primary && primary.dataset.i18n && t[primary.dataset.i18n]) {
        primary.textContent = t[primary.dataset.i18n];
    }

    document.querySelectorAll('[data-copy]').forEach(btn => {
        if (btn.dataset.done !== '1') btn.textContent = t.COPY;
    });
});
