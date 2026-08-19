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

    { id: "n-kundenportal-stub", page: "kundenportal", selector: "h1", status: "auszubauen",
      title: "Platzhalterseite Kundenportal",
      text: "Vorläufige Platzhalter-Seite. Portal-Funktionen (Login, Termine, Dokumente, Rechnungen, Nachrichten) in einem späteren Sprint ausbauen." },

    { id: "n-markt-pg1", page: "investoren-markt", selector: ".kpi-row .kpi-item:nth-child(2)", status: "spaeter",
      title: "PG-1-/Beratungssegment fehlt",
      text: "~90 Klient:innen in Pflegegrad 1 bzw. reiner Beratung sind nicht als eigenes Segment ausgewiesen (180 = PG 2–5). Ergänzen oder bewusst ausklammern — Entscheidung offen." },

    { id: "n-preise-rechner", page: "preise", selector: ".tbl-scroll", status: "auszubauen",
      title: "Preis-Empfehlung + Herleitung (Baustein 2)",
      text: "Eigenanteil-Rechner bzw. Preis-Empfehlung ergänzen und die 62 %→70 %-Eigenfinanzierung nachvollziehbar offenlegen. Datenbasis liegt vor." },

    { id: "n-sprints-kampagne", page: "sprints", selector: ".bboard tbody tr:nth-child(3)", status: "spaeter",
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

    { id: "n-index-usp", page: "index", selector: ".hero h1", status: "auszubauen",
      title: "USP zuspitzen (Baustein 1)",
      text: "KI-Kritik: Startseite noch generisch (vier Standardleistungen). Auf Option C zuspitzen — „Digitale Nähe – der sichtbare Pflegepartner für Angehörige\" (Persona Markus Dörre), nicht auf drei Säulen." },

    { id: "n-aktuelles-grammatik", page: "aktuelles", selector: "h1", status: "offen", done: true,
      title: "Grammatik: „aus der Nachbarschaft\"",
      text: "BEHOBEN 13.08.2026. „Neues aus dem Nachbarschaft\" → „Neues aus der Nachbarschaft\". Reiner Textfehler in der Seitenüberschrift von /aktuelles, eine Stelle." },

    { id: "n-ueberuns-oton", page: "ueber-uns", selector: ".lead-card", status: "spaeter",
      title: "O-Ton der Gründerin",
      text: "KI-Kritik (Kür): kurzes Zitat von Dr. Maria Holthaus „Warum ich LebensZeit gegründet habe\" erhöht Authentizität." },

    /* ----- Sprint-2-Bausteine ----- */
    { id: "n-sprints-app", page: "sprints", selector: ".bboard tbody tr:nth-child(4)", status: "auszubauen",
      title: "App-Prototyp V1→V3 (Baustein 4)",
      text: "Drei dokumentierte Iterationsstufen V1–V3 + KI-Persona-Feedback + Live-Klick im Pitch. Braucht einen Owner; V1 muss vor den Ferien stehen." },

    { id: "n-sprints-reflexion", page: "sprints", selector: ".bboard tbody tr:nth-child(5)", status: "spaeter",
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

    /* ----- Schritt 1+2 vom 07.08.2026: Leiste, Ampel, runde Knöpfe ----- */
    { id: "n-done-bar-grundregeln", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Grundregeln der Fiktiv-Leiste zentral",
      text: "injectBarCSS() in lz-notes.js enthielt weder .fiktiv-marquee noch .lz-ic — beides stand nur inline in den 15 öffentlichen Seiten. Auf den fünf Planspiel-Seiten behielt der Knopf dadurch den Browser-Standard (grauer Grund, schwarze Schrift, auf iOS blau), wuchs statt auf 100% auf 3924px (horizontales Scrollen) und die Menüsymbole rendeten mit 44 und 88px statt 1em. Regeln jetzt in lz-notes.js, weil neun Seiten lz-tokens.css noch nicht einbinden." },

    { id: "n-done-ampel-pillmenu", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Ampel statt An/Aus im Pillmenü",
      text: "To-Do- und Quellen-Schalter zeigen jetzt Lampe + Anzahl statt „An\\\"/„Aus\\\". Grün = Salbeigrün (5,33:1 auf der Schalterfläche), Rot = --series-4 hell #B03A2E mit 1px Ring in Creme (2,24:1 zur Fläche, 5,30:1 zum Ring). Zustand hängt nicht an der Farbe allein: Zahl und aria-label tragen ihn mit, weil Rot und Grün sich in der Helligkeit kaum trennen (1,13:1) und bei Deuteranopie zusammenfallen. Anzeige liegt jetzt in einer einzigen Funktion (paintToggle) statt in zweien mit verschiedenem Text." },

    { id: "n-done-laufband-messung", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Laufband: Unschärfe, Sprung und Tempo",
      text: "translateX(-50%) verschob die halbe Container-, nicht die halbe Inhaltsbreite (720 statt 1961px) — Umlauf mit Sprung, Glyphen dauerhaft auf Bruchteil-Pixeln, daher die weiche Schrift am Desktop. lz-notes.js misst jetzt eine Textwiederholung, setzt --tick-shift auf ganze Pixel (1988px) und --tick-dur auf 7,5 px/s. Vorher schwankte das Tempo zwischen 2 px/s (öffentlich mobil) und 20 px/s (Planspiel-intern mobil)." },

    { id: "n-done-runde-knoepfe", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Runde Knöpfe waren oval",
      text: "Die globale Tap-Regel in lz-tokens.css (min-height: var(--tap-env), 48px) überschrieb explizite Höhen: Notiz-Pin 30x48, Filter-Zurücksetzen 34x48. Beide behalten jetzt ihre Kantenlänge (min-height 0, aspect-ratio 1) und holen das 48px-Tippziel über eine unsichtbare ::after-Fläche zurück. Utility .lz-round in lz-tokens.css für weitere Fälle." },

    { id: "n-done-status-ok-hell", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "--status-ok für helle Umgebungen",
      text: "Fehlte bisher ganz — jede Seite hatte sich ein eigenes Grün erfunden (#2f7d3a, #2E7038, #276b31, #BFDDC3). Festgelegt auf --lz-green. Offen bleibt: Salbeigrün als Füllfläche auf hellem Grund ist gegen jede helle Fläche zu schwach (2,05 bis 2,52:1) — gehört in die generelle Statusfarben-Klärung." },

    { id: "n-tick-h-ueberdeckung", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Anmeldeflächen decken den Warnbalken ab",
      text: "BEHOBEN 13.08.2026. Beide Flaechen lesen --tick-h: cockpit.html #login und investoren.html .gate. Uebrig war ein abweichender Rueckfallwert — #app stand auf 2.25rem, ueberall sonst 2.375rem; ohne JS lag der Inhalt dadurch zwei Pixel unter der Leiste. Vereinheitlicht, jetzt 13 Vorkommen mit demselben Wert." },

    { id: "n-done-cockpit-mobil", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Cockpit mobil: Schublade statt Scrollleiste",
      text: "Die Seitenleiste wurde unter 900px zu einer horizontal scrollbaren Zeile — die Navigation war damit 2965px breit. Jetzt liegt sie als Schublade neben dem Bild und kommt über einen Hamburger; sie schließt bei Modulwahl, Escape, Klick auf die Abdunklung und beim Verbreitern über 900px." },

    { id: "n-done-cockpit-kopf-fuss", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Cockpit mobil: Kopfzeile und Fußzeile",
      text: "Kopfzeile war einzeilig und gedrängt (Titel, Uhr, Systemschalter, Person, Abmelden auf 390px). Jetzt zweizeilig: oben Hamburger, Titel, Kürzel, Abmelden — unten Uhr und Systemschalter. Höhe 97px statt 160px im Zwischenstand. Fußzeile stand in einer starren 26px-Zeile und wurde abgeschnitten, sobald ihr Text umbrach; jetzt automatische Höhe." },

    { id: "n-done-cockpit-systemschalter", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Systemschalter mobil defekt",
      text: "Die Schiene hatte feste 118px ohne flex:0 0 auto und schrumpfte in der gedrängten Kopfzeile; der absolut positionierte Knopf blieb bei 56px und lief über die Beschriftung 2024/2026. Beide Werte jetzt gegen Schrumpfen gesichert, in beiden Modi geprüft." },

    { id: "n-done-cockpit-pillmenu", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Pillmenü im Cockpit",
      text: "Das Cockpit war von der Leiste ausgenommen und trug den Warnbalken ohne Knopf und ohne Menü. ensureBar() in lz-notes.js unterscheidet jetzt drei Ausgangslagen und rüstet einen vorhandenen Balken nach, statt eine zweite Leiste einzufügen. Menü liegt auf Anmeldung und in der laufenden Anwendung obenauf. Datenquellen-Schalter fehlt dort weiterhin — lz-quellen.js ist im Cockpit nicht eingebunden, bewusst: die Simulation führt keine Belegstellen." },

    { id: "n-done-quellen-cockpit", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Quellen-Overlay im Cockpit",
      text: "lz-quellen.js war im Cockpit nicht eingebunden — die vier erzeugten Bestände (180 Klienten, 56 Mitarbeitende, 45 Ehrenamtliche, 18 Fahrzeuge) plus Touren und offene Stellen trugen keine Herkunft. 14 Einträge ergänzt, Selektoren je Modul verengt (#main[data-mod=…] > .panel), Neuaufbau nach jedem render(). Neue Kategorie „Erzeugter Datensatz\\\" eingeführt: Summen stimmen mit dem Steckbrief, Einzelpersonen sind erfunden." },

    { id: "n-done-quellen-dunkel", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Quellen-Popover war im Cockpit unlesbar",
      text: "Das Popover stand fest auf Weiß, während --text im Cockpit die Nachtinte #DFE7DC ist — 1,26:1. Jetzt Nachtpanel mit 11,91:1. Zusätzlich tragen alle sieben Kategorien getrennte Töne für hell und dunkel: Datenbasis-Grün lag auf der Nachtfläche bei 1,6:1, der gestrichelte Rahmen war nicht zu sehen. Plakettentinte kippt mit (Weiß auf dunklen Hellwerten, Nachtinte auf hellen Dunkelwerten)." },

    { id: "n-personalstamm-rollenmix", page: "cockpit", selector: "#main[data-mod=\"pers\"] > .panel", status: "offen",
      title: "Rollenmix im Personalstamm weicht vom Steckbrief ab",
      text: "Kopfzahl 56 und FTE 45,6 stimmen, der Mix nicht: Steckbrief 20 Fachkräfte / 13 Hilfskräfte / 5 Hauswirtschaft / 5 Verwaltung, Simulation 18 / 14 / 0 / 4 plus 6 Azubis und 1 Qualitätsmanagement. Ursache: die 6 Azubis stehen im Steckbrief neben den 56, in der Simulation darin — sie verdrängen die Hauswirtschaft. Examinierte 23 statt 25. Vor dem Pitch angleichen, weil B2 auf dem Qualifikationsmix aufbaut." },

    { id: "n-tourenzahl", page: "cockpit", selector: "#main[data-mod=\"tour\"] > .panel", status: "auszubauen",
      title: "Touren stark verkürzt dargestellt",
      text: "Der Steckbrief nennt 3–4 Touren je Standort früh und ~2 spät (C.3), also rund 25 am Tag. Die Simulation zeigt 6. Für die Vorführung tragfähig, für eine Aussage zur Tourenoptimierung nicht — entweder aufstocken oder im Pitch als Ausschnitt kennzeichnen." },

    { id: "n-namensraeume", page: "cockpit", selector: "#main[data-mod=\"pers\"] > .panel", status: "auszubauen",
      title: "Drei getrennte Namensräume für Personen",
      text: "Die Anmeldung nennt Holthaus, Brandt und Yilmaz, der Personalstamm 56 andere Namen, die Tourenliste sechs weitere Pflegekräfte (Weber, Yilmaz, Nowak, Köhler, Brinkmann, Busch-Kranz). Keiner der drei Bestände überschneidet sich sauber. Fällt auf, sobald jemand im Pitch zwei Ansichten nebeneinander legt." },

        { id: "n-cockpit-notizen-anker", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "To-Do-Pins im Cockpit ohne sichtbaren Anker",
      text: "BEHOBEN 13.08.2026. Zwei Ursachen. Erstens: render() schreibt #main komplett neu, buildPins() lief nur einmal beim Laden — nachgemessen waren nach der Anmeldung von sechs Pins null im Dokument. render() ruft jetzt LZNotes.rebuild(), genau wie eine Zeile hoeher LZQuellen.rebuild(). Zweitens hingen alle sechs offenen Cockpit-Notizen am Selektor \"main\", standen also auf jedem Modul uebereinander. Jetzt auf Modulselektoren verengt, wie die Quellen-Registry es schon macht: Rollenmix, Namensraeume und Personalstamm-Nachtrag auf #main[data-mod=\"pers\"], Tourenzahl auf \"tour\", MediFox auf \"home\". Nachgemessen je Modul: Uebersicht 2/2 sichtbar, Personal 4/4, Touren 2/2, Klienten 1/1." },

    { id: "n-quellen-popover-rand", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Quellen-Popover laufen über den Rand",
      text: "BEHOBEN 13.08.2026. Das Popover stand fest auf top:26px, right:0 relativ zum Traeger. place() rueckt es jetzt nach dem Einhaengen in den sichtbaren Bereich — waagerecht nur so weit wie noetig und mit Nachpruefung der linken Kante, senkrecht ueber den Traeger, wenn unten kein Platz ist, sonst Oberkante an den Rand und innen scrollbar. Der eigentliche Schaden lag im Cockpit: body steht auf overflow:hidden und #main scrollt eigenstaendig, ein nach unten hinausragendes Popover war dort gar nicht erreichbar. Nachgemessen 49 Popover auf fuenf Seiten in Desktop und 390px: alle im Bild, vorher 24 ausserhalb." },

    { id: "n-done-env-invest", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "env-invest ausgerollt",
      text: "Die sechs Investorenseiten trugen einen eigenen :root-Block — eine zweite Farbquelle, die an drei Stellen abwich: --amber-ink #8F6318 statt #8C5E14, --border 0,18 statt 0,28 Deckung, --red-err #A23 statt Marken-Rot. Block entfernt, lz-tokens.css eingebunden, body auf env-invest, Gate auf var(--tick-h), Eyebrows von var(--amber-ink) auf var(--accent-ink) umgestellt — die Umgebung treibt jetzt den Akzent, nicht der Rohwert. Vorher/Nachher über 300 Messpunkte verglichen: alle 229 Abweichungen erklärbar (Fließtext 16 → 16,48px nach --fs-public, Amber-Ink auf den kanonischen Wert, Formularfelder auf 14px Radius und 48px Tippziel)." },

    { id: "n-done-invest-laufband", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Warnbalken der Investorenseiten vereinheitlicht",
      text: "Die sechs Seiten liefen noch mit der alten .track-Spur und fester 60s-Dauer — dieselbe Ursache für weiche Schrift und Sprung, die auf den übrigen Seiten schon behoben war. Markup auf .lz-tick / .lz-tick-track umgestellt, eigene @keyframes fiktivscroll entfernt, Pause-Knopf ergänzt. Alle 27 Seiten laufen jetzt mit 1.988px Verschiebung und 7,5 px/s." },

    { id: "n-bruecke-entfernen", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Brücke geprüft — zwei Altnamen abgebaut, Doppeleintrag aufgelöst",
      text: "GEPRÜFT 13.08.2026. Dieser Punkt und n-tokens-bruecke-abbauen beschrieben dieselbe Sache mit unterschiedlichem Stand — der Zählstand steht jetzt gesammelt dort, hier bleibt nur der Verweis. Gemessenes Ergebnis: die Brücke ist weiterhin unverzichtbar, 2.380 Aufrufe über 20 Namen. Abgebaut sind --cream3 und --parchment mit null Aufrufen." },

    { id: "n-done-footer-logo-entlinkt", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Fußzeilen-Logo entlinkt",
      text: "Der Lockup in der Fußzeile führte auf /website-status — eine Planspiel-interne Seite, erreichbar aus jedem öffentlichen Footer. Auf 21 Seiten vom <a> zum <div> umgestellt; die 22. Fundstelle lag nicht in der Fußzeile, sondern in der Anmeldekarte des Investoren-Gates und ist dort ebenfalls entlinkt. investoren.html trug im Footer bereits ein <span>. Darstellung unverändert geprüft: Farbe, Maße und Umbruch identisch, kein Zeigerwechsel mehr." },

    { id: "n-done-farbliterale-intern", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Farbliterale der internen Seiten auf Rollen",
      text: "notizen, sprints, website-status und prompt-tagebuch tragen keine Hexwerte mehr im CSS. Erledigt-Ton überall auf --status-ok (= --lz-green, Festlegung 07.08.2026), Prioritätsstufen auf --red / --amber-ink / --green, deren Punkte auf --red / --amber / --sage. Auf unternehmensdaten.html bleiben 17 Hexwerte stehen — sie sind Inhalt, nicht Gestaltung: die Seite dokumentiert die Palette im Text. Dabei fiel auf, dass sie den Amber-Ink mit #8F6318 auswies, also dem alten Wert, der mit dem env-invest-Rollout aus dem System verschwunden ist; korrigiert auf #8C5E14." },

    { id: "n-done-app-eingebaut", page: "app", selector: "main", status: "auszubauen", done: true,
      title: "App-Prototyp eingebaut",
      text: "LebensZeit OS liegt als app-demo.html im Repo, eingerahmt von der Hostseite app.html (Umgebung Portal). Der Rahmen ist bewusst gewählt: die App bringt eigene Tokens aus Theme.swift mit, sechs Namen sind bei uns belegt und tragen andere Werte (--text, --status-ok, --status-warn, --status-info, --tint-ok, --font-mono) — im selben Dokument würden sich beide Systeme überschreiben. Verlinkt aus kundenportal.html. Einzige Änderung an der App: Logofarbe auf hellem Grund von #3D5936 auf Markengrün #4A6741." },

    { id: "n-app-namensraum", page: "app", selector: "main", status: "offen",
      title: "App-Personen sind ein weiterer Namensraum",
      text: "Sandra Meier (Pflegekraft), Marlene Vossenkuhl (Senior:in) und Sabine Koch (Angehörige) tauchen weder im Personalstamm des Cockpits noch im Personas-Handout auf; nur Dr. Maria Holthaus stimmt überein. Damit gibt es vier getrennte Personenbestände. Für den Pitch die Personas Hildegard Stemmer und Markus Dörre auch in der App führen — sie sind die Figuren, mit denen Baustein 3 argumentiert." },

    { id: "n-app-rollenfarbe-blau", page: "app", selector: "main", status: "auszubauen",
      title: "Rollenfarbe Blau in der App",
      text: "Die Rollenkarte Pflegekraft ist blau (#185FA5, in der App --status-info). Blau gehört nicht zur Markenpalette; im Websystem ist Petrol #33566B als Informationston hinterlegt. Entweder angleichen oder als bewusste Plattformabweichung festhalten." },

    { id: "n-env-portal-festschreiben", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "env-portal war bereits festgeschrieben — Punkt war veraltet",
      text: "GEPRÜFT 13.08.2026. Der Punkt beschrieb einen Stand, den es nicht mehr gab: kundenportal.html bindet lz-tokens.css ein, trägt env-portal am body und hat keinen eigenen :root-Block. Im Browser nachgemessen greifen die Rollen vollständig — Fliesstext 1.19rem, Zeilenhöhe 1.7, Tippziele 56px, Fläche warmes Creme #FBF4E6, Radius 24px, Logo über var(--logo) in Waldgrün. Null feste Pixelschriftgrössen. Siehe n-invest-portal-tokens für die Lehre daraus." },

    { id: "n-done-greenc-fehlte", page: "website-status", selector: "main", status: "offen", done: true,
      title: "Statusleiste und Fertig-Punkt waren farblos",
      text: "Ursache war ein einziges Token: --greenC wurde an vier Stellen gelesen, aber nirgends definiert — der env-intern-Block setzt nur --yellow, --yellowbg, --greenbg und --redbg. Betroffen waren der grüne Balkenabschnitt, der Punkt am Filter „Fertig\\\", die Kennzahl „Fertig\\\" und der Kachelstatus. Alle vier auf --status-ok umgestellt, damit sie mit der To-Do-Seite übereinstimmen; die gelbe Balkenfüllung auf --amber, weil Amber-Ink dort der Textton ist." },

    { id: "n-done-filter-gedrueckt", page: "notizen", selector: "main", status: "auszubauen", done: true,
      title: "Gedrückte Filter spiegeln die Liste",
      text: "Vorher wurde jeder gedrückte Filter dunkelgrün, unabhängig davon, wonach er filtert. Jetzt trägt jede Gruppe das Aussehen ihres Gegenstücks in der Liste: Status als volle Fläche mit weißer Schrift (.b-*), Priorität als getönte Pille mit Punkt (.prio), Sprint und Kategorie als getönte Marken (.sp-chip / .cat-chip). Erledigt bekommt zusätzlich Durchstreichung, weil es sonst dasselbe Grün wie „Später\\\" wäre. aria-pressed ergänzt; Zurücksetzen erfasst jetzt auch die Kategoriengruppe, die vorher stehen blieb. Kontraste 4,94 bis 9,84:1." },

    { id: "n-done-sprintboard-aktuell", page: "sprints", selector: "main", status: "auszubauen", done: true,
      title: "Baustein-Board auf Stand gebracht",
      text: "Das Board stand auf dem Juli-Stand: Baustein 1 „In Arbeit\\\", Baustein 3 „Kaum begonnen\\\", Baustein 4 „V1 steht\\\", alle Termine abgelaufen, Verantwortlichkeit fünfmal „offen\\\". Status jetzt an vorhandenen Artefakten festgemacht — B1 steht (Option C), B2 blockiert (Personalkosten), B3 Kennzahlen liegen vor, B4 lauffähig aber ohne ausgewiesene Iterationsstufen, B5 Material da und Reflexion offen. Spalte „Verantwortlich\\\" durch „Beleg\\\" ersetzt, weil eine Zuordnung im Team das Board nicht selbst trifft. Restzeit bis zum Pitch wird gerechnet statt getippt — eine feste Zahl war genau der Grund, warum das Board veraltet ist." },

    { id: "n-sprint-tabs-1-3-6", page: "sprints", selector: "main", status: "offen", done: true,
      title: "Sprint-Reiter 1 und 3 bis 6 nicht geprüft",
      text: "GEPRUEFT 13.08.2026. Sprint 1 war bereits korrekt als abgeschlossen ausgewiesen (Reiterpunkt done, Abzeichen \"Abgeschlossen\", Pitch 15. Juni 2026). Echter Befund in den Reitern 3 bis 6: sie nannten je ein Handlungsfeld wie eine Zuteilung. Die Phasenuebersicht gibt das nicht her — sie nennt elf Handlungsfelder als Pool, alle zwei Monate kommt daraus eine Aufgabe, und woertlich: \"Die Themenpakete koennen situationsbedingt angepasst werden.\" Vergeben sind bisher nur Sprint 1 (Marktanalyse) und Sprint 2 (Vertrieb und Marketing), neun Felder sind offen. Die vier Reiter tragen jetzt das Abzeichen \"Handlungsfeld · Annahme\", den vollstaendigen Pool und den Hinweis, dass das genannte Feld eine Annahme ist." },

    { id: "n-done-kundenportal-gebaut", page: "kundenportal", selector: "main", status: "auszubauen", done: true,
      title: "Kundenportal als Website gebaut",
      text: "Die Platzhalterseite war überhaupt nicht in der Portal-Umgebung: Fläche Creme statt Creme-warm, Fließtext 16,5px statt 19px, Kacheln mit Radius 0 statt 24px. Jetzt nach Umgebung 03 der Designgrundlage — Creme-warm, Akzent Grün, Logo Waldgrün, 1,19rem, Radius 24px, Tippziel 56px. Anmeldung nach demselben Muster wie das Cockpit: Rollenauswahl füllt Kennung und Passwort. Vier Bereiche wie in der Designgrundlage gefordert: Heute, Meine Woche, Unterlagen (Dokumente und Rechnungen — die beiden bisher fehlenden), Kontakt. Status trägt überall Wort plus Zeichen, nie einen Punkt allein. Kontraste 4,74 bis 14,76:1." },

    { id: "n-portal-app-flaeche", page: "app", selector: "main", status: "offen",
      title: "App-Fläche passt nicht zur Portal-Vorgabe",
      text: "Die App nutzt im Hellmodus #F6F8F3 — Farbton 84°, also kühl grünlich. Die Portal-Festlegung ist Creme-warm #FBF4E6 mit Farbton 40°. Die Helligkeit ist praktisch gleich (94 gegen 96 %), der Unterschied steckt allein im Farbton: 44° Abstand. Deshalb wirkt der Übergang von der Hostseite in den Rahmen verschoben. Entscheidung nötig: entweder die vier Verlaufsflächen der App auf die warme Reihe umstellen, oder als bewusste Plattformabweichung festhalten." },

    { id: "n-portal-hausnotruf", page: "kundenportal", selector: "main", status: "auszubauen",
      title: "Hausnotruf und Nachrichten fehlen im Portal",
      text: "Premium enthält laut Steckbrief den Hausnotruf, das Portal zeigt ihn nicht. Ebenso fehlt der Bereich Nachrichten, den die alte Platzhalterseite versprochen hat — die Rückfrage auf der Startansicht deckt nur eine Richtung ab. Beides erst nach dem Abgleich mit der App bauen, damit es nicht zweimal unterschiedlich erfunden wird." },

    { id: "n-done-portal-erweitert", page: "kundenportal", selector: "main", status: "auszubauen", done: true,
      title: "Kundenportal auf acht Bereiche erweitert",
      text: "Neu gegenüber dem App-Prototyp abgeglichen: Nachbarschaftsbrett (Kategorien und Aufbau aus dem Brett der App), Kontakte um Zentrale, Rufbereitschaft, Hausarzt und Apotheke erweitert, Verlauf „Was zuletzt geschah\\\", Termin selbst anfragen. Dazu Mitgliedschaft mit Stufenvergleich und Wechsel, Eigenanteil getrennt von den Rechnungen, SEPA-Lastschriftmandat, Services als Sammelstelle. Logo verlinkt jetzt auf die Startseite. Weitere Zugänge in der Anmeldung springen in den App-Prototyp — der Verweis ist dafür aus der Fußzeile entfernt." },

    { id: "n-done-portal-kopfzeile", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "Kopfzeile weitete den mobilen Viewport auf",
      text: "Logo, Menü, Person und Abmelden maßen zusammen 473px auf einem 390px-Gerät. Der Browser weitet in dem Fall nicht nur die Kopfzeile, sondern die gesamte Seite auf — alle acht Bereiche waren betroffen, ohne dass irgendwo sichtbar etwas überstand. Unter 560px trägt der Hamburger nur noch das Zeichen, Abmelden steht in der Schublade." },

    { id: "n-done-menue-knopffarbe", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "Knopffarbe im Menü geprüft",
      text: "Der Abmeldeknopf stand auf --text-2 mit Rahmen in --line-ui und las sich wie eine deaktivierte Fläche. Jetzt Markengrün auf transparent, 5,80:1; gefüllte Knöpfe Markengrün mit Creme, 5,60:1. Alle Bedienelemente im Portal erreichen die 56px der Portal-Umgebung." },

    { id: "n-portal-brett-quelle", page: "kundenportal", selector: "main", status: "auszubauen",
      title: "Brett-Einträge brauchen echte Termine",
      text: "Die vier Einträge im Nachbarschaftsbrett sind erfunden, knüpfen aber an belegte Angebote an (Begegnungsorte, Angehörigen-Café, Pflegekurs als Aktiv-Leistung). Vor dem Pitch entweder mit den tatsächlich geplanten Terminen füllen oder als Beispiel kennzeichnen." },

    { id: "n-done-portal-ablaeufe", page: "kundenportal", selector: "main", status: "auszubauen", done: true,
      title: "Knöpfe im Portal mit Abläufen hinterlegt",
      text: "Vorher hing an jedem Knopf dieselbe Sammelroutine, die nur „Danke\\\" ausgab — Mitgliedschaft, Services und Brett wirkten dadurch funktionslos. Jetzt ein Ablaufmodell mit fünf Ausgängen: Bestätigung, weitere Auswahl, vorbelegtes Formular, vorbereitete E-Mail, Funktion. Konkret: Aufstufung der Mitgliedschaft wirkt sofort, Herabstufung zeigt erst die entfallenden Leistungen und verlangt eine zweite Bestätigung. Brett-Anmeldungen fragen, für wen sie gelten (kontoabhängig formuliert), danach Hinweis auf die Bestätigung per E-Mail; beim Fahrdienst entfällt die Frage, weil es dort um Unterlagen geht. Services: SEPA und Bankverbindung öffnen Felder mit hinterlegten Daten, Adressänderung eine vorbereitete E-Mail, Leistungen ausweiten drei Wege (Anruf, beim Hausbesuch besprechen, Eigenanteil ansehen)." },

    { id: "n-done-portal-zugang-app", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "App-Zugang auf einen Eintrag zusammengeführt",
      text: "Statt dreier Rollen steht jetzt ein Eintrag „App-Prototyp · alle Rollen\\\" mit eigener Kennung; der Knopf wechselt auf „Zum App-Prototyp\\\". Die Rollenwahl passiert im Prototyp selbst. Ein Ausbau der Anmeldung folgt später." },

    { id: "n-done-portal-logo", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "Logos verlinkt, Unterstrich entfernt",
      text: "Alle drei Logos im Portal — Anmeldung, Kopfzeile, Schublade — führen auf die Startseite. Der Unterstrich beim Überfahren ist raus; stattdessen wird das Logo leicht heller, damit die Wortmarke ungestört bleibt." },

    { id: "n-portal-formulare-ohne-pruefung", page: "kundenportal", selector: "main", status: "auszubauen", done: true,
      title: "Portalformulare prüfen nichts",
      text: "BEHOBEN 13.08.2026. Das Feldschema traegt jetzt eine dritte Angabe: \"iban\" oder \"pflicht\". Die IBAN wird nach ISO 13616 geprueft — Laenge je Land, erste vier Zeichen nach hinten, Buchstaben zu Zahlen, Rest modulo 97 muss 1 sein; stellenweise gerechnet, weil eine deutsche IBAN als Zahl 20 Stellen hat und nicht mehr exakt in eine Gleitkommazahl passt. Dazu Pflichtfelder, Fehlermeldung am Feld mit aria-invalid und aria-describedby, und ein Riegel gegen doppeltes Absenden. Dabei fiel auf, dass beide vorbelegten Demo-IBANs ihre eigene Pruefziffer nicht erfuellten (DE21… und DE64…) — korrigiert auf DE93 4145 0075 0000 123456 und DE07 4166 0022 0000 987654. Pruefer gegen 12 Testvektoren belegt, im Browser vom SEPA-Mandat bis zur Bestaetigung durchgespielt. Die mailto-Adressaenderung war bereits mit Warnkasten und Telefonnummer abgesichert." },

    { id: "n-done-portal-feldposition", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "Antwortfeld erschien mobil außerhalb des Sichtfelds",
      text: "Das Feld für Mitgliedschaftswechsel und Lastschriftmandat stand im Markup unter der gesamten Liste. Wer mobil oben eine Kachel antippte, sah nichts passieren — die Antwort öffnete sich weit darunter. Das Feld wandert jetzt direkt hinter die angeklickte Kachel und spannt die volle Rasterbreite; gilt für Services und Mitgliedschaft gleichermaßen." },

    { id: "n-done-sepa-eigener-block", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "Lastschriftmandat löschte die Rechnungsliste",
      text: "Der Knopf stand innerhalb der Rechnungskarte; beim Absenden ersetzte das Formular die gesamte Karte samt Rechnungen. Das Mandat hat jetzt einen eigenen Kasten unter den Rechnungen. Nachgemessen: sechs Listenzeilen vor und nach dem Absenden." },

    { id: "n-done-brett-zielgruppe", page: "kundenportal", selector: "main", status: "auszubauen", done: true,
      title: "Brett fragte auch bei eindeutiger Zielgruppe",
      text: "Der Pflegekurs richtet sich nur an Angehörige, der Bewegungstreff nur an Pflegekundinnen und Pflegekunden — die Rückfrage „für wen\\\" war dort sinnlos. Jede Brett-Zeile trägt jetzt eine Zielgruppe; gefragt wird nur, wo beide gemeint sein können. Sonst steht direkt da, für wen vorgemerkt wurde, formuliert aus Sicht des angemeldeten Kontos." },

    { id: "n-done-eigenanteil-beratung", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "Beratungsweg beim Eigenanteil",
      text: "Der Eigenanteil ist laut Designgrundlage der emotional wichtigste Punkt der Zielgruppe, hatte aber keinen Ausgang. Jetzt drei Wege: sofort anrufen, um Rückruf bitten, beim nächsten Hausbesuch besprechen." },

    { id: "n-done-adresse-ehrlich", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "Adressänderung sagt jetzt, dass nichts ankommt",
      text: "Vorher öffnete sich eine vorbereitete E-Mail an eine erfundene Adresse, ohne das zu sagen. Jetzt zuerst ein Formular mit bisheriger Anschrift vorbelegt und einem Feld für die neue; beide gehen in den Mailtext. Danach steht ausdrücklich da, dass die Nachricht an eine erfundene Adresse geht, nirgends ankommt und eine echte Änderung telefonisch läuft." },

    { id: "n-done-logo-login-links", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Logos auf den Anmeldeflächen verlinkt",
      text: "Investoren-Gate und Cockpit-Anmeldung trugen das Logo ohne Verweis. Beide führen jetzt auf die Startseite, ohne Unterstrich; geprüft, dass der Klick tatsächlich navigiert." },

    { id: "n-done-ueberuns-knopf-umbruch", page: "ueber-uns", selector: "main", status: "offen", done: true,
      title: "Knopf „Gemeinschaft unterstützen“ ragte mobil über die Karte",
      text: "Die Zeile stand auf display:flex ohne flex-wrap, der Knopf trug zusätzlich flex-shrink:0 — auf schmalen Screens blieb seine Breite erzwungen und er lief seitlich aus der Karte statt darunter umzubrechen. Unter 640px schaltet die Zeile jetzt auf Spalte, Knopf zentriert und auf volle Kartenbreite. Josh gemeldet 08.08.2026." },

    { id: "n-done-holthaus-portraet", page: "ueber-uns", selector: "main", status: "offen", done: true,
      title: "Porträt bei Dr. Holthaus hinterlegt",
      text: "Rundes, transparentes SVG-Porträt (portrait-holthaus.svg) über das bestehende Kürzel MH gelegt. Kürzel bleibt als Fallback im Markup vor dem Bild — bei Ladefehler entfernt onerror nur das <img>, das Kürzel wird dann automatisch sichtbar, ohne eigene z-index-Regel. Erste Fassung hatte die Reihenfolge vertauscht: das Kürzel schien durch das Bild durch, weil es im Markup danach stand." },

    { id: "n-done-kundenapp-gebaut", page: "kunden-app", selector: "main", status: "auszubauen", done: true,
      title: "Kunden-App gebaut",
      text: "Neue Datei kunden-app.html nach Funktionsbauplan_Kunden-App.md. app-demo.html blieb unberührt — Änderungen daran nur nach Freigabe. Übernommen von der Portierung: Gerätehülle 393×852, Dynamic Island, Statusleiste, Home-Indikator, untere Reiterleiste, Seitenwechsel per Animation. Nach unserer Festlegung neu: Fläche Creme-warm statt der kühlen #F6F8F3 (das war der 44-Grad-Farbtonsprung), Fließtext 1,19rem, Radius 24, Tippziel 56, Logo Waldgrün. Nur zwei Rollen, mit den Personas aus Sprint 1. Acht Bereiche über fünf Reiter, Aktionen im Bottom-Sheet statt inline." },

    { id: "n-done-kundenapp-namensraum", page: "kunden-app", selector: "main", status: "offen", done: true,
      title: "Kunden-App führt keinen eigenen Namensraum",
      text: "Hildegard Stemmer und Markus Dörre aus dem Personas-Handout, Sandra Köhler und Jana Brinkmann aus den Tourdaten des Cockpits. Damit stimmen Kundenportal und Kunden-App überein; offen bleibt nur der SwiftUI-Prototyp mit Vossenkuhl, Koch und Meier." },

    { id: "n-kundenapp-services-weggelassen", page: "kunden-app", selector: "main", status: "auszubauen",
      title: "Services bewusst nicht in die App übernommen",
      text: "Das Portal hat eine Sammelseite „Services\\\", weil die Aktionen dort über acht Reiter verstreut liegen. In der App sitzt jede Aktion direkt an ihrer Stelle — SEPA unter Rechnungen, Wechsel unter Mitgliedschaft, Beratung unter Eigenanteil. „Mehr\\\" ist nur der Zugang zu den drei Bereichen, die nicht in die Reiterleiste passen. Im Team prüfen, ob das so bleiben soll." },

    { id: "n-kundenapp-iterationsstufen", page: "kunden-app", selector: "main", status: "offen",
      title: "Iterationsstufen V1–V3 noch nicht ausgewiesen",
      text: "Baustein 4 verlangt drei dokumentierte Iterationsstufen. Vorschlag: V1 = SwiftUI-Portierung (app-demo.html), V2 = Kunden-App mit korrekten Personas und Wochenübersicht (dieser Stand), V3 = nach dem Team-Feedback. Muss im Pitch belegbar sein, steht bisher nirgends." },

    { id: "n-zwei-apps-nebeneinander", page: "kundenportal", selector: "main", status: "offen", done: true,
      title: "Auf die Kunden-App festgelegt, doppelter App-Weg aufgelöst",
      text: "ENTSCHIEDEN 13.08.2026 durch Josh: Die App liegt hinter den Zugangsdaten, und zwar die neue Kunden-App. Vorher zeigte die Auswahl „Anmelden als\" auf /app, den älteren Angehörigen-Prototyp, während ein zweiter Verweis unter dem Anmeldeknopf auf /kunden-app führte — zwei verschiedene Apps aus derselben Karte, und der untere Weg umging die Anmeldung, die der obere verlangt. Jetzt: Auswahlgruppe „Kunden-App\" mit Ziel /kunden-app, separater Verweis entfallen. Der ältere Prototyp /app bleibt erreichbar, ist aber nur noch aus der Sprint-Übersicht verlinkt, wo er als Arbeitsstand hingehört." },

    { id: "n-done-kunden-app", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Kunden-App als eigene Datei gebaut",
      text: "kunden-app.html — eigenstaendig, app-demo.html unberuehrt. Optik aus der bestehenden Portierung uebernommen (SF-Pro-Stack, kuehler Gruenverlauf, Liquid Glass, Geraetehuelle 393x852, Hell/Dunkel). Inhalt nach Funktionsbauplan: nur die beiden pitchrelevanten Rollen, Personas Stemmer und Doerre statt Vossenkuhl/Koch, Pflegekraefte Koehler und Brinkmann wie im Cockpit. Fuenf Reiter — Heute, Woche, Nachbarn, Unterlagen, Mehr; Eigenanteil, Mitgliedschaft und Kontakt liegen unter Mehr, weil eine iOS-Tableiste bei fuenf Eintraegen endet. Services bewusst nicht uebernommen: eine Sammelseite ist ein Web-Muster. Kontraste hell 6,35 bis 15,72:1, dunkel 7,56 bis 19,70:1." },

    { id: "n-kunden-app-doppelt", page: "allgemein", selector: "main", status: "offen",
      title: "Vorgefundene Fassung von kunden-app.html gesichert",
      text: "Beim Anlegen existierte bereits eine kunden-app.html (43 kB, funktionsfaehig, dieselben acht Ansichten und Personas), die nicht aus dem Upload-ZIP stammte und die ich keinem Arbeitsschritt zuordnen kann. Sie trug das Portal-Design (Jost/Cormorant auf Creme-warm) statt der App-Optik. Gesichert als kunden-app_portal-optik_gesichert.html ausserhalb des Repos. Vor dem Verwerfen mit Josh klaeren, ob daraus etwas uebernommen werden soll." },

    { id: "n-kunden-app-iterationen", page: "allgemein", selector: "main", status: "auszubauen",
      title: "Iterationsstufen V1 bis V3 ausweisen",
      text: "Baustein 4 verlangt drei Iterationsstufen. Mit app-demo.html (Ausgangsstand) und kunden-app.html (Personenabgleich plus fuenf Bereiche) liegen zwei Staende vor, sind aber nirgends als V1 und V2 bezeichnet. Vor dem Pitch benennen und den dritten Stand festlegen." },

    { id: "n-done-dashboard-integriert", page: "investoren-wettbewerb", selector: "main", status: "auszubauen", done: true,
      title: "Wettbewerbs-Dashboard in den Investorenbereich übernommen",
      text: "Als eigene Seite investoren-wettbewerb.html, aus allen sechs Investorenseiten verlinkt. Migration nach demselben Muster wie der env-invest-Rollout: eigener :root-Block mit 47 Tokens entfernt, lz-tokens.css eingebunden, body auf env-invest, Warnbalken und Pillmenü über lz-notes.js, drei Quellen-Einträge. Der prefers-color-scheme-Block ist entfallen — laut Designgrundlage ist einzig das Cockpit dunkel. Schrift von system-ui auf Jost, Grundfläche von #ffffff auf die Creme der Umgebung, Schriftgröße von festen 14px auf --fs-public." },

    { id: "n-done-dashboard-serienfarben", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Diagrammfarben auf die Serienpalette gezogen",
      text: "Das Dashboard führte sieben eigene Datenreihenfarben plus Aufhellungen. Beim Abgleich zeigte sich, dass die Serienpalette in lz-tokens.css offenkundig aus diesem Dashboard abgeleitet wurde — --series-1 #185FA5 ist mit dem dortigen Blau identisch, die übrigen liegen dicht daneben. 40 harte Hexwerte in den Chart.js-Aufrufen und 22 Variablennamen umgestellt; die Aufhellungen leiten sich jetzt als rgba aus den Serienfarben ab statt als eigene Hexwerte." },

    { id: "n-done-dashboard-b6-b7-b13", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Drei Widersprüche im Dashboard behoben",
      text: "B6: Förderanteil stand auf der Kennzahlenkarte als +16 PP, in der Benchmarkzeile als −16 PP — derselbe Sachverhalt mit entgegengesetztem Vorzeichen, beides auf einem Bildschirm. Jetzt einheitlich +16 PP (38 % gegen 22 % Branche = 16 Punkte höhere Abhängigkeit); die Bewertung trägt die Farbe, nicht das Vorzeichen. B7: Eigenfinanzierung wurde einmal gegen das Ziel 70 % (−8 PP), einmal gegen die Branche 78 % (−16 PP) verglichen — Festlegung vom 08.08.2026: durchgehend gegen das eigene Ziel. B13: das Intensitäts-Array [8, 8.5, 4, 2.5, 4] war zweimal hart kodiert, jetzt eine Quelle." },

    { id: "n-dashboard-potenzial-3mio", page: "investoren-wettbewerb", selector: "main", status: "offen",
      title: "Adressierbares Potenzial 3,0 Mio. € bleibt strittig",
      text: "Steht als Kennzahlenkarte im Dashboard, ist in den Geschäftsmodell-Basisdaten aber ausdrücklich als bekannte Schwachstelle markiert: passt rechnerisch nicht zu ~3.995 Pflegebedürftigen im Einzugsgebiet. Im Quellen-Eintrag vermerkt, inhaltlich nicht angefasst — die Zahl gehört in dieselbe Klärung wie die übrigen Marktvolumen-Angaben." },

    { id: "n-dashboard-einwohner-geklaert", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Einwohnerzahlen: Marktanalyse und Dashboard sind die Quelle",
      text: "Festlegung vom 08.08.2026. Erwitte 20.200 · Bad Sassendorf 13.100 · Anröchte 8.400 · Rüthen 10.700 · Lippetal 8.500. Beim Nachziehen im Webbestand zeigte sich, dass nichts zu ändern war: einzugsgebiet.html und unternehmensdaten.html nennen rund 60.900 Einwohner, was genau der Summe dieser fünf Werte entspricht. Die abweichenden Zahlen stehen nur im Investorpitch-PDF, also außerhalb des Repos." },

    { id: "n-done-dashboard-architektur", page: "investoren-wettbewerb", selector: "main", status: "auszubauen", done: true,
      title: "Dashboard in die Seitenarchitektur eingefügt",
      text: "Der erste Durchgang hatte nur die Farbtokens getauscht — die Seite stand weiter außerhalb der Architektur: eigene Kopfleiste mit LZ-Kachel statt Logo, keine Navigation, keine Fußzeile, keine Überschriften in Cormorant. Jetzt Kopf- und Fußzeile der übrigen Investorenseiten, dunkelgrüner Seitentitel mit Eyebrow und Display-Serife, Abschnittsüberschriften auf Cormorant, Karte im Bausteinraster der Investoren-Startseite. Josh gemeldet 08.08.2026." },

    { id: "n-done-dashboard-kaskade", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Drei Fehler beim Übernehmen der Kopfzeile",
      text: "Erstens hatte mein Extraktor die Mobilregeln aus @media (max-width:1024px) herausgelöst — das Mobil-Layout galt dadurch auf allen Breiten. Zweitens stand der wiederhergestellte Medienblock VOR den Grundregeln und wurde von .nav-toggle{display:none} bei gleicher Spezifität überschrieben; mobil blieb die Navigation offen und der Hamburger verborgen. Drittens fehlte die a-Grundregel, wodurch Logo und Navigation unterstrichen waren. Alle drei nachgemessen behoben." },

    { id: "n-done-dashboard-reiter-sticky", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Reiterleiste rutschte unter die Kopfzeile",
      text: "Die Kopfzeile haftet mit 77px Höhe, die Reiterleiste nicht — beim Scrollen lagen die fünf Reiter darunter und fingen keine Klicks mehr ab. Aufgefallen, weil der Playwright-Klick von der Kopfzeile abgefangen wurde. Reiterleiste haftet jetzt direkt darunter und bleibt während der langen Panels erreichbar." },

    { id: "n-done-dashboard-label", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Doppelte Beschriftung „Übersicht“",
      text: "Der erste Reiter hieß „Übersicht“ wie der Navigationspunkt, der auf die Investoren-Startseite führt — zwei gleiche Beschriftungen mit verschiedenen Zielen auf einem Bildschirm. Reiter heißt jetzt „Überblick“." },

    { id: "n-logout-undefiniert", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "logout() ist auf den Investorenseiten nicht definiert",
      text: "BEHOBEN 13.08.2026. Alle sieben Investorenseiten rufen im Abmelden-Verweis onclick=\"logout(event)\" auf; definiert war die Funktion nur auf investoren.html (mit Gate-Rueckkehr) und investoren-wettbewerb.html. Auf den fuenf Unterseiten kennzahlen, markt, swot, finanzierung und kontakt warf der Klick einen ReferenceError, nur das href hat die Navigation gerettet. Dort jetzt ergaenzt: Sitzungsmarke aufraeumen, kein preventDefault, das href traegt den Sprung nach /investoren, wo das Gate wieder erscheint." },

    { id: "n-done-dashboard-umgebaut", page: "investoren-wettbewerb", selector: "main", status: "auszubauen", done: true,
      title: "Wettbewerbs-Dashboard war strukturell keine Investorenseite",
      text: "Zwei Anläufe zuvor hatten nur Farben und Chrome (Kopf-/Fußzeile) angeglichen — das eigentliche Problem war die Bauweise: eine Tab-App mit .panel/.tab-Mechanik, während jede andere Investorenseite eine durchlaufende Erzählung aus section.block-Abschnitten ist (Eyebrow, Cormorant-Überschrift, Vorspann, Inhalt). Fünf Tab-Panels in fünf section.block umgewandelt, .tabs und switchTab() entfernt, .inv-theme-Klasse ergänzt (fehlte — daran hing der Gradient-Hero, die Vertraulichkeitsleiste und die dunkle Navigationsleiste), .conf-bar ergänzt, Hero auf die echte .inv-hero-Klasse mit Farbverlauf und kursivem Akzent umgestellt, KPI-Karten auf Cormorant-Ziffern. Josh gemeldet 08.08.2026 nach zwei vorangegangenen Versuchen." },

    { id: "n-done-dashboard-versteckte-charts", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Sechs Diagramme initialisierten mit Größe null",
      text: "Nebenbefund beim Umbau: .panel{display:none} versteckte vier der fünf Panels beim Laden, Chart.js maß die darin liegenden Canvas-Elemente aber schon beim Seitenaufbau, unabhängig vom aktiven Tab — kein DOMContentLoaded-Schutz. Radar-, Demo- und Wachstumsdiagramm hätten beim ersten Tab-Wechsel vermutlich leer oder verzerrt gestanden. Seit alle Abschnitte durchgehend sichtbar sind, messen alle sechs Canvas-Elemente reale Pixelmaße statt 0×0 — nachgemessen." },

    { id: "n-done-dashboard-bez-zeile", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Benchmark-Zeile behauptete „Branche Ø“, zeigte aber das Ziel",
      text: "Bei der gestrigen Festlegung (Eigenfinanzierung gegen das eigene Ziel statt die Branche) wurde nur der Zahlenwert auf 70 % geändert, die feste Zeilenbeschriftung „Branche Ø“ blieb stehen — Widerspruch zwischen Text und Zahl in derselben Zeile. Beschriftung ist jetzt je Kennzahl steuerbar; Eigenfinanzierung zeigt „Ziel“, alle anderen weiterhin „Branche Ø“. Section-Überschrift und Legende entsprechend ergänzt." },

    { id: "n-entlastungsbetrag", page: "leistungen", selector: "main", status: "offen", done: true,
      title: "Entlastungsbetrag: geklärt, 131 € ist richtig",
      text: "Ich hatte das als offenen Widerspruch geführt — es war aber schon im Baustein-3-Dokument v3.1 geschlossen: 131 €/Monat, 1.572 €/Jahr, gültig seit 1. Januar 2025. Der Wert 125 € im Personas-Handout ist der Stand vor 2025 und damit veraltet, nicht die Website. Zweiter Rechtsstand aus derselben Quelle: Verhinderungs- und Kurzzeitpflege haben seit 1. Juli 2025 einen gemeinsamen Jahresbetrag von bis zu 3.539 € — die frühere isolierte Nennung von §39 ist überholt." },

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

    { id: "n-gate-optisch", page: "allgemein", selector: "main", status: "spaeter", done: true,
      title: "Investoren-Gate bleibt bewusst nur optisch",
      text: "ENTSCHIEDEN 13.08.2026 durch Josh: Das Gate bleibt rein optisch. Es zeigt, wie ein Investorenzugang aussieht, und schützt nichts — die Zugangsdaten stehen sichtbar daneben, die Sperre liegt im sessionStorage, also im Browser des Besuchers. Damit das niemand verwechselt, steht es jetzt ausdrücklich im Gate: „Kein echter Zugriffsschutz: die Anmeldung ist nachgebildet und gehört zum Planspiel.\" Die vorherige Fassung nannte nur „Demo-Zugang (fiktiv)\", während die Zeile darüber „Vertraulicher Zugang\" versprach. Ein echter Zugriffsschutz wäre auf einer statischen Seite ohne Server ohnehin nicht herstellbar; die ehrliche Formulierung ist hier die Umsetzung, nicht der Verzicht darauf." },

    /* ----- Betriebs-Cockpit (Ausbaustufe 2) ----- */
    { id: "n-done-cockpit1a", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Cockpit Stufe 1a erledigt",
      text: "Login-Dropdown (6 Rollen aus dem Roster), Alt/Neu-reaktive Login-Seite, Berechtigung Ebene A (gesperrte Module ausgeblendet), Logout mit Vorauswahl. Version v2.4.0." },
    { id: "n-cockpit-1b", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Cockpit Stufe 1b erledigt",
      text: "Ebene B: Reiter im Klientenprofil rollenabhängig sperren (sichtbar, deaktiviert, Tooltip) + Ausnahmezugriff ▲ mit Grund-Abfrage und Zugriffsprotokoll." },
    { id: "n-cockpit-roster", page: "cockpit", selector: "#main[data-mod=\"pers\"] > .panel", status: "offen",
      title: "Personalstamm-Nachtrag",
      text: "Brandt (Disposition), Holthaus (GF) und Yilmaz (Pflegekraft) sind Login-/Website-Namen, fehlen aber im 56er-Roster (DB.belegschaft). Nachtragen oder abgleichen." },
    { id: "n-cockpit-stufe2", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Cockpit Stufe 2 erledigt",
      text: "Sechs rollenspezifische Übersichtsseiten als Einstieg — Aufgaben und Abweichungen, nicht Statistik; einheitliches Muster (2–3 Kennzahlen + Aufgabenliste)." },
    { id: "n-cockpit-medifox", page: "cockpit", selector: "#main[data-mod=\"home\"] > .panel", status: "auszubauen",
      title: "MediFox-Herkunftskennzeichnung",
      text: "Gespiegelte Datenblöcke markieren (Quelle: MediFox DAN, Stand 06:00); im Altsystem 2024 zusätzlich eine Störmeldung, dass der Export nach MediFox fehlgeschlagen ist. MediFox ist kein Altsystem." },
    { id: "n-done-cockpit-stufe3", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Cockpit Stufe 3 erledigt",
      text: "Pflegekraft-Ansicht (mobile Handy-Spalte, Doku-Status als Spiegel, Übergabe-Knopf „In MediFox dokumentieren\", Hebel 1) und Ehrenamts-Ansicht (Bindungskennzahlen, Bedarfsabgleich mit Vorschlag, Hauptamt-trifft-Ehrenamt)." },
    { id: "n-done-tbl-scroll", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Tabellen mobil horizontal scrollbar",
      text: "21 Tabellen (bench, ptab, cockpit tbl) in .tbl-scroll gekapselt: overflow-x auto, min-width 560 px (Cockpit 620 px), duenne Scrollleiste in Markenfarbe, ab 760 px wieder ohne Mindestbreite. Vorher sprengte preise.html die Seite um 88 px und investoren-markt um 3 px; jetzt kein Seiten-Overflow mehr bei 390 px. Das Baustein-Board bleibt ausgenommen, es hat schon ein Karten-Layout fuer schmale Screens." },
    /* ----- Designgrundlage v1 (05.08.2026) ----- */
    { id: "n-done-patch-stufe1", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Patch Stufe 1 eingearbeitet",
      text: "Pausenknopf auf var(--fs-label) = 0,80rem (kleinste Schrift jetzt ueberall 12,8 px). Bruecke bildet die neun Altnamen auf Rohwerte ab statt auf Rollen — sonst wuerde --green unter env-invest zu Amber-Ink und --green3 im Cockpit zu Mint. Logo-Detailstufen als Dateien uebernommen, Header nutzt die Kompaktvariante (7 Kreise, Aussenring 3,5 bei Deckkraft 0,55), Cockpit-logoSVG staffelt jetzt nach Groesse: unter 40 px kompakt, darueber mittel mit Pentagon-Kanten und Blatt." },
    { id: "n-done-radius-entscheidung", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Radius traegt die Umgebungsunterscheidung",
      text: "Entscheidung uebernommen: 24 px oeffentlich und Portal (Karten inbegriffen), 14 px Investoren und intern, 4 px Cockpit. Nachgemessen je Umgebung: 24 / 14 / 14 / 4." },
    { id: "n-done-r-bruecke-zirkel", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Zirkel bei --r vermieden",
      text: "Der Patch legte --r: var(--radius) auf :root — dort liefert es immer 24 px und setzt die 14 px von env-invest und env-intern still ausser Kraft (nachgemessen). Auf * verlegt entstand ein echter Zirkel, weil die Umgebungsklassen selbst --radius: var(--r) setzen: beide Werte fielen aus. Loesung ohne Bruecke: die 102 Aufrufe var(--r) in den Seiten sind auf var(--radius) umgestellt, der Rohwert 14 px bleibt fuer die Umgebungsdefinitionen." },
    { id: "n-done-cockpit-mobil-stufe1", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Cockpit mobil, erste Stufe: 420 px waren unerreichbar",
      text: "Bestaetigter Befund: bei 390 px Breite war die Anwendung 810 px breit, body{overflow:hidden} liess 420 px unerreichbar — nicht bloss unbequem. Erste Loesung: unter 900 px wurde die 236-px-Seitenleiste eine horizontal scrollbare Zeile oben, Inhalt volle Breite. Nachgemessen: 0 px unerreichbar, Navigations-Tap-Ziel 48 px. HINWEIS: diese Zwischenstufe ist inzwischen ueberholt, siehe n-done-cockpit-mobil (Schublade statt Scrollleiste). Der Eintrag trug bis 13.08.2026 dieselbe ID wie jener und war damit ein Duplikat in der Registry." },
    /* ----- Designgrundlage v1 (05.08.2026) ----- */
    { id: "n-done-cockpit-balken-doppelt", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Doppelter Warnbalken im Cockpit behoben",
      text: "Das Cockpit hatte bereits einen eigenen .marquee-Balken (22 px, position fixed, z-index 1200) — dafuer war der 22-px-Streifen in #app reserviert. Mein neuer lz-tick kam obendrauf, beide lagen uebereinander. Alter Balken samt CSS und Keyframes entfernt, jetzt genau ein Balken; die Vollbildhuelle misst dessen Hoehe." },
    { id: "n-done-altsystem-navy", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Altsystem-Blau faelschlich als Statusfarbe gemappt",
      text: "Bei der Migration der neun Statustoene auf vier hatte ich #2c4257 und #3a5a78 mit erfasst — das sind aber die Chromfarben des 2024-Altsystems (Kopfleiste, Schalter, KPI-Werte, Links), keine Statusfarben. Sie wurden dadurch zu blassem Statusblau #9CC2CE. Alle acht Stellen auf die eigenen Navy-Werte zurueckgesetzt; das Altsystem bleibt bewusst eigenstaendig." },
    /* ----- Designgrundlage v1 (05.08.2026) ----- */
    { id: "n-done-tokens-intern-cockpit", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Interne Bereiche und Cockpit auf Designgrundlage v1",
      text: "Planspiel-intern: 115 Schriftgroessen auf rem (31 angehoben), env-intern, Warnbalken kommt aus der injizierten Leiste. Cockpit: env-cockpit, eigener Namensraum --n-* auf die Umgebungsklasse verlegt, Warnbalken oben mit gemessener Hoehe. Nachgemessen ueber 21 Seiten: 1554 Kleintexte, keine Verstoesse ausser einem Messartefakt am Systemschalter." },
    { id: "n-done-bruecke-fix", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Fehler in der Kompatibilitaetsbruecke behoben",
      text: "Die Bruecke stand auf :root und loeste die Altnamen deshalb immer gegen die hellen Rootwerte auf — dadurch blieb das Cockpit hell, obwohl env-cockpit gesetzt war. Custom Properties werden dort ersetzt, wo sie deklariert sind. Bruecke auf * verlegt; derselbe Fehler steckte im Cockpit-Namensraum --n-*, der jetzt auf .env-cockpit steht." },
    { id: "n-invest-portal-tokens", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "env-invest und env-portal sind beide durch",
      text: "GEPRÜFT 13.08.2026, beide Umgebungen sind durch. Investorenbereich: alle sieben Seiten tragen env-invest samt inv-theme, Amber-Ink als Akzent und Radius aus der Rolle, und die 370 festen Pixelschriftgrössen sind auf rem umgestellt (siehe n-done-invest-rem). Kundenportal: war entgegen dem Wortlaut dieses Punktes ebenfalls längst umgestellt. Im Browser nachgemessen bindet kundenportal.html lz-tokens.css ein, trägt env-portal am body, hat NULL eigene :root-Blöcke und null feste Pixelschriftgrössen, und die Umgebungsrollen greifen: --fs-body 1.19rem (Fliesstext 19,04px), --lh-body-env 1.7, --tap-env 56px, --surface #FBF4E6 warmes Creme, --radius 24px. Das Logo liest var(--logo), unter env-portal also Waldgrün auf warmem Creme — genau die Vorgabe der Designgrundlage. Lehre daraus, und der eigentliche Grund für diesen Nachtrag: der Punkt stand als offen im Board und wurde in einer Antwort an Josh ungeprüft weitergegeben. Ein Registry-Eintrag ist eine Behauptung über den Code, kein Beweis — bei Ständen aus früheren Sitzungen zuerst messen, dann berichten." },
    /* ----- Designgrundlage v1 (05.08.2026) ----- */
    { id: "n-done-tokens-public", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Designgrundlage v1 im oeffentlichen Bereich umgesetzt",
      text: "lz-tokens.css als Einzelquelle eingebunden, eigene :root-Bloecke auf allen 15 oeffentlichen Seiten entfernt, body traegt env-public. 761 px-Schriftgroessen auf rem umgestellt, davon 163 auf die Untergrenze 0,80rem angehoben (kleinster Wert vorher 9 px). Radius 24px aus der Rolle, Bedienelemente mit --line-ui und 48px Tap-Ziel, Emojis durch SVG-Icons ersetzt, Fiktiv-Balken als lz-tick mit Pausensteuerung (96s, aria-pressed, prefers-reduced-motion). Nachgemessen: 1128 Kleintexte, kein Verstoss unter 4,5:1, keine px-Schriftgroesse mehr." },
    { id: "n-tokens-weitere-umgebungen", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Tokens auf intern und Cockpit ausgerollt",
      text: "env-intern (5 Planspiel-Seiten) und env-cockpit umgesetzt. Cockpit: 94 px-Schriftgroessen auf rem (74 davon unter 12,8 px, kleinste 8,5 px), 64 Farbwerte auf semantische Rollen, neun Statustoene auf die vier Tinten zusammengefuehrt, Warnbalken mit Pausensteuerung ergaenzt (Vollbildhuelle misst die Balkenhoehe). Offen bleiben env-invest und env-portal." },
    { id: "n-tokens-bruecke-abbauen", page: "allgemein", selector: "main", status: "spaeter",
      title: "Kompatibilitätsbrücke: noch nicht abbaubar, Zählstand 2.380 Aufrufe",
      text: "GEPRÜFT 13.08.2026 auf die Frage, ob der Abbau noch relevant ist. Antwort: relevant ja, möglich nein — und zwar mit großem Abstand. Abschnitt 7 in lz-tokens.css bildet Altnamen auf Rohwerte ab; gezählt über alle 47 Dateien der Auslieferung hängen daran 2.380 var()-Aufrufe. Die großen Brocken: --green 631, --cream 309, --text2 295, --border 259, --green3 186, --mint 155, --sage 104, --cream2 88, --green2 73, --amber 46, --red 42, --amber-ink 42, --forest 40, --maxw 26, --cream-warm 21, --amber-deep 10, --text3 8, --green-deep 8, --red-err 7, --mint-soft 1. Ein Abbau in einem Schritt bräche die Farbgebung praktisch der gesamten Website. Sofort erledigt wurde der einzige risikofreie Teil: --cream3 und --parchment hatten null Aufrufe und sind entfallen (die Rohtokens --lz-cream-3 und --lz-parchment bleiben). Der Rest braucht den Weg, der im Punkt schon stand: seitenweise auf Rollen umstellen, dann zählen, dann ziehen. Solange die Zählung nicht bei null steht, ist der Abbau kein Aufräumen, sondern ein Ausfall. Frühere Fassung dieses Punktes nannte die Brücke „sollte entfallen, sobald alle Seiten Rollen lesen\" — ohne Zahl, weshalb sie zweimal als beinahe fertig eingeschätzt wurde." },
    { id: "n-tick-pause-groesse", page: "allgemein", selector: ".lz-tick-pause", status: "offen", done: true,
      title: "Pausenknopf auf 0,80rem angehoben",
      text: "Die Designgrundlage setzt fuer .lz-tick-pause font-size:.72rem (11,5 px) fest und verletzt damit ihre eigene Untergrenze von 0,80rem. Bewusst uebernommen wie geliefert. Entscheidung: entweder auf 0,8rem anheben oder die Ausnahme im Dokument benennen, wie beim 44px-Tap-Ziel im Cockpit." },
    { id: "n-logo-kompaktvariante", page: "allgemein", selector: ".logo-lockup", status: "offen", done: true,
      title: "Logo-Detailstufen eingebaut",
      text: "Designgrundlage, Umsetzungsfehler 2: Die Vollversion mit fuenfzehn Linien, zwei Ringen und Blatt wird im Header bei 38 px gezeichnet und ergibt einen Fleck. Vorgesehen ist die Vollversion ab 120 px, die Kompaktvariante fuer 24 bis 40 px. Kompaktes Emblem zeichnen und im Header einsetzen." },
    /* ----- Rueckmeldungen 29.07. ----- */
    { id: "n-done-pin-anker", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "To-Do-Marker sitzen jetzt am Text",
      text: "Die meisten Notizen hatten selector main — der Pin landete dadurch am Seitencontainer statt am gemeinten Inhalt. Zwoelf Notizen haben praezise Anker bekommen (Ueberschrift, Chronik, Gruenderin-Karte, Board-Zeile, KPI-Kachel, Preistabelle). Ohne Treffer wird kein Streu-Pin mehr gesetzt." },
    { id: "n-done-token-selbstbezug", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Unsichtbares Offen-Badge behoben",
      text: "Ursache war ein Fehler aus meiner Token-Umstellung: In den :root-Definitionen standen selbstbezuegliche Deklarationen wie --red: var(--red, #8C3A2A). Dadurch war --red ungueltig und das Offen-Badge transparent. 171 Deklarationen in 28 Dateien repariert; Badge jetzt 7,63 : 1." },
    { id: "n-done-todo-kategorien", page: "notizen", selector: "main", status: "auszubauen", done: true,
      title: "To-Dos nach Kategorien sortiert und filterbar",
      text: "Vierte Filtergruppe: Hauptseite, Zugaenge, Planspiel, Betriebs-Cockpit, Technik & Uebergreifend. Gruppen erscheinen in dieser Reihenfolge; jede Karte zeigt zusaetzlich Sprint- und Kategorie-Chip." },
    { id: "n-done-cockpit-gf", page: "cockpit", selector: "main", status: "auszubauen", done: true,
      title: "Cockpit-Login mit Geschaeftsfuehrung vorbelegt",
      text: "Beim Aufruf ist Dr. Maria Holthaus vorausgewaehlt — damit sind ohne weiteren Klick alle 15 Module sichtbar." },
    { id: "n-done-karte-oeffentlich", page: "einzugsgebiet", selector: ".loc-map", status: "auszubauen", done: true,
      title: "Karte von internen Daten befreit",
      text: "Einwohnerzahlen, Altersquoten, Durchschnittsalter, Trendbewertungen und interne Notizen sind aus der oeffentlichen Standortkarte entfernt. Die Popups zeigen jetzt Name, Rolle und Leistungsangebot. Im Cockpit bleiben die Kennzahlen erhalten." },
    { id: "n-done-tagebuch-sprint1", page: "prompt-tagebuch", selector: ".sx-log", status: "auszubauen", done: true,
      title: "Prompt-Tagebuch Sprint 1 eingearbeitet",
      text: "24 Sessions aus dem Teamdokument im aktuellen Design uebernommen: aufklappbare Karten mit allen neun Feldern, Baustein- und Strategie-Chips, Kritiker-Kennzeichnung, plus die vier Prompt-Strategien und die Abschluss-Reflexion." },
    { id: "n-persona-alter", page: "sprints", selector: ".bst", status: "offen", done: true,
      title: "Hildegard Stemmer auf 79 Jahre und Pflegegrad 2 vereinheitlicht",
      text: "BEHOBEN 13.08.2026. Keine Ermessensfrage, sondern eine Quellenfrage: das Personas-Handout führt sie wörtlich als „Hildegard Stemmer, 79 · Ruethen-Meiste · Pflegebeduerftige · Pflegegrad 2 · Rente ~1.050 EUR/Monat\" (im Projekt nachgelesen), das Session-Log nennt dasselbe, und Baustein 1 aus Sprint 2 arbeitet ausschliesslich mit diesem Set. Nur das Cockpit führte 82/PG 3 — und mit ihm Kundenportal und Kunden-App, die den Wert übernommen hatten. Nach der Kennzahlenregel gilt die neuere, korrigierte Fassung. Angepasst an drei Stellen. Wichtig dabei: der Pflegegrad zieht die abgeleiteten Zahlen mit, denn der Sachleistungsbetrag hängt daran — Cap von 1.432 EUR (PG 3) auf 761 EUR (PG 2), und bei unveränderter Ausschöpfung von 41 Prozent abgerufen 587 auf 312 und offen 845 auf 449. Ein reiner Austausch der Zahl 3 gegen 2 hätte eine Klientin mit PG 2 und einem PG-3-Budget erzeugt." },
    /* ----- Datenpruefung Five Forces & Investorenbereich ----- */
    { id: "n-done-inv-haupttext", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Investorenbereich: Haupttext vollstaendig verlinkt",
      text: "Vorher hingen die Marker nur an den KPI-Kacheln. Jetzt sind auch Benchmark-Tabelle, Umsatzstruktur, Demografie- und Wettbewerbskarten, SWOT-Quadranten, Faktor-Priorisierung, die drei Saeulen, Mittelverwendung und die Herleitungshinweise erfasst — Registry von 47 auf 70 Datenpunkte. Deckung je Seite: Uebersicht 7, Kennzahlen 10, Markt 17, SWOT 11, Finanzierung 8, Kontakt 3 (dort stehen keine Daten)." },
    { id: "n-done-fiveforces", page: "sprints", selector: "main", status: "offen", done: true,
      title: "Five Forces korrigiert (4 von 5 Werten falsch)",
      text: "Die Sprint-Uebersicht zeigte Branchenrivalitaet 2/5, Kundenmacht 3/5, Lieferantenmacht 3/5 und Ersatzangebote 4/5. Original (Investorpitch S. 9, bestaetigt S. 11): Lieferantenmacht 4/5, Substitute 3/5, Wettbewerbsintensitaet 3/5, Neue Wettbewerber 2/5, Kundenmacht 2/5. Alle fuenf korrigiert und mit Quellenangabe versehen." },
    { id: "n-done-fiveforces-inv", page: "investoren-markt", selector: ".bench", status: "offen", done: true,
      title: "Five Forces im Investorenbereich vervollstaendigt",
      text: "Substitute stand ohne Zahl (nur steigend) und die fuenfte Kraft Wettbewerbsintensitaet fehlte ganz. Substitute jetzt 3/5, Wettbewerbsintensitaet 3/5 ergaenzt — damit stimmen Website und Pitch-Deck ueberein." },
    { id: "n-done-quellen-investoren", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Investorenbereich auf Quellen geprueft",
      text: "Alle 13 Kennzahlen der sechs Investorenseiten gegen die Unterlagen geprueft und mit Datei, Seite, Abschnitt und Belegstufe in die Registry aufgenommen (jetzt 47 Datenpunkte)." },
    { id: "n-inv-umsatz-je-fall", page: "investoren-kennzahlen", selector: ".kpi-row .kpi-item:nth-child(3)", status: "offen", done: true,
      title: "11.700 EUR je Pflegefall mischt Foerdermittel ein",
      text: "BEHOBEN 13.08.2026. Beide Bezugsgroessen stehen jetzt da statt einer: Kachel benennt \"Gesamtumsatz je Pflegefall p. a. (inkl. Foerdermittel)\" fuer die ~11.700 EUR, die Benchmark-Tabelle fuehrt zusaetzlich \"nur Pflegeumsatz SGB XI/V\" mit ~6.400 EUR (1,15 Mio / 180). Im selben Zug die Kachel \"101 Team inkl. 45 Ehrenamtliche\" auf \"56 + 45\" aufgeloest — Kopfzahlen werden nicht addiert, dieselbe Regel wie bei Pflegeumsatz und Foerdermitteln." },
    { id: "n-inv-175mio", page: "investoren-markt", selector: ".bench", status: "offen",
      title: "Marktzeile 1,75 Mio ohne Beleg",
      text: "Die Makro-Tabelle nennt ambulante Dienste ~1,75 Mio (~35 % aller Pflegebeduerftigen) mit Quellenangabe Destatis 2021 — diese Zahl steht in keiner Sprint-Unterlage. Entweder Einzelnachweis nachtragen oder Zeile entfernen." },
    { id: "n-inv-zieljahre", page: "investoren-finanzierung", selector: ".bench:nth-of-type(1)", status: "offen",
      title: "Zieljahre und Foerderquote nicht belegt",
      text: "70 %+ Eigenfinanzierung ist belegt, die Jahreszahl 2027 nennt keine Unterlage. Foerderanteil strukturell unter 30 % ist plausibel (SWOT S. 2: Branche 20–25 %), aber nicht als Ziel dokumentiert. Belegt ist hingegen 8 Stellen bis Q4 2026 (SWOT S. 6). Vor dem Pitch entweder herleiten oder Zeitangaben streichen." },
    { id: "n-inv-branchenschnitt", page: "investoren", selector: ".kpi-item", status: "offen", done: true,
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
      title: "Chronik-Jahreszahlen nicht belegt",
      text: "Korrigierte Pruefung: Die Vision IST belegt \u2014 SWOT-Analyse S. 6, Von der Nische zum Pflege-Oekosystem im laendlichen NRW (2026-2031). Unbelegt bleiben nur die Jahreszuordnungen der Chronik: 2021-2022 Wachstum in die Flaeche und das Einfuehrungsjahr 2023 des Mitgliedschaftsmodells (die Staffel selbst ist belegt). Entweder belegen oder als Erzaehlung kennzeichnen." },
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
      text: "Tagesansicht mit Störung (Disposition): Dienstag 07:12, 2 Krankmeldungen / 3 Touren; Vorschlagsliste prüft §37.3-Qualifikation und Zeitfenster, Ein-Klick-Umplanung; 2024-Telefonzettel-Version. Zugleich Sprint-4-Vorlage." },

    { id: "n-done-praesentationsschicht", page: "praesentation", selector: "main", status: "auszubauen", done: true,
      title: "Präsentationsschicht gebaut — Investorpitch Sprint 1, 24 Folien",
      text: "/praesentation.html: Vollbild-Foliendeck mit allen 24 Folien des Investorpitch_20min.pdf — Reihenfolge, Eyebrows, Minutenmarken, Fußzeilen und die drei dunklen Akzentfolien (Lieferantenmacht, Stoßrichtung, Investment Case) folgen dem Original. Foliendaten (SLIDES) vollständig getrennt vom Layout, ein Stylesheet (lz-tokens.css), kein zweiter :root-Block. Bedienung: Pfeiltasten, Leertaste, Home/End, 0 für das Folienverzeichnis, F für Vollbild, Esc zurück, Wischen am Telefon, Direktlink je Folie über #12. Vollbild-Ausnahme dokumentiert: Warnbalken verschwindet nur im echten Vollbild. Einstieg als dezenter Textlink UNTER den Bausteinkarten auf /investoren (kein CTA-Band — die Präsentation zeigt dieselben Inhalte wie die Karten)." },

    { id: "n-done-praesentation-einpassung", page: "praesentation", selector: "main", status: "auszubauen", done: true,
      title: "Folien passen sich in den Rahmen ein statt zu scrollen",
      text: "Gemessen: bei 1920x1080 passte alles, bei 1440x900 waren acht und bei 1280x800 elf Folien zu hoch (Folie 3 um 201 px, Folie 12 um 192 px). Eine Präsentation wird nicht gescrollt, deshalb verkleinert fitSlide() den Folieninhalt über die Eigenschaft --fit. Zwei Messwege waren nachweislich falsch: scrollHeight des Rahmens ändert sich unter zoom überhaupt nicht, und getBoundingClientRect des gezoomten Elements liefert seine Größe im eigenen, noch nicht skalierten Raum (Chrome 141: zoom 0.5 gesetzt, Rechteckhöhe unverändert 861 px). Richtig ist Rechteckhöhe MAL Zoomfaktor. Ergebnis: 1024x768 bis 1920x1080 ohne Überhang. Am Telefon wird bewusst NICHT eingepasst — dort bräuchten fast alle Folien den Anschlag 0,68 und wären unlesbar, Scrollen ist die richtige Bedienung. Korrekturhinweise sind eingeklappte <details>; beim Aufklappen wird neu eingepasst." },

    { id: "n-done-cockpit-ordner-weg", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Ordner cockpit/ aus der Auslieferung entfernt, Schlussstrich zentral",
      text: "BEHOBEN 13.08.2026. In der Auslieferung lag als einziger Ordner ein cockpit/ mit einer index.html, die per meta-refresh und location.replace auf /cockpit weiterleitete — eine Sonderlösung für genau eine von 24 Seiten. Nachgeprüft war sie doppelt sinnlos: es verweist nirgends etwas auf /cockpit/ mit Schlussstrich, und live liefert /cockpit/ trotz des Ordners 404 (geprüft, ebenso /notizen/ und /sprints/, die nie einen solchen Ordner hatten). Ordner entfernt, das Verzeichnis ist wieder flach. Die eigentliche Frage — Adressen mit Schlussstrich — löst jetzt 404.html für ALLE Seiten: endet der Pfad auf einem Strich, wird einmalig ohne Strich nachgeschlagen. Zwei Sicherungen gegen eine Schleife: die Ersatzadresse endet nie auf einem Strich, und ein Merker in der Sitzung lässt pro Adresse genau einen Versuch zu. Ohne verfügbaren Speicher wird gar nicht weitergeleitet — lieber die 404-Seite als eine mögliche Endlosschleife." },

    { id: "n-done-praes-einstieg-investoren", page: "investoren", selector: "main", status: "auszubauen", done: true,
      title: "Präsentation: ein Einstieg, unten auf der Investoren-Startseite",
      text: "BEHOBEN 13.08.2026. Die Präsentation hatte drei Einstiege: Planspiel-Menü, Reiterzeile der Sprint-Übersicht und Textverweis auf /investoren. Zwei davon am falschen Ort — die Präsentation ist der Investorenpitch, ihr Publikum sind die fiktiven Investoren, nicht das Planspiel-Team. Beide entfallen. Geblieben ist der Platz unten auf der Investoren-Startseite, dort aber nicht mehr als Textverweis, sondern als Pillenreihe in der Form der Sprint-Übersicht: Maße aus deren .tab übernommen (Radius 30px, Polsterung 9/16px, 0.88rem, Statuspunkt 8px), damit die Reihe auf beiden Seiten als dasselbe Bauteil gelesen wird. Sie ist als Reihe angelegt, nicht als einzelner Knopf, weil sie mit jedem Pitch wächst — Sprint 2 steht schon als gestrichelte, nicht anklickbare Pille daneben. Beides bewusst: ein Verweis auf eine Präsentation, die es nicht gibt, wäre ein toter Weg, ein unsichtbarer Platz würde nicht zeigen, dass die Reihe wächst. Die Absicherung im Reiter-Handler der Sprint-Übersicht (kein data-t, kein Umschalten) bleibt stehen, obwohl die Pille dort wieder weg ist — sie kostet nichts und verhindert eine leere Seite." },

    { id: "n-done-portal-burger-app", page: "kundenportal", selector: "main", status: "auszubauen", done: true,
      title: "Kundenportal: Burger überall, App hinter den Zugangsdaten, Fusszeile ergänzt",
      text: "BEHOBEN 13.08.2026, vier Punkte. Erstens die Bereiche: das Portal hatte zwei Navigationen, eine waagerechte Reiterzeile für den Desktop und die Schublade fürs Telefon, beide aus derselben Liste gebaut und beide mit eigenem Zustand. Acht Bereiche in einer Zeile brachen bei 860px auf zwei Zeilen um, also ein zweiter waagerechter Balken unter der Kopfzeile. nav.reiter ist komplett entfallen, Markup, CSS und Aufbau; es gibt nur noch die Schublade, auf jeder Breite. Zweitens die App: die Auswahl „Anmelden als\" zeigte auf /app, den älteren Prototyp, während ein zweiter Verweis unter dem Knopf auf /kunden-app führte. Jetzt liegt die Kunden-App in der Auswahl, der separate Verweis ist weg — ein Weg, und er führt durch die Anmeldung. Drittens die Fusszeile: es gab schon eine schmale, sie bleibt schmal. Eine vierspaltige Marketing-Fusszeile gehört nicht in einen angemeldeten Bereich; ergänzt sind nur das Logo als Weg zurück auf die Website (die Kopfzeile hat es, die Fusszeile nicht, und gescrollt wird nach unten) und der Leistungskatalog. Viertens der Anmeldeschirm der Kunden-App: er trug Logo, Claim-Zeile, Trennstrich, Frage, zweizeiligen Fiktiv-Hinweis und die Wertezeile „nah · vernetzt · nachhaltig\" — sechs Textblöcke vor zwei Knöpfen auf 390px Breite. Claim und Wertezeile entfallen (unter 40px Logohöhe ist laut Designgrundlage ohnehin nur die Kurzform ohne Claims zulässig, und die Wertezeile sagte dasselbe ein zweites Mal), der Fiktiv-Hinweis steht jetzt in einer Zeile. Er bleibt, weil er Pflicht ist und nicht Schmuck." },

    { id: "n-done-board-stand-sprint", page: "notizen", selector: "main", status: "auszubauen", done: true,
      title: "To-Do-Board: „Später\" von der Stand-Achse auf die Sprint-Achse",
      text: "BEHOBEN 13.08.2026. Das Board mischte zwei Achsen. In der Gruppe „aktueller Stand\" stand ein Knopf „Später\" neben Offen, Auszubauen und Erledigt — „später\" sagt aber nichts über den Bearbeitungsstand, sondern über den Termin. Derselbe Fehler in der Karte „Späterer Sprint\", die als vierte Stand-Angabe neben zwei Achsen stand, und in der Notizmarke: Punkte mit Registry-Status „spaeter\" trugen „Späterer Sprint\" als Stand-Marke und daneben „ohne Sprint\" als Sprintmarke — zwei Angaben, die sich widersprachen. Umgebaut: Stand-Gruppe jetzt Offen · Auszubauen · Erledigt, Sprintgruppe S1 · S2 · Später. Zwei Ableitungen trennen die Achsen, ohne die Registry anzufassen (deren status steuert auch die Pinfarben auf den Seiten): standOf() bildet „spaeter\" auf „auszubauen\" ab, denn es sind Ausbaupunkte, nur eben nicht jetzt; sprintOf() gibt 1, 2 oder „spaeter\", wobei alles jenseits von Sprint 2 zusammenfällt — die Zuordnung ab Sprint 3 ist laut Phasenübersicht ohnehin nur eine Annahme, eine Aufschlüsselung in S3/S4 würde eine Genauigkeit behaupten, die es nicht gibt. Die Karten sind jetzt disjunkt, „Offen gesamt\" ist genau offen plus auszubauen plus später: nachgemessen 41 = 19 + 19 + 3. Beim Umbau abgesichert: der Statusfilter prüft standOf() statt n.status, sonst wären die drei später-Punkte bei jeder Stand-Auswahl aus der Liste gefallen. Die Sprintmarke „Späterer Sprint\" ist gestrichelt statt in einer sechsten Farbe." },

    { id: "n-done-sprints-praes-pille", page: "sprints", selector: "#tabs", status: "auszubauen", done: true,
      title: "Präsentation als Pille in der Reiterzeile der Sprint-Übersicht",
      text: "BEHOBEN 13.08.2026. Der Einstieg lag bisher nur im Planspiel-Menü (dort ebenfalls als Pille, gemessen 30px Radius auf allen Seiten) und als Textlink auf /investoren — auf der Sprint-Übersicht selbst, wo die Sprints in Pillenform stehen, fehlte er. Jetzt am Ende der Reiterzeile: „Präsentation Sprint 1 →\", Klasse .tab für die Form, .tab-go für den Unterschied — gestrichelter Rahmen in Waldgrün, kein Statuspunkt davor, denn es ist ein Weg aus der Seite heraus und kein Reiter. Der Reiter-Handler prüft jetzt auf data-t und lässt das Element durch; ohne diese Prüfung hätte er t auf undefined gesetzt, alle Reiter ausgeschaltet und kein Panel stehen gelassen — die Seite wäre beim Klick kurz leer geworden, bevor der Verweis greift. margin-left:auto schiebt die Pille ans rechte Ende, unter 640px entfällt das." },

    { id: "n-done-invest-rem", page: "*", selector: "main", status: "auszubauen", done: true,
      title: "Investorenseiten: 370 Schriftgrößen von px auf rem",
      text: "BEHOBEN 13.08.2026. Der Hinweis stimmte zur Hälfte. Falsch war „keine env-invest-Klasse gesetzt\": alle sieben Investorenseiten tragen <body class=\"env-invest inv-theme\">, geprüft. Richtig waren die festen Pixelwerte: 370 font-size-Angaben in px, 42 bis 70 je Datei. Feste Pixel ignorieren die Schriftgrößeneinstellung des Browsers — genau das, was das rem-System verhindern soll. Umgestellt mit dem Faktor 1/16. Nachgewiesen pixelgleich: die berechnete Schriftgröße aller 2.502 Elemente der sieben Seiten wurde vor und nach der Umstellung verglichen, null Abweichungen. Dabei aufgefallen und korrigiert: 11,5px und 13,5px brauchen fünf Nachkommastellen (0.71875rem, 0.84375rem) — auf vier gerundet ergaben sich 11,5008px, sichtbar nur im Messwert, aber vermeidbar. Wirkungsnachweis: bei einer Wurzelgröße von 20px wächst die Summe der Schriftgrößen auf /investoren-swot von 4.699 auf 5.063 px, vorher blieb sie unverändert. Keine Überbreite bei 1440 und 390 px, keine Skriptfehler. NICHT angefasst: 148 der 370 Werte liegen unter der Projektuntergrenze von 0.80rem (12,8px, in lz-tokens.css als „absolute Untergrenze\" bezeichnet) — 69-mal 12px, 36-mal 11px, 18-mal 10px, 17-mal 9px, 8-mal 11,5px. Das Anheben ist eine sichtbare Gestaltungsentscheidung: 9px auf 12,8px sind 42 Prozent mehr, und ein pauschales Anheben würde die Abstufung innerhalb dieses Bandes einebnen (9, 10, 11, 11,5 und 12 px fielen auf einen Wert zusammen). Braucht eine Entscheidung, siehe n-invest-schriftuntergrenze." },

    { id: "n-invest-schriftuntergrenze", page: "*", selector: "main", status: "offen",
      title: "148 Schriftgrößen unter der eigenen Untergrenze 0.80rem",
      text: "Auf den sieben Investorenseiten liegen 148 von 370 Schriftgrößen unter 0.80rem, das lz-tokens.css selbst als absolute Untergrenze führt: 69-mal 0.75rem, 36-mal 0.6875rem, 18-mal 0.625rem, 17-mal 0.5625rem, 8-mal 0.71875rem. Betroffen sind vor allem Tabellenköpfe, Eyebrows, Chip-Beschriftungen und die Präsenzmatrix. Zwei Wege: (a) alles unterhalb der Grenze auf 0.80rem heben — regelkonform, aber die Abstufung im kleinen Band verschwindet und die Matrix wird breiter, sie scrollt dort ohnehin schon; (b) das Band gestaffelt anheben, etwa 0.5625/0.625 auf 0.80 und 0.6875/0.71875/0.75 auf 0.84, dann bleibt eine Abstufung erhalten, aber es entstehen zwei Werte ausserhalb der Tokenleiter. Entscheidung offen." },

    { id: "n-done-app-zugang-portal", page: "kundenportal", selector: "main", status: "auszubauen", done: true,
      title: "Kunden-App nur noch über das Kundenportal erreichbar",
      text: "BEHOBEN 13.08.2026. Der Direktlink „Kunden-App\" stand in der Fusszeilen-Spalte „Zugänge\" auf 22 Seiten und damit gleichrangig neben Investoren, Partner, Karriere, Cockpit und Kundenportal — die App ist aber kein eigener Zugang, sondern eine Darstellungsform des Portals. Auf allen 22 Seiten entfernt. Der Weg führt jetzt ausschliesslich über /kundenportal. Der dortige Verweis stand als graue Beizeile („Lieber als App?\") ÜBER dem Anmeldeformular und wäre als einziger Einstieg zu unauffällig gewesen; er sitzt jetzt unter dem Anmeldeknopf als eigener Block „Separater Zugang\" mit Trennlinie, unterstrichenem Verweis und einer Zeile Erklärung. Bewusst ausserhalb des Anmeldevorgangs: ein zweiter Weg, keine Auswahl im Formular." },

    { id: "n-done-cockpit-alt-logofarbe", page: "cockpit", selector: "#side", status: "auszubauen", done: true,
      title: "Alt-Modus: Logofarbe tokenbasiert und regelkonform",
      text: "BEHOBEN 13.08.2026. render() setzte die Logofarbe im Altsystem-Modus hart auf #5a6e52 (Waldgrün) — der einzige harte Hexwert in der Logoausgabe. Waldgrün ist laut Logo-Farbregel die Farbe für warme Beige- und Cremeflächen. Die Seitenleiste des Altmodus ist aber #f4f4f4, gemessen rgb(244,244,244), also hell und neutral, und dort gilt Originalgrün. Der ursprüngliche Hinweis vermutete einen dunklen Hintergrund — das trifft nur auf den neuen Modus zu (#111813), der bereits korrekt var(--accent), also Salbeigrün, verwendet. Jetzt var(--lz-green) im Alt- und var(--accent) im Neumodus, beide aus dem Tokensystem. Nachgerechnet ist Originalgrün auch der bessere Wert: 5,77:1 gegen 5,04:1 auf #f4f4f4. Der biedere Eindruck des Altmodus hängt an Tahoma, der grauen Rahmung und der gedämpften Wortmarke (#444) — dafür muss das Logo nicht gegen die eigene Farbregel verstossen. Geprüft durch Umschalten: Neumodus rgb(138,172,133), Altmodus rgb(74,103,65)." },

    { id: "n-done-fiktiv-banner-vollstaendig", page: "*", selector: "main", status: "auszubauen", done: true,
      title: "Fiktiv-Banner: Bestandsaufnahme und letzte Lücke geschlossen",
      text: "GEPRÜFT 13.08.2026. Der Hinweis, der Balken fehle auf kundenportal.html, notizen.html und website-status.html, ist überholt: er steht dort nicht im Markup, wird aber von ensureBar() in lz-notes.js eingefügt — im Browser gemessen liegt auf allen drei Seiten genau ein .fiktiv-bar, mit korrekt gesetztem --tick-h. Ebenso überholt der Hinweis, der Cockpit-Balken habe keine Verlinkung: der Balkentext IST der Auslöser, upgradeBar() macht daraus einen <button>, der das Planspiel-Menü öffnet. Ein <a href> wäre hier auch falsch — der Balken öffnet ein Menü, die Verweise stehen darin. Tatsächlich offen war eine andere Seite: typo-vergleich.html trug als einzige Datei der Auslieferung überhaupt keinen Fiktiv-Hinweis, weder Balken noch Fusszeilentext, und ist über ihre Adresse erreichbar, obwohl von nirgends verlinkt. lz-notes.js dort nachgetragen. Bewusst NICHT nachgetragen in standortkarte.html: die liegt als iframe in einzugsgebiet.html, die Elternseite trägt den Balken, ein zweiter im Rahmen wäre doppelt. Ebenfalls nicht angefasst app.html und app-demo.html — Zwei-Sperren-Regel, Änderungen dort brauchen Freigabe. Befund dazu: app-demo.html enthält KEINEN Fiktiv-Hinweis, kunden-app.html dagegen einen eigenen im App-Design. Dabei gefunden und behoben: standortkarte.html hatte keine Ausfallsicherung für Leaflet — fehlte das CDN, brach das Skript in der ersten Zeile ab und im iframe blieb eine leere Fläche ohne Hinweis, von aussen unsichtbar. Jetzt Hinweis statt Abbruch, wie im Cockpit und beim Wettbewerbsdashboard." },

    { id: "n-done-pillmenue-vorbelegung", page: "*", selector: "main", status: "auszubauen", done: true,
      title: "Pillmenü: Erststart mit To-Do's und Quellen ein, Fussgruppen ergänzt",
      text: "BEHOBEN 13.08.2026. Vier Befunde am Planspiel-Menü. Erstens die Vorbelegung: beide Schalter lasen ihren Zustand mit getItem(...) === \"1\", und ein fehlender Schlüssel liefert null — beim ersten Besuch war also alles aus, und wer die Seite nicht kannte, fand weder Pins noch Belege. Jetzt wird zwischen „noch nie entschieden\" (null → ein, und gleich festgeschrieben) und „bewusst ausgeschaltet\" (\"0\" → bleibt aus) unterschieden; ohne Speicher gilt ebenfalls ein. Zweitens die Darstellung: in lz-quellen.js lief mountToggle() VOR dem Laden des Zustands und rief syncLabel() mit on === false — die Lampe stand auf Rot, der Zähler auf 0, während die Belege sichtbar waren. Der Fehler traf schon vorher jeden, der die Belege eingeschaltet und neu geladen hat; mit der neuen Vorbelegung fiel er nur endlich auf. Reihenfolge umgestellt, syncLabel() nach dem Aufbau. Drittens der Zähler selbst: gezählt wurden Registry-Treffer, nicht tatsächlich platzierbare Belege — auf /praesentation meldete der Schalter „3\", obwohl die drei Sammeleinträge (page \"*\") auf .logo-lockup, header.site und footer.site zeigen und keines davon auf der Bühne existiert. Gezählt wird jetzt, was auch erscheinen kann. Viertens neu: unten im Menü stehen „Präsentationen · Sprint 1\" (führt auf /praesentation) und „Wissensbasis · Confluence\" (Raum LZ, extern, mit sichtbarem Hinweis „extern · Login\" im Knopf statt im title — ein title erscheint erst nach Verweilen und am Telefon nie). Beide werden von ensureMenuFooter() ergänzt, nicht 21-mal im Markup: das Menü steht auf 21 Seiten inline und wird auf den übrigen von menuHTML() erzeugt, ein Codeweg deckt beide ab. Der Quellenschalter hängt sich dafür jetzt direkt hinter den To-Do-Schalter statt ans Menüende, sonst wäre die Menüfolge von der Ladereihenfolge der beiden Skripte abhängig gewesen. Das Menü ist damit auf 699 px gewachsen und stiess auf 375x667 unten aus dem Bild — es hängt absolut in einer fixierten Leiste und konnte nicht mitscrollen; jetzt begrenzt auf die Resthöhe unter dem Warnbalken mit eigenem Scrollen." },

    { id: "n-done-wettbewerb-kopf-fuss", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Kopfzeile randlos, Fußzeile wieder mehrspaltig",
      text: "BEHOBEN 13.08.2026. Zwei getrennte Ursachen, beide beim Übernehmen der Kopf- und Fußzeile aus den übrigen Investorenseiten entstanden. Erstens stand direkt nach <body> ein <div class=\"page\"> ohne schließendes Gegenstück; .page trägt max-width und 32 px Seitenpolsterung und zwang damit Warnbalken, Kopfzeile UND Fußzeile in die Inhaltsbreite — auf jeder anderen Investorenseite sind das freistehende Elemente direkt unter <body>. Kein Skript greift auf .page zu, die Breitenbegrenzung besorgt ohnehin .wrap in jeder Sektion, deshalb ist der Wrapper ganz entfallen. Zweitens standen die beiden responsiven Regeln der Fußzeile (grid-template-columns 1fr 1fr sowie 1fr) ohne umgebende @media-Klammer im Stylesheet — die Einspalter-Regel galt dadurch immer, unabhängig von der Fensterbreite, und die Fußzeile stand auch am Desktop untereinander. Wieder in @media (max-width:1024px) und @media (max-width:520px) verpackt, wie in investoren-swot.html. Gemessen: Kopfzeile 0 bis Viewportbreite bei 1440, 900 und 480 px, Fußzeile 4 / 2 / 1 Spalten, kein Abstand mehr zum Warnbalken. Dabei gefunden: Chart.js hat keine Ausfallsicherung — fehlt das CDN, riss der erste new Chart(...) den ganzen Skriptblock mit und ALLE Diagramme blieben leer, ohne Hinweis. Jetzt steht ein Hinweis im Diagrammrahmen, analog zur Leaflet-Sicherung im Cockpit." },

    { id: "n-done-praesentation-raender-text", page: "praesentation", selector: "main", status: "auszubauen", done: true,
      title: "Ränder im Vollbild vergrößert, Folientext ausgedünnt",
      text: "BEHOBEN 13.08.2026. Zwei Befunde. Erstens die Ränder: die Polsterung von .slide-inner lag im gezoomten Koordinatenraum, wurde aber NICHT durch --fit geteilt — bisher galt das nur für die Leistenhöhe unten. Aus 84 px Seitenrand wurden bei --fit 0,72 sichtbare 60 px, die Folie wirkte randlos. Jetzt werden alle drei Polsterungen durch --fit geteilt und bleiben damit in Gerätepixeln konstant; verkleinert wird ausschließlich der Inhalt. Zusätzlich hebt eine eigene Vollbildregel ab 1200 px die Ränder deutlich an: gemessen 134 px seitlich bei 1920x1080, 101 px bei 1440x900. Zweitens der Text: 94 Textstellen gekürzt — Aufzählungen von vier auf drei Punkte (Personas, SWOT), Nebensätze ohne eigene Aussage gestrichen, wiederholte Aufzählungen entfernt (die fünf Standortnamen stehen ohnehin in der Tabelle auf Folie 5). Alle Zahlen mit F/A/E/O-Kennzeichnung, die wortwörtlichen Prompts der Pflichtnachweise und die eingeklappten Korrekturhinweise blieben unangetastet. Wirkung zusammen: der Einpassungsfaktor liegt jetzt bei 0,86 bis 1,00 statt bis 0,68, bei 1920x1080 muss keine einzige Folie mehr verkleinert werden. Drittens dabei gefunden: Chrome bildet scrollHeight des Rahmens aus der UNskalierten Höhe des gezoomten Kindes — der Rahmen hielt sich für zu klein und ließ sich um bis zu 130 px in leeren Raum schieben, obwohl sichtbar nichts abgeschnitten war (Folie 12 bei 1024x768). Passt der Inhalt nachgemessen, steht der Rahmen jetzt auf overflow:clip. clip auf beiden Achsen ist nötig: mit overflow-x:hidden aus dem Stylesheet rechnet Chrome ein overflow-y:clip auf hidden zurück, und ein hidden-Rahmen bleibt ein Scrollcontainer. Die lineare Schätzung in fitSlide() ist außerdem einer Bisektion gewichen — sie setzte Proportionalität zwischen Sichthöhe und --fit voraus, die mit konstanten Rändern nicht mehr gilt, und ihr Sicherheitsnetz konnte auslaufen, ohne die Passung erreicht zu haben." },

    { id: "n-done-wettbewerb-mobil-raender", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "Ränder des Wettbewerbs-Dashboards mobil behoben",
      text: "Befund: scrollWidth 500 px bei clientWidth 390 px. Weil eine einzige Überbreite den GESAMTEN Viewport aufweitet, stand die ganze Seite auf 500 px — jede Sektion lag danach bei left=20 w=350 statt left=0 w=390 und die Seite wirkte eingerückt mit Creme ringsum. Nicht die Präsenzmatrix war die Ursache (die scrollt korrekt), sondern die Kennzahlen-Reihe: per Ausblende-Test isoliert fiel die Seite ohne .bench-bars von 500 auf 394 px, ohne .delta auf 433 px. .bench-label 200 px und .delta 56 px sind flex-shrink:0, und .bench-bars ist als Flex-Element mit dem Vorgabewert min-width:auto nicht unter seine Inhaltsbreite komprimierbar — zusammen über 352 px Mindestbreite in einem 310-px-Kasten. Das Dashboard kam als Desktop-Tab-App und hatte außer der .two-col-Regel keine eigene Mobilregel. Nachgerüstet: Mobilblock ab 760 px, min-width:0 auf den Flex- und Grid-Elementen, canvas mit max-width:100 %, Matrix scrollt bewusst. Die letzten 4 px kamen von zwei .section in einer zu engen .two-col-Spur — ein <canvas> trägt eine eigene Pixelbreite als Eigenmaß und wirkt wie ein festes width. Geprüft mit einem Stub, der Chart.js' Größenverhalten nachbildet: scrollWidth == clientWidth bei 390, 768 und 1440 px." },

    { id: "n-done-wrap-padding-block", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Kurzform „padding: X 0\" löschte die Seitenpolsterung von .wrap",
      text: "Systemischer Fehler, 21 Dateien betroffen: .trust-row und .kpi-row setzen „padding: 26px 0\" bzw. „padding: 28px 0\". Beide Klassen stehen zusammen mit .wrap auf demselben Element — die Kurzform überschreibt damit die 32 px Seitenpolsterung von .wrap auf 0, die Kacheln klebten am Bildschirmrand (nachgemessen paddingLeft 0 statt 32px). Auf padding-block umgestellt, das kann die Seitenwerte nicht anfassen. Genutzt wird die Kombiklasse auf fünf Seiten: index, einzugsgebiet, investoren, investoren-kennzahlen, investoren-markt; die Regel selbst ist in alle 21 Dateien kopiert und dort überall korrigiert, damit eine später hinzugefügte Seite den Fehler nicht erbt. Auf einzugsgebiet.html stand derselbe Wert zusätzlich inline. Nachgemessen: alle .wrap-Elemente auf sechs Seiten tragen wieder 32 px." },

    { id: "n-done-wettbewerb-zaehlung", page: "investoren-wettbewerb", selector: "main", status: "offen", done: true,
      title: "„6 von 9\" im Dashboard auf „6 von 10\" berichtigt",
      text: "Gegen die Datenreihe geprüft: das Wettbewerber-Array führt zehn Einträge (6 freigemeinnützig, je 1 privat, inoffiziell, digital, Konzern), LebensZeit selbst ist NICHT darin enthalten, und die Legende darüber summiert sich ebenfalls auf zehn. Im Text stand weiter „6 von 9\" — der Wert galt für die ältere Liste ohne Vitanas/Korian, wie sie noch im Investorpitch steht. Eine frühere Sitzung hatte diese Korrektur bereits vermerkt, sie war im Bestand aber nicht angekommen." },

    { id: "n-zaehlbasis-wettbewerber", page: "allgemein", selector: "main", status: "offen",
      title: "Zählbasis Wettbewerber: Pitch 9, Dashboard 10 — vereinheitlichen",
      text: "Der Investorpitch listet neun Wettbewerber plus LebensZeit (Titel dort trotzdem „Zehn Wettbewerber\") und sagt folgerichtig „6 von 9\". Das Wettbewerbs-Dashboard führt zehn Wettbewerber — es enthält zusätzlich Vitanas/Korian als Konzern/stationär — und sagt „6 von 10\". Beide Aussagen sind in ihrem eigenen Bestand richtig, widersprechen sich aber nach außen. Vor dem Pitch am 07.09.2026 auf eine Zählbasis festlegen: entweder Vitanas/Korian in die Pitch-Matrix aufnehmen oder im Dashboard als nicht-ambulanten Sonderfall aus der Zählung herausnehmen." },

    { id: "n-done-leaflet-auffangnetz", page: "cockpit", selector: "#main[data-mod=\"tour\"] > .panel", status: "offen", done: true,
      title: "Kartenbibliothek fiel still aus",
      text: "BEHOBEN 13.08.2026. Leaflet kommt vom CDN. Ist es nicht da — gesperrtes Firmennetz, Offline-Vorfuehrung, CDN-Ausfall —, warf initMap() „L is not defined“ und der Kartenbereich blieb einfach leer. Genau die Sorte stiller Fehlschlag, die im Prompt-Tagebuch als Lektion steht. initMap() prueft jetzt auf typeof L und schreibt sonst in die Flaeche, was fehlt; die Tourenliste darunter bleibt davon unabhaengig nutzbar." },

    { id: "n-done-notes-anker-position", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Notizen-Overlay ueberschrieb die Positionierung seines Ankers",
      text: "BEHOBEN 13.08.2026. Der Pin braucht einen positionierten Anker, dafuer setzte .lz-note-anchor position:relative — bedingungslos. Weil das eingespritzte Stylesheet nach dem Seiten-Stylesheet im Kopf landet, gewann es bei gleicher Spezifitaet und machte aus bereits positionierten Elementen relative. Aufgefallen an /praesentation: eine offene Notiz mit selector „main“ verwandelte die Buehne (position:fixed, inset 0) in ein relatives Element, gemessen 541 statt 861 px Hoehe, die Bedienleiste stand mitten auf der Seite. Die Klasse wird jetzt nur noch gesetzt, wenn das Wirtselement tatsaechlich static ist — betraf potenziell jede Seite." },

    { id: "n-done-notizen-mobil", page: "notizen", selector: "main", status: "offen", done: true,
      title: "To-Do-Seite weitete sich mobil auf",
      text: "BEHOBEN 13.08.2026. notizen.html hatte keine einzige Medienabfrage. Die zweite Rasterspalte traegt „erledigt“ mit white-space:nowrap und braucht 75 px; bei 390 px Viewport blieben davon 29 uebrig. Weil die 1fr-Spur als Grid-Element den Vorgabewert min-width:auto hat, konnte sie nicht ausweichen — gemessen scrollWidth 436 bei clientWidth 390, und eine einzige Ueberbreite weitet die ganze Seite. Unter 560 px steht der Schalter jetzt unter dem Text statt daneben. Dieselbe Fehlerklasse wie im Wettbewerbs-Dashboard." },

    { id: "n-done-notes-id-duplikat", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Doppelte Notiz-ID in der Registry",
      text: "BEHOBEN 13.08.2026. Zwei inhaltlich verschiedene Eintraege trugen dieselbe ID n-done-cockpit-mobil: einmal die Zwischenstufe (Seitenleiste wird eine horizontal scrollbare Zeile), einmal die geltende Loesung (Schublade). Eine doppelte ID bedeutet einen gemeinsamen localStorage-Schluessel und einen doppelten Eintrag im Board. Die aeltere Stufe heisst jetzt n-done-cockpit-mobil-stufe1 und verweist auf ihre Nachfolgerin. Registry auf doppelte IDs geprueft: keine mehr." },

    { id: "n-personas-set-praesentation", page: "praesentation", selector: "main", status: "offen",
      title: "Personas-Set in der Präsentation: Set 1 gegen Set 2 entscheiden",
      text: "Die Folien 13 bis 15 tragen unverändert Set 1 aus dem Investorpitch: Elisabeth Brinkmann (78, PG 2, Rüthen) und Sabine Koch (52, Erwitte). Maßgeblich ist inzwischen Set 2 — Hildegard Stemmer und Markus Dörre aus dem Personas-Handout, verwendet im Kundenportal, im Cockpit und in Baustein 3. Umbenannt wurde in der Präsentation bewusst nichts, weil Folie 15 (Iterationsdokumentation V1 bis V3) genau die Entstehung von Brinkmann und Koch belegt und der Pflichtnachweis für Baustein 3 daran hängt. Auf der Folie als offener Punkt gekennzeichnet. Entscheidung: Set 1 als historischen Sprint-1-Stand kennzeichnen oder die drei Folien auf Set 2 umstellen und den Pflichtnachweis neu formulieren." }
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
  /* Erststart-Vorbelegung: EIN. Bisher war der Schalter aus, solange nichts
     gespeichert war (getItem lieferte null, null === "1" ist falsch) — wer die
     Seite zum ersten Mal öffnete, sah weder Pins noch Belege und musste erst
     das Planspiel-Menü finden. Unterschieden wird jetzt zwischen „noch nie
     entschieden“ (null → ein, und gleich festgeschrieben) und „bewusst
     ausgeschaltet“ ("0" → bleibt aus). Ohne Speicher (Vorschau, privater
     Modus) gilt ebenfalls ein: dort gibt es keine Entscheidung zu erinnern. */
  function loadVisible() {
    try {
      var v = window.localStorage.getItem(TKEY);
      if (v === null) { saveVisible(true); return true; }
      return v === "1";
    } catch (e) { return true; }
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
      ".fiktiv-note-toggle{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;color:var(--cream, #F5F0E8);background:rgba(176,122,42,.16);border:1px solid rgba(176,122,42,.45);border-radius:30px;padding:12px 18px;font:inherit;font-size:0.94rem;letter-spacing:.3px;cursor:pointer;transition:background .12s,transform .12s;}" +
      ".fiktiv-note-toggle:hover{background:rgba(176,122,42,.3);transform:translateX(2px);}" +
      ".fiktiv-note-toggle #lzNotesState{font-weight:600;}" +
      ".lz-note-anchor{position:relative;}" +
      /* min-height:0 und aspect-ratio sind Pflicht: die globale Tap-Regel in
         lz-tokens.css setzt min-height auf 48px und zog den Pin auf 30x48 — oval
         statt rund. Das 48px-Tippziel kommt ueber ::after zurueck. */
      ".lz-note-pin{display:none;position:absolute;top:10px;right:10px;z-index:40;width:30px;height:30px;min-height:0;padding:0;aspect-ratio:1;border-radius:50%;border:2px solid var(--cream, #F5F0E8);background:var(--amber, #B07A2A);color:#fff;font-size:0.88rem;line-height:1;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.28);}" +
      ".lz-note-pin::after{content:'';position:absolute;top:50%;left:50%;width:var(--tap-env,48px);height:var(--tap-env,48px);transform:translate(-50%,-50%);}" +
      ".lz-note-pin.s-offen{background:var(--red, #8C3A2A);}.lz-note-pin.s-auszubauen{background:var(--amber, #B07A2A);}.lz-note-pin.s-spaeter{background:var(--green, #4A6741);}" +
      "body.lz-notes-active .lz-note-pin{display:flex;animation:lzPinPulse 2.2s ease-in-out infinite;}" +
      "@keyframes lzPinPulse{0%,100%{box-shadow:0 4px 14px rgba(0,0,0,.28),0 0 0 0 rgba(176,122,42,.4);}50%{box-shadow:0 4px 14px rgba(0,0,0,.28),0 0 0 7px rgba(176,122,42,0);}}" +
      ".lz-note-pop{position:absolute;top:48px;right:10px;z-index:41;width:300px;max-width:calc(100vw - 40px);background:var(--panel, #fff);color:var(--text, #2A2820);border:1px solid var(--line, rgba(74,103,65,.18));border-radius:12px;padding:16px 18px 16px;box-shadow:0 20px 48px rgba(0,0,0,.22);text-align:left;font-family:'Jost',sans-serif;}" +
      /* Dieselbe Falle wie beim Quellen-Popover: die Flaeche stand fest auf Weiss,
         waehrend --text im Cockpit die Nachtinte #DFE7DC ist — 1,26:1. Ueber
         var(--panel) folgt die Flaeche jetzt der Umgebung: 11,91:1 im Cockpit. */
      ".env-cockpit .lz-note-pop{box-shadow:0 20px 48px rgba(0,0,0,.5);}" +
      ".env-cockpit .lz-note-pop h4{color:var(--heading);}" +
      ".env-cockpit .lz-note-pop p,.env-cockpit .lz-note-pop .lz-note-close{color:var(--text-2);}" +
      ".env-cockpit .lz-note-done-btn{color:var(--accent);background:rgba(138,172,133,.12);border-color:var(--line-ui);}" +
      ".lz-note-pop[hidden]{display:none;}" +
      ".lz-note-badge{display:inline-block;font-size:0.8rem;letter-spacing:1px;text-transform:uppercase;font-weight:600;padding:3px 10px;border-radius:20px;margin-bottom:8px;color:#fff;}" +
      ".lz-note-pop h4{font-family:'Cormorant Garamond',serif;font-weight:600;color:var(--green3, #2C3D27);font-size:1.25rem;margin:0 0 4px;line-height:1.2;}" +
      ".lz-note-pop p{font-size:0.88rem;line-height:1.55;color:var(--text2, #5A5648);margin:0 0 12px;}" +
      ".lz-note-pop .lz-note-close{position:absolute;top:8px;right:10px;border:0;background:none;color:var(--text3, #8A8478);font-size:1.125rem;cursor:pointer;line-height:1;}" +
      ".lz-note-done-btn{display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:0.8rem;color:var(--green, #4A6741);background:rgba(74,103,65,.08);border:1px solid rgba(74,103,65,.25);border-radius:20px;padding:7px 14px;cursor:pointer;}" +
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
      /* Grundregeln fuer Leiste, Knopf und Symbole. Standen bisher nur inline in den
         15 oeffentlichen Seiten — auf den fuenf Planspiel-Seiten wurde die Leiste per
         JS eingefuegt, ohne dass diese Regeln mitkamen. Folge (nachgemessen): der
         Knopf behielt den Browser-Standard (#EFEFEF, schwarze Schrift, auf iOS blau),
         bekam den Rand aus der globalen button-Regel und wuchs statt auf 100% auf
         3924px — daher das horizontale Scrollen. Ohne .lz-ic rendern die Menue-
         symbole mit 44px und 88px statt 1em.
         Diese Datei laeuft auf allen Seiten, lz-tokens.css nicht (neun Seiten binden
         sie noch nicht ein) — deshalb stehen die Regeln hier und nicht dort.
         body-Praefix bei .fiktiv-bar, damit der z-index die Inline-Kopien der Seiten
         schlaegt und das Menue ueber den Investoren- und Cockpit-Anmeldeflaechen liegt. */
      "body .fiktiv-bar{position:relative;z-index:300;}" +
      ".fiktiv-marquee{display:block;width:100%;min-height:0;margin:0;padding:0;border:0;" +
        "background:var(--lz-red,#8C3A2A);color:var(--lz-cream,#F5F0E8);" +
        "font:inherit;text-align:left;cursor:pointer;overflow:hidden;}" +
      ".lz-ic{width:1em;height:1em;flex:0 0 auto;vertical-align:-.125em;margin-right:.45em;}" +
      /* Ampel: gruen = Overlay an, rot = aus; die Zahl daneben traegt die Aussage mit,
         weil sich Salbeigruen und Rot in der Helligkeit kaum unterscheiden (1,13:1)
         und bei Deuteranopie fast gleich aussehen. Der Ring in Creme hebt die Lampe
         ueber die Kante ab: Rot liegt auf der Schalterflaeche nur bei 2,24:1, gegen
         den Ring bei 5,30:1. */
      ".lz-state{display:inline-flex;align-items:center;gap:8px;font-weight:600;font-variant-numeric:tabular-nums;}" +
      ".lz-lamp{width:10px;height:10px;border-radius:50%;flex:0 0 auto;" +
        "box-shadow:0 0 0 1px rgba(245,240,232,.55);}" +
      ".lz-lamp.is-on{background:var(--lz-sage,#8AAC85);}" +
      ".lz-lamp.is-off{background:#B03A2E;}" +
      /* Untergruppen am Fuss des Menues: Praesentationen und Wissensbasis.
         Der externe Verweis traegt seinen Hinweis im Knopf, nicht im title —
         ein title erscheint erst nach Verweilen und am Telefon nie. */
      ".fiktiv-menu a.lz-menu-ext{display:flex;align-items:center;justify-content:space-between;gap:10px;}" +
      ".lz-ext-hint{font-size:0.72rem;letter-spacing:.06em;text-transform:uppercase;opacity:.72;white-space:nowrap;}" +
            ".fiktiv-marquee:focus-visible{outline:2px solid #fff;outline-offset:-3px;}" +
            ".fiktiv-menu{position:absolute;top:100%;left:16px;margin-top:10px;display:flex;flex-direction:column;gap:8px;background:rgba(30,32,26,0.96);backdrop-filter:blur(6px);border:1px solid rgba(168,201,160,.25);border-radius:16px;padding:14px;min-width:240px;box-shadow:0 18px 44px rgba(0,0,0,.32);animation:lzMenuIn .16s ease-out;}" +
      /* Das Menue ist mit den Fussgruppen auf 699 px gewachsen und stiess damit
         auf kleinen Telefonen (375x667) unten aus dem Bild. Es haengt absolut in
         einer fixierten Leiste, konnte also auch nicht mitscrollen. Deshalb eine
         Hoehenbegrenzung auf den Rest des Bildschirms unter dem Warnbalken und
         eigenes Scrollen; overscroll-behavior haelt den Impuls im Menue. */
      ".fiktiv-menu{max-height:calc(100vh - var(--tick-h, 2.375rem) - 24px);overflow-y:auto;overscroll-behavior:contain;}" +
      ".fiktiv-menu[hidden]{display:none;}" +
      ".fiktiv-menu-h{font-size:0.8rem;letter-spacing:2px;text-transform:uppercase;color:var(--sage, #8AAC85);padding:2px 6px 4px;}" +
      ".fiktiv-menu a{display:block;color:var(--cream, #F5F0E8);background:rgba(168,201,160,.10);border:1px solid rgba(168,201,160,.22);border-radius:30px;padding:12px 18px;font-size:0.94rem;letter-spacing:.3px;text-decoration:none;transition:background .12s,transform .12s;}" +
      ".fiktiv-menu a:hover{background:var(--green, #4A6741);border-color:var(--green, #4A6741);transform:translateX(2px);color:#fff;}" +
      "@keyframes lzMenuIn{from{opacity:0;transform:translateY(-6px);}to{opacity:1;transform:translateY(0);}}";
    var el = document.createElement("style"); el.id = "lz-bar-css"; el.textContent = css;
    document.head.appendChild(el);
  }

  function menuHTML() {
    return '<div class="fiktiv-menu" id="fiktivMenu" role="menu" aria-label="Planspiel-interne Daten" hidden>' +
        '<span class="fiktiv-menu-h">Planspiel-intern</span>' +
        "<a href='/unternehmensdaten' role='menuitem'>Unternehmensdaten</a>" +
        "<a href='/sprints' role='menuitem'>Sprint-\u00dcbersicht</a>" +
        "<a href='/website-status' role='menuitem'>Website-Status</a>" +
        "<a href='/notizen' role='menuitem'>To-Do\'s</a>" +
        "<a href='/prompt-tagebuch' role='menuitem'>Prompt-Tagebuch</a>" +
        '<div class="fiktiv-menu-sep"></div>' +
        '<button type="button" class="fiktiv-note-toggle" role="menuitem" id="lzNotesToggle" onclick="lzToggleNotes()"><span><svg class="lz-ic" viewBox="0 0 16 16" aria-hidden="true"><rect x="2.5" y="1.5" width="11" height="13" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.2"/><line x1="5" y1="5" x2="11" y2="5" stroke="currentColor" stroke-width="1.2"/><line x1="5" y1="8" x2="11" y2="8" stroke="currentColor" stroke-width="1.2"/><line x1="5" y1="11" x2="9" y2="11" stroke="currentColor" stroke-width="1.2"/></svg>To-Do\'s</span><span class="lz-state"><span class="lz-lamp is-off" id="lzNotesLamp"></span><span id="lzNotesState">0</span></span></button>' +
      '</div>';
  }

  /* ---------- 6a2. Fussgruppen des Planspiel-Menues ----------
     Ergänzt das Menü unten um „Sprint 1" (die Präsentation) und den Verweis in
     die Wissensbasis. Bewusst hier und nicht 21-mal im Markup: das Menü steht
     auf 21 Seiten inline und wird auf den übrigen von menuHTML() erzeugt — ein
     Codeweg deckt beide Fälle ab und kann nicht auf einer Seite vergessen
     werden. Idempotent über die IDs.
     Das Confluence-Ziel ist der Raum LZ, in dem Kanon, Entscheidungslog und
     Prompt-Tagebuch liegen. Es braucht eine Atlassian-Anmeldung, deshalb steht
     „extern · Login" im Knopf: dieser Menüteil ist Planspiel-intern, das Team
     hat den Zugang, aber niemand soll blind in eine Anmeldemaske klicken. */
  var WIKI_LZ = "https://lebenszeit-ggmbh.atlassian.net/wiki/spaces/LZ";
  function ensureMenuFooter() {
    var menu = document.getElementById("fiktivMenu");
    if (!menu || document.getElementById("lzMenuWiki")) return !!menu;

    function sep() { var d = document.createElement("div"); d.className = "fiktiv-menu-sep"; return d; }
    function head(t) {
      var s = document.createElement("span");
      s.className = "fiktiv-menu-h"; s.textContent = t; return s;
    }
    /* Der Einstieg in die Praesentation stand hier als Gruppe „Praesentationen ·
       Sprint 1" und ist am 13.08.2026 wieder entfallen. Grund: die Praesentation
       ist der Investorenpitch, ihr Publikum sind die fiktiven Investoren — nicht
       das Planspiel-Team. Sie hat genau einen Einstieg, unten auf der
       Investoren-Startseite, und waechst dort mit jedem weiteren Pitch. Drei
       Einstiege an drei Stellen waren einer zu viel und zwei am falschen Ort. */
    menu.appendChild(sep());
    menu.appendChild(head("Wissensbasis"));
    var w = document.createElement("a");
    w.id = "lzMenuWiki";
    w.className = "lz-menu-ext"; w.href = WIKI_LZ;
    w.target = "_blank"; w.rel = "noopener noreferrer";
    w.setAttribute("role", "menuitem");
    w.setAttribute("aria-label", "Confluence-Raum LebensZeit — öffnet extern, Anmeldung erforderlich");
    w.innerHTML = "<span>Confluence</span><span class=\"lz-ext-hint\">extern · Login</span>";
    menu.appendChild(w);
    return true;
  }

  function bindBar() {
    document.addEventListener("click", function (e) {
      if (!e.target.closest(".fiktiv-bar")) lzToggleMenu(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") lzToggleMenu(false); });
  }

  /* Drei Ausgangslagen:
       1. .fiktiv-bar vorhanden  -> Leiste und Menue stehen inline im HTML, nichts zu tun
       2. nur .lz-tick vorhanden -> Cockpit: Balken da, aber ohne Knopf und ohne Menue
       3. gar nichts             -> Leiste komplett einfuegen
     Fall 2 gab es bisher nicht; das Cockpit war von der Leiste ausgenommen. */
  function upgradeBar() {
    if (document.querySelector(".fiktiv-bar")) return "vorhanden";
    var tick = document.querySelector(".lz-tick");
    if (!tick) return "fehlt";
    var track = tick.querySelector(".lz-tick-track");
    if (!track) return "fehlt";
    var btn = document.createElement("button");
    btn.type = "button"; btn.className = "fiktiv-marquee"; btn.id = "lzTrigger";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "fiktivMenu");
    btn.setAttribute("aria-label", "Planspiel-Men\u00fc \u00f6ffnen");
    btn.addEventListener("click", function () { window.lzToggleMenu(); });
    tick.insertBefore(btn, track);
    btn.appendChild(track);
    var wrap = document.createElement("div");
    wrap.className = "fiktiv-bar";
    tick.parentNode.insertBefore(wrap, tick);
    wrap.appendChild(tick);
    wrap.insertAdjacentHTML("beforeend", menuHTML());
    bindBar();
    return "nachgeruestet";
  }

  function ensureBar() {
    var marquee = "";
    for (var i = 0; i < 8; i++) marquee += "<span>Fiktives Unternehmen \u00b7 nur zu Schulungszwecken</span>";
    var bar = document.createElement("div");
    bar.className = "fiktiv-bar";
    bar.innerHTML =
      '<div class="lz-tick" id="lzTick">' +
        '<button class="fiktiv-marquee" id="lzTrigger" aria-expanded="false" aria-controls="fiktivMenu" aria-label="Planspiel-Men\u00fc \u00f6ffnen" onclick="lzToggleMenu()"><div class="lz-tick-track">' + marquee + '</div></button>' +
        '<button type="button" class="lz-tick-pause" id="lzTickPause" aria-pressed="false" onclick="lzTickPause(event,this)">Pause</button>' +
      '</div>' +
      menuHTML();
    document.body.insertBefore(bar, document.body.firstChild);
    bindBar();
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

  /* ---------- 6b2. Vorhandene Leisten auf die Ampel nachruesten ----------
     22 Seiten tragen die Leiste fest im HTML; dort steht im Schalter noch das alte
     <span id="lzNotesState">Aus</span>. Statt 22 Dateien anzufassen wird die
     Beschriftung hier zur Ampel umgebaut — wirkt sofort und auch auf den neun
     Seiten, die lz-tokens.css noch nicht einbinden. */
  function upgradeToggle() {
    var state = document.getElementById("lzNotesState");
    if (!state || document.getElementById("lzNotesLamp")) return;
    var lamp = document.createElement("span");
    lamp.className = "lz-lamp is-off";
    lamp.id = "lzNotesLamp";
    if (state.parentNode && state.parentNode.classList.contains("lz-state")) {
      state.parentNode.insertBefore(lamp, state);
    } else {
      var box = document.createElement("span");
      box.className = "lz-state";
      state.parentNode.insertBefore(box, state);
      box.appendChild(lamp);
      box.appendChild(state);
    }
  }

  /* ---------- 6b3. Anzeige des Schalters ----------
     Einzige Stelle, die Lampe, Zahl und aria setzt. Vorher taten das buildPins()
     und lzToggleNotes() getrennt und mit unterschiedlichem Text. */
  function paintToggle() {
    var active = document.body.classList.contains("lz-notes-active");
    var count = notesForPage().filter(function (n) { return !isDone(n.id); }).length;
    var stateEl = document.getElementById("lzNotesState");
    if (stateEl) stateEl.textContent = String(count);
    var lampEl = document.getElementById("lzNotesLamp");
    if (lampEl) {
      lampEl.className = "lz-lamp " + (active ? "is-on" : "is-off");
      /* Der Zustand haengt nicht allein an der Farbe: Rot und Salbeigruen trennen
         sich in der Helligkeit kaum, bei Deuteranopie gar nicht. Screenreader und
         Farbfehlsichtige lesen ihn hier, sehende an der Zahl daneben. */
      lampEl.setAttribute("role", "img");
      lampEl.setAttribute("aria-label",
        (active ? "eingeblendet" : "ausgeblendet") + ", " + count + " offen auf dieser Seite");
    }
    var togEl = document.getElementById("lzNotesToggle");
    if (togEl) togEl.setAttribute("aria-pressed", active ? "true" : "false");
  }

  /* ---------- 6c. Laufband ausmessen ----------
     Setzt drei Werte auf <html>:
       --tick-h      Hoehe der Leiste. Die Cockpit-Anmeldung und das Investoren-Gate
                     lagen mit festen 22px bzw. 0 darueber und deckten den Balken ab.
       --tick-shift  Verschiebung je Umlauf, gerundet auf ganze Pixel und auf ein
                     Vielfaches einer Textwiederholung. Bruchteil-Pixel waren die
                     Ursache der weichen Schrift, die falsche Distanz die des Sprungs.
       --tick-dur    Dauer, so dass ueberall 7,5 px/s herauskommen — die Geschwindigkeit,
                     die die oeffentlichen Seiten am Desktop schon hatten. Vorher war
                     sie an die Containerbreite gekoppelt und schwankte zwischen
                     2 px/s (oeffentlich mobil) und 20 px/s (Planspiel-intern mobil).
     Laeuft erst, wenn die Schriften geladen sind — vorher misst man Fallback-Metrik. */
  var TICK_SPEED = 7.5;   // px pro Sekunde

  function measureTick() {
    var tick = document.querySelector(".lz-tick");
    if (tick) {
      document.documentElement.style.setProperty("--tick-h", tick.offsetHeight + "px");
    } else {
      var bar = document.querySelector(".fiktiv-bar");
      if (bar) document.documentElement.style.setProperty("--tick-h", bar.offsetHeight + "px");
    }
    var track = document.querySelector(".lz-tick-track");
    if (!track) return;
    var items = track.children;
    if (items.length < 2) return;
    // Abstand zweier gleicher Wiederholungen = Textbreite + Luecke
    var unit = items[1].offsetLeft - items[0].offsetLeft;
    if (!unit) return;
    // halbe Anzahl Wiederholungen, damit nach dem Umlauf noch genug Text nachsteht
    var steps = Math.max(1, Math.floor(items.length / 2));
    var shift = Math.round(unit * steps);
    document.documentElement.style.setProperty("--tick-shift", shift + "px");
    document.documentElement.style.setProperty("--tick-dur", Math.round(shift / TICK_SPEED) + "s");
  }

  function watchTick() {
    measureTick();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(measureTick);
    var t; window.addEventListener("resize", function () {
      clearTimeout(t); t = setTimeout(measureTick, 150);
    });
  }
  window.lzMeasureTick = measureTick;

  window.lzTickPause = function (ev, btn) {
    if (ev) ev.stopPropagation();
    var t = document.getElementById("lzTick"); if (!t) return;
    var p = t.classList.toggle("is-paused");
    btn.setAttribute("aria-pressed", p ? "true" : "false");
    btn.textContent = p ? "Weiter" : "Pause";
  };

  /* ---------- 7. Pins auf der aktuellen Seite bauen ---------- */
  function buildPins() {
    var mine = notesForPage().filter(function (n) { return !isDone(n.id); });
    // Zähler im Pillmenü-Toggle
    paintToggle();

    // pro Anker-Element Offset zählen (mehrere Notizen am selben Element)
    var offsetMap = new Map();
    mine.forEach(function (n) {
      var host = document.querySelector(n.selector);
      if (!host) return;   // kein Treffer -> kein Streu-Pin; Punkt bleibt im Board sichtbar
      if (!host) return;
      /* Der Pin braucht einen positionierten Anker. .lz-note-anchor setzt dafuer
         position:relative — das darf aber nur passieren, wenn das Wirtselement
         ueberhaupt noch statisch ist. Sonst ueberschreibt die eingespritzte
         Regel eine bestehende Positionierung, und weil dieses Stylesheet nach
         dem Seiten-Stylesheet im Kopf landet, gewinnt sie bei gleicher
         Spezifitaet. Aufgefallen an /praesentation: eine offene Notiz mit
         selector "main" machte aus der Buehne (position:fixed, inset 0)
         ein relatives Element — gemessen 541 statt 861 px Hoehe, die
         Bedienleiste stand mitten auf der Seite. */
      if (getComputedStyle(host).position === "static") host.classList.add("lz-note-anchor");
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
    paintToggle();
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
    /* Cockpit war hier bisher ausgenommen. Es bringt den Balken selbst mit, aber
       ohne Knopf und Menue — upgradeBar() ruestet beides nach, statt eine zweite
       Leiste einzufuegen. */
    if (upgradeBar() === "fehlt") ensureBar();
    upgradeToggle();
    /* Das Menue kann von ensureBar() gerade erst erzeugt worden sein oder auf
       Seiten mit spaeter nachgeladenem Markup noch fehlen — deshalb derselbe
       Wiederholversuch wie beim Quellen-Schalter. */
    if (!ensureMenuFooter()) {
      var t = 0;
      var iv = setInterval(function () { if (ensureMenuFooter() || ++t > 20) clearInterval(iv); }, 100);
    }
    if (loadVisible()) document.body.classList.add("lz-notes-active");
    buildPins();
    watchTick();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
