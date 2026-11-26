// Erzeugt Übungsblätter und Lösungsschlüssel (DIN A4, PDF) aus den Inhalten der App.
// Aufruf: npm run worksheets  →  dist/Uebungsblaetter.pdf, dist/Loesungen.pdf
import { mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { chromium } from '@playwright/test';
import { TOPICS } from '../app/js/content.js';
import { CIRCUITS, symbolCircuit } from '../app/js/circuits.js';
import { circuitSvg } from '../app/js/svg.js';
import { balloonsSvg, bandgenSvg, electroscopeSvg, waterSvg, waterAt, latticeSvg, woodSvg } from '../app/js/demos.js';
import { makeTasks, truthTable, shuffle, optionOrder, lampCurrent, wireCurrent, fmt, fmtFixed } from '../app/js/model.js';

const OUT = new URL('../dist/', import.meta.url);
const APP_URL = 'reinkesven.github.io/strom';
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const LETTERS = 'abcdefgh';
const FIG_LETTERS = 'ABCD';

/** Reproduzierbarer Zufall, damit Blätter und Lösungen zusammenpassen */
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/* ---------- Texte nur für Papier: Experimente beschreiben statt ausprobieren ---------- */
const DEMO_INTRO = {
  balloons: 'Zwei Luftballons hängen an Fäden nebeneinander. Du reibst sie an einem Wolltuch und beobachtest, was passiert.',
  bandgen: 'Ein Bandgenerator lädt eine Metallkugel auf. Eine Person steht auf einem isolierenden Hocker und legt die Hand auf die Kugel. Später hält man eine Glimmlampe und eine Erdungskugel an die Kugel.',
  electroscope: 'Ein Elektroskop besteht aus einem Metallstab mit einem Teller oben und einem drehbaren Zeiger. Ein Kunststoffstab wurde mit einem Tuch gerieben und ist negativ geladen.',
  electrons: 'Stell dir einen Metalldraht im Atomrumpf-Elektronen-Modell vor: Die positiv geladenen Atomrümpfe sitzen fest im Gitter, dazwischen bewegen sich freie Elektronen. Darunter zum Vergleich Holz: Dort bleibt jedes Elektron bei seinem Atom.',
  water: 'Ein geschlossener Wasserkreislauf besteht aus einer Pumpe, Rohren, einem Wasserrad und einem Ventil. Er wird mit einem Stromkreis aus Batterie, Leitungen, Lampe und Schalter verglichen.',
  kennlinie: 'An einen Konstantandraht und an eine Glühlampe werden nacheinander verschiedene Spannungen angelegt. Gemessen wird jeweils die Stromstärke.',
};
const KENN_U = [0, 2, 4, 6, 8, 10, 12];

/* ---------- Skizzen (dieselben Zeichnungen wie in der App) ---------- */
// Auf dem Blatt: Ausgangszustand, der die Antwort nicht verrät. In der Lösung: das Ergebnis.
const DROPS = Array.from({ length: 22 }, (_, k) => waterAt(k / 22));
const SKETCH = {
  balloons: () => balloonsSvg({ a: 0, b: 0, near: false, wall: false }),
  bandgen: () => bandgenSvg({ q: 8, hand: true }),
  electroscope: () => electroscopeSvg({ q: 0, rod: 'weg' }),
  electrons: () => `<p class="cap">Kupfer</p>${latticeSvg(seeded(8))}<p class="cap">Holz</p>${woodSvg()}`,
  water: () => waterSvg({ level: 3, narrow: false, open: true, gauge: false }, DROPS),
};
const SKETCH_KEY = {
  balloons: [['Beide Ballons gerieben: Sie stoßen sich ab.', balloonsSvg({ a: -4, b: -4 })],
    ['Geladener Ballon an der Wand: Die Ladungen in der Wand verschieben sich.', balloonsSvg({ a: -4, b: 0, wall: true })]],
  bandgen: [['Die Glimmlampe leuchtet an der Elektrode an der Kugel.', bandgenSvg({ q: 8, hand: true, glow: true })]],
  electroscope: [['Stab nur angenähert: Influenz, der Zeiger schlägt aus.', electroscopeSvg({ q: 0, rod: 'nah' })],
    ['Nach dem Berühren und Entfernen: Das Elektroskop bleibt geladen.', electroscopeSvg({ q: -3, rod: 'weg' })]],
};
const sketch = svg => `<div class="sketch">${svg}</div>`;
const keySketches = id => (SKETCH_KEY[id] ? `<div class="sketches">${SKETCH_KEY[id].map(([cap, svg]) => `<figure>${svg}<figcaption>${esc(cap)}</figcaption></figure>`).join('')}</div>` : '');

/* ---------- Bausteine ---------- */
const box = '<span class="box"></span>';
const lines = n => `<div class="lines">${'<div class="line"></div>'.repeat(n)}</div>`;
const fig = (id, opts = {}) => `<div class="fig">${circuitSvg(CIRCUITS[id], opts)}</div>`;

// order: Anzeigereihenfolge (Indizes in q.opts), auf Blatt und Lösung identisch
function mcQuestion(q, n, order) {
  const figOpts = q.opts.some(o => typeof o !== 'string');
  const shown = order.map(k => q.opts[k]);
  const opts = figOpts
    ? `<div class="figopts">${shown.map((o, k) => `<div class="figopt">${circuitSvg(CIRCUITS[o.fig])}<div>${box} ${FIG_LETTERS[k]}</div></div>`).join('')}</div>`
    : `<ul class="mc">${shown.map((o, k) => `<li>${box}<span class="ltr">${LETTERS[k]})</span> ${esc(o)}</li>`).join('')}</ul>`;
  const body = q.fig ? `<div class="two">${fig(q.fig)}${opts}</div>` : opts;
  return `<div class="task"><p class="q"><span class="n">${n}.</span> ${esc(q.q)}</p>${body}</div>`;
}
const mcAnswer = (q, n, order) => {
  const o = q.opts[q.a];
  const pos = order.indexOf(q.a);
  const label = typeof o === 'string' ? `${LETTERS[pos]}) ${esc(o)}` : `Schaltung ${FIG_LETTERS[pos]}`;
  return `<li><b>${n}. ${label}</b><br>${esc(q.why)}</li>`;
};

