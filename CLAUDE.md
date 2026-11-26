# Hinweise für Claude

- Lerninhalte (Themen, Merksätze) gehören in `app/js/content.js` (reine Daten).
- Lernlogik gehört in `app/js/model.js` (reine Funktionen, kein DOM, Zeit und Zufall injizierbar) und wird in `tests/` getestet.
- `app/` wird unverändert ausgeliefert: kein Build-Schritt, keine Laufzeit-Abhängigkeiten.
- Vor jedem Commit `npm run check` und `npm run test:e2e`.
- Bei Änderungen in `app/` die Version erhöhen, gleichlautend in `app/sw.js` (VERSION), `app/js/app.js` (APP_VERSION) und `package.json`, und `CHANGELOG.md` pflegen.
- Speicherformat (`strom-labor-v1` im localStorage) abwärtskompatibel halten; neue Felder in `migrate()` ergänzen.
- UI-Texte auf Deutsch, Zielgruppe 8. Klasse Gymnasium (ca. 13–14 Jahre).
- Im Unterricht wird kaum gerechnet: keine Rechenaufgaben, keine Formeln in Merksätzen, Widerstand nur qualitativ (bremst den Strom). Ohmsches Gesetz und Energie/Leistung sind bewusst nicht enthalten. Der Übungstyp `calc` bleibt im Code für spätere Klassenstufen.
- Physik fachlich korrekt halten; Modelle (Wasser-, Elektronenmodell) nur mit Hinweis auf ihre Grenzen.
- Didaktischer Leitgedanke: typische Fehlvorstellungen gezielt aufgreifen (Strom wird verbraucht, Batterie als Konstantstromquelle, sequenzielles und lokales Denken), bevorzugt mit Vorhersagen-Beobachten-Erklären.
