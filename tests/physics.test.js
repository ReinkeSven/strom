import { test } from 'node:test';
import assert from 'node:assert/strict';
import { CIRCUITS } from '../app/js/circuits.js';
import {
  solve, lampPowers, checkBuild, isOn, P_LAMP, U_BAT, R_LAMP, wireCurrent, lampCurrent,
  makeTasks, checkAnswer, parseNum, fmt, truthTable,
} from '../app/js/model.js';

const near = (a, b, tol = 0.01) => Math.abs(a - b) <= tol * Math.max(1, Math.abs(b));
const ampReading = (id, label) => {
  const c = CIRCUITS[id];
  const { I } = solve(c);
  return Math.abs(I[c.e.findIndex(e => e[3]?.label === label)]);
};

test('Einfacher Stromkreis: I = U / R', () => {
  assert.ok(near(ampReading('amp_reihe', 'A'), U_BAT / R_LAMP));
  assert.ok(near(lampPowers(CIRCUITS.einfach).L, P_LAMP));
});

test('Unverzweigter Kreis: Stromstärke vor und hinter der Lampe gleich', () => {
  assert.ok(near(ampReading('amp_vor_nach', 'A1'), ampReading('amp_vor_nach', 'A2'), 1e-6));
});

test('Reihe: gleiche Lampen gleich hell, je ein Viertel der Leistung', () => {
  const p = lampPowers(CIRCUITS.reihe2);
  assert.ok(near(p.L1, p.L2, 1e-6));
  assert.ok(near(p.L1, P_LAMP / 4));
});

test('Parallel: jede Lampe so hell wie allein, Gesamtstrom verdoppelt', () => {
  const p = lampPowers(CIRCUITS.parallel2);
  assert.ok(near(p.L1, P_LAMP) && near(p.L2, P_LAMP));
  assert.ok(near(ampReading('parallel2_amp', 'A'), 2 * U_BAT / R_LAMP));
});

test('Offene Schalter und Kurzschlüsse', () => {
  assert.equal(isOn(lampPowers(CIRCUITS.schalter_offen).L), false);
  assert.equal(isOn(lampPowers(CIRCUITS.zwei_schalter).L), false);
  assert.equal(isOn(lampPowers(CIRCUITS.lampe_ueberbrueckt).L), false);
  assert.equal(isOn(lampPowers(CIRCUITS.schalter_parallel).L), true);
  const p = lampPowers(CIRCUITS.parallel2_schalter);
  assert.ok(isOn(p.L1) && !isOn(p.L2));
  const r = lampPowers(CIRCUITS.reihe2_schalter);
  assert.ok(!isOn(r.L1) && !isOn(r.L2));
});

test('Messgeräte falsch eingebaut: Amperemeter parallel schließt kurz, Voltmeter in Reihe sperrt', () => {
  assert.ok(ampReading('amp_parallel', 'A') > 20);
  assert.equal(isOn(lampPowers(CIRCUITS.amp_parallel).L), false);
  const c = CIRCUITS.volt_reihe;
  const { V } = solve(c);
  assert.ok(near(Math.abs(V.a - V.b), U_BAT));
  assert.equal(isOn(lampPowers(c).L), false);
});

test('Bauauftrag: nur ein Schalter im Zweig von L2 erfüllt die Aufgabe', () => {
  assert.equal(checkBuild('bau_parallel', []).reason, 'none');
  assert.equal(checkBuild('bau_parallel', ['S1']).ok, false);
  assert.equal(checkBuild('bau_parallel', ['S2']).ok, false);
  assert.equal(checkBuild('bau_parallel', ['S3']).ok, true);
  assert.equal(checkBuild('bau_parallel', ['S1', 'S3']).ok, true);
  for (const s of [['S1'], ['S2'], ['S3'], ['S1', 'S2', 'S3']]) assert.equal(checkBuild('bau_reihe', s).ok, false);
});

test('Kennlinien: Draht proportional, Glühlampe mit wachsendem Widerstand', () => {
  assert.ok(near(wireCurrent(12) / wireCurrent(6), 2, 1e-9));
  assert.equal(lampCurrent(0), 0);
  const R = U => U / lampCurrent(U);
  assert.ok(R(2) < R(6) && R(6) < R(12));
  assert.ok(near(lampCurrent(12), 0.25));
});

test('Zahlen lesen und formatieren', () => {
  assert.equal(parseNum('0,25'), 0.25);
  assert.equal(parseNum(' 12 '), 12);
  assert.equal(parseNum('1.5'), 1.5);
  assert.ok(Number.isNaN(parseNum('abc')));
  assert.ok(Number.isNaN(parseNum('')));
  assert.equal(fmt(0.1 + 0.2), '0,3');
  assert.equal(fmt(2000), '2000');
});

test('Rechenaufgaben: Musterlösung wird als richtig erkannt, grob falsche Werte nicht', () => {
  let seed = 1;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  for (const gen of ['ohm', 'power']) {
    for (const t of makeTasks(gen, 300, rand)) {
      assert.ok(Number.isFinite(t.answer) && t.answer > 0, t.text);
      assert.equal(checkAnswer(String(t.answer).replace('.', ','), t), true, t.text);
      assert.equal(checkAnswer(String(t.answer * 1.5), t), false, t.text);
      assert.equal(checkAnswer('x', t), null);
      assert.ok(t.text && t.unit && t.solution);
    }
  }
});

test('Wahrheitstabellen: UND, ODER, Wechselschaltung', () => {
  const col = id => truthTable(id).map(r => (r.on ? 1 : 0)).join('');
  assert.equal(col('und'), '0001');
  assert.equal(col('oder'), '0111');
  assert.equal(col('wechsel'), '1001');
  assert.equal(col('wechsel_falsch'), '1000');
});
