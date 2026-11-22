// Schaltpläne als reine Daten: dieselbe Definition dient zum Zeichnen und zum Berechnen.
// n: Knoten mit Koordinaten, e: Bauteile [Typ, Knoten a, Knoten b, Optionen]
// Typen: bat (a = Minuspol, b = Pluspol), wire, lamp, switch, res, amp, volt, slot (Bauplatz für einen Schalter),
// toggle (Wechselschalter: a = Mittelkontakt, b = oberer Kontakt, o.c2 = unterer Kontakt)

const L = 30, R = 210, M = 120, T = 30, B = 130;
const RECT = { a: [L, T], b: [R, T], c: [R, B], d: [L, B] };
const BYPASS = { ...RECT, b: [M + 40, T], c: [M + 40, B], b2: [R, T], c2: [R, B] };
const PAR = { a: [L, T], b: [M, T], b2: [R, T], c: [M, B], c2: [R, B], d: [L, B] };

export const CIRCUITS = {
  einfach: { n: RECT, e: [['bat', 'd', 'a'], ['wire', 'a', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']] },
  schalter_offen: { n: RECT, e: [['bat', 'd', 'a'], ['switch', 'a', 'b', { closed: false }], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']] },
  zwei_schalter: {
    n: { ...RECT, m: [M, T] },
    e: [['bat', 'd', 'a'], ['switch', 'a', 'm', { closed: true }], ['switch', 'm', 'b', { closed: false }], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']],
  },
  lampe_ueberbrueckt: {
    n: BYPASS,
    e: [['bat', 'd', 'a'], ['wire', 'a', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd'], ['wire', 'b', 'b2'], ['wire', 'b2', 'c2'], ['wire', 'c2', 'c']],
  },
  schalter_parallel: {
    n: BYPASS,
    e: [['bat', 'd', 'a'], ['wire', 'a', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd'], ['wire', 'b', 'b2'], ['switch', 'b2', 'c2', { closed: false }], ['wire', 'c2', 'c']],
  },
  amp_vor_nach: {
    n: { ...RECT, m: [M, T], k: [M, B] },
    e: [['bat', 'd', 'a'], ['amp', 'a', 'm', { label: 'A1' }], ['wire', 'm', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['amp', 'c', 'k', { label: 'A2' }], ['wire', 'k', 'd']],
  },
  amp_reihe: { n: RECT, e: [['bat', 'd', 'a'], ['amp', 'a', 'b', { label: 'A' }], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']] },
  amp_parallel: {
    n: BYPASS,
    e: [['bat', 'd', 'a'], ['wire', 'a', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd'], ['wire', 'b', 'b2'], ['amp', 'b2', 'c2', { label: 'A' }], ['wire', 'c2', 'c']],
  },
  volt_parallel: {
    n: BYPASS,
    e: [['bat', 'd', 'a'], ['wire', 'a', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd'], ['wire', 'b', 'b2'], ['volt', 'b2', 'c2', { label: 'V' }], ['wire', 'c2', 'c']],
  },
  volt_reihe: { n: RECT, e: [['bat', 'd', 'a'], ['volt', 'a', 'b', { label: 'V' }], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']] },
  einfach_amp: { n: RECT, e: [['bat', 'd', 'a'], ['amp', 'a', 'b', { label: 'A' }], ['lamp', 'b', 'c', { label: 'L1' }], ['wire', 'c', 'd']] },
  reihe2: {
    n: { ...RECT, m: [M, T] },
    e: [['bat', 'd', 'a'], ['lamp', 'a', 'm', { label: 'L1' }], ['lamp', 'm', 'b', { label: 'L2' }], ['wire', 'b', 'c'], ['wire', 'c', 'd']],
  },
  reihe2_schalter: {
    n: { ...RECT, m: [M, T] },
    e: [['bat', 'd', 'a'], ['lamp', 'a', 'm', { label: 'L1' }], ['lamp', 'm', 'b', { label: 'L2' }], ['switch', 'b', 'c', { closed: false }], ['wire', 'c', 'd']],
  },
  parallel2: {
    n: PAR,
    e: [['bat', 'd', 'a'], ['wire', 'a', 'b'], ['wire', 'b', 'b2'], ['lamp', 'b', 'c', { label: 'L1' }], ['lamp', 'b2', 'c2', { label: 'L2' }], ['wire', 'c2', 'c'], ['wire', 'c', 'd']],
  },
  parallel2_schalter: {
    n: PAR,
    e: [['bat', 'd', 'a'], ['wire', 'a', 'b'], ['switch', 'b', 'b2', { closed: false }], ['lamp', 'b', 'c', { label: 'L1' }], ['lamp', 'b2', 'c2', { label: 'L2' }], ['wire', 'c2', 'c'], ['wire', 'c', 'd']],
  },
  parallel2_amp: {
    n: PAR,
    e: [['bat', 'd', 'a'], ['amp', 'a', 'b', { label: 'A' }], ['wire', 'b', 'b2'], ['lamp', 'b', 'c', { label: 'L1' }], ['lamp', 'b2', 'c2', { label: 'L2' }], ['wire', 'c2', 'c'], ['wire', 'c', 'd']],
  },
  // Schalterlogik: UND (Reihe), ODER (parallel), Wechselschaltung
  und: {
    n: { ...RECT, m: [M, T] },
    e: [['bat', 'd', 'a'], ['switch', 'a', 'm', { label: 'S1', closed: false }], ['switch', 'm', 'b', { label: 'S2', closed: false }], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']],
  },
  oder: {
    n: { a: [L, T], p: [70, T], q: [170, T], p2: [70, 80], q2: [170, 80], b: [R, T], c: [R, B], d: [L, B] },
    e: [['bat', 'd', 'a'], ['wire', 'a', 'p'], ['switch', 'p', 'q', { label: 'S1', closed: false }], ['wire', 'p', 'p2'], ['switch', 'p2', 'q2', { label: 'S2', closed: false }],
      ['wire', 'q2', 'q'], ['wire', 'q', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']],
  },
  wechsel: {
    n: { a: [L, 50], w1: [72, 50], u1: [108, 26], v1: [108, 74], u2: [152, 26], v2: [152, 74], w2: [188, 50], b: [R, 50], c: [R, B], d: [L, B] },
    e: [['bat', 'd', 'a'], ['wire', 'a', 'w1'], ['toggle', 'w1', 'u1', { label: 'S1', c2: 'v1' }], ['wire', 'u1', 'u2'], ['wire', 'v1', 'v2'],
      ['toggle', 'w2', 'u2', { label: 'S2', c2: 'v2' }], ['wire', 'w2', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']],
  },
  // fehlerhaft: nur eine Verbindungsleitung zwischen den Wechselschaltern
  wechsel_falsch: {
    n: { a: [L, 50], w1: [72, 50], u1: [108, 26], v1: [108, 74], u2: [152, 26], v2: [152, 74], w2: [188, 50], b: [R, 50], c: [R, B], d: [L, B] },
    e: [['bat', 'd', 'a'], ['wire', 'a', 'w1'], ['toggle', 'w1', 'u1', { label: 'S1', c2: 'v1' }], ['wire', 'u1', 'u2'],
      ['toggle', 'w2', 'u2', { label: 'S2', c2: 'v2' }], ['wire', 'w2', 'b'], ['lamp', 'b', 'c', { label: 'L' }], ['wire', 'c', 'd']],
  },
  // Bauauftrag: Schalter dürfen auf die Bauplätze S1 bis S3 gesetzt werden
  bau_reihe: {
    n: { ...RECT, m: [M, T], k: [M, B] },
    e: [['bat', 'd', 'a'], ['lamp', 'a', 'm', { label: 'L1' }], ['lamp', 'm', 'b', { label: 'L2' }], ['slot', 'b', 'c', { label: 'S1' }], ['slot', 'c', 'k', { label: 'S2' }], ['slot', 'k', 'd', { label: 'S3' }]],
  },
  bau_parallel: {
    n: { a: [L, T], b: [M, T], b2: [R, T], x: [M, 88], x2: [R, 88], c: [M, B], c2: [R, B], d: [L, B] },
    e: [['bat', 'd', 'a'], ['slot', 'a', 'b', { label: 'S1' }], ['wire', 'b', 'b2'], ['lamp', 'b', 'x', { label: 'L1' }], ['slot', 'x', 'c', { label: 'S2' }],
      ['lamp', 'b2', 'x2', { label: 'L2' }], ['slot', 'x2', 'c2', { label: 'S3' }], ['wire', 'c2', 'c'], ['wire', 'c', 'd']],
  },
};

/** Einzelnes Schaltzeichen mit kurzen Anschlüssen, z. B. für das Memory */
export const symbolCircuit = type => ({ w: 100, h: 60, n: { a: [12, 30], b: [88, 30] }, e: [[type, 'a', 'b', type === 'switch' ? { closed: false } : {}]] });