function kennGrid(withCurves) {
  const X = U => 40 + U * 26, Y = I => 230 - I * 600;
  let g = '';
  for (let u = 0; u <= 12; u += 0.5) g += `<path class="${u % 2 ? 'gm' : 'gM'}" d="M${X(u)} ${Y(0)}V${Y(0.35)}"/>`;
  for (let i = 0; i <= 0.3501; i += 0.025) g += `<path class="${Math.round(i * 1000) % 100 ? 'gm' : 'gM'}" d="M${X(0)} ${Y(i)}H${X(12)}"/>`;
  g += `<path class="axis" d="M${X(0)} ${Y(0)}H${X(12.4)}M${X(0)} ${Y(0)}V${Y(0.37)}"/>`;
  for (let u = 0; u <= 12; u += 2) g += `<text x="${X(u)}" y="${Y(0) + 14}" text-anchor="middle">${u}</text>`;
  for (let i = 0.1; i <= 0.31; i += 0.1) g += `<text x="${X(0) - 6}" y="${Y(i) + 4}" text-anchor="end">${fmt(i, 1)}</text>`;
  g += `<text x="${X(12.4)}" y="${Y(0) + 14}" text-anchor="end">U in V</text><text x="${X(0) + 6}" y="${Y(0.36)}">I in A</text>`;
  if (withCurves) {
    const pts = f => KENN_U.map(u => `${X(u)},${Y(f(u))}`).join(' ');
    const fine = Array.from({ length: 49 }, (_, k) => k / 4).map(u => `${X(u)},${Y(lampCurrent(u))}`).join(' ');
    g += `<polyline class="cwire" points="${pts(wireCurrent)}"/><polyline class="clamp" points="${fine}"/>`;
    g += KENN_U.map(u => `<circle class="pw" cx="${X(u)}" cy="${Y(wireCurrent(u))}" r="3"/><circle class="pl" cx="${X(u)}" cy="${Y(lampCurrent(u))}" r="3"/>`).join('');
    g += `<text x="${X(9.6)}" y="${Y(0.27)}" class="lw">Konstantandraht</text><text x="${X(9.6)}" y="${Y(0.18)}" class="ll">Glühlampe</text>`;
  }
  return `<svg class="grid" viewBox="0 0 380 250">${g}</svg>`;
}

