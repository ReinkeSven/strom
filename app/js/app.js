// Oberfläche: Ansichten, Navigation, Speichern.
import { TOPICS, topicById } from './content.js';
import {
  freshState, migrate, encodeBackup, decodeBackup, visit, dkey, recordExercise, exerciseProgress,
  setFocus, missionParts, completePart, nextMission, stars, cityState,
} from './model.js';
import { mountExercise, devicesHtml } from './exercises.js';
import { mountMission } from './mission.js';
import { mountHero } from './hero.js';
import { citySvg, cityLabel } from './city.js';

const KEY = 'strom-labor-v1';
export const APP_VERSION = '0.11.0';   // muss VERSION in sw.js entsprechen (Test prüft das)
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const $ = s => document.querySelector(s);

/* ---------- Zustand ---------- */
let S = null;
let view = { tab: 'home', topic: null, ex: null, mission: null };   // mission: { topic, part } im Fokus-Modus
let unmount = null;   // Aufräumfunktion der offenen Übung bzw. der Kopfanimation
let ui = { copyMsg: '', importMsg: '', importOk: false, confirmReset: false, resetDone: false };
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
  const total = TOPICS.reduce((n, t) => n + t.exercises.length, 0);
  const doneAll = TOPICS.reduce((n, t) => n + exerciseProgress(S, t).done, 0);
  const items = TOPICS.map((t, i) => {
    const ep = exerciseProgress(S, t);
    const done = ep.done === ep.total;   // Thema fertig, wenn alle Übungen gemacht sind
    return `<li><button class="topic${done ? ' done' : ''}" data-topic="${t.id}">
      <span class="num">${done ? '✓' : i + 1}</span>
      <span class="txt"><b>${esc(t.title)}</b><small>${esc(t.short)}</small></span>
      <span class="exn">${ep.done}/${ep.total}</span>
    </button></li>`;
  }).join('');
  return `<div class="hero"><h1 class="sr-only">Papas Physik Punishment</h1><div id="heroanim"></div><p>${doneAll} von ${total} Übungen geschafft</p></div>
    ${focusSwitch()}${cityCard()}<ol class="topics">${items}</ol>`;
}

function cityCard() {
  return `<section class="card city"><div class="cityhead"><b>Deine Stadt</b><small>${cityLabel(S)}</small></div>${citySvg(S)}
    <p class="small">Jede Übung mit mindestens 60 % richtig bringt Strom in ein Haus. Fehlerfrei gibt es einen Stern. Ist ein Thema fertig, entsteht ein großes Gebäude.</p></section>`;
}

function focusSwitch() {
  const on = S.settings.focus;
  return `<label class="fswitch"><input type="checkbox" data-focus ${on ? 'checked' : ''}>
    <span class="track"><span class="knob"></span></span><span><b>Skibidi ADHD Mode</b><small>${on ? 'kleine Schritte, eins nach dem anderen' : 'aus'}</small></span></label>`;
}

