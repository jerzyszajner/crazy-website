/**
 * @typedef {{ title: string, excerpt: string, body: string }} ArchiveTexts
 * @typedef {{ code: 'pl', htmlLang: string, intlLocale: string, meta: { title: string, description: string }, ui: Record<string, string>, archiveById: Record<string, ArchiveTexts> }} PlBundle
 */

/** @type {PlBundle} */
export const pl = {
  code: 'pl',
  htmlLang: 'pl',
  intlLocale: 'pl-PL',
  meta: {
    title: 'APZ — Archiwum Przypadkowych Zbieżności',
    description:
      'Archiwum Przypadkowych Zbieżności — fikcyjna instytucja dokumentująca niemożliwe zbieżności.',
  },
  ui: {
    skipToContent: 'Przejdź do treści',
    langSelectLabel: 'Język',
    institutionLabel: 'Instytucja poza czasem',
    siteTitle: 'Archiwum Przypadkowych Zbieżności',
    siteTagline:
      'Nie jest to blog, dashboard ani landing. To pole powiązań: węzły, linie i oś czasu — bo zbieżności rzadko układają się w menu.',
    viewModeAria: 'Tryb widoku',
    modeGraph: 'Mapa węzłów',
    modeList: 'Lista aktów',
    graphHint:
      'Kliknij węzeł, by otworzyć akt. Linie to powiązane ślady. Suwak na dole odsłania przeszłość.',
    footer: 'APZ · dokumentacja fikcji · bez cookies, bez newslettera, bez sensu gospodarczego',
    listHeading: 'Lista aktów (dostępna ścieżka)',
    listDescription:
      'Nawigacja klawiaturą i czytnikami: wybierz akt z listy — odpowiada węzłowi na mapie powiązań.',
    timeAxisTitle: 'Oś czasu archiwum',
    timeScrubSrLabel: 'Filtruj wpisy do wybranej daty końcowej',
    timeScrubHelp:
      'Przesuń suwak, by odsłonić tylko zbieżności „do” wybranego momentu — węzły poza zakresem gasną.',
    visibleUntilPrefix: 'Widoczne do: ',
    panelKicker: 'Akt archiwalny',
    close: 'Zamknij',
    closeAria: 'Zamknij panel szczegółów',
    relatedPrefix: 'Powiązane ślady: ',
    noRelated: 'Brak powiązań w grafie dla tego aktu.',
    langOptionEn: 'English',
    langOptionPl: 'Polski',
    langOptionNb: 'Norsk (bokmål)',
    canvasAriaLabel:
      'Mapa powiązań aktów archiwum. Użyj strzałek na mapie, myszy albo listy, by nawigować.',
    graphKeyboardHelp:
      'Strzałki w lewo i w prawo przechodzą między widocznymi węzłami. Enter otwiera akt.',
    graphLiveNode: 'Węzeł: {title}.',
    graphLiveNoNodes: 'Brak widocznych aktów przy obecnym filtrze daty.',
  },
  archiveById: {
    'apz-01': {
      title: 'Dwa bilety, jeden numer, zero logiki',
      excerpt:
        'W Gdyni i w Zaciszu w tym samym dniu wylosowano identyczny ciąg: 4-1-9-2-0. Obie loterie oficjalnie nie istniały.',
      body: 'Akta zawierają tylko koperty bez znaczków i pieczęć „NIE OTWIERAĆ PRZED ŚWITANIEM”. Świadkowie twierdzą, że słyszeli ten sam dźwięk zszywacza biurowego z odległości 320 km.',
    },
    'apz-02': {
      title: 'Zegar zatrzymał się na sekundzie, której nie było',
      excerpt:
        'Mechanizm pendulumowy wykazał 61. sekundę minuty. Serwis zegarmistrzowski zarejestrował brak uszkodzeń i brak istnienia firmy.',
      body: 'Na tarczy pojawiła się mikroskopijna cyfra „Ω”. Po odczytaniu na głos przez konserwatora, wszyscy obecni jednocześnie zapomnieli, jak się nazywają — na 4 minuty i 19 sekund.',
    },
    'apz-03': {
      title: 'Ten sam zapach deszczu w pomieszczeniu bez okien',
      excerpt:
        'Archiwum magazynowe, poziom -2. Trwała wilgotność 41%, temperatura stała od 40 lat. Zapach: „deszcz na gorącym asfalcie 1998”.',
      body: 'Próbki powietrza uległy samoczynnemu skondensowaniu w kształt małych parasoli. Parasole nie otwarto; pozostawiono je w szufladzie oznaczonej „jutro”.',
    },
    'apz-04': {
      title: 'List bez nadawcy, z datą urodzenia czytelnika',
      excerpt:
        'Koperta zawierała jedno zdanie: „Pamiętasz, co powiedziałeś, zanim się narodziłeś?”. Datownik pocztowy był pusty, ale tusz pachniał wanilią i ozonem.',
      body: 'Po zeskanowaniu pod UV pojawił się drugi tekst, widoczny tylko w lustrze: „Nie pamiętasz. To dobrze.”. List zniknął z koperty, pozostawiając identyczny papier o gramaturze -3.',
    },
    'apz-05': {
      title: 'Echo głosu, którego nikt nie nagrał',
      excerpt:
        'W pustym holu uniwersytetu odnotowano pogłos złożony z trzech sylab. Spektrum częstotliwości pokrywało się z głosem przyszłej lektor radiowej — zatrudnionej 11 lat później.',
      body: 'Nagranie ma długość 0 sekund i rozmiar 4,7 MB. Przy odtwarzaniu w słuchawkach słychać jedynie ciszę, która kiwa głową w rytm walca.',
    },
    'apz-06': {
      title: 'Mapa miasta, które jest tylko skrótem',
      excerpt:
        'Na planie z 1955 wszystkie ulice mają nazwy skrótów od jednego słowa: „NIE”. Skrzyżowania tworzą gwiazdozbiór Andromedy w skali 1:1 do nieba z 2044.',
      body: 'Przechodzień, który próbował iść prosto, wracał do punktu startu z dokładnością do atomu węgla. GPS pokazuje współrzędne moralne zamiast geograficznych.',
    },
    'apz-07': {
      title: 'Identyczne rany papieru na dwóch kontynentach',
      excerpt:
        'Dziura po dziuraczu w protokole z Chile idealnie pokrywa się z perforacją faktury z Finlandii — ta sama krzywizna, ten sam brak motywacji do istnienia.',
      body: 'Po nałożeniu transparencji oba dokumenty zlały się w jeden arkusz, na którym można przeczytać przepis na zupę, której nie wolno gotować w środy.',
    },
    'apz-08': {
      title: 'Jeden sen, osiem osób, ta sama scena 3. aktu',
      excerpt:
        'Osoby nieznające się nawzajem opisały identyczny teatr cieni: krzesło, wąż z papier-mâché, znak „wyjście” nad wejściem.',
      body: 'Po przebudzeniu każdy miał w kieszeni bilet bez daty. Pod UV bilet pokazywał współrzędne snu: szerokość snu, długość zmartwienia, wysokość śmiechu.',
    },
  },
};
