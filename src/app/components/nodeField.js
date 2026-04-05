import { archive, getDateRange } from '../../content/archive.js';
import { getState, subscribe } from '../state.js';

/**
 * @typedef {{ id: string, x: number, y: number, r: number, entry: import('../../content/archive.js').ArchiveEntry }} PlacedNode
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ onNodeActivate: (id: string) => void }} opts
 */
export function mountNodeField(canvas, opts) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { destroy() {}, requestDraw() {} };
  }

  const { min, max } = getDateRange();
  const span = max - min || 1;

  /** @type {PlacedNode[]} */
  let placed = [];
  /** @type {string | null} */
  let hoveredId = null;
  let ro = /** @type {ResizeObserver | null} */ (null);
  let unsub = () => {};

  function layoutNodes(w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const n = archive.length;
    const baseR = Math.min(w, h) * 0.28;
    placed = archive.map((entry, i) => {
      const t = i / n;
      const angle = t * Math.PI * 2 + 0.35;
      const ripple = (i % 4) * 14;
      const r = baseR + ripple;
      return {
        id: entry.id,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        r: 14,
        entry,
      };
    });
  }

  function isVisible(entry, timeT) {
    const cutoff = min + timeT * span;
    return new Date(entry.date).getTime() <= cutoff;
  }

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const { timeT, selectedId } = getState();
    const reduceMotion = document.documentElement.classList.contains('reduce-motion');

    const byId = new Map(placed.map((p) => [p.id, p]));

    ctx.lineWidth = 1;
    for (const p of placed) {
      if (!isVisible(p.entry, timeT)) continue;
      for (const rid of p.entry.relatedIds) {
        if (p.id.localeCompare(rid) > 0) continue;
        const q = byId.get(rid);
        if (!q || !isVisible(q.entry, timeT)) continue;
        const dim = !selectedId || (selectedId !== p.id && selectedId !== q.id);
        ctx.strokeStyle = dim ? 'rgba(60,255,154,0.12)' : 'rgba(30,224,194,0.45)';
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }

    const tPulse = reduceMotion ? 0 : performance.now() / 1000;
    for (const p of placed) {
      const vis = isVisible(p.entry, timeT);
      const alpha = vis ? 1 : 0.14;
      const sel = p.id === selectedId;
      const hov = p.id === hoveredId;
      let rad = p.r;
      if (sel) rad += 5;
      else if (hov) rad += 3;
      if (sel && !reduceMotion) rad += Math.sin(tPulse * 3) * 1.2;

      ctx.beginPath();
      ctx.fillStyle = vis
        ? sel
          ? 'rgba(60,255,154,0.95)'
          : hov
            ? 'rgba(30,224,194,0.85)'
            : 'rgba(110,143,130,0.55)'
        : 'rgba(80,90,88,0.25)';
      ctx.globalAlpha = alpha;
      ctx.arc(p.x, p.y, rad, 0, Math.PI * 2);
      ctx.fill();

      if (sel) {
        ctx.strokeStyle = 'rgba(30,224,194,0.9)';
        ctx.lineWidth = 2;
        ctx.stroke();
        ctx.lineWidth = 1;
      }
      ctx.globalAlpha = 1;

      if (vis) {
        ctx.fillStyle = sel ? '#06120c' : 'rgba(230,244,236,0.85)';
        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = String(archive.indexOf(p.entry) + 1).padStart(2, '0');
        ctx.fillText(label, p.x, p.y);
      }
    }
  }

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();
    const w = Math.max(320, rect.width);
    const h = Math.max(320, rect.height);
    canvas.width = Math.floor(w * dpr);
    canvas.height = Math.floor(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    layoutNodes(w, h);
    draw();
  }

  function pickNode(clientX, clientY) {
    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    const { timeT } = getState();

    let best = null;
    let bestD = Infinity;
    for (const p of placed) {
      if (!isVisible(p.entry, timeT)) continue;
      const dx = x - p.x;
      const dy = y - p.y;
      const d = dx * dx + dy * dy;
      const hitR = p.r + (p.id === getState().selectedId ? 8 : 6);
      if (d <= hitR * hitR && d < bestD) {
        bestD = d;
        best = p;
      }
    }
    return best;
  }

  function onPointerMove(ev) {
    const p = pickNode(ev.clientX, ev.clientY);
    const next = p?.id ?? null;
    if (next !== hoveredId) {
      hoveredId = next;
      canvas.style.cursor = next ? 'pointer' : 'default';
      draw();
    }
  }

  function onPointerLeave() {
    hoveredId = null;
    canvas.style.cursor = 'default';
    draw();
  }

  function onClick(ev) {
    const p = pickNode(ev.clientX, ev.clientY);
    if (p) opts.onNodeActivate(p.id);
  }

  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('click', onClick);
  canvas.setAttribute('role', 'img');
  canvas.setAttribute(
    'aria-label',
    'Mapa powiązań aktów archiwum. Użyj myszy lub przełącz się na listę dla nawigacji klawiaturą.',
  );

  ro = new ResizeObserver(() => resize());
  if (canvas.parentElement) ro.observe(canvas.parentElement);
  resize();

  unsub = subscribe(() => draw());

  return {
    requestDraw: draw,
    destroy() {
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
      canvas.removeEventListener('click', onClick);
      ro?.disconnect();
      unsub();
    },
  };
}