/** Startseite im Fokus-Modus: ein großer „Weiter“-Knopf, darunter die Missionen mit Fortschrittspunkten */
function focusHomeView() {
  const nx = nextMission(S);
  const nt = nx && topicById(nx.topicId);
  const cta = nx
    ? `<button class="btn primary big cta" data-mission="${nx.topicId}:${nx.part}"><small>Vorschlag</small>${esc(nt.title)} · Teil ${nx.part + 1}</button>
       <p class="small free">Oder such dir unten selbst ein Thema aus. Die Reihenfolge ist egal.</p>`
    : '<section class="card"><h3>Alles geschafft!</h3><p>Du kannst jede Mission wiederholen.</p></section>';
  const items = TOPICS.map((t, i) => {
    const parts = missionParts(t);
    const done = new Set(S.missions[t.id] || []);
    const dots = parts.map((_, k) => `<button class="mdot${done.has(k) ? ' on' : ''}" data-mission="${t.id}:${k}" aria-label="${esc(t.title)} Teil ${k + 1}${done.has(k) ? ', geschafft' : ''}">${k + 1}</button>`).join('');
    // Antippen der Zeile startet den nächsten offenen Teil dieses Themas, die Punkte einen bestimmten Teil
    const open = parts.findIndex((_, k) => !done.has(k));
    return `<li class="mrow${done.size === parts.length ? ' done' : ''}">
      <button class="mpick" data-mission="${t.id}:${open < 0 ? 0 : open}"><span class="num">${done.size === parts.length ? '✓' : i + 1}</span>
      <span class="txt"><b>${esc(t.title)}</b><small>${parts.length === 1 ? '1 Teil' : `${parts.length} Teile`} · ${done.size === parts.length ? 'geschafft' : open < 0 ? '' : `weiter mit Teil ${open + 1}`}</small></span></button>
      <span class="dots">${dots}</span></li>`;
  }).join('');
  return `<div class="hero"><h1 class="sr-only">Papas Physik Punishment</h1><div id="heroanim"></div><p class="stars">⭐ ${stars(S)}</p></div>
    ${focusSwitch()}${cta}<ol class="missions">${items}</ol>${cityCard()}`;
}

