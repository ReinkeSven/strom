# Strom-Labor

[![CI & Deploy](https://github.com/ReinkeSven/strom/actions/workflows/ci.yml/badge.svg)](https://github.com/ReinkeSven/strom/actions/workflows/ci.yml)

Lern-App zur Elektrizitätslehre für die 8. Klasse Gymnasium, als installierbare Web-App für das Handy.

**App:** https://reinkesven.github.io/strom/

## Stand

Neun Themen mit Merksätzen und 23 Übungen: interaktive Experimente, Quiz nach dem Muster Vorhersagen, Beobachten, Erklären mit berechneten Schaltplänen, Sortieren, Memory, Wahrheitstabellen und ein Bauauftrag. Gerechnet wird bewusst nicht.

## Fokus-Modus

Schalter auf der Startseite, beschriftet mit „Skibidi ADHD Mode“. Ist er an, wird jedes Thema in Missionen aus 5 bis 10 kleinen Schritten zerlegt: eine Frage, ein Experiment oder ein Merksatz pro Bildschirm, mit Fortschrittsbalken und Abschluss. Merksätze erscheinen erst nach der passenden Übung (Feld `after` in `exercises-data.js`). Die Inhalte sind dieselben wie im normalen Modus. Gegen schnelles Durchklicken: Merksätze als Lückentext (Feld `cloze` in `content.js`), Experimente erst nach zwei Versuchen, Lesezeit nach falschen Antworten, Wiederholung falsch beantworteter Fragen.

## Stadt

Jede Übung ist ein Haus, jedes Thema ein Wahrzeichen (`app/js/city.js`). Ein Haus leuchtet ab 60 % richtiger Antworten, fehlerfrei gibt es einen Stern.

## Themen

1. Elektrische Ladung (Reibung, Luftballons, Bandgenerator)
2. Atome und Leiter (Atomrumpf-Elektronen-Modell)
3. Der Stromkreis
4. Stromstärke
5. Spannung
6. U-I-Kennlinien
7. Reihen- und Parallelschaltung
8. Schalter: UND, ODER, Wechsel
9. Sicherheit

Die Merksätze in [`app/js/content.js`](app/js/content.js) sind ein Entwurf und mit Schulbuch bzw. Heft abzugleichen.

## Physikalisches Modell der Schaltungen

Ideale Batterie (6 V, sehr kleiner Innenwiderstand), Lampen mit konstantem Widerstand (30 Ω), Amperemeter fast 0 Ω, Voltmeter sehr hochohmig. Berechnet mit dem Knotenpotentialverfahren in [`app/js/model.js`](app/js/model.js). Die Glühlampen-Kennlinie im Experiment ist dagegen nichtlinear.

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

### Übungsblätter (PDF)

```bash
npm run worksheets   # dist/Uebungsblaetter.pdf und dist/Loesungen.pdf (DIN A4)
```

Erzeugt aus denselben Inhalten Übungsblätter zum Ausdrucken, ein Blatt je Thema, und einen getrennten Lösungsschlüssel. Experimente werden auf Papier beschrieben statt ausprobiert, Rechenaufgaben sind fest vorgegeben (fester Zufallsstartwert), damit Blätter und Lösungen zusammenpassen.

### Aufbau

```
app/               ausgelieferte Web-App (wird so auf GitHub Pages veröffentlicht)
  index.html
  css/styles.css
  js/content.js    Themen und Merksätze (reine Daten)
  js/exercises-data.js  Übungen und Experimente je Thema (reine Daten)
  js/circuits.js   Schaltpläne als Netzliste mit Koordinaten (reine Daten)
  js/model.js      Lernstand, Schaltungslöser, Rechenaufgaben; reine Funktionen ohne DOM
  js/svg.js        Schaltplan-Zeichner (reine Funktionen)
  js/exercises.js  Übungsansichten
  js/demos.js      interaktive Experimente
  js/app.js        Oberfläche und Navigation
  sw.js            Service Worker (Offline-Cache)
  manifest.webmanifest
  icons/
tools/worksheets.mjs  Generator für die PDF-Übungsblätter
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
