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

    { id: "n-aktuelles-grammatik", page: "aktuelles", selector: "h1", status: "offen",
      title: "Grammatik: „aus der Nachbarschaft\"",
      text: "KI-Kritik: Überschrift „Neues aus dem Nachbarschaft\" → „Neues aus der Nachbarschaft\" korrigieren." },

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

    { id: "n-tick-h-ueberdeckung", page: "allgemein", selector: "main", status: "offen",
      title: "Anmeldeflächen decken den Warnbalken ab",
      text: "cockpit.html #login liegt mit fest verdrahteten 22px über einer 38px hohen Leiste, investoren.html .gate mit inset:0 und z-index 200 sogar vollständig darüber. lz-notes.js setzt --tick-h jetzt auf allen Seiten; beide Flächen müssen darauf umgestellt werden. Schritt 3 und 4." },

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

    { id: "n-personalstamm-rollenmix", page: "cockpit", selector: "main", status: "offen",
      title: "Rollenmix im Personalstamm weicht vom Steckbrief ab",
      text: "Kopfzahl 56 und FTE 45,6 stimmen, der Mix nicht: Steckbrief 20 Fachkräfte / 13 Hilfskräfte / 5 Hauswirtschaft / 5 Verwaltung, Simulation 18 / 14 / 0 / 4 plus 6 Azubis und 1 Qualitätsmanagement. Ursache: die 6 Azubis stehen im Steckbrief neben den 56, in der Simulation darin — sie verdrängen die Hauswirtschaft. Examinierte 23 statt 25. Vor dem Pitch angleichen, weil B2 auf dem Qualifikationsmix aufbaut." },

    { id: "n-tourenzahl", page: "cockpit", selector: "main", status: "auszubauen",
      title: "Touren stark verkürzt dargestellt",
      text: "Der Steckbrief nennt 3–4 Touren je Standort früh und ~2 spät (C.3), also rund 25 am Tag. Die Simulation zeigt 6. Für die Vorführung tragfähig, für eine Aussage zur Tourenoptimierung nicht — entweder aufstocken oder im Pitch als Ausschnitt kennzeichnen." },

    { id: "n-namensraeume", page: "cockpit", selector: "main", status: "auszubauen",
      title: "Drei getrennte Namensräume für Personen",
      text: "Die Anmeldung nennt Holthaus, Brandt und Yilmaz, der Personalstamm 56 andere Namen, die Tourenliste sechs weitere Pflegekräfte (Weber, Yilmaz, Nowak, Köhler, Brinkmann, Busch-Kranz). Keiner der drei Bestände überschneidet sich sauber. Fällt auf, sobald jemand im Pitch zwei Ansichten nebeneinander legt." },

    { id: "n-entlastungsbetrag", page: "leistungen", selector: "main", status: "offen",
      title: "Entlastungsbetrag: 131 € vs. 125 €",
      text: "leistungen.html nennt 131 €/Monat nach §45b, das Personas-Handout rechnet Markus Dörre 125 €/Monat entgangenen Betrag vor. Der Steckbrief nennt keinen Monatsbetrag. Die übrigen SGB-XI-Werte der Website stehen laut Markt- und Wettbewerbsanalyse auf Stand 2024. Auf ein Jahr festlegen und belegen." },

    { id: "n-cockpit-notizen-anker", page: "cockpit", selector: "main", status: "offen",
      title: "To-Do-Pins im Cockpit ohne sichtbaren Anker",
      text: "Die Notiz-Pins hängen an Selektoren, die im Cockpit entweder nicht existieren oder in einem Bereich liegen, den render() neu schreibt — sie erscheinen nicht sichtbar verankert. Analog zum Quellen-Overlay lösen: Selektoren je Modul verengen (#main[data-mod=…]) und buildPins() nach jedem render() erneut aufrufen. Josh gemeldet 07.08.2026." },

    { id: "n-quellen-popover-rand", page: "allgemein", selector: "main", status: "offen",
      title: "Quellen-Popover laufen über den Rand",
      text: "Das Popover steht fest auf top:26px, right:0 relativ zum Trägerelement. Bei Bauteilen am rechten oder unteren Rand ragt es aus dem sichtbaren Bereich — im Cockpit besonders, weil #main eigenständig scrollt und body auf overflow:hidden steht. Position vor dem Öffnen gegen den Viewport prüfen und bei Bedarf nach links oder oben kippen. Josh gemeldet 07.08.2026." },

    { id: "n-done-env-invest", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "env-invest ausgerollt",
      text: "Die sechs Investorenseiten trugen einen eigenen :root-Block — eine zweite Farbquelle, die an drei Stellen abwich: --amber-ink #8F6318 statt #8C5E14, --border 0,18 statt 0,28 Deckung, --red-err #A23 statt Marken-Rot. Block entfernt, lz-tokens.css eingebunden, body auf env-invest, Gate auf var(--tick-h), Eyebrows von var(--amber-ink) auf var(--accent-ink) umgestellt — die Umgebung treibt jetzt den Akzent, nicht der Rohwert. Vorher/Nachher über 300 Messpunkte verglichen: alle 229 Abweichungen erklärbar (Fließtext 16 → 16,48px nach --fs-public, Amber-Ink auf den kanonischen Wert, Formularfelder auf 14px Radius und 48px Tippziel)." },

    { id: "n-done-invest-laufband", page: "allgemein", selector: "main", status: "offen", done: true,
      title: "Warnbalken der Investorenseiten vereinheitlicht",
      text: "Die sechs Seiten liefen noch mit der alten .track-Spur und fester 60s-Dauer — dieselbe Ursache für weiche Schrift und Sprung, die auf den übrigen Seiten schon behoben war. Markup auf .lz-tick / .lz-tick-track umgestellt, eigene @keyframes fiktivscroll entfernt, Pause-Knopf ergänzt. Alle 27 Seiten laufen jetzt mit 1.988px Verschiebung und 7,5 px/s." },

    { id: "n-bruecke-entfernen", page: "allgemein", selector: "main", status: "auszubauen",
      title: "Kompatibilitätsbrücke kann noch nicht weg",
      text: "Abschnitt 7 in lz-tokens.css bildet 22 Altnamen auf Rohwerte ab und sollte entfallen, sobald alle Seiten Rollen lesen. Nach dem env-invest-Rollout binden nur noch kundenportal.html, standortkarte.html und typo-vergleich.html die Tokendatei nicht ein; die übrigen lesen weiterhin Altnamen im Seiten-CSS. Erst env-portal abschließen, dann seitenweise auf Rollen umstellen, dann die Brücke ziehen." },

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

    { id: "n-env-portal-festschreiben", page: "kundenportal", selector: "main", status: "offen",
      title: "env-portal jetzt festschreibbar",
      text: "Die Umstellung des Kundenportals wartete laut Rückmeldung auf den Abgleich mit dem App-Prototyp. Der liegt jetzt vor. kundenportal.html trägt noch einen eigenen :root-Block wie vorher die Investorenseiten und bindet lz-tokens.css nicht ein — gleicher Ablauf wie beim env-invest-Rollout möglich." },

    { id: "n-done-greenc-fehlte", page: "website-status", selector: "main", status: "offen", done: true,
      title: "Statusleiste und Fertig-Punkt waren farblos",
      text: "Ursache war ein einziges Token: --greenC wurde an vier Stellen gelesen, aber nirgends definiert — der env-intern-Block setzt nur --yellow, --yellowbg, --greenbg und --redbg. Betroffen waren der grüne Balkenabschnitt, der Punkt am Filter „Fertig\\\", die Kennzahl „Fertig\\\" und der Kachelstatus. Alle vier auf --status-ok umgestellt, damit sie mit der To-Do-Seite übereinstimmen; die gelbe Balkenfüllung auf --amber, weil Amber-Ink dort der Textton ist." },

    { id: "n-done-filter-gedrueckt", page: "notizen", selector: "main", status: "auszubauen", done: true,
      title: "Gedrückte Filter spiegeln die Liste",
      text: "Vorher wurde jeder gedrückte Filter dunkelgrün, unabhängig davon, wonach er filtert. Jetzt trägt jede Gruppe das Aussehen ihres Gegenstücks in der Liste: Status als volle Fläche mit weißer Schrift (.b-*), Priorität als getönte Pille mit Punkt (.prio), Sprint und Kategorie als getönte Marken (.sp-chip / .cat-chip). Erledigt bekommt zusätzlich Durchstreichung, weil es sonst dasselbe Grün wie „Später\\\" wäre. aria-pressed ergänzt; Zurücksetzen erfasst jetzt auch die Kategoriengruppe, die vorher stehen blieb. Kontraste 4,94 bis 9,84:1." },

    { id: "n-done-sprintboard-aktuell", page: "sprints", selector: "main", status: "auszubauen", done: true,
      title: "Baustein-Board auf Stand gebracht",
      text: "Das Board stand auf dem Juli-Stand: Baustein 1 „In Arbeit\\\", Baustein 3 „Kaum begonnen\\\", Baustein 4 „V1 steht\\\", alle Termine abgelaufen, Verantwortlichkeit fünfmal „offen\\\". Status jetzt an vorhandenen Artefakten festgemacht — B1 steht (Option C), B2 blockiert (Personalkosten), B3 Kennzahlen liegen vor, B4 lauffähig aber ohne ausgewiesene Iterationsstufen, B5 Material da und Reflexion offen. Spalte „Verantwortlich\\\" durch „Beleg\\\" ersetzt, weil eine Zuordnung im Team das Board nicht selbst trifft. Restzeit bis zum Pitch wird gerechnet statt getippt — eine feste Zahl war genau der Grund, warum das Board veraltet ist." },

    { id: "n-sprint-tabs-1-3-6", page: "sprints", selector: "main", status: "offen",
      title: "Sprint-Reiter 1 und 3 bis 6 nicht geprüft",
      text: "Aktualisiert wurde nur der Reiter Sprint 2. Was in den übrigen fünf Reitern steht, ist gegen den heutigen Stand nicht nachgesehen — insbesondere Sprint 1, der abgeschlossen ist und entsprechend ausgewiesen sein sollte." },

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

    { id: "n-portal-formulare-ohne-pruefung", page: "kundenportal", selector: "main", status: "auszubauen",
      title: "Portalformulare prüfen nichts",
      text: "SEPA-Mandat und Bankverbindung nehmen jede Eingabe an — keine IBAN-Prüfziffer, keine Pflichtfeldkontrolle, kein Schutz gegen doppeltes Absenden. Für die Vorführung ausreichend, vor einer echten Nutzung nicht. Ebenso ist die Adressänderung eine mailto-Verknüpfung; ohne eingerichtetes E-Mail-Programm passiert nichts, der Hinweistext nennt deshalb die Telefonnummer." },

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
    { id: "n-done-cockpit-mobil", page: "cockpit", selector: "main", status: "offen", done: true,
      title: "Cockpit mobil: 420 px waren unerreichbar",
      text: "Bestaetigter Befund: bei 390 px Breite war die Anwendung 810 px breit, body{overflow:hidden} liess 420 px unerreichbar — nicht bloss unbequem. Unter 900 px wird die 236-px-Seitenleiste jetzt eine horizontal scrollbare Zeile oben, Inhalt volle Breite. Nachgemessen: 0 px unerreichbar, Navigations-Tap-Ziel 48 px." },
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
    { id: "n-invest-portal-tokens", page: "allgemein", selector: "main", status: "auszubauen",
      title: "env-invest und env-portal noch offen",
      text: "Investorenbereich (6 Seiten) und Kundenportal sind noch nicht auf die Tokens umgestellt. Investoren bekommen laut Designgrundlage Amber-Ink als Akzent und Radius 14px, das Portal warmes Creme, Waldgruen im Logo, 1,19rem Fliesstext und 56px Tap-Ziele." },
    /* ----- Designgrundlage v1 (05.08.2026) ----- */
    { id: "n-done-tokens-public", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Designgrundlage v1 im oeffentlichen Bereich umgesetzt",
      text: "lz-tokens.css als Einzelquelle eingebunden, eigene :root-Bloecke auf allen 15 oeffentlichen Seiten entfernt, body traegt env-public. 761 px-Schriftgroessen auf rem umgestellt, davon 163 auf die Untergrenze 0,80rem angehoben (kleinster Wert vorher 9 px). Radius 24px aus der Rolle, Bedienelemente mit --line-ui und 48px Tap-Ziel, Emojis durch SVG-Icons ersetzt, Fiktiv-Balken als lz-tick mit Pausensteuerung (96s, aria-pressed, prefers-reduced-motion). Nachgemessen: 1128 Kleintexte, kein Verstoss unter 4,5:1, keine px-Schriftgroesse mehr." },
    { id: "n-tokens-weitere-umgebungen", page: "allgemein", selector: "main", status: "auszubauen", done: true,
      title: "Tokens auf intern und Cockpit ausgerollt",
      text: "env-intern (5 Planspiel-Seiten) und env-cockpit umgesetzt. Cockpit: 94 px-Schriftgroessen auf rem (74 davon unter 12,8 px, kleinste 8,5 px), 64 Farbwerte auf semantische Rollen, neun Statustoene auf die vier Tinten zusammengefuehrt, Warnbalken mit Pausensteuerung ergaenzt (Vollbildhuelle misst die Balkenhoehe). Offen bleiben env-invest und env-portal." },
    { id: "n-tokens-bruecke-abbauen", page: "allgemein", selector: "main", status: "spaeter",
      title: "Kompatibilitaetsbruecke entfernen",
      text: "lz-tokens.css enthaelt eine Bruecke, die Altnamen (--cream, --green, --text2 …) auf die semantischen Rollen abbildet, damit die Migration seitenweise laufen kann. Sobald alle Bauteile Rollen lesen, entfaellt Abschnitt 7 der Datei." },
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
    { id: "n-persona-alter", page: "sprints", selector: ".bst", status: "offen",
      title: "Hildegard Stemmer: Alter und Pflegegrad widersprechen sich",
      text: "Das Personas-Handout (S. 1) fuehrt sie mit 79 Jahren und Pflegegrad 2 in Ruethen-Meiste, das Betriebs-Cockpit mit 82 Jahren und Pflegegrad 3. Auch das Session-Log nennt 79/PG 2. Vor dem Pitch auf einen Wert festlegen." },
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
    { id: "n-inv-umsatz-je-fall", page: "investoren-kennzahlen", selector: ".kpi-row .kpi-item:nth-child(3)", status: "offen",
      title: "11.700 EUR je Pflegefall mischt Foerdermittel ein",
      text: "Die Zahl ist belegt (SWOT S. 2: ~11.700 EUR je Fall, im Normbereich), entsteht aber aus Gesamtumsatz inklusive 38 % Foerdermitteln geteilt durch 180 Faelle. Aus reinem Pflegeumsatz (1,15 Mio EUR) waeren es ~6.400 EUR. Widerspricht der eigenen Regel, Pflegeumsatz und Foerdermittel getrennt auszuweisen — im Q&A angreifbar. Entweder beide Werte zeigen oder die Bezugsgroesse benennen." },
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
            ".fiktiv-marquee:focus-visible{outline:2px solid #fff;outline-offset:-3px;}" +
            ".fiktiv-menu{position:absolute;top:100%;left:16px;margin-top:10px;display:flex;flex-direction:column;gap:8px;background:rgba(30,32,26,0.96);backdrop-filter:blur(6px);border:1px solid rgba(168,201,160,.25);border-radius:16px;padding:14px;min-width:240px;box-shadow:0 18px 44px rgba(0,0,0,.32);animation:lzMenuIn .16s ease-out;}" +
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
    if (loadVisible()) document.body.classList.add("lz-notes-active");
    buildPins();
    watchTick();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
