// Lernstand und Physik: reine Funktionen ohne DOM-Zugriff, damit testbar.
// Zustand S wird immer explizit übergeben; Zeit (now) und Zufall (rand) sind injizierbar.
import { TOPICS } from './content.js';
import { CIRCUITS } from './circuits.js';

export const PREFIX = 'STROM1:';

const pad2 = n => String(n).padStart(2, '0');
export const dkey = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

/* ---------- Lernstand ---------- */
export const newTopic = () => ({ read: 0, visits: 0 });

export function freshState(now = Date.now()) {
  const topics = {};
  for (const t of TOPICS) topics[t.id] = newTopic();
  return { v: 1, topics, ex: {}, lastBackup: 0, created: now };
}

/** Ergänzt fehlende Felder, damit ältere oder importierte Stände weiter funktionieren. */
export function migrate(o) {
  const f = freshState();
  if (!o || typeof o !== 'object' || !o.topics) return f;
  const topics = {};
  for (const t of TOPICS) topics[t.id] = { ...newTopic(), ...(o.topics[t.id] || {}) };
  return { ...f, ...o, topics, ex: { ...(o.ex || {}) } };
}

export function encodeBackup(S) {
  const bytes = new TextEncoder().encode(JSON.stringify(S));
  let bin = '';
  for (const b of bytes) bin += String.fromCharCode(b);
  return PREFIX + btoa(bin);
}

export function decodeBackup(str) {
  const t = String(str || '').trim().replace(/\s+/g, '');
  if (!t.startsWith(PREFIX)) throw new Error('format');
  const bin = atob(t.slice(PREFIX.length));
  const o = JSON.parse(new TextDecoder().decode(Uint8Array.from(bin, c => c.charCodeAt(0))));
  if (!o || !o.topics) throw new Error('inhalt');
  return migrate(o);
}

/** Neuer Zustand mit einem weiteren Besuch des Themas. */
export function visit(S, id) {
  const t = S.topics[id];
  if (!t) return S;
  return { ...S, topics: { ...S.topics, [id]: { ...t, visits: t.visits + 1 } } };
}

/** Neuer Zustand mit dem Thema als gelesen (now) bzw. ungelesen (0) markiert. */
export function setRead(S, id, read, now = Date.now()) {
  const t = S.topics[id];
  if (!t) return S;
  return { ...S, topics: { ...S.topics, [id]: { ...t, read: read ? now : 0 } } };
}

export const progress = S => {
  const ids = Object.keys(S.topics);
  return { done: ids.filter(id => S.topics[id].read).length, total: ids.length };
};

/** Neuer Zustand nach einem abgeschlossenen Übungsdurchgang (score von total richtig). */
export function recordExercise(S, id, score, total, now = Date.now()) {
  const prev = S.ex[id] || { best: 0, done: 0, tries: 0 };
  const ratio = total > 0 ? Math.min(1, score / total) : 1;
  return { ...S, ex: { ...S.ex, [id]: { best: Math.max(prev.best, ratio), done: now, tries: prev.tries + 1 } } };
}

export const exerciseProgress = (S, topic) => ({
  done: topic.exercises.filter(e => S.ex[e.id]).length,
  total: topic.exercises.length,
});

/* ---------- Hilfsfunktionen ---------- */
export function shuffle(arr, rand = Math.random) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
const pick = (arr, rand) => arr[Math.floor(rand() * arr.length)];

/** Zahl deutsch formatiert, höchstens `dec` Nachkommastellen, ohne überflüssige Nullen */
export function fmt(x, dec = 3) {
  const f = 10 ** dec;
  return String(Math.round(x * f) / f).replace('.', ',');
}
/** Zahl mit genau `dec` Nachkommastellen (für Messgeräte) */
export const fmtFixed = (x, dec) => x.toFixed(dec).replace('.', ',');

export function parseNum(s) {
  const t = String(s ?? '').trim().replace(/\s/g, '').replace(',', '.');
  if (!/^-?\d*\.?\d+$/.test(t)) return NaN;
  return Number(t);
}