function topicView(id) {
  const t = topicById(id);
  const merk = t.merk.map(m => `<li>${esc(m)}</li>`).join('');
  const exs = t.exercises.map(e => {
    const r = S.ex[e.id];
    return `<li><button class="exbtn${r ? ' done' : ''}" data-ex="${e.id}"><span>${esc(e.title)}</span>`
      + `<span class="score">${r ? Math.round(r.best * 100) + ' %' : ''}</span></button></li>`;
  }).join('');
  return `<button class="back" data-act="back">‹ Themen</button>
    <div class="hero"><h1>${esc(t.title)}</h1><p>${esc(t.short)}</p></div>
    <div class="explain intro"><h3>Worum geht's?</h3>${t.intro.map(x => `<p>${esc(x)}</p>`).join('')}</div>
    <section class="card merk"><h3>Merksätze</h3><ul>${merk}</ul></section>
    <section class="card"><h3>Übungen und Experimente</h3><ul class="exlist">${exs}</ul></section>
    `;
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
    <section class="card stack danger"><h3>Spielstand zurücksetzen</h3>
      <p class="small">Löscht allen Fortschritt: Übungen, Missionen, Sterne und die Stadt. Der ADHD-Mode bleibt so eingestellt, wie er ist. Tipp: vorher ein Backup speichern.</p>
      ${ui.confirmReset
        ? '<p><b>Wirklich alles löschen?</b></p><div class="btns"><button class="btn warn" data-act="reset-yes">Ja, alles löschen</button><button class="btn" data-act="reset-no">Abbrechen</button></div>'
        : '<div class="btns"><button class="btn warn" data-act="reset">Zurücksetzen …</button></div>'}
      ${ui.resetDone ? '<p class="small ok">Der Spielstand wurde zurückgesetzt.</p>' : ''}
    </section>
    <p class="small">Dauerhafter Speicher: ${persistText}</p>
    <p class="small">Version ${APP_VERSION}</p>`;
}

function exerciseShell(t, e) {
  return `<button class="back" data-act="back-topic">‹ ${esc(t.title)}</button>
    <div class="hero"><h1>${esc(e.title)}</h1></div>${devicesHtml(e)}<div id="ex"></div>`;
}

function render() {
  const main = $('#view');
  if (unmount) { unmount(); unmount = null; }
  document.body.classList.toggle('in-mission', !!view.mission);
  document.body.classList.toggle('focus', !!S.settings.focus);
  if (view.tab === 'more') main.innerHTML = backupView();
  else if (view.mission) {
    const t = topicById(view.mission.topic);
    const litBefore = new Set(cityState(S).houses.filter(h => h.lit).map(h => h.exId));
    unmount = mountMission(main, t, view.mission.part, {
      city: () => {
        const fresh = cityState(S).houses.filter(h => h.lit && !litBefore.has(h.exId)).map(h => h.exId);
        return { svg: citySvg(S, { fresh }), fresh: fresh.length };
      },
      onExit: () => { view = { tab: 'home', topic: null, ex: null, mission: null }; render(); },
      onRecord: (exId, score, total) => { S = recordExercise(S, exId, score, total); save(); },
      onPartDone: part => { S = completePart(S, t.id, part); save(); },
      onNextPart: part => { view = { ...view, mission: { topic: t.id, part } }; render(); },
    });
  } else if (view.ex) {
    const t = topicById(view.topic);
    const e = t.exercises.find(x => x.id === view.ex);
    main.innerHTML = exerciseShell(t, e);
    // Ergebnis speichern, ohne neu zu zeichnen: die Übung zeigt ihre Auswertung selbst
    unmount = mountExercise($('#ex'), e, (score, total) => { S = recordExercise(S, e.id, score, total); save(); });
  } else if (view.topic) main.innerHTML = topicView(view.topic);
  else {
    main.innerHTML = S.settings.focus ? focusHomeView() : homeView();
    unmount = mountHero($('#heroanim'));
  }
  document.querySelectorAll('#tabs button').forEach(b => b.classList.toggle('on', b.dataset.tab === view.tab));
}

/* ---------- Aktionen ---------- */
function markBackup() { S = { ...S, lastBackup: Date.now() }; save(); }

const ACTIONS = {
  back: () => { view = { tab: 'home', topic: null, ex: null, mission: null }; render(); },
  'back-topic': () => { view = { ...view, ex: null }; render(); window.scrollTo(0, 0); },
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
  reset: () => { ui.confirmReset = true; ui.resetDone = false; render(); },
  'reset-no': () => { ui.confirmReset = false; render(); },
  'reset-yes': () => {
    ui.confirmReset = false; ui.resetDone = true;
    update(setFocus(freshState(), S.settings.focus));
  },
  import: () => {
    try { update(decodeBackup($('#imp').value)); ui.importMsg = 'Backup geladen.'; ui.importOk = true; } catch { ui.importMsg = 'Der Code ist ungültig.'; ui.importOk = false; }
    render();
  },
};

document.addEventListener('click', e => {
  const tab = e.target.closest('[data-tab]');
  if (tab) { view = { tab: tab.dataset.tab, topic: null, ex: null, mission: null }; ui = { copyMsg: '', importMsg: '', importOk: false, confirmReset: false, resetDone: false }; render(); return; }
  const ms = e.target.closest('[data-mission]');
  if (ms) { const [topicId, part] = ms.dataset.mission.split(':'); view = { tab: 'home', topic: null, ex: null, mission: { topic: topicId, part: Number(part) } }; render(); return; }
  const topic = e.target.closest('[data-topic]');
  if (topic) { view = { tab: 'home', topic: topic.dataset.topic, ex: null, mission: null }; update(visit(S, topic.dataset.topic)); window.scrollTo(0, 0); return; }
  const ex = e.target.closest('[data-ex]');
  if (ex) { view = { ...view, ex: ex.dataset.ex }; render(); window.scrollTo(0, 0); return; }
  const act = e.target.closest('[data-act]');
  if (act && ACTIONS[act.dataset.act]) ACTIONS[act.dataset.act]();
});

document.addEventListener('change', e => {
  if (e.target.matches('[data-focus]')) update(setFocus(S, e.target.checked));
});

/* ---------- Start ---------- */
S = load();
render();
requestPersist().then(() => { if (view.tab === 'more') render(); });
if ('serviceWorker' in navigator) {
  // Neue Version: sobald der neue Service Worker übernimmt, einmal neu laden (nicht mitten in einer Mission)
  const hadController = !!navigator.serviceWorker.controller;
  let reloaded = false;
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!hadController || reloaded || view.mission || view.ex) return;
    reloaded = true;
    location.reload();
  });
  navigator.serviceWorker.register('sw.js').then(r => r.update()).catch(() => {});
}
