/** @typedef {{ id: string, date: string, relatedIds: string[] }} ArchiveCoreEntry */

/** @type {ArchiveCoreEntry[]} */
export const archiveCore = [
  {
    id: 'apz-01',
    date: '1962-03-14',
    relatedIds: ['apz-03', 'apz-07'],
  },
  {
    id: 'apz-02',
    date: '1987-11-02',
    relatedIds: ['apz-05'],
  },
  {
    id: 'apz-03',
    date: '1974-06-21',
    relatedIds: ['apz-01', 'apz-06'],
  },
  {
    id: 'apz-04',
    date: '2001-01-01',
    relatedIds: ['apz-08'],
  },
  {
    id: 'apz-05',
    date: '1995-09-09',
    relatedIds: ['apz-02', 'apz-08'],
  },
  {
    id: 'apz-06',
    date: '1955-12-05',
    relatedIds: ['apz-03', 'apz-07'],
  },
  {
    id: 'apz-07',
    date: '2012-07-19',
    relatedIds: ['apz-01', 'apz-06'],
  },
  {
    id: 'apz-08',
    date: '2020-02-29',
    relatedIds: ['apz-04', 'apz-05'],
  },
];

const byId = new Map(archiveCore.map((e) => [e.id, e]));

export function getCoreEntry(id) {
  return byId.get(id) ?? null;
}

export function getDateRange() {
  const times = archiveCore.map((e) => new Date(e.date).getTime());
  return { min: Math.min(...times), max: Math.max(...times) };
}
