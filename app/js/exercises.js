// Übungsansichten: jede Übung verwaltet ihren eigenen DOM-Bereich, damit Experimente beim Antworten weiterlaufen.
import { CIRCUITS, symbolCircuit } from './circuits.js';
import { circuitSvg } from './svg.js';
import { shuffle, makeTasks, checkAnswer, checkBuild, fmt } from './model.js';
import { mountDemo } from './demos.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const fig = (id, sim) => circuitSvg(CIRCUITS[id], { sim });

/** Hängt die Übung ex in el ein. onFinish(score, total) wird je Durchgang einmal aufgerufen. Liefert eine Aufräumfunktion. */
export function mountExercise(el, ex, onFinish) {
  const mounts = { quiz: mountQuiz, sort: mountSort, memory: mountMemory, calc: mountCalc, build: mountBuild, demo: mountDemoEx };
  return mounts[ex.type](el, ex, onFinish) || (() => {});
}

/** Gemeinsamer Ablauf: Klicks innerhalb von el an Handler je data-x weiterreichen */
function delegate(el, handlers) {
  const fn = e => {
    for (const [attr, h] of Object.entries(handlers)) {
      const t = e.target.closest(`[data-${attr}]`);
      if (t && el.contains(t)) { h(t.dataset[attr], t); return; }
    }
  };
  el.addEventListener('click', fn);
  return () => el.removeEventListener('click', fn);
}

function resultView(score, total, text = `${score} von ${total} richtig`) {
  const full = score === total;
  return `<section class="card result"><h3>${full ? 'Stark!' : 'Geschafft'}</h3><p class="big">${esc(text)}</p>
    <div class="btns"><button class="btn primary" data-act-ex="again">Nochmal</button></div></section>`;
}

/* ---------- Quiz (Vorhersagen, Beobachten, Erklären) ---------- */
function mountQuiz(el, ex, onFinish, intro = '') {
  let i = 0, picked = null, score = 0;
  const qs = ex.questions;
  const render = () => {
    if (i >= qs.length) { el.innerHTML = intro + resultView(score, qs.length); return; }
    const q = qs[i];
    const done = picked !== null;
    const opts = q.opts.map((o, k) => {
      const state = !done ? '' : k === q.a ? ' right' : k === picked ? ' wrong' : ' faded';
      const inner = typeof o === 'string' ? esc(o) : fig(o.fig, done);
      return `<button class="opt${typeof o === 'string' ? '' : ' figopt'}${state}" data-opt="${k}" ${done ? 'disabled' : ''}>${inner}</button>`;
    }).join('');
    el.innerHTML = `${intro}<section class="card quiz">
      <p class="step">Frage ${i + 1} von ${qs.length}</p>
      <p class="q">${esc(q.q)}</p>
      ${q.fig ? `<div class="figwrap">${fig(q.fig, done)}${done ? '<p class="small">So verhält sich die Schaltung:</p>' : ''}</div>` : ''}
      <div class="opts${q.opts.some(o => typeof o !== 'string') ? ' figs' : ''}">${opts}</div>
      ${done ? `<div class="why ${picked === q.a ? 'ok' : 'err'}"><b>${picked === q.a ? 'Richtig.' : 'Nicht ganz.'}</b> ${esc(q.why)}</div>
        <button class="btn primary" data-next="1">${i + 1 < qs.length ? 'Weiter' : 'Auswerten'}</button>` : ''}
    </section>`;
  };
  const off = delegate(el, {
    opt: k => { if (picked !== null) return; picked = Number(k); if (picked === qs[i].a) score++; render(); },
    next: () => { i++; picked = null; if (i >= qs.length) onFinish(score, qs.length); render(); },
    'act-ex': () => { i = 0; picked = null; score = 0; render(); },
  });
  render();
  return off;
}

