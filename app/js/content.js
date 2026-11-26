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
      'Ein Körper mit Elektronenüberschuss ist negativ geladen, ein Körper mit Elektronenmangel positiv.',
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
      'Leiter enthalten frei bewegliche Ladungsträger, Isolatoren nicht.',
      'Elektrischer Strom ist die gerichtete Bewegung von Ladungsträgern.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['neutral', 'positiv', 'negativ'], ['Atomrümpfe', 'Elektronen', 'Moleküle'], ['Isolatoren', 'Metalle', 'Drähte'], ['gerichtete', 'ungeordnete', 'schnelle']],
    exercises: EX.modell,
  },
  {
    id: 'stromkreis',
    title: 'Der Stromkreis',
    short: 'Quelle, Leiter, Verbraucher, Schalter',
    intro: ['Eine Taschenlampe leuchtet nur, wenn alles richtig verbunden ist.', 'Hier lernst du, was ein Stromkreis braucht und in welche Richtung der Strom fließt.', 'Und du erfährst, was in einer Lampe wirklich verbraucht wird.'],
    merk: [
      'Strom fließt nur in einem geschlossenen Stromkreis aus Quelle, Leitungen und Verbraucher.',
      'Die technische Stromrichtung verläuft außerhalb der Quelle von Plus nach Minus. Die Elektronen bewegen sich von Minus nach Plus.',
      'Im Verbraucher wird kein Strom verbraucht. Umgewandelt wird Energie.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['geschlossenen', 'offenen', 'kurzen'], ['Minus nach Plus', 'Plus nach Minus', 'Kern zur Hülle'], ['Energie', 'Strom', 'Ladung']],
    exercises: EX.stromkreis,
  },
  {
    id: 'stromstaerke',
    title: 'Stromstärke',
    short: 'Ladung pro Zeit, Amperemeter',
    intro: ['Manche Geräte brauchen viel Strom, andere nur wenig.', 'Aber wie misst man, wie viel Strom fließt?', 'Hier lernst du die Stromstärke kennen und das Messgerät dafür.'],
    merk: [
      'Die Stromstärke I gibt an, wie viel Ladung in einer Sekunde durch einen Leiterquerschnitt fließt.',
      'Die Einheit der Stromstärke ist 1\u00a0Ampere (1\u00a0A).',
      'Die Stromstärke wird mit einem Amperemeter gemessen. Es wird in Reihe zum Bauteil geschaltet.',
      'Im unverzweigten Stromkreis ist die Stromstärke an jeder Stelle gleich groß.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['Sekunde', 'Stunde', 'Minute'], ['Ampere', 'Volt', 'Coulomb'], ['Reihe', 'Ruhe', 'Mitte'], ['gleich groß', 'kleiner', 'größer']],
    exercises: EX.stromstaerke,
  },
  {
    id: 'spannung',
    title: 'Spannung',
    short: 'Antrieb des Stroms, Voltmeter',
    intro: ['Auf jeder Batterie steht eine Zahl mit V, zum Beispiel 1,5 V. Das ist die Spannung.', 'Hier erfährst du, was Spannung bedeutet und wie man sie misst.', 'Und warum die Steckdose viel gefährlicher ist als eine Batterie.'],
    merk: [
      'Die Spannung U ist der Antrieb für den elektrischen Strom. Sie entsteht durch Ladungstrennung in der Quelle.',
      'Die Einheit der Spannung ist 1\u00a0Volt (1\u00a0V).',
      'Die Spannung wird mit einem Voltmeter gemessen. Es wird parallel zum Bauteil geschaltet.',
      'Spannung liegt immer zwischen zwei Punkten an. An einer Batterie liegt sie auch dann an, wenn kein Strom fließt.',
      'Wassermodell: Die Spannung entspricht dem Druckunterschied, den eine Pumpe erzeugt, die Stromstärke der Wassermenge, die pro Sekunde durch das Rohr fließt. Wie jedes Modell hat es Grenzen.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['Antrieb', 'Verbrauch', 'Speicher'], ['Volt', 'Ampere', 'Coulomb'], ['parallel', 'in Reihe', 'quer'], ['zwei', 'drei', 'vier'], ['Druckunterschied', 'Wassermenge', 'Rohrlänge']],
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
      'Bei einem Kurzschluss ist der Widerstand sehr klein und die Stromstärke sehr groß. Leitungen können heiß werden und einen Brand auslösen.',
      'Eine Sicherung unterbricht den Stromkreis, wenn die Stromstärke zu groß wird.',
      'Der Schutzleiter leitet Strom bei einem Defekt am Gehäuse ab, sodass die Sicherung auslöst.',
      'Die Netzspannung von 230\u00a0V ist lebensgefährlich. Nie an Steckdosen oder Leitungen experimentieren.',
    ],
    // Lückentext je Merksatz für den ADHD-Mode: [gesuchtes Wort, zwei falsche Antworten]
    cloze: [['sehr groß', 'null', 'sehr klein'], ['unterbricht', 'verstärkt', 'speichert'], ['Gehäuse', 'Stecker', 'Kabel'], ['lebensgefährlich', 'harmlos', 'ungefährlich']],
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
