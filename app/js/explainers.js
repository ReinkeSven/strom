// Erklärbilder: einfache, bewegte Bilder für abstrakte Begriffe (Atom, Strom, Stromstärke, Spannung, Widerstand).
// Jede Funktion hängt sich in el ein und liefert eine Aufräumfunktion. Höchstens drei Sätze Text.

const r1 = x => Math.round(x * 10) / 10;
const still = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/** Erklärtexte, höchstens drei kurze Sätze (auch für die PDF-Blätter) */
export const TEXT = {
  zoom: [
    'Alles besteht aus winzigen Atomen.',
    'Ein Atom hat einen positiven Kern und negative Elektronen außen herum.',
    'In Metallen sind einige Elektronen frei beweglich. Sie können wandern.',
  ],
  chain: [
    'Ein Stromkreis ist wie eine Fahrradkette: Sie ist überall voller Glieder.',
    'Die Batterie ist das Pedal. Sie schiebt alle Glieder gleichzeitig an, deshalb leuchtet die Lampe sofort.',
    'Kein Glied geht verloren. Die Lampe bekommt nur Schwung (Energie) von der Kette.',
  ],
  counter: [
    'Stromstärke heißt: Wie viele Elektronen kommen in einer Sekunde an einer Stelle vorbei?',
    'Wie bei einer Zählstelle an der Autobahn, die zählt, wie viele Autos pro Minute vorbeifahren.',
    'Viele Elektronen pro Sekunde bedeutet eine große Stromstärke.',
  ],
  backpack: [
    'Stell dir vor, jedes Elektron trägt einen Rucksack mit Energie.',
    'In der Batterie wird der Rucksack gefüllt, in der Lampe wird die Energie abgegeben.',
    'Die Spannung sagt, wie voll die Rucksäcke gepackt werden. Mehr Spannung: hellere Lampe.',
  ],
  corridor: [
    'Widerstand ist wie ein voller Schulflur in der Pause.',
    'Die Elektronen müssen sich zwischen den Atomrümpfen durchdrängeln.',
    'Wird der Draht heiß, zappeln die Atomrümpfe stärker. Dann kommen weniger Elektronen pro Sekunde durch.',
  ],
};

function shell(el, text, controls, note = '') {
  el.innerHTML = `<div class="explain">${text.map(t => `<p>${t}</p>`).join('')}</div>
    <div class="scene"></div><div class="ctrl">${controls}</div>${note ? `<p class="small note">${note}</p>` : ''}`;
  return el.querySelector('.scene');
}
function onAct(el, handler) {
  const fn = e => { const b = e.target.closest('[data-d]'); if (b && el.contains(b)) handler(b.dataset.d, b); };
  el.addEventListener('click', fn);
  return () => el.removeEventListener('click', fn);
}
/** Animationsschleife mit Zeitschritt dt (s); bei „Bewegung reduzieren“ nur ein Bild */
function loop(step) {
  let raf = 0, last = performance.now();
  const frame = now => { const dt = Math.min(0.05, (now - last) / 1000); last = now; step(dt); raf = requestAnimationFrame(frame); };
  if (still()) step(0); else raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}
/** Punkt auf einem abgerundeten Rechteck-Rundweg (s in 0 … 1, im Uhrzeigersinn ab oben links) */
function onLoop(s, x0, y0, x1, y1) {
  const w = x1 - x0, h = y1 - y0, per = 2 * (w + h);
  let d = (((s % 1) + 1) % 1) * per;
  if (d < w) return [x0 + d, y0];
  d -= w; if (d < h) return [x1, y0 + d];
  d -= h; if (d < w) return [x1 - d, y1];
  d -= w; return [x0, y1 - d];
}