/* ---------- Sortieren ---------- */
function mountSort(el, ex, onFinish) {
  let items, i, picked, score;
  const reset = () => { items = shuffle(ex.items); i = 0; picked = null; score = 0; };
  const render = () => {
    if (i >= items.length) { el.innerHTML = resultView(score, items.length); return; }
    const it = items[i];
    const done = picked !== null;
    const bins = ex.bins.map((b, k) => {
      const state = !done ? '' : k === it.bin ? ' right' : k === picked ? ' wrong' : ' faded';
      return `<button class="opt bin${state}" data-bin="${k}" ${done ? 'disabled' : ''}>${esc(b)}</button>`;
    }).join('');
    el.innerHTML = `<section class="card quiz">
      <p class="step">${i + 1} von ${items.length}</p>
      <p class="small">${esc(ex.prompt)}</p>
      <p class="item">${esc(it.t)}</p>
      <div class="opts bins">${bins}</div>
      ${done ? `<div class="why ${picked === it.bin ? 'ok' : 'err'}"><b>${picked === it.bin ? 'Richtig.' : `Nein: ${esc(ex.bins[it.bin])}.`}</b> ${esc(it.why || '')}</div>
        <button class="btn primary" data-next="1">${i + 1 < items.length ? 'Weiter' : 'Auswerten'}</button>` : ''}
    </section>`;
  };
  const off = delegate(el, {
    bin: k => { if (picked !== null) return; picked = Number(k); if (picked === items[i].bin) score++; render(); },
    next: () => { i++; picked = null; if (i >= items.length) onFinish(score, items.length); render(); },
    'act-ex': () => { reset(); render(); },
  });
  reset();
  render();
  return off;
}

/* ---------- Memory ---------- */
function mountMemory(el, ex, onFinish) {
  let cards, open, matched, tries, lock;
  const reset = () => {
    cards = shuffle(ex.pairs.flatMap(([sym, name], p) => [{ p, sym }, { p, name }]));
    open = []; matched = new Set(); tries = 0; lock = false;
  };
  const render = () => {
    const allDone = matched.size === ex.pairs.length;
    const grid = cards.map((c, k) => {
      const up = open.includes(k) || matched.has(c.p);
      const face = c.sym ? circuitSvg(symbolCircuit(c.sym), { labels: false }) : `<span>${esc(c.name)}</span>`;
      return `<button class="mem${up ? ' up' : ''}${matched.has(c.p) ? ' got' : ''}" data-card="${k}" aria-label="Karte ${k + 1}">${up ? face : ''}</button>`;
    }).join('');
    el.innerHTML = `<section class="card"><p class="small">Finde zu jedem Schaltzeichen den passenden Namen. Versuche: ${tries}</p>
      <div class="memgrid">${grid}</div></section>${allDone ? resultView(ex.pairs.length, tries, `Alle Paare in ${tries} Versuchen`) : ''}`;
  };
  const off = delegate(el, {
    card: k => {
      k = Number(k);
      if (lock || open.includes(k) || matched.has(cards[k].p)) return;
      open.push(k);
      if (open.length === 2) {
        tries++;
        const [a, b] = open;
        if (cards[a].p === cards[b].p) {
          matched.add(cards[a].p); open = [];
          if (matched.size === ex.pairs.length) onFinish(ex.pairs.length, tries);
        } else {
          lock = true;
          setTimeout(() => { open = []; lock = false; render(); }, 900);
        }
      }
      render();
    },
    'act-ex': () => { reset(); render(); },
  });
  reset();
  render();
  return off;
}

/* ---------- Rechentraining ---------- */
function mountCalc(el, ex, onFinish) {
  let tasks, i, result, score, input;
  const reset = () => { tasks = makeTasks(ex.gen, ex.count); i = 0; result = null; score = 0; input = ''; };
  const render = () => {
    if (i >= tasks.length) { el.innerHTML = resultView(score, tasks.length); return; }
    const t = tasks[i];
    const done = result !== null;
    el.innerHTML = `<section class="card quiz">
      <p class="step">Aufgabe ${i + 1} von ${tasks.length}</p>
      <p class="q">${esc(t.text)}</p>
      <form class="calc" data-form="1">
        <input id="ans" inputmode="decimal" autocomplete="off" value="${esc(input)}" ${done ? 'disabled' : ''} aria-label="Ergebnis">
        <span class="unit">${esc(t.unit)}</span>
        ${done ? '' : '<button class="btn primary" type="submit">Prüfen</button>'}
      </form>
      ${done ? `<div class="why ${result ? 'ok' : 'err'}"><b>${result ? 'Richtig.' : `Nicht ganz, richtig ist ${fmt(t.answer, 2)} ${esc(t.unit)}.`}</b> ${esc(t.solution)}</div>
        <button class="btn primary" data-next="1">${i + 1 < tasks.length ? 'Weiter' : 'Auswerten'}</button>` : ''}
    </section>`;
    if (!done) el.querySelector('#ans').focus();
  };
  const submit = e => {
    if (!e.target.matches('[data-form]')) return;
    e.preventDefault();
    input = el.querySelector('#ans').value;
    const r = checkAnswer(input, tasks[i]);
    if (r === null) { result = null; render(); el.querySelector('.calc').insertAdjacentHTML('afterend', '<p class="small err">Bitte eine Zahl eingeben, z. B. 0,25.</p>'); return; }
    result = r;
    if (r) score++;
    render();
  };
  el.addEventListener('submit', submit);
  const off = delegate(el, {
    next: () => { i++; result = null; input = ''; if (i >= tasks.length) onFinish(score, tasks.length); render(); },
    'act-ex': () => { reset(); render(); },
  });
  reset();
  render();
  return () => { off(); el.removeEventListener('submit', submit); };
}

