import { getState } from '../app/state.js';
import { getBundle } from '../i18n/bundles.js';
import { archiveCore, getCoreEntry, getDateRange as getCoreDateRange } from './archiveCore.js';

/** @typedef {{ id: string, title: string, date: string, relatedIds: string[], excerpt: string, body: string }} ArchiveEntry */

/**
 * @returns {ArchiveEntry[]}
 */
export function getArchive() {
  const bundle = getBundle(getState().locale);
  return archiveCore.map((row) => {
    const text = bundle.archiveById[row.id];
    return {
      ...row,
      title: text.title,
      excerpt: text.excerpt,
      body: text.body,
    };
  });
}

/**
 * @param {string} id
 * @returns {ArchiveEntry | null}
 */
export function getEntry(id) {
  const row = getCoreEntry(id);
  if (!row) return null;
  const bundle = getBundle(getState().locale);
  const text = bundle.archiveById[id];
  if (!text) return null;
  return {
    ...row,
    title: text.title,
    excerpt: text.excerpt,
    body: text.body,
  };
}

export function getDateRange() {
  return getCoreDateRange();
}
