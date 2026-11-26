// Kopf der Startseite: Elektronen mit Gesichtern flitzen durch einen Stromkreis.
// Antippen gibt Turbo: schneller, die Lampe leuchtet heller. Physikalisch stimmig:
// Die Elektronen laufen außerhalb der Batterie vom Minus- zum Pluspol und werden nicht verbraucht.

const N = 12;
const BASE = 0.06;          // Umläufe pro Sekunde im Ruhezustand
const TURBO = 0.22;
const SHOUTS = ['Wiiieee!', 'Zzzt!', 'Turbo!', 'Juhuu!'];

function face(k) {
  return `<g class="e" data-k="${k}"><circle class="eb" r="8"/>`
    + '<circle class="eye" cx="-2.8" cy="-1.8" r="1.4"/><circle class="eye" cx="2.8" cy="-1.8" r="1.4"/>'
    + '<path class="smile" d="M-3.2 2Q0 4.8 3.2 2"/></g>';
}

/** Hängt die Animation in el ein und liefert eine Aufräumfunktion */
export function mountHero(el) {
  // Kreis: startet unten links am Minuspol, läuft nach rechts, hoch, oben zurück zum Pluspol
  const loop = 'M26 104H290Q302 104 302 92V30Q302 18 290 18H26';
  el.innerHTML = `<svg viewBox="0 -16 320 140" class="hero-svg" role="img" aria-label="Elektronen flitzen durch einen Stromkreis. Antippen für Turbo.">
    <path class="wire" d="${loop}"/><path class="wire" d="M26 18V44M26 78V104"/>
    <g class="es">${Array.from({ length: N }, (_, k) => face(k)).join('')}</g>
    <g class="bat"><rect x="12" y="44" width="28" height="34" rx="5"/><rect class="cap" x="20" y="40" width="12" height="5" rx="2"/>
      <text x="26" y="58">+</text><text x="26" y="74">−</text></g>
    <g class="lamp" transform="translate(196 18)">
      <circle class="glow" r="30"/><circle class="bulb" cy="-14" r="13"/><rect class="sock" x="-6" y="-3" width="12" height="7" rx="2"/>
      <path class="fil" d="M-5 -12Q-2.5 -18 0 -12Q2.5 -6 5 -12"/></g>
    <text class="shout" x="0" y="0"></text>
    <text class="hint" x="160" y="120">Antippen für Turbo</text>
  </svg>`;
  const svg = el.querySelector('svg');
  const path = svg.querySelector('path.wire');
  const len = path.getTotalLength();
  const es = [...svg.querySelectorAll('.e')];
  const glow = svg.querySelector('.glow'), bulb = svg.querySelector('.bulb'), shout = svg.querySelector('.shout');
  const still = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
  let pos = 0, speed = BASE, turboUntil = 0, raf = 0, last = performance.now();

  const place = () => {
    es.forEach((e, k) => {
      const p = path.getPointAtLength((((pos + k / N) % 1) * len));
      e.setAttribute('transform', `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)})`);
    });
    const b = (speed - BASE) / (TURBO - BASE);           // 0 … 1
    glow.setAttribute('opacity', (0.25 + 0.6 * b).toFixed(2));
    bulb.classList.toggle('hot', b > 0.5);
    svg.classList.toggle('turbo', b > 0.5);
  };

  const frame = now => {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    const target = now < turboUntil ? TURBO : BASE;
    speed += (target - speed) * Math.min(1, dt * 4);     // sanft beschleunigen und abbremsen
    pos = (pos + speed * dt) % 1;
    place();
    if (now > turboUntil) shout.textContent = '';
    raf = requestAnimationFrame(frame);
  };

  const onTap = () => {
    turboUntil = performance.now() + 2500;
    const e = es[Math.floor(Math.random() * N)];
    const m = /translate\(([\d.]+) ([\d.]+)\)/.exec(e.getAttribute('transform') || '');
    if (m) { shout.setAttribute('x', Math.min(260, Math.max(60, +m[1]))); shout.setAttribute('y', Math.max(14, +m[2] - 12)); }
    shout.textContent = SHOUTS[Math.floor(Math.random() * SHOUTS.length)];
    if (still) { speed = TURBO; place(); setTimeout(() => { speed = BASE; shout.textContent = ''; place(); }, 1500); }
  };
  svg.addEventListener('click', onTap);

  if (still) place();
  else raf = requestAnimationFrame(frame);
  return () => { cancelAnimationFrame(raf); svg.removeEventListener('click', onTap); };
}
