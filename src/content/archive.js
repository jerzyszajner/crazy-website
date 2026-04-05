/** @typedef {{ id: string, title: string, date: string, relatedIds: string[], excerpt: string, body: string }} ArchiveEntry */

/** @type {ArchiveEntry[]} */
export const archive = [
  {
    id: 'apz-01',
    title: 'Dwa bilety, jeden numer, zero logiki',
    date: '1962-03-14',
    relatedIds: ['apz-03', 'apz-07'],
    excerpt:
      'W Gdyni i w Zaciszu w tym samym dniu wylosowano identyczny ciąg: 4-1-9-2-0. Obie loterie oficjalnie nie istniały.',
    body: 'Akta zawierają tylko koperty bez znaczków i pieczęć „NIE OTWIERAĆ PRZED ŚWITANIEM”. Świadkowie twierdzą, że słyszeli ten sam dźwięk zszywacza biurowego z odległości 320 km.',
  },
  {
    id: 'apz-02',
    title: 'Zegar zatrzymał się na sekundzie, której nie było',
    date: '1987-11-02',
    relatedIds: ['apz-05'],
    excerpt:
      'Mechanizm pendulumowy wykazał 61. sekundę minuty. Serwis zegarmistrzowski zarejestrował brak uszkodzeń i brak istnienia firmy.',
    body: 'Na tarczy pojawiła się mikroskopijna cyfra „Ω”. Po odczytaniu na głos przez konserwatora, wszyscy obecni jednocześnie zapomnieli, jak się nazywają — na 4 minuty i 19 sekund.',
  },
  {
    id: 'apz-03',
    title: 'Ten sam zapach deszczu w pomieszczeniu bez okien',
    date: '1974-06-21',
    relatedIds: ['apz-01', 'apz-06'],
    excerpt:
      'Archiwum magazynowe, poziom -2. Trwała wilgotność 41%, temperatura stała od 40 lat. Zapach: „deszcz na gorącym asfalcie 1998”.',
    body: 'Próbki powietrza uległy samoczynnemu skondensowaniu w kształt małych parasoli. Parasole nie otwarto; pozostawiono je w szufladzie oznaczonej „jutro”.',
  },
  {
    id: 'apz-04',
    title: 'List bez nadawcy, z datą urodzenia czytelnika',
    date: '2001-01-01',
    relatedIds: ['apz-08'],
    excerpt:
      'Koperta zawierała jedno zdanie: „Pamiętasz, co powiedziałeś, zanim się narodziłeś?”. Datownik pocztowy był pusty, ale tusz pachniał wanilią i ozonem.',
    body: 'Po zeskanowaniu pod UV pojawił się drugi tekst, widoczny tylko w lustrze: „Nie pamiętasz. To dobrze.”. List zniknął z koperty, pozostawiając identyczny papier o gramaturze -3.',
  },
  {
    id: 'apz-05',
    title: 'Echo głosu, którego nikt nie nagrał',
    date: '1995-09-09',
    relatedIds: ['apz-02', 'apz-08'],
    excerpt:
      'W pustym holu uniwersytetu odnotowano pogłos złożony z trzech sylab. Spektrum częstotliwości pokrywało się z głosem przyszłej lektor radiowej — zatrudnionej 11 lat później.',
    body: 'Nagranie ma długość 0 sekund i rozmiar 4,7 MB. Przy odtwarzaniu w słuchawkach słychać jedynie ciszę, która kiwa głową w rytm walca.',
  },
  {
    id: 'apz-06',
    title: 'Mapa miasta, które jest tylko skrótem',
    date: '1955-12-05',
    relatedIds: ['apz-03', 'apz-07'],
    excerpt:
      'Na planie z 1955 wszystkie ulice mają nazwy skrótów od jednego słowa: „NIE”. Skrzyżowania tworzą gwiazdozbiór Andromedy w skali 1:1 do nieba z 2044.',
    body: 'Przechodzień, który próbował iść prosto, wracał do punktu startu z dokładnością do atomu węgla. GPS pokazuje współrzędne moralne zamiast geograficznych.',
  },
  {
    id: 'apz-07',
    title: 'Identyczne rany papieru na dwóch kontynentach',
    date: '2012-07-19',
    relatedIds: ['apz-01', 'apz-06'],
    excerpt:
      'Dziura po dziuraczu w protokole z Chile idealnie pokrywa się z perforacją faktury z Finlandii — ta sama krzywizna, ten sam brak motywacji do istnienia.',
    body: 'Po nałożeniu transparencji oba dokumenty zlały się w jeden arkusz, na którym można przeczytać przepis na zupę, której nie wolno gotować w środy.',
  },
  {
    id: 'apz-08',
    title: 'Jeden sen, osiem osób, ta sama scena 3. aktu',
    date: '2020-02-29',
    relatedIds: ['apz-04', 'apz-05'],
    excerpt:
      'Osoby nieznające się nawzajem opisały identyczny teatr cieni: krzesło, wąż z papier-mâché, znak „wyjście” nad wejściem.',
    body: 'Po przebudzeniu każdy miał w kieszeni bilet bez daty. Pod UV bilet pokazywał współrzędne snu: szerokość snu, długość zmartwienia, wysokość śmiechu.',
  },
];

const byId = new Map(archive.map((e) => [e.id, e]));

export function getEntry(id) {
  return byId.get(id) ?? null;
}

export function getDateRange() {
  const times = archive.map((e) => new Date(e.date).getTime());
  return { min: Math.min(...times), max: Math.max(...times) };
}
