// Interaktive Experimente. Jede Funktion hängt sich in el ein und liefert eine Aufräumfunktion.
// Die Darstellung ist schematisch: Ein Ladungszeichen steht für sehr viele Elektronen.
import { lampCurrent, wireCurrent, fmtFixed, fmt } from './model.js';

const r1 = x => Math.round(x * 10) / 10;
const rad = d => d * Math.PI / 180;

/** Ladungszeichen (+ oder −) gleichmäßig auf einem Kreis verteilen */
function signsOnCircle(cx, cy, r, n, sign, cls) {
  let s = '';
  for (let k = 0; k < n; k++) {
    const a = rad(-90 + (360 / Math.max(n, 1)) * k);
    s += `<text class="${cls}" x="${r1(cx + r * Math.cos(a))}" y="${r1(cy + r * Math.sin(a) + 4)}">${sign}</text>`;
  }
  return s;
}

function shell(el, controls, note = '') {
  el.innerHTML = `<div class="scene"></div><p class="status" aria-live="polite"></p><div class="ctrl">${controls}</div>${note ? `<p class="small note">${note}</p>` : ''}`;
  return { scene: el.querySelector('.scene'), status: el.querySelector('.status') };
}

function onAct(el, handler) {
  const fn = e => { const b = e.target.closest('[data-d]'); if (b && el.contains(b)) handler(b.dataset.d, b); };
  el.addEventListener('click', fn);
  return () => el.removeEventListener('click', fn);
}