/* ---------- Übungen in Blatt- und Lösungsform ---------- */
function render(ex, rand) {
  const head = `<h3>${esc(ex.title.replace(/^(Experiment|Animation|Vorhersage): /, ''))}</h3>`;
  switch (ex.type) {
    case 'quiz': {
      const orders = ex.questions.map(q => optionOrder(q, rand));
      return {
        sheet: head + ex.questions.map((q, k) => mcQuestion(q, k + 1, orders[k])).join(''),
        key: head + `<ol class="key">${ex.questions.map((q, k) => mcAnswer(q, k + 1, orders[k])).join('')}</ol>`,
      };
    }
    case 'demo': {
      const orders = ex.questions.map(q => optionOrder(q, rand));
      let extra = '', extraKey = '';
      if (ex.demo === 'kennlinie') {
        const rows = KENN_U.map(u => `<tr><td>${u}</td><td>${fmtFixed(wireCurrent(u), 3)}</td><td>${fmtFixed(lampCurrent(u), 3)}</td></tr>`).join('');
        extra = `<div class="task"><p class="q"><span class="n">A.</span> Zeichne beide Kennlinien in das Diagramm. Verbinde die Messpunkte jeweils mit einer glatten Linie.</p>
          <div class="two"><table class="data"><tr><th>U in V</th><th>I Draht in A</th><th>I Lampe in A</th></tr>${rows}</table>${kennGrid(false)}</div></div>
`;
        extraKey = `<p><b>A.</b> So sehen die beiden Kennlinien aus:</p>${kennGrid(true)}`;
      }
      return {
        sheet: head + (SKETCH[ex.demo]
          ? `<div class="two intro2"><p class="intro">${esc(DEMO_INTRO[ex.demo])}</p>${sketch(SKETCH[ex.demo]())}</div>`
          : `<p class="intro">${esc(DEMO_INTRO[ex.demo])}</p>`) + extra + ex.questions.map((q, k) => mcQuestion(q, k + 1, orders[k])).join(''),
        key: head + extraKey + keySketches(ex.demo) + `<ol class="key">${ex.questions.map((q, k) => mcAnswer(q, k + 1, orders[k])).join('')}</ol>`,
      };
    }
    case 'sort': {
      const items = shuffle(ex.items, rand);
      const th = ex.bins.map(b => `<th>${esc(b)}</th>`).join('');
      const rows = items.map(it => `<tr><td class="it">${esc(it.t)}</td>${ex.bins.map(() => `<td>${box}</td>`).join('')}</tr>`).join('');
      return {
        sheet: `<div class="keep">${head}<p class="intro">${esc(ex.prompt)} Kreuze an.</p><table class="sort"><tr><th></th>${th}</tr>${rows}</table></div>`,
        key: head + `<ul class="key">${items.map(it => `<li><b>${esc(it.t)}: ${esc(ex.bins[it.bin])}</b>${it.why ? `. ${esc(it.why)}` : ''}</li>`).join('')}</ul>`,
      };
    }
    case 'memory': {
      const names = shuffle(ex.pairs.map(p => p[1]), rand);
      const rows = ex.pairs.map(([sym], k) => `<tr><td class="sym">${circuitSvg(symbolCircuit(sym), { labels: false })}</td><td class="dot">●</td><td class="gap"></td><td class="dot">●</td><td class="nm">${esc(names[k])}</td></tr>`).join('');
      return {
        sheet: `<div class="keep"><h3>Schaltzeichen</h3><p class="intro">Verbinde jedes Schaltzeichen mit seinem Namen.</p><table class="match">${rows}</table></div>`,
        key: '<h3>Schaltzeichen</h3>' + `<table class="match key">${ex.pairs.map(([sym, name]) => `<tr><td class="sym">${circuitSvg(symbolCircuit(sym), { labels: false })}</td><td class="nm"><b>${esc(name)}</b></td></tr>`).join('')}</table>`,
      };
    }
    case 'calc': {
      const tasks = makeTasks(ex.gen, 6, rand);
      return {
        sheet: head + '<p class="intro">Schreibe den Rechenweg auf: Formel, Werte mit Einheiten, Ergebnis.</p>'
          + tasks.map((t, k) => `<div class="task"><p class="q"><span class="n">${k + 1}.</span> ${esc(t.text)}</p>${lines(2)}<p class="res">Ergebnis: <span class="blank"></span> ${esc(t.unit)}</p></div>`).join(''),
        key: head + `<ol class="key">${tasks.map((t, k) => `<li><b>${k + 1}. ${fmt(t.answer, 2)} ${esc(t.unit)}</b><br>${esc(t.solution)}</li>`).join('')}</ol>`,
      };
    }
    case 'build':
      return {
        sheet: head + `<div class="task"><p class="q"><span class="n">1.</span> Beide Lampen sollen leuchten. Lampe L2 soll sich allein ausschalten lassen, während L1 weiterleuchtet. Auf welchen Bauplatz muss ein Schalter?</p>
          ${fig('bau_parallel', { mode: 'build' })}<ul class="mc row">${['S1', 'S2', 'S3'].map(s => `<li>${box} ${s}</li>`).join('')}</ul></div>
          <div class="task"><p class="q"><span class="n">2.</span> Warum geht das mit einer Reihenschaltung nicht?</p>${lines(2)}</div>`,
        key: head + `<ol class="key"><li><b>1. S3</b><br>In der Parallelschaltung hat jede Lampe ihren eigenen Zweig. Ein Schalter im Zweig von L2 schaltet nur L2. S1 liegt in der gemeinsamen Leitung und schaltet beide Lampen, S2 nur L1.</li>
          <li><b>2.</b> In der Reihenschaltung gibt es nur einen Weg für den Strom. Jeder Schalter unterbricht ihn für beide Lampen gleichzeitig.</li></ol>`,
      };
    case 'truth': {
      const rows = truthTable(ex.circuit);
      const t = (key) => `<table class="truth"><tr><th>S1</th><th>S2</th><th>Lampe</th></tr>${rows.map(r => `<tr>${r.s.map(v => `<td>${ex.states[+v]}</td>`).join('')}<td>${key ? `<b>${r.on ? 'an' : 'aus'}</b>` : ''}</td></tr>`).join('')}</table>`;
      return {
        sheet: head + `<div class="task"><p class="q">${esc(ex.prompt)} Fülle die Tabelle aus: an oder aus?</p><div class="two">${fig(ex.circuit)}${t(false)}</div></div>`,
        key: head + `<div class="two">${t(true)}<p>${esc(ex.why)}</p></div>`,
      };
    }
    default:
      throw new Error(`Unbekannter Übungstyp ${ex.type}`);
  }
}

