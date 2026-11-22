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

test('Rechentraining: Eingabe mit Komma wird geprüft', async ({ page }) => {
  await openEx(page, 'widerstand', 'widerstand-rechnen');
  await page.fill('#ans', '0,0001');
  await page.click('#ex button[type=submit]');
  await expect(page.locator('#ex .why')).toBeVisible();
  await page.click('#ex [data-next]');
  await expect(page.locator('#ex .step')).toHaveText('Aufgabe 2 von 8');
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
