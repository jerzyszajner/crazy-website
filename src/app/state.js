/** @typedef {'graph' | 'list'} ViewMode */

const listeners = new Set();

/** @type {string | null} */
let selectedId = null;

/** @type {number} 0–1 zakres widoczności w czasie (max widocznej daty względem pełnego zakresu) */
let timeT = 1;

/** @type {ViewMode} */
let viewMode = 'graph';

export function getState() {
  return {
    selectedId,
    timeT,
    viewMode,
  };
}

/** @param {(s: ReturnType<typeof getState>) => void} fn */
export function subscribe(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

function notify() {
  const s = getState();
  listeners.forEach((fn) => fn(s));
}

/** @param {string | null} id */
export function setSelectedId(id) {
  selectedId = id;
  notify();
}

/** @param {number} t */
export function setTimeT(t) {
  timeT = Math.min(1, Math.max(0, t));
  notify();
}

/** @param {ViewMode} mode */
export function setViewMode(mode) {
  viewMode = mode;
  notify();
}