/* ---------- Schaltungen (Knotenpotentialverfahren) ---------- */
// Modell: ideale Batterie mit sehr kleinem Innenwiderstand, Lampen mit konstantem Widerstand
export const U_BAT = 6;
export const R_LAMP = 30;
export const P_LAMP = U_BAT ** 2 / R_LAMP;   // Leistung einer Lampe allein an der Batterie
const R_INT = 0.01;
const COND = { wire: 1e4, amp: 1e3, volt: 1e-7, lamp: 1 / R_LAMP, motor: 1 / R_LAMP };
const LEAK = 1e-10;                           // hält offene Knoten mathematisch definiert

/**
 * Wirksames Bauteil unter dem Zustand st = { switches: {Label: geschlossen}, placed: {Label: Schalter gesetzt} }.
 * Liefert { kind, g, closed } mit kind = Zeichentyp und g = Leitwert in S (0 = offen).
 */
export function effective([type, , , o = {}], st = {}) {
  if (type === 'slot') {
    if (!st.placed?.[o.label]) return { kind: 'slot', g: COND.wire };
    const closed = st.switches?.[o.label] ?? true;
    return { kind: 'switch', g: closed ? COND.wire : 0, closed };
  }
  if (type === 'switch') {
    const closed = st.switches?.[o.label] ?? o.closed ?? false;
    return { kind: 'switch', g: closed ? COND.wire : 0, closed };
  }
  if (type === 'toggle') {   // Stellung: false = oberer Kontakt (b), true = unterer Kontakt (c2)
    const lower = st.switches?.[o.label] ?? o.lower ?? false;
    return { kind: 'toggle', g: lower ? 0 : COND.wire, lower };
  }
  if (type === 'res') return { kind: 'res', g: 1 / (o.r || 100) };
  if (type === 'bat') return { kind: 'bat', g: 1 / R_INT };
  return { kind: type, g: COND[type] };
}

function linsolve(A, b) {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);
  for (let c = 0; c < n; c++) {
    let p = c;
    for (let r = c + 1; r < n; r++) if (Math.abs(M[r][c]) > Math.abs(M[p][c])) p = r;
    [M[c], M[p]] = [M[p], M[c]];
    for (let r = c + 1; r < n; r++) {
      const f = M[r][c] / M[c][c];
      if (f) for (let k = c; k <= n; k++) M[r][k] -= f * M[c][k];
    }
  }
  const x = new Array(n).fill(0);
  for (let r = n - 1; r >= 0; r--) {
    let s = M[r][n];
    for (let k = r + 1; k < n; k++) s -= M[r][k] * x[k];
    x[r] = s / M[r][r];
  }
  return x;
}

/**
 * Berechnet Potentiale, Ströme (von a nach b) und Lampenleistungen.
 * @returns {{ V: Object<string, number>, I: number[], P: number[] }}
 */
export function solve(c, st = {}) {
  const els = c.e.map(e => ({ e, ...effective(e, st) }));
  // Wechselschalter: zweiter Kontakt als zusätzliches Bauteil hinten anhängen, damit die Indizes von c.e gleich bleiben
  for (const x of [...els]) {
    if (x.e[0] === 'toggle') els.push({ e: ['switch', x.e[1], x.e[3].c2], kind: 'switch', g: x.lower ? COND.wire : 0 });
  }
  const bat = c.e.find(e => e[0] === 'bat');
  const ground = bat ? bat[1] : c.e[0][1];
  const ids = Object.keys(c.n).filter(k => k !== ground);
  const idx = Object.fromEntries(ids.map((k, i) => [k, i]));
  const n = ids.length;
  const A = Array.from({ length: n }, () => new Array(n).fill(0));
  const rhs = new Array(n).fill(0);
  ids.forEach((_, i) => { A[i][i] += LEAK; });
  const stamp = (a, b, g) => {
    const i = idx[a], j = idx[b];
    if (i !== undefined) A[i][i] += g;
    if (j !== undefined) A[j][j] += g;
    if (i !== undefined && j !== undefined) { A[i][j] -= g; A[j][i] -= g; }
  };
  for (const { e: [type, a, b], g } of els) {
    if (!g) continue;
    stamp(a, b, g);
    if (type === 'bat') {   // Ersatzstromquelle: treibt U/R_INT vom Minus- zum Pluspol
      if (idx[b] !== undefined) rhs[idx[b]] += U_BAT * g;
      if (idx[a] !== undefined) rhs[idx[a]] -= U_BAT * g;
    }
  }
  const x = linsolve(A, rhs);
  const V = { [ground]: 0 };
  ids.forEach((k, i) => { V[k] = x[i]; });
  const I = els.map(({ e: [type, a, b], g }) => (type === 'bat' ? g * (U_BAT - (V[b] - V[a])) : g * (V[a] - V[b])));
  const P = els.map(({ e: [type], g }, i) => (type === 'lamp' && g ? I[i] ** 2 / g : 0));
  return { V, I, P };
}

