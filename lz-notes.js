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
    { id: "n-index-trust", page: "index", selector: ".trust", status: "auszubauen",
      title: "Platzhalterzahlen der Vertrauensleiste",
      text: "Die Kennzahlen (24/7 · 5 Pflegegrade · 100 % · gGmbH) sind Platzhalter. Durch echte Werte aus dem Betriebs-Cockpit ersetzen." },

    { id: "n-kundenportal-stub", page: "kundenportal", selector: "main", status: "auszubauen",
      title: "Platzhalterseite Kundenportal",
      text: "Vorläufige Platzhalter-Seite. Portal-Funktionen (Login, Termine, Dokumente, Rechnungen, Nachrichten) in einem späteren Sprint ausbauen." },

    { id: "n-markt-pg1", page: "investoren-markt", selector: "main", status: "spaeter",
      title: "PG-1-/Beratungssegment fehlt",
      text: "~90 Klient:innen in Pflegegrad 1 bzw. reiner Beratung sind nicht als eigenes Segment ausgewiesen (180 = PG 2–5). Ergänzen oder bewusst ausklammern — Entscheidung offen." },

    { id: "n-preise-rechner", page: "preise", selector: "main", status: "auszubauen",
      title: "Preis-Empfehlung / Eigenanteil-Rechner",
      text: "Baustein 2: Eigenanteil-Rechner bzw. Preis-Empfehlung ergänzen. Datenbasis liegt vor." },

    { id: "n-sprints-kampagne", page: "sprints", selector: "main", status: "spaeter",
      title: "Kampagne + 2 Assets (Baustein 3)",
      text: "Marketing-Kampagne plus zwei Assets — bislang kaum begonnen. Größte inhaltliche Lücke in Sprint 2." }
  ];

  /* ---------- 2. Status-Metadaten ---------- */
  var STATUS = {
    offen:      { label: "Offen",           color: "#8C3A2A" },
    auszubauen: { label: "Auszubauen",      color: "#B07A2A" },
    spaeter:    { label: "Späterer Sprint", color: "#4A6741" }
  };

  /* ---------- 3. Erledigt-Status (localStorage + Fallback) ---------- */
  var MEM = {};           // In-Memory-Spiegel (Preview ohne localStorage)
  var KEY = "lz-notes-done";
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
  function isDone(id) { return !!MEM[id]; }
  function setDone(id, done) {
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
      ".fiktiv-note-toggle{display:flex;align-items:center;justify-content:space-between;gap:8px;width:100%;color:#F5F0E8;background:rgba(176,122,42,.16);border:1px solid rgba(176,122,42,.45);border-radius:30px;padding:12px 18px;font:inherit;font-size:15px;letter-spacing:.3px;cursor:pointer;transition:background .12s,transform .12s;}" +
      ".fiktiv-note-toggle:hover{background:rgba(176,122,42,.3);transform:translateX(2px);}" +
      ".fiktiv-note-toggle #lzNotesState{font-weight:600;}" +
      ".lz-note-anchor{position:relative;}" +
      ".lz-note-pin{display:none;position:absolute;top:10px;right:10px;z-index:40;width:30px;height:30px;border-radius:50%;border:2px solid #F5F0E8;background:#B07A2A;color:#fff;font-size:14px;line-height:1;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 4px 14px rgba(0,0,0,.28);}" +
      ".lz-note-pin.s-offen{background:#8C3A2A;}.lz-note-pin.s-auszubauen{background:#B07A2A;}.lz-note-pin.s-spaeter{background:#4A6741;}" +
      "body.lz-notes-active .lz-note-pin{display:flex;animation:lzPinPulse 2.2s ease-in-out infinite;}" +
      "@keyframes lzPinPulse{0%,100%{box-shadow:0 4px 14px rgba(0,0,0,.28),0 0 0 0 rgba(176,122,42,.4);}50%{box-shadow:0 4px 14px rgba(0,0,0,.28),0 0 0 7px rgba(176,122,42,0);}}" +
      ".lz-note-pop{position:absolute;top:48px;right:10px;z-index:41;width:300px;max-width:calc(100vw - 40px);background:#fff;color:#2A2820;border:1px solid rgba(74,103,65,.18);border-radius:12px;padding:16px 18px 16px;box-shadow:0 20px 48px rgba(0,0,0,.22);text-align:left;font-family:'Jost',sans-serif;}" +
      ".lz-note-pop[hidden]{display:none;}" +
      ".lz-note-badge{display:inline-block;font-size:11px;letter-spacing:1px;text-transform:uppercase;font-weight:600;padding:3px 10px;border-radius:20px;margin-bottom:8px;color:#fff;}" +
      ".lz-note-pop h4{font-family:'Cormorant Garamond',serif;font-weight:600;color:#2C3D27;font-size:20px;margin:0 0 4px;line-height:1.2;}" +
      ".lz-note-pop p{font-size:14px;line-height:1.55;color:#5A5648;margin:0 0 12px;}" +
      ".lz-note-pop .lz-note-close{position:absolute;top:8px;right:10px;border:0;background:none;color:#8A8478;font-size:18px;cursor:pointer;line-height:1;}" +
      ".lz-note-done-btn{display:inline-flex;align-items:center;gap:7px;font:inherit;font-size:13px;color:#4A6741;background:rgba(74,103,65,.08);border:1px solid rgba(74,103,65,.25);border-radius:20px;padding:7px 14px;cursor:pointer;}" +
      ".lz-note-done-btn:hover{background:rgba(74,103,65,.16);}";
    var el = document.createElement("style");
    el.id = "lz-notes-css";
    el.textContent = css;
    document.head.appendChild(el);
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
    setDone: setDone,
    rebuild: function () { clearPins(); buildPins(); }
  };

  /* ---------- 10. Init ---------- */
  function init() {
    loadDone();
    injectCSS();
    if (loadVisible()) document.body.classList.add("lz-notes-active");
    buildPins();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