/* ---------- Luftballons und Wand ---------- */
function balloons(el) {
  const S = { a: 0, b: 0, near: false, wall: false };
  const ui = shell(el, `
    <button class="btn" data-d="rubA">Ballon A reiben</button>
    <button class="btn" data-d="rubB">Ballon B reiben</button>
    <button class="btn" data-d="near">Tuch an Ballon A</button>
    <button class="btn" data-d="wall">Ballon A an die Wand</button>
    <button class="btn" data-d="reset">Entladen</button>`,
  'Ein Ladungszeichen steht für sehr viele Elektronen.');
  const L = 110, PA = 70, PB = 150;
  const draw = msg => {
    let tA = 0, tB = 0;
    if (S.wall) tA = S.a < 0 ? -17 : 0;
    else {
      if (S.a < 0 && S.b < 0) { tA -= 14; tB += 14; }
      else if (S.a < 0 && !S.b) { tA += 4; tB -= 4; }
      else if (S.b < 0 && !S.a) { tA += 4; tB -= 4; }
      if (S.near && S.a < 0) tA -= 14;
    }
    const pos = (px, t) => [px + L * Math.sin(rad(t)), 10 + L * Math.cos(rad(t))];
    const [ax, ay] = pos(PA, tA), [bx, by] = pos(PB, tB);
    const wool = -(S.a + S.b);
    const balloon = (x, y, px, q, name, pol) => `<path class="string" d="M${px} 10L${r1(x)} ${r1(y + 25)}"/>`
      + `<ellipse class="balloon" cx="${r1(x)}" cy="${r1(y)}" rx="20" ry="25"/><text class="tag" x="${r1(x)}" y="${r1(y - 30)}">${name}</text>`
      + (q < 0 ? signsOnCircle(x, y, 12, -q, '−', 'neg') : '') + pol;
    // Polarisation im ungeladenen Ballon B, wenn A geladen ist (und umgekehrt)
    const polB = !S.wall && S.a < 0 && !S.b ? `<text class="pos sm" x="${r1(bx - 11)}" y="${r1(by + 4)}">+</text><text class="neg sm" x="${r1(bx + 11)}" y="${r1(by + 4)}">−</text>` : '';
    const polA = !S.wall && S.b < 0 && !S.a ? `<text class="pos sm" x="${r1(ax + 11)}" y="${r1(ay + 4)}">+</text><text class="neg sm" x="${r1(ax - 11)}" y="${r1(ay + 4)}">−</text>` : '';
    let wall = '<rect class="wall" x="0" y="0" width="18" height="200"/>';
    if (S.wall && S.a < 0) for (let k = -1; k <= 1; k++) wall += `<text class="pos sm" x="13" y="${r1(ay + k * 14 + 4)}">+</text><text class="neg sm" x="5" y="${r1(ay + k * 14 + 4)}">−</text>`;
    const tx = S.near ? 34 : 230, ty = S.near ? 150 : 165;
    const cloth = `<rect class="cloth" x="${tx}" y="${ty}" width="44" height="28" rx="5"/><text class="tag" x="${tx + 22}" y="${ty + 42}">Wolltuch</text>`
      + (wool > 0 ? signsOnCircle(tx + 22, ty + 14, 8, wool, '+', 'pos') : '');
    ui.scene.innerHTML = `<svg viewBox="0 0 300 215" class="demo-svg"><path class="ceil" d="M20 10H290"/>${wall}${cloth}`
      + balloon(ax, ay, PA, S.a, 'A', polA) + balloon(bx, by, PB, S.b, 'B', polB) + '</svg>';
    ui.status.textContent = msg;
  };
  const off = onAct(el, d => {
    if (d === 'rubA' || d === 'rubB') {
      const k = d === 'rubA' ? 'a' : 'b';
      if (S[k] <= -6) { draw('Mehr Ladung nimmt der Ballon hier nicht auf.'); return; }
      S[k] -= 2; S.wall = false;
      draw(`Ballon ${k.toUpperCase()} hat Elektronen vom Tuch übernommen. Er ist jetzt negativ, das Tuch positiv geladen.`);
    } else if (d === 'near') {
      S.near = !S.near; S.wall = false;
      draw(S.near ? (S.a < 0 ? 'Ballon A (negativ) wird vom positiven Tuch angezogen.' : 'Ballon A ist ungeladen und reagiert kaum.') : 'Das Tuch ist wieder weg.');
    } else if (d === 'wall') {
      S.wall = !S.wall; S.near = false;
      draw(!S.wall ? 'Ballon A hängt wieder frei.' : S.a < 0
        ? 'Der Ballon haftet: In der Wand verschieben sich die Ladungen in den Atomen, die positiven Anteile liegen näher am Ballon.'
        : 'Ungeladen haftet der Ballon nicht an der Wand.');
    } else {
      Object.assign(S, { a: 0, b: 0, near: false, wall: false });
      draw('Alles ist wieder neutral.');
    }
  });
  draw('Reibe einen Ballon am Wolltuch.');
  return off;
}

