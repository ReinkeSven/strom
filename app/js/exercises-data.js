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
// devices: Geräte aus DEVICES (content.js), die vor der Übung kurz erklärt werden
// after: Indizes der Merksätze des Themas, die der Fokus-Modus direkt nach dieser Übung zeigt

const yesNo = ['Ja', 'Nein'];

export const EX = {
  ladung: [
    {
      id: 'ladung-ballons', type: 'demo', after: [0, 1], demo: 'balloons', title: 'Experiment: Luftballons',
      questions: [
        { q: 'Du reibst beide Ballons am Wolltuch und lässt sie nebeneinander hängen. Was passiert?', opts: ['Sie ziehen sich an', 'Sie stoßen sich ab', 'Nichts'], a: 1,
          why: 'Beide Ballons haben Elektronen vom Tuch aufgenommen und sind negativ geladen. Gleichnamige Ladungen stoßen sich ab.' },
        { q: 'Ein geriebener Ballon und das Wolltuch …', opts: ['ziehen sich an', 'stoßen sich ab', 'beeinflussen sich nicht'], a: 0,
          why: 'Der Ballon hat Elektronenüberschuss (negativ), das Tuch Elektronenmangel (positiv). Ungleichnamige Ladungen ziehen sich an.' },
        { q: 'Warum bleibt ein geriebener Ballon an der ungeladenen Wand hängen?', opts: ['Die Wand ist von sich aus positiv geladen und zieht ihn an', 'In der Wand verschieben sich Ladungen, die positiven zum Ballon hin', 'Beim Reiben wird die Ballonhaut klebrig und haftet an der Wand'], a: 1,
          why: 'Der negative Ballon schiebt die Elektronen in der Wand ein winziges Stück weg. Dadurch ist die Wand direkt am Ballon leicht positiv und zieht ihn an.' },
        { q: 'Wird beim Reiben Ladung erzeugt?', opts: ['Ja, die Reibung erzeugt neue Ladung auf dem Ballon', 'Nein, Elektronen wechseln nur vom Tuch auf den Ballon'], a: 1,
          why: 'Ladung wird nur getrennt. Ballon und Tuch zusammen sind weiterhin elektrisch neutral.' },
      ],
    },
    {
      id: 'ladung-bandgen', type: 'demo', devices: ['bandgen', 'glimm', 'erdung'], after: [2, 3], demo: 'bandgen', title: 'Experiment: Bandgenerator',
      questions: [
        { q: 'Du stehst auf einem Kunststoffhocker und legst die Hand auf die geladene Kugel. Warum stehen deine Haare ab?', opts: ['Die Haare sind gleichnamig geladen und stoßen sich ab', 'Die Kugel zieht die Haare mit ihrer Ladung zu sich hin', 'Die Kugel wird warm, und warme Luft hebt die Haare an'], a: 0,
          why: 'Die Ladung verteilt sich über deinen Körper bis in die Haare. Gleichnamig geladene Haare stoßen sich ab und stehen möglichst weit auseinander.' },
        { q: 'Warum stehst du dabei auf einem isolierenden Hocker?', opts: ['Damit die Ladung nicht über den Boden abfließt', 'Damit die Kugel schneller und stärker aufgeladen wird', 'Damit du größer bist und die Kugel besser erreichst'], a: 0,
          why: 'Dein Körper leitet. Ohne Isolierung würden die Elektronen sofort über die Füße in den Boden abfließen.' },
        { q: 'Die Glimmlampe leuchtet an dem Metallstift, der die Kugel berührt. Wie ist die Kugel geladen?', opts: ['Positiv', 'Negativ'], a: 1,
          why: 'Eine Glimmlampe leuchtet immer an dem Stift, der mit der negativen Seite verbunden ist. Die Kugel ist also negativ geladen.' },
        { q: 'Was ist der Funke zwischen Kugel und Erdungskugel?', opts: ['Ein kurzer Ladungsausgleich durch die Luft', 'Brennender Staub, der an der Kugel hängt', 'Licht, das aus dem Inneren der Kugel kommt'], a: 0,
          why: 'Bei großer Ladung springen Elektronen durch die Luft zur Erdungskugel, die Luft leuchtet dabei. Ein Blitz funktioniert nach demselben Prinzip, nur viel größer.' },
      ],
    },
    {
      id: 'ladung-elektroskop', type: 'demo', devices: ['elektroskop'], after: [4], demo: 'electroscope', title: 'Experiment: Elektroskop',
      questions: [
        { q: 'Du näherst den negativ geladenen Stab dem Elektroskop, ohne es zu berühren. Was passiert?', opts: ['Der Zeiger schlägt aus', 'Nichts, solange der Stab nicht berührt'], a: 0,
          why: 'Der Stab drückt die Elektronen im Metall nach unten in Zeiger und Halterung. Beide sind dann negativ und stoßen sich ab. Diese Ladungsverschiebung ohne Berührung heißt Influenz.' },
        { q: 'Nach dem Berühren entfernst du den Stab. Der Zeiger …', opts: ['bleibt ausgeschlagen', 'fällt sofort zurück'], a: 0,
          why: 'Beim Berühren sind Elektronen vom Stab auf das Elektroskop übergegangen. Es bleibt negativ geladen, bis du es erdest.' },
        { q: 'Was zeigt ein Elektroskop an?', opts: ['Ob ein Körper geladen ist', 'Wie groß die Stromstärke ist', 'Wie warm ein Körper gerade ist'], a: 0,
          why: 'Je größer die Ladung, desto weiter schlägt der Zeiger aus. Ob sie positiv oder negativ ist, zeigt es allein nicht.' },
      ],
    },
  ],

  modell: [
    {
      id: 'modell-zoom', type: 'demo', after: [0], demo: 'zoom', title: 'Erklärbild: Vom Kabel zum Atom',
      questions: [
        { q: 'Woraus besteht ein Atom?', opts: ['Aus einem positiven Kern und negativen Elektronen', 'Aus einem negativen Kern und positiven Elektronen', 'Nur aus vielen gleich geladenen kleinen Teilchen'], a: 0,
          why: 'Der Kern in der Mitte ist positiv, die Elektronen außen herum sind negativ. Zusammen ist das Atom neutral.' },
        { q: 'Was ist im Metall zwischen den Atomrümpfen unterwegs?', opts: ['Freie Elektronen', 'Freie Atomkerne', 'Kleine Luftbläschen'], a: 0,
          why: 'In Metallen sind einige Elektronen nicht fest an ein Atom gebunden. Sie können durch das ganze Metall wandern.' },
      ],
    },
    {
      id: 'modell-elektronen', type: 'demo', after: [1, 3], demo: 'electrons', title: 'Animation: Elektronen im Metall',
      questions: [
        { q: 'Was bewegt sich in einem Metalldraht, wenn Strom fließt?', opts: ['Die Atomrümpfe', 'Die freien Elektronen', 'Beide gleich schnell'], a: 1,
          why: 'Die Atomrümpfe sitzen fest im Gitter und schwingen nur auf der Stelle. Die freien Elektronen bewegen sich zusätzlich in eine Richtung.' },
        { q: 'Ohne Spannung bewegen sich die freien Elektronen …', opts: ['gar nicht', 'ungeordnet in alle Richtungen', 'alle in dieselbe Richtung'], a: 1,
          why: 'Sie flitzen ungeordnet hin und her. Im Mittel fließt dabei keine Ladung in eine Richtung, also kein Strom.' },
        { q: 'Die Elektronen kommen im Draht nur Bruchteile eines Millimeters pro Sekunde voran. Warum leuchtet die Lampe trotzdem sofort?', opts: ['Alle Elektronen im Kreis setzen sich gleichzeitig in Bewegung', 'Die Elektronen rasen in Wirklichkeit fast lichtschnell durch den Draht', 'Die Lampe hat vom letzten Einschalten noch Strom gespeichert'], a: 0,
          why: 'Der Draht ist von Anfang an voller Elektronen. Beim Einschalten setzen sich alle gleichzeitig in Bewegung, wie Perlen auf einer Kette. Hier hat das Modell eine Grenze: In der Animation sind die Elektronen viel zu schnell dargestellt.' },
        { q: 'Schalte in der Animation auf Holz. Warum leitet trockenes Holz keinen Strom?', opts: ['Die Elektronen sind fest an ihre Atome gebunden', 'Im Holz gibt es überhaupt keine Elektronen', 'Die Elektronen im Holz sind viel zu schwer'], a: 0,
          why: 'Holz hat genauso Elektronen wie Kupfer, aber jedes bleibt bei seinem Atom. Es fehlen frei bewegliche Ladungsträger. Mit Spannung verschieben sich die Elektronen nur ein winziges Stück, eine Wanderung durch das ganze Holz gibt es nicht.' },
      ],
    },
    {
      id: 'modell-sortieren', type: 'sort', after: [2], title: 'Leiter oder Isolator?',
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
        { t: 'Trockenes Holz', bin: 1, why: 'Im Holz sind die Elektronen fest an ihre Atome gebunden, freie Ladungsträger fehlen. Nasses Holz leitet etwas, weil im Wasser gelöste Teilchen beweglich sind.' },
        { t: 'Luft', bin: 1, why: 'Erst bei sehr hoher Spannung wird Luft leitend, zum Beispiel beim Blitz.' },
        { t: 'Porzellan', bin: 1, why: 'Deshalb hängen Hochspannungsleitungen an Isolatoren aus Porzellan oder Glas.' },
      ],
    },
  ],

  stromkreis: [
    {
      id: 'kreis-kette', type: 'demo', after: [2, 1], demo: 'chain', title: 'Erklärbild: Die Fahrradkette',
      questions: [
        { q: 'Du trittst in die Pedale. Wann bewegt sich das Kettenglied an der Lampe?', opts: ['Sofort, alle Glieder bewegen sich gleichzeitig', 'Erst wenn ein Glied vom Pedal bis dorthin kommt', 'Gar nicht, nur die Glieder am Pedal bewegen sich'], a: 0,
          why: 'Die Kette ist überall voll. Wer am Pedal schiebt, schiebt die ganze Kette. Genauso setzen sich im Stromkreis alle Elektronen gleichzeitig in Bewegung.' },
        { q: 'Werden in der Lampe Kettenglieder verbraucht?', opts: ['Nein, die Kette läuft vollständig weiter', 'Ja, ein paar Glieder bleiben in der Lampe', 'Ja, deshalb muss man Glieder nachfüllen'], a: 0,
          why: 'Die Lampe bekommt nur Schwung, also Energie. Genauso wird im Stromkreis kein Strom verbraucht, sondern Energie umgewandelt.' },
        { q: 'Warum gibt es zwei Stromrichtungen, die technische und die der Elektronen?', opts: ['Die Richtung wurde festgelegt, bevor man Elektronen kannte', 'Die Elektronen drehen auf halbem Weg einfach wieder um', 'Im Draht fließen zwei Ströme gleichzeitig gegeneinander'], a: 0,
          why: 'Die Stromrichtung von Plus nach Minus wurde vor etwa 200 Jahren festgelegt. Erst später entdeckte man, dass sich die Elektronen andersherum bewegen. Die alte Richtung benutzt man bis heute.' },
      ],
    },
    {
      id: 'kreis-memory', type: 'memory', title: 'Schaltzeichen-Memory',
      pairs: [['bat', 'Batterie'], ['lamp', 'Lampe'], ['switch', 'Schalter'], ['res', 'Widerstand'], ['amp', 'Amperemeter'], ['volt', 'Voltmeter'], ['motor', 'Motor']],
    },
    {
      id: 'kreis-leuchtet', type: 'quiz', after: [0], title: 'Leuchtet die Lampe?',
      questions: [
        { q: 'Leuchtet die Lampe?', fig: 'einfach', opts: yesNo, a: 0,
          why: 'Der Stromkreis ist geschlossen: vom Pluspol über die Lampe zurück zum Minuspol.' },
        { q: 'Leuchtet die Lampe?', fig: 'schalter_offen', opts: yesNo, a: 1,
          why: 'Der offene Schalter unterbricht den Stromkreis.' },
        { q: 'Leuchtet die Lampe?', fig: 'zwei_schalter', opts: yesNo, a: 1,
          why: 'Ein Schalter ist offen. Gibt es nur einen Weg für den Strom, reicht eine einzige Unterbrechung, damit nirgends Strom fließt.' },
        { q: 'Leuchtet die Lampe?', fig: 'lampe_ueberbrueckt', opts: yesNo, a: 1,
          why: 'Der Strom nimmt den bequemen Weg durch die Leitung neben der Lampe, durch die Lampe fließt fast nichts. Das nennt man Kurzschluss: Der Strom wird sehr groß und die Batterie wird heiß.' },
        { q: 'Leuchtet die Lampe?', fig: 'schalter_parallel', opts: yesNo, a: 0,
          why: 'Ein offener Schalter neben der Lampe wirkt wie gar keine Leitung. Der Strom fließt durch die Lampe. Würdest du ihn schließen, wäre die Lampe kurzgeschlossen.' },
      ],
    },
  ],

  stromstaerke: [
    {
      id: 'strom-zaehlstelle', type: 'demo', after: [0], demo: 'counter', title: 'Erklärbild: Die Zählstelle',
      questions: [
        { q: 'Was gibt die Stromstärke an?', opts: ['Wie viele Elektronen pro Sekunde vorbeikommen', 'Wie schnell ein einzelnes Elektron fliegt', 'Wie viele Elektronen im ganzen Draht sind'], a: 0,
          why: 'Gezählt wird an einer Stelle: Wie viel Ladung kommt dort in einer Sekunde vorbei? Je mehr, desto größer die Stromstärke.' },
      ],
    },
    {
      id: 'strom-vorhersage', type: 'quiz', devices: ['amp'], after: [3, 1], title: 'Vorhersage: Strom vor und hinter der Lampe',
      questions: [
        { q: 'A1 misst die Stromstärke vor der Lampe, A2 dahinter. Was zeigt A2 im Vergleich zu A1?', fig: 'amp_vor_nach', opts: ['Mehr', 'Gleich viel', 'Weniger', 'Null'], a: 1,
          why: 'Gibt es keine Abzweigung, ist die Stromstärke überall gleich. So viel Ladung, wie in die Lampe hineinfließt, fließt auch wieder heraus.' },
        { q: 'Was „verbraucht“ die Lampe also?', opts: ['Strom', 'Energie', 'Elektronen'], a: 1,
          why: 'Umgewandelt wird Energie: elektrische Energie in Licht und Wärme. Der Strom fließt vollständig weiter.' },
        { q: 'Kommen die Elektronen, die durch die Lampe fließen, aus der Batterie?', opts: ['Ja, die Batterie gibt Elektronen ab, die die Lampe verbraucht', 'Nein, sie sind schon im Draht, die Batterie treibt sie nur an'], a: 1,
          why: 'Die Leitungen sind von Anfang an voller freier Elektronen. Die Batterie treibt sie nur an, wie das Pedal die Fahrradkette. Leer wird eine Batterie, weil ihre Energie aufgebraucht ist, nicht ihre Elektronen.' },
      ],
    },
    {
      id: 'strom-messen', type: 'quiz', after: [2], title: 'Amperemeter richtig einbauen',
      questions: [
        { q: 'In welcher Schaltung misst das Amperemeter die Stromstärke durch die Lampe richtig?', opts: [{ fig: 'amp_reihe' }, { fig: 'amp_parallel' }], a: 0,
          why: 'Das Amperemeter wird in Reihe geschaltet, damit der ganze Strom hindurchfließt. Parallel zur Lampe schließt es die Lampe kurz, weil es fast keinen Widerstand hat. Der Strom wird dann sehr groß, und das Messgerät kann kaputtgehen.' },
        { q: 'Warum hat ein Amperemeter einen sehr kleinen Widerstand?', opts: ['Damit es den Strom, den es misst, kaum verändert', 'Damit es leichter und billiger gebaut werden kann', 'Damit es sich beim Messen nicht zu stark erwärmt'], a: 0,
          why: 'Es liegt in Reihe im Stromkreis. Hätte es einen großen Widerstand, würde es den Strom bremsen und einen falschen, zu kleinen Wert anzeigen.' },
      ],
    },
  ],

  spannung: [
    {
      id: 'spannung-rucksack', type: 'demo', after: [0], demo: 'backpack', title: 'Erklärbild: Das Rucksackmodell',
      questions: [
        { q: 'Was passiert im Rucksackmodell an der Lampe?', opts: ['Die Elektronen geben Energie aus dem Rucksack ab', 'Die Elektronen werden in der Lampe verbraucht', 'Die Rucksäcke werden in der Lampe neu gefüllt'], a: 0,
          why: 'Die Lampe wandelt die Energie in Licht und Wärme um. Die Elektronen laufen mit leerem Rucksack weiter zur Batterie.' },
        { q: 'Was bedeutet eine höhere Spannung im Rucksackmodell?', opts: ['Jeder Rucksack wird mit mehr Energie gefüllt', 'Es gibt mehr Elektronen im ganzen Stromkreis', 'Die Elektronen laufen mit leeren Rucksäcken'], a: 0,
          why: 'Die Spannung sagt, wie viel Energie die Batterie jedem Elektron mitgibt. Mehr Energie pro Elektron lässt die Lampe heller leuchten.' },
      ],
    },
    {
      id: 'wasser-modell', type: 'demo', after: [4], demo: 'water', title: 'Wassermodell: Spannung, Stromstärke, Widerstand',
      questions: [
        { q: 'Was entspricht im Wassermodell der Spannung?', opts: ['Der Druckunterschied, den die Pumpe erzeugt', 'Die Wassermenge, die pro Sekunde fließt', 'Der Durchmesser der Rohre im Kreislauf'], a: 0,
          why: 'Die Pumpe erzeugt einen Druckunterschied und treibt so das Wasser an. Genauso treibt die Spannung der Batterie die Elektronen an.' },
        { q: 'Du baust eine Engstelle ein. Wo wird der Wasserstrom kleiner?', opts: ['Überall im Kreislauf', 'Nur hinter der Engstelle', 'Nur in der Engstelle'], a: 0,
          why: 'Im geschlossenen Kreislauf fließt an jeder Stelle gleich viel Wasser pro Sekunde. Bremst die Engstelle, wird der Wasserstrom überall kleiner. Genauso sinkt mit einem zusätzlichen Widerstand die Stromstärke im ganzen Stromkreis.' },
        { q: 'Verbraucht das Wasserrad Wasser?', opts: ['Nein, es nimmt dem Wasser Energie ab', 'Ja, hinter dem Rad fließt weniger Wasser'], a: 0,
          why: 'Das Wasser fließt vollständig weiter, nur seine Energie treibt das Rad an. Genauso wandelt die Lampe Energie um, verbraucht aber keinen Strom.' },
        { q: 'Die Pumpe läuft, aber das Ventil ist zu. Was entspricht dem im Stromkreis?', opts: ['Spannung liegt an, aber es fließt kein Strom', 'Es fließt Strom, aber es liegt keine Spannung an', 'Es gibt weder Spannung noch Strom im Kreis'], a: 0,
          why: 'Die Pumpe hält den Druckunterschied aufrecht, auch wenn nichts fließt. Ebenso liegt an der Batterie Spannung an, auch wenn der Schalter offen ist.' },
        { q: 'Wo passt das Wassermodell nicht?', opts: ['Aus einem offenen Rohr läuft Wasser, aus einem Draht nichts', 'Nirgends, das Wassermodell stimmt in jedem einzelnen Punkt', 'Ein Wasserrad lässt sich nicht mit einer Lampe vergleichen'], a: 0,
          why: 'Jedes Modell hat Grenzen. Das Wassermodell hilft beim Verstehen von Spannung, Stromstärke und Widerstand, ist aber kein genaues Abbild.' },
      ],
    },
    {
      id: 'wasser-zuordnen', type: 'sort', title: 'Wassermodell zuordnen',
      prompt: 'Was entspricht im Stromkreis diesem Teil des Wasserkreislaufs?',
      bins: ['Batterie', 'Leitung', 'Lampe', 'Schalter', 'Widerstand', 'Spannung', 'Stromstärke'],
      items: [
        { t: 'Pumpe', bin: 0, why: 'Sie treibt das Wasser an wie die Batterie die Elektronen.' },
        { t: 'Rohr', bin: 1, why: 'Darin fließt das Wasser wie die Elektronen in der Leitung.' },
        { t: 'Wasserrad', bin: 2, why: 'Es wandelt Energie um, das Wasser fließt vollständig weiter.' },
        { t: 'Ventil', bin: 3, why: 'Geschlossen unterbricht es den Kreislauf.' },
        { t: 'Engstelle im Rohr', bin: 4, why: 'Sie hemmt den Wasserstrom wie ein Widerstand den elektrischen Strom.' },
        { t: 'Druckunterschied', bin: 5, why: 'Er ist der Antrieb für den Wasserstrom.' },
        { t: 'Wasser pro Sekunde', bin: 6, why: 'Wie die Stromstärke: Ladung pro Sekunde.' },
      ],
    },
    {
      id: 'spannung-messen', type: 'quiz', devices: ['volt'], after: [2, 3], title: 'Voltmeter richtig einbauen',
      questions: [
        { q: 'In welcher Schaltung misst das Voltmeter die Spannung an der Lampe richtig?', opts: [{ fig: 'volt_reihe' }, { fig: 'volt_parallel' }], a: 1,
          why: 'Das Voltmeter wird parallel geschaltet, denn es misst den Unterschied zwischen zwei Punkten. In Reihe bremst sein sehr großer Widerstand den Strom fast vollständig: Die Lampe bleibt dunkel, und das Voltmeter zeigt ungefähr die Batteriespannung.' },
        { q: 'Liegt an einer Batterie Spannung an, wenn nichts angeschlossen ist?', opts: ['Ja', 'Nein, erst wenn Strom fließt'], a: 0,
          why: 'Die Spannung entsteht durch die Ladungstrennung in der Batterie. Sie ist auch ohne Stromkreis da. Erst wenn der Kreis geschlossen ist, fließt Strom.' },
        { q: 'Ein Vogel sitzt auf einer Hochspannungsleitung. Warum passiert ihm nichts?', opts: ['Zwischen seinen Füßen liegt kaum Spannung', 'Seine trockenen Federn leiten keinen Strom', 'Die Leitung ist für kleine Tiere isoliert'], a: 0,
          why: 'Spannung liegt immer zwischen zwei Punkten an. Zwischen zwei Füßen auf demselben Draht ist sie winzig. Gefährlich wird es, wenn ein Vogel zwei Leitungen oder Leitung und Mast gleichzeitig berührt.' },
      ],
    },
    {
      id: 'spannung-sortieren', type: 'sort', after: [1], title: 'Typische Spannungen',
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
      id: 'widerstand-kennlinie', type: 'demo', devices: ['netzgeraet', 'konstantan', 'gluehlampe'], after: [0, 1], demo: 'kennlinie', title: 'Experiment: Kennlinien messen',
      questions: [
        { q: 'Wie sieht die Kennlinie des Konstantandrahts aus?', opts: ['Eine Ursprungsgerade', 'Eine Kurve, die immer flacher wird', 'Eine waagerechte Linie'], a: 0,
          why: 'Doppelte Spannung, doppelte Stromstärke: Stromstärke und Spannung sind proportional zueinander.' },
        { q: 'Bei der Glühlampe wird die Kennlinie immer flacher. Was bedeutet das?', opts: ['Bei mehr Spannung wächst die Stromstärke immer weniger', 'Bei mehr Spannung sinkt die Stromstärke wieder ab', 'Ab einer bestimmten Spannung fließt gar kein Strom'], a: 0,
          why: 'Die Stromstärke steigt weiter, aber immer langsamer. Die Lampe bremst den Strom umso stärker, je höher die Spannung ist.' },
        { q: 'Warum bremst die Glühlampe den Strom bei hoher Spannung stärker?', opts: ['Der Glühdraht wird heiß', 'Die Batterie wird leer', 'Das Glas wird dunkler'], a: 0,
          why: 'In heißem Metall schwingen die Atomrümpfe stärker und behindern die freien Elektronen mehr. Beim Konstantandraht passiert das kaum, weil er sich bei diesen Strömen nur wenig erwärmt.' },
      ],
    },
    {
      id: 'widerstand-flur', type: 'demo', after: [2], demo: 'corridor', title: 'Erklärbild: Der Schulflur',
      questions: [
        { q: 'Warum kommen bei heißem Draht weniger Elektronen pro Sekunde durch?', opts: ['Die Atomrümpfe zappeln stärker und sind öfter im Weg', 'Die Elektronen werden durch die Hitze langsam müde', 'Durch die Hitze verschwinden einige der Elektronen'], a: 0,
          why: 'Die Elektronen stoßen öfter mit den zappelnden Atomrümpfen zusammen. Der Strom wird stärker gebremst, der Widerstand ist größer.' },
        { q: 'Was bedeutet ein großer Widerstand?', opts: ['Der Strom wird stark gebremst', 'Der Strom wird stark beschleunigt', 'Die Spannung wird stark erhöht'], a: 0,
          why: 'Ein großer Widerstand hemmt den Strom: Bei gleicher Spannung fließen weniger Elektronen pro Sekunde.' },
      ],
    },
  ],

  schaltungen: [
    {
      id: 'schalt-hell', type: 'quiz', after: [0, 1], title: 'Vorhersage: Welche Lampe leuchtet heller?',
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
      ],
    },
  ],

  logik: [
    {
      id: 'logik-und', type: 'truth', after: [3, 0], title: 'UND-Schaltung: Schalter in Reihe', circuit: 'und', states: ['offen', 'zu'],
      prompt: 'Zwei Schalter liegen in Reihe. Wann leuchtet die Lampe?',
      why: 'Der Strom muss durch beide Schalter. Nur wenn S1 UND S2 geschlossen sind, ist der Stromkreis geschlossen.',
    },
    {
      id: 'logik-oder', type: 'truth', after: [1], title: 'ODER-Schaltung: Schalter parallel', circuit: 'oder', states: ['offen', 'zu'],
      prompt: 'Zwei Schalter liegen parallel. Wann leuchtet die Lampe?',
      why: 'Jeder Schalter öffnet einen eigenen Weg. Es reicht, wenn S1 ODER S2 geschlossen ist. Sind beide zu, leuchtet die Lampe auch.',
    },
    {
      id: 'logik-wechsel', type: 'truth', devices: ['wechselschalter'], after: [2], title: 'Wechselschaltung: Licht im Treppenhaus', circuit: 'wechsel', states: ['oben', 'unten'],
      prompt: 'Zwei Wechselschalter sind über zwei Leitungen verbunden. Jeder Schalter steht entweder oben oder unten. Wann leuchtet die Lampe?',
      why: 'Die Lampe leuchtet, wenn beide Schalter gleich stehen, also beide oben oder beide unten. Jedes Umlegen, egal an welchem Schalter, schaltet die Lampe um. So kannst du das Licht unten einschalten und oben wieder ausschalten.',
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

  sicherheit: [
    {
      id: 'sicher-quiz', type: 'quiz', devices: ['sicherung', 'schutzleiter'], after: [0, 1, 2, 3], title: 'Gefahren erkennen',
      questions: [
        { q: 'Was passiert bei einem Kurzschluss?', opts: ['Der Widerstand ist fast null, der Strom wird sehr groß', 'Der Widerstand wird sehr groß, der Strom wird null', 'Die Spannung steigt stark an, der Strom bleibt gleich'], a: 0,
          why: 'Plus und Minus sind direkt verbunden, ohne Gerät, das den Strom bremst. Die Leitungen werden heiß, die Sicherung löst aus.' },
        { q: 'Föhn, Wasserkocher und Heizlüfter laufen gleichzeitig an einer Mehrfachsteckdose. Was ist das Problem?', opts: ['Die Ströme addieren sich, Kabel und Steckdose können überhitzen', 'Die Spannung teilt sich auf, die Geräte laufen nur schwach', 'Kein Problem, weil an jedem Gerät dieselbe Spannung liegt'], a: 0,
          why: 'Die Geräte sind parallel geschaltet. Ihre Teilströme addieren sich in der Zuleitung, hier auf über 25 A. Mehrfachsteckdosen sind meist nur für 16 A gebaut.' },
        { q: 'Wozu dient eine Sicherung?', opts: ['Sie unterbricht den Stromkreis, wenn der Strom zu groß wird', 'Sie erhöht die Spannung, wenn ein Gerät mehr Strom braucht', 'Sie speichert Strom, damit bei Stromausfall Licht bleibt'], a: 0,
          why: 'So werden Leitungen vor Überhitzung und das Haus vor einem Brand geschützt.' },
        { q: 'Ein Kabel hat eine beschädigte Isolierung. Was tust du?', opts: ['Nicht benutzen und einem Erwachsenen Bescheid sagen', 'Mit Klebeband umwickeln und dann weiter benutzen', 'Vorsichtig weiter benutzen und die Stelle meiden'], a: 0,
          why: 'An blanken Stellen kannst du einen lebensgefährlichen Stromschlag bekommen. Reparieren darf das nur eine Fachkraft.' },
        { q: 'Wofür ist der grün-gelbe Schutzleiter?', opts: ['Er leitet bei einem Defekt den Strom vom Gehäuse ab', 'Er bringt zusätzlichen Strom ins Gerät, wenn es viel braucht', 'Er schützt das Gerät bei Gewitter vor Blitzen'], a: 0,
          why: 'Berührt ein kaputtes Kabel das Metallgehäuse, fließt der Strom über den Schutzleiter statt durch deinen Körper.' },
        { q: 'Warum darfst du in der Nähe von Bahn-Oberleitungen keinen Drachen steigen lassen und nicht auf Waggons klettern?', opts: ['Bei 15\u00a0000\u00a0V kann der Strom auch ohne Berührung überspringen', 'Die Leitungen werden so heiß, dass der Drachen Feuer fängt', 'Es ist nur verboten, für Menschen aber ungefährlich'], a: 0,
          why: 'Bei sehr hoher Spannung kann ein Lichtbogen durch die Luft überspringen. Es reicht, der Leitung zu nahe zu kommen.' },
      ],
    },
  ],
};
