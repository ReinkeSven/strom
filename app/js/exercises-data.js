// Übungen und Experimente je Thema. Reine Daten, kein DOM.
// Typen:
//   quiz   { questions: [{ q, fig?, opts: [Text | { fig }], a, why }] }   fig = Schaltung aus circuits.js;
//          vor der Antwort unbeleuchtet, danach berechnet (Vorhersagen, Beobachten, Erklären)
//   demo   { demo, questions }                                            interaktives Experiment, danach Fragen
//   sort   { prompt, bins: [Text], items: [{ t, bin, why? }] }
//   memory { pairs: [[Schaltzeichen, Name]] }
//   calc   { gen, count }                                                 Aufgaben aus model.GENERATORS
//   build  {}                                                             Bauauftrag mit Schaltern
//   truth  { circuit, states: [Name für false, Name für true], prompt, why } Wahrheitstabelle vorhersagen, dann ausprobieren

const yesNo = ['Ja', 'Nein'];

export const EX = {
  ladung: [
    {
      id: 'ladung-ballons', type: 'demo', demo: 'balloons', title: 'Experiment: Luftballons',
      questions: [
        { q: 'Du reibst beide Ballons am Wolltuch und lässt sie nebeneinander hängen. Was passiert?', opts: ['Sie ziehen sich an', 'Sie stoßen sich ab', 'Nichts'], a: 1,
          why: 'Beide Ballons haben Elektronen vom Tuch aufgenommen und sind negativ geladen. Gleichnamige Ladungen stoßen sich ab.' },
        { q: 'Ein geriebener Ballon und das Wolltuch …', opts: ['ziehen sich an', 'stoßen sich ab', 'beeinflussen sich nicht'], a: 0,
          why: 'Der Ballon hat Elektronenüberschuss (negativ), das Tuch Elektronenmangel (positiv). Ungleichnamige Ladungen ziehen sich an.' },
        { q: 'Warum bleibt ein geriebener Ballon an der ungeladenen Wand hängen?', opts: ['Die Wand ist positiv geladen', 'In der Wand verschieben sich Ladungen: Die positiven Anteile rücken näher an den Ballon', 'Der Ballon ist vom Reiben klebrig'], a: 1,
          why: 'Der negative Ballon drückt die Elektronen in den Atomen der Wand ein Stück weg. Die positive Seite liegt dann näher am Ballon und zieht stärker an, als die negative abstößt. In Isolatoren wie der Wand verschieben sich die Ladungen nur innerhalb der Atome (Polarisation).' },
        { q: 'Wird beim Reiben Ladung erzeugt?', opts: ['Ja, durch die Reibung', 'Nein, Elektronen wechseln nur vom Tuch auf den Ballon'], a: 1,
          why: 'Ladung wird nur getrennt. Ballon und Tuch zusammen sind weiterhin elektrisch neutral.' },
      ],
    },
    {
      id: 'ladung-bandgen', type: 'demo', demo: 'bandgen', title: 'Experiment: Bandgenerator',
      questions: [
        { q: 'Du stehst auf einem Kunststoffhocker und legst die Hand auf die geladene Kugel. Warum stehen deine Haare ab?', opts: ['Die Haare sind gleichnamig geladen und stoßen sich ab', 'Die Kugel zieht die Haare an', 'Die Kugel wird warm'], a: 0,
          why: 'Die Ladung verteilt sich über deinen Körper bis in die Haare. Gleichnamig geladene Haare stoßen sich ab und stehen möglichst weit auseinander.' },
        { q: 'Warum stehst du dabei auf einem isolierenden Hocker?', opts: ['Damit die Ladung nicht über den Boden abfließt', 'Damit die Kugel schneller lädt', 'Damit du die Kugel besser erreichst'], a: 0,
          why: 'Dein Körper leitet. Ohne Isolierung würden die Elektronen sofort über die Füße in den Boden abfließen.' },
        { q: 'Die Glimmlampe leuchtet an der Elektrode, die zur Kugel zeigt. Wie ist die Kugel geladen?', opts: ['Positiv', 'Negativ'], a: 1,
          why: 'Eine Glimmlampe leuchtet an der Elektrode, die mit dem negativen Pol verbunden ist. Die Kugel ist also negativ geladen.' },
        { q: 'Was ist der Funke zwischen Kugel und Erdungskugel?', opts: ['Ein kurzer Ladungsausgleich durch die Luft', 'Brennendes Gummi', 'Licht aus dem Inneren der Kugel'], a: 0,
          why: 'Bei großer Ladung springen Elektronen durch die Luft zur Erdungskugel, die Luft leuchtet dabei. Ein Blitz funktioniert nach demselben Prinzip, nur viel größer.' },
      ],
    },
    {
      id: 'ladung-elektroskop', type: 'demo', demo: 'electroscope', title: 'Experiment: Elektroskop',
      questions: [
        { q: 'Du näherst den negativ geladenen Stab dem Elektroskop, ohne es zu berühren. Was passiert?', opts: ['Der Zeiger schlägt aus', 'Nichts, solange der Stab nicht berührt'], a: 0,
          why: 'Die Elektronen im Metall werden vom Stab abgestoßen und wandern nach unten in Zeiger und Halterung. Beide sind dann negativ und stoßen sich ab (Influenz). Entfernst du den Stab, verteilen sich die Elektronen wieder und der Zeiger fällt zurück.' },
        { q: 'Nach dem Berühren entfernst du den Stab. Der Zeiger …', opts: ['bleibt ausgeschlagen', 'fällt sofort zurück'], a: 0,
          why: 'Beim Berühren sind Elektronen vom Stab auf das Elektroskop übergegangen. Es bleibt negativ geladen, bis du es erdest.' },
        { q: 'Was zeigt ein Elektroskop an?', opts: ['Ob ein Körper geladen ist', 'Die Stromstärke', 'Die Temperatur'], a: 0,
          why: 'Je größer die Ladung, desto weiter schlägt der Zeiger aus. Ob sie positiv oder negativ ist, zeigt es allein nicht.' },
      ],
    },
  ],

  modell: [
    {
      id: 'modell-elektronen', type: 'demo', demo: 'electrons', title: 'Animation: Elektronen im Metall',
      questions: [
        { q: 'Was bewegt sich in einem Metalldraht, wenn Strom fließt?', opts: ['Die Atomrümpfe', 'Die freien Elektronen', 'Beide gleich schnell'], a: 1,
          why: 'Die Atomrümpfe sitzen fest im Gitter und schwingen nur auf der Stelle. Die freien Elektronen bewegen sich zusätzlich in eine Richtung.' },
        { q: 'Ohne Spannung bewegen sich die freien Elektronen …', opts: ['gar nicht', 'ungeordnet in alle Richtungen', 'alle in dieselbe Richtung'], a: 1,
          why: 'Sie flitzen ungeordnet hin und her. Im Mittel fließt dabei keine Ladung in eine Richtung, also kein Strom.' },
        { q: 'Die Elektronen kommen im Draht nur Bruchteile eines Millimeters pro Sekunde voran. Warum leuchtet die Lampe trotzdem sofort?', opts: ['Alle Elektronen im ganzen Stromkreis setzen sich gleichzeitig in Bewegung', 'Die Elektronen sind in Wirklichkeit lichtschnell', 'Die Lampe hat Strom gespeichert'], a: 0,
          why: 'Der Draht ist von Anfang an voller Elektronen. Beim Einschalten setzen sich alle gleichzeitig in Bewegung, wie Perlen auf einer Kette. Hier hat das Modell eine Grenze: In der Animation sind die Elektronen viel zu schnell dargestellt.' },
      ],
    },
    {
      id: 'modell-sortieren', type: 'sort', title: 'Leiter oder Isolator?',
      prompt: 'Leitet das Material den elektrischen Strom?',
      bins: ['Leiter', 'Isolator'],
      items: [
        { t: 'Kupfer', bin: 0, why: 'Metalle enthalten frei bewegliche Elektronen.' },
        { t: 'Eisennagel', bin: 0, why: 'Metalle enthalten frei bewegliche Elektronen.' },
        { t: 'Alufolie', bin: 0, why: 'Aluminium ist ein Metall.' },
        { t: 'Bleistiftmine (Graphit)', bin: 0, why: 'Graphit ist kein Metall, hat aber frei bewegliche Elektronen.' },
        { t: 'Salzwasser', bin: 0, why: 'Im Salzwasser sind geladene Teilchen (Ionen) frei beweglich.' },
        { t: 'Menschlicher Körper', bin: 0, why: 'Der Körper enthält salzhaltiges Wasser. Deshalb ist die Netzspannung lebensgefährlich.' },
        { t: 'Kunststoff', bin: 1, why: 'Keine frei beweglichen Ladungsträger.' },
        { t: 'Glas', bin: 1, why: 'Keine frei beweglichen Ladungsträger.' },
        { t: 'Gummi', bin: 1, why: 'Darum sind Kabel mit Gummi oder Kunststoff ummantelt.' },
        { t: 'Trockenes Holz', bin: 1, why: 'Trocken leitet Holz praktisch nicht, nasses Holz dagegen schon ein wenig.' },
        { t: 'Luft', bin: 1, why: 'Erst bei sehr hoher Spannung wird Luft leitend, zum Beispiel beim Blitz.' },
        { t: 'Porzellan', bin: 1, why: 'Deshalb hängen Hochspannungsleitungen an Isolatoren aus Porzellan oder Glas.' },
      ],
    },
  ],

  stromkreis: [
    {
      id: 'kreis-memory', type: 'memory', title: 'Schaltzeichen-Memory',
      pairs: [['bat', 'Batterie'], ['lamp', 'Lampe'], ['switch', 'Schalter'], ['res', 'Widerstand'], ['amp', 'Amperemeter'], ['volt', 'Voltmeter'], ['motor', 'Motor']],
    },
    {
      id: 'kreis-leuchtet', type: 'quiz', title: 'Leuchtet die Lampe?',
      questions: [
        { q: 'Leuchtet die Lampe?', fig: 'einfach', opts: yesNo, a: 0,
          why: 'Der Stromkreis ist geschlossen: vom Pluspol über die Lampe zurück zum Minuspol.' },
        { q: 'Leuchtet die Lampe?', fig: 'schalter_offen', opts: yesNo, a: 1,
          why: 'Der offene Schalter unterbricht den Stromkreis.' },
        { q: 'Leuchtet die Lampe?', fig: 'zwei_schalter', opts: yesNo, a: 1,
          why: 'Ein Schalter ist offen. In einem unverzweigten Stromkreis reicht eine einzige Unterbrechung, damit nirgends Strom fließt.' },
        { q: 'Leuchtet die Lampe?', fig: 'lampe_ueberbrueckt', opts: yesNo, a: 1,
          why: 'Die Leitung neben der Lampe hat fast keinen Widerstand. Der Strom nimmt diesen Weg, durch die Lampe fließt so gut wie nichts: Sie ist kurzgeschlossen. Gleichzeitig ist auch die Batterie kurzgeschlossen, der Strom wird sehr groß.' },
        { q: 'Leuchtet die Lampe?', fig: 'schalter_parallel', opts: yesNo, a: 0,
          why: 'Ein offener Schalter neben der Lampe wirkt wie gar keine Leitung. Der Strom fließt durch die Lampe. Würdest du ihn schließen, wäre die Lampe kurzgeschlossen.' },
      ],
    },
  ],

  stromstaerke: [
    {
      id: 'strom-vorhersage', type: 'quiz', title: 'Vorhersage: Strom vor und hinter der Lampe',
      questions: [
        { q: 'A1 misst die Stromstärke vor der Lampe, A2 dahinter. Was zeigt A2 im Vergleich zu A1?', fig: 'amp_vor_nach', opts: ['Mehr', 'Gleich viel', 'Weniger', 'Null'], a: 1,
          why: 'Im unverzweigten Stromkreis ist die Stromstärke überall gleich. So viel Ladung, wie in die Lampe hineinfließt, fließt auch wieder heraus.' },
        { q: 'Was „verbraucht“ die Lampe also?', opts: ['Strom', 'Energie', 'Elektronen'], a: 1,
          why: 'Umgewandelt wird Energie: elektrische Energie in Licht und Wärme. Der Strom fließt vollständig weiter.' },
        { q: 'Kommen die Elektronen, die durch die Lampe fließen, aus der Batterie?', opts: ['Ja, die Batterie gibt Elektronen ab, die in der Lampe verbraucht werden', 'Nein, die Elektronen sind schon in Draht und Lampe, die Batterie treibt sie nur an'], a: 1,
          why: 'Die Leitungen sind von Anfang an voller freier Elektronen. Die Batterie wirkt wie eine Pumpe, die sie im Kreis antreibt. Leer wird eine Batterie, weil ihre Energie aufgebraucht ist, nicht ihre Elektronen.' },
      ],
    },
    {
      id: 'strom-messen', type: 'quiz', title: 'Amperemeter richtig einbauen',
      questions: [
        { q: 'In welcher Schaltung misst das Amperemeter die Stromstärke durch die Lampe richtig?', opts: [{ fig: 'amp_reihe' }, { fig: 'amp_parallel' }], a: 0,
          why: 'Das Amperemeter wird in Reihe geschaltet, damit der ganze Strom hindurchfließt. Parallel zur Lampe schließt es die Lampe kurz, weil es fast keinen Widerstand hat. Der Strom wird dann sehr groß, und das Messgerät kann kaputtgehen.' },
        { q: 'Warum hat ein Amperemeter einen sehr kleinen Widerstand?', opts: ['Damit es den Strom, den es misst, kaum verändert', 'Damit es leichter ist', 'Damit es nicht warm wird'], a: 0,
          why: 'Es liegt in Reihe im Stromkreis. Hätte es einen großen Widerstand, würde es den Strom bremsen und einen falschen, zu kleinen Wert anzeigen.' },
      ],
    },
  ],

  spannung: [
    {
      id: 'spannung-messen', type: 'quiz', title: 'Voltmeter richtig einbauen',
      questions: [
        { q: 'In welcher Schaltung misst das Voltmeter die Spannung an der Lampe richtig?', opts: [{ fig: 'volt_reihe' }, { fig: 'volt_parallel' }], a: 1,
          why: 'Das Voltmeter wird parallel geschaltet, denn es misst den Unterschied zwischen zwei Punkten. In Reihe bremst sein sehr großer Widerstand den Strom fast vollständig: Die Lampe bleibt dunkel, und das Voltmeter zeigt ungefähr die Batteriespannung.' },
        { q: 'Liegt an einer Batterie Spannung an, wenn nichts angeschlossen ist?', opts: ['Ja', 'Nein, erst wenn Strom fließt'], a: 0,
          why: 'Die Spannung entsteht durch die Ladungstrennung in der Batterie. Sie ist auch ohne Stromkreis da. Erst wenn der Kreis geschlossen ist, fließt Strom.' },
        { q: 'Ein Vogel sitzt auf einer Hochspannungsleitung. Warum passiert ihm nichts?', opts: ['Zwischen seinen Füßen liegt fast keine Spannung, weil beide auf derselben Leitung stehen', 'Vögel leiten keinen Strom', 'Die Spannung ist nachts abgeschaltet'], a: 0,
          why: 'Spannung liegt immer zwischen zwei Punkten an. Zwischen zwei Füßen auf demselben Draht ist sie winzig. Gefährlich wird es, wenn ein Vogel zwei Leitungen oder Leitung und Mast gleichzeitig berührt.' },
      ],
    },
    {
      id: 'spannung-sortieren', type: 'sort', title: 'Typische Spannungen',
      prompt: 'Welche Spannung gehört dazu?',
      bins: ['1,5 V', '3,7 V', '12 V', '230 V', 'viele Millionen V'],
      items: [
        { t: 'Mignon-Batterie (AA)', bin: 0 },
        { t: 'Micro-Batterie (AAA)', bin: 0, why: 'Die kleinere Bauform hat dieselbe Spannung, speichert aber weniger Energie.' },
        { t: 'Handy-Akku', bin: 1 },
        { t: 'Autobatterie', bin: 2 },
        { t: 'Steckdose', bin: 3 },
        { t: 'Wasserkocher', bin: 3, why: 'Er läuft an der Steckdose.' },
        { t: 'Blitz', bin: 4, why: 'Zwischen Wolke und Boden liegen oft über hundert Millionen Volt.' },
      ],
    },
  ],

  widerstand: [
    {
      id: 'widerstand-kennlinie', type: 'demo', demo: 'kennlinie', title: 'Experiment: U-I-Kennlinien',
      questions: [
        { q: 'Wie sieht die Kennlinie des Konstantandrahts aus?', opts: ['Eine Ursprungsgerade', 'Eine Kurve, die immer flacher wird', 'Eine waagerechte Linie'], a: 0,
          why: 'Doppelte Spannung, doppelte Stromstärke: I ist proportional zu U. Das ist das Ohmsche Gesetz, der Widerstand bleibt gleich.' },
        { q: 'Bei der Glühlampe wird die Kennlinie immer flacher. Was bedeutet das für ihren Widerstand?', opts: ['Er wird größer', 'Er wird kleiner', 'Er bleibt gleich'], a: 0,
          why: 'Bei höherer Spannung wächst die Stromstärke immer weniger. Also wird R = U / I größer.' },
        { q: 'Warum steigt der Widerstand der Glühlampe?', opts: ['Der Glühdraht wird heiß', 'Die Batterie wird leer', 'Das Glas wird dunkler'], a: 0,
          why: 'In heißem Metall schwingen die Atomrümpfe stärker und behindern die Elektronen mehr. Das Ohmsche Gesetz gilt nur bei konstanter Temperatur.' },
      ],
    },
    { id: 'widerstand-rechnen', type: 'calc', gen: 'ohm', count: 8, title: 'Rechentraining: R = U / I' },
    {
      id: 'widerstand-draht', type: 'quiz', title: 'Widerstand von Drähten',
      questions: [
        { q: 'Ein Draht wird doppelt so lang, Material und Dicke bleiben gleich. Sein Widerstand …', opts: ['verdoppelt sich', 'halbiert sich', 'bleibt gleich'], a: 0,
          why: 'Die Elektronen müssen einen doppelt so langen Weg durch das Gitter zurücklegen.' },
        { q: 'Ein dickerer Draht aus demselben Material und mit derselben Länge hat …', opts: ['einen kleineren Widerstand', 'einen größeren Widerstand', 'denselben Widerstand'], a: 0,
          why: 'Im dickeren Draht können mehr Elektronen nebeneinander fließen.' },
        { q: 'Kupfer- und Konstantandraht sind gleich lang und gleich dick. Welcher hat den kleineren Widerstand?', opts: ['Kupfer', 'Konstantan', 'Beide gleich'], a: 0,
          why: 'Der Widerstand hängt auch vom Material ab. Kupfer leitet sehr gut und wird deshalb für Kabel verwendet. Konstantan nimmt man für Widerstände.' },
      ],
    },
  ],

  schaltungen: [
    {
      id: 'schalt-hell', type: 'quiz', title: 'Vorhersage: Welche Lampe leuchtet heller?',
      questions: [
        { q: 'Zwei gleiche Lampen sind in Reihe geschaltet. Welche leuchtet heller?', fig: 'reihe2', opts: ['L1, weil sie den Strom zuerst bekommt', 'L2', 'Beide gleich hell'], a: 2,
          why: 'Durch beide Lampen fließt derselbe Strom. Er wird unterwegs nicht aufgebraucht, deshalb leuchten gleiche Lampen gleich hell.' },
        { q: 'Verglichen mit einer Lampe allein an derselben Batterie leuchten die beiden Lampen in Reihe …', fig: 'reihe2', opts: ['heller', 'gleich hell', 'dunkler'], a: 2,
          why: 'Zwei Lampen in Reihe haben zusammen den doppelten Widerstand. Die Stromstärke halbiert sich, jede Lampe bekommt nur die halbe Spannung und leuchtet deutlich dunkler.' },
        { q: 'Zwei gleiche Lampen sind parallel geschaltet. Verglichen mit einer Lampe allein leuchtet jede …', fig: 'parallel2', opts: ['heller', 'gleich hell', 'dunkler'], a: 1,
          why: 'An jeder Lampe liegt die volle Batteriespannung, jede leuchtet so hell wie allein. Bei einer echten Batterie etwas weniger, weil sie selbst einen kleinen Widerstand hat.' },
        { q: 'Der Schalter vor L2 ist offen. Was passiert mit L1?', fig: 'parallel2_schalter', opts: ['L1 geht auch aus', 'L1 leuchtet weiter', 'L1 flackert'], a: 1,
          why: 'L1 hängt in einem eigenen Zweig direkt an der Batterie. Was im anderen Zweig passiert, ändert daran nichts.' },
        { q: 'Jetzt in Reihe: Der Schalter ist offen. Was passiert?', fig: 'reihe2_schalter', opts: ['Nur L2 geht aus', 'Beide gehen aus', 'Nur L1 geht aus'], a: 1,
          why: 'In der Reihenschaltung gibt es nur einen Weg. Ist er an irgendeiner Stelle unterbrochen, fließt nirgends Strom.' },
        { q: 'Mit einer Lampe allein zeigt das Amperemeter 0,20 A. Jetzt sind zwei gleiche Lampen parallel angeschlossen. Was zeigt es?', fig: 'parallel2_amp', opts: ['0,10 A', '0,20 A', '0,40 A'], a: 2,
          why: 'Jeder Zweig bekommt 0,20 A, die Teilströme addieren sich. Die Batterie liefert also nicht immer denselben Strom: Sie hält die Spannung (fast) konstant, die Stromstärke hängt davon ab, was angeschlossen ist.' },
      ],
    },
    { id: 'schalt-bau', type: 'build', title: 'Bauauftrag: Lampe einzeln schalten' },
    {
      id: 'schalt-regeln', type: 'quiz', title: 'Regeln anwenden',
      questions: [
        { q: 'Reihenschaltung an 6 V: An L1 liegen 2 V. Wie viel Spannung liegt an L2?', opts: ['2 V', '4 V', '6 V', '8 V'], a: 1,
          why: 'In der Reihenschaltung addieren sich die Teilspannungen zur Gesamtspannung: 2 V + 4 V = 6 V.' },
        { q: 'Parallelschaltung: Durch die Zweige fließen 0,3 A und 0,2 A. Wie groß ist der Gesamtstrom?', opts: ['0,1 A', '0,25 A', '0,5 A'], a: 2,
          why: 'In der Parallelschaltung addieren sich die Teilströme zum Gesamtstrom.' },
        { q: 'Widerstände von 20 Ω und 30 Ω in Reihe. Wie groß ist der Gesamtwiderstand?', opts: ['50 Ω', '12 Ω', '600 Ω'], a: 0,
          why: 'In der Reihenschaltung addieren sich die Widerstände.' },
        { q: 'Dieselben Widerstände parallel. Der Gesamtwiderstand ist …', opts: ['50 Ω', 'kleiner als 20 Ω', 'zwischen 20 Ω und 30 Ω'], a: 1,
          why: 'Jeder zusätzliche Zweig ist ein weiterer Weg für den Strom, der Gesamtwiderstand sinkt. Genau: 1/R = 1/20 Ω + 1/30 Ω, also R = 12 Ω.' },
      ],
    },
  ],

  logik: [
    {
      id: 'logik-und', type: 'truth', title: 'UND-Schaltung: Schalter in Reihe', circuit: 'und', states: ['offen', 'zu'],
      prompt: 'Zwei Schalter liegen in Reihe. Wann leuchtet die Lampe?',
      why: 'Der Strom muss durch beide Schalter. Nur wenn S1 UND S2 geschlossen sind, ist der Stromkreis geschlossen.',
    },
    {
      id: 'logik-oder', type: 'truth', title: 'ODER-Schaltung: Schalter parallel', circuit: 'oder', states: ['offen', 'zu'],
      prompt: 'Zwei Schalter liegen parallel. Wann leuchtet die Lampe?',
      why: 'Jeder Schalter öffnet einen eigenen Weg. Es reicht, wenn S1 ODER S2 geschlossen ist. Sind beide zu, leuchtet die Lampe auch.',
    },
    {
      id: 'logik-wechsel', type: 'truth', title: 'Wechselschaltung: Licht im Treppenhaus', circuit: 'wechsel', states: ['oben', 'unten'],
      prompt: 'Zwei Wechselschalter sind über zwei Leitungen verbunden. Jeder Schalter verbindet seinen Mittelkontakt entweder mit der oberen oder mit der unteren Leitung. Wann leuchtet die Lampe?',
      why: 'Die Lampe leuchtet, wenn beide Schalter dieselbe Leitung wählen. Jedes Umlegen eines Schalters, egal welches, schaltet die Lampe um. So kannst du das Licht unten einschalten und oben wieder ausschalten.',
    },
    {
      id: 'logik-erkennen', type: 'quiz', title: 'Schaltungen erkennen',
      questions: [
        { q: 'Welche Schaltung ist eine ODER-Schaltung?', opts: [{ fig: 'und' }, { fig: 'oder' }], a: 1,
          why: 'Bei der ODER-Schaltung liegen die Schalter parallel, jeder öffnet einen eigenen Weg. Die linke Schaltung ist eine UND-Schaltung.' },
        { q: 'Welche Wechselschaltung funktioniert im Treppenhaus?', opts: [{ fig: 'wechsel_falsch' }, { fig: 'wechsel' }], a: 1,
          why: 'Eine Wechselschaltung braucht zwei Verbindungsleitungen zwischen den Schaltern. Mit nur einer Leitung leuchtet die Lampe nur, wenn beide Schalter oben stehen. Steht ein Schalter unten, kann der andere nichts mehr ausrichten.' },
        { q: 'In einer Wechselschaltung leuchtet die Lampe. Du legst einen der beiden Schalter um. Was passiert?', opts: ['Die Lampe geht aus', 'Die Lampe bleibt an', 'Das hängt davon ab, welchen Schalter du umlegst'], a: 0,
          why: 'Jedes Umlegen, egal an welchem Schalter, wechselt den Zustand der Lampe.' },
      ],
    },
    {
      id: 'logik-alltag', type: 'quiz', title: 'UND, ODER oder Wechsel im Alltag?',
      questions: [
        { q: 'Eine Papierschneidemaschine schneidet nur, wenn man mit beiden Händen gleichzeitig je einen Taster drückt.', opts: ['UND', 'ODER', 'Wechsel'], a: 0,
          why: 'Zweihandschaltung: Beide Taster liegen in Reihe. So sind beide Hände sicher weg vom Messer.' },
        { q: 'Eine Klingel soll an der Haustür und an der Gartentür läuten.', opts: ['UND', 'ODER', 'Wechsel'], a: 1,
          why: 'Die beiden Klingeltaster liegen parallel. Jeder allein schließt den Stromkreis.' },
        { q: 'Das Licht im Flur soll an beiden Enden ein- und ausgeschaltet werden können.', opts: ['UND', 'ODER', 'Wechsel'], a: 2,
          why: 'Mit einer ODER-Schaltung könnte man das Licht nicht mehr vom anderen Ende ausschalten, wenn der erste Schalter noch zu ist.' },
        { q: 'Die Innenbeleuchtung im Auto geht an, wenn die Fahrertür oder die Beifahrertür offen ist.', opts: ['UND', 'ODER', 'Wechsel'], a: 1,
          why: 'Die Türkontakte liegen parallel. Jede offene Tür schließt ihren Kontakt und damit den Stromkreis.' },
        { q: 'Eine Waschmaschine startet nur, wenn die Tür geschlossen ist und die Starttaste gedrückt wird.', opts: ['UND', 'ODER', 'Wechsel'], a: 0,
          why: 'Türkontakt und Starttaste liegen in Reihe. Bei offener Tür läuft die Maschine nicht an.' },
      ],
    },
  ],

  energie: [
    { id: 'energie-rechnen', type: 'calc', gen: 'power', count: 8, title: 'Rechentraining: Leistung und Kosten' },
    {
      id: 'energie-quiz', type: 'quiz', title: 'Energie im Haushalt',
      questions: [
        { q: 'Was misst der Stromzähler im Haus?', opts: ['Die Stromstärke', 'Die Spannung', 'Die umgewandelte Energie in kWh'], a: 2,
          why: 'Bezahlt wird die Energie. Der Name „Stromzähler“ ist eigentlich irreführend.' },
        { q: 'Welches Gerät hat die größte Leistung?', opts: ['LED-Lampe', 'Laptop', 'Wasserkocher'], a: 2,
          why: 'Geräte, die heizen, haben die größten Leistungen: Ein Wasserkocher hat etwa 2000 W, ein Laptop etwa 60 W, eine LED-Lampe etwa 8 W.' },
        { q: 'Was braucht mehr Energie: eine LED-Lampe (8 W) einen ganzen Tag lang oder ein Wasserkocher (2000 W) 6 Minuten lang?', opts: ['Die LED-Lampe', 'Der Wasserkocher', 'Etwa gleich viel'], a: 2,
          why: 'LED-Lampe: 0,008 kW · 24 h ≈ 0,19 kWh. Wasserkocher: 2 kW · 0,1 h = 0,2 kWh. Fast gleich viel.' },
      ],
    },
  ],

  sicherheit: [
    {
      id: 'sicher-quiz', type: 'quiz', title: 'Gefahren erkennen',
      questions: [
        { q: 'Was passiert bei einem Kurzschluss?', opts: ['Der Widerstand ist fast null, der Strom wird sehr groß', 'Der Strom wird null', 'Die Spannung steigt stark an'], a: 0,
          why: 'Ohne Verbraucher im Kreis begrenzt fast nichts den Strom. Die Leitungen werden heiß, die Sicherung löst aus.' },
        { q: 'Föhn, Wasserkocher und Heizlüfter laufen gleichzeitig an einer Mehrfachsteckdose. Was ist das Problem?', opts: ['Die Ströme addieren sich, Kabel und Steckdose können überhitzen', 'Die Geräte laufen langsamer', 'Kein Problem, die Spannung bleibt ja gleich'], a: 0,
          why: 'Die Geräte sind parallel geschaltet. Ihre Teilströme addieren sich in der Zuleitung, hier auf über 25 A. Mehrfachsteckdosen sind meist nur für 16 A gebaut.' },
        { q: 'Wozu dient eine Sicherung?', opts: ['Sie unterbricht den Stromkreis, wenn der Strom zu groß wird', 'Sie erhöht die Spannung', 'Sie speichert Strom für Notfälle'], a: 0,
          why: 'So werden Leitungen vor Überhitzung und das Haus vor einem Brand geschützt.' },
        { q: 'Ein Kabel hat eine beschädigte Isolierung. Was tust du?', opts: ['Nicht benutzen und einem Erwachsenen Bescheid sagen', 'Mit Klebeband umwickeln und weiter benutzen', 'Vorsichtig weiter benutzen'], a: 0,
          why: 'An blanken Stellen kannst du einen lebensgefährlichen Stromschlag bekommen. Reparieren darf das nur eine Fachkraft.' },
        { q: 'Wofür ist der grün-gelbe Schutzleiter?', opts: ['Er leitet bei einem Defekt den Strom vom Metallgehäuse ab, sodass die Sicherung auslöst', 'Er bringt zusätzlichen Strom ins Gerät', 'Er ist nur für Gewitter da'], a: 0,
          why: 'Berührt ein kaputtes Kabel das Metallgehäuse, fließt der Strom über den Schutzleiter statt durch deinen Körper.' },
        { q: 'Warum darfst du in der Nähe von Bahn-Oberleitungen keinen Drachen steigen lassen und nicht auf Waggons klettern?', opts: ['Bei 15 000 V kann der Strom schon ohne Berührung überspringen', 'Weil die Leitungen heiß sind', 'Das ist nur verboten, aber nicht gefährlich'], a: 0,
          why: 'Bei sehr hoher Spannung kann ein Lichtbogen durch die Luft überspringen. Es reicht, der Leitung zu nahe zu kommen.' },
      ],
    },
  ],
};