/* ---------- 1. Zoom-Reise: vom Kabel zum Atom ---------- */
export function zoom(el) {
  const scene = shell(el, TEXT.zoom, '<button class="btn" data-d="out">Zurück</button><button class="btn primary" data-d="in">Näher ran</button>');
  let level = 0;
  const CAP = ['Ein Kupferkabel', 'Im Kupfer: feste Atomrümpfe (+) und freie Elektronen (−)', 'Ein einzelnes Atom: Kern in der Mitte, Elektronen außen'];
  const draw = () => {
    let g = '';
    if (level === 0) {
      g = '<rect x="20" y="70" width="280" height="40" rx="20" fill="#3c3f55"/><rect x="20" y="80" width="280" height="20" rx="10" fill="#d98b4a"/>'
        + '<circle cx="190" cy="90" r="34" fill="rgba(255,255,255,.25)" stroke="#1e2a66" stroke-width="4"/><path d="M214 114L244 144" stroke="#1e2a66" stroke-width="8" stroke-linecap="round"/>';
    } else if (level === 1) {
      for (let i = 0; i < 7; i++) for (let j = 0; j < 4; j++) {
        const x = 40 + i * 40, y = 34 + j * 38;
        g += `<circle cx="${x}" cy="${y}" r="11" fill="#d9534f"/><text x="${x}" y="${y + 5}" class="pm">+</text>`;
      }
      for (let k = 0; k < 18; k++) g += `<circle class="drift" style="animation-delay:${-k * 0.37}s" cx="${20 + (k * 53) % 280}" cy="${15 + (k % 5) * 38}" r="5" fill="#2a6fdb"/>`;
    } else {
      g = '<circle cx="160" cy="90" r="20" fill="#d9534f"/><text x="160" y="97" class="pm big">+</text>'
        + '<circle cx="160" cy="90" r="48" class="orbit"/><circle cx="160" cy="90" r="74" class="orbit"/>'
        + '<g class="spin s1"><circle cx="208" cy="90" r="7" fill="#2a6fdb"/><circle cx="112" cy="90" r="7" fill="#2a6fdb"/></g>'
        + '<g class="spin s2"><circle cx="160" cy="16" r="7" fill="#2a6fdb"/><circle cx="160" cy="164" r="7" fill="#2a6fdb"/><circle cx="234" cy="90" r="7" fill="#2a6fdb"/></g>';
    }
    scene.innerHTML = `<svg viewBox="0 0 320 180" class="demo-svg zoomlv l${level}">${g}</svg><p class="cap">${CAP[level]}</p>`;
    el.querySelector('[data-d=in]').disabled = level === 2;
    el.querySelector('[data-d=out]').disabled = level === 0;
  };
  const off = onAct(el, d => { level = Math.max(0, Math.min(2, level + (d === 'in' ? 1 : -1))); draw(); });
  draw();
  return off;
}

/* ---------- 2. Fahrradkette: der Stromkreis ist überall voll ---------- */
export function chain(el) {
  const scene = shell(el, TEXT.chain, '<button class="btn primary" data-d="pedal">Treten</button>',
  'Das orange Glied zeigt: Jedes einzelne Glied kommt nur langsam voran, trotzdem bewegt sich die ganze Kette sofort.');
  const N = 36, X0 = 40, Y0 = 30, X1 = 280, Y1 = 140;
  scene.innerHTML = `<svg viewBox="0 0 320 170" class="demo-svg">
    <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="6" class="track"/>
    <g class="links">${Array.from({ length: N }, (_, k) => `<circle r="4.5" class="${k === 0 ? 'mark' : 'link'}"/>`).join('')}</g>
    <g transform="translate(${X0} ${(Y0 + Y1) / 2})"><circle r="20" class="gear"/><g class="crank"><path d="M0 0L14 -14" class="cw"/><circle cx="14" cy="-14" r="4" class="ped"/></g><text y="38" class="lbl2">Batterie = Pedal</text></g>
    <g transform="translate(${X1} ${(Y0 + Y1) / 2})"><circle class="glow" r="26"/><circle r="16" class="bulb"/><text y="38" class="lbl2">Lampe</text></g>
  </svg>`;
  const links = [...scene.querySelectorAll('.links circle')];
  const glow = scene.querySelector('.glow'), crank = scene.querySelector('.crank');
  let pos = 0, speed = 0, push = 0, ang = 0;
  const step = dt => {
    if (push > 0) push -= dt;
    speed += ((push > 0 ? 0.09 : 0) - speed) * Math.min(1, dt * 3);
    pos += speed * dt; ang += speed * dt * 900;
    links.forEach((c, k) => { const [x, y] = onLoop(pos + k / N, X0, Y0, X1, Y1); c.setAttribute('cx', r1(x)); c.setAttribute('cy', r1(y)); });
    glow.setAttribute('opacity', Math.min(0.9, speed * 10).toFixed(2));
    crank.setAttribute('transform', `rotate(${r1(ang % 360)})`);
  };
  const stopLoop = loop(step);
  const off = onAct(el, d => { if (d === 'pedal') { push = 1.5; if (still()) { speed = 0.09; step(0); setTimeout(() => { speed = 0; push = 0; step(0); }, 1500); } } });
  return () => { stopLoop(); off(); };
}

