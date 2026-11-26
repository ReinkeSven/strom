// Fokus-Modus: ein Missionsteil als Folge kleiner Schritte, auf jedem Bildschirm genau eine Sache.
import { missionParts, shuffle } from './model.js';
import { mountExercise, mountQuestion } from './exercises.js';
import { mountDemo } from './demos.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/**
 * @param hooks.onExit()                 Mission abbrechen
 * @param hooks.onRecord(exId, s, t)     Ergebnis einer ganzen Übung speichern
 * @param hooks.onPartDone(part)         Teil geschafft
 * @param hooks.onNextPart(part)         nächsten Teil starten
 * @param hooks.city()                  { svg, fresh }: Stadt mit hervorgehobenen neuen Häusern
 */
export function mountMission(el, topic, part, hooks) {
  const parts = missionParts(topic);
  const steps = [...parts[part]];   // falsch beantwortete Fragen kommen am Ende noch einmal dran
  const WRONG_DELAY = 3;               // Sekunden Lesezeit nach einer falschen Antwort
  const DEMO_MIN = 2;                  // so oft muss im Experiment etwas ausprobiert werden
  const exById = id => topic.exercises.find(e => e.id === id);
  const tally = {};
  let i = 0, cleanup = null, finished = false, timer = null;

  const nextBtn = () => el.querySelector('[data-m=next]');
  const enableNext = () => { const b = nextBtn(); if (b) b.disabled = false; };
  /** Weiter erst nach einer Wartezeit, mit sichtbarem Countdown */
  const enableNextAfter = sec => {
    const b = nextBtn();
    if (!b) return;
    const label = b.textContent;
    let left = sec;
    b.textContent = `${label} (${left})`;
    timer = setInterval(() => {
      left--;
      if (left > 0) { b.textContent = `${label} (${left})`; return; }
      clearInterval(timer); timer = null;
      b.textContent = label; b.disabled = false;
    }, 1000);
  };

  const cityBox = () => {
    if (!hooks.city) return '';
    const c = hooks.city();
    const msg = c.fresh ? `${c.fresh} ${c.fresh === 1 ? 'neues Haus hat' : 'neue Häuser haben'} jetzt Strom!` : 'Mit mehr richtigen Antworten bekommen weitere Häuser Strom.';
    return `<section class="card city"><p class="citymsg">${msg}</p>${c.svg}</section>`;
  };

  const finish = () => {
    if (!finished) { finished = true; hooks.onPartDone(part); }
    const merk = steps.filter(s => s.kind === 'merk').map(s => `<li>${esc(topic.merk[s.i])}</li>`).join('');
    const more = part + 1 < parts.length;
    el.innerHTML = `<div class="mission mdone">
      <div class="burst" aria-hidden="true">⭐</div>
      <h2>Geschafft!</h2>
      <p class="msub">${esc(topic.title)} · Teil ${part + 1} von ${parts.length}</p>
      ${cityBox()}
      ${merk ? `<section class="card merk"><h3>Das weißt du jetzt</h3><ul>${merk}</ul></section>` : ''}
      <div class="mend">
        ${more ? `<button class="btn primary big" data-m="nextpart">Weiter mit Teil ${part + 2}</button>` : ''}
        <button class="btn${more ? '' : ' primary'} big" data-m="exit">${more ? 'Pause machen' : 'Zur Übersicht'}</button>
      </div></div>`;
  };

  const render = () => {
    if (cleanup) { cleanup(); cleanup = null; }
    if (timer) { clearInterval(timer); timer = null; }
    if (i >= steps.length) { finish(); return; }
    const st = steps[i];
    const pct = Math.round((i / steps.length) * 100);
    el.innerHTML = `<div class="mission">
      <div class="mtop"><button class="mclose" data-m="exit" aria-label="Mission beenden">✕</button>
        <div class="mbar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
        <span class="mcount">${i + 1}/${steps.length}</span></div>
      <div class="mbody"></div>
      <div class="mfoot${st.kind === 'task' || st.kind === 'demo' ? ' static' : ''}"><button class="btn primary big" data-m="next" disabled>Weiter</button></div>
    </div>`;
    const body = el.querySelector('.mbody');
    if (st.kind === 'merk') {
      // Lückentext: Weiter erst, wenn das fehlende Wort gefunden ist
      const text = topic.merk[st.i];
      const [word, ...wrong] = topic.cloze[st.i];
      const [before, after] = text.split(word);
      const chips = shuffle([word, ...wrong]).map(w => `<button class="chip" data-w="${esc(w)}">${esc(w)}</button>`).join('');
      body.innerHTML = `<div class="merkcard"><p class="mk">Das hast du gerade herausgefunden</p>
        <p class="mtext">${esc(before)}<span class="gap">?</span>${esc(after)}</p></div>
        <p class="mhint">Welches Wort fehlt?</p><div class="chips">${chips}</div><p class="small cz"></p>`;
      const onChip = e => {
        const c = e.target.closest('[data-w]');
        if (!c || c.disabled) return;
        if (c.dataset.w === word) {
          body.querySelector('.gap').textContent = word;
          body.querySelector('.gap').classList.add('filled');
          body.querySelectorAll('.chip').forEach(x => { x.disabled = true; x.classList.toggle('right', x === c); });
          body.querySelector('.cz').textContent = 'Genau!';
          enableNext();
        } else {
          c.disabled = true; c.classList.add('wrong');
          body.querySelector('.cz').textContent = 'Lies den Satz noch einmal genau.';
        }
      };
      body.addEventListener('click', onChip);
      cleanup = () => body.removeEventListener('click', onChip);
    } else if (st.kind === 'demo') {
      // Weiter erst nach ein paar eigenen Versuchen
      const ex = exById(st.exId);
      body.innerHTML = `<h2 class="mh">${esc(ex.title.replace(/^(Experiment|Animation): /, ''))}</h2>
        <p class="mhint">Probier mindestens ${DEMO_MIN} Sachen aus. <span class="tries">(0 von ${DEMO_MIN})</span></p><section class="card demo"></section>`;
      const stop = mountDemo(body.querySelector('.demo'), ex.demo);
      let tries = 0;
      const count = e => {
        if (e.type === 'click' && !e.target.closest('[data-d], svg, canvas')) return;
        tries++;
        body.querySelector('.tries').textContent = tries >= DEMO_MIN ? '✓' : `(${tries} von ${DEMO_MIN})`;
        if (tries >= DEMO_MIN) enableNext();
      };
      const demoEl = body.querySelector('.demo');
      demoEl.addEventListener('click', count);
      demoEl.addEventListener('change', count);
      cleanup = () => { stop(); demoEl.removeEventListener('click', count); demoEl.removeEventListener('change', count); };
    } else if (st.kind === 'question') {
      const ex = exById(st.exId);
      if (st.retry) body.insertAdjacentHTML('beforebegin', '<p class="retry">Nochmal probieren</p>');
      cleanup = mountQuestion(body, ex.questions[st.qi], ok => {
        if (!st.retry) {
          const t = tally[st.exId] || (tally[st.exId] = { s: 0, n: 0 });
          t.n++; if (ok) t.s++;
          if (st.last) hooks.onRecord(st.exId, t.s, ex.questions.length);
          if (!ok) steps.push({ ...st, retry: true });
        }
        if (ok) enableNext(); else enableNextAfter(WRONG_DELAY);
      });
    } else {
      const ex = exById(st.exId);
      body.innerHTML = `<h2 class="mh">${esc(ex.title)}</h2><div class="mtask"></div>`;
      cleanup = mountExercise(body.querySelector('.mtask'), ex, (s, t) => { hooks.onRecord(st.exId, s, t); enableNext(); });
    }
    window.scrollTo(0, 0);
  };

  const onClick = e => {
    const b = e.target.closest('[data-m]');
    if (!b || !el.contains(b)) return;
    const m = b.dataset.m;
    if (m === 'next') { i++; render(); }
    else if (m === 'exit') hooks.onExit();
    else if (m === 'nextpart') hooks.onNextPart(part + 1);
  };
  el.addEventListener('click', onClick);
  render();
  return () => { if (cleanup) cleanup(); if (timer) clearInterval(timer); el.removeEventListener('click', onClick); };
}
