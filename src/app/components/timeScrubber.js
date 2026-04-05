import { getDateRange } from '../../content/archive.js';
import { getBundle } from '../../i18n/bundles.js';
import { getState, setTimeT, subscribe } from '../state.js';

/**
 * @param {HTMLElement} root
 * @param {{ onChange?: () => void }} [opts]
 */
export function mountTimeScrubber(root, opts = {}) {
  const { min, max } = getDateRange();
  const span = max - min || 1;

  root.replaceChildren();

  const shell = document.createElement('div');
  shell.className =
    'rounded-xl border border-apz-line bg-apz-surface/80 px-4 py-3 backdrop-blur-sm';

  const row = document.createElement('div');
  row.className = 'mb-2 flex flex-wrap items-end justify-between gap-2';

  const titleEl = document.createElement('p');
  titleEl.className = 'font-display text-sm font-semibold tracking-tight text-apz-ink';
  titleEl.setAttribute('data-scrub-title', '');

  const label = document.createElement('p');
  label.className = 'text-xs text-apz-muted';
  label.setAttribute('data-scrub-label', '');

  row.append(titleEl, label);

  const srLabelEl = document.createElement('label');
  srLabelEl.className = 'sr-only';
  srLabelEl.setAttribute('for', 'apz-time-scrub');
  srLabelEl.setAttribute('data-scrub-sr-label', '');

  const input = document.createElement('input');
  input.id = 'apz-time-scrub';
  input.type = 'range';
  input.min = '0';
  input.max = '1000';
  input.step = '1';
  input.className =
    'h-2 w-full cursor-pointer appearance-none rounded-full bg-apz-elevated accent-apz-accent';

  const helpEl = document.createElement('p');
  helpEl.className = 'mt-2 text-[11px] leading-relaxed text-apz-muted';
  helpEl.setAttribute('data-scrub-help', '');

  shell.append(row, srLabelEl, input, helpEl);
  root.append(shell);

  function formatDate(t) {
    const ms = min + t * span;
    const intl = getBundle(getState().locale).intlLocale;
    return new Date(ms).toLocaleDateString(intl, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  function syncStaticCopy() {
    const ui = getBundle(getState().locale).ui;
    titleEl.textContent = ui.timeAxisTitle;
    srLabelEl.textContent = ui.timeScrubSrLabel;
    srLabelEl.setAttribute('for', 'apz-time-scrub');
    helpEl.textContent = ui.timeScrubHelp;
  }

  function syncFromState() {
    syncStaticCopy();
    const t = getState().timeT;
    input.value = String(Math.round(t * 1000));
    label.textContent = `${getBundle(getState().locale).ui.visibleUntilPrefix}${formatDate(t)}`;
  }

  function onInput() {
    const v = Number(input.value) / 1000;
    setTimeT(v);
    opts.onChange?.();
  }

  input.addEventListener('input', onInput);
  const unsub = subscribe(syncFromState);
  syncFromState();

  return {
    getCutoffTime() {
      const t = getState().timeT;
      return min + t * span;
    },
    destroy() {
      input.removeEventListener('input', onInput);
      unsub();
      root.replaceChildren();
    },
  };
}
