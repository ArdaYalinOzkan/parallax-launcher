/* ==============================================================
   PARALLAX — ATMOSPHERE
   ==============================================================
   Builds the background the app is named after.

   Parallax is how you measure the distance to a star: you look at
   it from two places and see how far it appears to move. Close
   things shift a lot, distant things barely at all. So the sky
   here is built in depth layers, and they shift by different
   amounts as the cursor moves across the window.

   Everything is generated in code — no image files ship with it.
   The sky is reseeded on every launch, so the arrangement is new
   each time you open the app; the two star layers share the run's
   seed so they stay a coherent field rather than two unrelated ones.

   Stars belong to the gateway only. Over the library they compete
   with 200-odd pieces of cover art, so `body[data-screen]` fades
   them out there and the ambient wash carries the background alone.
   ============================================================== */

(function () {
    'use strict';

    // ---- deterministic RNG so the sky never changes -----------
    function rng(seed) {
        let s = seed >>> 0;
        return function () {
            s = (s * 1664525 + 1013904223) >>> 0;
            return s / 4294967296;
        };
    }

    const SKY_W = 2560;
    const SKY_H = 1440;

    /**
     * One depth layer of stars, as an SVG data URI.
     * @param {number} seed   fixed, so the layer is reproducible
     * @param {number} count  how many stars
     * @param {number} rMin   smallest radius
     * @param {number} rMax   largest radius
     * @param {number} oMin   dimmest opacity
     * @param {number} oMax   brightest opacity
     */
    function starLayer(seed, count, rMin, rMax, oMin, oMax) {
        const rand = rng(seed);
        let stars = '';

        for (let i = 0; i < count; i++) {
            const x = (rand() * SKY_W).toFixed(1);
            const y = (rand() * SKY_H).toFixed(1);
            const r = (rMin + rand() * (rMax - rMin)).toFixed(2);
            const o = (oMin + rand() * (oMax - oMin)).toFixed(2);

            // A few stars run warm, most run cold. Real starfields
            // are not monochrome, and the variation stops the
            // layer reading as noise.
            const t = rand();
            const fill = t > 0.93 ? '#FFE6C4' : (t > 0.82 ? '#CFE0FF' : '#FFFFFF');

            stars += `<circle cx="${x}" cy="${y}" r="${r}" fill="${fill}" opacity="${o}"/>`;
        }

        const svg =
            `<svg xmlns="http://www.w3.org/2000/svg" width="${SKY_W}" height="${SKY_H}" ` +
            `viewBox="0 0 ${SKY_W} ${SKY_H}">${stars}</svg>`;

        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }

    /* Film grain. Dark gradients band into visible steps on 8-bit
       panels; a little noise dithers them away. */
    function grain() {
        const svg =
            '<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220">' +
            '<filter id="n"><feTurbulence type="fractalNoise" baseFrequency="0.85" ' +
            'numOctaves="3" stitchTiles="stitch"/></filter>' +
            '<rect width="220" height="220" filter="url(#n)"/></svg>';
        return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
    }

    // ---- build the DOM ----------------------------------------
    const sky = document.createElement('div');
    sky.className = 'sky';
    sky.setAttribute('aria-hidden', 'true');

    const haze = document.createElement('div');
    haze.className = 'sky__layer sky__haze';

    const far = document.createElement('div');
    far.className = 'sky__layer sky__far';
    // A fresh sky per launch. Both layers derive from one seed so they
    // read as a single field seen at two depths.
    const SKY_SEED = (Date.now() ^ (Math.random() * 0xffffffff)) >>> 0;
    far.style.backgroundImage = starLayer(SKY_SEED, 320, 0.4, 0.95, 0.18, 0.55);

    const near = document.createElement('div');
    near.className = 'sky__layer sky__near';
    near.style.backgroundImage = starLayer((SKY_SEED * 2654435761) >>> 0, 90, 0.9, 1.7, 0.45, 1.0);

    for (const el of [far, near]) {
        el.style.backgroundSize = SKY_W + 'px ' + SKY_H + 'px';
        el.style.backgroundPosition = 'center';
        el.style.backgroundRepeat = 'no-repeat';
    }

    const noise = document.createElement('div');
    noise.className = 'sky__grain';
    noise.style.backgroundImage = grain();

    sky.append(haze, far, near, noise);
    document.body.insertBefore(sky, document.body.firstChild);

    // ---- the displacement -------------------------------------
    // Travel in pixels at the edge of the window.
    //
    // The two star fields move AGAINST the pointer, near one further
    // than far one — that is what parallax looks like from a moving
    // viewpoint. The aurora moves WITH it instead, as though it were
    // a light source you are carrying. Splitting the directions is
    // what sells the depth; when everything slid the same way it just
    // looked like the whole image was sliding.
    const LAYERS = [
        { el: haze, depth: 26, sign: 1 },
        { el: far, depth: 8, sign: -1 },
        { el: near, depth: 30, sign: -1 }
    ];

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    let targetX = 0, targetY = 0;   // -1 .. 1
    let currentX = 0, currentY = 0;
    let ticking = false;

    function frame() {
        // ease toward the pointer rather than tracking it exactly,
        // so the sky feels heavy instead of twitchy
        currentX += (targetX - currentX) * 0.085;
        currentY += (targetY - currentY) * 0.085;

        for (const { el, depth, sign } of LAYERS) {
            el.style.transform =
                `translate3d(${(sign * currentX * depth).toFixed(2)}px, ${(sign * currentY * depth).toFixed(2)}px, 0)`;
        }

        // stop the loop once it has effectively settled
        if (Math.abs(targetX - currentX) < 0.0005 && Math.abs(targetY - currentY) < 0.0005) {
            ticking = false;
            return;
        }
        requestAnimationFrame(frame);
    }

    function kick() {
        if (ticking || reduced.matches) return;
        ticking = true;
        requestAnimationFrame(frame);
    }

    window.addEventListener('pointermove', (e) => {
        targetX = (e.clientX / window.innerWidth) * 2 - 1;
        targetY = (e.clientY / window.innerHeight) * 2 - 1;
        kick();
    }, { passive: true });

    // drift back to centre when the pointer leaves the window
    window.addEventListener('pointerleave', () => {
        targetX = 0;
        targetY = 0;
        kick();
    });

    reduced.addEventListener('change', () => {
        if (reduced.matches) {
            for (const { el } of LAYERS) el.style.transform = '';
        }
    });


    /* ----------------------------------------------------------
       CLOSE RANGE
       The sky is the far end of the depth range. A card under the
       cursor is the near end, and it gets the same treatment: the
       card tilts, so you see the cover from a shifted viewpoint —
       which is what the word parallax means. The artwork itself is
       never moved or scaled, only the surface it is printed on.

       One delegated listener, because the grid rebuilds its cards
       on every filter keystroke and per-card listeners would leak.
       ---------------------------------------------------------- */

    const TRACKED = '.game-card, .account-card, .igdb-result-card';
    let hovered = null;
    let pending = null;
    let queued = false;

    // Maximum tilt, in degrees, reached at the edge of either axis.
    const TILT = 9;

    function paint() {
        queued = false;
        if (!hovered || !pending) return;

        // Each axis is measured against its own half-extent — its
        // radius — not against the card's overall size. That matters
        // because a cover is half as wide as it is tall: measured any
        // other way, running the pointer to the side edge would tilt
        // the card less than running it to the top, even though both
        // are "all the way out". Now either extreme reaches the same
        // angle, and the corners combine the two.
        const ax = clamp((pending.x - 0.5) * 2, -1, 1);
        const ay = clamp((pending.y - 0.5) * 2, -1, 1);

        // Right of centre leans the right edge away; low brings the
        // bottom edge toward you. Getting these signs backwards makes
        // the card feel subtly repellent without anyone being able to
        // say why.
        hovered.style.setProperty('--mx', pending.x.toFixed(3));
        hovered.style.setProperty('--my', pending.y.toFixed(3));
        hovered.style.setProperty('--rx', (-ay * TILT).toFixed(2) + 'deg');
        hovered.style.setProperty('--ry', (ax * TILT).toFixed(2) + 'deg');
    }

    function clamp(v, lo, hi) {
        return v < lo ? lo : (v > hi ? hi : v);
    }

    function release(el) {
        if (!el) return;
        el.style.removeProperty('--mx');
        el.style.removeProperty('--my');
        el.style.removeProperty('--rx');
        el.style.removeProperty('--ry');
    }

    document.addEventListener('pointermove', (e) => {
        if (reduced.matches) return;

        const card = e.target.closest ? e.target.closest(TRACKED) : null;

        if (card !== hovered) {
            release(hovered);
            hovered = card;
        }
        if (!card) return;

        const r = card.getBoundingClientRect();
        pending = {
            x: Math.min(1, Math.max(0, (e.clientX - r.left) / r.width)),
            y: Math.min(1, Math.max(0, (e.clientY - r.top) / r.height))
        };

        if (!queued) {
            queued = true;
            requestAnimationFrame(paint);
        }
    }, { passive: true });

    // The grid re-renders under the cursor often enough that a
    // detached card would otherwise keep its last highlight.
    document.addEventListener('pointerleave', () => {
        release(hovered);
        hovered = null;
    }, true);
})();
