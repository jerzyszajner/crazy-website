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

  root.replaceChildren();

  const shell = document.createElement('div');
  shell.className =
    'rounded-xl border border-apz-line bg-apz-elevated/60 p-4 backdrop-blur-sm';

  const headingEl = document.createElement('h3');
  headingEl.className = 'font-display text-sm font-semibold text-apz-ink';
  headingEl.setAttribute('data-list-heading', '');

  const descEl = document.createElement('p');
  descEl.className = 'mt-1 text-xs text-apz-muted';
  descEl.setAttribute('data-list-desc', '');

  const listEl = document.createElement('ul');
  listEl.className =
    'mt-3 max-h-[40vh] space-y-2 overflow-y-auto pr-1';
  listEl.setAttribute('role', 'list');
  listEl.setAttribute('data-list', '');

  shell.append(headingEl, descEl, listEl);
  root.append(shell);

  function visibleByTime(dateStr, timeT) {
    const cutoff = min + timeT * span;
    return new Date(dateStr).getTime() <= cutoff;
  }

  function render() {
    const ui = getBundle(getState().locale).ui;
    headingEl.textContent = ui.listHeading;
    descEl.textContent = ui.listDescription;

    const { timeT, selectedId } = getState();

    const items = getArchive()
      .filter((e) => visibleByTime(e.date, timeT))
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    listEl.replaceChildren();

    for (const e of items) {
      const active = e.id === selectedId;
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.setAttribute('data-id', e.id);
      btn.className = `w-full rounded-lg border px-3 py-2 text-left text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent ${
        active
          ? 'border-apz-accent bg-apz-surface text-apz-ink'
          : 'border-apz-line bg-apz-bg/40 text-apz-muted hover:border-apz-glow hover:text-apz-ink'
      }`;

      const spanTitle = document.createElement('span');
      spanTitle.className = 'font-display block font-semibold text-apz-ink';
      spanTitle.textContent = e.title;

      const spanDate = document.createElement('span');
      spanDate.className = 'mt-0.5 block font-mono text-[11px] text-apz-glow';
      spanDate.textContent = e.date;

      btn.append(spanTitle, spanDate);
      li.append(btn);
      listEl.append(li);
    }
  }

  function onListClick(ev) {
    const btn = ev.target instanceof Element ? ev.target.closest('button[data-id]') : null;
    if (!btn) return;
    const id = btn.getAttribute('data-id');
    if (id) opts.onPick(id);
  }

  listEl.addEventListener('click', onListClick);

  const unsub = subscribe(render);
  render();

  return {
    destroy() {
      listEl.removeEventListener('click', onListClick);
      unsub();
      root.replaceChildren();
    },
  };
}
