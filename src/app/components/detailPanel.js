import { getEntry } from '../../content/archive.js';
import { getBundle } from '../../i18n/bundles.js';
import { getState, subscribe } from '../state.js';

/**
 * @param {HTMLElement} root
 * @param {{ onClose: () => void }} opts
 */
export function mountDetailPanel(root, opts) {
  root.classList.add('min-h-[200px]');

  root.replaceChildren();

  const wrap = document.createElement('div');
  wrap.setAttribute('data-panel', '');
  wrap.className =
    'pointer-events-none invisible flex h-full min-h-[40vh] flex-col border-apz-line opacity-0 transition-[opacity,visibility] duration-300 lg:border-l lg:pl-6';
  wrap.setAttribute('aria-live', 'polite');

  const inner = document.createElement('div');
  inner.className =
    'pointer-events-auto flex flex-1 flex-col rounded-2xl border border-apz-line bg-apz-surface/90 p-5 shadow-[0_0_40px_rgba(60,255,154,0.06)] backdrop-blur-md';

  const headerRow = document.createElement('div');
  headerRow.className = 'mb-4 flex items-start justify-between gap-3';

  const leftCol = document.createElement('div');

  const kickerEl = document.createElement('p');
  kickerEl.className = 'text-[10px] uppercase tracking-[0.35em] text-apz-muted';
  kickerEl.setAttribute('data-panel-kicker', '');

  const titleEl = document.createElement('h2');
  titleEl.className =
    'font-display mt-1 text-xl font-bold leading-tight text-apz-ink md:text-2xl';
  titleEl.tabIndex = -1;
  titleEl.setAttribute('data-title', '');

  const dateEl = document.createElement('p');
  dateEl.className = 'mt-1 font-mono text-xs text-apz-glow';
  dateEl.setAttribute('data-date', '');

  leftCol.append(kickerEl, titleEl, dateEl);

  const closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className =
    'shrink-0 rounded-lg border border-apz-line px-2 py-1 text-xs text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent';
  closeBtn.setAttribute('data-close', '');

  headerRow.append(leftCol, closeBtn);

  const excerptEl = document.createElement('p');
  excerptEl.className = 'text-sm leading-relaxed text-apz-muted';
  excerptEl.setAttribute('data-excerpt', '');

  const rule = document.createElement('div');
  rule.className = 'my-4 h-px w-full bg-apz-line';

  const bodyEl = document.createElement('div');
  bodyEl.className =
    'flex-1 overflow-y-auto text-sm leading-relaxed text-apz-ink/95';
  bodyEl.setAttribute('data-body', '');

  const relatedEl = document.createElement('p');
  relatedEl.className = 'mt-4 text-[11px] text-apz-muted';
  relatedEl.setAttribute('data-related', '');

  inner.append(headerRow, excerptEl, rule, bodyEl, relatedEl);
  wrap.append(inner);
  root.append(wrap);

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
    kickerEl.textContent = ui.panelKicker;
    closeBtn.textContent = ui.close;
    closeBtn.setAttribute('aria-label', ui.closeAria);

    const { selectedId } = getState();
    const entry = selectedId ? getEntry(selectedId) : null;

    if (!entry) {
      if (hadEntry) restorePreviousFocus();
      hadEntry = false;
      root.classList.add('hidden', 'lg:hidden');
      wrap.classList.add('invisible', 'opacity-0', 'pointer-events-none');
      wrap.classList.remove('apz-panel-enter');
      titleEl.textContent = '';
      dateEl.textContent = '';
      excerptEl.textContent = '';
      bodyEl.textContent = '';
      relatedEl.textContent = '';
      return;
    }

    const opening = !hadEntry;
    hadEntry = true;

    root.classList.remove('hidden', 'lg:hidden');

    wrap.classList.remove('invisible', 'opacity-0', 'pointer-events-none');
    wrap.classList.remove('apz-panel-enter');
    void wrap.offsetWidth;
    if (!document.documentElement.classList.contains('reduce-motion')) {
      wrap.classList.add('apz-panel-enter');
    }

    titleEl.textContent = entry.title;
    dateEl.textContent = entry.date;
    excerptEl.textContent = entry.excerpt;
    bodyEl.textContent = entry.body;

    const related = entry.relatedIds
      .map((id) => getEntry(id))
      .filter(Boolean)
      .map((e) => e.title);
    relatedEl.textContent =
      related.length > 0 ? `${ui.relatedPrefix}${related.join(' · ')}` : ui.noRelated;

    if (opening) {
      const active = document.activeElement;
      restoreFocusEl =
        active instanceof HTMLElement && active !== document.body ? active : null;
      requestAnimationFrame(() => titleEl.focus());
    }
  }

  function handleClose() {
    opts.onClose();
  }

  closeBtn.addEventListener('click', handleClose);

  const unsub = subscribe(render);
  render();

  return {
    destroy() {
      closeBtn.removeEventListener('click', handleClose);
      unsub();
      root.classList.remove('min-h-[200px]', 'hidden', 'lg:hidden');
      root.replaceChildren();
    },
  };
}