/** Helligkeit 0 … 1 relativ zu einer Lampe allein an der Batterie */
export const glow = P => Math.min(1, P / P_LAMP);
export const isOn = P => P > 0.1 * P_LAMP;

/** Lampenleistungen nach Label, z. B. { L1: 0.3, L2: 0.3 } */
export function lampPowers(c, st = {}) {
  const { P } = solve(c, st);
  const out = {};
  c.e.forEach(([type, , , o = {}], i) => { if (type === 'lamp') out[o.label] = P[i]; });
  return out;
}

/**
 * Bauauftrag: Beide Lampen leuchten, wenn alle Schalter zu sind, und L2 lässt sich allein ausschalten, während L1 leuchtet.
 * placed: Labels der Bauplätze mit Schalter.
 */
export function checkBuild(circuitId, placed) {
  const c = CIRCUITS[circuitId];
  const pl = Object.fromEntries(placed.map(l => [l, true]));
  if (!placed.length) return { ok: false, reason: 'none' };
  const states = [];
  for (let m = 0; m < 2 ** placed.length; m++) {
    const switches = Object.fromEntries(placed.map((l, i) => [l, !!(m & (1 << i))]));
    states.push(lampPowers(c, { placed: pl, switches }));
  }
  const all = states[2 ** placed.length - 1];
  if (!isOn(all.L1) || !isOn(all.L2)) return { ok: false, reason: 'dark' };
  if (!states.some(p => isOn(p.L1) && !isOn(p.L2))) return { ok: false, reason: 'together' };
  return { ok: true };
}

/**
 * Wahrheitstabelle: für jede Kombination der Schalter (false/true) ob die Lampe L leuchtet.
 * Bei Schaltern heißt true „geschlossen“, bei Wechselschaltern „unten“.
 */
export function truthTable(circuitId, labels = ['S1', 'S2']) {
  const c = CIRCUITS[circuitId];
  const rows = [];
  for (let m = 0; m < 2 ** labels.length; m++) {
    const s = labels.map((_, i) => !!(m & (1 << (labels.length - 1 - i))));
    const switches = Object.fromEntries(labels.map((l, i) => [l, s[i]]));
    rows.push({ s, on: isOn(lampPowers(c, { switches }).L) });
  }
  return rows;
}

/* ---------- Kennlinien ---------- */
export const R_WIRE = 40;
export const wireCurrent = U => U / R_WIRE;
// Glühlampe 12 V / 0,25 A: kalt deutlich kleinerer Widerstand, I wächst etwa mit U^0,55
export const lampCurrent = U => (U <= 0 ? 0 : 0.25 * (U / 12) ** 0.55);

/* ---------- Rechenaufgaben ---------- */
/** Prüft eine Eingabe gegen eine Aufgabe mit relativer bzw. absoluter Toleranz */
export function checkAnswer(input, task) {
  const x = parseNum(input);
  if (Number.isNaN(x)) return null;
  return Math.abs(x - task.answer) <= Math.max(task.rel * Math.abs(task.answer), task.abs || 0);
}

