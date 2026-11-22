// Lerninhalte: Themen und Merksätze. Reine Daten, kein DOM.
// Merksätze sind ein Entwurf und mit Schulbuch bzw. Heft abzugleichen.

/**
 * @typedef {{ id: string, title: string, short: string, merk: string[], ideas: string[] }} Topic
 * merk:  Merksätze, wie sie ins Heft gehören
 * ideas: geplante Experimente und Übungen (noch nicht umgesetzt)
 */

/** @type {Topic[]} */
export const TOPICS = [
  {
    id: 'ladung',
    title: 'Elektrische Ladung',
    short: 'Reibung, Luftballons, Bandgenerator',
    merk: [
      'Es gibt zwei Arten elektrischer Ladung: positive und negative.',
      'Gleichnamige Ladungen stoßen sich ab, ungleichnamige Ladungen ziehen sich an.',
      'Beim Reiben gehen Elektronen von einem Körper auf den anderen über. Ladung wird dabei nicht erzeugt, sondern getrennt.',
      'Ein Körper mit Elektronenüberschuss ist negativ geladen, ein Körper mit Elektronenmangel positiv.',
      'Die Einheit der Ladung Q ist 1\u00a0Coulomb (1\u00a0C).',
    ],
    ideas: [
      'Zwei geriebene Luftballons stoßen sich ab, Ballon und Wolltuch ziehen sich an',
      'Geladener Ballon an der Wand (Influenz)',
      'Bandgenerator: Haare stehen ab, Funken, Glimmlampe zeigt die Ladungsart',
      'Elektroskop',
    ],
  },
  {
    id: 'modell',
    title: 'Atome und Leiter',
    short: 'Atomrumpf-Elektronen-Modell',
    merk: [
      'Ein Atom besteht aus einem positiv geladenen Kern und einer Hülle aus negativ geladenen Elektronen. Nach außen ist es elektrisch neutral.',
      'In einem Metall bilden die positiv geladenen Atomrümpfe ein festes Gitter. Dazwischen bewegen sich frei bewegliche Elektronen.',
      'Leiter enthalten frei bewegliche Ladungsträger, Isolatoren nicht.',
      'Elektrischer Strom ist die gerichtete Bewegung von Ladungsträgern.',
    ],
    ideas: [
      'Animation: Elektronen bewegen sich ungeordnet, mit angelegter Spannung zusätzlich gerichtet',
      'Sortierspiel Leiter oder Isolator',
    ],
  },
  {
    id: 'stromkreis',
    title: 'Der Stromkreis',
    short: 'Quelle, Leiter, Verbraucher, Schalter',
    merk: [
      'Strom fließt nur in einem geschlossenen Stromkreis aus Quelle, Leitungen und Verbraucher.',
      'Die technische Stromrichtung verläuft außerhalb der Quelle von Plus nach Minus. Die Elektronen bewegen sich von Minus nach Plus.',
      'Im Verbraucher wird kein Strom verbraucht. Umgewandelt wird Energie.',
    ],
    ideas: [
      'Schaltzeichen-Memory',
      'Leuchtet die Lampe? Schaltungen beurteilen',
    ],
  },
  {
    id: 'stromstaerke',
    title: 'Stromstärke',
    short: 'Ladung pro Zeit, Amperemeter',
    merk: [
      'Die Stromstärke I gibt an, wie viel Ladung in einer Sekunde durch einen Leiterquerschnitt fließt: I = Q / t.',
      'Die Einheit der Stromstärke ist 1\u00a0Ampere (1\u00a0A). Es gilt 1\u00a0A = 1\u00a0C / s.',
      'Die Stromstärke wird mit einem Amperemeter gemessen. Es wird in Reihe zum Bauteil geschaltet.',
      'Im unverzweigten Stromkreis ist die Stromstärke an jeder Stelle gleich groß.',
    ],
    ideas: [
      'Vorhersage: Ist die Stromstärke vor und hinter der Lampe gleich?',
      'Amperemeter richtig einbauen',
    ],
  },
  {
    id: 'spannung',
    title: 'Spannung',
    short: 'Antrieb des Stroms, Voltmeter',
    merk: [
      'Die Spannung U ist der Antrieb für den elektrischen Strom. Sie entsteht durch Ladungstrennung in der Quelle.',
      'Die Einheit der Spannung ist 1\u00a0Volt (1\u00a0V).',
      'Die Spannung wird mit einem Voltmeter gemessen. Es wird parallel zum Bauteil geschaltet.',
      'Spannung liegt immer zwischen zwei Punkten an. An einer Batterie liegt sie auch dann an, wenn kein Strom fließt.',
    ],
    ideas: [
      'Voltmeter richtig einbauen',
      'Typische Spannungen zuordnen: Batterie, Akku, Steckdose, Blitz',
    ],
  },
  {
    id: 'widerstand',
    title: 'Widerstand und Ohmsches Gesetz',
    short: 'R = U / I, Kennlinien',
    merk: [
      'Der elektrische Widerstand R gibt an, wie stark ein Bauteil den Strom hemmt: R = U / I.',
      'Die Einheit des Widerstands ist 1\u00a0Ohm (1\u00a0Ω). Es gilt 1\u00a0Ω = 1\u00a0V / A.',
      'Ohmsches Gesetz: Bei konstanter Temperatur ist die Stromstärke durch einen metallischen Leiter proportional zur Spannung.',
      'Ein Draht hat einen größeren Widerstand, wenn er länger oder dünner ist. Außerdem hängt der Widerstand vom Material ab.',
    ],
    ideas: [
      'U-I-Kennlinie aus Messwerten zeichnen: Widerstand und Glühlampe im Vergleich',
      'Rechentraining mit Einheiten',
    ],
  },
  {
    id: 'schaltungen',
    title: 'Reihen- und Parallelschaltung',
    short: 'Regeln für I, U und R',
    merk: [
      'Reihenschaltung: Die Stromstärke ist überall gleich. Die Teilspannungen addieren sich zur Gesamtspannung. Die Widerstände addieren sich.',
      'Parallelschaltung: An allen Zweigen liegt dieselbe Spannung. Die Teilströme addieren sich zum Gesamtstrom. Der Gesamtwiderstand ist kleiner als jeder Einzelwiderstand.',
    ],
    ideas: [
      'Welche Lampe leuchtet heller? (Vorhersagen, dann simulieren)',
      'Bauauftrag: zwei Lampen, eine einzeln schaltbar',
    ],
  },
  {
    id: 'energie',
    title: 'Energie und Leistung',
    short: 'P = U · I, Kilowattstunden',
    merk: [
      'Die elektrische Leistung P gibt an, wie viel Energie ein Gerät pro Sekunde umwandelt: P = U · I.',
      'Die Einheit der Leistung ist 1\u00a0Watt (1\u00a0W). Es gilt 1\u00a0W = 1 V · A.',
      'Die umgewandelte Energie ist E = P · t. Im Haushalt wird sie in Kilowattstunden (kWh) angegeben.',
    ],
    ideas: [
      'Was kostet eine Stunde Föhnen?',
    ],
  },
  {
    id: 'sicherheit',
    title: 'Sicherheit',
    short: 'Kurzschluss, Sicherung, Schutzleiter',
    merk: [
      'Bei einem Kurzschluss ist der Widerstand sehr klein und die Stromstärke sehr groß. Leitungen können heiß werden und einen Brand auslösen.',
      'Eine Sicherung unterbricht den Stromkreis, wenn die Stromstärke zu groß wird.',
      'Der Schutzleiter leitet Strom bei einem Defekt am Gehäuse ab, sodass die Sicherung auslöst.',
      'Die Netzspannung von 230\u00a0V ist lebensgefährlich. Nie an Steckdosen oder Leitungen experimentieren.',
    ],
    ideas: [
      'Gefahrensituationen im Haushalt erkennen',
    ],
  },
];

export const topicById = id => TOPICS.find(t => t.id === id);
