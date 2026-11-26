// Lerninhalte: Themen und Merksätze. Reine Daten, kein DOM.
// Merksätze sind ein Entwurf und mit Schulbuch bzw. Heft abzugleichen.

import { EX } from './exercises-data.js';

/**
 * @typedef {{ id: string, title: string, short: string, intro: string[], merk: string[], exercises: object[] }} Topic
 * intro:     kurze Einleitung mit Alltagsbezug (höchstens drei Sätze)
 * merk:      Merksätze, wie sie ins Heft gehören
 * exercises: Übungen und Experimente (siehe exercises-data.js)
 */

/** @type {Topic[]} */
export const TOPICS = [
  {
    id: 'ladung',
    title: 'Elektrische Ladung',
    short: 'Reibung, Luftballons, Bandgenerator',
    intro: ['Hast du schon mal einen kleinen Schlag an der Türklinke bekommen, nachdem du über einen Teppich gelaufen bist?', 'Oder sind dir beim Ausziehen eines Pullis die Haare zu Berge gestanden?', 'Dahinter steckt elektrische Ladung, und darum geht es hier.'],
    merk: [
      'Es gibt zwei Arten elektrischer Ladung: positive und negative.',
      'Gleichnamige Ladungen stoßen sich ab, ungleichnamige Ladungen ziehen sich an.',
      'Beim Reiben gehen Elektronen von einem Körper auf den anderen über. Ladung wird dabei nicht erzeugt, sondern getrennt.',
      'Ein Körper mit zu vielen Elektronen (Elektronenüberschuss) ist negativ geladen, ein Körper mit zu wenigen Elektronen (Elektronenmangel) positiv.',
      'Die Einheit der Ladung Q ist 1\u00a0Coulomb (1\u00a0C).',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['zwei', 'drei', 'vier'], ['stoßen', 'ziehen', 'drehen'], ['getrennt', 'erzeugt', 'vernichtet'], ['negativ', 'positiv', 'neutral'], ['Coulomb', 'Ampere', 'Volt']],
    exercises: EX.ladung,
  },
  {
    id: 'modell',
    title: 'Atome und Leiter',
    short: 'Atomrumpf-Elektronen-Modell',
    intro: ['Warum leitet ein Kupferkabel Strom, ein Holzstab aber nicht?', 'Um das zu verstehen, schauen wir ganz nah hinein, bis zu den Atomen.', 'Dort entdeckst du, was beim Strom eigentlich fließt.'],
    merk: [
      'Ein Atom besteht aus einem positiv geladenen Kern und einer Hülle aus negativ geladenen Elektronen. Nach außen ist es elektrisch neutral.',
      'In einem Metall bilden die positiv geladenen Atomrümpfe ein festes Gitter. Dazwischen bewegen sich frei bewegliche Elektronen.',
      'Leiter enthalten frei bewegliche Ladungsträger, zum Beispiel freie Elektronen. Isolatoren haben keine.',
      'Elektrischer Strom ist die gerichtete Bewegung von Ladungsträgern.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['neutral', 'positiv', 'negativ'], ['Atomrümpfe', 'Elektronen', 'Moleküle'], ['freie Elektronen', 'feste Atomkerne', 'kleine Luftblasen'], ['gerichtete', 'ungeordnete', 'schnelle']],
    exercises: EX.modell,
  },
  {
    id: 'stromkreis',
    title: 'Der Stromkreis',
    short: 'Quelle, Leiter, Verbraucher, Schalter',
    intro: ['Eine Taschenlampe leuchtet nur, wenn alles richtig verbunden ist.', 'Hier lernst du, was ein Stromkreis braucht und in welche Richtung der Strom fließt.', 'Und du erfährst, was in einer Lampe wirklich verbraucht wird.'],
    merk: [
      'Strom fließt nur in einem geschlossenen Stromkreis aus Quelle (z. B. Batterie), Leitungen und Verbraucher (z. B. Lampe).',
      'Die Elektronen bewegen sich außerhalb der Quelle von Minus nach Plus. Die technische Stromrichtung wurde früher andersherum festgelegt: von Plus nach Minus.',
      'Eine Lampe verbraucht keinen Strom: Es fließt genauso viel hinein wie heraus. Umgewandelt wird Energie.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['geschlossenen', 'offenen', 'kurzen'], ['Minus nach Plus', 'Kern zur Hülle', 'oben nach unten'], ['Energie', 'Elektronen', 'Ladung']],
    exercises: EX.stromkreis,
  },
  {
    id: 'stromstaerke',
    title: 'Stromstärke',
    short: 'Ladung pro Zeit, Amperemeter',
    intro: ['Manche Geräte brauchen viel Strom, andere nur wenig.', 'Aber wie misst man, wie viel Strom fließt?', 'Hier lernst du die Stromstärke kennen und das Messgerät dafür.'],
    merk: [
      'Die Stromstärke I gibt an, wie viel Ladung in einer Sekunde an einer Stelle des Leiters vorbeifließt.',
      'Die Einheit der Stromstärke ist 1\u00a0Ampere (1\u00a0A).',
      'Die Stromstärke wird mit einem Amperemeter gemessen. Es wird in Reihe zum Bauteil geschaltet.',
      'In einem Stromkreis ohne Abzweigungen (unverzweigt) ist die Stromstärke an jeder Stelle gleich groß.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['Sekunde', 'Stunde', 'Minute'], ['Ampere', 'Volt', 'Coulomb'], ['Reihe', 'Ruhe', 'Mitte'], ['gleich groß', 'immer kleiner', 'immer größer']],
    exercises: EX.stromstaerke,
  },
  {
    id: 'spannung',
    title: 'Spannung',
    short: 'Antrieb des Stroms, Voltmeter',
    intro: ['Auf jeder Batterie steht eine Zahl mit V, zum Beispiel 1,5 V. Das ist die Spannung.', 'Hier erfährst du, was Spannung bedeutet und wie man sie misst.', 'Und warum die Steckdose viel gefährlicher ist als eine Batterie.'],
    merk: [
      'Die Spannung U ist der Antrieb für den elektrischen Strom. Sie entsteht, weil in der Batterie Plus- und Minusladung getrennt sind.',
      'Die Einheit der Spannung ist 1\u00a0Volt (1\u00a0V).',
      'Die Spannung wird mit einem Voltmeter gemessen. Es wird parallel zum Bauteil geschaltet.',
      'Spannung liegt immer zwischen zwei Punkten an. An einer Batterie liegt sie auch dann an, wenn kein Strom fließt.',
      'Wassermodell: Die Spannung ist wie der Druckunterschied einer Pumpe, die Stromstärke wie die Wassermenge pro Sekunde.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['Antrieb', 'Verbrauch', 'Speicher'], ['Volt', 'Ampere', 'Coulomb'], ['parallel', 'in Reihe', 'quer'], ['zwei', 'drei', 'vier'], ['Druckunterschied', 'Rohrlänge', 'Wasserrad']],
    exercises: EX.spannung,
  },
  {
    id: 'widerstand',
    title: 'U-I-Kennlinien',
    short: 'Konstantandraht und Glühlampe im Vergleich',
    intro: ['Nicht jedes Bauteil lässt den Strom gleich gut durch.', 'Hier misst du, wie die Stromstärke wächst, wenn du die Spannung erhöhst.', 'Dabei vergleichst du einen Draht mit einer Glühlampe und findest heraus, warum sie sich unterschiedlich verhalten.'],
    merk: [
      'Eine U-I-Kennlinie zeigt, wie die Stromstärke in einem Bauteil von der angelegten Spannung abhängt.',
      'Beim Konstantandraht ist die Kennlinie eine Ursprungsgerade: Doppelte Spannung bedeutet doppelte Stromstärke.',
      'Bei der Glühlampe wird die Kennlinie immer flacher, weil der heiße Glühdraht den Strom stärker bremst.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['Spannung', 'Temperatur', 'Länge'], ['Ursprungsgerade', 'flache Kurve', 'Waagerechte'], ['heiße', 'kalte', 'dünne']],
    exercises: EX.widerstand,
  },
  {
    id: 'schaltungen',
    title: 'Reihen- und Parallelschaltung',
    short: 'Regeln für Stromstärke und Spannung',
    intro: ['In einer Lichterkette, im Auto oder im Haus hängen viele Lampen an einer Quelle.', 'Man kann sie hintereinander oder nebeneinander anschließen.', 'Hier lernst du, was dabei mit Helligkeit, Strom und Spannung passiert.'],
    merk: [
      'Reihenschaltung: Die Stromstärke ist überall gleich. Die Teilspannungen addieren sich zur Gesamtspannung.',
      'Parallelschaltung: An allen Zweigen liegt dieselbe Spannung. Die Teilströme addieren sich zum Gesamtstrom.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['gleich', 'verschieden', 'null'], ['dieselbe', 'keine', 'die halbe']],
    exercises: EX.schaltungen,
  },
  {
    id: 'logik',
    title: 'Schalter: UND, ODER, Wechsel',
    short: 'Schalter in Reihe und parallel, Treppenhaus',
    intro: ['Die Klingel soll an zwei Türen funktionieren, das Treppenlicht unten und oben schaltbar sein.', 'Mit zwei Schaltern lassen sich ganz verschiedene Aufgaben lösen.', 'Hier lernst du UND-, ODER- und Wechselschaltung kennen.'],
    merk: [
      'Zwei Schalter in Reihe bilden eine UND-Schaltung: Die Lampe leuchtet nur, wenn Schalter 1 und Schalter 2 geschlossen sind.',
      'Zwei Schalter parallel bilden eine ODER-Schaltung: Die Lampe leuchtet, wenn Schalter 1 oder Schalter 2 oder beide geschlossen sind.',
      'Mit einer Wechselschaltung lässt sich eine Lampe von zwei Stellen aus ein- und ausschalten, zum Beispiel im Treppenhaus. Jedes Umlegen eines Schalters ändert den Zustand der Lampe.',
      'Eine Wahrheitstabelle zeigt für jede Schalterstellung, ob die Lampe leuchtet.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['UND', 'ODER', 'Wechsel'], ['ODER', 'UND', 'Wechsel'], ['zwei', 'drei', 'vier'], ['Schalterstellung', 'Stromstärke', 'Spannung']],
    exercises: EX.logik,
  },
  {
    id: 'sicherheit',
    title: 'Sicherheit',
    short: 'Kurzschluss, Sicherung, Schutzleiter',
    intro: ['Strom ist praktisch, kann aber gefährlich werden.', 'Hier lernst du, was bei einem Kurzschluss passiert und wie Sicherung und Schutzleiter dich schützen.', 'Und welche Regeln du im Alltag unbedingt beachten musst.'],
    merk: [
      'Bei einem Kurzschluss sind Plus- und Minuspol direkt verbunden, ohne Gerät dazwischen. Die Stromstärke wird sehr groß, Leitungen werden heiß und können brennen.',
      'Eine Sicherung unterbricht den Stromkreis, wenn die Stromstärke zu groß wird.',
      'Der grün-gelbe Schutzleiter leitet bei einem Defekt den Strom vom Gehäuse ab, sodass die Sicherung auslöst.',
      'Die Netzspannung von 230\u00a0V ist lebensgefährlich. Nie an Steckdosen oder Leitungen experimentieren.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['sehr groß', 'null', 'sehr klein'], ['unterbricht', 'verstärkt', 'speichert'], ['Gehäuse', 'Stecker', 'Schalter'], ['lebensgefährlich', 'harmlos', 'ungefährlich']],
    exercises: EX.sicherheit,
  },
];

export const topicById = id => TOPICS.find(t => t.id === id);

/** Geräte kurz erklärt; Übungen verweisen darauf mit `devices: [...]` */
export const DEVICES = {
  bandgen: { name: 'Bandgenerator', text: 'Ein Gummiband läuft über zwei Rollen und reibt dabei an der unteren Rolle. So wird Ladung getrennt, und das Band bringt sie nach oben in die große Metallkugel. Je länger man kurbelt, desto stärker wird die Kugel geladen.' },
  glimm: { name: 'Glimmlampe', text: 'Eine kleine Glasröhre mit Gas und zwei Metallstiften. Fließt kurz Ladung hindurch, leuchtet das Gas an dem Stift, der mit dem Minuspol verbunden ist. So erkennt man, ob etwas positiv oder negativ geladen ist.' },
  erdung: { name: 'Erdungskugel', text: 'Eine Metallkugel, die über ein Kabel mit der Erde verbunden ist. Kommt sie der geladenen Kugel nahe, fließt die Ladung als Funke ab.' },
  elektroskop: { name: 'Elektroskop', text: 'Ein Messgerät für Ladung: ein Metallstab mit einem Teller oben und einem leichten, drehbaren Zeiger. Kommt Ladung auf das Metall, sind Stab und Zeiger gleich geladen und stoßen sich ab. Je mehr Ladung, desto weiter schlägt der Zeiger aus.' },
  amp: { name: 'Amperemeter', text: 'Misst die Stromstärke in Ampere. Der Strom muss durch das Gerät hindurchfließen, deshalb baut man es in Reihe in den Stromkreis ein.' },
  volt: { name: 'Voltmeter', text: 'Misst die Spannung in Volt zwischen zwei Punkten. Man schließt es parallel an, also an beide Enden eines Bauteils.' },
  netzgeraet: { name: 'Netzgerät', text: 'Liefert eine einstellbare Spannung, zum Beispiel von 0 bis 12\u00a0V. Damit kann man im Versuch die Spannung Schritt für Schritt erhöhen.' },
  konstantan: { name: 'Konstantandraht', text: 'Ein Draht aus einer besonderen Metallmischung. Er bremst den Strom immer gleich stark, auch wenn er etwas warm wird. Daher kommt der Name.' },
  gluehlampe: { name: 'Glühlampe', text: 'In der Glaskugel steckt ein sehr dünner Draht aus Wolfram. Fließt Strom hindurch, wird er so heiß, dass er hell glüht.' },
  wechselschalter: { name: 'Wechselschalter', text: 'Ein Schalter mit drei Anschlüssen. Er verbindet den mittleren Anschluss entweder mit dem oberen oder mit dem unteren, wie eine Weiche bei der Eisenbahn.' },
  sicherung: { name: 'Sicherung', text: 'Ein Schutzschalter im Sicherungskasten. Wird die Stromstärke zu groß, unterbricht er den Stromkreis, bevor die Kabel zu heiß werden.' },
  schutzleiter: { name: 'Schutzleiter', text: 'Der grün-gelbe Draht im Kabel. Er verbindet das Metallgehäuse eines Geräts mit der Erde, damit bei einem Defekt der Strom dort abfließt und nicht durch dich.' },
};