function genOhm(rand) {
  for (;;) {
    const R = pick([10, 20, 25, 40, 50, 100, 150, 200, 500, 1000], rand);
    const I = pick([0.01, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.5, 1], rand);
    const U = Math.round(R * I * 1000) / 1000;
    if (U < 1 || U > 230) continue;
    const kind = pick(['I', 'U', 'R'], rand);
    const milli = I < 0.1;
    const Is = milli ? `${fmt(I * 1000)} mA` : `${fmt(I)} A`;
    if (kind === 'I') {
      return { text: `An einem Widerstand von ${fmt(R)} Ω liegt eine Spannung von ${fmt(U)} V. Wie groß ist die Stromstärke?`,
        unit: milli ? 'mA' : 'A', answer: milli ? I * 1000 : I, rel: 0.01,
        solution: `I = U / R = ${fmt(U)} V / ${fmt(R)} Ω = ${Is}` };
    }
    if (kind === 'U') {
      return { text: `Durch einen Widerstand von ${fmt(R)} Ω fließt ein Strom von ${Is}. Welche Spannung liegt an?`,
        unit: 'V', answer: U, rel: 0.01,
        solution: `U = R · I = ${fmt(R)} Ω · ${fmt(I)} A = ${fmt(U)} V${milli ? ` (${Is} = ${fmt(I)} A)` : ''}` };
    }
    return { text: `Bei einer Spannung von ${fmt(U)} V fließt ein Strom von ${Is}. Wie groß ist der Widerstand?`,
      unit: 'Ω', answer: R, rel: 0.01,
      solution: `R = U / I = ${fmt(U)} V / ${fmt(I)} A = ${fmt(R)} Ω${milli ? ` (${Is} = ${fmt(I)} A)` : ''}` };
  }
}

export const DEVICES = [
  { n: 'Ein Föhn', p: 2000 }, { n: 'Ein Wasserkocher', p: 2200 }, { n: 'Ein Staubsauger', p: 800 },
  { n: 'Ein Fernseher', p: 100 }, { n: 'Ein Laptop', p: 60 }, { n: 'Eine LED-Lampe', p: 8 },
];
export const PRICE_CT = 35;

function genPower(rand) {
  const d = pick(DEVICES, rand);
  const kind = pick(['P', 'I', 'E', 'cost'], rand);
  if (kind === 'P') {
    const I = Math.round((d.p / 230) * 100) / 100;
    const P = 230 * I;
    return { text: `${d.n} ist an 230 V angeschlossen. Es fließt ein Strom von ${fmt(I)} A. Wie groß ist die Leistung?`,
      unit: 'W', answer: P, rel: 0.01, solution: `P = U · I = 230 V · ${fmt(I)} A = ${fmt(P, 1)} W` };
  }
  if (kind === 'I') {
    const I = d.p / 230;
    return { text: `${d.n} hat eine Leistung von ${fmt(d.p)} W und läuft an 230 V. Wie groß ist die Stromstärke?`,
      unit: 'A', answer: I, rel: 0.02, abs: 0.005, solution: `I = P / U = ${fmt(d.p)} W / 230 V ≈ ${fmt(I, 2)} A` };
  }
  const small = d.p < 500;
  const min = small ? pick([120, 180, 240, 300], rand) : pick([6, 10, 15, 30, 45, 60], rand);
  const h = min / 60;
  const E = (d.p / 1000) * h;
  const tTxt = min >= 120 ? `${fmt(h)} Stunden` : `${min} Minuten`;
  const eSol = `E = P · t = ${fmt(d.p / 1000)} kW · ${fmt(h)} h = ${fmt(E)} kWh`;
  if (kind === 'E') {
    return { text: `${d.n} (${fmt(d.p)} W) läuft ${tTxt} lang. Wie viel Energie wird umgewandelt? Antwort in kWh.`,
      unit: 'kWh', answer: E, rel: 0.01, abs: 0.001, solution: eSol };
  }
  const ct = E * PRICE_CT;
  return { text: `${d.n} (${fmt(d.p)} W) läuft ${tTxt} lang. Was kostet das bei ${PRICE_CT} ct pro kWh? Antwort in Cent.`,
    unit: 'ct', answer: ct, rel: 0.02, abs: 0.1, solution: `${eSol}; Kosten = ${fmt(E)} kWh · ${PRICE_CT} ct/kWh ≈ ${fmt(ct, 1)} ct` };
}

export const GENERATORS = { ohm: genOhm, power: genPower };

export function makeTasks(gen, count, rand = Math.random) {
  return Array.from({ length: count }, () => GENERATORS[gen](rand));
}
