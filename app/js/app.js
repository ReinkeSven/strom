// Oberfläche: Ansichten, Navigation, Speichern.
import { TOPICS, topicById } from './content.js';
import { freshState, migrate, encodeBackup, decodeBackup, visit, setRead, progress, dkey } from './model.js';

const KEY = 'strom-labor-v1';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = s => document.querySelector(s);

/* ---------- Zustand ---------- */
let S = null;
let view = { tab: 'home', topic: null };
let ui = { copyMsg: '', importMsg: '', importOk: false };
let persisted = null;

/* ---------- Speichern ---------- */
function load() {
  try { const r = localStorage.getItem(KEY); return migrate(r ? JSON.parse(r) : null); } catch { return freshState(); }
}
function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch { /* ohne Speicher läuft die App trotzdem */ }
}
async function requestPersist() {
  try {
    if (navigator.storage && navigator.storage.persist) {
      persisted = await navigator.storage.persisted();
      if (!persisted) persisted = await navigator.storage.persist();
    }
  } catch { persisted = null; }
}
function update(next) { S = next; save(); render(); }

/* ---------- Ansichten ---------- */
function homeView() {
  const p = progress(S);
  const items = TOPICS.map((t, i) => {
    const done = S.topics[t.id].read;
    return `<li><button class="topic${done ? ' done' : ''}" data-topic="${t.id}">
      <span class="num">${done ? '✓' : i + 1}</span>
      <span class="txt"><b>${esc(t.title)}</b><small>${esc(t.short)}</small></span>
    </button></li>`;
  }).join('');
  return `<div class="hero"><h1>Strom-Labor</h1><p>${p.done} von ${p.total} Themen erledigt</p></div>
    <ol class="topics">${items}</ol>`;
}

function topicView(id) {
  const t = topicById(id);
  const done = S.topics[id].read;
  const merk = t.merk.map(m => `<li>${esc(m)}</li>`).join('');
  const ideas = t.ideas.map(m => `<li>${esc(m)}</li>`).join('');
  return `<button class="back" data-act="back">‹ Themen</button>
    <div class="hero"><h1>${esc(t.title)}</h1><p>${esc(t.short)}</p></div>
    <section class="card merk"><h3>Merksätze</h3><ul>${merk}</ul></section>
    <section class="card soon"><h3>Bald hier</h3><ul>${ideas}</ul></section>
    <button class="btn primary" data-act="toggle-read">${done ? 'Als ungelesen markieren' : 'Gelesen ✓'}</button>`;
}

function backupView() {
  const persistText = persisted === true ? 'zugesichert'
    : persisted === false ? 'vom Browser nicht zugesichert. Tipp: App zum Home-Bildschirm hinzufügen.' : 'unbekannt';
  return `<div class="hero"><h1>Backup</h1><p>Dein Fortschritt wird nur auf diesem Gerät gespeichert. Mit einem Backup kannst du ihn sichern oder mitnehmen.</p></div>
    <section class="card stack"><h3>Sichern</h3>
      <textarea id="exp" readonly aria-label="Backup-Code">${encodeBackup(S)}</textarea>
      <div class="btns"><button class="btn primary" data-act="download">Als Datei speichern</button><button class="btn" data-act="copy">Code kopieren</button></div>
      ${ui.copyMsg ? `<p class="small">${esc(ui.copyMsg)}</p>` : ''}
    </section>
    <section class="card stack"><h3>Wiederherstellen</h3>
      <textarea id="imp" aria-label="Backup-Code einfügen" placeholder="Code einfügen"></textarea>
      <div class="btns"><button class="btn" data-act="import">Laden</button></div>
      ${ui.importMsg ? `<p class="small ${ui.importOk ? 'ok' : 'err'}">${esc(ui.importMsg)}</p>` : ''}
    </section>
    <p class="small">Dauerhafter Speicher: ${persistText}</p>`;
}

function render() {
  const main = $('#view');
  if (view.tab === 'more') main.innerHTML = backupView();
  else if (view.topic) main.innerHTML = topicView(view.topic);
  else main.innerHTML = homeView();
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === view.tab));
}

/* ---------- Aktionen ---------- */
function markBackup() { S = { ...S, lastBackup: Date.now() }; save(); }

const ACTIONS = {
  back: () => { view = { tab: 'home', topic: null }; render(); },
  'toggle-read': () => update(setRead(S, view.topic, !S.topics[view.topic].read)),
  copy: async () => {
    try { await navigator.clipboard.writeText(encodeBackup(S)); ui.copyMsg = 'Kopiert.'; markBackup(); } catch { ui.copyMsg = 'Kopieren nicht möglich. Bitte manuell markieren.'; }
    render();
  },
  download: () => {
    const blob = new Blob([encodeBackup(S)], { type: 'text/plain' });
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `strom-labor-${dkey(new Date())}.txt` });
    a.click();
    URL.revokeObjectURL(a.href);
    markBackup();
  },
  import: () => {
    try { update(decodeBackup($('#imp').value)); ui.importMsg = 'Backup geladen.'; ui.importOk = true; } catch { ui.importMsg = 'Der Code ist ungültig.'; ui.importOk = false; }
    render();
  },
};

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) { view = { tab: tab.dataset.tab, topic: null }; ui = { copyMsg: '', importMsg: '', importOk: false }; render(); return; }
  const topic = e.target.closest('[data-topic]');
  if (topic) { view = { tab: 'home', topic: topic.dataset.topic }; update(visit(S, topic.dataset.topic)); window.scrollTo(0, 0); return; }
  const act = e.target.closest('[data-act]');
  if (act && ACTIONS[act.dataset.act]) ACTIONS[act.dataset.act]();
});

/* ---------- Start ---------- */
S = load();
render();
requestPersist().then(render);
if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
