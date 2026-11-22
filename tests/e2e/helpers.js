// Hilfsfunktionen für die E2E-Tests
import { test as base, expect } from '@playwright/test';

export const KEY = 'strom-labor-v1';

/** Fixture: blockiert externe Schriften, sammelt Seitenfehler und prüft am Ende, dass keine auftraten */
export const test = base.extend({
  page: async ({ page }, use) => {
    const errors = [];
    const isFont = url => /fonts\.(googleapis|gstatic)\.com/.test(url);
    page.on('pageerror', e => errors.push(String(e)));
    page.on('console', m => { if (m.type() === 'error' && !m.text().startsWith('Failed to load resource')) errors.push(m.text()); });
    page.on('response', r => { if (r.status() >= 400 && !isFont(r.url())) errors.push(`${r.status()} ${r.url()}`); });
    page.on('requestfailed', r => { if (!isFont(r.url())) errors.push(`fehlgeschlagen: ${r.url()}`); });
    await page.route(/fonts\.(googleapis|gstatic)\.com/, r => r.abort());
    await use(page);
    expect(errors, 'Fehler in der Seite').toEqual([]);
  },
});
export { expect };

export const readState = page => page.evaluate(k => JSON.parse(localStorage.getItem(k)), KEY);
