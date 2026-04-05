import { getEntry } from '../../content/archive.js';
import { getBundle } from '../../i18n/bundles.js';
import { getState, subscribe } from '../state.js';

/**
 * @param {HTMLElement} root
 * @param {{ onClose: () => void }} opts
 */
export function mountDetailPanel(root, opts) {
  root.classList.add('min-h-[200px]');

  root.innerHTML = `
    <div
      class="pointer-events-none invisible flex h-full min-h-[40vh] flex-col border-apz-line opacity-0 transition-[opacity,visibility] duration-300 lg:border-l lg:pl-6"
      data-panel
      aria-live="polite"
    >
      <div class="pointer-events-auto flex flex-1 flex-col rounded-2xl border border-apz-line bg-apz-surface/90 p-5 shadow-[0_0_40px_rgba(60,255,154,0.06)] backdrop-blur-md">
        <div class="mb-4 flex items-start justify-between gap-3">
          <div>
            <p class="text-[10px] uppercase tracking-[0.35em] text-apz-muted" data-panel-kicker></p>
            <h2 class="font-display mt-1 text-xl font-bold leading-tight text-apz-ink md:text-2xl" tabindex="-1" data-title></h2>
            <p class="mt-1 font-mono text-xs text-apz-glow" data-date></p>
          </div>
          <button
            type="button"
            class="shrink-0 rounded-lg border border-apz-line px-2 py-1 text-xs text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent"
            data-close
          ></button>
        </div>
        <p class="text-sm leading-relaxed text-apz-muted" data-excerpt></p>
        <div class="my-4 h-px w-full bg-apz-line"></div>
        <div class="flex-1 overflow-y-auto text-sm leading-relaxed text-apz-ink/95" data-body></div>
        <p class="mt-4 text-[11px] text-apz-muted" data-related></p>
      </div>
    </div>
  `;

  const wrap = /** @type {HTMLElement} */ (root.querySelector('[data-panel]'));
  const kickerEl = root.querySelector('[data-panel-kicker]');
  const titleEl = root.querySelector('[data-title]');
  const dateEl = root.querySelector('[data-date]');
  const excerptEl = root.querySelector('[data-excerpt]');
  const bodyEl = root.querySelector('[data-body]');
  const relatedEl = root.querySelector('[data-related]');
  const closeBtn = /** @type {HTMLButtonElement | null} */ (root.querySelector('[data-close]'));

  let hadEntry = false;
  /** @type {HTMLElement | null} */
  let restoreFocusEl = null;

  function restorePreviousFocus() {
    const el = restoreFocusEl;
    restoreFocusEl = null;
    requestAnimationFrame(() => {
      if (el && document.contains(el)) el.focus();
    });
  }

  function render() {
    const ui = getBundle(getState().locale).ui;
    if (kickerEl) kickerEl.textContent = ui.panelKicker;
    if (closeBtn) {
      closeBtn.textContent = ui.close;
      closeBtn.setAttribute('aria-label', ui.closeAria);
    }

    const { selectedId } = getState();
    const entry = selectedId ? getEntry(selectedId) : null;

    if (!entry) {
      if (hadEntry) restorePreviousFocus();
      hadEntry = false;
      root.classList.add('hidden', 'lg:hidden');
      wrap.classList.add('invisible', 'opacity-0', 'pointer-events-none');
      wrap.classList.remove('apz-panel-enter');
      if (titleEl) titleEl.textContent = '';
      if (dateEl) dateEl.textContent = '';
      if (excerptEl) excerptEl.textContent = '';
      if (bodyEl) bodyEl.textContent = '';
      if (relatedEl) relatedEl.textContent = '';
      return;
    }

    const opening = !hadEntry;
    hadEntry = true;

    root.classList.remove('hidden', 'lg:hidden');

    wrap.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
    wrap.classList.remove('apz-panel-enter');
    // reflow trick to restart animation
    void wrap.offsetWidth;
    if (!document.documentElement.classList.contains('reduce-motion')) {
      wrap.classList.add('apz-panel-enter');
    }

    if (titleEl) titleEl.textContent = entry.title;
    if (dateEl) dateEl.textContent = entry.date;
    if (excerptEl) excerptEl.textContent = entry.excerpt;
    if (bodyEl) bodyEl.textContent = entry.body;

    const related = entry.relatedIds
      .map((id) => getEntry(id))
      .filter(Boolean)
      .map((e) => e.title);
    if (relatedEl) {
      relatedEl.textContent =
        related.length > 0 ? `${ui.relatedPrefix}${related.join(' · ')}` : ui.noRelated;
    }

    if (opening) {
      const active = document.activeElement;
      restoreFocusEl =
        active instanceof HTMLElement && active !== document.body ? active : null;
      const title = /** @type {HTMLElement | null} */ (titleEl);
      requestAnimationFrame(() => title?.focus());
    }
  }

  function handleClose() {
    opts.onClose();
  }

  closeBtn?.addEventListener('click', handleClose);

  const unsub = subscribe(render);
  render();

  return {
    destroy() {
      closeBtn?.removeEventListener('click', handleClose);
      unsub();
      root.classList.remove('min-h-[200px]', 'hidden', 'lg:hidden');
      root.innerHTML = '';
    },
  };
}
