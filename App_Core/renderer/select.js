/* ==============================================================
   SELECT
   ==============================================================
   A dropdown the app can actually style.

   A native <select> renders its open list with the operating
   system's own widget. Nothing in CSS reaches inside it, so the
   button could be shaped to match the design while the list that
   dropped out of it stayed a grey system menu with a blue
   highlight — the one part of the app that never belonged to it.

   So the native element stays exactly where it is, keeps its
   value, and keeps firing `change`; every piece of code that reads
   `select.value` or listens for changes is untouched. It is simply
   made invisible, and a real list is drawn in its place.

   Every <select> in the app is upgraded automatically, including
   ones whose options arrive later.
   ============================================================== */

(function () {
    'use strict';

    const upgraded = new WeakSet();
    let openMenu = null;

    /* ---------------------------------------------------------- */

    function closeOpen() {
        if (!openMenu) return;
        openMenu.menu.remove();
        openMenu.trigger.setAttribute('aria-expanded', 'false');
        openMenu.trigger.classList.remove('is-open');
        openMenu = null;
    }

    /**
     * Places the list against its trigger, flipping above when there
     * is not enough room below. Fixed positioning, because the
     * trigger often sits inside something that scrolls or clips.
     */
    function place(menu, trigger) {
        const r = trigger.getBoundingClientRect();
        const margin = 6;

        menu.style.minWidth = `${r.width}px`;
        menu.style.left = `${r.left}px`;

        const room = window.innerHeight - r.bottom - margin;
        const height = menu.offsetHeight;

        if (height > room && r.top > room) {
            menu.style.top = `${Math.max(margin, r.top - height - margin)}px`;
            menu.classList.add('is-above');
        } else {
            menu.style.top = `${r.bottom + margin}px`;
            menu.classList.remove('is-above');
        }

        // Keep it on screen horizontally.
        const overflowRight = (r.left + menu.offsetWidth) - (window.innerWidth - margin);
        if (overflowRight > 0) menu.style.left = `${Math.max(margin, r.left - overflowRight)}px`;
    }

    function openFor(select, trigger) {
        closeOpen();

        const menu = document.createElement('div');
        menu.className = 'sel-menu';
        menu.setAttribute('role', 'listbox');

        [...select.options].forEach((opt, i) => {
            const item = document.createElement('div');
            item.className = 'sel-option';
            item.setAttribute('role', 'option');
            item.textContent = opt.textContent;
            item.dataset.index = String(i);

            if (opt.disabled) item.classList.add('is-disabled');
            if (i === select.selectedIndex) {
                item.classList.add('is-selected');
                item.setAttribute('aria-selected', 'true');
            }

            item.addEventListener('mouseenter', () => highlight(menu, i));
            item.addEventListener('click', () => {
                if (opt.disabled) return;
                choose(select, trigger, i);
            });
            menu.appendChild(item);
        });

        document.body.appendChild(menu);
        place(menu, trigger);

        trigger.setAttribute('aria-expanded', 'true');
        trigger.classList.add('is-open');
        openMenu = { menu, trigger, select, active: select.selectedIndex };

        highlight(menu, select.selectedIndex);
        const sel = menu.querySelector('.is-active');
        if (sel) sel.scrollIntoView({ block: 'nearest' });
    }

    function highlight(menu, index) {
        menu.querySelectorAll('.sel-option').forEach(el => {
            el.classList.toggle('is-active', Number(el.dataset.index) === index);
        });
        if (openMenu) openMenu.active = index;
    }

    function choose(select, trigger, index) {
        if (index < 0 || index >= select.options.length) return;
        const changed = select.selectedIndex !== index;
        select.selectedIndex = index;
        syncLabel(select, trigger);
        closeOpen();
        trigger.focus();
        // Only announce a real change, matching what a native select does.
        if (changed) select.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function syncLabel(select, trigger) {
        const opt = select.options[select.selectedIndex];
        const label = trigger.querySelector('.sel-label');
        if (label) label.textContent = opt ? opt.textContent : '';
        trigger.classList.toggle('is-empty', !opt);
    }

    /* ---------------------------------------------------------- */

    function upgrade(select) {
        if (upgraded.has(select) || select.multiple || select.dataset.noSkin === 'true') return;
        upgraded.add(select);

        const wrap = document.createElement('div');
        wrap.className = 'sel';

        const trigger = document.createElement('button');
        trigger.type = 'button';
        trigger.className = 'sel-trigger';
        trigger.setAttribute('aria-haspopup', 'listbox');
        trigger.setAttribute('aria-expanded', 'false');
        // Carry the original's classes so existing sizing rules apply.
        select.classList.forEach(c => trigger.classList.add(c));
        trigger.innerHTML = '<span class="sel-label"></span>' +
            '<svg class="sel-chevron" viewBox="0 0 12 8" aria-hidden="true">' +
            '<path d="M1 1.5L6 6.5L11 1.5" fill="none" stroke="currentColor" ' +
            'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

        select.parentNode.insertBefore(wrap, select);
        wrap.appendChild(select);
        wrap.appendChild(trigger);
        select.classList.add('sel-native');
        if (select.disabled) trigger.disabled = true;

        syncLabel(select, trigger);

        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            if (trigger.disabled) return;
            if (openMenu && openMenu.trigger === trigger) closeOpen();
            else openFor(select, trigger);
        });

        trigger.addEventListener('keydown', (e) => {
            const isOpen = openMenu && openMenu.trigger === trigger;

            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                if (isOpen) choose(select, trigger, openMenu.active);
                else openFor(select, trigger);
                return;
            }
            if (e.key === 'Escape' && isOpen) { e.preventDefault(); closeOpen(); trigger.focus(); return; }

            if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
                e.preventDefault();
                const step = e.key === 'ArrowDown' ? 1 : -1;
                if (!isOpen) { openFor(select, trigger); return; }
                let next = openMenu.active;
                for (let i = 0; i < select.options.length; i++) {
                    next = (next + step + select.options.length) % select.options.length;
                    if (!select.options[next].disabled) break;
                }
                highlight(openMenu.menu, next);
                const el = openMenu.menu.querySelector('.is-active');
                if (el) el.scrollIntoView({ block: 'nearest' });
                return;
            }

            // Type-ahead, the way a native select behaves.
            if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
                const ch = e.key.toLowerCase();
                const start = (isOpen ? openMenu.active : select.selectedIndex) + 1;
                for (let i = 0; i < select.options.length; i++) {
                    const idx = (start + i) % select.options.length;
                    const opt = select.options[idx];
                    if (!opt.disabled && opt.textContent.trim().toLowerCase().startsWith(ch)) {
                        if (isOpen) highlight(openMenu.menu, idx);
                        else choose(select, trigger, idx);
                        break;
                    }
                }
            }
        });

        // Code elsewhere sets `.value` directly (loading settings, for
        // one), which fires no event — so watch the element itself.
        select.addEventListener('change', () => syncLabel(select, trigger));
        // `characterData` matters as much as the rest: switching
        // language rewrites each option's text in place, which is not
        // a child or attribute change, and the label would otherwise
        // keep showing the previous language until something else
        // happened to refresh it.
        new MutationObserver(() => {
            syncLabel(select, trigger);
            trigger.disabled = select.disabled;
        }).observe(select, {
            childList: true, attributes: true, subtree: true, characterData: true
        });

        // A value assigned in script raises nothing at all; poll the
        // label back into agreement whenever the menu is not open.
        select._selSync = () => syncLabel(select, trigger);
    }

    function upgradeAll(root) {
        (root || document).querySelectorAll('select:not(.sel-native)').forEach(upgrade);
    }

    /* ---------------------------------------------------------- */

    document.addEventListener('click', closeOpen);
    window.addEventListener('resize', closeOpen);
    window.addEventListener('blur', closeOpen);
    document.addEventListener('scroll', closeOpen, true);
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeOpen(); });

    // Selects are created as screens are built, so keep watching.
    new MutationObserver(() => upgradeAll()).observe(document.documentElement, {
        childList: true, subtree: true
    });

    // Values are also assigned in script without any event. A cheap
    // sweep keeps every label honest without each caller remembering.
    setInterval(() => {
        if (openMenu) return;
        document.querySelectorAll('select.sel-native').forEach(s => s._selSync && s._selSync());
    }, 500);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => upgradeAll());
    } else {
        upgradeAll();
    }
})();
