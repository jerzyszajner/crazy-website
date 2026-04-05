/** @typedef {import('./pl.js').PlBundle} PlBundle */

/** @type {Omit<PlBundle, 'code'> & { code: 'en' }} */
export const en = {
  code: 'en',
  htmlLang: 'en',
  intlLocale: 'en-GB',
  meta: {
    title: 'APZ — Archive of Coincidental Convergences',
    description:
      'Archive of Coincidental Convergences — a fictional institution documenting impossible coincidences.',
  },
  ui: {
    skipToContent: 'Skip to content',
    langSelectLabel: 'Language',
    institutionLabel: 'An institution outside time',
    siteTitle: 'Archive of Coincidental Convergences',
    siteTagline:
      'This is not a blog, a dashboard, or a landing page. It is a field of connections: nodes, lines, and a timeline — because coincidences rarely arrange themselves into menus.',
    viewModeAria: 'View mode',
    modeGraph: 'Node map',
    modeList: 'Record list',
    graphHint:
      'Click a node to open a record. Lines are related traces. The slider at the bottom reveals the past.',
    footer:
      'APZ · fiction on file · no cookies, no newsletter, no economic sense',
    listHeading: 'Record list (accessible path)',
    listDescription:
      'Keyboard and screen-reader navigation: choose a record from the list — it matches a node on the connection map.',
    timeAxisTitle: 'Archive timeline',
    timeScrubSrLabel: 'Filter entries up to the selected end date',
    timeScrubHelp:
      'Move the slider to reveal only coincidences “up to” the chosen moment — nodes outside the range fade out.',
    visibleUntilPrefix: 'Visible until: ',
    panelKicker: 'Archival record',
    close: 'Close',
    closeAria: 'Close detail panel',
    relatedPrefix: 'Related traces: ',
    noRelated: 'No graph links for this record.',
    langOptionEn: 'English',
    langOptionPl: 'Polski',
    langOptionNb: 'Norsk (bokmål)',
    canvasAriaLabel:
      'Map of connections between archive records. Use the mouse or switch to the list for keyboard navigation.',
  },
  archiveById: {
    'apz-01': {
      title: 'Two tickets, one number, zero logic',
      excerpt:
        'In Gdynia and in Zacisze on the same day an identical sequence was drawn: 4-1-9-2-0. Neither lottery officially existed.',
      body: 'The files hold only envelopes without stamps and a seal reading “DO NOT OPEN BEFORE DAWN.” Witnesses claim they heard the same office stapler from 320 km away.',
    },
    'apz-02': {
      title: 'The clock stopped on a second that never existed',
      excerpt:
        'The pendulum mechanism showed a 61st second in the minute. The watchmaker’s service logged no damage and no evidence the company ever existed.',
      body: 'A microscopic “Ω” appeared on the dial. After the conservator read it aloud, everyone present forgot their own names — for 4 minutes and 19 seconds.',
    },
    'apz-03': {
      title: 'The same smell of rain in a windowless room',
      excerpt:
        'Warehouse archive, level -2. Persistent humidity 41%, temperature steady for 40 years. Odour: “rain on hot asphalt, 1998.”',
      body: 'Air samples condensed on their own into the shape of small umbrellas. The umbrellas were not opened; they were left in a drawer labelled “tomorrow.”',
    },
    'apz-04': {
      title: 'A letter with no sender and the reader’s birth date',
      excerpt:
        'The envelope contained one sentence: “Do you remember what you said before you were born?” The postmark was blank, but the ink smelled of vanilla and ozone.',
      body: 'Under UV a second text appeared, visible only in a mirror: “You don’t remember. Good.” The letter vanished from the envelope, leaving identical paper of grammage -3.',
    },
    'apz-05': {
      title: 'An echo of a voice nobody recorded',
      excerpt:
        'In an empty university hall a reverberation of three syllables was logged. The frequency spectrum matched the voice of a future radio presenter — hired 11 years later.',
      body: 'The recording is 0 seconds long and 4.7 MB in size. In headphones you hear only silence nodding along in waltz time.',
    },
    'apz-06': {
      title: 'A map of a city that is only an abbreviation',
      excerpt:
        'On the 1955 plan every street is named with abbreviations of a single word: “NO.” The intersections form the constellation Andromeda at 1:1 with the sky of 2044.',
      body: 'A pedestrian who tried to walk straight returned to the starting point to the precision of a carbon atom. GPS shows moral coordinates instead of geographic ones.',
    },
    'apz-07': {
      title: 'Identical paper wounds on two continents',
      excerpt:
        'A hole-punch hole in a protocol from Chile aligns perfectly with a perforation on an invoice from Finland — same curvature, same lack of will to exist.',
      body: 'When the transparencies were overlaid, the two documents merged into one sheet where you can read a recipe for a soup that must not be cooked on Wednesdays.',
    },
    'apz-08': {
      title: 'One dream, eight people, the same act-three scene',
      excerpt:
        'People who did not know each other described an identical shadow theatre: a chair, a papier-mâché snake, an “exit” sign above the entrance.',
      body: 'On waking each had a ticket without a date in their pocket. Under UV the ticket showed the dream’s coordinates: width of the dream, length of worry, height of laughter.',
    },
  },
};
