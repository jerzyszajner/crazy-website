import { getBundle } from './bundles.js';

const META_DESC_SELECTOR = 'meta[name="description"]';

/**
 * @param {(typeof import('./bundles.js').LOCALE_CODES)[number]} code
 */
export function applyLocaleToDocument(code) {
  const b = getBundle(code);
  document.documentElement.lang = b.htmlLang;
  document.title = b.meta.title;
  const meta = document.querySelector(META_DESC_SELECTOR);
  if (meta) meta.setAttribute('content', b.meta.description);
  const skip = document.getElementById('apz-skip-link');
  if (skip) skip.textContent = b.ui.skipToContent;
}
