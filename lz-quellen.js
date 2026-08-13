/* =========================================================
   LebensZeit · Quellen-Overlay (Planspiel-intern)
   Zweiter Layer neben den To-Dos: macht die Herkunft der
   angezeigten Daten explizit — Datenbasis, amtliche Statistik,
   Ziel, Annahme oder Platzhalter.
   Konzeptstand: repraesentative Auswahl, beliebig erweiterbar.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- 1. Kategorien ---------- */
  /* Jede Kategorie traegt zwei Farbpaare: hell fuer Creme/Weiss, dunkel fuer die
     Nachtflaeche des Cockpits. Ein einziger Wert reicht nicht — Salbeigruen etwa
     liegt auf Creme bei 2,22:1, auf der Nachtflaeche bei 6,52:1. Die Tinte kippt
     mit: auf den dunklen Hellwerten Weiss, auf den hellen Dunkelwerten Nachtinte. */
  var CATS = {
    basis:   { label: "Datenbasis",         sym: "\u25C6",
               farbe: "#4A6741", tinte: "#FFFFFF", farbeD: "#8AAC85", tinteD: "#12190F",
               info: "Verbindlicher Steckbrief \u2014 unveraendert uebernehmen." },
    amt:     { label: "Amtliche Statistik", sym: "\u25B2",
               farbe: "#8AAC85", tinte: "#2A2820", farbeD: "#A8C9A0", tinteD: "#12190F",
               info: "Externe Quelle, im Pitch zitierbar." },
    ziel:    { label: "Ziel / Planwert",    sym: "\u25CF",
               farbe: "#B07A2A", tinte: "#2A2820", farbeD: "#E2B56A", tinteD: "#12190F",
               info: "Angestrebter Wert \u2014 nicht als Ist ausgeben." },
    annahme: { label: "Annahme",            sym: "\u25CB",
               farbe: "#5A5648", tinte: "#FFFFFF", farbeD: "#93A493", tinteD: "#12190F",
               info: "Abgeleitet oder geschaetzt \u2014 Herleitung offenlegen." },
    synth:   { label: "Erzeugter Datensatz", sym: "\u2B21",
               farbe: "#33566B", tinte: "#FFFFFF", farbeD: "#9CC2CE", tinteD: "#12190F",
               info: "Selbst erzeugte Einzeldaten \u2014 die Summen stimmen mit dem Steckbrief ueberein, die einzelnen Personen, Adressen und Fahrten sind erfunden. Nie als echte Erhebung ausgeben." },
    platz:   { label: "Platzhalter",        sym: "\u2715",
               farbe: "#8C3A2A", tinte: "#FFFFFF", farbeD: "#F09595", tinteD: "#12190F",
               info: "Nicht belegt \u2014 vor dem Pitch ersetzen oder streichen." },
    cd:      { label: "Corporate Design",   sym: "\u25C8",
               farbe: "#A8C9A0", tinte: "#2A2820", farbeD: "#A8C9A0", tinteD: "#12190F",
               info: "Festlegung aus dem Projektspeicher \u2014 tr\u00e4gt das Corporate Design, l\u00e4sst sich aber nicht \u00fcber die Sprint-Unterlagen belegen." }
  };

  /* ---------- 2. Registry: Datenpunkte je Seite ---------- */
  /* sel = CSS-Selektor, idx = n-tes Vorkommen (0-basiert) */
  var GUETE = {
    A: "A \u00b7 Sprint-Unterlage mit Seite & Abschnitt",
    B: "B \u00b7 externe Statistik, \u00fcber Sprint-Unterlage belegt",
    C: "C \u00b7 abgeleitet / im Dokument als Annahme markiert",
    D: "D \u00b7 kein Beleg vorhanden",
    S: "S \u00b7 Teamfestlegung im Projektspeicher (nicht dateibelegt)"
  };
  var BD = "LebensZeit_Geschaeftsmodell_Basisdaten.pdf";
  var IP = "LebensZeit_Investorpitch_20min.pdf";
  var MW = "LebensZeit_Markt_Wettbewerbsanalyse.docx";

  var SRC = [
    /* ══ Betriebs-Cockpit ══════════════════════════════════════════════
       Die Simulation fuehrt vier Bestaende, die es in keiner Unterlage gibt:
       180 Klienten, 56 Mitarbeitende, 45 Ehrenamtliche, 18 Fahrzeuge, dazu
       6 Touren und 8 offene Stellen. Erzeugt wurden sie gegen die Summen und
       Verteilungen des Steckbriefs — nachgerechnet am 07.08.2026, Ergebnis je
       Eintrag im Hinweis. Selektoren sind auf das Modul verengt, weil render()
       #main je Modul komplett neu schreibt. */

    { page: "cockpit", sel: '#main[data-mod="home"] > .kgrid', idx: 0, wert: "Kennzahlenreihe der \u00dcbersicht", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "2, 4", absch: "Kennzahlenblock \u00b7 A.1 Umsatz-Split", stand: "Sprint 1", guete: "A",
      hinweis: "180 Pflegef\u00e4lle \u00b7 62 % Eigenfinanzierung \u00b7 56 Mitarbeitende \u00b7 520 Mitglieder \u00b7 18 Fahrzeuge \u00b7 45 Ehrenamtliche. Alle sechs Werte stehen so im Steckbrief. Pflegeumsatz 1,15 Mio. und F\u00f6rdermittel 0,80 Mio. bleiben getrennt." },

    { page: "cockpit", sel: '#main[data-mod="home"] > .panel', idx: 1, wert: "Deckungsbeitr\u00e4ge je Standort", kat: "basis", ud: "standorte",
      dok: BD, seite: "4", absch: "A.3 Ergebnis je Standort", stand: "Sprint 1", guete: "A",
      hinweis: "Erwitte +110 \u00b7 Bad Sassendorf +55 \u00b7 Anr\u00f6chte +12 \u00b7 R\u00fcthen \u221238 \u00b7 Lippetal \u221230 k\u20ac; F\u00e4lle 70/45/25/22/18. Beides stimmt mit dem Datenbestand der Simulation exakt \u00fcberein. Nach direkten Standortkosten, vor Zentral-Overhead." },

    { page: "cockpit", sel: '#main[data-mod="kli"] > .panel', idx: 2, wert: "180 Klientendatens\u00e4tze", kat: "synth", ud: "kennzahlen", todo: "cockpit",
      dok: "\u2014 erzeugt f\u00fcr die Simulation", seite: "\u2014", absch: "\u2014", stand: "07.08.2026", guete: "D",
      hinweis: "Namen, Adressen, Koordinaten, Eintrittsdatum und Besuchsfrequenz sind erfunden. Gepr\u00fcft und deckungsgleich mit dem Steckbrief: Pflegegrade 70/65/35/10 (D.1) und Standortverteilung 70/45/25/22/18 (A.3). Mittlere Aussch\u00f6pfung 39,2 % gegen ~40 % im Steckbrief. Hildegard Stemmer steht hier mit 82/PG 3, im Personas-Handout mit 79/PG 2 \u2014 offener Widerspruch." },

    { page: "cockpit", sel: '#main[data-mod="kli"] > .panel', idx: 0, wert: "Sachleistungs-Caps je Pflegegrad", kat: "amt", ud: "kennzahlen",
      dok: BD, seite: "6", absch: "D.1 Klientenstruktur nach Pflegegrad", stand: "Sprint 1", guete: "B",
      extern: "SGB XI \u00a736 \u00b7 GKV-Spitzenverband, Leistungsbetr\u00e4ge",
      hinweis: "PG 2: 761 \u20ac \u00b7 PG 3: 1.432 \u20ac \u00b7 PG 4: 1.778 \u20ac \u00b7 PG 5: 2.200 \u20ac je Monat, \u00d8 Cap 1.281 \u20ac. Gelten laut Markt- und Wettbewerbsanalyse ab Januar 2024; n\u00e4chste Anpassung ist f\u00fcr 2028 vorgesehen (PUEG), die Werte sind im Simulationsjahr 2026 also g\u00fcltig." },

    { page: "cockpit", sel: '#main[data-mod="pers"] > .panel', idx: 1, wert: "56 Personaldatens\u00e4tze", kat: "synth", ud: "team", todo: "cockpit",
      dok: "\u2014 erzeugt f\u00fcr die Simulation", seite: "\u2014", absch: "\u2014", stand: "07.08.2026", guete: "D",
      hinweis: "Kopfzahl 56 und Vollzeit\u00e4quivalente 45,6 (Steckbrief ~45) stimmen. Der Rollenmix weicht ab: der Steckbrief f\u00fchrt 20 Fachkr\u00e4fte, 13 Hilfskr\u00e4fte, 5 Hauswirtschaft/Betreuung und 5 Verwaltung, die Simulation 18/14/0/4 plus 6 Auszubildende und 1 Qualit\u00e4tsmanagement. Ursache: die 6 Azubis stehen im Steckbrief neben den 56, hier aber darin \u2014 sie verdr\u00e4ngen die Hauswirtschaft. Examinierte 23 statt 25. Vor dem Pitch angleichen." },

    { page: "cockpit", sel: '#main[data-mod="pers"] > .panel', idx: 0, wert: "8 offene Stellen", kat: "basis", ud: "team",
      dok: BD, seite: "7", absch: "F \u00b7 Personalstruktur (Detail)", stand: "Sprint 1", guete: "A",
      hinweis: "Soll 64, besetzt 56 \u2192 8 offene Fachkraftstellen. Standortzuordnung und Vakanzdauer (3 bis 11 Monate) sind f\u00fcr die Simulation erzeugt und in keiner Unterlage belegt." },

    { page: "cockpit", sel: '#main[data-mod="tour"] > .panel', idx: 1, wert: "6 Touren mit Stopps", kat: "synth", ud: "betrieb", todo: "cockpit",
      dok: "\u2014 erzeugt f\u00fcr die Simulation", seite: "\u2014", absch: "\u2014", stand: "07.08.2026", guete: "D",
      hinweis: "Routen, Stoppfolgen und die Namen der Pflegekr\u00e4fte sind erfunden \u2014 die Tourennamen tauchen im Personalstamm nicht auf, es sind drei getrennte Namensr\u00e4ume. Der Umfang ist stark verk\u00fcrzt: der Steckbrief nennt 3\u20134 Touren je Standort fr\u00fch und ~2 sp\u00e4t (C.3), also rund 25 am Tag; die Simulation zeigt 6." },

    { page: "cockpit", sel: '#main[data-mod="ehren"] > .panel', idx: 2, wert: "45 Ehrenamtsdatens\u00e4tze", kat: "synth", ud: "team", todo: "cockpit",
      dok: "\u2014 erzeugt f\u00fcr die Simulation", seite: "\u2014", absch: "\u2014", stand: "07.08.2026", guete: "D",
      hinweis: "Kopfzahl 45 stimmt mit dem Steckbrief (S. 2 und S. 7). Personen, T\u00e4tigkeiten, Monatsstunden und die Markierung \u00a745c/d-relevant sind erzeugt. T\u00e4tigkeitsspektrum folgt Teil 1 des Steckbriefs: Besuchsdienst, Vorlesen, Einkaufshilfe, Demenz-Begleitung, Fahrdienst, Begegnungsort \u2014 nichts Pflegerisches." },

    { page: "cockpit", sel: '#main[data-mod="fuhr"] > .panel', idx: 1, wert: "18 Fahrzeugdatens\u00e4tze", kat: "synth", ud: "betrieb",
      dok: "\u2014 erzeugt f\u00fcr die Simulation", seite: "\u2014", absch: "\u2014", stand: "07.08.2026", guete: "D",
      hinweis: "Kennzeichen, Modelle, Kilometerst\u00e4nde und Wartungsfristen sind erfunden. Standortverteilung Erwitte 6 \u00b7 Bad Sassendorf 4 \u00b7 Anr\u00f6chte 3 \u00b7 R\u00fcthen 3 \u00b7 Lippetal 2 und die Leasingkosten um 9.300 \u20ac je Fahrzeug stimmen mit C.1 \u00fcberein." },

    { page: "cockpit", sel: "#side", idx: 0, wert: "Rollen und Berechtigungen", kat: "annahme", ud: "betrieb", todo: "cockpit",
      dok: "Projektspeicher \u00b7 Team-Festlegung", seite: "\u2014", absch: "Cockpit-Berechtigungskonzept", stand: "laufend", guete: "S",
      hinweis: "Sechs Demo-Rollen mit modul- und reiterweiser Freigabe. In keiner Sprint-Unterlage beschrieben \u2014 abgeleitet aus \u00a722 SGB X und dem Erforderlichkeitsgrundsatz. Die Rollennamen der Anmeldung (Holthaus, Brandt, Yilmaz) stehen nicht im Personalstamm der Simulation." },

    { page: "cockpit", sel: "#foot", idx: 0, wert: "Altsystem 2024", kat: "annahme", ud: "betrieb",
      dok: BD, seite: "5", absch: "C.2 Software-Stack", stand: "Sprint 1", guete: "C",
      hinweis: "Der Steckbrief nennt MediFox DAN als f\u00fchrendes System und Excel plus Telefon f\u00fcr die Tourenplanung. Das dargestellte \u201ePflegeVerwaltung 2024\u201c samt Makrowarnung, Netzlaufwerk und Ladezeiten ist eine Veranschaulichung dieses R\u00fcckstands, kein reales Produkt." },

    /* --- Wettbewerbs-Dashboard --- */
    { page: "investoren-wettbewerb", sel: ".kpi-grid", idx: 0, wert: "Kennzahlen des Wettbewerbsumfelds", kat: "annahme", ud: "markt", todo: "investoren-wettbewerb",
      dok: MW, seite: "\u2014", absch: "Kap. 2 \u00b7 Markt und Wettbewerb", stand: "April 2026", guete: "C",
      extern: "Destatis \u00b7 IT.NRW \u00b7 Bertelsmann Stiftung 2023",
      hinweis: "10 Wettbewerber, 2 hochrelevante, 4,5 % Marktpenetration, 5,3 Wettbewerber je Standort. Die Bedrohungsbewertungen 1\u201310 sind eine eigene Skala des Teams, keine externe Erhebung. Das adressierbare Potenzial von 3,0 Mio. \u20ac ist in den Gesch\u00e4ftsmodell-Basisdaten ausdr\u00fccklich als bekannte Schwachstelle vermerkt \u2014 es passt rechnerisch nicht zu ~3.995 Pflegebed\u00fcrftigen." },

    { page: "investoren-wettbewerb", sel: ".bench-row", idx: 0, wert: "KPI-Benchmark gegen die Branche", kat: "ziel", ud: "kennzahlen",
      dok: BD, seite: "2", absch: "Kennzahlenblock", stand: "Sprint 1", guete: "B",
      hinweis: "F\u00f6rderanteil 38 % gegen 22 % Branche \u2014 einheitlich als +16 PP ausgewiesen, die Bewertung tr\u00e4gt die Farbe, nicht das Vorzeichen. Eigenfinanzierung 62 % gegen das eigene Ziel 70 %, also \u20138 PP; die Branchenzahl 78 % wird bewusst nicht mehr als Bezugsgr\u00f6\u00dfe verwendet (Festlegung 08.08.2026). Beide Werte standen vorher auf derselben Seite mit widerspr\u00fcchlichen Vorzeichen und Bezugsgr\u00f6\u00dfen." },

    { page: "investoren-wettbewerb", sel: ".standort-grid", idx: 0, wert: "Standortdaten und Einwohnerzahlen", kat: "annahme", ud: "standorte", todo: "investoren-wettbewerb",
      dok: MW, seite: "\u2014", absch: "Standortbetrachtung", stand: "April 2026", guete: "C",
      hinweis: "Erwitte 20.200 \u00b7 Bad Sassendorf 13.100 \u00b7 Anr\u00f6chte 8.400 \u00b7 R\u00fcthen 10.700 \u00b7 Lippetal 8.500. Festlegung vom 08.08.2026: Markt- und Wettbewerbsanalyse plus Dashboard sind die Quelle. Standortkarte und Investorpitch f\u00fchren abweichende Werte (~16.200 f\u00fcr Erwitte, 10.304 / 10.290 / 11.883) \u2014 diese m\u00fcssen nachgezogen werden." },

    /* --- Kundenportal --- */
    { page: "kundenportal", sel: ".naechst", idx: 0, wert: "Beispielverl\u00e4ufe im Portal", kat: "synth", ud: "betrieb", todo: "kundenportal",
      dok: "\u2014 erzeugt f\u00fcr die Simulation", seite: "\u2014", absch: "\u2014", stand: "07.08.2026", guete: "D",
      hinweis: "Termine, Dokumente, Rechnungsbetr\u00e4ge und die R\u00fcckfrage sind erfunden. Die Personen sind es nicht: Hildegard Stemmer und Markus D\u00f6rre stammen aus dem Personas-Handout, Sandra K\u00f6hler f\u00e4hrt im Cockpit die Tour R-F1 in R\u00fcthen. Hildegard Stemmer steht hier mit Pflegegrad 3 wie im Cockpit; das Handout nennt Pflegegrad 2 und Alter 79 statt 82 \u2014 der Widerspruch ist offen. Die Mutter von Markus D\u00f6rre hat in keiner Unterlage einen Vornamen, daher \u201eFrau D\u00f6rre\u201c." },

    { page: "kundenportal", sel: ".zeiten", idx: 0, wert: "Erreichbarkeitszeiten", kat: "basis", ud: "betrieb",
      dok: BD, seite: "5", absch: "C.3 Schichtmodell", stand: "Sprint 1", guete: "A",
      hinweis: "Fr\u00fchdienst 6\u201314, Sp\u00e4tdienst 14\u201322, kein Nachtdienst, Wochenende \u00fcber rotierende Bereitschaft. Die Pflegezeit 6\u201322 Uhr folgt daraus direkt. B\u00fcrozeiten und Rufbereitschaft sind erg\u00e4nzt und in keiner Unterlage belegt." },

    { page: "kundenportal", sel: ".stufen", idx: 0, wert: "Mitgliedsstufen", kat: "basis", ud: "mitglieder",
      dok: BD, seite: "3, 5", absch: "B \u00b7 Mitgliedschaftsmodell", stand: "Sprint 1", guete: "A",
      hinweis: "Basis 48 \u20ac \u00b7 Aktiv 120 \u20ac \u00b7 Premium 360 \u20ac im Jahr, nie \u201eFamilie\u201c. Das Portal selbst ist eine Leistung ab Aktiv (Angeh\u00f6rigen-App), Premium enth\u00e4lt zus\u00e4tzlich festen Ansprechpartner und Hausnotruf \u2014 daher tr\u00e4gt Hildegard Stemmer Premium, Markus D\u00f6rre Aktiv." },

    { page: "kundenportal", sel: ".brett", idx: 0, wert: "Nachbarschaftsbrett", kat: "synth", ud: "betrieb", todo: "kundenportal",
      dok: "\u2014 Muster aus dem App-Prototyp \u00fcbernommen", seite: "\u2014", absch: "\u2014", stand: "07.08.2026", guete: "D",
      hinweis: "Kategorien und Aufbau stammen aus dem Brett des App-Prototyps (Veranstaltung, Kurs, Angebot, Nachbarschaft). Die vier Eintr\u00e4ge sind erfunden, kn\u00fcpfen aber an belegte Angebote an: Begegnungsorte und Angeh\u00f6rigen-Caf\u00e9 stehen im Steckbrief Teil 1, der Pflegekurs f\u00fcr Angeh\u00f6rige ist eine Aktiv-Leistung." },

    { page: "kundenportal", sel: ".rechnung", idx: 1, wert: "Selbstzahler-Stundens\u00e4tze", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A.4 Selbstzahler-Stundensatz", stand: "Sprint 1", guete: "A",
      hinweis: "38 \u20ac je Stunde Hilfskraft, 52 \u20ac je Stunde examinierte Fachkraft. Der Rabatt von 10 % auf Entlastungsleistungen ab Stufe Aktiv steht im Mitgliedschaftsmodell, Teil B." },

    /* --- Kunden-App --- */
    { page: "kunden-app", sel: ".naechst", idx: 0, wert: "Kunden-App \u2014 Beispielverl\u00e4ufe", kat: "synth", ud: "betrieb", todo: "kunden-app",
      dok: "\u2014 erzeugt f\u00fcr die Simulation", seite: "\u2014", absch: "\u2014", stand: "08.08.2026", guete: "D",
      hinweis: "Termine, Dokumente, Rechnungsbetr\u00e4ge und R\u00fcckfragen sind erfunden \u2014 inhaltsgleich mit dem Kundenportal, damit beide Kan\u00e4le dieselbe Geschichte erz\u00e4hlen. Die Personen sind belegt: Hildegard Stemmer und Markus D\u00f6rre aus dem Personas-Handout, Sandra K\u00f6hler und Jana Brinkmann aus den Tourdaten des Cockpits. Damit f\u00fchrt die Kunden-App keinen eigenen Namensraum mehr, anders als der SwiftUI-Prototyp (Vossenkuhl, Koch, Meier)." },

    { page: "kunden-app", sel: ".stufe", idx: 0, wert: "Mitgliedsstufen in der App", kat: "basis", ud: "mitglieder",
      dok: BD, seite: "3, 5", absch: "B \u00b7 Mitgliedschaftsmodell", stand: "Sprint 1", guete: "A",
      hinweis: "Basis 48 \u20ac \u00b7 Aktiv 120 \u20ac \u00b7 Premium 360 \u20ac im Jahr, nie \u201eFamilie\u201c. Identisch zum Kundenportal." },

    /* --- App-Prototyp --- */
    { page: "app", sel: ".buehne", idx: 0, wert: "LebensZeit OS \u2014 Prototyp", kat: "synth", ud: "betrieb", todo: "app",
      dok: "\u2014 eigenst\u00e4ndige Entwicklung, keine Sprint-Unterlage", seite: "\u2014", absch: "\u2014", stand: "07.08.2026", guete: "D",
      hinweis: "Portierung einer SwiftUI-App als einzelne Webseite. Alle darin gezeigten Personen, Termine, Medikamente und Fahrten sind erzeugt. Die Rollennamen decken sich nicht mit den \u00fcbrigen Best\u00e4nden: Sandra Meier, Marlene Vossenkuhl und Sabine Koch tauchen weder im Personalstamm des Cockpits noch im Personas-Handout auf \u2014 nur Dr. Maria Holthaus stimmt \u00fcberein." },

    { page: "app", sel: "section", idx: 1, wert: "Digitalisierungsl\u00fccke Angeh\u00f6rigen-App", kat: "basis", ud: "betrieb",
      dok: BD, seite: "5", absch: "C.2 Software-Stack", stand: "Sprint 1", guete: "A",
      hinweis: "Der Steckbrief f\u00fchrt \u201eAngeh\u00f6rigen-Kommunikation: keine App\u201c als geplante L\u00fccke und Differenzierungspotenzial. Der Prototyp bearbeitet genau diese Zeile. Die Tourenplanung, laut selbem Abschnitt die gr\u00f6\u00dfte L\u00fccke, ist darin ebenfalls angelegt." },

    { page: "app", sel: ".hinweis", idx: 0, wert: "Farbsystem der App", kat: "cd", ud: "cd",
      dok: "Projektspeicher \u00b7 Team-Festlegung", seite: "\u2014", absch: "Corporate Design", stand: "07.08.2026", guete: "S",
      hinweis: "Die App bringt eigene Tokens aus Theme.swift mit; sechs Namen sind bei uns belegt und tragen andere Werte (--text, --status-ok, --status-warn, --status-info, --tint-ok, --font-mono). Der Rahmen trennt beide Systeme. Markenwerte stimmen bereits \u00fcberein (Gr\u00fcn, Mint, Salbei, Wald); angeglichen wurde nur die Logofarbe auf hellem Grund von #3D5936 auf #4A6741." },

    /* --- Bisher unbelegte Zahlen auf oeffentlichen Seiten (Pruefung 07.08.2026) --- */
    { page: "leistungen", sel: ".svc-pay", idx: 2, wert: "Entlastungsbetrag 131 \u20ac monatlich", kat: "amt", ud: "kennzahlen", todo: "leistungen",
      dok: "\u2014 in keiner Sprint-Unterlage genannt", seite: "\u2014", absch: "\u2014", stand: "\u2014", guete: "D",
      extern: "SGB XI \u00a745b \u00b7 Entlastungsbetrag",
      hinweis: "Widerspruch im eigenen Material: das Personas-Handout rechnet Markus D\u00f6rre 125 \u20ac im Monat entgangenen Entlastungsbetrag vor, die Website nennt 131 \u20ac. Der Steckbrief nennt \u00a745b nur als Leistungsart und mit 0,10 Mio. \u20ac Jahresumsatz, keinen Monatsbetrag. Die \u00fcbrigen SGB-XI-Werte der Website stehen laut Markt- und Wettbewerbsanalyse auf Stand 2024 \u2014 vor dem Pitch auf ein Jahr festlegen und belegen." },

    { page: "karriere", sel: ".card", idx: 3, wert: "56 Mitarbeitende und 45 Ehrenamtliche", kat: "basis", ud: "team",
      dok: BD, seite: "7, 2", absch: "F \u00b7 Personalstruktur \u00b7 Kennzahlenblock", stand: "Sprint 1", guete: "A",
      hinweis: "56 besetzt bei Soll 64, davon 25 examiniert und 6 Azubis; 45 Ehrenamtliche. Beide Zahlen stehen so im Steckbrief. Die 8 offenen Stellen sind hier bewusst nicht genannt \u2014 auf der Karriereseite w\u00e4re die Vakanz das Angebot, nicht die Kennzahl." },

    { page: "aktuelles", sel: ".card", idx: 3, wert: "45 Ehrenamtliche", kat: "basis", ud: "team",
      dok: BD, seite: "2, 7", absch: "Kennzahlenblock \u00b7 F Personalstruktur", stand: "Sprint 1", guete: "A",
      hinweis: "Kopfzahl belegt. Die im Beitrag genannten Personen und Portraits sind erfunden \u2014 Website-Erz\u00e4hlung, kein Faktenfehler." },

    /* --- Corporate Design (Projektspeicher, gilt auf allen Seiten) --- */
    { page: "*", sel: ".logo-lockup", idx: 0, wert: "Logo, Wortmarke & Farbregel", kat: "cd", ud: "cd",
      dok: "Projektspeicher \u00b7 Team-Festlegung", seite: "\u2014", absch: "Corporate Design", stand: "laufend", guete: "S",
      hinweis: "Pentagon-Netz als SVG (nie als JPEG/PNG), Wortmarke in Georgia. Das Logo erscheint nie in Wei\u00df \u2014 die Farbe folgt dem Hintergrund: var(--green, #4A6741) auf hell, var(--mint, #A8C9A0) auf Dunkelgr\u00fcn, var(--sage, #8AAC85) im Dark Mode, var(--forest, #5A6E52) auf Beige. Logo und Claims sind in LebensZeit_Logo.pdf S. 1 abgebildet; die Farb- und Verwendungsregeln stehen in keiner Unterlage." },
    { page: "*", sel: "header.site", idx: 0, wert: "Typografie & Farbpalette", kat: "cd", ud: "cd",
      dok: "Projektspeicher \u00b7 Team-Festlegung", seite: "\u2014", absch: "Corporate Design", stand: "laufend", guete: "S",
      hinweis: "Cormorant Garamond f\u00fcr \u00dcberschriften, Jost f\u00fcr Text. Palette: Creme var(--cream, #F5F0E8) \u00b7 Gr\u00fcn var(--green, #4A6741) \u00b7 Dunkelgr\u00fcn var(--green3, #2C3D27) \u00b7 Mint var(--mint, #A8C9A0) \u00b7 Salbei var(--sage, #8AAC85) \u00b7 Amber var(--amber, #B07A2A) \u00b7 Rot var(--red, #8C3A2A). Keine Unterlage nennt Schriftschnitte oder Hexwerte." },
    { page: "*", sel: "footer.site", idx: 0, wert: "Sprach- & Darstellungsregeln", kat: "cd", ud: "cd",
      dok: "Projektspeicher \u00b7 Team-Festlegung", seite: "\u2014", absch: "Corporate Design", stand: "laufend", guete: "S",
      hinweis: "Strikt ambulant (nie station\u00e4r) \u00b7 Nachbarschaft (nicht Quartier) \u00b7 Stufen Basis/Aktiv/Premium (nie Familie) \u00b7 Pflegeumsatz und F\u00f6rdermittel immer getrennt ausweisen. Teamkonvention \u2014 in den Unterlagen nicht als Regel dokumentiert; die Stufenbezeichnung Familie taucht dort sogar irrt\u00fcmlich auf." },

    /* --- Startseite: Vertrauensleiste (bereinigt, alle Werte belegt) --- */
    { page: "index", sel: ".trust-item", idx: 0, wert: "6\u201322 Uhr \u00b7 Fr\u00fch- & Sp\u00e4tdienst", kat: "basis", ud: "betrieb",
      dok: BD, seite: "5", absch: "C.3 Schichtmodell", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Fr\u00fch- (6\u201314) und Sp\u00e4tdienst (14\u201322), kein Nachtdienst; Wochenende \u00fcber rotierende Bereitschaft. Ersetzt die fr\u00fchere Aussage 24/7." },
    { page: "index", sel: ".trust-item", idx: 1, wert: "180 betreute Pflegef\u00e4lle (PG 2\u20135)", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "6", absch: "D.1 Klientenstruktur nach Pflegegrad", stand: "Sprint 1", guete: "A",
      hinweis: "PG 2: 70 \u00b7 PG 3: 65 \u00b7 PG 4: 35 \u00b7 PG 5: 10. Ebenfalls im Kennzahlenblock S. 2, Abschnitt 1." },
    { page: "index", sel: ".trust-item", idx: 2, wert: "45 Ehrenamtliche", kat: "basis", ud: "team",
      dok: BD, seite: "2", absch: "1 \u00b7 Das Gesch\u00e4ftsmodell \u2014 einfach erkl\u00e4rt", stand: "Sprint 1", guete: "A",
      hinweis: "Kennzahlenblock; Personaldetail S. 7, Abschnitt F: Ehrenamtskoordination 1 Kopf f\u00fcr 45 Ehrenamtliche." },
    { page: "index", sel: ".trust-item", idx: 3, wert: "5 Standorte im Kreis Soest", kat: "basis", ud: "standorte",
      dok: BD, seite: "2", absch: "1 \u00b7 Das Gesch\u00e4ftsmodell \u2014 einfach erkl\u00e4rt", stand: "Sprint 1", guete: "A",
      hinweis: "Erwitte (Hauptsitz), Bad Sassendorf, Anr\u00f6chte, R\u00fcthen, Lippetal. Ersetzt die Kachel gGmbH \u2014 ein Wort im Zahlenraster (Audit-Befund 3.4); die Rechtsform steht weiterhin im Footer und unter \u00dcber uns." },

    /* --- Einzugsgebiet --- */
    { page: "einzugsgebiet", sel: ".kpi-item", idx: 0, wert: "5 Standorte", kat: "basis", ud: "standorte",
      dok: BD, seite: "2", absch: "1 \u00b7 Das Gesch\u00e4ftsmodell \u2014 einfach erkl\u00e4rt", stand: "Sprint 1", guete: "A",
      hinweis: "Erwitte (Hauptsitz), Bad Sassendorf, Anr\u00f6chte, R\u00fcthen, Lippetal." },
    { page: "einzugsgebiet", sel: ".kpi-item", idx: 1, wert: "60.900 Einwohner", kat: "amt", ud: "standorte",
      dok: BD, seite: "2", absch: "1 \u00b7 Kennzahlenblock", stand: "Sprint 1", guete: "B",
      extern: "Destatis Pflegestatistik \u00b7 IT.NRW \u00b7 Bertelsmann Stiftung 2023 (Quellenzeile " + IP + ", S. 4)",
      hinweis: "Aufteilung im Investorpitch S. 5: Erwitte ~16.200 \u00b7 Bad Sassendorf ~13.100 \u00b7 Anr\u00f6chte ~8.400 \u00b7 R\u00fcthen ~10.700 \u00b7 Lippetal Rest. Standortkarte nennt f\u00fcr Erwitte 16.300 \u2014 Abweichung offen.",
      todo: "einzugsgebiet" },
    { page: "einzugsgebiet", sel: ".kpi-item", idx: 2, wert: "180 Pflegef\u00e4lle", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "6", absch: "D.1 Klientenstruktur nach Pflegegrad", stand: "Sprint 1", guete: "A",
      hinweis: "Nur PG 2\u20135; PG 1 nur Beratung (~90) und nicht enthalten." },

    /* --- Investoren / Markt --- */
    { page: "investoren-markt", sel: ".kpi-item", idx: 0, wert: "~3,0 Mio \u20ac adressierbares Volumen", kat: "annahme", ud: "annahmen",
      dok: BD, seite: "7", absch: "3 \u00b7 Annahmen & Konsistenz-Hinweise, Punkt 3", stand: "Sprint 1", guete: "C",
      hinweis: "Das Dokument markiert die Zahl selbst als bekannte Schwachstelle: passt nicht zu 3.995 Pflegebed\u00fcrftigen \u00d7 Sachleistung. Saubere Definition vor dem n\u00e4chsten Sprint festklopfen.",
      todo: "investoren-markt" },
    { page: "investoren-markt", sel: ".kpi-item", idx: 1, wert: "~3.995 Pflegebed\u00fcrftige", kat: "amt", ud: "kennzahlen",
      dok: IP, seite: "5", absch: "Baustein 1 \u00b7 Regionalmarkt Kreis Soest", stand: "Sprint 1", guete: "B",
      extern: "Destatis Pflegestatistik \u00b7 IT.NRW (Quellenzeile S. 4)",
      hinweis: "Bezugsgr\u00f6\u00dfe der Penetrationsrate 4,5 % (180 von ~3.995)." },
    { page: "investoren-markt", sel: ".kpi-item", idx: 2, wert: "60.900 Einwohner", kat: "amt",
      dok: IP, seite: "5", absch: "Baustein 1 \u00b7 Regionalmarkt Kreis Soest", stand: "Sprint 1", guete: "B",
      extern: "Destatis \u00b7 IT.NRW \u00b7 Bertelsmann Stiftung 2023 (Quellenzeile S. 4)",
      hinweis: "Muss mit dem Einzugsgebiet und der Standortkarte konsistent bleiben.",
      todo: "einzugsgebiet" },
    { page: "investoren-markt", sel: ".kpi-item", idx: 3, wert: "+4\u20135 % Marktwachstum p. a.", kat: "amt", ud: "kennzahlen",
      dok: IP, seite: "4", absch: "Baustein 1 \u00b7 Makromarkt, Kachel MARKTWACHSTUM P. A.", stand: "Sprint 1", guete: "B",
      extern: "Destatis Pflegestatistik \u00b7 IT.NRW \u00b7 Bertelsmann Stiftung 2023 (Sammelquelle der Seite)",
      hinweis: "Begr\u00fcndung im Dokument: Babyboomer erreichen ab 2030 das Hochpflegealter. Einzelnachweis je Zahl fehlt \u2014 f\u00fcr das Q&A nachtragen." },

    /* --- Investoren: Uebersicht --- */
    { page: "investoren", sel: ".kpi-item", idx: 0, wert: "2,1 Mio \u20ac Jahresumsatz", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A.1 Umsatz-Split", stand: "Sprint 1", guete: "A",
      hinweis: "Enthaelt 38 % Foerdermittel (Pflegeumsatz 1,15 Mio \u20ac). Der Vergleichswert Branche \u00d8 1,5 Mio \u20ac ist belegt: SWOT-Analyse S. 2, Wortlaut 2,1 Mio \u20ac Jahresumsatz \u2014 leicht ueber Branchenschnitt (\u00d8 1,5 Mio \u20ac)." },
    { page: "investoren", sel: ".kpi-item", idx: 1, wert: "4,5 % Marktpenetration", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "2", absch: "1 \u00b7 Kennzahlenblock", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: 180 betreute Pflegefaelle (~4,5 % Penetration). Auch Investorpitch S. 3." },
    { page: "investoren", sel: ".kpi-item", idx: 2, wert: "5 Standorte", kat: "basis", ud: "standorte",
      dok: BD, seite: "2", absch: "1 \u00b7 Das Gesch\u00e4ftsmodell", stand: "Sprint 1", guete: "A",
      hinweis: "Der Zusatz Wettbewerber-Durchschnitt 1\u20132 stammt aus der Wettbewerbsmatrix (10 Anbieter im Benchmark)." },
    { page: "investoren", sel: ".kpi-item", idx: 3, wert: "62 % Eigenfinanzierung (Ziel 70 %)", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A.1 Umsatz-Split", stand: "Sprint 1", guete: "A",
      hinweis: "Ist-Wert belegt; Ziel 70 % dreifach belegt (2_Sprint_Unterlagen S. 3, Investorpitch S. 3, Basisdaten). Kein Dokument nennt eine Jahreszahl fuer das Ziel." },

    /* --- Investoren: Kennzahlen --- */
    { page: "investoren-kennzahlen", sel: ".kpi-item", idx: 0, wert: "2,1 Mio \u20ac Jahresumsatz", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A.1 Umsatz-Split", stand: "Sprint 1", guete: "A",
      hinweis: "Pflegeumsatz 1,15 Mio \u20ac und Foerdermittel sind getrennt auszuweisen (Basisdaten S. 7, Abschnitt 3)." },
    { page: "investoren-kennzahlen", sel: ".kpi-item", idx: 1, wert: "180 aktiv betreute Pflegefaelle", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "6", absch: "D.1 Klientenstruktur nach Pflegegrad", stand: "Sprint 1", guete: "A",
      hinweis: "PG 2: 70 \u00b7 PG 3: 65 \u00b7 PG 4: 35 \u00b7 PG 5: 10." },
    { page: "investoren-kennzahlen", sel: ".kpi-item", idx: 2, wert: "~11.700 \u20ac Umsatz je Pflegefall", kat: "basis", ud: "annahmen",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "2", absch: "Das Unternehmen im \u00dcberblick", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: 180 Personen (~11.700 \u20ac Umsatz je Fall p. a. \u2014 im Normbereich). Methodisch heikel: Das ist Gesamtumsatz inklusive 38 % Foerdermittel geteilt durch Pflegefaelle. Rein aus Pflegeumsatz (1,15 Mio \u20ac) waeren es ~6.400 \u20ac. Im Q&A angreifbar.",
      todo: "investoren-kennzahlen" },
    { page: "investoren-kennzahlen", sel: ".kpi-item", idx: 3, wert: "101 Team inkl. Ehrenamt", kat: "basis", ud: "team",
      dok: IP, seite: "3", absch: "Kennzahlenblock TEAM", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: TEAM 101 \u2014 34 Festangestellte, 22 Teilzeit, 45 Ehrenamtliche als Alleinstellungsmerkmal. Also 56 Beschaeftigte plus 45 Ehrenamtliche; die Zahl ist keine Beschaeftigtenzahl. Achtung: dieselbe Seite nennt die Stufe faelschlich Familie statt Premium." },

    /* --- Investoren: Markt (Makro-Tabelle + Five Forces) --- */
    { page: "investoren-markt", sel: ".bench", idx: 0, wert: "Makromarkt-Tabelle (D/NRW)", kat: "amt", ud: "kennzahlen",
      dok: IP, seite: "4", absch: "Baustein 1 \u00b7 Makromarkt", stand: "Sprint 1", guete: "B",
      extern: "Destatis Pflegestatistik \u00b7 IT.NRW \u00b7 Bertelsmann Stiftung 2023",
      hinweis: "Belegt: Pflegebeduerftige 5,0 Mio, Prognose 2040 6,8 Mio, ~15.400 Dienste / ~3.100 in NRW, Gesamtmarkt ~44 Mrd \u20ac, ambulant ~14 Mrd \u20ac (auch SWOT S. 2). NICHT belegt: die Zeile ambulante Dienste ~1,75 Mio (~35 %) \u2014 auf der Seite mit Destatis 2021 angegeben, in keiner Sprint-Unterlage enthalten.",
      todo: "investoren-markt" },
    { page: "investoren-markt", sel: ".bench", idx: 1, wert: "Porter's Five Forces", kat: "basis", ud: "kennzahlen",
      dok: IP, seite: "9", absch: "Baustein 2 \u00b7 Five Forces \u00dcbersicht", stand: "Sprint 1", guete: "A",
      hinweis: "Originalwerte: Lieferantenmacht 4/5 \u00b7 Substitute 3/5 \u00b7 Wettbewerbsintensitaet 3/5 \u00b7 Neue Wettbewerber 2/5 \u00b7 Kundenmacht 2/5. Substitute und Wettbewerbsintensitaet zusaetzlich auf S. 11 bestaetigt. Skala 1 (gering) bis 5 (sehr hoch)." },

    /* --- Investoren: Finanzierung --- */
    { page: "investoren-finanzierung", sel: ".bench", idx: 1, wert: "Zielwerte der Finanzierungslogik", kat: "ziel", ud: "annahmen",
      dok: BD, seite: "4", absch: "A.1 Umsatz-Split (Ausgangswerte)", stand: "Sprint 1", guete: "C",
      hinweis: "Ausgangswerte belegt (62 % Eigenfinanzierung, 38 % Foerderanteil). Die Zielformulierungen sind abgeleitet: 70 %+ ist belegt, die Jahreszahl 2027 in keiner Unterlage; Foerderanteil unter 30 % ist als Richtung plausibel (SWOT S. 2 nennt Branche 20\u201325 %), aber nicht als Ziel dokumentiert. Belegt hingegen: 8 Stellen bis Q4 2026 besetzt (SWOT S. 6, Saeule 03).",
      todo: "investoren-finanzierung" },

    /* --- Investoren: Kennzahlen (Haupttext) --- */
    { page: "investoren-kennzahlen", sel: ".bench", idx: 0, wert: "Benchmark gegen den Branchenschnitt", kat: "basis", ud: "kennzahlen",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "2", absch: "Das Unternehmen im \u00dcberblick \u00b7 KPI-Benchmark", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt: 2,1 Mio \u20ac gegen Branchenschnitt \u00d8 1,5 Mio \u20ac \u00b7 5 Standorte gegen Wettbewerber \u00d8 1\u20132 \u00b7 62 % Eigenfinanzierung \u00b7 Foerderanteil 38 % gegen Branche 20\u201325 %. Grundlage ist die Markt- und Wettbewerbsanalyse mit 10 Anbietern im Benchmark." },
    { page: "investoren-kennzahlen", sel: ".rev", idx: 0, wert: "Umsatzstruktur 55 / 38 / 5 / 2 %", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A.1 Umsatz-Split", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt Zeile fuer Zeile: Pflegeleistungen SGB XI + V 1,15 Mio \u20ac = 55 % \u00b7 Foerdermittel 38 % \u00b7 Entlastungs-/Selbstzahlerleistungen \u00a745b 0,10 Mio \u20ac = 5 % \u00b7 Mitgliedsbeitraege 2 % (52.800 \u20ac, S. 5 Abschnitt B)." },
    { page: "investoren-kennzahlen", sel: ".rev-note", idx: 0, wert: "Strategische Lesart 62 % / 38 %", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A.1 Umsatz-Split", stand: "Sprint 1", guete: "A",
      hinweis: "62 % eigenfinanziert belegt; Einordnung Foerderanteil deutlich ueber Branche aus SWOT S. 2 (Branche \u00d8 20\u201325 %, dort als kritisch hoch bewertet). Basisdaten S. 6 enthaelt zusaetzlich ein Stress-Szenario 38 % auf 20 %." },

    /* --- Investoren: Markt (Haupttext) --- */
    { page: "investoren-markt", sel: ".section-head", idx: 2, wert: "Wettbewerbsumfeld (Caritas, Diakonie, DRK, AWO, Johanniter)", kat: "basis", ud: "standorte",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "3", absch: "Gegen wen \u2014 Wettbewerbsabgrenzung", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Caritas / Diakonie / DRK (nur 1\u20132 Standorte). Der Benchmark umfasst 10 Wettbewerber (SWOT S. 2); AWO und Johanniter stehen in der Wettbewerbsmatrix der Markt- und Wettbewerbsanalyse." },
    { page: "investoren-markt", sel: ".card", idx: 0, wert: "22,8 % \u2192 ~30 % Anteil 65+ bis 2040", kat: "amt", ud: "standorte",
      dok: IP, seite: "4", absch: "Baustein 1 \u00b7 Regionaler Faktor", stand: "Sprint 1", guete: "B",
      extern: "IT.NRW \u00b7 Destatis \u00b7 Bertelsmann Stiftung 2023",
      hinweis: "Wortlaut: Kreis Soest altert ueberdurchschnittlich \u2014 Anteil 65+ steigt von ~22,8 % auf ~30 % bis 2040, bei leicht sinkender Gesamtbevoelkerung." },
    { page: "investoren-markt", sel: ".card", idx: 1, wert: "4,5 % Penetration (180 von ~3.995)", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "2", absch: "1 \u00b7 Kennzahlenblock", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt. Die Lesart Kapazitaets- statt Nachfrageproblem stuetzt sich auf Investorpitch S. 3 und S. 12 (8 offene Stellen blockieren Wachstum bei 4,5 % Penetration)." },
    { page: "investoren-markt", sel: ".card", idx: 2, wert: "Zeitfenster bis 2028", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "5", absch: "Empfehlung \u00b7 Warum jetzt", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: jetzt, weil das Zeitfenster bis 2028 offen ist und die Digitalfoerderung ausläuft; Plattformen werden ab 2028 relevant (S. 4)." },
    { page: "investoren-markt", sel: ".card", idx: 3, wert: "5 Standorte gegen \u00d8 1\u20132", kat: "basis", ud: "standorte",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "2", absch: "Ausgangspunkt \u2014 worauf wir aufbauen", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: 5 vernetzte Standorte (Wettbewerber \u00d8 1\u20132), 520 Foerdermitglieder und 45 Ehrenamtliche. Auch SWOT S. 2." },
    { page: "investoren-markt", sel: ".card", idx: 4, wert: "45 Ehrenamtliche als Alleinstellung", kat: "basis", ud: "team",
      dok: IP, seite: "3", absch: "Kennzahlenblock TEAM", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: 45 Ehrenamtliche als Alleinstellungsmerkmal. Kostenvorteil und Bindung sind Interpretation des Teams, keine Kennzahl." },
    { page: "investoren-markt", sel: ".card", idx: 5, wert: "520 Mitglieder \u00b7 Basis / Aktiv / Premium", kat: "basis", ud: "mitgliedschaft",
      dok: BD, seite: "5", absch: "B \u00b7 Mitgliedschaftsmodell", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt inkl. Aufteilung 300 / 170 / 50. Achtung: Investorpitch S. 3 und SWOT S. 2 nennen die dritte Stufe faelschlich Familie \u2014 verbindlich ist Premium." },
    { page: "investoren-markt", sel: ".rev-note", idx: 0, wert: "Herleitung des adressierbaren Volumens", kat: "annahme", ud: "annahmen",
      dok: BD, seite: "7", absch: "3 \u00b7 Annahmen & Konsistenz-Hinweise, Punkt 3", stand: "Sprint 1", guete: "C",
      hinweis: "Die Herleitung (3.995 Pflegebeduerftige bei ~40 % Ausschoepfung) steht so auf der Seite; das Basisdokument markiert genau diese Rechnung als bekannte Schwachstelle. Vor dem Pitch sauber definieren.",
      todo: "investoren-markt" },

    /* --- Investoren: SWOT --- */
    { page: "investoren-swot", sel: ".swot-q", idx: 0, wert: "Staerken", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "3", absch: "2 \u00b7 Die SWOT-Matrix auf einen Blick", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt: einzige flaechendeckende Versorgung (5 Standorte, Wettbewerb \u00d8 1\u20132), hohes Vertrauen, Gemeinschaft aus 520 Mitgliedern und 45 Ehrenamtlichen." },
    { page: "investoren-swot", sel: ".swot-q", idx: 1, wert: "Schwaechen", kat: "basis", ud: "kennzahlen",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "3", absch: "2 \u00b7 Die SWOT-Matrix auf einen Blick", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt: Foerderabhaengigkeit 38 % gegen Branche 20\u201325 %, zwei defizitaere Standorte (Ruethen \u221238 k\u20ac, Lippetal \u221230 k\u20ac), 8 offene Stellen seit ueber 6 Monaten, geringer Digitalisierungsgrad." },
    { page: "investoren-swot", sel: ".swot-q", idx: 2, wert: "Chancen", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "3", absch: "2 \u00b7 Die SWOT-Matrix auf einen Blick", stand: "Sprint 1", guete: "A",
      hinweis: "Demografie 65+ auf ~30 % bis 2040 belegt (Investorpitch S. 4). Die Angehoerigen-App als Marktluecke im Kreis Soest ist Einschaetzung des Teams, keine Marktstudie." },
    { page: "investoren-swot", sel: ".swot-q", idx: 3, wert: "Risiken", kat: "basis", ud: "annahmen",
      dok: IP, seite: "4", absch: "Baustein 1 \u00b7 Fachkraefteluecke", stand: "Sprint 1", guete: "B",
      extern: "Destatis \u00b7 Branchenschaetzung",
      hinweis: "Belegt: ~200.000 offene Pflegestellen bundesweit (auch S. 10). Graumarkt verdraengt Stundenpflege bei PG 3\u20135 (Investorpitch S. 9, Substitute 3/5); Plattformen ab 2028." },
    { page: "investoren-swot", sel: ".bench", idx: 0, wert: "Priorisierung der Faktoren", kat: "basis", ud: "annahmen",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "4", absch: "3 \u00b7 Bewertung der kritischen Faktoren", stand: "Sprint 1", guete: "A",
      hinweis: "Priorisierung nach strategischer Hebelwirkung, abgestuetzt auf Five Forces (Lieferantenmacht 4/5 als hoechste Bedrohung) und KPI-Benchmark. TOWS-Kombinationen auf S. 5." },
    { page: "investoren-swot", sel: ".card", idx: 0, wert: "Saeule 01 \u00b7 Wirtschaftliche Unabhaengigkeit", kat: "ziel", ud: "annahmen",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "6", absch: "5 \u00b7 Strategische Stossrichtung & Fazit", stand: "Sprint 1", guete: "C",
      hinweis: "Ziel 70 %+ und der Weg ueber Selbstzahlerpakete (PG 1\u20132) sind belegt \u2014 die Jahreszahl 2027 nennt keine Unterlage.",
      todo: "investoren-finanzierung" },
    { page: "investoren-swot", sel: ".card", idx: 1, wert: "Saeule 02 \u00b7 Digitalisierung als Hebel", kat: "basis", ud: "betrieb",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "6", absch: "5 \u00b7 Strategische Stossrichtung & Fazit", stand: "Sprint 1", guete: "A",
      hinweis: "Drei Massnahmen in 18 Monaten: Pflegedokumentation, Angehoerigen-Plattform, digitales Recruiting. Wirkung \u221220 % Verwaltungszeit aus Investorpitch S. 12." },
    { page: "investoren-swot", sel: ".card", idx: 2, wert: "Saeule 03 \u00b7 Personal & Standortstabilitaet", kat: "basis", ud: "team",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "6", absch: "5 \u00b7 Strategische Stossrichtung & Fazit", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: 8 Stellen bis Q4 2026 besetzt, Ruethen und Lippetal kostendeckend in 18\u201324 Monaten (auch S. 4 und Baustein 1 S. 5)." },

    /* --- Investoren: Finanzierung (Haupttext) --- */
    { page: "investoren-finanzierung", sel: ".bench", idx: 0, wert: "Mittelverwendung (Betraege offen)", kat: "annahme", ud: "annahmen",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "6", absch: "5 \u00b7 Strategische Stossrichtung \u00b7 drei Saeulen", stand: "Sprint 1", guete: "C",
      hinweis: "Die Verwendungszwecke folgen den drei Saeulen und sind belegt; die Eurobetraege sind bewusst offengelassen und in keiner Unterlage bezifffert. Vor dem Investorengespraech quantifizieren.",
      todo: "investoren-finanzierung" },
    { page: "investoren-finanzierung", sel: ".card", idx: 0, wert: "Foerderabhaengigkeit senken", kat: "ziel", ud: "kennzahlen",
      dok: BD, seite: "6", absch: "E \u00b7 Foerdermittel-Detail (Stress-Szenario)", stand: "Sprint 1", guete: "C",
      hinweis: "Belegt ist das Stress-Szenario Foerderanteil 38 % auf 20 % (senkt die Foerderung von 0,80 auf ~0,42 Mio \u20ac) sowie der Branchenwert 20\u201325 % (SWOT S. 2). Die Zielformulierung strukturell unter 30 % steht so in keiner Unterlage." },
    { page: "investoren-finanzierung", sel: ".card", idx: 1, wert: "Personalengpass \u00b7 Time-to-hire halbieren", kat: "basis", ud: "team",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "5", absch: "4 \u00b7 SWOT-Kombinationsstrategien (TOWS)", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Digitales Recruiting \u2014 Time-to-hire halbieren, 8 offene Stellen. Bezug 200.000 offene Stellen bundesweit (Investorpitch S. 4)." },
    { page: "investoren-finanzierung", sel: ".card", idx: 2, wert: "Standortdefizite \u00b7 ~20 % weniger Verwaltungszeit", kat: "basis", ud: "betrieb",
      dok: IP, seite: "12", absch: "Claudes Kritik \u00b7 Investitionssaeule Nr. 1", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Pflegedokumentation 2026 (\u221220 % Verwaltungszeit). Kostendeckung Ruethen und Lippetal in 18\u201324 Monaten belegt (SWOT S. 4, Baustein 1 S. 5)." },

    /* --- Mitgliedschaft --- */
    { page: "mitgliedschaft", sel: ".tier", idx: 0, wert: "Basis / F\u00f6rder 48 \u20ac/Jahr", kat: "basis", ud: "mitgliedschaft",
      dok: BD, seite: "3", absch: "Was bieten die Mitgliedschaften? (520 Mitglieder)", stand: "Sprint 1", guete: "A",
      hinweis: "Leistung: Newsletter, Begegnungsort-Events, kostenlose Erstberatung. Mitgliederzahl 300 belegt in S. 5, Abschnitt B (Tabelle: 300 \u00b7 14.400 \u20ac)." },
    { page: "mitgliedschaft", sel: ".tier", idx: 1, wert: "Aktiv 120 \u20ac/Jahr", kat: "basis", ud: "mitgliedschaft",
      dok: BD, seite: "3", absch: "Was bieten die Mitgliedschaften? (520 Mitglieder)", stand: "Sprint 1", guete: "A",
      hinweis: "Leistung: priorisierte Beratung, Angeh\u00f6rigen-App, 10 % auf Entlastungsleistungen, freie Kurse. Mitgliederzahl 170 belegt in S. 5, Abschnitt B (170 \u00b7 20.400 \u20ac)." },
    { page: "mitgliedschaft", sel: ".tier", idx: 2, wert: "Premium 360 \u20ac/Jahr", kat: "basis", ud: "mitgliedschaft",
      dok: BD, seite: "3", absch: "Was bieten die Mitgliedschaften? (520 Mitglieder)", stand: "Sprint 1", guete: "A",
      hinweis: "Leistung: garantierte Versorgungskapazit\u00e4t, fester Ansprechpartner, Hausnotruf inkl., volle App. Mitgliederzahl 50 belegt in S. 5, Abschnitt B (50 \u00b7 18.000 \u20ac); Summe 520 \u00b7 52.800 \u20ac." },

    /* --- \u00dcber uns: Kennzahlen --- */
    { page: "ueber-uns", sel: ".stat-box", idx: 0, wert: "56 Mitarbeitende", kat: "basis", ud: "team",
      dok: BD, seite: "7", absch: "F \u00b7 Personalstruktur (Detail)", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Summe besetzt 56, Soll 64 \u2192 8 offene Fachkraftstellen. 34 Vollzeit + 22 Teilzeit, ~45 FTE." },
    { page: "ueber-uns", sel: ".stat-box", idx: 1, wert: "25 examinierte Pflegekr\u00e4fte", kat: "basis", ud: "team",
      dok: BD, seite: "7", absch: "F \u00b7 Personalstruktur (Detail)", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Examinierte gesamt 25 \u2014 20 in der ambulanten Pflege plus 5 Standort-/Pflegedienstleitungen. Harte Nebenbedingung f\u00fcr \u00a737.3." },
    { page: "ueber-uns", sel: ".stat-box", idx: 2, wert: "45 Ehrenamtliche", kat: "basis", ud: "team",
      dok: BD, seite: "2", absch: "1 \u00b7 Kennzahlenblock", stand: "Sprint 1", guete: "A",
      hinweis: "Koordination durch 1 Stelle (S. 7, Abschnitt F); teilweise \u00a745c/d-f\u00f6rderrelevant." },
    { page: "ueber-uns", sel: ".stat-box", idx: 3, wert: "6 Auszubildende", kat: "basis", ud: "team",
      dok: BD, seite: "7", absch: "F \u00b7 Personalstruktur (Detail)", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: 6 Azubis (Kooperation Pflegeschulen Soest/Lippstadt)." },

    /* --- \u00dcber uns: Chronik --- */
    { page: "ueber-uns", sel: ".tl-item", idx: 0, wert: "2020 \u00b7 Gr\u00fcndung in Erwitte", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "2", absch: "Ausgangspunkt \u2014 worauf wir aufbauen", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: gGmbH, gegr\u00fcndet 2020, Sitz Erwitte. Dreifach belegt \u2014 auch Investorpitch S. 3 und SWOT-Analyse S. 2." },
    { page: "ueber-uns", sel: ".tl-item", idx: 1, wert: "2021\u20132022 \u00b7 Wachstum in die Fl\u00e4che", kat: "annahme", ud: "ueberblick",
      dok: "\u2014 keine Sprint-Unterlage", seite: "\u2014", absch: "\u2014", stand: "\u2014", guete: "D",
      hinweis: "Der Zwischenschritt ist in keiner Sprint-Unterlage dokumentiert \u2014 Website-Erz\u00e4hlung. F\u00fcr den Pitch belegen oder als Narrativ kennzeichnen." },
    { page: "ueber-uns", sel: ".tl-item", idx: 2, wert: "2023 \u00b7 Mitgliedschaftsmodell", kat: "annahme", ud: "mitgliedschaft",
      dok: BD, seite: "3", absch: "Was bieten die Mitgliedschaften? (520 Mitglieder)", stand: "Sprint 1", guete: "D",
      hinweis: "Die Staffel Basis/Aktiv/Premium ist belegt \u2014 das Einf\u00fchrungsjahr 2023 nicht. Jahreszuordnung ist Website-Erz\u00e4hlung." },
    { page: "ueber-uns", sel: ".tl-item", idx: 3, wert: "2024\u20132025 \u00b7 F\u00fcnf Standorte erreicht", kat: "basis", ud: "standorte",
      dok: BD, seite: "2", absch: "1 \u00b7 Das Gesch\u00e4ftsmodell \u2014 einfach erkl\u00e4rt", stand: "Sprint 1", guete: "A",
      hinweis: "Die Zahlen (5 Standorte, 520 Mitglieder, 180 F\u00e4lle) sind belegt; die Zuordnung zu 2024\u20132025 ist nicht dokumentiert." },
    { page: "ueber-uns", sel: ".tl-item", idx: 4, wert: "2026 \u00b7 Digitale Vernetzung", kat: "ziel", ud: "ueberblick",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "5", absch: "Empfehlung: C als Speerspitze, getragen von A + B", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt als strategische Sto\u00dfrichtung (Option C \u2014 sichtbarer Pflegepartner f\u00fcr Angeh\u00f6rige), nicht als erreichter Zustand. Digitalf\u00f6rderung l\u00e4uft 2027 aus." },

    /* --- \u00dcber uns: Leitbild, Werte, F\u00fchrung, Betrieb --- */
    { page: "ueber-uns", sel: ".lb-card", idx: 0, wert: "Purpose \u00b7 Warum", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "3", absch: "Mission \u2014 ein Satz, sichtbar im Pitch", stand: "Sprint 1", guete: "A",
      hinweis: "Originalwortlaut: Damit im l\u00e4ndlichen Kreis Soest niemand allein pflegen oder gepflegt werden muss. Die Website formuliert das um \u2014 Kernaussage deckungsgleich." },
    { page: "ueber-uns", sel: ".lb-card", idx: 1, wert: "Vision \u00b7 Wohin", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "6", absch: "5 \u00b7 Strategische Sto\u00dfrichtung & Fazit", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt \u2014 Originalwortlaut: Von der Nische zum Pflege-\u00d6kosystem im l\u00e4ndlichen NRW (2026\u20132031); LebensZeit wandelt sich vom vertrauensbasierten Nischenanbieter zum wirtschaftlich eigenst\u00e4ndigen, digital vernetzten Anbieter." },
    { page: "ueber-uns", sel: ".lb-card", idx: 2, wert: "Mission \u00b7 Wie", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "3", absch: "Unique Selling Point", stand: "Sprint 1", guete: "A",
      hinweis: "Deckt sich mit dem USP: wohnortnahe Pflege aus einer Hand, getragen von f\u00fcnf Standorten, 520 Mitgliedern und 45 Ehrenamtlichen." },
    { page: "ueber-uns", sel: ".value-box", idx: 0, wert: "Markenwert: nah", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "1", absch: "Schritt 1 Markenkern \u00b7 nah \u00b7 vernetzt \u00b7 nachhaltig", stand: "Sprint 1", guete: "A",
      hinweis: "Dieselbe Wertetriade auch im Logo, in der SWOT-Analyse S. 1 und im Investorpitch S. 3." },
    { page: "ueber-uns", sel: ".value-box", idx: 1, wert: "Markenwert: vernetzt", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "1", absch: "Schritt 1 Markenkern", stand: "Sprint 1", guete: "A",
      hinweis: "Verbindet Pflege, Ehrenamt und Mitgliedergemeinschaft \u2014 tr\u00e4gt Option C." },
    { page: "ueber-uns", sel: ".value-box", idx: 2, wert: "Markenwert: nachhaltig", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Baustein1_Markenkern_USP_Positionierung.pdf", seite: "1", absch: "Schritt 1 Markenkern", stand: "Sprint 1", guete: "A",
      hinweis: "Wirtschaftliche Seite: Eigenfinanzierung 62 % \u2192 Ziel 70 % (Basisdaten S. 4, A.1)." },
    { page: "ueber-uns", sel: ".lead-card", idx: 0, wert: "Dr. Maria Holthaus \u00b7 Gr\u00fcnderin & Gesch\u00e4ftsf\u00fchrung", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "2", absch: "Das Unternehmen im \u00dcberblick \u00b7 Rechtsform / F\u00fchrung", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: gGmbH (gemeinn\u00fctzig) \u00b7 Dr. Maria Holthaus (Gr\u00fcnderin & Gesch\u00e4ftsf\u00fchrerin). Auch Investorpitch S. 3." },
    { page: "ueber-uns", sel: ".two-col li", idx: 1, wert: "18 Fahrzeuge", kat: "basis", ud: "betrieb",
      dok: BD, seite: "5", absch: "C.1 Fahrzeugflotte", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: 18 Fahrzeuge (Leasing) \u2014 Erwitte 6, Bad Sassendorf 4, Anr\u00f6chte 3, R\u00fcthen 3, Lippetal 2; ~9.300 \u20ac/Fahrzeug/Jahr. L\u00e4ndliche Fahrzeiten = gr\u00f6\u00dfter Optimierungshebel." },

    /* --- Preise --- */
    { page: "preise", sel: "h1", idx: 0, wert: "Preis- und Eigenanteilsangaben", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A.4 Selbstzahler-Stundensatz", stand: "Sprint 1", guete: "A",
      extern: "Sachleistungsbetr\u00e4ge SGB XI \u00a736 / Entlastungsbetrag \u00a745b (Gesetz)",
      hinweis: "Belegt: 38 \u20ac/Std. Hilfskraft, 52 \u20ac/Std. examinierte Fachkraft; Sachleistungs-Caps je Pflegegrad auf S. 6, Abschnitt D.1 (761 / 1.432 / 1.778 / 2.200 \u20ac). Offen: Eigenanteil-Rechner und die 62 %\u219270 %-Br\u00fccke (Baustein 2).",
      todo: "preise" },

    { page: "prompt-tagebuch", sel: ".sx-log", idx: 0, wert: "Session-Log Sprint 1 (24 Eintraege)", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Prompt_Tagebuch_Gesamt.html (Teamdokument)", seite: "\u2014", absch: "Session-Log", stand: "18.04.\u201302.06.2026", guete: "A",
      hinweis: "Vollstaendig uebernommen: 24 Sessions mit Ziel, wortwoertlichem Prompt, Antwort, Ueberraschung, Fehlschlag, verbessertem Prompt, Ergebnis und Erkenntnis; 12 davon mit Claude als Kritiker. Feldstruktur folgt der Vorlage in Prompt_Tagebuch.pdf S. 1." },
    { page: "prompt-tagebuch", sel: ".reflect", idx: 0, wert: "Abschluss-Reflexion", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Prompt_Tagebuch_Gesamt.html (Teamdokument)", seite: "\u2014", absch: "Was uns Sprint 1 gelehrt hat", stand: "Sprint 1", guete: "A",
      hinweis: "Zusammengefuehrte Teamreflexion ohne Personenzuordnung. Kennzahl 24 Sessions und 12 Kritikereinsaetze direkt aus dem Log gezaehlt \u2014 fruehere Angabe 7 Sessions und 5 Kritikereinsaetze war ein veralteter Zwischenstand." },

    /* --- Preise: Tabellen --- */
    { page: "preise", sel: ".tbl-scroll", idx: 0, wert: "Leistungen & Kostentraeger", kat: "basis", ud: "leistungen",
      dok: BD, seite: "3", absch: "Welche Leistungen erbringt LebensZeit?", stand: "Sprint 1", guete: "A",
      extern: "SGB XI \u00a736 (Sachleistung) \u00b7 \u00a737.3 (Behandlungspflege) \u00b7 \u00a745b (Entlastungsbetrag)",
      hinweis: "Belegt: Grund- und Behandlungspflege als Kernumsatz, Hauswirtschaft und Entlastungsleistungen nach \u00a745b, Beratungsbesuche \u00a737.3. Die Paragrafen selbst sind Gesetzestext." },
    { page: "preise", sel: ".tbl-scroll", idx: 1, wert: "Selbstzahler-Saetze", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A.4 Selbstzahler-Stundensatz", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt: 38 \u20ac/Std. Hilfskraft, 52 \u20ac/Std. examinierte Fachkraft. Sachleistungs-Caps je Pflegegrad auf S. 6, D.1 (761 / 1.432 / 1.778 / 2.200 \u20ac)." },

    /* --- Planspiel: Sprint-Uebersicht --- */
    { page: "sprints", sel: ".bst", idx: 0, wert: "Baustein 1 \u00b7 Markt- & Wettbewerbsanalyse", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "2", absch: "Datenbasis \u00b7 Markt- & Wettbewerbsanalyse", stand: "Sprint 1", guete: "A",
      hinweis: "Belegt: 10 Wettbewerber im KPI-Benchmark; ambulanter Markt ~14 Mrd \u20ac (Investorpitch S. 4). Vollstaendige Matrix in LebensZeit_Markt_Wettbewerbsanalyse.docx." },
    { page: "sprints", sel: ".bst", idx: 1, wert: "Baustein 2 \u00b7 Porter's Five Forces", kat: "basis", ud: "kennzahlen",
      dok: IP, seite: "9", absch: "Baustein 2 \u00b7 Five Forces \u00dcbersicht", stand: "Sprint 1", guete: "A",
      hinweis: "Lieferantenmacht 4/5 \u00b7 Substitute 3/5 \u00b7 Wettbewerbsintensitaet 3/5 \u00b7 Neue Wettbewerber 2/5 \u00b7 Kundenmacht 2/5; Substitute und Rivalitaet zusaetzlich auf S. 11." },
    { page: "sprints", sel: ".bst", idx: 2, wert: "Baustein 3 \u00b7 Zwei Personas", kat: "basis", ud: "ueberblick",
      dok: "LebensZeit_Handout_Personas_neu.pdf", seite: "1", absch: "Baustein 3 \u00b7 Kundenprofile, Pitch-Handout", stand: "Juni 2026", guete: "A",
      hinweis: "Belegt: Hildegard Stemmer (79, Pflegegrad 2, Ruethen-Meiste, Rente ~1.050 \u20ac) und Markus Doerre. Achtung: Das Cockpit fuehrt dieselbe Person mit 82 Jahren und Pflegegrad 3 \u2014 Abweichung klaeren.",
      todo: "sprints" },
    { page: "sprints", sel: ".bst", idx: 3, wert: "Baustein 4 \u00b7 SWOT & Stossrichtung", kat: "basis", ud: "annahmen",
      dok: "LebensZeit_SWOT_Analyse.pdf", seite: "6", absch: "5 \u00b7 Strategische Stossrichtung & Fazit", stand: "Sprint 1", guete: "A",
      hinweis: "Option C (Digitale Naehe) als Empfehlung: Baustein-1-Dokument S. 5, C als Speerspitze, getragen von A + B. TOWS-Matrix auf SWOT S. 5." },
    { page: "sprints", sel: ".bst", idx: 4, wert: "Baustein 5 \u00b7 KI-Vorgehensmodell", kat: "basis", ud: "ueberblick",
      dok: "Prompt_Tagebuch.pdf", seite: "1", absch: "4 \u00b7 Prompt-Tagebuch (Vorlage Sprint 1)", stand: "Sprint 1", guete: "A",
      hinweis: "Die Vorlage schreibt Datum, Baustein, Prompt, Ergebnis, Kritikereinsatz und Erkenntnis je Session vor. Die ausgefuellten Sessions liegen in der Gesamtuebersicht des Teams." },
    { page: "sprints", sel: ".bboard", idx: 0, wert: "Baustein-Board Sprint 2", kat: "basis", ud: "ueberblick",
      dok: "2_Sprint_Unterlagen.pdf", seite: "4", absch: "2 \u00b7 Eure Aufgabe: Sprint 2 (Vertrieb & Marketing)", stand: "Sprint 2", guete: "A",
      hinweis: "Die fuenf Bausteine und der Zeitraum stammen aus der Sprint-2-Aufgabenstellung. Ampel, Verantwortliche und Deadlines sind Teamplanung, nicht Vorgabe." },

    /* --- Planspiel: Unternehmensdaten (je Unterreiter) --- */
    { page: "unternehmensdaten", sel: '.udpanel[data-p="standorte"] .ud-block', idx: 0, wert: "Standortliste", kat: "basis", ud: "standorte",
      dok: BD, seite: "2", absch: "1 \u00b7 Das Gesch\u00e4ftsmodell \u2014 einfach erkl\u00e4rt", stand: "Sprint 1", guete: "A",
      hinweis: "Fuenf Standorte; Deckungsbeitraege je Standort auf S. 4, A.3." },
    { page: "unternehmensdaten", sel: '.udpanel[data-p="kennzahlen"] .ud-block', idx: 0, wert: "Kennzahlen", kat: "basis", ud: "kennzahlen",
      dok: BD, seite: "4", absch: "A \u00b7 Finanz- & Kostenstruktur (A.1\u2013A.4)", stand: "Sprint 1", guete: "A",
      hinweis: "Umsatz 2,10 Mio \u20ac, Eigenfinanzierung 62 %, Foerderanteil 38 %, Ergebnis je Standort, Selbstzahler-Saetze. Klientenzahlen auf S. 6, D.1." },
    { page: "unternehmensdaten", sel: '.udpanel[data-p="team"] .ud-block', idx: 0, wert: "Team & Personal", kat: "basis", ud: "team",
      dok: BD, seite: "7", absch: "F \u00b7 Personalstruktur (Detail)", stand: "Sprint 1", guete: "A",
      hinweis: "56 besetzt bei Soll 64, davon 25 examiniert, 6 Azubis, 45 Ehrenamtliche; 8 offene Fachkraftstellen." },
    { page: "unternehmensdaten", sel: '.udpanel[data-p="betrieb"] .ud-block', idx: 0, wert: "Betriebsparameter", kat: "basis", ud: "betrieb",
      dok: BD, seite: "5", absch: "C \u00b7 Operative Basisparameter (C.1\u2013C.4)", stand: "Sprint 1", guete: "A",
      hinweis: "Fahrzeugflotte, Schichtmodell ohne Nachtdienst, Software-Stack mit MediFox DAN, sieben Schluessellieferanten." },
    { page: "unternehmensdaten", sel: '.udpanel[data-p="mitgliedschaft"] .ud-block', idx: 0, wert: "Mitgliedschaftsmodell", kat: "basis", ud: "mitgliedschaft",
      dok: BD, seite: "5", absch: "B \u00b7 Mitgliedschaftsmodell", stand: "Sprint 1", guete: "A",
      hinweis: "Tabelle mit 300 / 170 / 50 Mitgliedern und 52.800 \u20ac Beitragssumme; Leistungen je Stufe auf S. 3." },
    { page: "unternehmensdaten", sel: '.udpanel[data-p="cd"] .ud-block', idx: 0, wert: "Corporate Design", kat: "cd", ud: "cd",
      dok: "Projektspeicher \u00b7 Team-Festlegung", seite: "\u2014", absch: "Corporate Design", stand: "laufend", guete: "S",
      hinweis: "Schriften, Palette, Logo-Farbregel und Sprachregelung sind Teamfestlegungen. Logo und Claims sind in LebensZeit_Logo.pdf S. 1 abgebildet." },

    /* --- Unternehmensdaten --- */
    { page: "unternehmensdaten", sel: ".annahmen", idx: 0, wert: "Annahmen-Log (6 Werte)", kat: "annahme", ud: "annahmen",
      dok: BD, seite: "7", absch: "3 \u00b7 Annahmen & Konsistenz-Hinweise", stand: "Sprint 1", guete: "A",
      hinweis: "Vier Punkte im Original: Ausschoepfung ~40 % gew\u00e4hlt, um 180 F\u00e4lle mit 1,15 Mio. \u20ac Pflegeumsatz in Einklang zu bringen \u00b7 Personalkosten ~34 k\u20ac/FTE am unteren Rand \u00b7 Marktvolumen 3,0 Mio \u20ac als Schwachstelle \u00b7 Umsatz enth\u00e4lt 38 % F\u00f6rderung, daher stets getrennt ausweisen." }
  ];

  /* ---------- 3. Seitennamen ---------- */
  var PNAME = {
    index: "Startseite", einzugsgebiet: "Einzugsgebiet", "investoren-markt": "Investoren \u00b7 Markt",
    mitgliedschaft: "Mitgliedschaft", "ueber-uns": "\u00dcber uns", preise: "Preise & Eigenanteil",
    unternehmensdaten: "Unternehmensdaten", leistungen: "Leistungen", aktuelles: "Aktuelles"
  };

  /* ---------- 4. Zustand ---------- */
  var KEY = "lz-quellen-visible";
  var on = false;
  function load() { try { return window.localStorage.getItem(KEY) === "1"; } catch (e) { return false; } }
  function save(v) { try { window.localStorage.setItem(KEY, v ? "1" : "0"); } catch (e) {} }

  function slug() {
    if (window.LZ_PAGE_OVERRIDE) return window.LZ_PAGE_OVERRIDE;
    var p = location.pathname.replace(/\/+$/, "");
    var f = p.split("/").pop() || "index";
    return f.replace(/\.html?$/, "") || "index";
  }
  function mine() { var s = slug(); return SRC.filter(function (x) { return x.page === s || x.page === "*"; }); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  /* ---------- 5. CSS ---------- */
  function injectCSS() {
    if (document.getElementById("lz-src-css")) return;
    var c = [];
    Object.keys(CATS).forEach(function (k) {
      var t = CATS[k];
      c.push(".lz-src-host.k-" + k + "{outline:2px dashed " + t.farbe + ";outline-offset:3px;}");
      c.push(".lz-src-badge.k-" + k + "{background:" + t.farbe + ";color:" + t.tinte + ";}");
      c.push(".lz-src-pop .kat.k-" + k + "{background:" + t.farbe + ";color:" + t.tinte + ";}");
      c.push(".env-cockpit .lz-src-pop .kat.k-" + k + "{background:" + t.farbeD + ";color:" + t.tinteD + ";}");
      c.push(".lz-src-dot.k-" + k + "{background:" + t.farbe + ";}");
      /* Cockpit: dieselben Kategorien, andere Toene. Ohne das lag etwa Datenbasis-
         Gruen mit 1,6:1 auf der Nachtflaeche — der Rahmen war nicht zu sehen. */
      c.push(".env-cockpit .lz-src-host.k-" + k + "{outline-color:" + t.farbeD + ";}");
      c.push(".env-cockpit .lz-src-badge.k-" + k + "{background:" + t.farbeD + ";color:" + t.tinteD + ";}");
      c.push(".env-cockpit .lz-src-dot.k-" + k + "{background:" + t.farbeD + ";}");
    });
    var css = c.join("") +
      ".lz-src-host{position:relative;}" +
      ".lz-src-badge{position:absolute;top:3px;right:4px;z-index:40;font:600 10px/1 Jost,system-ui,sans-serif;letter-spacing:.4px;padding:4px 7px;border-radius:20px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.28);border:0;min-height:0;}" +
      /* Das Popover stand fest auf Weiss, waehrend --text im Cockpit die Nachtinte
         ist: 1,26:1, also unlesbar. Im Cockpit jetzt Nachtpanel mit 11,91:1. */
      ".env-cockpit .lz-src-pop{background:#1E2921;color:#DFE7DC;border-color:#5B7666;box-shadow:0 16px 40px rgba(0,0,0,.5);}" +
      ".env-cockpit .lz-src-pop h5{color:#A8C9A0;}" +
      ".env-cockpit .lz-src-pop dt,.env-cockpit .lz-src-pop .cls{color:#93A493;}" +
      ".env-cockpit .lz-src-pop .hint{color:#93A493;border-top-color:#33443A;}" +
      ".env-cockpit .lz-src-pop .udlink{color:#8AAC85;}" +
      ".env-cockpit .lz-src-pop .tlink{color:#F09595;}" +
      ".lz-src-badge:hover{transform:scale(1.08);}" +
      ".lz-src-pop{position:absolute;z-index:60;top:26px;right:0;width:265px;background:#fff;color:var(--text, #2A2820);border:1px solid rgba(74,103,65,.28);border-radius:12px;padding:13px 15px;box-shadow:0 16px 40px rgba(0,0,0,.2);font:400 13px/1.5 Jost,system-ui,sans-serif;text-align:left;}" +
      ".lz-src-pop h5{font:600 14px/1.3 Jost,system-ui,sans-serif;margin:0 0 6px;color:var(--green3, #2C3D27);}" +
      ".lz-src-pop .kat{display:inline-block;font-size:0.8rem;font-weight:600;letter-spacing:.5px;text-transform:uppercase;border-radius:20px;padding:2px 9px;margin-bottom:8px;}" +
      ".lz-src-pop dl{margin:0;display:grid;grid-template-columns:58px 1fr;gap:3px 9px;}" +
      ".lz-src-pop dt{color:var(--text3, #8A8478);font-size:0.8rem;}" +
      ".lz-src-pop dd{margin:0;font-size:0.8rem;}" +
      ".lz-src-pop dd.dok{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:0.8rem;word-break:break-all;}" +
      ".lz-src-pop .hint{margin-top:9px;font-size:0.8rem;color:var(--text2, #5A5648);border-top:1px solid rgba(74,103,65,.14);padding-top:8px;}" +
      ".lz-src-pop .plinks{display:flex;flex-direction:column;gap:4px;margin-top:9px;}" +
      ".lz-src-pop .udlink{font-size:0.8rem;color:var(--green, #4A6741);font-weight:600;}" +
      ".lz-src-pop .tlink{font-size:0.8rem;color:var(--red, #8C3A2A);font-weight:500;}" +
      ".lz-src-pop .cls{position:absolute;top:6px;right:9px;border:0;background:none;font-size:1rem;color:var(--text3, #8A8478);cursor:pointer;line-height:1;}" +
      ".lz-src-pulse{animation:lzSrcPulse 1.1s ease-out 2;}" +
      "@keyframes lzSrcPulse{0%,100%{box-shadow:0 0 0 0 rgba(176,122,42,0);}50%{box-shadow:0 0 0 7px rgba(176,122,42,.32);}}" +
      "@media(max-width:620px){.lz-src-pop{width:210px;}}";
    var el = document.createElement("style"); el.id = "lz-src-css"; el.textContent = css;
    document.head.appendChild(el);
  }

  /* ---------- 6. Marker ---------- */
  function closePops() {
    var p = document.querySelector(".lz-src-pop"); if (p) p.remove();
  }
  function popover(entry, host) {
    closePops();
    var cat = CATS[entry.kat];
    var d = document.createElement("div");
    d.className = "lz-src-pop";
    d.innerHTML =
      '<button class="cls" aria-label="Schliessen">\u00d7</button>' +
      '<span class="kat k-' + entry.kat + '">' + cat.sym + " " + esc(cat.label) + "</span>" +
      "<h5>" + esc(entry.wert) + "</h5>" +
      "<dl><dt>Dokument</dt><dd class=\"dok\">" + esc(entry.dok) + "</dd>" +
      "<dt>Seite</dt><dd>S. " + esc(entry.seite) + "</dd>" +
      "<dt>Abschnitt</dt><dd>" + esc(entry.absch) + "</dd>" +
      (entry.extern ? "<dt>Ursprung</dt><dd>" + esc(entry.extern) + "</dd>" : "") +
      "<dt>Stand</dt><dd>" + esc(entry.stand) + "</dd>" +
      "<dt>Beleg</dt><dd><b>" + esc(GUETE[entry.guete] || GUETE.D) + "</b></dd></dl>" +
      (entry.hinweis ? '<div class="hint">' + esc(entry.hinweis) + "</div>" : "") +
      '<div class="plinks">' +
      (entry.ud ? '<a class="udlink" href="/unternehmensdaten?ud=' + encodeURIComponent(entry.ud) + '">\u2192 in den Unternehmensdaten</a>' : "") +
      (entry.todo ? '<a class="tlink" href="/notizen?page=' + encodeURIComponent(entry.todo) + '">\u2192 offene To-Dos</a>' : "") +
      '</div>';
    d.querySelector(".cls").addEventListener("click", function (e) { e.stopPropagation(); closePops(); });
    d.addEventListener("click", function (e) { e.stopPropagation(); });
    host.appendChild(d);
    place(d, host);
  }

  /* ---------- 6b. Popover in den sichtbaren Bereich ruecken ----------
     Das Popover stand fest auf top:26px, right:0 relativ zum Traeger. Bei
     Bauteilen am rechten oder unteren Rand lief es aus dem Bild — im Cockpit
     besonders, weil #main eigenstaendig scrollt und body auf overflow:hidden
     steht, es dort also nicht einmal erreichbar war.
     Gemessen wird nach dem Einhaengen, weil die Breite erst dann feststeht.
     Verschoben wird nur so weit wie noetig, und nur ueber die Kanten, die
     tatsaechlich anstossen: waagerecht wandert es nach links (bzw. klappt
     auf die linke Traegerkante), senkrecht ueber das Bauteil statt darunter.
     Die Werte gehen als Inline-Stil ans Element, damit die Regel im
     Stylesheet unangetastet bleibt und der Normalfall ohne JS stimmt. */
  var PAD = 8;      // Mindestabstand zum Bildrand
  var GAP = 6;      // Abstand zum Traeger, wenn nach oben geklappt wird
  var TOP = 26;     // Normalfall aus dem Stylesheet: unter dem Badge

  function place(pop, host) {
    /* Der Traeger traegt .lz-src-host{position:relative}, das Popover
       position:absolute — left/top rechnen also im Traeger-Koordinatensystem.
       Gemessen wird erst nach dem Einhaengen, weil Breite und Hoehe vorher
       nicht feststehen. */
    var hr = host.getBoundingClientRect();
    var vw = document.documentElement.clientWidth;
    var vh = document.documentElement.clientHeight;
    var w = pop.offsetWidth, h = pop.offsetHeight;

    /* ── waagerecht ───────────────────────────────────────────────────
       Ausgangslage ist right:0, also rechte Kante am Traeger. Von dort nur
       so weit schieben, wie noetig, und links nachpruefen — sonst kippt das
       Popover bei schmalen Traegern am linken Rand wieder heraus. */
    var left = hr.width - w;
    if (hr.left + left < PAD) left = PAD - hr.left;
    if (hr.left + left + w > vw - PAD) left = (vw - PAD - w) - hr.left;
    if (hr.left + left < PAD) left = PAD - hr.left;

    /* ── senkrecht ────────────────────────────────────────────────────
       Bevorzugt unter dem Badge. Passt es dort nicht, ueber den Traeger.
       Passt es auch dort nicht, Oberkante an den Bildrand und innen
       scrollbar — im Cockpit war das der eigentliche Schaden: body steht
       auf overflow:hidden und #main scrollt eigenstaendig, ein nach unten
       hinausragendes Popover war dort gar nicht erreichbar. */
    var top = TOP;
    if (hr.top + top + h > vh - PAD) {
      if (hr.top - h - GAP >= PAD) {
        top = -h - GAP;
      } else {
        top = PAD - hr.top;
        if (h > vh - PAD * 2) {
          pop.style.maxHeight = (vh - PAD * 2) + "px";
          pop.style.overflowY = "auto";
        }
      }
    }

    pop.style.right = "auto";
    pop.style.left = Math.round(left) + "px";
    pop.style.top = Math.round(top) + "px";
  }
  function build() {
    clear();
    if (!on) return;
    mine().forEach(function (entry, i) {
      var nodes = document.querySelectorAll(entry.sel);
      var host = nodes[entry.idx || 0];
      if (!host) return;
      entry._host = host;
      host.classList.add("lz-src-host", "k-" + entry.kat);
      var b = document.createElement("button");
      b.className = "lz-src-badge k-" + entry.kat;
      b.type = "button";
      b.dataset.i = i;
      b.title = CATS[entry.kat].label + " \u2014 Quelle anzeigen";
      b.textContent = CATS[entry.kat].sym + " Quelle";
      b.addEventListener("click", function (e) { e.stopPropagation(); e.preventDefault(); popover(entry, host); });
      host.appendChild(b);
    });
  }
  function clear() {
    closePops();
    document.querySelectorAll(".lz-src-badge").forEach(function (b) { b.remove(); });
    document.querySelectorAll(".lz-src-host").forEach(function (h) {
      h.className = h.className.replace(/\blz-src-host\b/, "").replace(/\bk-(basis|amt|ziel|annahme|platz|cd)\b/, "").trim();
    });
  }

  /* ---------- 8. Toggle im Pillmenü ---------- */
  /* Gleiche Ampel wie beim To-Do-Schalter (Regeln stehen in lz-notes.js):
     gruen = eingeblendet, rot = ausgeblendet, daneben die Zahl der Belege.
     Die Farbe traegt den Zustand nicht allein — Zahl und aria-label tun es mit. */
  function syncLabel() {
    var s = document.getElementById("lzSrcState");
    var count = mine().length;
    if (s) s.textContent = String(count);
    var l = document.getElementById("lzSrcLamp");
    if (l) {
      l.className = "lz-lamp " + (on ? "is-on" : "is-off");
      l.setAttribute("role", "img");
      l.setAttribute("aria-label",
        (on ? "eingeblendet" : "ausgeblendet") + ", " + count + " Belege auf dieser Seite");
    }
    var b = document.getElementById("lzSrcToggle");
    if (b) b.setAttribute("aria-pressed", on ? "true" : "false");
  }
  function toggle(force) {
    on = (typeof force === "boolean") ? force : !on;
    save(on); build(); syncLabel();
  }
  function mountToggle() {
    var menu = document.getElementById("fiktivMenu");
    if (!menu || document.getElementById("lzSrcToggle")) return !!menu;
    var b = document.createElement("button");
    b.type = "button";
    b.className = "fiktiv-note-toggle";
    b.id = "lzSrcToggle";
    b.setAttribute("role", "menuitem");
    b.innerHTML = "<span><svg class=\"lz-ic\" viewBox=\"0 0 16 16\" aria-hidden=\"true\"><circle cx=\"7\" cy=\"7\" r=\"4.5\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"1.3\"/><line x1=\"10.5\" y1=\"10.5\" x2=\"14\" y2=\"14\" stroke=\"currentColor\" stroke-width=\"1.3\"/></svg>Datenquellen</span><span class=\"lz-state\"><span class=\"lz-lamp is-off\" id=\"lzSrcLamp\"></span><span id=\"lzSrcState\">0</span></span>";
    b.addEventListener("click", function () { toggle(); });
    menu.appendChild(b);
    syncLabel();
    return true;
  }

  /* ---------- 9. Start ---------- */
  function init() {
    injectCSS();
    if (!mountToggle()) {
      var tries = 0;
      var iv = setInterval(function () { if (mountToggle() || ++tries > 20) clearInterval(iv); }, 100);
    }
    on = load();
    if (on) build();
    document.addEventListener("click", function () { closePops(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closePops(); });
  }

  window.LZQuellen = {
    all: function () { return SRC.slice(); },
    page: mine,
    cats: CATS,
    slug: slug,
    isOn: function () { return on; },
    toggle: toggle,
    rebuild: build
  };
  window.lzToggleQuellen = toggle;

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
