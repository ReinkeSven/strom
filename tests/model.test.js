import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TOPICS } from '../app/js/content.js';
import { freshState, migrate, encodeBackup, decodeBackup, visit, setRead, progress } from '../app/js/model.js';

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
