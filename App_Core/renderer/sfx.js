/* ==============================================================
   SFX — INTERFACE SOUND
   ==============================================================
   Every sound here is synthesised at the moment it plays. Nothing
   is loaded from disk, so the app gains no audio files, no
   licences to track, and no delay the first time a button is
   pressed.

   The palette is deliberately narrow and quiet. Interface sound
   goes wrong in one of two ways: it is too loud, or there is too
   much of it. So the voices are short, they sit high enough not to
   muddy anything, and a low-pass takes the edge off the attack —
   the result should read as a soft tick rather than a beep.

   Off unless the person turns it on, and the setting is theirs to
   change at any time.
   ============================================================== */

window.SFX = (function () {
    'use strict';

    let ctx = null;
    let master = null;
    let noise = null;
    let enabled = false;
    // 0-100, the way it is shown in settings. Full is the default:
    // the voices are written quiet at the source, so the slider is
    // there to bring them DOWN rather than to be found and raised.
    let volume = 100;
    const last = Object.create(null);

    function level() {
        return Math.max(0, Math.min(100, volume)) / 100;
    }

    // Repeats of the SAME voice inside this window collapse into one,
    // which stops a held key or a double-click from stacking into a
    // roar. It is deliberately per voice and not global: a press that
    // also opens a panel is two different sounds arriving together,
    // and swallowing the second would lose the part that says what
    // the press did.

    /* The context cannot be created before a gesture, and creating it
       eagerly leaves a suspended one lying around, so it is built on
       the first sound that actually plays. */
    function ready() {
        if (!enabled) return false;
        if (!ctx) {
            const AC = window.AudioContext || window.webkitAudioContext;
            if (!AC) return false;
            ctx = new AC();

            master = ctx.createGain();
            master.gain.value = level();

            // Takes the glare off the transient. Interface ticks
            // without it sound like a hardware fault.
            const soft = ctx.createBiquadFilter();
            soft.type = 'lowpass';
            soft.frequency.value = 5200;
            soft.Q.value = 0.4;

            master.connect(soft);
            soft.connect(ctx.destination);

            // One second of white noise, reused for every transient.
            const len = Math.floor(ctx.sampleRate * 0.4);
            noise = ctx.createBuffer(1, len, ctx.sampleRate);
            const d = noise.getChannelData(0);
            for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
        }
        if (ctx.state === 'suspended') ctx.resume();
        return true;
    }

    /** One pitched voice: `to` glides from `from` over the decay. */
    function tone({ from, to, dur, type = 'sine', gain = 1, delay = 0 }) {
        const t = ctx.currentTime + delay;
        const osc = ctx.createOscillator();
        const g = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(from, t);
        if (to && to !== from) osc.frequency.exponentialRampToValueAtTime(to, t + dur);

        // A few milliseconds of attack instead of none. A hard start
        // puts a click in front of every sound, which is audible even
        // when the sound itself is meant to be a click.
        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(gain, t + 0.004);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        osc.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + dur + 0.02);
    }

    /** The transient — what makes a tick sound like contact. */
    function tick({ freq = 2400, dur = 0.02, gain = 0.35, delay = 0 } = {}) {
        const t = ctx.currentTime + delay;
        const src = ctx.createBufferSource();
        const bp = ctx.createBiquadFilter();
        const g = ctx.createGain();

        src.buffer = noise;
        src.loop = true;
        bp.type = 'bandpass';
        bp.frequency.value = freq;
        bp.Q.value = 1.6;

        g.gain.setValueAtTime(gain, t);
        g.gain.exponentialRampToValueAtTime(0.0001, t + dur);

        src.connect(bp);
        bp.connect(g);
        g.connect(master);
        src.start(t);
        src.stop(t + dur + 0.02);
    }

    /**
     * The mechanical part of a switch: a knock, then a pitch that
     * jumps rather than glides. `setValueAtTime` twice is what makes
     * it a step; an exponential ramp here would just sound like every
     * other voice.
     */
    function detent(a, b) {
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        const tame = ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.setValueAtTime(a, t);
        osc.frequency.setValueAtTime(b, t + 0.032);

        // A raw square is all upper harmonics and sounds cheap; this
        // takes the top off and leaves the body.
        tame.type = 'lowpass';
        tame.frequency.value = 1900;
        tame.Q.value = 0.7;

        g.gain.setValueAtTime(0.0001, t);
        g.gain.exponentialRampToValueAtTime(0.075, t + 0.004);
        g.gain.setValueAtTime(0.075, t + 0.030);
        g.gain.exponentialRampToValueAtTime(0.0001, t + 0.105);

        osc.connect(tame);
        tame.connect(g);
        g.connect(master);
        osc.start(t);
        osc.stop(t + 0.13);

        // The knock — low and dry, so the switch feels like it has a
        // body rather than being a pure tone.
        tick({ freq: 900, dur: 0.028, gain: 0.26 });
    }

    const VOICES = {
        // Pressing something. The one sound that plays most, so it is
        // the shortest and the quietest of the set.
        tap() {
            tick({ freq: 2600, dur: 0.018, gain: 0.30 });
            tone({ from: 1180, to: 880, dur: 0.045, gain: 0.10 });
        },

        // Choosing a thing rather than pressing a control — a game, an
        // account, a tab. Lands a little lower so the two are telling
        // apart without being thought about.
        select() {
            tick({ freq: 1800, dur: 0.02, gain: 0.22 });
            tone({ from: 760, to: 620, dur: 0.07, type: 'triangle', gain: 0.11 });
        },

        // A switch. This one is built to sound unlike the rest of the
        // set on purpose: where a tap is a smooth sine that slides,
        // a switch is a square wave that STEPS between two pitches
        // with a wooden knock under it. Nothing else here is stepped
        // or square, so a switch is recognisable with your back to
        // the screen — and direction still carries the state.
        toggleOn() {
            detent(430, 660);
        },
        toggleOff() {
            detent(660, 400);
        },

        // A panel arriving and leaving. Longer and softer than a tap,
        // with no transient — nothing was struck, something moved.
        open() {
            tone({ from: 420, to: 720, dur: 0.16, gain: 0.10 });
        },
        close() {
            tone({ from: 700, to: 400, dur: 0.14, gain: 0.08 });
        },

        // Finished. Three notes, quiet enough to be a confirmation
        // rather than a fanfare.
        ok() {
            tone({ from: 660, to: 660, dur: 0.09, type: 'triangle', gain: 0.10 });
            tone({ from: 880, to: 880, dur: 0.09, type: 'triangle', gain: 0.09, delay: 0.055 });
            tone({ from: 1320, to: 1320, dur: 0.13, type: 'triangle', gain: 0.075, delay: 0.11 });
        },

        // Something went wrong. Low and flat, and it does not resolve.
        err() {
            tone({ from: 220, to: 165, dur: 0.20, type: 'triangle', gain: 0.13 });
        }
    };

    const MIN_GAP_MS = { tap: 45, select: 60, open: 120, close: 120, ok: 300, err: 300 };
    const DEFAULT_GAP = 80;

    function play(name) {
        if (!VOICES[name]) return;
        const now = Date.now();
        const gap = MIN_GAP_MS[name] !== undefined ? MIN_GAP_MS[name] : DEFAULT_GAP;
        if (now - (last[name] || 0) < gap) return;
        if (!ready()) return;
        last[name] = now;
        try { VOICES[name](); } catch (e) { /* audio is never worth an exception */ }
    }

    function setEnabled(on) {
        enabled = !!on;
        if (!enabled && ctx && ctx.state === 'running') ctx.suspend();
    }

    function setVolume(v) {
        volume = Number(v);
        if (isNaN(volume)) volume = 100;
        if (master) master.gain.value = level();
    }

    return { play, setEnabled, setVolume, isEnabled: () => enabled, getVolume: () => volume };
})();


