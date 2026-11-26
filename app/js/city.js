// Die Stadt auf der Startseite: Häuser bekommen Strom, wenn Übungen geschafft sind (reine SVG-Funktion).
import { cityState } from './model.js';

const r1 = x => Math.round(x * 10) / 10;
const GROUND = 134;

/** Wahrzeichen je Thema, gezeichnet um x (Mitte) auf dem Boden; on = gebaut und beleuchtet */
const LANDMARKS = [
  (x, on) => `<path class="lm" d="M${x - 6} ${GROUND}L${x - 2} ${GROUND - 78}H${x + 2}L${x + 6} ${GROUND}Z"/><path class="lmline" d="M${x - 5} ${GROUND - 20}H${x + 5}M${x - 4} ${GROUND - 45}H${x + 4}"/>`
    + `<circle class="${on ? 'blink' : 'off'}" cx="${x}" cy="${GROUND - 81}" r="2.6"/>`,                                   // Funkturm
  (x, on) => `<rect class="lm" x="${x - 14}" y="${GROUND - 38}" width="28" height="38"/><path class="lm" d="M${x - 16} ${GROUND - 38}L${x} ${GROUND - 50}L${x + 16} ${GROUND - 38}Z"/>`
    + `<circle class="${on ? 'win' : 'off'}" cx="${x}" cy="${GROUND - 43}" r="3.5"/>${win(x - 10, GROUND - 30, 3, 2, on)}`,      // Schule
  (x, on) => `<circle class="wheelring${on ? ' on' : ''}" cx="${x}" cy="${GROUND - 34}" r="20"/>`
    + [0, 45, 90, 135].map(a => { const c = Math.cos(a * Math.PI / 180) * 20, s = Math.sin(a * Math.PI / 180) * 20; return `<path class="lmline" d="M${r1(x - c)} ${r1(GROUND - 34 - s)}L${r1(x + c)} ${r1(GROUND - 34 + s)}"/>`; }).join('')
    + `<path class="lm" d="M${x - 10} ${GROUND}L${x} ${GROUND - 34}L${x + 10} ${GROUND}Z"/>`,                               // Riesenrad
  (x, on) => `<rect class="lm" x="${x - 16}" y="${GROUND - 26}" width="32" height="26"/><path class="lm" d="M${x - 16} ${GROUND - 26}Q${x} ${GROUND - 44} ${x + 16} ${GROUND - 26}Z"/>`
    + `<path class="${on ? 'winfill' : 'off'}" d="M${x - 7} ${GROUND}V${GROUND - 14}Q${x} ${GROUND - 22} ${x + 7} ${GROUND - 14}V${GROUND}Z"/>`,   // Bahnhof
  (x, on) => `<rect class="lm" x="${x - 9}" y="${GROUND - 70}" width="18" height="70"/>${win(x - 6, GROUND - 64, 2, 7, on)}`,     // Hochhaus
  (x, on) => `<path class="lm" d="M${x - 17} ${GROUND}V${GROUND - 18}Q${x} ${GROUND - 8} ${x + 17} ${GROUND - 18}V${GROUND}Z"/>`
    + `<path class="lmline" d="M${x - 15} ${GROUND - 18}V${GROUND - 42}M${x + 15} ${GROUND - 18}V${GROUND - 42}"/>`
    + `<rect class="${on ? 'win' : 'off'}" x="${x - 19}" y="${GROUND - 46}" width="8" height="4"/><rect class="${on ? 'win' : 'off'}" x="${x + 11}" y="${GROUND - 46}" width="8" height="4"/>`, // Stadion
  (x, on) => `<rect class="lm" x="${x - 14}" y="${GROUND - 44}" width="28" height="44"/>${win(x - 10, GROUND - 26, 3, 2, on)}`
    + `<path class="${on ? 'cross' : 'off'}" d="M${x - 2.5} ${GROUND - 41}h5v4h4v5h-4v4h-5v-4h-4v-5h4z"/>`,                     // Krankenhaus
  (x, on) => `<rect class="lm" x="${x - 15}" y="${GROUND - 34}" width="30" height="34"/><rect class="${on ? 'marquee' : 'off'}" x="${x - 17}" y="${GROUND - 26}" width="34" height="8"/>`
    + `<text class="${on ? 'kino' : 'kino off'}" x="${x}" y="${GROUND - 19.5}">KINO</text>`,                               // Kino
  (x, on) => `<path class="lm" d="M${x - 7} ${GROUND}L${x - 4} ${GROUND - 56}H${x + 4}L${x + 7} ${GROUND}Z"/><path class="stripe" d="M${x - 6} ${GROUND - 14}H${x + 6}M${x - 5} ${GROUND - 34}H${x + 5}"/>`
    + `<rect class="${on ? 'win' : 'off'}" x="${x - 4}" y="${GROUND - 63}" width="8" height="7"/>${on ? `<path class="beam" d="M${x + 4} ${GROUND - 60}L${x + 30} ${GROUND - 70}V${GROUND - 52}Z"/>` : ''}`, // Leuchtturm
];