/* ---------- 3. Zählstelle: Stromstärke = Elektronen pro Sekunde ---------- */
export function counter(el) {
  const scene = shell(el, TEXT.counter, '<label class="slider">Stromstärke <input type="range" min="1" max="3" step="1" value="1" data-u> <span data-ul>klein</span></label>');
  scene.innerHTML = `<svg viewBox="0 0 320 130" class="demo-svg">
    <rect x="0" y="40" width="320" height="50" rx="8" class="wireband"/>
    <path d="M160 28V102" class="gate"/><rect x="128" y="4" width="64" height="22" rx="5" class="sign"/><text x="160" y="20" class="signt">0 / s</text>
    <g class="els"></g><text x="160" y="122" class="lbl2">Zählstelle</text></svg>`;
  const elsG = scene.querySelector('.els'), sign = scene.querySelector('.signt');
  const NAMES = ['', 'klein', 'mittel', 'groß'];
  let level = 1, spawn = 0, passed = [], t = 0;
  let es = Array.from({ length: 6 }, (_, k) => ({ x: k * 55 + 10, y: 50 + Math.random() * 30 }));   // Band von Anfang an gefüllt
  const step = dt => {
    t += dt;
    spawn -= dt;
    if (spawn <= 0) { es.push({ x: -8, y: 50 + Math.random() * 30 }); spawn = 1 / (1.2 * level); }
    for (const e of es) { const x0 = e.x; e.x += 55 * dt; if (x0 < 160 && e.x >= 160) passed.push(t); }
    es = es.filter(e => e.x < 330);
    passed = passed.filter(p => p > t - 3);
    elsG.innerHTML = es.map(e => `<circle cx="${r1(e.x)}" cy="${r1(e.y)}" r="5"/>`).join('');
    sign.textContent = `${(passed.length / 3).toFixed(1).replace('.', ',')} / s`;
  };
  const stopLoop = loop(step);
  const input = el.querySelector('[data-u]');
  const onInput = () => { level = Number(input.value); el.querySelector('[data-ul]').textContent = NAMES[level]; if (still()) step(0); };
  input.addEventListener('input', onInput);
  return () => { stopLoop(); input.removeEventListener('input', onInput); };
}

