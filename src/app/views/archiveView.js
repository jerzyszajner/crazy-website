import { mountNodeField } from '../components/nodeField.js';
import { mountTimeScrubber } from '../components/timeScrubber.js';
import { mountDetailPanel } from '../components/detailPanel.js';
import { mountListFallback } from '../components/listFallback.js';
import { getBundle } from '../../i18n/bundles.js';
import { getState, setLocale, setViewMode, subscribe } from '../state.js';

/**
 * @param {HTMLElement} root
 */
function syncHeaderUi(root) {
  const ui = getBundle(getState().locale).ui;
  root.querySelectorAll('[data-i18n]').forEach((el) => {
    const key = el.getAttribute('data-i18n');
    if (key && key in ui) {
      el.textContent = ui[/** @type {keyof typeof ui} */ (key)];
    }
  });
  const ariaHost = root.querySelector('[data-i18n-aria]');
  if (ariaHost) {
    const key = ariaHost.getAttribute('data-i18n-aria');
    if (key && key in ui) {
      ariaHost.setAttribute('aria-label', ui[/** @type {keyof typeof ui} */ (key)]);
    }
  }
  const langSelect = /** @type {HTMLSelectElement | null} */ (root.querySelector('#apz-lang-select'));
  if (langSelect) langSelect.value = getState().locale;
}

/**
 * @param {HTMLElement} root
 * @param {{ onNavigateToAct: (id: string) => void, onNavigateHome: () => void }} opts
 */