/* ---------- Bandgenerator ---------- */
function bandgen(el) {
  const S = { q: 0, hand: false, spark: false, glow: false };
  let timer = null;
  const ui = shell(el, `
    <button class="btn primary" data-d="crank">Kurbeln</button>
    <button class="btn" data-d="hand">Hand auf die Kugel</button>
    <button class="btn" data-d="ground">Erdungskugel annähern</button>
    <button class="btn" data-d="glim">Glimmlampe an die Kugel</button>`,
  'Die Person steht auf einem isolierenden Hocker. In diesem Modell lädt sich die Kugel negativ auf.');
  const draw = msg => {
    const q = S.q;
    const dome = `<rect class="body" x="92" y="88" width="16" height="92"/><path class="band" d="M96 92V176M104 92V176"/>`
      + '<rect class="body" x="70" y="180" width="60" height="14" rx="3"/><circle class="crank" cx="122" cy="187" r="9"/><path class="cw" d="M122 187L131 178"/>'
      + `<circle class="dome" cx="100" cy="60" r="32"/>${signsOnCircle(100, 60, 24, Math.min(q, 12), '−', 'neg')}`;
    const spread = S.hand ? Math.min(q, 10) * 7 : 0;
    let hair = '';
    for (let k = -3; k <= 3; k++) {
      const a = rad(-90 + k * (6 + spread / 3));
      hair += `<path class="hair" d="M${r1(215 + 10 * Math.cos(a))} ${r1(72 + 10 * Math.sin(a))}L${r1(215 + 24 * Math.cos(a))} ${r1(72 + 24 * Math.sin(a))}"/>`;
    }
    const arm = S.hand ? 'M205 105L131 66' : 'M205 105L188 140';
    const person = `<circle class="head" cx="215" cy="80" r="13"/>${hair}<path class="cw" d="M215 93V150M215 150L203 180M215 150L227 180M215 108L230 138M${arm.slice(1)}"/>`
      + '<rect class="stool" x="195" y="180" width="40" height="8"/><path class="cw" d="M200 188V200M230 188V200"/>';
    const gx = S.spark ? 46 : 22, gy = S.spark ? 92 : 150;
    const ground = `<path class="cw" d="M${gx} ${gy + 10}V200"/><circle class="gball" cx="${gx}" cy="${gy}" r="10"/>`
      + (S.spark ? '<path class="spark" d="M54 86L62 80L60 88L72 78"/>' : '');
    const glim = S.glow ? '<rect class="tube" x="24" y="16" width="44" height="12" rx="6" transform="rotate(25 46 22)"/><circle class="glimlight" cx="64" cy="31" r="6"/>' : '';
    ui.scene.innerHTML = `<svg viewBox="0 0 300 205" class="demo-svg">${dome}${person}${ground}${glim}</svg>`;
    ui.status.textContent = msg;
  };
  const flash = (key, ms, msg) => {
    S[key] = true; draw(msg);
    clearTimeout(timer);
    timer = setTimeout(() => { S[key] = false; draw(ui.status.textContent); }, ms);
  };
  const off = onAct(el, d => {
    if (d === 'crank') {
      S.q = Math.min(12, S.q + 2);
      draw(S.q >= 12 ? 'Die Kugel ist voll geladen.' : 'Das Gummiband transportiert Elektronen nach oben auf die Kugel.');
    } else if (d === 'hand') {
      S.hand = !S.hand;
      draw(S.hand ? (S.q ? 'Die Ladung verteilt sich bis in die Haare. Gleichnamig geladen stoßen sie sich ab.' : 'Die Kugel ist ungeladen, nichts passiert.') : 'Die Hand ist wieder weg.');
    } else if (d === 'ground') {
      if (S.q >= 4) { S.q = 0; flash('spark', 600, 'Funke! Die Elektronen springen durch die Luft zur Erdungskugel.'); }
      else { const had = S.q; S.q = 0; draw(had ? 'Die wenige Ladung fließt ohne sichtbaren Funken ab.' : 'Die Kugel ist ungeladen.'); }
    } else if (d === 'glim') {
      if (S.q >= 2) { S.q -= 2; flash('glow', 900, 'Die Glimmlampe leuchtet an der Elektrode an der Kugel: Die Kugel ist negativ.'); }
      else draw('Zu wenig Ladung, die Glimmlampe bleibt dunkel.');
    }
  });
  draw('Kurble, um die Kugel aufzuladen.');
  return () => { off(); clearTimeout(timer); };
}

