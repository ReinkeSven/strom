# Changelog

Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/), Versionierung nach [SemVer](https://semver.org/lang/de/).

## [0.7.0] - 2026-11-26

### Hinzugefügt
- Kopfanimation auf der Startseite statt Überschrift: Elektronen mit Gesichtern flitzen vom Minus- zum Pluspol durch einen Stromkreis; Antippen gibt Turbo, die Lampe leuchtet heller. Ruhig bei „Bewegung reduzieren“.

## [0.6.2] - 2026-11-26

### Geändert
- Schreibweise korrigiert: „Skibidi ADHD Mode“

## [0.6.1] - 2026-11-26

### Geändert
- Schalter heißt jetzt „Skibidi ADHD Mode“

## [0.6.0] - 2026-11-26

### Hinzugefügt
- Fokus-Modus (Schalter auf der Startseite): Jedes Thema wird zu Missionen aus kleinen Schritten mit genau einer Sache pro Bildschirm, Fortschrittsbalken und klarem Abschluss
- Erst ausprobieren, dann der Merksatz: Merksätze erscheinen als „Das hast du gerade herausgefunden“ direkt nach der passenden Übung
- Erklärungen im Fokus-Modus zunächst kurz (erster Satz), ausführlich auf Wunsch
- Startseite im Fokus-Modus mit großem „Weiter“-Knopf, Fortschrittspunkten je Mission und Sternen
- Ergebnisse aus Missionen zählen auch im normalen Modus

## [0.5.0] - 2026-11-26

### Entfernt
- Thema „Energie und Leistung“ mit Rechentraining und Quiz
- Aus „Widerstand und Ohmsches Gesetz“: Merksätze zu R = U / I und Ohm, Rechentraining, Fragen zu Drähten
- Rechenfragen zu Gesamtwiderständen, Formeln in den Merksätzen (I = Q / t, 1 A = 1 C/s), Widerstandsanzeige im Kennlinien-Experiment

### Geändert
- Thema 6 heißt jetzt „U-I-Kennlinien“ und enthält nur das Kennlinien-Experiment mit qualitativen Fragen
- Merksätze zu Reihen- und Parallelschaltung nur noch zu Stromstärke und Spannung

## [0.4.4] - 2026-11-26

### Hinzugefügt
- Skizzen auf den PDF-Blättern zu Luftballons, Bandgenerator, Elektroskop, Metallgitter und Wassermodell; im Lösungsschlüssel Ergebnisskizzen (abstoßende Ballons, Ballon an der Wand, Glimmlampe, Influenz am Elektroskop)

### Geändert
- Zeichnungen der Experimente als reine Funktionen herausgelöst, damit App und PDF dieselbe Quelle nutzen

## [0.4.3] - 2026-11-26

### Geändert
- Ankreuzfragen überarbeitet: Die richtige Antwort ist nicht mehr an ihrer Länge zu erkennen (22 Fragen mit neuen, gleich langen Antwortmöglichkeiten); ein Test wacht darüber
- Antwortreihenfolge wird gemischt: in der App bei jedem Durchgang neu, auf den PDF-Blättern fest; kurze Antworten mit natürlicher Reihenfolge bleiben stehen

## [0.4.2] - 2026-11-26

### Hinzugefügt
- Generator für Übungsblätter und Lösungsschlüssel als PDF (DIN A4): `npm run worksheets`
- Bauplätze im Bauauftrag sind beschriftet (S1 bis S3)

## [0.4.1] - 2026-11-22

### Geändert
- Überschrift der Startseite: „Papas Physik Punishment“

## [0.4.0] - 2026-11-22

### Hinzugefügt
- Wassermodell als Experiment: Wasserkreislauf und Stromkreis nebeneinander mit gemeinsamen Reglern für Pumpe/Spannung, Engstelle/Widerstand und Ventil/Schalter, Zuordnungstabelle und Grenzen des Modells
- Fragen zum Wassermodell und Zuordnungsübung (Thema Spannung), Merksatz zum Wassermodell
- Schaltungslöser mit einstellbarer Batteriespannung

## [0.3.0] - 2026-11-22

### Hinzugefügt
- Neues Thema „Schalter: UND, ODER, Wechsel“ mit Merksätzen
- Wahrheitstabellen für UND-, ODER- und Wechselschaltung: erst vorhersagen, dann Schalter antippen und ausprobieren
- Quiz „Schaltungen erkennen“ (u. a. fehlerhaft verdrahtete Wechselschaltung) und Alltagsbeispiele (Zweihandschaltung, Klingel, Treppenhaus, Autotüren, Waschmaschine)
- Wechselschalter als Bauteil im Schaltungslöser und Zeichner

## [0.2.0] - 2026-11-22

### Hinzugefügt
- 21 Übungen und Experimente zu allen neun Themen statt der „Bald hier“-Listen
- Experimente: Luftballons und Wand, Bandgenerator, Elektroskop, Elektronen im Metall (Animation), U-I-Kennlinien
- Quiz nach dem Muster Vorhersagen, Beobachten, Erklären: Schaltpläne leuchten erst nach der Antwort, mit berechneter Helligkeit und Messwerten
- Sortieren (Leiter/Isolator, typische Spannungen), Schaltzeichen-Memory, Rechentraining (Ohmsches Gesetz, Leistung, Stromkosten), Bauauftrag mit Schaltern
- Schaltungslöser (Knotenpotentialverfahren) und Schaltplan-Zeichner nach DIN
- Fortschritt je Übung (bester Wert, Versuche), Anzeige in der Themenliste

## [0.1.0] - 2026-11-22

### Hinzugefügt
- Grundgerüst als PWA nach dem Vorbild der Einmaleins-Arena: Offline-Cache, Installation, Backup per Datei oder Code
- Neun Themen der Elektrizitätslehre mit Merksätzen (Entwurf) und geplanten Übungen
- Fortschritt „gelesen“ pro Thema
- Unit-Tests (node:test), E2E-Tests (Playwright, Handy-Format), CI mit Deployment auf GitHub Pages
