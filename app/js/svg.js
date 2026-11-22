// Schaltpläne als SVG-Text (reine Funktionen, kein DOM). Schaltzeichen nach DIN.
import { effective, solve, glow, fmtFixed } from './model.js';

const r1 = x => Math.round(x * 10) / 10;

/** Ableser für Messgeräte; sehr große Werte werden nicht als Zahl angezeigt */
function reading(kind, v) {
  if (kind === 'amp') return Math.abs(v) > 20 ? 'sehr groß!' : `${fmtFixed(Math.abs(v), 2)} A`;
  return `${fmtFixed(Math.abs(v), 1)} V`;
}

/** Schaltzeichen im lokalen Rahmen: Bauteil liegt waagerecht von -len/2 bis len/2 */
function local(kind, len, { g = 0, closed = false } = {}) {
  const h = len / 2;
  const lead = s => `<path class="cw" d="M${-h} 0H${-s}M${s} 0H${h}"/>`;
  switch (kind) {
    case 'bat':
      return `${lead(4)}<path class="cw thick" d="M-4 -6V6"/><path class="cw" d="M4 -12V12"/>`;
    case 'lamp': {
      const halo = g > 0.05 ? `<circle class="halo" r="${r1(12 + 8 * g)}" opacity="${r1(0.25 + 0.7 * g)}"/>` : '';
      return `${lead(11)}${halo}<circle class="cw ${g > 0.05 ? 'lit' : 'dark'}" r="11"/><path class="cw" d="M-7.8 -7.8L7.8 7.8M-7.8 7.8L7.8 -7.8"/>`;
    }
    case 'switch':
      return `${lead(14)}<circle class="dot" cx="-14" r="2.5"/><circle class="dot" cx="14" r="2.5"/>`
        + `<path class="cw" d="${closed ? 'M-14 0L14 0' : 'M-14 0L11 -13'}"/>`;
    case 'res':
      return `${lead(15)}<rect class="cw dark" x="-15" y="-6" width="30" height="12"/>`;
    case 'amp': case 'volt': case 'motor':
      return `${lead(11)}<circle class="cw dark" r="11"/>`;
    default:
      return `<path class="cw" d="M${-h} 0H${h}"/>`;
  }
}

const LETTER = { amp: 'A', volt: 'V', motor: 'M' };

/**
 * @param c Schaltung aus circuits.js
 * @param opts.sim true: berechnen und Helligkeit/Messwerte zeigen; false: unbeleuchtet, Messgeräte mit „?“
 * @param opts.st Schalterzustand und gesetzte Schalter (siehe effective)
 * @param opts.mode 'build': Bauplätze antippbar; 'test': Schalter antippbar
 * @param opts.labels Beschriftungen zeigen (Standard: ja)
 */
export function circuitSvg(c, { sim = false, st = {}, mode = null, labels = true, cls = '' } = {}) {
  const res = sim ? solve(c, st) : null;
  const w = c.w || 240, h = c.h || 160;
  const deg = {};
  let body = '', top = '';
  c.e.forEach((el, i) => {
    const [type, a, b, o = {}] = el;
    deg[a] = (deg[a] || 0) + 1;
    deg[b] = (deg[b] || 0) + 1;
    if (type === 'toggle') {
      deg[o.c2] = (deg[o.c2] || 0) + 1;
      const eff = effective(el, st);
      const [xa, ya] = c.n[a], [xb, yb] = c.n[b], [xc, yc] = c.n[o.c2];
      const [tx, ty] = eff.lower ? [xc, yc] : [xb, yb];
      body += `<path class="cw" d="M${xa} ${ya}L${tx} ${ty}"/><circle class="dot" cx="${xa}" cy="${ya}" r="3"/>`
        + `<circle class="contact" cx="${xb}" cy="${yb}" r="3"/><circle class="contact" cx="${xc}" cy="${yc}" r="3"/>`;
      const cx = (xa + xb) / 2, cy = ya;
      if (labels && o.label) top += `<text class="lbl" x="${r1(cx)}" y="${r1(Math.min(ya, yb, yc) - 9)}" text-anchor="middle">${o.label}</text>`;
      if (mode === 'test') top += `<circle class="tapzone" cx="${r1(cx)}" cy="${r1(cy)}" r="22" data-sw="${o.label}"/>`;
      return;
    }
    const [x1, y1] = c.n[a], [x2, y2] = c.n[b];
    const len = Math.hypot(x2 - x1, y2 - y1);
    const ux = (x2 - x1) / len, uy = (y2 - y1) / len;
    const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
    const ang = Math.atan2(uy, ux) * 180 / Math.PI;
    const eff = effective(el, st);
    const g = res && type === 'lamp' ? glow(res.P[i]) : 0;
    body += `<g transform="translate(${r1(mx)} ${r1(my)}) rotate(${r1(ang)})">${local(eff.kind, len, { g, closed: eff.closed })}</g>`;
    if (LETTER[type]) top += `<text class="sym" x="${r1(mx)}" y="${r1(my + 4.5)}">${LETTER[type]}</text>`;
    // Beschriftung: bei waagerechten Bauteilen darüber, bei senkrechten rechts daneben
    const horiz = Math.abs(ux) > Math.abs(uy);
    const lx = horiz ? mx : mx + 18, ly = horiz ? my - 18 : my + 4;
    const anchor = horiz ? 'middle' : 'start';
    if (type === 'bat') {
      // Pluspol liegt bei b
      const px = mx + ux * 9, py = my + uy * 9, nx = mx - ux * 9, ny = my - uy * 9;
      const off = horiz ? [0, -16] : [-14, 0];
      top += `<text class="pole" x="${r1(px + off[0])}" y="${r1(py + off[1] + 4)}">+</text><text class="pole" x="${r1(nx + off[0])}" y="${r1(ny + off[1] + 4)}">−</text>`;
    } else if (labels && (type === 'amp' || type === 'volt')) {
      const val = res ? reading(type, type === 'amp' ? res.I[i] : res.V[a] - res.V[b]) : '?';
      top += `<text class="lbl" x="${r1(lx)}" y="${r1(ly)}" text-anchor="${anchor}">${o.label} = ${val}</text>`;
    } else if (labels && o.label && type !== 'slot') {
      top += `<text class="lbl" x="${r1(lx)}" y="${r1(ly)}" text-anchor="${anchor}">${o.label}</text>`;
    }
    if (type === 'switch' && o.label && mode === 'test') top += `<circle class="tapzone" cx="${r1(mx)}" cy="${r1(my)}" r="18" data-sw="${o.label}"/>`;
    if (type === 'slot') {
      if (mode === 'build') {
        top += `<g class="slot${eff.kind === 'switch' ? ' filled' : ''}" data-slot="${o.label}"><circle cx="${r1(mx)}" cy="${r1(my)}" r="16"/>`
          + (eff.kind === 'switch' ? '' : `<text x="${r1(mx)}" y="${r1(my + 5)}">+</text>`) + '</g>';
      } else if (mode === 'test' && eff.kind === 'switch') {
        top += `<circle class="tapzone" cx="${r1(mx)}" cy="${r1(my)}" r="18" data-sw="${o.label}"/>`;
      }
    }
  });
  const dots = Object.entries(deg).filter(([, d]) => d >= 3).map(([k]) => `<circle class="dot" cx="${c.n[k][0]}" cy="${c.n[k][1]}" r="3.5"/>`).join('');
  return `<svg class="circuit ${cls}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Schaltplan">${body}${dots}${top}</svg>`;
}