/* ---------- Elektroskop ---------- */
function electroscope(el) {
  const S = { q: 0, rod: 'weg' };
  const ui = shell(el, `
    <button class="btn" data-d="nah">Stab annähern</button>
    <button class="btn" data-d="touch">Stab berühren lassen</button>
    <button class="btn" data-d="weg">Stab entfernen</button>
    <button class="btn" data-d="erden">Erden</button>`,
  'Der Kunststoffstab wurde mit einem Tuch gerieben und ist negativ geladen.');
  const draw = msg => {
    const induced = S.q === 0 && S.rod !== 'weg';
    const level = S.q < 0 ? (S.rod !== 'weg' ? 4 : 3) : induced ? 2.5 : 0;
    const phi = Math.min(45, level * 11);
    const px = 150, py = 122;
    const pointer = `<g transform="rotate(${r1(phi)} ${px} ${py})"><path class="pointer" d="M${px} ${py - 22}V${py + 44}"/></g>`;
    const ex = Math.sin(rad(phi)) * 36, ey = Math.cos(rad(phi)) * 36;
    let charges = '';
    if (induced) {
      charges += [-14, 0, 14].map(dx => `<text class="pos sm" x="${px + dx}" y="34">+</text>`).join('');
      charges += `<text class="neg sm" x="${r1(px + ex + 8)}" y="${r1(py + ey)}">−</text><text class="neg sm" x="${px - 9}" y="${py + 30}">−</text><text class="neg sm" x="${px - 9}" y="${py + 14}">−</text>`;
    } else if (S.q < 0) {
      charges += `<text class="neg sm" x="${px - 18}" y="34">−</text><text class="neg sm" x="${px + 18}" y="34">−</text><text class="neg sm" x="${px - 9}" y="80">−</text>`
        + `<text class="neg sm" x="${r1(px + ex + 8)}" y="${r1(py + ey)}">−</text><text class="neg sm" x="${px - 9}" y="${py + 30}">−</text>`;
    }
    const rodPos = { weg: [262, 40], nah: [188, 30], beruehrt: [176, 34] }[S.rod];
    const [rx, ry] = rodPos;
    const rod = `<g transform="translate(${rx} ${ry}) rotate(-20)"><rect class="rod" x="0" y="0" width="90" height="12" rx="4"/>`
      + [12, 30, 48, 66].map(x => `<text class="neg sm" x="${x}" y="10">−</text>`).join('') + '</g>';
    ui.scene.innerHTML = `<svg viewBox="0 0 300 205" class="demo-svg">
      <circle class="glass" cx="150" cy="130" r="58"/><rect class="body" x="120" y="186" width="60" height="12" rx="3"/>
      <rect class="metal" x="122" y="36" width="56" height="8" rx="3"/><path class="metalrod" d="M150 44V170"/>
      ${pointer}<circle class="dot" cx="${px}" cy="${py}" r="3"/>${charges}${rod}</svg>`;
    ui.status.textContent = msg;
  };
  const off = onAct(el, d => {
    if (d === 'nah') {
      S.rod = 'nah';
      draw(S.q < 0 ? 'Der Stab drückt noch mehr Elektronen nach unten, der Zeiger schlägt weiter aus.' : 'Ohne Berührung: Die Elektronen im Metall weichen nach unten aus (Influenz). Der Zeiger schlägt aus.');
    } else if (d === 'touch') {
      S.rod = 'beruehrt'; S.q = -3;
      draw('Elektronen gehen vom Stab auf das Elektroskop über.');
    } else if (d === 'weg') {
      S.rod = 'weg';
      draw(S.q < 0 ? 'Das Elektroskop bleibt negativ geladen, der Zeiger bleibt ausgeschlagen.' : 'Die Elektronen verteilen sich wieder gleichmäßig, der Zeiger fällt zurück.');
    } else if (d === 'erden') {
      if (S.rod !== 'weg') { draw('Entferne zuerst den Stab.'); return; }
      S.q = 0;
      draw('Über die Erdung fließen die überschüssigen Elektronen ab. Das Elektroskop ist neutral.');
    }
  });
  draw('Nähere den geladenen Stab an.');
  return off;
}

