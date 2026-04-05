import { en } from './locales/en.js';
import { nb } from './locales/nb.js';
import { pl } from './locales/pl.js';

/** @typedef {import('./locales/pl.js').PlBundle} LocaleBundle */

/** @type {readonly ['en', 'pl', 'nb']} */
export const LOCALE_CODES = /** @type {const} */ (['en', 'pl', 'nb']);

/** @type {Record<(typeof LOCALE_CODES)[number], LocaleBundle>} */
export const bundles = { en, pl, nb };

/**
 * @param {string} code
 * @returns {LocaleBundle}
 */
export function getBundle(code) {
  if (code === 'en' || code === 'pl' || code === 'nb') {
    return bundles[code];
  }
  return bundles.en;
}

/**
 * @param {string} code
 * @returns {code is (typeof LOCALE_CODES)[number]}
 */
export function isLocaleCode(code) {
  return code === 'en' || code === 'pl' || code === 'nb';
}
