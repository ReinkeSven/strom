// End-to-End-Tests der Hauptabläufe im Handy-Format
import { test, expect, readState } from './helpers.js';
import { TOPICS } from '../../app/js/content.js';

const openEx = async (page, topic, ex) => {
  await page.goto('/');
  await page.click(`[data-topic=${topic}]`);
  await page.click(`[data-ex=${ex}]`);
};

test('Startseite listet alle Themen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero h1')).toHaveText('Papas Physik Punishment');
  await expect(page.locator('.topic')).toHaveCount(TOPICS.length);
  await expect(page.locator('#tabs button')).toHaveCount(2);
});

test('Thema öffnen, Merksätze lesen, als gelesen markieren, bleibt nach Neuladen erhalten', async ({ page }) => {
  await page.goto('/');
  await page.click('[data-topic=ladung]');
  await expect(page.locator('.hero h1')).toHaveText('Elektrische Ladung');
  await expect(page.locator('.merk li')).toHaveCount(TOPICS[0].merk.length);
  await page.click('[data-act=toggle-read]');
  await page.click('[data-act=back]');
  await expect(page.locator('.hero p')).toHaveText(`1 von ${TOPICS.length} Themen erledigt`);
  await page.reload();
  await expect(page.locator('.topic.done')).toHaveCount(1);
  const S = await readState(page);
  expect(S.topics.ladung.visits).toBe(1);
  expect(S.topics.ladung.read).toBeGreaterThan(0);
});

test('Backup: Code exportieren und auf frischem Gerät importieren', async ({ page, browser }) => {
  await page.goto('/');
  await page.click('[data-topic=spannung]');
  await page.click('[data-act=toggle-read]');
  await page.click('[data-tab=more]');
  const code = await page.locator('#exp').inputValue();
  expect(code.startsWith('STROM1:')).toBe(true);

  const other = await (await browser.newContext()).newPage();
  await other.goto('/');
  await other.click('[data-tab=more]');
  await other.fill('#imp', code);
  await other.click('[data-act=import]');
  await expect(other.locator('.small.ok')).toHaveText('Backup geladen.');
  await other.click('[data-tab=home]');
  await expect(other.locator('.topic.done')).toHaveCount(1);
});

test('Quiz mit Schaltplan: Vorhersage, danach leuchtet die Schaltung, Ergebnis wird gespeichert', async ({ page }) => {
  await openEx(page, 'schaltungen', 'schalt-hell');
  const ex = TOPICS.find(t => t.id === 'schaltungen').exercises.find(e => e.id === 'schalt-hell');
  for (const [k, q] of ex.questions.entries()) {
    await expect(page.locator('#ex .figwrap .halo')).toHaveCount(0);
    await page.click(`#ex [data-opt="${q.a}"]`);
    await expect(page.locator('#ex .why.ok')).toBeVisible();
    // erste Frage: zwei Lampen in Reihe leuchten nach der Antwort
    if (k === 0) await expect(page.locator('#ex .figwrap .halo')).toHaveCount(2);
    await page.click('#ex [data-next]');
  }
  await expect(page.locator('#ex .result .big')).toHaveText(`${ex.questions.length} von ${ex.questions.length} richtig`);
  const S = await readState(page);
  expect(S.ex['schalt-hell'].best).toBe(1);
  await page.click('[data-act=back-topic]');
  await expect(page.locator('[data-ex=schalt-hell].done')).toHaveCount(1);
});

test('Sortieren: falsche Wahl zeigt die richtige Lösung', async ({ page }) => {
  await openEx(page, 'modell', 'modell-sortieren');
  const item = await page.locator('#ex .item').textContent();
  const ex = TOPICS.find(t => t.id === 'modell').exercises.find(e => e.id === 'modell-sortieren');
  const wrong = 1 - ex.items.find(i => i.t === item).bin;
  await page.click(`#ex [data-bin="${wrong}"]`);
  await expect(page.locator('#ex .why.err')).toContainText('Nein');
});