/* ---------- Elektronen im Metall ---------- */
function electrons(el) {
  el.innerHTML = `<canvas class="demo-canvas" width="320" height="170" aria-label="Animation: Atomrümpfe und freie Elektronen"></canvas>
    <p class="status" aria-live="polite"></p>
    <label class="slider">Spannung <input type="range" min="0" max="3" step="1" value="0" data-u> <span data-ulabel>aus</span></label>
    <p class="small note">Rot: Atomrümpfe (positiv), fest im Gitter. Blau: freie Elektronen. Die Elektronen bewegen sich zum Pluspol, die technische Stromrichtung zeigt in die Gegenrichtung. Modellgrenze: Die Bewegung ist stark verlangsamt und vergrößert, die gerichtete Bewegung im echten Draht viel langsamer.</p>`;
  const cv = el.querySelector('canvas'), ctx = cv.getContext('2d');
  const W = 320, H = 170, dpr = window.devicePixelRatio || 1;
  cv.width = W * dpr; cv.height = H * dpr;
  ctx.scale(dpr, dpr);
  const status = el.querySelector('.status');
  const NAMES = ['aus', 'klein', 'mittel', 'groß'];
  let U = 0, raf = 0, last = performance.now(), t = 0;
  const ions = [];
  for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) ions.push({ x: 30 + i * 33, y: 38 + j * 32 });
  const rnd = (a, b) => a + Math.random() * (b - a);
  const es = Array.from({ length: 40 }, () => {
    const a = rnd(0, 2 * Math.PI);
    return { x: rnd(0, W), y: rnd(26, H - 10), vx: 55 * Math.cos(a), vy: 55 * Math.sin(a) };
  });
  const crossings = [];
  const mid = W / 2;
  const frame = now => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now; t += dt;
    const vd = 22 * U;
    for (const e of es) {
      if (Math.random() < dt * 2.5) { const a = rnd(0, 2 * Math.PI); e.vx = 55 * Math.cos(a); e.vy = 55 * Math.sin(a); }
      const x0 = e.x;
      e.x += (e.vx + vd) * dt; e.y += e.vy * dt;
      if (e.y < 26 || e.y > H - 8) { e.vy *= -1; e.y = Math.max(26, Math.min(H - 8, e.y)); }
      if (x0 < mid && e.x >= mid) crossings.push([t, 1]);
      if (x0 >= mid && e.x < mid) crossings.push([t, -1]);
      if (e.x > W) e.x -= W;
      if (e.x < 0) e.x += W;
    }
    while (crossings.length && crossings[0][0] < t - 3) crossings.shift();
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = '#eef0f7'; ctx.fillRect(0, 18, W, H - 18);
    ctx.font = '600 11px Figtree, sans-serif'; ctx.fillStyle = '#1e2a66';
    ctx.textAlign = 'left'; ctx.fillText('− Minuspol', 4, 12);
    ctx.textAlign = 'right'; ctx.fillText('Pluspol +', W - 4, 12);
    ctx.strokeStyle = 'rgba(30,42,102,.35)'; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(mid, 20); ctx.lineTo(mid, H); ctx.stroke(); ctx.setLineDash([]);
    for (const p of ions) {
      const jx = Math.sin(t * 9 + p.x) * 1.2, jy = Math.cos(t * 11 + p.y) * 1.2;
      ctx.fillStyle = '#d9534f'; ctx.beginPath(); ctx.arc(p.x + jx, p.y + jy, 8, 0, 2 * Math.PI); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.fillText('+', p.x + jx, p.y + jy + 4);
    }
    ctx.fillStyle = '#2a6fdb';
    for (const e of es) { ctx.beginPath(); ctx.arc(e.x, e.y, 3.2, 0, 2 * Math.PI); ctx.fill(); }
    if (Math.round(t * 4) !== Math.round((t - dt) * 4)) {
      const net = crossings.reduce((s, c) => s + c[1], 0) / 3;
      status.textContent = `Durch die gestrichelte Linie nach rechts, abzüglich nach links: ${fmt(net, 1)} Elektronen pro Sekunde`;
    }
    raf = requestAnimationFrame(frame);
  };
  const input = el.querySelector('[data-u]');
  const onInput = () => { U = Number(input.value); el.querySelector('[data-ulabel]').textContent = NAMES[U]; };
  input.addEventListener('input', onInput);
  raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); input.removeEventListener('input', onInput); };
}