export function mountArchiveView(root, opts) {
  root.innerHTML = `
    <div class="apz-backdrop apz-noise relative z-0 flex min-h-screen flex-col">
      <header class="relative z-10 border-b border-apz-line bg-apz-surface/70 px-4 py-5 backdrop-blur-md md:px-8">
        <div class="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p class="text-[10px] uppercase tracking-[0.45em] text-apz-muted" data-i18n="institutionLabel"></p>
            <h1 class="font-display mt-2 text-3xl font-extrabold tracking-tight text-apz-ink md:text-4xl" data-i18n="siteTitle"></h1>
            <p class="mt-2 max-w-xl text-sm leading-relaxed text-apz-muted" data-i18n="siteTagline"></p>
          </div>
          <div class="flex w-full flex-col items-end gap-2 md:w-auto">
            <div class="flex w-full flex-wrap items-center justify-end gap-2 md:w-auto">
              <label for="apz-lang-select" class="sr-only" data-i18n="langSelectLabel"></label>
              <select
                id="apz-lang-select"
                class="rounded-lg border border-apz-line bg-apz-bg/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent"
              >
                <option value="en">English</option>
                <option value="pl">Polski</option>
                <option value="nb">Norsk (bokmål)</option>
              </select>
            </div>
            <div class="flex w-full flex-wrap justify-end gap-2 md:w-auto" role="group" data-i18n-aria="viewModeAria">
              <button
                type="button"
                data-mode="graph"
                class="rounded-lg border border-apz-line px-3 py-2 text-xs font-semibold uppercase tracking-wider text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent"
                data-i18n="modeGraph"
              ></button>
              <button
                type="button"
                data-mode="list"
                class="rounded-lg border border-apz-line px-3 py-2 text-xs font-semibold uppercase tracking-wider text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent"
                data-i18n="modeList"
              ></button>
            </div>
          </div>
        </div>
      </header>

      <main id="main" class="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">
        <div
          data-graph-wrap
          class="relative min-h-[min(72vh,640px)] overflow-hidden rounded-2xl border border-apz-line bg-apz-surface/40 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]"
        >
          <p class="sr-only" aria-live="polite" aria-atomic="true" data-graph-live></p>
          <canvas class="absolute inset-0 block h-full w-full touch-none" tabindex="0" data-canvas></canvas>
          <div class="pointer-events-none absolute left-4 top-4 max-w-[min(90%,280px)] rounded-lg border border-apz-line/80 bg-apz-bg/70 px-3 py-2 text-[11px] text-apz-muted backdrop-blur-sm" data-i18n="graphHint"></div>
        </div>

        <div data-list-slot class="hidden"></div>

        <div class="grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
          <div data-scrub-slot class="min-w-0"></div>
          <div data-panel-slot class="min-h-0 min-w-0"></div>
        </div>
      </main>

      <footer class="relative z-10 border-t border-apz-line bg-apz-bg/80 px-4 py-6 text-center text-[11px] text-apz-muted backdrop-blur-sm md:px-8" data-i18n="footer"></footer>
    </div>
  `;

  syncHeaderUi(root);

  const canvas = /** @type {HTMLCanvasElement} */ (root.querySelector('[data-canvas]'));
  const graphWrap = /** @type {HTMLElement | null} */ (root.querySelector('[data-graph-wrap]'));
  const listSlot = /** @type {HTMLElement | null} */ (root.querySelector('[data-list-slot]'));
  const scrubSlot = /** @type {HTMLElement | null} */ (root.querySelector('[data-scrub-slot]'));
  const panelSlot = /** @type {HTMLElement | null} */ (root.querySelector('[data-panel-slot]'));
  const modeGraph = /** @type {HTMLButtonElement | null} */ (root.querySelector('[data-mode="graph"]'));
  const modeList = /** @type {HTMLButtonElement | null} */ (root.querySelector('[data-mode="list"]'));
  const langSelect = /** @type {HTMLSelectElement | null} */ (root.querySelector('#apz-lang-select'));
  const graphLive = /** @type {HTMLElement | null} */ (root.querySelector('[data-graph-live]'));

  const nodeApi = mountNodeField(canvas, {
    onNodeActivate: (id) => opts.onNavigateToAct(id),
    liveRegion: graphLive ?? undefined,
  });

  const scrubApi = mountTimeScrubber(/** @type {HTMLElement} */ (scrubSlot));

  const panelApi = mountDetailPanel(/** @type {HTMLElement} */ (panelSlot), {
    onClose: () => opts.onNavigateHome(),
  });

  const listApi = mountListFallback(/** @type {HTMLElement} */ (listSlot), {
    onPick: (id) => opts.onNavigateToAct(id),
  });

  function applyViewMode() {
    const { viewMode } = getState();
    const listMode = viewMode === 'list';
    graphWrap?.classList.toggle('hidden', listMode);
    graphWrap?.setAttribute('aria-hidden', listMode ? 'true' : 'false');
    listSlot?.classList.toggle('hidden', !listMode);
    modeGraph?.classList.toggle('border-apz-accent', !listMode);
    modeGraph?.classList.toggle('text-apz-accent', !listMode);
    modeList?.classList.toggle('border-apz-accent', listMode);
    modeList?.classList.toggle('text-apz-accent', listMode);
    modeGraph?.setAttribute('aria-pressed', listMode ? 'false' : 'true');
    modeList?.setAttribute('aria-pressed', listMode ? 'true' : 'false');
    canvas?.setAttribute('tabindex', listMode ? '-1' : '0');
    if (!listMode) nodeApi.requestDraw();
  }

  function onModeClick(ev) {
    const t = ev.target;
    if (!(t instanceof HTMLElement)) return;
    const btn = t.closest('button[data-mode]');
    if (!btn) return;
    const mode = btn.getAttribute('data-mode');
    if (mode === 'graph' || mode === 'list') setViewMode(mode);
  }

  /** @type {string} */
  let lastLocale = getState().locale;

  function onLocaleOrView() {
    const { locale } = getState();
    if (locale !== lastLocale) {
      lastLocale = locale;
      syncHeaderUi(root);
    }
    applyViewMode();
  }

  function onLangChange() {
    const v = langSelect?.value;
    if (v === 'en' || v === 'pl' || v === 'nb') setLocale(v);
  }

  const header = root.querySelector('header');
  header?.addEventListener('click', onModeClick);
  langSelect?.addEventListener('change', onLangChange);

  const unsubMode = subscribe(onLocaleOrView);
  onLocaleOrView();

  function syncGridSpan() {
    const hasPanel = Boolean(getState().selectedId);
    scrubSlot?.classList.toggle('apz-scrub-span-2', !hasPanel);
  }

  const unsubGrid = subscribe(syncGridSpan);
  syncGridSpan();

  return {
    unmount() {
      header?.removeEventListener('click', onModeClick);
      langSelect?.removeEventListener('change', onLangChange);
      unsubMode();
      unsubGrid();
      scrubApi.destroy();
      panelApi.destroy();
      listApi.destroy();
      nodeApi.destroy();
      root.innerHTML = '';
    },
  };
}