/* ---------- Bauauftrag ---------- */
function mountBuild(el, ex, onFinish) {
  let layout = 'bau_parallel', placed = [], switches = {}, mode = 'build', msg = null;
  const st = () => ({ placed: Object.fromEntries(placed.map(l => [l, true])), switches });
  const render = () => {
    const c = CIRCUITS[layout];
    el.innerHTML = `<section class="card stack">
      <p><b>Auftrag:</b> Beide Lampen sollen leuchten. Lampe L2 soll sich allein ausschalten lassen, während L1 weiterleuchtet.</p>
      <div class="seg"><button class="${layout === 'bau_reihe' ? 'on' : ''}" data-layout="bau_reihe">Reihe</button><button class="${layout === 'bau_parallel' ? 'on' : ''}" data-layout="bau_parallel">Parallel</button></div>
      <p class="small">${mode === 'build' ? 'Tippe auf ein ＋, um dort einen Schalter einzubauen oder wieder zu entfernen.' : 'Tippe auf einen Schalter, um ihn zu öffnen oder zu schließen.'}</p>
      <div class="figwrap build">${circuitSvg(c, { sim: mode === 'test', st: st(), mode })}</div>
      <div class="btns">
        <button class="btn${mode === 'build' ? ' primary' : ''}" data-mode="build">Bauen</button>
        <button class="btn${mode === 'test' ? ' primary' : ''}" data-mode="test">Ausprobieren</button>
        <button class="btn" data-check="1">Prüfen</button>
      </div>
      ${msg ? `<div class="why ${msg.ok ? 'ok' : 'err'}">${msg.text}</div>` : ''}
    </section>`;
  };
  const TEXT = {
    none: 'Du hast noch keinen Schalter eingebaut.',
    dark: 'Wenn alle Schalter geschlossen sind, leuchten nicht beide Lampen.',
    together: 'L2 lässt sich nicht allein ausschalten. Überlege: Wo fließt der Strom nur durch L2?',
  };
  const off = delegate(el, {
    layout: l => { layout = l; placed = []; switches = {}; msg = null; render(); },
    slot: l => { placed = placed.includes(l) ? placed.filter(x => x !== l) : [...placed, l]; delete switches[l]; msg = null; render(); },
    sw: l => { switches[l] = !(switches[l] ?? true); render(); },
    mode: m => { mode = m; render(); },
    check: () => {
      const r = checkBuild(layout, placed);
      msg = r.ok
        ? { ok: true, text: '<b>Geschafft!</b> In der Parallelschaltung hat jede Lampe ihren eigenen Zweig. Ein Schalter in diesem Zweig schaltet nur diese Lampe.' }
        : { ok: false, text: `<b>Noch nicht.</b> ${TEXT[r.reason]}` };
      if (r.ok) onFinish(1, 1);
      render();
    },
  });
  render();
  return off;
}

/* ---------- Experiment mit Fragen ---------- */
function mountDemoEx(el, ex, onFinish) {
  el.innerHTML = '<section class="card demo"></section><div class="demo-quiz"></div>';
  const stopDemo = mountDemo(el.querySelector('.demo'), ex.demo);
  const qEl = el.querySelector('.demo-quiz');
  const intro = '<h3 class="sub">Fragen zum Experiment</h3>';
  const stopQuiz = mountQuiz(qEl, ex, onFinish, intro);
  return () => { stopDemo(); stopQuiz(); };
}