/* ---------- Kennlinien ---------- */
function kennlinie(el) {
  const S = { comp: 'wire', U: 6, pts: [] };
  const NAME = { wire: 'Konstantandraht', lamp: 'Glühlampe' };
  el.innerHTML = `<div class="seg"><button data-d="wire" class="on">Konstantandraht</button><button data-d="lamp">Glühlampe</button></div>
    <label class="slider">Spannung <input type="range" min="0" max="12" step="0.5" value="6" data-u></label>
    <p class="meter" aria-live="polite"></p>
    <div class="ctrl"><button class="btn primary" data-d="add">Messwert eintragen</button><button class="btn" data-d="clear">Löschen</button></div>
    <div class="scene"></div>
    <p class="small note">Trage für beide Bauteile mehrere Messwerte ein und vergleiche die Kurven.</p>`;
  const current = (c, U) => (c === 'wire' ? wireCurrent(U) : lampCurrent(U));
  const X = U => 34 + U * 21.5, Y = I => 170 - I * 450;
  const draw = () => {
    const I = current(S.comp, S.U);
    el.querySelector('.meter').innerHTML = `U = ${fmtFixed(S.U, 1)} V &nbsp; I = ${fmtFixed(I, 3)} A &nbsp; R = ${I > 0 ? fmt(S.U / I, 1) + ' Ω' : '–'}`;
    let axes = `<path class="axis" d="M${X(0)} ${Y(0)}H${X(12.6)}M${X(0)} ${Y(0)}V${Y(0.34)}"/>`;
    for (let u = 2; u <= 12; u += 2) axes += `<path class="tick" d="M${X(u)} ${Y(0)}v4"/><text class="ax" x="${X(u)}" y="${Y(0) + 15}">${u}</text>`;
    for (let i = 0.1; i <= 0.31; i += 0.1) axes += `<path class="tick" d="M${X(0)} ${r1(Y(i))}h-4"/><text class="ax" x="${X(0) - 16}" y="${r1(Y(i) + 4)}">${fmt(i, 1)}</text>`;
    axes += `<text class="ax" x="${X(11.4)}" y="${Y(0) - 8}">U in V</text><text class="ax" x="${X(0) + 26}" y="${Y(0.33)}">I in A</text>`;
    const dots = S.pts.map(p => `<circle class="pt ${p.c}" cx="${r1(X(p.U))}" cy="${r1(Y(p.I))}" r="4"/>`).join('');
    const legend = `<circle class="pt wire" cx="210" cy="22" r="4"/><text class="ax l" x="218" y="26">${NAME.wire}</text>`
      + `<circle class="pt lamp" cx="210" cy="38" r="4"/><text class="ax l" x="218" y="42">${NAME.lamp}</text>`;
    el.querySelector('.scene').innerHTML = `<svg viewBox="0 0 310 195" class="demo-svg">${axes}${dots}${legend}</svg>`;
  };
  const input = el.querySelector('[data-u]');
  const onInput = () => { S.U = Number(input.value); draw(); };
  input.addEventListener('input', onInput);
  const off = onAct(el, d => {
    if (d === 'wire' || d === 'lamp') {
      S.comp = d;
      el.querySelectorAll('.seg button').forEach(b => b.classList.toggle('on', b.dataset.d === d));
    } else if (d === 'add') {
      S.pts = S.pts.filter(p => !(p.c === S.comp && p.U === S.U));
      S.pts.push({ c: S.comp, U: S.U, I: current(S.comp, S.U) });
    } else if (d === 'clear') S.pts = [];
    draw();
  });
  draw();
  return () => { off(); input.removeEventListener('input', onInput); };
}

const DEMOS = { balloons, bandgen, electroscope, electrons, kennlinie };

export function mountDemo(el, id) {
  return DEMOS[id](el);
}
export const DEMO_IDS = Object.keys(DEMOS);
