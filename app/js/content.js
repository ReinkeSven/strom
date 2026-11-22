// Lerninhalte: Themen und Merksätze. Reine Daten, kein DOM.
// Merksätze sind ein Entwurf und mit Schulbuch bzw. Heft abzugleichen.

import { EX } from './exercises-data.js';

/**
 * @typedef {{ id: string, title: string, short: string, merk: string[], exercises: object[] }} Topic
 * merk:      Merksätze, wie sie ins Heft gehören
 * exercises: Übungen und Experimente (siehe exercises-data.js)
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
    exercises: EX.ladung,
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
    exercises: EX.modell,
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
    exercises: EX.stromkreis,
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
    exercises: EX.stromstaerke,
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
      'Wassermodell: Die Spannung entspricht dem Druckunterschied, den eine Pumpe erzeugt, die Stromstärke der Wassermenge, die pro Sekunde durch das Rohr fließt. Wie jedes Modell hat es Grenzen.',
    ],
    exercises: EX.spannung,
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
    exercises: EX.widerstand,
  },
  {
    id: 'schaltungen',
    title: 'Reihen- und Parallelschaltung',
    short: 'Regeln für I, U und R',
    merk: [
      'Reihenschaltung: Die Stromstärke ist überall gleich. Die Teilspannungen addieren sich zur Gesamtspannung. Die Widerstände addieren sich.',
      'Parallelschaltung: An allen Zweigen liegt dieselbe Spannung. Die Teilströme addieren sich zum Gesamtstrom. Der Gesamtwiderstand ist kleiner als jeder Einzelwiderstand.',
    ],
    exercises: EX.schaltungen,
  },
  {
    id: 'logik',
    title: 'Schalter: UND, ODER, Wechsel',
    short: 'Schalter in Reihe und parallel, Treppenhaus',
    merk: [
      'Zwei Schalter in Reihe bilden eine UND-Schaltung: Die Lampe leuchtet nur, wenn Schalter 1 und Schalter 2 geschlossen sind.',
      'Zwei Schalter parallel bilden eine ODER-Schaltung: Die Lampe leuchtet, wenn Schalter 1 oder Schalter 2 oder beide geschlossen sind.',
      'Mit einer Wechselschaltung lässt sich eine Lampe von zwei Stellen aus ein- und ausschalten, zum Beispiel im Treppenhaus. Jedes Umlegen eines Schalters ändert den Zustand der Lampe.',
      'Eine Wahrheitstabelle zeigt für jede Schalterstellung, ob die Lampe leuchtet.',
    ],
    exercises: EX.logik,
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
    exercises: EX.energie,
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
    exercises: EX.sicherheit,
  },
];

export const topicById = id => TOPICS.find(t => t.id === id);
