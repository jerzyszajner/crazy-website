import { getArchive, getDateRange, getEntry } from '../../content/archive.js';
import { getBundle } from '../../i18n/bundles.js';
import { getState, subscribe } from '../state.js';

/**
 * @typedef {{ id: string, x: number, y: number, r: number, index: number, entry: import('../../content/archive.js').ArchiveEntry }} PlacedNode
 */

/**
 * @param {HTMLCanvasElement} canvas
 * @param {{ onNodeActivate: (id: string) => void, liveRegion?: HTMLElement }} opts
 */
export function mountNodeField(canvas, opts) {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return { destroy() {}, requestDraw() {} };
  }

  const { min, max } = getDateRange();
  const span = max - min || 1;
  const liveRegion = opts.liveRegion;

  /** @type {PlacedNode[]} */
  let placed = [];
  /** @type {string | null} */
  let hoveredId = null;
  /** @type {string | null} */
  let keyboardFocusId = null;
  let ro = /** @type {ResizeObserver | null} */ (null);
  let unsub = () => {};

  function layoutNodes(w, h) {
    const cx = w / 2;
    const cy = h / 2;
    const arch = getArchive();
    const n = arch.length;
    const baseR = Math.min(w, h) * 0.28;
    placed = arch.map((entry, i) => {
      const t = i / n;
      const angle = t * Math.PI * 2 + 0.35;
      const ripple = (i % 4) * 14;
      const r = baseR + ripple;
      return {
        id: entry.id,
        x: cx + Math.cos(angle) * r,
        y: cy + Math.sin(angle) * r,
        r: 14,
        index: i,
        entry,
      };
    });
  }

  function isVisible(entry, timeT) {
    const cutoff = min + timeT * span;
    return new Date(entry.date).getTime() <= cutoff;
  }

  /** @param {number} timeT */
  function visibleInOrder(timeT) {
    return placed
      .filter((p) => isVisible(p.entry, timeT))
      .sort((a, b) => a.index - b.index);
  }

  function ensureKeyboardFocusValid() {
    const { timeT } = getState();
    const vis = visibleInOrder(timeT);
    if (vis.length === 0) {
      keyboardFocusId = null;
      return;
    }
    if (!keyboardFocusId || !vis.some((p) => p.id === keyboardFocusId)) {
      keyboardFocusId = vis[0].id;
    }
  }

  function announceFocus() {
    if (!liveRegion) return;
    const ui = getBundle(getState().locale).ui;
    const entry = keyboardFocusId ? getEntry(keyboardFocusId) : null;
    const nodePart = entry
      ? ui.graphLiveNode.replace('{title}', entry.title)
      : ui.graphLiveNoNodes;
    liveRegion.textContent = `${ui.graphKeyboardHelp} ${nodePart}`;
  }

  function announceNodeMove() {
    if (!liveRegion) return;
    const ui = getBundle(getState().locale).ui;
    const entry = keyboardFocusId ? getEntry(keyboardFocusId) : null;
    liveRegion.textContent = entry
      ? ui.graphLiveNode.replace('{title}', entry.title)
      : ui.graphLiveNoNodes;
  }

  function draw() {
    const dpr = window.devicePixelRatio || 1;
    const w = canvas.width / dpr;
    const h = canvas.height / dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const { timeT, selectedId, locale } = getState();
    ensureKeyboardFocusValid();

    canvas.setAttribute('aria-label', getBundle(locale).ui.canvasAriaLabel);
    const reduceMotion = document.documentElement.classList.contains('reduce-motion');
    const canvasFocused = document.activeElement === canvas;

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
      const kbd = p.id === keyboardFocusId && canvasFocused;
      const hov = p.id === hoveredId;
      let rad = p.r;
      if (sel) rad += 5;
      else if (kbd) rad += 4;
      else if (hov) rad += 3;
      if (sel && !reduceMotion) rad += Math.sin(tPulse * 3) * 1.2;

      ctx.beginPath();
      ctx.fillStyle = vis
        ? sel
          ? 'rgba(60,255,154,0.95)'
          : kbd || hov
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
      } else if (kbd) {
        ctx.strokeStyle = 'rgba(60,255,154,0.95)';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 3]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 1;
      }
      ctx.globalAlpha = 1;

      if (vis) {
        ctx.fillStyle = sel ? '#06120c' : 'rgba(230,244,236,0.85)';
        ctx.font = '600 10px "IBM Plex Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const label = String(p.index + 1).padStart(2, '0');
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

  /** @type {{ x: number, y: number } | null} */
  let touchStartPos = null;

  function onTouchStart(ev) {
    if (ev.touches.length !== 1) return;
    touchStartPos = { x: ev.touches[0].clientX, y: ev.touches[0].clientY };
  }

  function onTouchEnd(ev) {
    if (!touchStartPos || ev.changedTouches.length !== 1) return;
    const t = ev.changedTouches[0];
    const dx = t.clientX - touchStartPos.x;
    const dy = t.clientY - touchStartPos.y;
    touchStartPos = null;
    if (Math.sqrt(dx * dx + dy * dy) > 8) return; // was a scroll, not a tap
    const p = pickNode(t.clientX, t.clientY);
    if (p) {
      ev.preventDefault();
      opts.onNodeActivate(p.id);
    }
  }

  /** @param {KeyboardEvent} ev */
  function onKeyDown(ev) {
    if (document.activeElement !== canvas) return;

    const { timeT } = getState();
    const vis = visibleInOrder(timeT);
    if (vis.length === 0) return;

    if (ev.key === 'ArrowRight' || ev.key === 'ArrowDown') {
      ev.preventDefault();
      ensureKeyboardFocusValid();
      let i = vis.findIndex((p) => p.id === keyboardFocusId);
      if (i < 0) i = 0;
      i = (i + 1) % vis.length;
      keyboardFocusId = vis[i].id;
      announceNodeMove();
      draw();
      return;
    }

    if (ev.key === 'ArrowLeft' || ev.key === 'ArrowUp') {
      ev.preventDefault();
      ensureKeyboardFocusValid();
      let i = vis.findIndex((p) => p.id === keyboardFocusId);
      if (i < 0) i = 0;
      i = (i - 1 + vis.length) % vis.length;
      keyboardFocusId = vis[i].id;
      announceNodeMove();
      draw();
      return;
    }

    if (ev.key === 'Enter' || ev.key === ' ') {
      ensureKeyboardFocusValid();
      if (keyboardFocusId) {
        ev.preventDefault();
        opts.onNodeActivate(keyboardFocusId);
      }
    }
  }

  function onFocus() {
    ensureKeyboardFocusValid();
    announceFocus();
    draw();
  }

  function onBlur() {
    draw();
  }

  canvas.style.touchAction = 'pan-x pan-y';
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerleave', onPointerLeave);
  canvas.addEventListener('click', onClick);
  canvas.addEventListener('touchstart', onTouchStart, { passive: true });
  canvas.addEventListener('touchend', onTouchEnd, { passive: false });
  canvas.addEventListener('keydown', onKeyDown);
  canvas.addEventListener('focus', onFocus);
  canvas.addEventListener('blur', onBlur);
  canvas.setAttribute('role', 'img');

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
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchend', onTouchEnd);
      canvas.removeEventListener('keydown', onKeyDown);
      canvas.removeEventListener('focus', onFocus);
      canvas.removeEventListener('blur', onBlur);
      ro?.disconnect();
      unsub();
    },
  };
}