/* ---------- Dokument ---------- */
function build() {
  const rand = seeded(2026);
  const sheets = [], keys = [];
  TOPICS.forEach((t, i) => {
    const parts = t.exercises.map(ex => render(ex, rand));
    sheets.push(`<section class="topic">
      <header class="top"><div><span class="kicker">Physik 8 · Elektrizitätslehre · Blatt ${i + 1}</span><h2>${esc(t.title)}</h2></div>
        <div class="who">Name: <span class="blank w"></span><br>Datum: <span class="blank w"></span></div></header>
      <div class="merk"><h4>Das musst du wissen</h4><ul>${t.merk.map(m => `<li>${esc(m)}</li>`).join('')}</ul></div>
      ${parts.map(p => `<div class="ex">${p.sheet}</div>`).join('')}
    </section>`);
    keys.push(`<section class="keyblock"><h2><span class="kicker">Blatt ${i + 1}</span> ${esc(t.title)}</h2>${parts.map(p => `<div class="ex">${p.key}</div>`).join('')}</section>`);
  });
  const cover = `<section class="cover"><p class="kicker">Physik 8 · Elektrizitätslehre</p><h1>Strom-Labor<br><small>Übungsblätter</small></h1>
    <ol class="toc">${TOPICS.map((t, i) => `<li><b>Blatt ${i + 1}:</b> ${esc(t.title)}</li>`).join('')}</ol>
    <div class="tips"><h4>So arbeitest du</h4><ul>
      <li>Lies zuerst den Kasten „Das musst du wissen“.</li>
      <li>Bei Ankreuzaufgaben ist immer genau eine Antwort richtig.</li>
      <li>Bei Schaltplänen: Erst überlegen, dann ankreuzen. Die Lösungen liegen auf extra Blättern.</li>
      <li>Die Experimente kannst du in der App ausprobieren: ${APP_URL}</li>
    </ul></div></section>`;
  const keyCover = `<section class="cover"><p class="kicker">Physik 8 · Elektrizitätslehre</p><h1>Strom-Labor<br><small>Lösungen</small></h1>
    <p>Zu jeder Ankreuzaufgabe steht die richtige Antwort mit einer kurzen Erklärung. Die Rechenaufgaben sind fest vorgegeben und passen nur zu diesem Satz Übungsblätter.</p></section>`;
  return {
    sheets: page('Strom-Labor – Übungsblätter', cover + sheets.join('')),
    keys: page('Strom-Labor – Lösungen', keyCover + keys.join('')),
  };
}

