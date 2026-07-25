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
  var CATS = {
    basis:   { label: "Datenbasis",        farbe: "#4A6741", sym: "\u25C6", info: "Verbindlicher Steckbrief \u2014 unveraendert uebernehmen." },
    amt:     { label: "Amtliche Statistik", farbe: "#8AAC85", sym: "\u25B2", info: "Externe Quelle, im Pitch zitierbar." },
    ziel:    { label: "Ziel / Planwert",   farbe: "#B07A2A", sym: "\u25CF", info: "Angestrebter Wert \u2014 nicht als Ist ausgeben." },
    annahme: { label: "Annahme",           farbe: "#5A5648", sym: "\u25CB", info: "Abgeleitet oder geschaetzt \u2014 Herleitung offenlegen." },
    platz:   { label: "Platzhalter",       farbe: "#8C3A2A", sym: "\u2715", info: "Nicht belegt \u2014 vor dem Pitch ersetzen oder streichen." }
  };

  /* ---------- 2. Registry: Datenpunkte je Seite ---------- */
  /* sel = CSS-Selektor, idx = n-tes Vorkommen (0-basiert) */
  var GUETE = {
    A: "A \u00b7 Sprint-Unterlage mit Seite & Abschnitt",
    B: "B \u00b7 externe Statistik, \u00fcber Sprint-Unterlage belegt",
    C: "C \u00b7 abgeleitet / im Dokument als Annahme markiert",
    D: "D \u00b7 kein Beleg vorhanden"
  };
  var BD = "LebensZeit_Geschaeftsmodell_Basisdaten.pdf";
  var IP = "LebensZeit_Investorpitch_20min.pdf";

  var SRC = [
    /* --- Startseite: Vertrauensleiste (bereinigt, alle Werte belegt) --- */
    { page: "index", sel: ".trust-item", idx: 0, wert: "6\u201322 Uhr \u00b7 Fr\u00fch- & Sp\u00e4tdienst", kat: "basis",
      dok: BD, seite: "5", absch: "C.3 Schichtmodell", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Fr\u00fch- (6\u201314) und Sp\u00e4tdienst (14\u201322), kein Nachtdienst; Wochenende \u00fcber rotierende Bereitschaft. Ersetzt die fr\u00fchere Aussage 24/7." },
    { page: "index", sel: ".trust-item", idx: 1, wert: "180 betreute Pflegef\u00e4lle (PG 2\u20135)", kat: "basis",
      dok: BD, seite: "6", absch: "D.1 Klientenstruktur nach Pflegegrad", stand: "Sprint 1", guete: "A",
      hinweis: "PG 2: 70 \u00b7 PG 3: 65 \u00b7 PG 4: 35 \u00b7 PG 5: 10. Ebenfalls im Kennzahlenblock S. 2, Abschnitt 1." },
    { page: "index", sel: ".trust-item", idx: 2, wert: "45 Ehrenamtliche", kat: "basis",
      dok: BD, seite: "2", absch: "1 \u00b7 Das Gesch\u00e4ftsmodell \u2014 einfach erkl\u00e4rt", stand: "Sprint 1", guete: "A",
      hinweis: "Kennzahlenblock; Personaldetail S. 7, Abschnitt F: Ehrenamtskoordination 1 Kopf f\u00fcr 45 Ehrenamtliche." },
    { page: "index", sel: ".trust-item", idx: 3, wert: "gGmbH \u00b7 gemeinn\u00fctzig", kat: "basis",
      dok: BD, seite: "2", absch: "1 \u00b7 Kernlogik", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: ambulanter Pflegedienst (gemeinn\u00fctzige gGmbH)." },

    /* --- Einzugsgebiet --- */
    { page: "einzugsgebiet", sel: ".kpi-item", idx: 0, wert: "5 Standorte", kat: "basis",
      dok: BD, seite: "2", absch: "1 \u00b7 Das Gesch\u00e4ftsmodell \u2014 einfach erkl\u00e4rt", stand: "Sprint 1", guete: "A",
      hinweis: "Erwitte (Hauptsitz), Bad Sassendorf, Anr\u00f6chte, R\u00fcthen, Lippetal." },
    { page: "einzugsgebiet", sel: ".kpi-item", idx: 1, wert: "60.900 Einwohner", kat: "amt",
      dok: BD, seite: "2", absch: "1 \u00b7 Kennzahlenblock", stand: "Sprint 1", guete: "B",
      extern: "Destatis Pflegestatistik \u00b7 IT.NRW \u00b7 Bertelsmann Stiftung 2023 (Quellenzeile " + IP + ", S. 4)",
      hinweis: "Aufteilung im Investorpitch S. 5: Erwitte ~16.200 \u00b7 Bad Sassendorf ~13.100 \u00b7 Anr\u00f6chte ~8.400 \u00b7 R\u00fcthen ~10.700 \u00b7 Lippetal Rest. Standortkarte nennt f\u00fcr Erwitte 16.300 \u2014 Abweichung offen.",
      todo: "einzugsgebiet" },
    { page: "einzugsgebiet", sel: ".kpi-item", idx: 2, wert: "180 Pflegef\u00e4lle", kat: "basis",
      dok: BD, seite: "6", absch: "D.1 Klientenstruktur nach Pflegegrad", stand: "Sprint 1", guete: "A",
      hinweis: "Nur PG 2\u20135; PG 1 nur Beratung (~90) und nicht enthalten." },

    /* --- Investoren / Markt --- */
    { page: "investoren-markt", sel: ".kpi-item", idx: 0, wert: "~3,0 Mio \u20ac adressierbares Volumen", kat: "annahme",
      dok: BD, seite: "7", absch: "3 \u00b7 Annahmen & Konsistenz-Hinweise, Punkt 3", stand: "Sprint 1", guete: "C",
      hinweis: "Das Dokument markiert die Zahl selbst als bekannte Schwachstelle: passt nicht zu 3.995 Pflegebed\u00fcrftigen \u00d7 Sachleistung. Saubere Definition vor dem n\u00e4chsten Sprint festklopfen.",
      todo: "investoren-markt" },
    { page: "investoren-markt", sel: ".kpi-item", idx: 1, wert: "~3.995 Pflegebed\u00fcrftige", kat: "amt",
      dok: IP, seite: "5", absch: "Baustein 1 \u00b7 Regionalmarkt Kreis Soest", stand: "Sprint 1", guete: "B",
      extern: "Destatis Pflegestatistik \u00b7 IT.NRW (Quellenzeile S. 4)",
      hinweis: "Bezugsgr\u00f6\u00dfe der Penetrationsrate 4,5 % (180 von ~3.995)." },
    { page: "investoren-markt", sel: ".kpi-item", idx: 2, wert: "60.900 Einwohner", kat: "amt",
      dok: IP, seite: "5", absch: "Baustein 1 \u00b7 Regionalmarkt Kreis Soest", stand: "Sprint 1", guete: "B",
      extern: "Destatis \u00b7 IT.NRW \u00b7 Bertelsmann Stiftung 2023 (Quellenzeile S. 4)",
      hinweis: "Muss mit dem Einzugsgebiet und der Standortkarte konsistent bleiben.",
      todo: "einzugsgebiet" },
    { page: "investoren-markt", sel: ".kpi-item", idx: 3, wert: "+4\u20135 % Marktwachstum p. a.", kat: "amt",
      dok: IP, seite: "4", absch: "Baustein 1 \u00b7 Makromarkt, Kachel MARKTWACHSTUM P. A.", stand: "Sprint 1", guete: "B",
      extern: "Destatis Pflegestatistik \u00b7 IT.NRW \u00b7 Bertelsmann Stiftung 2023 (Sammelquelle der Seite)",
      hinweis: "Begr\u00fcndung im Dokument: Babyboomer erreichen ab 2030 das Hochpflegealter. Einzelnachweis je Zahl fehlt \u2014 f\u00fcr das Q&A nachtragen." },

    /* --- Mitgliedschaft --- */
    { page: "mitgliedschaft", sel: ".tier", idx: 0, wert: "Basis / F\u00f6rder 48 \u20ac/Jahr", kat: "basis",
      dok: BD, seite: "3", absch: "Was bieten die Mitgliedschaften? (520 Mitglieder)", stand: "Sprint 1", guete: "A",
      hinweis: "Leistung: Newsletter, Begegnungsort-Events, kostenlose Erstberatung. Bestand 300. Auch S. 5, Abschnitt B." },
    { page: "mitgliedschaft", sel: ".tier", idx: 1, wert: "Aktiv 120 \u20ac/Jahr", kat: "basis",
      dok: BD, seite: "3", absch: "Was bieten die Mitgliedschaften? (520 Mitglieder)", stand: "Sprint 1", guete: "A",
      hinweis: "Leistung: priorisierte Beratung, Angeh\u00f6rigen-App, 10 % auf Entlastungsleistungen, freie Kurse. Bestand 170." },
    { page: "mitgliedschaft", sel: ".tier", idx: 2, wert: "Premium 360 \u20ac/Jahr", kat: "basis",
      dok: BD, seite: "3", absch: "Was bieten die Mitgliedschaften? (520 Mitglieder)", stand: "Sprint 1", guete: "A",
      hinweis: "Leistung: garantierte Versorgungskapazit\u00e4t, fester Ansprechpartner, Hausnotruf inkl., volle App. Bestand 50 \u2014 Summe 520." },

    /* --- \u00dcber uns --- */
    { page: "ueber-uns", sel: ".stat-box", idx: 0, wert: "56 Mitarbeitende", kat: "basis",
      dok: BD, seite: "7", absch: "F \u00b7 Personalstruktur (Detail)", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Summe besetzt 56, Soll 64 \u2192 8 offene Fachkraftstellen. 34 Vollzeit + 22 Teilzeit, ~45 FTE." },
    { page: "ueber-uns", sel: ".stat-box", idx: 1, wert: "25 examinierte Pflegekr\u00e4fte", kat: "basis",
      dok: BD, seite: "7", absch: "F \u00b7 Personalstruktur (Detail)", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: Examinierte gesamt 25 \u2014 20 in der ambulanten Pflege plus 5 Standort-/Pflegedienstleitungen. Harte Nebenbedingung f\u00fcr \u00a737.3." },
    { page: "ueber-uns", sel: ".stat-box", idx: 2, wert: "45 Ehrenamtliche", kat: "basis",
      dok: BD, seite: "2", absch: "1 \u00b7 Kennzahlenblock", stand: "Sprint 1", guete: "A",
      hinweis: "Koordination durch 1 Stelle (S. 7, Abschnitt F); teilweise \u00a745c/d-f\u00f6rderrelevant." },
    { page: "ueber-uns", sel: ".stat-box", idx: 3, wert: "6 Auszubildende", kat: "basis",
      dok: BD, seite: "7", absch: "F \u00b7 Personalstruktur (Detail)", stand: "Sprint 1", guete: "A",
      hinweis: "Wortlaut: 6 Azubis (Kooperation Pflegeschulen Soest/Lippstadt)." },

    /* --- Preise --- */
    { page: "preise", sel: "h1", idx: 0, wert: "Preis- und Eigenanteilsangaben", kat: "basis",
      dok: BD, seite: "4", absch: "A.4 Selbstzahler-Stundensatz", stand: "Sprint 1", guete: "A",
      extern: "Sachleistungsbetr\u00e4ge SGB XI \u00a736 / Entlastungsbetrag \u00a745b (Gesetz)",
      hinweis: "Belegt: 38 \u20ac/Std. Hilfskraft, 52 \u20ac/Std. examinierte Fachkraft; Sachleistungs-Caps je Pflegegrad auf S. 6, Abschnitt D.1 (761 / 1.432 / 1.778 / 2.200 \u20ac). Offen: Eigenanteil-Rechner und die 62 %\u219270 %-Br\u00fccke (Baustein 2).",
      todo: "preise" },

    /* --- Unternehmensdaten --- */
    { page: "unternehmensdaten", sel: ".annahmen", idx: 0, wert: "Annahmen-Log (6 Werte)", kat: "annahme",
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
  function mine() { var s = slug(); return SRC.filter(function (x) { return x.page === s; }); }
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]; }); }

  /* ---------- 5. CSS ---------- */
  function injectCSS() {
    if (document.getElementById("lz-src-css")) return;
    var c = [];
    Object.keys(CATS).forEach(function (k) {
      c.push(".lz-src-host.k-" + k + "{outline:2px dashed " + CATS[k].farbe + ";outline-offset:3px;}");
      c.push(".lz-src-badge.k-" + k + "{background:" + CATS[k].farbe + ";}");
      c.push(".lz-src-dot.k-" + k + "{background:" + CATS[k].farbe + ";}");
    });
    var css = c.join("") +
      ".lz-src-host{position:relative;}" +
      ".lz-src-badge{position:absolute;top:3px;right:4px;z-index:40;color:#fff;font:600 10px/1 Jost,system-ui,sans-serif;letter-spacing:.4px;padding:4px 7px;border-radius:20px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.28);border:0;}" +
      ".lz-src-badge:hover{transform:scale(1.08);}" +
      ".lz-src-pop{position:absolute;z-index:60;top:26px;right:0;width:265px;background:#fff;color:#2A2820;border:1px solid rgba(74,103,65,.28);border-radius:12px;padding:13px 15px;box-shadow:0 16px 40px rgba(0,0,0,.2);font:400 13px/1.5 Jost,system-ui,sans-serif;text-align:left;}" +
      ".lz-src-pop h5{font:600 14px/1.3 Jost,system-ui,sans-serif;margin:0 0 6px;color:#2C3D27;}" +
      ".lz-src-pop .kat{display:inline-block;font-size:10.5px;font-weight:600;letter-spacing:.5px;text-transform:uppercase;color:#fff;border-radius:20px;padding:2px 9px;margin-bottom:8px;}" +
      ".lz-src-pop dl{margin:0;display:grid;grid-template-columns:58px 1fr;gap:3px 9px;}" +
      ".lz-src-pop dt{color:#8A8478;font-size:11.5px;}" +
      ".lz-src-pop dd{margin:0;font-size:12.5px;}" +
      ".lz-src-pop dd.dok{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:11px;word-break:break-all;}" +
      ".lz-src-pop .hint{margin-top:9px;font-size:12px;color:#5A5648;border-top:1px solid rgba(74,103,65,.14);padding-top:8px;}" +
      ".lz-src-pop .tlink{display:inline-block;margin-top:8px;font-size:12px;color:#8C3A2A;font-weight:500;}" +
      ".lz-src-pop .cls{position:absolute;top:6px;right:9px;border:0;background:none;font-size:16px;color:#8A8478;cursor:pointer;line-height:1;}" +
      /* Panel */
      ".lz-src-panel{position:fixed;right:18px;bottom:18px;z-index:9998;width:340px;max-height:62vh;display:flex;flex-direction:column;background:#fff;border:1px solid rgba(74,103,65,.25);border-radius:16px;box-shadow:0 20px 50px rgba(0,0,0,.24);font:400 13px/1.5 Jost,system-ui,sans-serif;color:#2A2820;overflow:hidden;}" +
      ".lz-src-panel header{background:#2C3D27;color:#F5F0E8;padding:12px 15px;display:flex;align-items:center;gap:10px;}" +
      ".lz-src-panel header b{font:600 14px/1.2 Jost,system-ui,sans-serif;}" +
      ".lz-src-panel header .x{margin-left:auto;border:0;background:none;color:#cfe0cb;font-size:17px;cursor:pointer;line-height:1;}" +
      ".lz-src-sum{padding:10px 15px;font-size:12px;color:#5A5648;border-bottom:1px solid rgba(74,103,65,.14);background:#F5F0E8;}" +
      ".lz-src-legend{display:flex;flex-wrap:wrap;gap:5px 10px;padding:9px 15px;border-bottom:1px solid rgba(74,103,65,.14);}" +
      ".lz-src-legend span{font-size:11px;color:#5A5648;display:inline-flex;align-items:center;gap:5px;}" +
      ".lz-src-dot{width:9px;height:9px;border-radius:50%;display:inline-block;}" +
      ".lz-src-list{overflow-y:auto;padding:6px 0;}" +
      ".lz-src-row{display:grid;grid-template-columns:11px 1fr;gap:9px;align-items:start;width:100%;text-align:left;border:0;background:none;padding:9px 15px;cursor:pointer;font:inherit;border-bottom:1px solid rgba(74,103,65,.08);}" +
      ".lz-src-row:last-child{border-bottom:0;}" +
      ".lz-src-row:hover{background:#F5F0E8;}" +
      ".lz-src-row .rd{width:9px;height:9px;border-radius:50%;margin-top:5px;}" +
      ".lz-src-row b{display:block;font-weight:600;font-size:12.5px;color:#2C3D27;}" +
      ".lz-src-row small{display:block;color:#5A5648;font-size:11.5px;}" +
      ".lz-src-empty{padding:18px 15px;color:#8A8478;font-style:italic;font-size:12.5px;}" +
      ".lz-src-pulse{animation:lzSrcPulse 1.1s ease-out 2;}" +
      "@keyframes lzSrcPulse{0%,100%{box-shadow:0 0 0 0 rgba(176,122,42,0);}50%{box-shadow:0 0 0 7px rgba(176,122,42,.32);}}" +
      "@media(max-width:620px){.lz-src-panel{right:8px;left:8px;width:auto;max-height:52vh;}.lz-src-pop{width:210px;}}";
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
      '<span class="kat" style="background:' + cat.farbe + '">' + cat.sym + " " + esc(cat.label) + "</span>" +
      "<h5>" + esc(entry.wert) + "</h5>" +
      "<dl><dt>Dokument</dt><dd class=\"dok\">" + esc(entry.dok) + "</dd>" +
      "<dt>Seite</dt><dd>S. " + esc(entry.seite) + "</dd>" +
      "<dt>Abschnitt</dt><dd>" + esc(entry.absch) + "</dd>" +
      (entry.extern ? "<dt>Ursprung</dt><dd>" + esc(entry.extern) + "</dd>" : "") +
      "<dt>Stand</dt><dd>" + esc(entry.stand) + "</dd>" +
      "<dt>Beleg</dt><dd><b>" + esc(GUETE[entry.guete] || GUETE.D) + "</b></dd></dl>" +
      (entry.hinweis ? '<div class="hint">' + esc(entry.hinweis) + "</div>" : "") +
      (entry.todo ? '<a class="tlink" href="/notizen?page=' + encodeURIComponent(entry.todo) + '">\u2192 offene To-Do-Punkte dieser Seite</a>' : "");
    d.querySelector(".cls").addEventListener("click", function (e) { e.stopPropagation(); closePops(); });
    d.addEventListener("click", function (e) { e.stopPropagation(); });
    host.appendChild(d);
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
    panel();
  }
  function clear() {
    closePops();
    document.querySelectorAll(".lz-src-badge").forEach(function (b) { b.remove(); });
    document.querySelectorAll(".lz-src-host").forEach(function (h) {
      h.className = h.className.replace(/\blz-src-host\b/, "").replace(/\bk-(basis|amt|ziel|annahme|platz)\b/, "").trim();
    });
    var p = document.querySelector(".lz-src-panel"); if (p) p.remove();
  }

  /* ---------- 7. Panel ---------- */
  function panel() {
    var list = mine();
    var wrap = document.createElement("div");
    wrap.className = "lz-src-panel";
    var counts = { basis: 0, amt: 0, ziel: 0, annahme: 0, platz: 0 };
    list.forEach(function (x) { counts[x.kat]++; });
    var belegt = counts.basis + counts.amt;
    var legend = Object.keys(CATS).map(function (k) {
      return '<span><i class="lz-src-dot k-' + k + '"></i>' + esc(CATS[k].label) + " " + counts[k] + "</span>";
    }).join("");
    var rows = list.length
      ? list.map(function (x, i) {
          return '<button class="lz-src-row" data-i="' + i + '"><i class="rd lz-src-dot k-' + x.kat + '"></i>' +
            "<span><b>" + esc(x.wert) + "</b><small>" + esc(x.dok.replace(/\.pdf$/, "")) + " · S. " + esc(x.seite) + " · " + esc(x.absch) + "</small></span></button>";
        }).join("")
      : '<div class="lz-src-empty">F\u00fcr diese Seite sind noch keine Quellen erfasst \u2014 Konzeptstand, Registry in lz-quellen.js erweiterbar.</div>';
    wrap.innerHTML =
      "<header><b>Datenherkunft</b><span style=\"font-size:12px;opacity:.75\">" + esc(PNAME[slug()] || slug()) + "</span>" +
      '<button class="x" aria-label="Overlay schliessen">\u00d7</button></header>' +
      '<div class="lz-src-sum">' + list.length + (list.length === 1 ? " Datenpunkt \u00b7 " : " Datenpunkte \u00b7 ") + belegt + " belegt \u00b7 " +
      (counts.ziel + counts.annahme) + " Ziel/Annahme \u00b7 " + counts.platz + " Platzhalter</div>" +
      '<div class="lz-src-legend">' + legend + "</div>" +
      '<div class="lz-src-list">' + rows + "</div>";
    wrap.querySelector(".x").addEventListener("click", function () { toggle(false); });
    wrap.querySelectorAll(".lz-src-row").forEach(function (r) {
      r.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var e = list[+r.dataset.i]; if (!e || !e._host) return;
        e._host.scrollIntoView({ behavior: "smooth", block: "center" });
        e._host.classList.add("lz-src-pulse");
        setTimeout(function () { e._host.classList.remove("lz-src-pulse"); }, 2400);
        popover(e, e._host);
      });
    });
    wrap.addEventListener("click", function (ev) { ev.stopPropagation(); });
    document.body.appendChild(wrap);
  }

  /* ---------- 8. Toggle im Pillmenü ---------- */
  function syncLabel() {
    var s = document.getElementById("lzSrcState");
    if (s) s.textContent = on ? "An" : "Aus";
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
    b.innerHTML = "<span>\u{1F50E} Datenquellen</span><span id=\"lzSrcState\">Aus</span>";
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
