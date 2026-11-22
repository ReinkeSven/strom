// End-to-End-Tests der Hauptabläufe im Handy-Format
import { test, expect, readState } from './helpers.js';
import { TOPICS } from '../../app/js/content.js';

test('Startseite listet alle Themen', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.hero h1')).toHaveText('Strom-Labor');
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