// Zeichenstile der Experimente aus der App übernehmen, Schrift auf Inter setzen
const APP_CSS = readFileSync(new URL('../app/css/styles.css', import.meta.url), 'utf8')
  .split('\n').filter(l => l.startsWith('.demo-svg')).join('\n')
  + '\n.demo-svg { width: 100%; height: auto; display: block; } .demo-svg text { font-family: Inter, sans-serif; }';

function page(title, body) {
  return `<!DOCTYPE html><html lang="de"><head><meta charset="utf-8"><title>${title}</title><style>${CSS}${APP_CSS}</style></head><body>${body}</body></html>`;
}

const CSS = `
@page { size: A4; margin: 14mm 15mm 16mm; }
:root { --ink: #1b1d2a; --navy: #1e2a66; --volt: #ffcc33; --muted: #6b6a73; }
* { box-sizing: border-box; }
body { margin: 0; font: 10.5pt/1.4 Inter, 'DejaVu Sans', sans-serif; color: var(--ink); }
h1, h2, h3, h4 { color: var(--navy); margin: 0; }
.kicker { font-size: 8.5pt; text-transform: uppercase; letter-spacing: .08em; color: var(--muted); font-weight: 600; }
.cover { break-after: page; padding-top: 30mm; }
.cover h1 { font-size: 36pt; line-height: 1.1; margin: 6mm 0 12mm; }
.cover h1 small { font-size: 20pt; color: var(--muted); font-weight: 600; }
.toc { font-size: 12pt; line-height: 1.9; padding-left: 0; list-style: none; }
.tips { margin-top: 12mm; border: 1.5px solid var(--navy); border-radius: 4mm; padding: 4mm 6mm; }
.topic { break-before: page; }
.topic:first-of-type { break-before: auto; }
.top { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 2.5px solid var(--navy); padding-bottom: 2mm; margin-bottom: 4mm; }
.top h2 { font-size: 18pt; }
.who { font-size: 9.5pt; line-height: 2; text-align: right; }
.blank { display: inline-block; border-bottom: 1px solid var(--ink); width: 28mm; height: 1em; }
.blank.w { width: 42mm; }
.merk { border-left: 4px solid var(--volt); background: #fff8dd; padding: 3mm 5mm; margin-bottom: 5mm; break-inside: avoid; }
.merk h4 { font-size: 10pt; text-transform: uppercase; letter-spacing: .06em; margin-bottom: 1mm; }
.merk ul { margin: 0; padding-left: 5mm; }
.merk li { margin: 1mm 0; }
.ex { margin-bottom: 5mm; }
.ex h3 { font-size: 12.5pt; border-bottom: 1px solid #d8d3c6; padding-bottom: 1mm; margin-bottom: 2mm; break-after: avoid; }
.intro { margin: 0 0 2mm; font-style: italic; }
.task { break-inside: avoid; margin: 2.5mm 0 3.5mm; }
.keep { break-inside: avoid; }
.two .mc { margin-top: 3mm; }
.two .fig { margin-top: 0; }
.q { margin: 0 0 1.5mm; font-weight: 600; }
.n { color: var(--navy); font-weight: 800; margin-right: 1mm; }
.mc { list-style: none; padding: 0; margin: 0 0 0 5mm; }
.mc li { margin: 1mm 0; display: flex; gap: 2mm; align-items: baseline; }
.mc.row { display: flex; gap: 10mm; }
.ltr { font-weight: 600; min-width: 4mm; }
.box { display: inline-block; width: 3.6mm; height: 3.6mm; border: 1.3px solid var(--ink); border-radius: .6mm; flex: 0 0 auto; transform: translateY(.5mm); }
.fig { width: 56mm; margin: 1mm 0 2mm 5mm; }
.figopts { display: flex; gap: 8mm; margin-left: 5mm; }
.figopt { width: 58mm; text-align: center; font-weight: 700; }
.lines { margin: 1mm 0 0 5mm; }
.line { border-bottom: 1px solid #9a98a3; height: 7.5mm; }
.res { margin: 2mm 0 0 5mm; }
.two { display: flex; gap: 6mm; align-items: flex-start; }
.two .fig { flex: 0 0 56mm; }
.intro2 { align-items: center; margin-bottom: 2mm; break-inside: avoid; }
.intro2 .intro { flex: 1; }
.sketch .cap { margin: .5mm 1mm; font-size: 8.5pt; font-weight: 700; color: var(--navy); }
.sketch { flex: 0 0 68mm; border: 1px solid #e2ddd0; border-radius: 2mm; padding: 1mm; }
.sketches { display: flex; gap: 6mm; margin: 1mm 0 3mm; break-inside: avoid; }
.sketches figure { margin: 0; width: 70mm; border: 1px solid #e2ddd0; border-radius: 2mm; padding: 1mm; }
.sketches figcaption { font-size: 9pt; color: var(--muted); padding: 1mm; }
table { border-collapse: collapse; }
.sort { width: 100%; font-size: 9.5pt; break-inside: avoid; }
.sort th { font-size: 8.5pt; padding: 1.5mm 1mm; text-align: center; vertical-align: bottom; }
.sort td { border-top: 1px solid #d8d3c6; padding: 1.6mm 1mm; text-align: center; }
.sort td.it { text-align: left; font-weight: 600; width: 42mm; }
.match { break-inside: avoid; margin-left: 5mm; }
.match td { padding: 1mm 2mm; }
.match .sym { width: 30mm; }
.match .gap { width: 60mm; }
.match .dot { font-size: 9pt; color: var(--navy); }
.match .nm { font-weight: 600; }
.truth { font-size: 10pt; }
.truth th, .truth td { border: 1px solid #b9b5a8; padding: 1.5mm 4mm; text-align: center; min-width: 18mm; }
.truth th { background: #f1eee6; }
.data { font-size: 9.5pt; flex: 0 0 auto; }
.data th, .data td { border: 1px solid #b9b5a8; padding: 1mm 2.5mm; text-align: center; }
.data th { background: #f1eee6; font-size: 8.5pt; }
.grid { width: 100mm; }
.grid text { font: 600 8px Inter, sans-serif; fill: var(--muted); }
.grid .gm { stroke: #e6e2d6; stroke-width: .5; }
.grid .gM { stroke: #cfc9b8; stroke-width: .8; }
.grid .axis { stroke: var(--ink); stroke-width: 1.2; fill: none; }
.grid .cwire { stroke: #2a6fdb; stroke-width: 1.5; fill: none; }
.grid .clamp { stroke: #e08a2e; stroke-width: 1.5; fill: none; }
.grid .pw { fill: #2a6fdb; } .grid .pl { fill: #e08a2e; }
.grid .lw { fill: #2a6fdb; font-size: 9px; } .grid .ll { fill: #e08a2e; font-size: 9px; }
/* Lösungen */
.keyblock { break-before: page; }
.keyblock h2 { font-size: 15pt; border-bottom: 2.5px solid var(--navy); padding-bottom: 1.5mm; margin-bottom: 3mm; break-after: avoid; }
.keyblock .kicker { display: block; }
.key { padding-left: 0; list-style: none; margin: 0; }
.key li { margin: 0 0 2mm; break-inside: avoid; }
.match.key .sym { width: 26mm; }
/* Schaltpläne */
.circuit { width: 100%; height: auto; display: block; }
.circuit .cw { stroke: var(--ink); stroke-width: 2; fill: none; stroke-linecap: round; }
.circuit .cw.thick { stroke-width: 5; stroke-linecap: butt; }
.circuit .cw.dark { fill: #fff; }
.circuit .dot { fill: var(--ink); }
.circuit .contact { fill: #fff; stroke: var(--ink); stroke-width: 2; }
.circuit text { font: 700 12px Inter, sans-serif; fill: var(--ink); }
.circuit .sym { text-anchor: middle; font-size: 13px; }
.circuit .pole { text-anchor: middle; font-size: 14px; fill: var(--navy); }
.circuit .lbl { fill: var(--navy); }
.circuit .slot circle { fill: #fff; stroke: var(--navy); stroke-width: 1.5; stroke-dasharray: 4 3; }
.circuit .slot text { display: none; }
`;

async function main() {
  mkdirSync(OUT, { recursive: true });
  const docs = build();
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const footer = label => `<div style="width:100%;font:8px Inter,sans-serif;color:#6b6a73;padding:0 15mm;display:flex;justify-content:space-between">
    <span>Strom-Labor · ${label}</span><span><span class="pageNumber"></span> / <span class="totalPages"></span></span></div>`;
  for (const [key, file, label] of [['sheets', 'Uebungsblaetter', 'Übungsblätter'], ['keys', 'Loesungen', 'Lösungen']]) {
    writeFileSync(new URL(`${file}.html`, OUT), docs[key]);
    await page.setContent(docs[key], { waitUntil: 'load' });
    await page.pdf({
      path: new URL(`${file}.pdf`, OUT).pathname, format: 'A4', printBackground: true, preferCSSPageSize: true,
      displayHeaderFooter: true, headerTemplate: '<span></span>', footerTemplate: footer(label),
    });
    console.log(`dist/${file}.pdf`);
  }
  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
