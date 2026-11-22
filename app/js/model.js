// Lernstand: reine Funktionen ohne DOM-Zugriff, damit testbar.
// Zustand S wird immer explizit übergeben; Zeit (now) ist injizierbar.
import { TOPICS } from './content.js';

export const PREFIX = 'STROM1:';

const pad2 = n => String(n).padStart(2, '0');
export const dkey = d => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

export const newTopic = () => ({ read: 0, visits: 0 });

export function freshState(now = Date.now()) {
  const topics = {};
  for (const t of TOPICS) topics[t.id] = newTopic();
  return { v: 1, topics, lastBackup: 0, created: now };
}

/** Ergänzt fehlende Felder, damit ältere oder importierte Stände weiter funktionieren. */
export function migrate(o) {
  const f = freshState();
  if (!o || typeof o !== 'object' || !o.topics) return f;
  const topics = {};
  for (const t of TOPICS) topics[t.id] = { ...newTopic(), ...(o.topics[t.id] || {}) };
  return { ...f, ...o, topics };
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
