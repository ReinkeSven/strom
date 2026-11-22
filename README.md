# Strom-Labor

[![CI & Deploy](https://github.com/ReinkeSven/strom/actions/workflows/ci.yml/badge.svg)](https://github.com/ReinkeSven/strom/actions/workflows/ci.yml)

Lern-App zur Elektrizitätslehre für die 8. Klasse Gymnasium, als installierbare Web-App für das Handy.

**App:** https://reinkesven.github.io/strom/

## Stand

Grundgerüst: Themenliste mit Merksätzen, Fortschritt „gelesen“, Backup. Experimente, Simulationen und Übungen folgen.

## Themen

1. Elektrische Ladung (Reibung, Luftballons, Bandgenerator)
2. Atome und Leiter (Atomrumpf-Elektronen-Modell)
3. Der Stromkreis
4. Stromstärke
5. Spannung
6. Widerstand und Ohmsches Gesetz
7. Reihen- und Parallelschaltung
8. Energie und Leistung
9. Sicherheit

Die Merksätze in [`app/js/content.js`](app/js/content.js) sind ein Entwurf und mit Schulbuch bzw. Heft abzugleichen.

## Daten und Datenschutz

Der Fortschritt liegt ausschließlich im Browser des Geräts (`localStorage`). Kein Server, kein Tracking, keine Accounts. Unter **Backup** gibt es Export als Datei oder Code und den Import auf einem anderen Gerät.

## Entwicklung

Voraussetzung: Node.js ab Version 20.

```bash
npm install
npm run check      # ESLint und Unit-Tests
npm run test:e2e   # Browser-Tests (einmalig vorher: npx playwright install chromium)
npm start          # lokaler Server auf http://localhost:8080
```

### Aufbau

```
app/               ausgelieferte Web-App (wird so auf GitHub Pages veröffentlicht)
  index.html
  css/styles.css
  js/content.js    Themen und Merksätze (reine Daten)
  js/model.js      Lernstand, reine Funktionen ohne DOM
  js/app.js        Oberfläche
  sw.js            Service Worker (Offline-Cache)
  manifest.webmanifest
  icons/
tests/             Unit-Tests (node:test)
tests/e2e/         Browser-Tests im Handy-Format (Playwright)
.github/workflows  CI (Lint, Unit- und Browser-Tests) und Deployment auf GitHub Pages
```

### Release

1. Änderungen auf `main` mergen. Die CI prüft und veröffentlicht automatisch.
2. Bei Änderungen an Dateien in `app/` die `VERSION` in `app/sw.js` erhöhen.
3. Eintrag in [`CHANGELOG.md`](CHANGELOG.md) ergänzen.

## Lizenz

[MIT](LICENSE)