test('Memory: Karten aufdecken', async ({ page }) => {
  await openEx(page, 'stromkreis', 'kreis-memory');
  await expect(page.locator('#ex .mem')).toHaveCount(14);
  await page.click('#ex [data-card="0"]');
  await page.click('#ex [data-card="1"]');
  await expect(page.locator('#ex .small')).toContainText('Versuche: 1');
});

test('Bauauftrag: Schalter im Zweig von L2 löst die Aufgabe', async ({ page }) => {
  await openEx(page, 'schaltungen', 'schalt-bau');
  await page.click('#ex [data-check]');
  await expect(page.locator('#ex .why.err')).toBeVisible();
  await page.click('#ex [data-slot=S3]');
  await page.click('#ex [data-mode=test]');
  await expect(page.locator('#ex .halo')).toHaveCount(2);
  await page.click('#ex [data-sw=S3]');
  await expect(page.locator('#ex .halo')).toHaveCount(1);
  await page.click('#ex [data-check]');
  await expect(page.locator('#ex .why.ok')).toContainText('Geschafft');
  expect((await readState(page)).ex['schalt-bau'].best).toBe(1);
});

for (const [topic, ex, act] of [
  ['ladung', 'ladung-ballons', 'rubA'], ['ladung', 'ladung-bandgen', 'crank'], ['ladung', 'ladung-elektroskop', 'nah'],
  ['modell', 'modell-elektronen', null], ['spannung', 'wasser-modell', 'narrow'], ['widerstand', 'widerstand-kennlinie', 'add'],
]) {
  test(`Experiment ${ex} läuft und hat Fragen`, async ({ page }) => {
    await openEx(page, topic, ex);
    await expect(page.locator('#ex .demo')).toBeVisible();
    if (act) {
      await page.click(`#ex [data-d=${act}]`);
      if (act === 'narrow') await expect(page.locator('#ex .demo .meter')).toContainText('0,10 A');
      else if (act !== 'add') await expect(page.locator('#ex .demo .status')).not.toBeEmpty();
    } else {
      await page.locator('#ex [data-u]').fill('3');
      await page.waitForTimeout(1500);
      await expect(page.locator('#ex .demo .status')).toContainText('Elektronen pro Sekunde');
    }
    await page.click('#ex .demo-quiz [data-opt="0"]');
    await expect(page.locator('#ex .demo-quiz .why')).toBeVisible();
  });
}

test('Wahrheitstabelle Wechselschaltung: vorhersagen, prüfen, dann Schalter ausprobieren', async ({ page }) => {
  await openEx(page, 'logik', 'logik-wechsel');
  await expect(page.locator('#ex [data-check]')).toBeDisabled();
  await expect(page.locator('#ex [data-sw]')).toHaveCount(0);
  // richtig: oben/oben an, oben/unten aus, unten/oben aus, unten/unten an
  for (const [k, on] of [[0, true], [1, false], [2, false], [3, true]]) {
    await page.click(`#ex [data-row="${k}"]`);
    if (!on) await page.click(`#ex [data-row="${k}"]`);
  }
  await page.click('#ex [data-check]');
  await expect(page.locator('#ex .why.ok')).toContainText('4 von 4 richtig');
  await expect(page.locator('#ex .halo')).toHaveCount(1);
  await expect(page.locator('#ex tr.now')).toHaveCount(1);
  await page.click('#ex [data-sw=S1]');
  await expect(page.locator('#ex .halo')).toHaveCount(0);
  await page.click('#ex [data-sw=S2]');
  await expect(page.locator('#ex .halo')).toHaveCount(1);
  expect((await readState(page)).ex['logik-wechsel'].best).toBe(1);
});

