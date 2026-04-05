import { getArchive, getDateRange } from '../../content/archive.js';
import { getBundle } from '../../i18n/bundles.js';
import { getState, subscribe } from '../state.js';

/**
 * @param {HTMLElement} root
 * @param {{ onPick: (id: string) => void }} opts
 */
export function mountListFallback(root, opts) {
  const { min, max } = getDateRange();
  const span = max - min || 1;

  root.innerHTML = `
    <div class="rounded-xl border border-apz-line bg-apz-elevated/60 p-4 backdrop-blur-sm">
      <h3 class="font-display text-sm font-semibold text-apz-ink" data-list-heading></h3>
      <p class="mt-1 text-xs text-apz-muted" data-list-desc></p>
      <ul class="mt-3 max-h-[40vh] space-y-2 overflow-y-auto pr-1" role="list" data-list></ul>
    </div>
  `;

  const listEl = /** @type {HTMLUListElement | null} */ (root.querySelector('[data-list]'));
  const headingEl = root.querySelector('[data-list-heading]');
  const descEl = root.querySelector('[data-list-desc]');

  function visibleByTime(dateStr, timeT) {
    const cutoff = min + timeT * span;
    return new Date(dateStr).getTime() <= cutoff;
  }

  function render() {
    const ui = getBundle(getState().locale).ui;
    if (headingEl) headingEl.textContent = ui.listHeading;
    if (descEl) descEl.textContent = ui.listDescription;

    const { timeT, selectedId } = getState();
    if (!listEl) return;

    const items = getArchive()
      .filter((e) => visibleByTime(e.date, timeT))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    listEl.innerHTML = items
      .map((e) => {
        const active = e.id === selectedId;
        return `
        <li>
          <button
            type="button"
            class="w-full rounded-lg border px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent ${
              active
                ? 'border-apz-accent bg-apz-surface text-apz-ink'
                : 'border-apz-line bg-apz-bg/40 text-apz-muted hover:border-apz-glow hover:text-apz-ink'
            }"
            data-id="${e.id}"
          >
            <span class="font-display block font-semibold text-apz-ink">${escapeHtml(e.title)}</span>
            <span class="mt-0.5 block font-mono text-[11px] text-apz-glow">${escapeHtml(e.date)}</span>
          </button>
        </li>`;
      })
      .join('');
  }

  function onListClick(ev) {
    const btn = ev.target instanceof Element ? ev.target.closest('button[data-id]') : null;
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (id) opts.onPick(id);
  }

  function escapeHtml(s) {
    return s
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
  }

  listEl?.addEventListener('click', onListClick);

  const unsub = subscribe(render);
  render();

  return {
    destroy() {
      listEl?.removeEventListener('click', onListClick);
      unsub();
      root.innerHTML = '';
    },
  };
}
