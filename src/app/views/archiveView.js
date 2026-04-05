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
  root.replaceChildren();

  const shell = document.createElement('div');
  shell.className =
    'apz-backdrop apz-noise relative z-0 flex min-h-screen flex-col';

  const header = document.createElement('header');
  header.className =
    'relative z-10 border-b border-apz-line bg-apz-surface/70 px-4 py-5 backdrop-blur-md md:px-8';

  const headerInner = document.createElement('div');
  headerInner.className =
    'mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-end md:justify-between';

  const brandCol = document.createElement('div');

  const institutionLabel = document.createElement('p');
  institutionLabel.className =
    'text-[10px] uppercase tracking-[0.45em] text-apz-muted';
  institutionLabel.setAttribute('data-i18n', 'institutionLabel');

  const siteTitle = document.createElement('h1');
  siteTitle.className =
    'font-display mt-2 text-3xl font-extrabold tracking-tight text-apz-ink md:text-4xl';
  siteTitle.setAttribute('data-i18n', 'siteTitle');

  const siteTagline = document.createElement('p');
  siteTagline.className =
    'mt-2 max-w-xl text-sm leading-relaxed text-apz-muted';
  siteTagline.setAttribute('data-i18n', 'siteTagline');

  brandCol.append(institutionLabel, siteTitle, siteTagline);

  const controlsCol = document.createElement('div');
  controlsCol.className =
    'flex w-full flex-col items-end gap-2 md:w-auto';

  const langRow = document.createElement('div');
  langRow.className =
    'flex w-full flex-wrap items-center justify-end gap-2 md:w-auto';

  const langLabel = document.createElement('label');
  langLabel.htmlFor = 'apz-lang-select';
  langLabel.className = 'sr-only';
  langLabel.setAttribute('data-i18n', 'langSelectLabel');

  const langSelect = document.createElement('select');
  langSelect.id = 'apz-lang-select';
  langSelect.className =
    'rounded-lg border border-apz-line bg-apz-bg/40 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent';

  const langOptions = [
    ['en', 'English'],
    ['pl', 'Polski'],
    ['nb', 'Norsk (bokmål)'],
  ];
  for (const [value, label] of langOptions) {
    const opt = document.createElement('option');
    opt.value = value;
    opt.textContent = label;
    langSelect.append(opt);
  }

  langRow.append(langLabel, langSelect);

  const modeGroup = document.createElement('div');
  modeGroup.className =
    'flex w-full flex-wrap justify-end gap-2 md:w-auto';
  modeGroup.setAttribute('role', 'group');
  modeGroup.setAttribute('data-i18n-aria', 'viewModeAria');

  const btnModeClass =
    'rounded-lg border border-apz-line px-3 py-2 text-xs font-semibold uppercase tracking-wider text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent';

  const modeGraph = document.createElement('button');
  modeGraph.type = 'button';
  modeGraph.setAttribute('data-mode', 'graph');
  modeGraph.className = btnModeClass;
  modeGraph.setAttribute('data-i18n', 'modeGraph');

  const modeList = document.createElement('button');
  modeList.type = 'button';
  modeList.setAttribute('data-mode', 'list');
  modeList.className = btnModeClass;
  modeList.setAttribute('data-i18n', 'modeList');

  modeGroup.append(modeGraph, modeList);
  controlsCol.append(langRow, modeGroup);
  headerInner.append(brandCol, controlsCol);
  header.append(headerInner);

  const main = document.createElement('main');
  main.id = 'main';
  main.className =
    'relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-8';

  const graphWrap = document.createElement('div');
  graphWrap.setAttribute('data-graph-wrap', '');
  graphWrap.className =
    'relative min-h-[min(72vh,640px)] overflow-hidden rounded-2xl border border-apz-line bg-apz-surface/40 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]';

  const graphLive = document.createElement('p');
  graphLive.className = 'sr-only';
  graphLive.setAttribute('aria-live', 'polite');
  graphLive.setAttribute('aria-atomic', 'true');
  graphLive.setAttribute('data-graph-live', '');

  const canvas = document.createElement('canvas');
  canvas.className =
    'absolute inset-0 block h-full w-full touch-none';
  canvas.tabIndex = 0;
  canvas.setAttribute('data-canvas', '');

  const graphHint = document.createElement('div');
  graphHint.className =
    'pointer-events-none absolute left-4 top-4 max-w-[min(90%,280px)] rounded-lg border border-apz-line/80 bg-apz-bg/70 px-3 py-2 text-[11px] text-apz-muted backdrop-blur-sm';
  graphHint.setAttribute('data-i18n', 'graphHint');

  graphWrap.append(graphLive, canvas, graphHint);

  const listSlot = document.createElement('div');
  listSlot.setAttribute('data-list-slot', '');
  listSlot.className = 'hidden';

  const grid = document.createElement('div');
  grid.className = 'grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]';

  const scrubSlot = document.createElement('div');
  scrubSlot.setAttribute('data-scrub-slot', '');
  scrubSlot.className = 'min-w-0';

  const panelSlot = document.createElement('div');
  panelSlot.setAttribute('data-panel-slot', '');
  panelSlot.className = 'min-h-0 min-w-0';

  grid.append(scrubSlot, panelSlot);
  main.append(graphWrap, listSlot, grid);

  const footer = document.createElement('footer');
  footer.className =
    'relative z-10 border-t border-apz-line bg-apz-bg/80 px-4 py-6 text-center text-[11px] text-apz-muted backdrop-blur-sm md:px-8';
  footer.setAttribute('data-i18n', 'footer');

  shell.append(header, main, footer);
  root.append(shell);

  syncHeaderUi(root);

  const canvasEl = /** @type {HTMLCanvasElement} */ (canvas);

  const nodeApi = mountNodeField(canvasEl, {
    onNodeActivate: (id) => opts.onNavigateToAct(id),
    liveRegion: graphLive,
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
    graphWrap.classList.toggle('hidden', listMode);
    graphWrap.setAttribute('aria-hidden', listMode ? 'true' : 'false');
    listSlot.classList.toggle('hidden', !listMode);
    modeGraph.classList.toggle('border-apz-accent', !listMode);
    modeGraph.classList.toggle('text-apz-accent', !listMode);
    modeList.classList.toggle('border-apz-accent', listMode);
    modeList.classList.toggle('text-apz-accent', listMode);
    modeGraph.setAttribute('aria-pressed', listMode ? 'false' : 'true');
    modeList.setAttribute('aria-pressed', listMode ? 'true' : 'false');
    canvasEl.setAttribute('tabindex', listMode ? '-1' : '0');
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
    const v = langSelect.value;
    if (v === 'en' || v === 'pl' || v === 'nb') setLocale(v);
  }

  header.addEventListener('click', onModeClick);
  langSelect.addEventListener('change', onLangChange);

  const unsubMode = subscribe(onLocaleOrView);
  onLocaleOrView();

  function syncGridSpan() {
    const hasPanel = Boolean(getState().selectedId);
    scrubSlot.classList.toggle('apz-scrub-span-2', !hasPanel);
  }

  const unsubGrid = subscribe(syncGridSpan);
  syncGridSpan();

  return {
    unmount() {
      header.removeEventListener('click', onModeClick);
      langSelect.removeEventListener('change', onLangChange);
      unsubMode();
      unsubGrid();
      scrubApi.destroy();
      panelApi.destroy();
      listApi.destroy();
      nodeApi.destroy();
      root.replaceChildren();
    },
  };
}