test('Fokus-Modus: Schalter, Mission Schritt für Schritt, Abschluss mit Stern', async ({ page }) => {
  const { missionParts } = await import('../../app/js/model.js');
  const t = TOPICS[0];
  const steps = missionParts(t)[0];
  await page.goto('/');
  await expect(page.locator('.topic')).toHaveCount(TOPICS.length);
  await page.click('.fswitch');
  await expect(page.locator('.mrow')).toHaveCount(TOPICS.length);
  await page.reload();
  await expect(page.locator('.cta')).toContainText(`${t.title} · Teil 1`);
  await page.click('.cta');
  await expect(page.locator('#tabs')).toBeHidden();
  for (const [k, st] of steps.entries()) {
    await expect(page.locator('.mcount')).toHaveText(`${k + 1}/${steps.length}`);
    const next = page.locator('[data-m=next]');
    if (st.kind === 'question') {
      await expect(next).toBeDisabled();
      const q = t.exercises.find(e => e.id === st.exId).questions[st.qi];
      await page.click(`.mbody [data-opt="${q.a}"]`);
      await expect(page.locator('.mbody .why.ok')).toBeVisible();
    }
    if (st.kind === 'merk') {
      await expect(next).toBeDisabled();
      const [word, wrong] = t.cloze[st.i];
      await page.click(`.chip[data-w="${wrong}"]`);
      await expect(next).toBeDisabled();
      await page.click(`.chip[data-w="${word}"]`);
      await expect(page.locator('.merkcard .mtext')).toHaveText(t.merk[st.i]);
    }
    if (st.kind === 'demo') {
      await expect(next).toBeDisabled();
      await page.locator('.mbody [data-d]').first().click();
      await page.locator('.mbody [data-d]').nth(1).click();
    }
    await next.click();
  }
  await expect(page.locator('.mdone h2')).toHaveText('Geschafft!');
  await page.click('[data-m=exit]');
  await expect(page.locator('.stars')).toHaveText('⭐ 1');
  await expect(page.locator('.cta')).toContainText('Teil 2');
  const S = await readState(page);
  expect(S.missions[t.id]).toEqual([0]);
  expect(S.ex['ladung-ballons'].best).toBe(1);
  await page.click('.fswitch');
  await expect(page.locator('.topic')).toHaveCount(TOPICS.length);
});

test('Fokus-Modus: Erklärung kurz, auf Wunsch ausführlich', async ({ page }) => {
  await page.goto('/');
  await page.click('.fswitch');
  await page.click('[data-mission="ladung:0"]');
  await page.locator('.mbody [data-d]').first().click();
  await page.locator('.mbody [data-d]').nth(1).click();
  await page.click('[data-m=next]');
  await page.click('.mbody [data-opt]:not([disabled])');
  const more = page.locator('.mbody [data-more]');
  if (await more.count()) {
    const before = (await page.locator('.mbody .why').textContent()).length;
    await more.click();
    expect((await page.locator('.mbody .why').textContent()).length).toBeGreaterThan(before);
  }
});

test('Kopfanimation: Elektronen bewegen sich, Antippen gibt Turbo', async ({ page }) => {
  await page.goto('/');
  const e = page.locator('#heroanim .e').first();
  const t0 = await e.getAttribute('transform');
  await page.waitForTimeout(400);
  expect(await e.getAttribute('transform')).not.toBe(t0);
  await page.click('#heroanim svg');
  await expect(page.locator('#heroanim .shout')).not.toHaveText('');
  await expect(page.locator('#heroanim svg.turbo')).toHaveCount(1);
});