function win(x0, y0, cols, rows, on) {
  let s = '';
  for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) s += `<rect class="${on ? 'win' : 'off'}" x="${x0 + c * 7}" y="${y0 + r * 9}" width="4" height="5"/>`;
  return s;
}

/** Häuser: feste, abwechslungsreiche Höhen */
const HOUSE_H = [22, 30, 18, 26, 34, 20, 28, 24, 32, 19, 27, 23];

/**
 * @param S Lernstand
 * @param opts.fresh Übungs-IDs, deren Häuser gerade neu Strom bekommen haben (werden hervorgehoben)
 */
export function citySvg(S, { fresh = [] } = {}) {
  const st = cityState(S);
  const W = 360, n = st.houses.length;
  const lmX = k => 70 + k * ((W - 82) / (st.landmarks.length - 1));
  const back = st.landmarks.map((l, k) => (l.built
    ? `<g class="built">${LANDMARKS[k % LANDMARKS.length](r1(lmX(k)), true)}</g>`
    : `<g class="plot"><rect x="${r1(lmX(k) - 12)}" y="${GROUND - 30}" width="24" height="30" rx="2"/><path d="M${r1(lmX(k) + 8)} ${GROUND - 30}V${GROUND - 52}H${r1(lmX(k) - 6)}M${r1(lmX(k) - 2)} ${GROUND - 52}v8"/></g>`)).join('');
  const hw = (W - 58) / n;
  const front = st.houses.map((h, k) => {
    const x = 54 + k * hw, hh = HOUSE_H[k % HOUSE_H.length], y = GROUND + 8 - hh;
    const cls = `house${h.lit ? ' lit' : ''}${fresh.includes(h.exId) ? ' fresh' : ''}`;
    const wins = [0, 1].map(r => `<rect class="hw" x="${r1(x + 2.5)}" y="${r1(y + 5 + r * 8)}" width="${r1(hw - 7)}" height="3.5"/>`).join('');
    return `<g class="${cls}"><path class="hb" d="M${r1(x)} ${GROUND + 8}V${r1(y)}L${r1(x + (hw - 2) / 2)} ${r1(y - 5)}L${r1(x + hw - 2)} ${r1(y)}V${GROUND + 8}Z"/>${wins}`
      + `${h.perfect ? `<text class="star" x="${r1(x + (hw - 2) / 2)}" y="${r1(y - 7)}">★</text>` : ''}</g>`;
  }).join('');
  const lampsOn = Math.round((st.lit / n) * 8);
  const lamps = Array.from({ length: 8 }, (_, k) => {
    const x = 60 + k * 40;
    return `<path class="pole" d="M${x} 150V141"/><circle class="${k < lampsOn ? 'lamp on' : 'lamp'}" cx="${x}" cy="140" r="2.2"/>`;
  }).join('');
  const all = st.lit === n;
  return `<svg class="city-svg${all ? ' complete' : ''}" viewBox="0 0 ${W} 152" role="img" aria-label="Deine Stadt: ${st.lit} von ${n} Häusern haben Strom, ${st.built} von ${st.landmarks.length} Gebäuden stehen">
    <defs><linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#141a3c"/><stop offset="1" stop-color="#2d2a5c"/></linearGradient></defs>
    <rect width="${W}" height="152" rx="12" fill="url(#sky)"/>
    ${[[30, 18], [96, 30], [150, 12], [210, 26], [262, 14], [330, 32], [300, 8]].map(([x, y]) => `<circle class="sky-star" cx="${x}" cy="${y}" r="1"/>`).join('')}
    <circle class="moon" cx="336" cy="20" r="8"/>
    <g class="plant"><rect x="6" y="${GROUND - 34}" width="34" height="34"/><rect x="12" y="${GROUND - 56}" width="7" height="22"/><path class="bolt" d="M27 ${GROUND - 26}l-5 9h4l-2 8 6-10h-4l2-7z"/></g>
    <path class="powerline" d="M40 ${GROUND - 30}Q${W / 2} ${GROUND - 12} ${W - 6} ${GROUND - 34}"/>
    ${back}<rect class="ground" x="0" y="${GROUND + 8}" width="${W}" height="${152 - GROUND - 8}"/>${front}${lamps}
  </svg>`;
}

export const cityLabel = S => { const st = cityState(S); return `${st.lit} von ${st.houses.length} Häusern haben Strom · ${st.built} von ${st.landmarks.length} Gebäuden`; };
