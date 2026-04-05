/** @typedef {'graph' | 'list'} ViewMode */
/** @typedef {'en' | 'pl' | 'nb'} LocaleCode */

import { applyLocaleToDocument } from '../i18n/document.js';
import { isLocaleCode } from '../i18n/bundles.js';

const listeners = new Set();
const LOCALE_STORAGE_KEY = 'apz-locale';

/** @type {string | null} */
let selectedId = null;

/** @type {number} 0–1 zakres widoczności w czasie (max widocznej daty względem pełnego zakresu) */
let timeT = 1;

/** @type {ViewMode} */
let viewMode = 'graph';

/** @type {LocaleCode} */
let locale = 'en';

export function getState() {
  return {
    selectedId,
    timeT,
    viewMode,
    locale,
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

/** Odczyt zapisu języka i ustawienie atrybutów dokumentu — wywołać przed pierwszym mountem widoku. */
export function initLocaleFromStorage() {
  const raw = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (raw && isLocaleCode(raw)) {
    locale = raw;
  }
  applyLocaleToDocument(locale);
}

/** @param {LocaleCode} code */
export function setLocale(code) {
  if (!isLocaleCode(code)) return;
  locale = code;
  localStorage.setItem(LOCALE_STORAGE_KEY, code);
  applyLocaleToDocument(code);
  notify();
}