test('ADHD-Mode: falsche Antwort kommt am Ende noch einmal, Weiter erst nach Lesezeit', async ({ page }) => {
  const { missionParts } = await import('../../app/js/model.js');
  const t = TOPICS.find(x => x.id === 'stromkreis');
  await page.goto('/');
  await page.click('.fswitch');
  // Teil 2 beginnt mit einer Frage
  await page.click('[data-mission="stromkreis:1"]');
  const st = missionParts(t)[1][0];
  const q = t.exercises.find(e => e.id === st.exId).questions[st.qi];
  const wrong = q.opts.findIndex((_, i) => i !== q.a);
  await expect(page.locator('.mcount')).toHaveText(`1/${missionParts(t)[1].length}`);
  await page.click(`.mbody [data-opt="${wrong}"]`);
  const next = page.locator('[data-m=next]');
  await expect(next).toBeDisabled();
  await expect(next).toContainText('(');
  await expect(next).toBeEnabled({ timeout: 5000 });
  await next.click();
  await expect(page.locator('.mcount')).toHaveText(`2/${missionParts(t)[1].length + 1}`);
});

test('Spielstand zurücksetzen: mit Rückfrage, Einstellung ADHD-Mode bleibt', async ({ page }) => {
  await page.goto('/');
  await page.click('.fswitch');
  await page.click('[data-mission="ladung:0"]');
  await page.click('[data-m=exit]');
  await page.evaluate(k => {
    const S = JSON.parse(localStorage.getItem(k));
    S.ex['kreis-leuchtet'] = { best: 1, done: 1, tries: 1 };
    S.missions.ladung = [0];
    localStorage.setItem(k, JSON.stringify(S));
  }, 'strom-labor-v1');
  await page.reload();
  await expect(page.locator('.stars')).toHaveText('⭐ 1');
  await page.click('[data-tab=more]');
  await page.click('[data-act=reset]');
  await page.click('[data-act=reset-no]');
  expect((await readState(page)).missions.ladung).toEqual([0]);
  await page.click('[data-act=reset]');
  await page.click('[data-act=reset-yes]');
  await expect(page.locator('.danger .ok')).toBeVisible();
  const S = await readState(page);
  expect(S.ex).toEqual({});
  expect(S.missions).toEqual({});
  expect(S.settings.focus).toBe(true);
  await page.click('[data-tab=home]');
  await expect(page.locator('.stars')).toHaveText('⭐ 0');
});

test('ADHD-Mode: Themen in beliebiger Reihenfolge wählbar', async ({ page }) => {
  await page.goto('/');
  await page.click('.fswitch');
  await page.click('.mrow:nth-child(7) .mpick');
  await expect(page.locator('.mission')).toBeVisible();
  await page.click('[data-m=exit]');
  await page.click('[data-mission="sicherheit:1"]');
  await expect(page.locator('.mcount')).toContainText('1/');
});

for (const [topic, ex, act] of [
  ['modell', 'modell-zoom', 'in'], ['stromkreis', 'kreis-kette', 'pedal'], ['stromstaerke', 'strom-zaehlstelle', null],
  ['spannung', 'spannung-rucksack', null], ['widerstand', 'widerstand-flur', null],
]) {
  test(`Erklärbild ${ex} läuft und hat Fragen`, async ({ page }) => {
    await openEx(page, topic, ex);
    await expect(page.locator('#ex .explain p')).toHaveCount(3);
    if (act) await page.click(`#ex [data-d=${act}]`);
    else await page.locator('#ex [data-u]').fill('2');
    await page.waitForTimeout(600);
    await page.click('#ex .demo-quiz [data-opt="0"]');
    await expect(page.locator('#ex .demo-quiz .why.ok')).toBeVisible();
  });
}

test('Erklärbild Zählstelle: mehr Stromstärke, mehr Elektronen pro Sekunde', async ({ page }) => {
  await openEx(page, 'stromstaerke', 'strom-zaehlstelle');
  await page.waitForTimeout(3200);
  const low = parseFloat((await page.locator('#ex .signt').textContent()).replace(',', '.'));
  await page.locator('#ex [data-u]').fill('3');
  await page.waitForTimeout(6000);   // Messfenster 3 s, dazu der Weg bis zur Zählstelle
  const high = parseFloat((await page.locator('#ex .signt').textContent()).replace(',', '.'));
  expect(high).toBeGreaterThan(low * 1.5);
});
