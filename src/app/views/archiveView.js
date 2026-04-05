import { mountNodeField } from '../components/nodeField.js';
import { mountTimeScrubber } from '../components/timeScrubber.js';
import { mountDetailPanel } from '../components/detailPanel.js';
import { mountListFallback } from '../components/listFallback.js';
import { getState, setViewMode, subscribe } from '../state.js';

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
            <p class="text-[10px] uppercase tracking-[0.45em] text-apz-muted">Instytucja poza czasem</p>
            <h1 class="font-display mt-2 text-3xl font-extrabold tracking-tight text-apz-ink md:text-4xl">
              Archiwum Przypadkowych Zbieżności
            </h1>
            <p class="mt-2 max-w-xl text-sm leading-relaxed text-apz-muted">
              Nie jest to blog, dashboard ani landing. To pole powiązań: węzły, linie i oś czasu —
              bo zbieżności rzadko układają się w menu.
            </p>
          </div>
          <div class="flex flex-wrap gap-2" role="group" aria-label="Tryb widoku">
            <button
              type="button"
              data-mode="graph"
              class="rounded-lg border border-apz-line px-3 py-2 text-xs font-semibold uppercase tracking-wider text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent"
            >
              Mapa węzłów
            </button>
            <button
              type="button"
              data-mode="list"
              class="rounded-lg border border-apz-line px-3 py-2 text-xs font-semibold uppercase tracking-wider text-apz-muted transition hover:border-apz-accent hover:text-apz-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-apz-accent"
            >
              Lista aktów
            </button>
          </div>
        </div>
      </header>

      <main id="main" class="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">
        <div
          data-graph-wrap
          class="relative min-h-[min(72vh,640px)] overflow-hidden rounded-2xl border border-apz-line bg-apz-surface/40 shadow-[inset_0_0_80px_rgba(0,0,0,0.35)]"
        >
          <canvas class="absolute inset-0 block h-full w-full touch-none" data-canvas></canvas>
          <div class="pointer-events-none absolute left-4 top-4 max-w-[min(90%,280px)] rounded-lg border border-apz-line/80 bg-apz-bg/70 px-3 py-2 text-[11px] text-apz-muted backdrop-blur-sm">
            Kliknij węzeł, by otworzyć akt. Linie to powiązane ślady. Suwak na dole odsłania przeszłość.
          </div>
        </div>

        <div data-list-slot class="hidden"></div>

        <div class="grid gap-6 lg:grid-cols-[1fr_minmax(280px,360px)]">
          <div data-scrub-slot class="min-w-0"></div>
          <div data-panel-slot class="min-h-0 min-w-0"></div>
        </div>
      </main>

      <footer class="relative z-10 border-t border-apz-line bg-apz-bg/80 px-4 py-6 text-center text-[11px] text-apz-muted backdrop-blur-sm md:px-8">
        APZ · dokumentacja fikcji · bez cookies, bez newslettera, bez sensu gospodarczego
      </footer>
    </div>
  `;

  const canvas = /** @type {HTMLCanvasElement} */ (root.querySelector('[data-canvas]'));
  const graphWrap = /** @type {HTMLElement | null} */ (root.querySelector('[data-graph-wrap]'));
  const listSlot = /** @type {HTMLElement | null} */ (root.querySelector('[data-list-slot]'));
  const scrubSlot = /** @type {HTMLElement | null} */ (root.querySelector('[data-scrub-slot]'));
  const panelSlot = /** @type {HTMLElement | null} */ (root.querySelector('[data-panel-slot]'));
  const modeGraph = /** @type {HTMLButtonElement | null} */ (root.querySelector('[data-mode="graph"]'));
  const modeList = /** @type {HTMLButtonElement | null} */ (root.querySelector('[data-mode="list"]'));

  const nodeApi = mountNodeField(canvas, {
    onNodeActivate: (id) => opts.onNavigateToAct(id),
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

  const header = root.querySelector('header');
  header?.addEventListener('click', onModeClick);
  const unsubMode = subscribe(applyViewMode);
  applyViewMode();

  function syncGridSpan() {
    const hasPanel = Boolean(getState().selectedId);
    scrubSlot?.classList.toggle('apz-scrub-span-2', !hasPanel);
  }

  const unsubGrid = subscribe(syncGridSpan);
  syncGridSpan();

  return {
    unmount() {
      header?.removeEventListener('click', onModeClick);
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