/* ==============================================================
   WIRING
   ==============================================================
   The app does not call play() at every site. Almost everything
   worth hearing is already visible in the DOM — a button was
   pressed, a switch moved, a panel stopped being hidden — so it is
   picked up here instead, in one place, and nothing scattered
   through the app has to remember to make a sound.
   ============================================================== */

(function () {
    'use strict';

    const S = window.SFX;
    if (!S) return;

    // Things that are picked rather than pressed. A game, an account,
    // a tab: these get the warmer voice so the two are told apart
    // without anyone having to think about it.
    const PICKED = '.game-card, .account-card, .igdb-result-card, .settings-tab, .sel-option, .theme-swatch';

    // Everything else that can be pressed. Listing the controls by
    // selector was the first attempt and it kept missing things — the
    // profile in the header, for one, is a <div> and got no sound at
    // all. So the test is what the app itself already says about an
    // element: every clickable thing in it sets `cursor: pointer`,
    // and nothing that is not clickable does. That covers controls
    // added later without this list having to know about them.
    const MAX_DEPTH = 6;

    function voiceFor(start) {
        if (start.closest(PICKED)) return 'select';

        let n = start;
        for (let i = 0; n && n !== document.body && i < MAX_DEPTH; i++, n = n.parentElement) {
            // A control that is switched off should sound like
            // nothing, because nothing is what it did.
            if (n.disabled || n.getAttribute('aria-disabled') === 'true') return null;
            if (n.tagName === 'BUTTON' || n.tagName === 'A') return 'tap';
            if (getComputedStyle(n).cursor === 'pointer') return 'tap';
        }
        return null;
    }

    document.addEventListener('click', (e) => {
        const el = e.target instanceof Element ? e.target : null;
        if (!el) return;
        // A switch is handled by its `change` event, which knows which
        // way it went; catching the click too would double it.
        if (el.closest('.toggle-switch')) return;
        const voice = voiceFor(el);
        if (voice) S.play(voice);
    }, true);

    document.addEventListener('change', (e) => {
        const el = e.target;
        if (!(el instanceof HTMLInputElement) || el.type !== 'checkbox') return;
        // The sound setting's own switch speaks for itself in app.js —
        // it has to, since it is the thing being turned on.
        if (el.id === 'settingUiSounds') return;
        S.play(el.checked ? 'toggleOn' : 'toggleOff');
    }, true);

    // Panels. `hidden` is the one class every modal in the app uses to
    // come and go, so watching it covers all of them at once — including
    // any added later, which is why the observer is on the whole tree
    // rather than on a list of modals collected at startup.
    const shown = new WeakSet();

    function watch(el) {
        if (!el.classList.contains('hidden')) shown.add(el);
    }

    new MutationObserver((records) => {
        for (const r of records) {
            if (r.type === 'childList') {
                r.addedNodes.forEach(n => {
                    if (n instanceof Element && n.classList.contains('modal')) watch(n);
                });
                continue;
            }
            const el = r.target;
            if (!(el instanceof Element) || !el.classList.contains('modal')) continue;
            const open = !el.classList.contains('hidden');
            if (open && !shown.has(el)) { shown.add(el); S.play('open'); }
            else if (!open && shown.has(el)) { shown.delete(el); S.play('close'); }
        }
    }).observe(document.documentElement, {
        subtree: true, childList: true,
        attributes: true, attributeFilter: ['class']
    });

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded',
            () => document.querySelectorAll('.modal').forEach(watch));
    } else {
        document.querySelectorAll('.modal').forEach(watch);
    }
})();
