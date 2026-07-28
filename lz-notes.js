/* =====================================================================
   LebensZeit · Planspiel-Notizen (Weg A: statisch + localStorage)
   Einzige Quelle der Notizen. Wird auf allen Seiten geladen.
   Erledigt-Status: pro Browser (localStorage). Teamweiter Stand =
   diese Datei. Upgrade auf Backend später ohne Umbau möglich.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- 1. Notiz-Registry (hier pflegen) ---------- */
  var NOTES = [
    { id: "n-index-trust", page: "index", selector: ".trust", status: "auszubauen", done: true,
      title: "Platzhalterzahlen der Vertrauensleiste",
      text: "Die Kennzahlen (24/7 · 5 Pflegegrade · 100 % · gGmbH) sind Platzhalter. Durch echte Werte aus dem Betriebs-Cockpit ersetzen." },

    { id: "n-kundenportal-stub", page: "kundenportal", selector: "main", status: "auszubauen",
      title: "Platzhalterseite Kundenportal",
      text: "Vorläufige Platzhalter-Seite. Portal-Funktionen (Login, Termine, Dokumente, Rechnungen, Nachrichten) in einem späteren Sprint ausbauen." },

    { id: "n-markt-pg1", page: "investoren-markt", selector: "main", status: "spaeter",
      title: "PG-1-/Beratungssegment fehlt",
      text: "~90 Klient:innen in Pflegegrad 1 bzw. reiner Beratung sind nicht als eigenes Segment ausgewiesen (180 = PG 2–5). Ergänzen oder bewusst ausklammern — Entscheidung offen." },

    { id: "n-preise-rechner", page: "preise", selector: "main", status: "auszubauen",
      title: "Preis-Empfehlung + Herleitung (Baustein 2)",
      text: "Eigenanteil-Rechner bzw. Preis-Empfehlung ergänzen und die 62 %→70 %-Eigenfinanzierung nachvollziehbar offenlegen. Datenbasis liegt vor." },

    { id: "n-sprints-kampagne", page: "sprints", selector: "main", status: "spaeter",
      title: "Kampagne + 2 Assets (Baustein 3)",
      text: "Marketing-Kampagne plus zwei Assets und zwei KPIs — bislang kaum begonnen. Größte inhaltliche Lücke in Sprint 2." },

    /* ----- KI-Kritik (aus Audit-Analyse) ----- */
    { id: "n-eg-kartenstatus", page: "einzugsgebiet", selector: ".loc-map", status: "offen", done: true,
      title: "Standort-Status öffentlich sichtbar",
      text: "KI-Kritik: Die eingebettete Karte zeigt öffentlich „Wirtschaftlich kritisch\" / „Nicht kostendeckend\" (Rüthen, Lippetal). Für die Kundenansicht entschärfen — die ehrliche Diagnose gehört in Cockpit/Investorenbereich." },

    { id: "n-eg-einwohner", page: "einzugsgebiet", selector: ".kpi-strip", status: "offen",
      title: "Einwohnerzahlen vereinheitlichen",
      text: "KI-Kritik: Zahlen driften zwischen Standortkarte, Wettbewerbsanalyse und Investorpitch (z. B. Erwitte 16.300 vs. ~20.200, Lippetal 11.883 vs. 8.500). Vor dem Pitch auf einen Datensatz festlegen — sonst Angriffsfläche im Investoren-Q&A." },

    { id: "n-index-247", page: "index", selector: ".trust", status: "offen", done: true,
      title: "24/7-Versprechen ersetzt",
      text: "KI-Kritik: Laut Basisdaten kein Nachtdienst (nur Früh-/Spätdienst, Wochenende Rufbereitschaft), Hausnotruf nur Premium. „24/7 Erreichbarkeit im Notfall\" präzisieren oder streichen." },

    { id: "n-index-usp", page: "index", selector: ".hero", status: "auszubauen",
      title: "USP zuspitzen (Baustein 1)",
      text: "KI-Kritik: Startseite noch generisch (vier Standardleistungen). Auf Option C zuspitzen — „Digitale Nähe – der sichtbare Pflegepartner für Angehörige\" (Persona Markus Dörre), nicht auf drei Säulen." },

    { id: "n-aktuelles-grammatik", page: "aktuelles", selector: "main", status: "offen",
      title: "Grammatik: „aus der Nachbarschaft\"",
      text: "KI-Kritik: Überschrift „Neues aus dem Nachbarschaft\" → „Neues aus der Nachbarschaft\" korrigieren." },

    { id: "n-ueberuns-oton", page: "ueber-uns", selector: "main", status: "spaeter",
      title: "O-Ton der Gründerin",
      text: "KI-Kritik (Kür): kurzes Zitat von Dr. Maria Holthaus „Warum ich LebensZeit gegründet habe\" erhöht Authentizität." },

    /* ----- Sprint-2-Bausteine ----- */
    { id: "n-sprints-app", page: "sprints", selector: "main", status: "auszubauen",
      title: "App-Prototyp V1→V3 (Baustein 4)",
      text: "Drei dokumentierte Iterationsstufen V1–V3 + KI-Persona-Feedback + Live-Klick im Pitch. Braucht einen Owner; V1 muss vor den Ferien stehen." },

    { id: "n-sprints-reflexion", page: "sprints", selector: "main", status: "spaeter",
      title: "Sprint-Reflexion (Baustein 5)",
      text: "„Was habt ihr anders gemacht als in Sprint 1?\" wird separat bewertet — geteiltes Prompt-Tagebuch ab Tag 1 führen, nicht rückwirkend." },

    /* ----- Fest erledigt (im Build eingearbeitet) ----- */
    { id: "n-done-baustein-board", page: "sprints", selector: "main", status: "auszubauen", done: true,
      title: "Baustein-Board eingebaut",
      text: "Sprint-2-Tab: Board mit Ampel, Verantwortlich (offen) und Deadlines ergänzt. Verantwortliche noch einzutragen." },

    { id: "n-done-annahmen-log", page: "unternehmensdaten", selector: "main", status: "auszubauen", done: true,
      title: "Annahmen-Log integriert",
      text: "Unternehmensdaten: Annahmen/Ziele/Projektionen farblich von der Datenbasis abgesetzt." },

    { id: "n-done-prompt-tagebuch", page: "prompt-tagebuch", selector: "main", status: "auszubauen", done: true,
      title: "Prompt-Tagebuch-Seite erstellt",
      text: "Sprint 1 aus der Vorlage nach HTML übersetzt: Vorgehensmodell, dokumentierte Sessions, Abschluss-Reflexion, Leervorlage. Als Menüpunkt verlinkt." },

    { id: "n-done-favicon", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Favicon (.ico) ergänzt",
      text: "Echte favicon.ico (16–64 px) aus dem Pentagon-Logo erzeugt und auf allen Seiten zusätzlich zum inline-SVG verlinkt." },

    { id: "n-done-404", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "404-Seite erstellt",
      text: "Eigene 404.html im Marken-Design statt Netlify-Standard." },

    { id: "n-done-kundenportal-link", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Kundenportal-Link umgebogen",
      text: "Footer-Link „Kundenportal\" zeigt jetzt auf /kundenportal (Platzhalterseite) statt provisorisch auf /pflegeberatung." },

    { id: "n-done-pillmenu-standalone", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Pillmenü auf Standalone-Seiten",
      text: "Schwebendes Planspiel-Menü + einheitliche interne Leiste auf unternehmensdaten/website-status/sprints ergänzt. Cockpit bewusst ausgenommen (Vollbild-Layout)." },

    /* ----- Offen (aus dem Technik-/Review-Check) ----- */
    { id: "n-asset-bibliothek", page: "allgemein", selector: "main", status: "auszubauen",
      title: "Asset-Bibliothek-Seite",
      text: "Neuer Menüpunkt mit Zoho-WorkDrive-Links (Ansehen/Herunterladen + Collection-Upload) — wartet auf die Freigabelinks." },

    { id: "n-mobile-investor", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Mobile-Test Investor-Seiten erledigt",
      text: "Alle sechs Investorenseiten bei 390 px gemessen: kein Seiten-Overflow mehr, Tabellen scrollen im eigenen Container, KPI-Baender brechen korrekt um. Kontraste wurden im selben Durchgang nachgemessen (alle Kleintexte mindestens 4,5 : 1)." },

    { id: "n-review-report", page: "allgemein", selector: "main", status: "offen",
      title: "Gesamt-Review-Report",
      text: "Konsistenz-Durchlauf über alle Seiten ist erfolgt (Begriffe, Zahlen, Diskrepanzen). Ein zusammenhängender Review zu Lesbarkeit/Darstellung/Unterscheidbarkeit fehlt noch." },

    { id: "n-gate-optisch", page: "allgemein", selector: "main", status: "spaeter",
      title: "Investoren-Gate nur optisch",
      text: "Das Gate ist kein echter Zugriffsschutz (Demo-Login vorbelegt) — bewusst so; nur als Punkt festgehalten." },

    /* ----- Betriebs-Cockpit (Ausbaustufe 2) ----- */
    { id: "n-done-cockpit1a", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Cockpit Stufe 1a erledigt",
      text: "Login-Dropdown (6 Rollen aus dem Roster), Alt/Neu-reaktive Login-Seite, Berechtigung Ebene A (gesperrte Module ausgeblendet), Logout mit Vorauswahl. Version v2.4.0." },
    { id: "n-cockpit-1b", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Cockpit Stufe 1b erledigt",
      text: "Ebene B: Reiter im Klientenprofil rollenabhängig sperren (sichtbar, deaktiviert, Tooltip) + Ausnahmezugriff ▲ mit Grund-Abfrage und Zugriffsprotokoll." },
    { id: "n-cockpit-roster", page: "cockpit", selector: "main", status: "offen",
      title: "Personalstamm-Nachtrag",
      text: "Brandt (Disposition), Holthaus (GF) und Yilmaz (Pflegekraft) sind Login-/Website-Namen, fehlen aber im 56er-Roster (DB.belegschaft). Nachtragen oder abgleichen." },
    { id: "n-cockpit-stufe2", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Cockpit Stufe 2 erledigt",
      text: "Sechs rollenspezifische Übersichtsseiten als Einstieg — Aufgaben und Abweichungen, nicht Statistik; einheitliches Muster (2–3 Kennzahlen + Aufgabenliste)." },
    { id: "n-cockpit-medifox", page: "cockpit", selector: "main", status: "auszubauen",
      title: "MediFox-Herkunftskennzeichnung",
      text: "Gespiegelte Datenblöcke markieren (Quelle: MediFox DAN, Stand 06:00); im Altsystem 2024 zusätzlich eine Störmeldung, dass der Export nach MediFox fehlgeschlagen ist. MediFox ist kein Altsystem." },
    { id: "n-done-cockpit-stufe3", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Cockpit Stufe 3 erledigt",
      text: "Pflegekraft-Ansicht (mobile Handy-Spalte, Doku-Status als Spiegel, Übergabe-Knopf „In MediFox dokumentieren\", Hebel 1) und Ehrenamts-Ansicht (Bindungskennzahlen, Bedarfsabgleich mit Vorschlag, Hauptamt-trifft-Ehrenamt)." },
    { id: "n-done-tbl-scroll", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Tabellen mobil horizontal scrollbar",
      text: "21 Tabellen (bench, ptab, cockpit tbl) in .tbl-scroll gekapselt: overflow-x auto, min-width 560 px (Cockpit 620 px), duenne Scrollleiste in Markenfarbe, ab 760 px wieder ohne Mindestbreite. Vorher sprengte preise.html die Seite um 88 px und investoren-markt um 3 px; jetzt kein Seiten-Overflow mehr bei 390 px. Das Baustein-Board bleibt ausgenommen, es hat schon ein Karten-Layout fuer schmale Screens." },
    /* ----- Datenpruefung Five Forces & Investorenbereich ----- */
    { id: "n-done-fiveforces", page: "sprints", selector: "main", status: "offen", done: true,
      title: "Five Forces korrigiert (4 von 5 Werten falsch)",
      text: "Die Sprint-Uebersicht zeigte Branchenrivalitaet 2/5, Kundenmacht 3/5, Lieferantenmacht 3/5 und Ersatzangebote 4/5. Original (Investorpitch S. 9, bestaetigt S. 11): Lieferantenmacht 4/5, Substitute 3/5, Wettbewerbsintensitaet 3/5, Neue Wettbewerber 2/5, Kundenmacht 2/5. Alle fuenf korrigiert und mit Quellenangabe versehen." },
    { id: "n-done-fiveforces-inv", page: "investoren-markt", selector: ".bench", status: "offen", done: true,
      title: "Five Forces im Investorenbereich vervollstaendigt",
      text: "Substitute stand ohne Zahl (nur steigend) und die fuenfte Kraft Wettbewerbsintensitaet fehlte ganz. Substitute jetzt 3/5, Wettbewerbsintensitaet 3/5 ergaenzt — damit stimmen Website und Pitch-Deck ueberein." },
    { id: "n-done-quellen-investoren", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Investorenbereich auf Quellen geprueft",
      text: "Alle 13 Kennzahlen der sechs Investorenseiten gegen die Unterlagen geprueft und mit Datei, Seite, Abschnitt und Belegstufe in die Registry aufgenommen (jetzt 47 Datenpunkte)." },
    { id: "n-inv-umsatz-je-fall", page: "investoren-kennzahlen", selector: ".kpi-item", status: "offen",
      title: "11.700 EUR je Pflegefall mischt Foerdermittel ein",
      text: "Die Zahl ist belegt (SWOT S. 2: ~11.700 EUR je Fall, im Normbereich), entsteht aber aus Gesamtumsatz inklusive 38 % Foerdermitteln geteilt durch 180 Faelle. Aus reinem Pflegeumsatz (1,15 Mio EUR) waeren es ~6.400 EUR. Widerspricht der eigenen Regel, Pflegeumsatz und Foerdermittel getrennt auszuweisen — im Q&A angreifbar. Entweder beide Werte zeigen oder die Bezugsgroesse benennen." },
    { id: "n-inv-175mio", page: "investoren-markt", selector: ".bench", status: "offen",
      title: "Marktzeile 1,75 Mio ohne Beleg",
      text: "Die Makro-Tabelle nennt ambulante Dienste ~1,75 Mio (~35 % aller Pflegebeduerftigen) mit Quellenangabe Destatis 2021 — diese Zahl steht in keiner Sprint-Unterlage. Entweder Einzelnachweis nachtragen oder Zeile entfernen." },
    { id: "n-inv-zieljahre", page: "investoren-finanzierung", selector: ".bench", status: "offen",
      title: "Zieljahre und Foerderquote nicht belegt",
      text: "70 %+ Eigenfinanzierung ist belegt, die Jahreszahl 2027 nennt keine Unterlage. Foerderanteil strukturell unter 30 % ist plausibel (SWOT S. 2: Branche 20–25 %), aber nicht als Ziel dokumentiert. Belegt ist hingegen 8 Stellen bis Q4 2026 (SWOT S. 6). Vor dem Pitch entweder herleiten oder Zeitangaben streichen." },
    { id: "n-inv-branchenschnitt", page: "investoren", selector: ".kpi-item", status: "offen",
      title: "Branchen-Vergleichswert 1,5 Mio ohne Quelle",
      text: "Die Startkachel des Investorenbereichs vergleicht 2,1 Mio EUR Umsatz mit einem Branchendurchschnitt von 1,5 Mio EUR. Dieser Vergleichswert steht in keiner Sprint-Unterlage — Quelle nachtragen oder Klammerzusatz entfernen." },

    /* ----- Design-Audit (Chat Website-Design-Analyse) ----- */
    { id: "n-done-logo-svg", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Logo als Vektordatei erzeugt",
      text: "Drei SVG-Dateien: logo-lebenszeit-symbol.svg (reine Geometrie, schriftunabhaengig), -horizontal.svg (Sekundaervariante Header/Footer) und -vertikal.svg (Primaervariante mit allen vier Zeilen). Farbe ueber currentColor, Farbregel in der SVG-Beschreibung hinterlegt. Wortmarke als Schriftreferenz Georgia/Times, nicht als Pfad - dafuer fehlt die Schriftdatei." },
    { id: "n-done-typo-vergleich", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Typografie-Vergleichsseite gebaut",
      text: "typo-vergleich.html zeigt links den Ist-Zustand (Ueberschriften Cormorant Garamond) und rechts die regelkonforme Variante (Georgia) am selben Ausschnitt, plus Direktvergleich Wortmarke gegen Headline. Entscheidungsgrundlage fuer Audit-Punkt 2." },
    { id: "n-done-audit-arial", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Off-Brand-Font im Hero-SVG entfernt",
      text: "Zweite Audit-Runde: Das Hero-SVG nutzte Arial fuer die Claim-Zeile. Auf Jost umgestellt. Zusaetzlich Footer-Spaltenkopf von Salbei auf Mint (4,61 auf 6,39 : 1)." },
    { id: "n-trust-vierte-kachel", page: "index", selector: ".trust", status: "offen", done: true,
      title: "Vierte Trust-Kachel ersetzt (5 Standorte)",
      text: "Zweite Audit-Runde, Befund 3.4: gGmbH steht als Wort in einem Raster aus Zahlen (6-22 Uhr, 180, 45) - semantischer Bruch. Optionen: durch 520 Mitglieder oder 5 Standorte ersetzen und die Rechtsform anders platzieren, oder das Raster bewusst gemischt lassen. Inhaltliche Entscheidung." },
    { id: "n-skript-tokens", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Skripte auf CSS-Tokens umstellen",
      text: "Zweite Audit-Runde, Befund 3.6/3.7: lz-notes.js und lz-quellen.js setzen Hexwerte hart im injizierten CSS (Wartungsrisiko, Palettendrift). Auf var(--token) mit Fallback umstellen; dabei var(--mint-soft, #cfe0cb) klaeren und Off-Palette-Werte (var(--cream-warm, #FBF4E6), var(--red-err, #A23), var(--amber-deep, #6B4A12), var(--green-deep, #243120)) als Tokens fuehren." },
    { id: "n-done-audit-kontrast", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Design-Audit: Kontraste behoben (P1-P3)",
      text: "Eyebrow von Salbei auf Gruen (2,22 auf 5,60) und 11,5 px statt 10 px mit weniger Laufweite; Logo-Tagline Deckkraft .65 auf .9 (2,75 auf 4,50) und 9 px; gGmbH-Hochstellung .7 auf .9; text3 in Kleintext durchgehend auf text2; Footer-Ueberschriften 12 px. Zusaetzlich gefunden und behoben: Salbei- und Amber-Text auf hellem Grund seitenweit (neue Tokens --forest und --amber-ink), CTA-Band, Footer-Bottom, interne Badges und Statusfarben. Nachmessung: 13 Seiten, 1157 Kleintext-Elemente, alle mindestens 4,5 : 1." },
    { id: "n-done-audit-tokens", page: "unternehmensdaten", selector: "main", status: "auszubauen", done: true,
      title: "Palette vervollstaendigt (--forest, --amber-ink)",
      text: "Waldgruen var(--forest, #5A6E52) aus der Logo-Farbregel war nicht als Token erfasst (Audit-Punkt 6) und ist jetzt auf allen Seiten hinterlegt; zusaetzlich --amber-ink var(--amber-ink, #8F6318) als barrierefreie Amber-Textfarbe. Beides im Reiter Corporate Design dokumentiert, ebenso das horizontale Lockup als offizielle Sekundaervariante." },
    { id: "n-typo-entscheidung", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Typografie-Entscheidung getroffen: Regel erweitert",
      text: "Audit-Punkt 2: Ueberschriften nutzen Cormorant Garamond, die Markenregel schreibt fuer die Wortmarke Georgia/Times vor - zwei konkurrierende Serifen direkt nebeneinander. Entweder Markenregel um Cormorant als Display-Serif erweitern (Empfehlung des Audits) oder Ueberschriften auf Georgia vereinheitlichen. Bewusst nicht eigenmaechtig geaendert." },
    { id: "n-logo-geometrie", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Logo-Geometrie: SVG als kanonisch erklaert",
      text: "Audit: Pentagon-Knotenposition der Website (cx50/cy20, Punkt oben) wirkt nah am Original, sollte aber exakt gegen die Originalgeometrie aus LebensZeit_Logo.pdf gelegt werden. Dafuer braucht es die Vektordatei - der Projekt-Export enthaelt nur ein JPEG-Rendering." },

    /* ----- Quellen-Overlay (Datenherkunft) ----- */
    { id: "n-done-quellen-cd", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Kategorie Corporate Design (hellgruen)",
      text: "Sechste Kategorie im Quellen-Overlay: Festlegungen aus dem Projektspeicher, die das Erscheinungsbild tragen, sich aber nicht ueber die Sprint-Unterlagen belegen lassen \u2014 in Mint var(--mint, #A8C9A0) markiert, Belegstufe S. Drei seitenuebergreifende Marker: Logo/Farbregel, Typografie/Palette, Sprach- und Darstellungsregeln." },
    { id: "n-done-ud-cd-tab", page: "unternehmensdaten", selector: "main", status: "auszubauen", done: true,
      title: "Unterreiter Corporate Design",
      text: "Neunter Unterreiter mit Schriften, Farbpalette, Logo-Regel (nie weiss, Farbe folgt dem Hintergrund), Sprachregelung und Darstellungsregel. Linkziel der hellgruenen Marker (?ud=cd)." },
    { id: "n-done-quellen-panel-weg", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Quellen-Overlay: Seiten-Panel entfernt",
      text: "Die eingeblendete Seitenuebersicht ist entfernt; Markierungen und Popover bleiben. Jedes Popover verlinkt jetzt in den passenden Unterreiter der Unternehmensdaten." },
    { id: "n-done-ud-unterreiter", page: "unternehmensdaten", selector: "main", status: "auszubauen", done: true,
      title: "Unternehmensdaten: Unterreiter + Abschnitt Betrieb",
      text: "Acht Unterreiter (Ueberblick, Standorte, Leistungen, Kennzahlen, Team, Betrieb, Mitgliedschaft, Annahmen-Log) mit Deep-Link ueber ?ud=. Neuer Abschnitt Betrieb aus Basisdaten S. 5, C.1-C.4: Fahrzeugflotte, Fahrzeugkosten, Schichtmodell, Touren, Software, Schluessellieferanten." },
    { id: "n-done-quellen-ueberuns", page: "ueber-uns", selector: "main", status: "auszubauen", done: true,
      title: "Quellen fuer Ueber uns vollstaendig erfasst",
      text: "17 Datenpunkte statt 4: Kennzahlen, Chronik (5), Leitbild (3), Markenwerte (3), Gruenderin, Fahrzeuge — je mit Datei, Seite, Abschnitt und Belegstufe." },
    { id: "n-ueberuns-chronik", page: "ueber-uns", selector: ".timeline", status: "offen",
      title: "Chronik und Vision nicht belegt",
      text: "Belegpruefung ergab: 2021-2022 Wachstum in die Flaeche und die Vision-Formulierung stehen in keiner Sprint-Unterlage; beim Mitgliedschaftsmodell ist die Staffel belegt, das Einfuehrungsjahr 2023 nicht. Entweder belegen oder als Erzaehlung kennzeichnen." },
    { id: "n-done-quellen-praezise", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Belege praezisiert (Datei, Seite, Abschnitt)",
      text: "Jeder Datenpunkt nennt jetzt Dateiname, Seitenzahl, Abschnitt, ggf. externen Ursprung und eine Belegstufe A-D. Grundlage: Seitenweise Auswertung der Sprint-Unterlagen (Basisdaten 7 S., Investorpitch 24 S.)." },
    { id: "n-done-index-trustfix", page: "index", selector: ".trust", status: "auszubauen", done: true,
      title: "Vertrauensleiste durch belegte Werte ersetzt",
      text: "24/7, 5 Pflegegrade und 100 % vernetzt entfernt. Neu: 6-22 Uhr Frueh-/Spaetdienst (Basisdaten S. 5, C.3), 180 Pflegefaelle PG 2-5 (S. 6, D.1), 45 Ehrenamtliche (S. 2), gGmbH (S. 2). Alle vier belegt." },
    { id: "n-done-quellen-overlay", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Quellen-Overlay gebaut",
      text: "Zweiter Layer neben den To-Dos: lz-quellen.js markiert Datenpunkte nach Herkunft (Datenbasis, amtliche Statistik, Ziel, Annahme, Platzhalter) mit Badge, Popover (Quelle/Stand/Hinweis) und Seiten-Panel inkl. Zaehlung. Umschaltbar im Pillmenue, Cockpit ausgenommen." },
    { id: "n-quellen-registry", page: "allgemein", selector: "main", status: "auszubauen",
      title: "Quellen-Registry vervollstaendigen",
      text: "Stand: 36 Datenpunkte (3 davon seitenuebergreifend) mit Datei, Seite, Abschnitt und Belegstufe erfasst. Offen: Leistungen, Aktuelles, Pflegeberatung, Investoren-Unterseiten sowie die gespiegelten Cockpit-Bloecke (MediFox-Kennzeichnung)." },

    { id: "n-cockpit-stufe4", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Cockpit Stufe 4 erledigt",
      text: "Tagesansicht mit Störung (Disposition): Dienstag 07:12, 2 Krankmeldungen / 3 Touren; Vorschlagsliste prüft §37.3-Qualifikation und Zeitfenster, Ein-Klick-Umplanung; 2024-Telefonzettel-Version. Zugleich Sprint-4-Vorlage." }
  ];

  /* ---------- 2. Status-Metadaten ---------- */
  var STATUS = {
    offen:      { label: "Offen",           color: "var(--red, #8C3A2A)" },
    auszubauen: { label: "Auszubauen",      color: "var(--amber, #B07A2A)" },
    spaeter:    { label: "Späterer Sprint", color: "var(--green, #4A6741)" }
  };

  /* ---------- 3. Erledigt-Status (localStorage + Fallback) ---------- */
  var MEM = {};           // In-Memory-Spiegel (Preview ohne localStorage)
  var KEY = "lz-notes-done";
  var BY_ID = {}; NOTES.forEach(function (n) { BY_ID[n.id] = n; });
  function isFixed(id) { return !!(BY_ID[id] && BY_ID[id].done); } // im Build fest erledigt
  function loadDone() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (raw) MEM = JSON.parse(raw) || {};
    } catch (e) { /* Preview / blockiert -> nur MEM */ }
    return MEM;
  }
  function saveDone() {
    try { window.localStorage.setItem(KEY, JSON.stringify(MEM)); } catch (e) {}
  }
  function isDone(id) { return isFixed(id) || !!MEM[id]; }
  function setDone(id, done) {
    if (isFixed(id)) return; // fest erledigt — auf der Live-Seite nicht umschaltbar
    if (done) MEM[id] = true; else delete MEM[id];
    saveDone();
    document.dispatchEvent(new CustomEvent("lz-notes-changed", { detail: { id: id, done: done } }));
  }

  /* ---------- 4. Toggle-Zustand (Pins ein/aus) ---------- */
  var TKEY = "lz-notes-visible";
  function loadVisible() {
    try { return window.localStorage.getItem(TKEY) === "1"; } catch (e) { return false; }
  }
  function saveVisible(v) {
    try { window.localStorage.setItem(TKEY, v ? "1" : "0"); } catch (e) {}
  }

  /* ---------- 5. Seiten-Slug ---------- */
  function slug(path) {
    if (!path && window.LZ_PAGE_OVERRIDE) return String(window.LZ_PAGE_OVERRIDE).toLowerCase();
    var seg = (path || location.pathname).split("/").filter(Boolean).pop() || "index";
    return seg.replace(/\.html?$/i, "").toLowerCase() || "index";
  }
  function notesForPage(pageSlug) {
    var ps = pageSlug || slug();
    return NOTES.filter(function (n) { return n.page === ps; });
  }

  /* ---------- 6. CSS injizieren ---------- */
  function injectCSS() {
    if (document.getElementById("lz-notes-css")) return;
    var css = "" +
      ".fiktiv-menu-sep{height:1px;background:rgba(168,201,160,.18);margin:4px 2px;}" +
      ".fiktiv-note-toggle{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;color:var(--cream, #F5F0E8);background:rgba(176,122,42,.16);border:1px solid rgba(176,122,42,.45);border-radius:30px;padding:12px 18px;font:inherit;font-size:15px;letter-spacing:.3px;cursor:pointer;transition:background .12s,transform .12s;}" +
      ".fiktiv-note-toggle:hover{background:rgba(176,122,42,.3);transform:translateX(2px);}" +
      ".fiktiv-note-toggle #lzNotesState{font-weight:600;}" +
      ".lz-note-anchor{position:relative;}" +
      ".lz-note-pin{display:none;position:absolute;top:10px;right:10px;z-index:40;width:30px;height:30px;border-radius:50%;border:2px solid var(--cream, #F5F0E8);background:var(--amber, #B07A2A);color:#fff;font-size:14px;line-height:1;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.28);}" +
      ".lz-note-pin.s-offen{background:var(--red, #8C3A2A);}.lz-note-pin.s-auszubauen{background:var(--amber, #B07A2A);}.lz-note-pin.s-spaeter{background:var(--green, #4A6741);}" +
      "body.lz-notes-active .lz-note-pin{display:flex;animation:lzPinPulse 2.2s ease-in-out infinite;}" +
      "@keyframes lzPinPulse{0%,100%{box-shadow:0 4px 14px rgba(0,0,0,.28),0 0 0 0 rgba(176,122,42,.4);}50%{box-shadow:0 4px 14px rgba(0,0,0,.28),0 0 0 7px rgba(176,122,42,0);}}" +
      ".lz-note-pop{position:absolute;top:48px;right:10px;z-index:41;width:300px;max-width:calc(100vw - 40px);background:#fff;color:var(--text, #2A2820);border:1px solid rgba(74,103,65,.18);border-radius:12px;padding:16px 18px 16px;box-shadow:0 20px 48px rgba(0,0,0,.22);text-align:left;font-family:'Jost',sans-serif;}" +
      ".lz-note-pop[hidden]{display:none;}" +
      ".lz-note-badge{display:inline-block;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:600;padding:3px 10px;border-radius:20px;margin-bottom:8px;color:#fff;}" +
      ".lz-note-pop h4{font-family:'Cormorant Garamond',serif;font-weight:600;color:var(--green3, #2C3D27);font-size:20px;margin:0 0 4px;line-height:1.2;}" +
      ".lz-note-pop p{font-size:14px;line-height:1.55;color:var(--text2, #5A5648);margin:0 0 12px;}" +
      ".lz-note-pop .lz-note-close{position:absolute;top:8px;right:10px;border:0;background:none;color:var(--text3, #8A8478);font-size:18px;cursor:pointer;line-height:1;}" +
      ".lz-note-done-btn{display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:13px;color:var(--green, #4A6741);background:rgba(74,103,65,.08);border:1px solid rgba(74,103,65,.25);border-radius:20px;padding:7px 14px;cursor:pointer;}" +
      ".lz-note-done-btn:hover{background:rgba(74,103,65,.16);}";
    var el = document.createElement("style");
    el.id = "lz-notes-css";
    el.textContent = css;
    document.head.appendChild(el);
  }

  /* ---------- 6b. Pillmenü-Leiste (CSS + Auto-Inject) ---------- */
  function injectBarCSS() {
    if (document.getElementById("lz-bar-css")) return;
    var css = "" +
      ".fiktiv-bar{position:relative;z-index:100;}" +
      ".fiktiv-marquee{display:block;width:100%;border:0;padding:0;font:inherit;cursor:pointer;text-align:left;background:var(--red, #8C3A2A);color:#fff;overflow:hidden;white-space:nowrap;}" +
      ".fiktiv-marquee:focus-visible{outline:2px solid #fff;outline-offset:-3px;}" +
      ".fiktiv-marquee .track{display:inline-block;padding:7px 0;animation:fiktivscroll 60s linear infinite;}" +
      ".fiktiv-marquee .track span{font-size:12px;letter-spacing:2px;text-transform:uppercase;padding:0 36px;}" +
      "@keyframes fiktivscroll{from{transform:translateX(0);}to{transform:translateX(-50%);}}" +
      ".fiktiv-menu{position:absolute;top:100%;left:16px;margin-top:10px;display:flex;flex-direction:column;gap:8px;background:rgba(30,32,26,0.96);backdrop-filter:blur(6px);border:1px solid rgba(168,201,160,.25);border-radius:16px;padding:14px;min-width:240px;box-shadow:0 18px 44px rgba(0,0,0,.32);animation:lzMenuIn .16s ease-out;}" +
      ".fiktiv-menu[hidden]{display:none;}" +
      ".fiktiv-menu-h{font-size:10px;letter-spacing:2px;text-transform:uppercase;color:var(--sage, #8AAC85);padding:2px 6px 4px;}" +
      ".fiktiv-menu a{display:block;color:var(--cream, #F5F0E8);background:rgba(168,201,160,.10);border:1px solid rgba(168,201,160,.22);border-radius:30px;padding:12px 18px;font-size:15px;letter-spacing:.3px;text-decoration:none;transition:background .12s,transform .12s;}" +
      ".fiktiv-menu a:hover{background:var(--green, #4A6741);border-color:var(--green, #4A6741);transform:translateX(2px);color:#fff;}" +
      "@keyframes lzMenuIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}";
    var el = document.createElement("style"); el.id = "lz-bar-css"; el.textContent = css;
    document.head.appendChild(el);
  }

  function ensureBar() {
    if (document.querySelector(".fiktiv-bar")) return false; // schon vorhanden (öffentliche Seiten)
    var marquee = "";
    for (var i = 0; i < 8; i++) marquee += "<span>Fiktives Unternehmen · nur zu Schulungszwecken</span>";
    var bar = document.createElement("div");
    bar.className = "fiktiv-bar";
    bar.innerHTML =
      '<button class="fiktiv-marquee" id="lzTrigger" aria-expanded="false" aria-controls="fiktivMenu" aria-label="Planspiel-Menü öffnen" onclick="lzToggleMenu()"><div class="track">' + marquee + '</div></button>' +
      '<div class="fiktiv-menu" id="fiktivMenu" role="menu" aria-label="Planspiel-interne Daten" hidden>' +
        '<span class="fiktiv-menu-h">Planspiel-intern</span>' +
        "<a href='/unternehmensdaten' role='menuitem'>Unternehmensdaten</a>" +
        "<a href='/sprints' role='menuitem'>Sprint-Übersicht</a>" +
        "<a href='/website-status' role='menuitem'>Website-Status</a>" +
        "<a href='/notizen' role='menuitem'>To-Do's</a>" +
        "<a href='/prompt-tagebuch' role='menuitem'>Prompt-Tagebuch</a>" +
        '<div class="fiktiv-menu-sep"></div>' +
        '<button type="button" class="fiktiv-note-toggle" role="menuitem" id="lzNotesToggle" onclick="lzToggleNotes()"><span>🗒 To-Do\'s</span><span id="lzNotesState">Aus</span></button>' +
      '</div>';
    document.body.insertBefore(bar, document.body.firstChild);
    // Menü-Verhalten nur für die injizierte Leiste binden
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".fiktiv-bar")) lzToggleMenu(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lzToggleMenu(false); });
    return true;
  }

  /* lzToggleMenu nur definieren, falls die Seite es nicht schon inline hat */
  if (typeof window.lzToggleMenu !== "function") {
    window.lzToggleMenu = function (force) {
      var m = document.getElementById("fiktivMenu"), t = document.getElementById("lzTrigger");
      if (!m) return;
      var open = (typeof force === "boolean") ? force : m.hasAttribute("hidden");
      if (open) m.removeAttribute("hidden"); else m.setAttribute("hidden", "");
      if (t) t.setAttribute("aria-expanded", open ? "true" : "false");
    };
  }

  /* ---------- 7. Pins auf der aktuellen Seite bauen ---------- */
  function buildPins() {
    var mine = notesForPage().filter(function (n) { return !isDone(n.id); });
    // Zähler im Pillmenü-Toggle
    var stateEl = document.getElementById("lzNotesState");
    var active = document.body.classList.contains("lz-notes-active");
    if (stateEl) stateEl.textContent = (active ? "An" : "Aus") + (mine.length ? " · " + mine.length : "");

    // pro Anker-Element Offset zählen (mehrere Notizen am selben Element)
    var offsetMap = new Map();
    mine.forEach(function (n) {
      var host = document.querySelector(n.selector) || document.querySelector("main") || document.body;
      if (!host) return;
      host.classList.add("lz-note-anchor");
      var i = offsetMap.get(host) || 0; offsetMap.set(host, i + 1);
      var meta = STATUS[n.status] || STATUS.offen;

      var pin = document.createElement("button");
      pin.type = "button";
      pin.className = "lz-note-pin s-" + n.status;
      pin.style.top = (10 + i * 40) + "px";
      pin.setAttribute("aria-label", "Notiz: " + n.title);
      pin.textContent = "✎";

      var pop = document.createElement("div");
      pop.className = "lz-note-pop";
      pop.hidden = true;
      pop.style.top = (46 + i * 40) + "px";
      pop.innerHTML =
        '<button type="button" class="lz-note-close" aria-label="Notiz schließen">×</button>' +
        '<span class="lz-note-badge" style="background:' + meta.color + '">' + meta.label + '</span>' +
        '<h4></h4><p></p>' +
        '<button type="button" class="lz-note-done-btn">✓ Erledigt — ausblenden</button>';
      pop.querySelector("h4").textContent = n.title;
      pop.querySelector("p").textContent = n.text;

      pin.addEventListener("click", function (e) {
        e.stopPropagation();
        document.querySelectorAll(".lz-note-pop").forEach(function (p) { if (p !== pop) p.hidden = true; });
        pop.hidden = !pop.hidden;
      });
      pop.querySelector(".lz-note-close").addEventListener("click", function () { pop.hidden = true; });
      pop.querySelector(".lz-note-done-btn").addEventListener("click", function () {
        setDone(n.id, true);
        pin.remove(); pop.remove();
        buildPins(); // Zähler aktualisieren
      });

      host.appendChild(pin);
      host.appendChild(pop);
    });
  }
  function clearPins() {
    document.querySelectorAll(".lz-note-pin,.lz-note-pop").forEach(function (el) { el.remove(); });
  }

  /* ---------- 8. Öffentliche Toggle-Funktion (Pillmenü-Button) ---------- */
  window.lzToggleNotes = function (force) {
    var active = (typeof force === "boolean") ? force : !document.body.classList.contains("lz-notes-active");
    document.body.classList.toggle("lz-notes-active", active);
    saveVisible(active);
    if (!active) document.querySelectorAll(".lz-note-pop").forEach(function (p) { p.hidden = true; });
    var stateEl = document.getElementById("lzNotesState");
    var count = notesForPage().filter(function (n) { return !isDone(n.id); }).length;
    if (stateEl) stateEl.textContent = (active ? "An" : "Aus") + (count ? " · " + count : "");
  };

  /* Außenklick schließt Popover */
  document.addEventListener("click", function (e) {
    if (!e.target.closest(".lz-note-pin,.lz-note-pop")) {
      document.querySelectorAll(".lz-note-pop").forEach(function (p) { p.hidden = true; });
    }
  });

  /* ---------- 9. API für notizen.html ---------- */
  window.LZNotes = {
    all: function () { return NOTES.slice(); },
    status: STATUS,
    slug: slug,
    isDone: isDone,
    isFixed: isFixed,
    setDone: setDone,
    rebuild: function () { clearPins(); buildPins(); }
  };

  /* ---------- 10. Init ---------- */
  function init() {
    loadDone();
    injectCSS();
    injectBarCSS();
    if (slug() !== "cockpit") ensureBar(); // Cockpit: Vollbild-Layout, keine Leiste einfügen
    if (loadVisible()) document.body.classList.add("lz-notes-active");
    buildPins();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
