// Fokus-Modus: ein Missionsteil als Folge kleiner Schritte, auf jedem Bildschirm genau eine Sache.
import { missionParts } from './model.js';
import { mountExercise, mountQuestion } from './exercises.js';
import { mountDemo } from './demos.js';

const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

/**
 * @param hooks.onExit()                 Mission abbrechen
 * @param hooks.onRecord(exId, s, t)     Ergebnis einer ganzen Übung speichern
 * @param hooks.onPartDone(part)         Teil geschafft
 * @param hooks.onNextPart(part)         nächsten Teil starten
 */
export function mountMission(el, topic, part, hooks) {
  const parts = missionParts(topic);
  const steps = parts[part];
  const exById = id => topic.exercises.find(e => e.id === id);
  const tally = {};
  let i = 0, cleanup = null, finished = false;

  const enableNext = () => { const b = el.querySelector('[data-m=next]'); if (b) b.disabled = false; };

  const finish = () => {
    if (!finished) { finished = true; hooks.onPartDone(part); }
    const merk = steps.filter(s => s.kind === 'merk').map(s => `<li>${esc(topic.merk[s.i])}</li>`).join('');
    const more = part + 1 < parts.length;
    el.innerHTML = `<div class="mission mdone">
      <div class="burst" aria-hidden="true">⭐</div>
      <h2>Geschafft!</h2>
      <p class="msub">${esc(topic.title)} · Teil ${part + 1} von ${parts.length}</p>
      ${merk ? `<section class="card merk"><h3>Das weißt du jetzt</h3><ul>${merk}</ul></section>` : ''}
      <div class="mend">
        ${more ? `<button class="btn primary big" data-m="nextpart">Weiter mit Teil ${part + 2}</button>` : ''}
        <button class="btn${more ? '' : ' primary'} big" data-m="exit">${more ? 'Pause machen' : 'Zur Übersicht'}</button>
      </div></div>`;
  };

  const render = () => {
    if (cleanup) { cleanup(); cleanup = null; }
    if (i >= steps.length) { finish(); return; }
    const st = steps[i];
    const pct = Math.round((i / steps.length) * 100);
    el.innerHTML = `<div class="mission">
      <div class="mtop"><button class="mclose" data-m="exit" aria-label="Mission beenden">✕</button>
        <div class="mbar" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100"><span style="width:${pct}%"></span></div>
        <span class="mcount">${i + 1}/${steps.length}</span></div>
      <div class="mbody"></div>
      <div class="mfoot${st.kind === 'task' || st.kind === 'demo' ? ' static' : ''}"><button class="btn primary big" data-m="next" disabled>${st.kind === 'merk' ? 'Verstanden' : 'Weiter'}</button></div>
    </div>`;
    const body = el.querySelector('.mbody');
    if (st.kind === 'merk') {
      body.innerHTML = `<div class="merkcard"><p class="mk">Das hast du gerade herausgefunden</p><p class="mtext">${esc(topic.merk[st.i])}</p></div>`;
      enableNext();
    } else if (st.kind === 'demo') {
      const ex = exById(st.exId);
      body.innerHTML = `<h2 class="mh">${esc(ex.title.replace(/^(Experiment|Animation): /, ''))}</h2>
        <p class="mhint">Probier es aus. Wenn du fertig bist, tippe auf „Weiter“.</p><section class="card demo"></section>`;
      cleanup = mountDemo(body.querySelector('.demo'), ex.demo);
      enableNext();
    } else if (st.kind === 'question') {
      const ex = exById(st.exId);
      cleanup = mountQuestion(body, ex.questions[st.qi], ok => {
        const t = tally[st.exId] || (tally[st.exId] = { s: 0, n: 0 });
        t.n++; if (ok) t.s++;
        if (st.last) hooks.onRecord(st.exId, t.s, ex.questions.length);
        enableNext();
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
  return () => { if (cleanup) cleanup(); el.removeEventListener('click', onClick); };
}