/* ---------- 4. Rucksackmodell: Spannung = wie viel Energie jedes Elektron mitbekommt ---------- */
export function backpack(el) {
  const scene = shell(el, TEXT.backpack, '<label class="slider">Spannung <input type="range" min="1" max="3" step="1" value="2" data-u> <span data-ul>mittel</span></label>',
  'Modellgrenze: Elektronen tragen natürlich keine Rucksäcke. Das Bild zeigt nur, dass die Batterie Energie liefert und die Lampe sie umwandelt. Die Elektronen selbst werden nicht verbraucht.');
  const N = 10, X0 = 40, Y0 = 34, X1 = 280, Y1 = 140;
  scene.innerHTML = `<svg viewBox="0 0 320 175" class="demo-svg">
    <rect x="${X0}" y="${Y0}" width="${X1 - X0}" height="${Y1 - Y0}" rx="8" class="track"/>
    <g transform="translate(${X0} ${(Y0 + Y1) / 2})"><rect x="-14" y="-22" width="28" height="44" rx="5" class="batt"/><text y="-6" class="bt">+</text><text y="14" class="bt">−</text><text y="42" class="lbl2">Batterie: füllt</text></g>
    <g transform="translate(${X1} ${(Y0 + Y1) / 2})"><circle class="glow" r="28"/><circle r="16" class="bulb"/><text y="42" class="lbl2">Lampe: leert</text></g>
    <g class="packs">${Array.from({ length: N }, () => '<g class="pk"><circle r="7" class="eb"/><rect x="6" y="-9" width="9" height="13" rx="2" class="bag"/><rect x="7" y="3" width="7" height="0" class="fill"/></g>').join('')}</g>
  </svg>`;
  const pks = [...scene.querySelectorAll('.pk')].map(g => ({ g, fill: g.querySelector('.fill'), e: 0, s: 0 }));
  // Lage auf dem Rundweg: Batterie links (s ≈ 0,92), Lampe rechts (s ≈ 0,42).
  // Die Elektronen laufen gegen den Uhrzeigersinn: unten aus dem Minuspol heraus, durch die Lampe, oben in den Pluspol.
  const S_BAT = 0.923, S_LAMP = 0.423;
  const passedPoint = (s0, s1, a) => (s1 <= s0 ? s1 < a && a <= s0 : a <= s0 || a > s1);
  pks.forEach((p, k) => { p.s = k / N; p.e = p.s > S_LAMP && p.s < S_BAT ? 2 / 3 : 0; });
  const glow = scene.querySelector('.glow');
  const NAMES = ['', 'klein', 'mittel', 'groß'];
  let level = 2, flash = 0;
  const step = dt => {
    flash = Math.max(0, flash - dt * 1.5);
    for (const p of pks) {
      const s0 = p.s;
      p.s = (p.s - 0.07 * dt + 1) % 1;
      if (dt > 0 && passedPoint(s0, p.s, S_BAT)) p.e = level / 3;                                   // in der Batterie gefüllt
      if (dt > 0 && passedPoint(s0, p.s, S_LAMP) && p.e > 0) { flash = Math.min(1, flash + p.e * 0.9); p.e = 0; }   // an der Lampe abgegeben
      const [x, y] = onLoop(p.s, X0, Y0, X1, Y1);
      p.g.setAttribute('transform', `translate(${r1(x)} ${r1(y)})`);
      const h = 11 * p.e;
      p.fill.setAttribute('y', r1(3 - h + 1)); p.fill.setAttribute('height', r1(h));
    }
    glow.setAttribute('opacity', (0.15 + 0.75 * Math.max(flash, still() ? level / 3 : 0)).toFixed(2));
  };
  const stopLoop = loop(step);
  const input = el.querySelector('[data-u]');
  const onInput = () => { level = Number(input.value); el.querySelector('[data-ul]').textContent = NAMES[level]; if (still()) step(0); };
  input.addEventListener('input', onInput);
  return () => { stopLoop(); input.removeEventListener('input', onInput); };
}

