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

  root.innerHTML = `
    <div class="rounded-xl border border-apz-line bg-apz-surface/80 px-4 py-3 backdrop-blur-sm">
      <div class="mb-2 flex flex-wrap items-end justify-between gap-2">
        <p class="font-display text-sm font-semibold tracking-tight text-apz-ink" data-scrub-title></p>
        <p class="text-xs text-apz-muted" data-scrub-label></p>
      </div>
      <label class="sr-only" for="apz-time-scrub" data-scrub-sr-label></label>
      <input
        id="apz-time-scrub"
        type="range"
        min="0"
        max="1000"
        step="1"
        class="h-2 w-full cursor-pointer appearance-none rounded-full bg-apz-elevated accent-apz-accent"
      />
      <p class="mt-2 text-[11px] leading-relaxed text-apz-muted" data-scrub-help></p>
    </div>
  `;

  const input = /** @type {HTMLInputElement} */ (root.querySelector('#apz-time-scrub'));
  const label = /** @type {HTMLElement | null} */ (root.querySelector('[data-scrub-label]'));
  const titleEl = root.querySelector('[data-scrub-title]');
  const srLabelEl = /** @type {HTMLLabelElement | null} */ (root.querySelector('[data-scrub-sr-label]'));
  const helpEl = root.querySelector('[data-scrub-help]');

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
    if (titleEl) titleEl.textContent = ui.timeAxisTitle;
    if (srLabelEl) {
      srLabelEl.textContent = ui.timeScrubSrLabel;
      srLabelEl.setAttribute('for', 'apz-time-scrub');
    }
    if (helpEl) helpEl.textContent = ui.timeScrubHelp;
  }

  function syncFromState() {
    syncStaticCopy();
    const t = getState().timeT;
    input.value = String(Math.round(t * 1000));
    if (label) label.textContent = `${getBundle(getState().locale).ui.visibleUntilPrefix}${formatDate(t)}`;
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
      root.innerHTML = '';
    },
  };
}
