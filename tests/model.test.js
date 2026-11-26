import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOPICS } from '../app/js/content.js';
import { CIRCUITS } from '../app/js/circuits.js';
import { DEMO_IDS } from '../app/js/demos.js';
import { GENERATORS, optionOrder, freshState, migrate, encodeBackup, decodeBackup, visit, setRead, progress, recordExercise, exerciseProgress } from '../app/js/model.js';

const T0 = new Date('2026-11-22T10:00:00').getTime();

test('Themen: eindeutige IDs, jedes Thema hat Titel und Merksätze', () => {
  const ids = TOPICS.map(t => t.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const t of TOPICS) {
    assert.ok(t.title && t.short, t.id);
    assert.ok(t.merk.length > 0, `${t.id}: keine Merksätze`);
    for (const m of t.merk) assert.match(m, /[.!?]$/, `${t.id}: Merksatz ohne Satzende`);
  }
});

test('Übungen: eindeutige IDs, gültige Antworten, Schaltungen und Experimente existieren', () => {
  const ids = TOPICS.flatMap(t => t.exercises.map(e => e.id));
  assert.equal(new Set(ids).size, ids.length);
  for (const t of TOPICS) {
    assert.ok(t.exercises.length > 0, `${t.id}: keine Übungen`);
    for (const e of t.exercises) {
      assert.ok(e.title, e.id);
      if (e.questions) {
        for (const q of e.questions) {
          assert.ok(Number.isInteger(q.a) && q.a >= 0 && q.a < q.opts.length, `${e.id}: ${q.q}`);
          assert.ok(q.why, `${e.id}: Erklärung fehlt`);
          if (q.fig) assert.ok(CIRCUITS[q.fig], q.fig);
          for (const o of q.opts) if (typeof o !== 'string') assert.ok(CIRCUITS[o.fig], o.fig);
        }
      }
      if (e.type === 'demo') assert.ok(DEMO_IDS.includes(e.demo), e.demo);
      if (e.type === 'sort') for (const it of e.items) assert.ok(it.bin >= 0 && it.bin < e.bins.length, it.t);
      if (e.type === 'calc') assert.ok(GENERATORS[e.gen], e.gen);
      if (e.type === 'memory') assert.equal(new Set(e.pairs.map(p => p[1])).size, e.pairs.length);
    }
  }
});

test('Übungsergebnis: bester Wert bleibt, Versuche zählen mit', () => {
  let S = freshState(T0);
  S = recordExercise(S, 'schalt-hell', 4, 6, T0);
  S = recordExercise(S, 'schalt-hell', 2, 6, T0 + 1);
  assert.equal(S.ex['schalt-hell'].tries, 2);
  assert.ok(Math.abs(S.ex['schalt-hell'].best - 4 / 6) < 1e-9);
  assert.equal(exerciseProgress(S, TOPICS.find(t => t.id === 'schaltungen')).done, 1);
  assert.deepEqual(migrate({ topics: {} }).ex, {});
});

test('freshState enthält alle Themen ungelesen', () => {
  const S = freshState(T0);
  assert.deepEqual(Object.keys(S.topics), TOPICS.map(t => t.id));
  assert.deepEqual(progress(S), { done: 0, total: TOPICS.length });
});

test('migrate ergänzt fehlende Themen und Felder, unbekannte Eingaben ergeben frischen Zustand', () => {
  const S = migrate({ topics: { ladung: { read: T0 } }, created: T0 });
  assert.equal(S.topics.ladung.read, T0);
  assert.equal(S.topics.ladung.visits, 0);
  assert.equal(S.topics.spannung.read, 0);
  assert.equal(migrate(null).v, 1);
  assert.equal(migrate('kaputt').v, 1);
});

test('visit und setRead ändern nur das betroffene Thema und lassen den Ausgangszustand unverändert', () => {
  const S0 = freshState(T0);
  const S1 = setRead(visit(S0, 'ladung'), 'ladung', true, T0);
  assert.equal(S0.topics.ladung.visits, 0);
  assert.equal(S1.topics.ladung.visits, 1);
  assert.equal(S1.topics.ladung.read, T0);
  assert.equal(progress(S1).done, 1);
  assert.equal(setRead(S1, 'ladung', false).topics.ladung.read, 0);
  assert.equal(visit(S0, 'gibtsnicht'), S0);
});

test('Backup: Hin- und Rückweg mit Umlauten, ungültige Codes werden abgelehnt', () => {
  const S = setRead(freshState(T0), 'widerstand', true, T0);
  const back = decodeBackup(encodeBackup({ ...S, note: 'Ω und Größe' }));
  assert.equal(back.topics.widerstand.read, T0);
  assert.equal(back.note, 'Ω und Größe');
  assert.throws(() => decodeBackup('ABC'), /format/);
  assert.throws(() => decodeBackup('STROM1:' + btoa('{}')), /inhalt/);
});

test('Ankreuzfragen: richtige Antwort ist nicht auffällig länger als die falschen', () => {
  for (const t of TOPICS) for (const e of t.exercises) for (const q of e.questions || []) {
    if (typeof q.opts[0] !== 'string') continue;
    const L = q.opts.map(o => o.length);
    const longestWrong = Math.max(...L.filter((_, k) => k !== q.a));
    assert.ok(L[q.a] <= longestWrong * 1.12 || L[q.a] - longestWrong <= 5, `${e.id}: ${q.q}`);
  }
});

test('Antwortreihenfolge: Permutation, kurze geordnete Antworten bleiben stehen', () => {
  let seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const long = { opts: ['eine längere Antwort A', 'eine längere Antwort B', 'eine längere Antwort C'] };
  const seen = new Set();
  for (let k = 0; k < 30; k++) {
    const o = optionOrder(long, rand);
    assert.deepEqual([...o].sort(), [0, 1, 2]);
    seen.add(o.join(''));
  }
  assert.ok(seen.size > 1);
  assert.deepEqual(optionOrder({ opts: ['heller', 'gleich hell', 'dunkler'] }, rand), [0, 1, 2]);
});