/* ---------- 5. Schulflur: Widerstand bremst den Strom ---------- */
export function corridor(el) {
  const scene = shell(el, TEXT.corridor, '<label class="slider">Temperatur <input type="range" min="0" max="2" step="1" value="0" data-u> <span data-ul>kalt</span></label>');
  scene.innerHTML = '<canvas class="demo-canvas" width="320" height="150" aria-label="Elektronen drängeln sich zwischen zappelnden Atomrümpfen hindurch"></canvas><p class="status meterline"></p>';
  const cv = scene.querySelector('canvas'), ctx = cv.getContext('2d');
  const W = 320, H = 150, dpr = window.devicePixelRatio || 1;
  cv.width = W * dpr; cv.height = H * dpr; ctx.scale(dpr, dpr);
  const out = scene.querySelector('.meterline');
  const NAMES = ['kalt', 'warm', 'heiß'];
  // Atomrümpfe in Reihen, dazwischen drei Gänge. Je heißer, desto stärker zappeln die Rümpfe in die Gänge hinein,
  // die Elektronen werden öfter angerempelt und kommen langsamer voran (gleich viele unterwegs, also weniger pro Sekunde).
  const ions = [];
  for (let i = 0; i < 8; i++) for (let j = 0; j < 4; j++) ions.push({ bx: 30 + i * 38, by: 24 + j * 34, x: 0, y: 0 });
  const LANES = [41, 75, 109], GAP = 40;
  const SPEED = [70, 42, 25], AMP = [1, 3.5, 6.5], BUMP = [0, 1.2, 2.5];   // Bumps pro Sekunde und Elektron
  const es = LANES.flatMap((y, l) => Array.from({ length: Math.ceil(W / GAP) + 1 }, (_, k) => ({ y, x: k * GAP + l * 13, ph: Math.random() * 6, back: 0 })));
  let temp = 0, t = 0, passed = [];
  const step = dt => {
    t += dt;
    const amp = AMP[temp], v = SPEED[temp];
    for (const p of ions) { p.x = p.bx + Math.sin(t * 13 + p.bx) * amp; p.y = p.by + Math.cos(t * 11 + p.by * 1.3) * amp; }
    for (const e of es) {
      if (e.back > 0) e.back -= dt;
      else if (Math.random() < BUMP[temp] * dt) e.back = 0.18;              // angerempelt: kurz zurück
      const x0 = e.x;
      e.x += (e.back > 0 ? -0.8 * v : v) * dt;
      if (x0 < W - 10 && e.x >= W - 10) passed.push(t);
      if (e.x > W + 6) e.x -= W + 12;
      if (e.x < -6) e.x += W + 12;
    }
    passed = passed.filter(p => p > t - 4);
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = ['#eef0f7', '#fbeee0', '#fbe0d6'][temp]; ctx.fillRect(0, 0, W, H);
    for (const p of ions) { ctx.fillStyle = '#d9534f'; ctx.beginPath(); ctx.arc(p.x, p.y, 9, 0, 2 * Math.PI); ctx.fill(); }
    ctx.fillStyle = '#2a6fdb';
    for (const e of es) {
      const wob = Math.sin(t * 6 + e.ph) * (2 + amp * 0.6);
      ctx.beginPath(); ctx.arc(e.x, e.y + wob, 3.5, 0, 2 * Math.PI); ctx.fill();
    }
    ctx.strokeStyle = 'rgba(30,42,102,.4)'; ctx.setLineDash([4, 4]); ctx.beginPath(); ctx.moveTo(W - 10, 0); ctx.lineTo(W - 10, H); ctx.stroke(); ctx.setLineDash([]);
    if (Math.round(t * 4) !== Math.round((t - dt) * 4) || dt === 0) out.textContent = `Am Ende kommen an: ${(passed.length / 4).toFixed(1).replace('.', ',')} Elektronen pro Sekunde`;
  };
  const stopLoop = loop(step);
  const input = el.querySelector('[data-u]');
  const onInput = () => { temp = Number(input.value); el.querySelector('[data-ul]').textContent = NAMES[temp]; if (still()) step(0); };
  input.addEventListener('input', onInput);
  return () => { stopLoop(); input.removeEventListener('input', onInput); };
}

export const EXPLAINERS = { zoom, chain, counter, backpack, corridor };
