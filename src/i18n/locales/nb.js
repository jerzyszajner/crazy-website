/** @typedef {import('./pl.js').PlBundle} PlBundle */

/** @type {Omit<PlBundle, 'code'> & { code: 'nb' }} */
export const nb = {
  code: 'nb',
  htmlLang: 'nb',
  intlLocale: 'nb-NO',
  meta: {
    title: 'APZ — Arkivet for tilfeldige sammenfall',
    description:
      'Arkivet for tilfeldige sammenfall — en fiktiv institusjon som dokumenterer umulige sammenfall.',
  },
  ui: {
    skipToContent: 'Hopp til innhold',
    langSelectLabel: 'Språk',
    institutionLabel: 'En institusjon utenfor tid',
    siteTitle: 'Arkivet for tilfeldige sammenfall',
    siteTagline:
      'Dette er ikke en blogg, et dashbord eller en landingsside. Det er et felt av koblinger: noder, linjer og en tidslinje — fordi sammenfall sjelden ordner seg i menyer.',
    viewModeAria: 'Visningsmodus',
    modeGraph: 'Nodemap',
    modeList: 'Aktliste',
    graphHint:
      'Klikk på en node for å åpne en akt. Linjene er relaterte spor. Skyveren nederst avdekker fortiden.',
    footer: 'APZ · fiksjon i arkiv · ingen informasjonskapsler, nyhetsbrev eller økonomisk mening',
    listHeading: 'Aktliste (tilgjengelig sti)',
    listDescription:
      'Navigasjon med tastatur og skjermleser: velg en akt fra listen — den svarer til en node på koblingskartet.',
    timeAxisTitle: 'Arkivets tidslinje',
    timeScrubSrLabel: 'Filtrer oppføringer til valgt sluttdato',
    timeScrubHelp:
      'Flytt skyveren for bare å vise sammenfall «frem til» valgt øyeblikk — noder utenfor området tones ut.',
    visibleUntilPrefix: 'Synlig til: ',
    panelKicker: 'Arkivakt',
    close: 'Lukk',
    closeAria: 'Lukk detaljpanelet',
    relatedPrefix: 'Relaterte spor: ',
    noRelated: 'Ingen koblinger i grafen for denne akten.',
    langOptionEn: 'English',
    langOptionPl: 'Polski',
    langOptionNb: 'Norsk (bokmål)',
    canvasAriaLabel:
      'Koblingskart for arkivakter. Bruk piltastene på kartet, musen eller listen for å navigere.',
    graphKeyboardHelp:
      'Venstre- og høyrepiltast flytter mellom synlige noder. Enter åpner akten.',
    graphLiveNode: 'Node: {title}.',
    graphLiveNoNodes: 'Ingen synlige oppføringer med gjeldende datofilter.',
  },
  archiveById: {
    'apz-01': {
      title: 'To billetter, ett nummer, null logikk',
      excerpt:
        'I Gdynia og i Zacisze ble det samme dagen trukket identisk rekkefølge: 4-1-9-2-0. Ingen av lotteriene eksisterte offisielt.',
      body: 'Saksmappene inneholder bare konvolutter uten frimerker og et segl med teksten «IKKE ÅPNE FØR DAGNING». Vitner hevder de hørte den samme kontorstiftemaskinen på 320 km avstand.',
    },
    'apz-02': {
      title: 'Klokken stoppet på et sekund som ikke fantes',
      excerpt:
        'Pendelverket viste et 61. sekund i minuttet. Urmakeren registrerte ingen skade og intet bevis på at firmaet noen gang har eksistert.',
      body: 'Et mikroskopisk «Ω» dukket opp på skiven. Etter at konservatoren leste det høyt, glemte alle tilstedeværende hva de het — i 4 minutter og 19 sekunder.',
    },
    'apz-03': {
      title: 'Samme lukt av regn i et rom uten vinduer',
      excerpt:
        'Lagerarkiv, nivå -2. Konstant fuktighet 41 %, temperatur uendret i 40 år. Lukt: «regn på varm asfalt, 1998».',
      body: 'Luftprøver kondenserte av seg selv til små paraplyformer. Paraplyene ble ikke åpnet; de ble lagt i en skuff merket «i morgen».',
    },
    'apz-04': {
      title: 'Brev uten avsender, med leserens fødselsdato',
      excerpt:
        'Konvolutten inneholdt én setning: «Husker du hva du sa før du ble født?» Poststempelet var tomt, men blekket luktet av vanilje og ozon.',
      body: 'Under UV dukket en annen tekst opp, bare synlig i et speil: «Du husker ikke. Bra.» Brevet forsvant fra konvolutten og etterlot identisk papir med gramvekt -3.',
    },
    'apz-05': {
      title: 'Et ekko av en stemme ingen spilte inn',
      excerpt:
        'I en tom universitetshall ble et ekko på tre stavelser registrert. Frekvensspekteret stemte med stemmen til en fremtidig radiostemme — ansatt 11 år senere.',
      body: 'Opptaket er 0 sekunder langt og 4,7 MB stort. I øretelefoner hører man bare stillhet som nikker i takt med en vals.',
    },
    'apz-06': {
      title: 'Kart over en by som bare er en forkortelse',
      excerpt:
        'På planen fra 1955 har alle gater navn som er forkortelser av ett ord: «NEI». Kryssene danner stjernebildet Andromeda i målestokk 1:1 med himmelen i 2044.',
      body: 'En fotgjenger som prøvde å gå rett fram, returnerte til startpunktet med presisjon på et karbonatom. GPS viser moralske koordinater i stedet for geografiske.',
    },
    'apz-07': {
      title: 'Identiske papirsår på to kontinenter',
      excerpt:
        'Et hull etter hullmaskin i en protokoll fra Chile dekker perfekt en perforering på en faktura fra Finland — samme krumning, samme mangel på vilje til å eksistere.',
      body: 'Da overheadfoliene ble lagt over hverandre, smeltet dokumentene sammen til ett ark der du kan lese en oppskrift på en suppe som ikke må kokes på onsdager.',
    },
    'apz-08': {
      title: 'Én drøm, åtte personer, samme scene i tredje akt',
      excerpt:
        'Mennesker som ikke kjente hverandre, beskrev et identisk skyggespill: en stol, en pappmasjéslange, et «ut»-skilt over inngangen.',
      body: 'Ved oppvåkning hadde hver en billett uten dato i lommen. Under UV viste billetten drømmens koordinater: drømmens bredde, bekymringens lengde, latterens høyde.',
    },
  },
};
