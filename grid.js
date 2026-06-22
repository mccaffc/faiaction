/* FAI Action — grid system: toggle overlay (button + G), populate column guides, optical ink alignment.
 * The grid is the IBM 2x / Müller-Brockmann field defined in styles.css :root. This file makes it visible + load-bearing. */
(function () {
  "use strict";

  // ---- toggle (button + 'G' key) ----
  var btn = document.getElementById("gridToggle");
  function setGrid(on) {
    document.body.classList.toggle("grid-on", on);
    if (btn) btn.setAttribute("aria-pressed", on ? "true" : "false");
  }
  if (btn) btn.addEventListener("click", function () { setGrid(!document.body.classList.contains("grid-on")); });
  document.addEventListener("keydown", function (e) {
    if ((e.key === "g" || e.key === "G") && !e.metaKey && !e.ctrlKey && !e.altKey) {
      var t = e.target;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;
      setGrid(!document.body.classList.contains("grid-on"));
    }
  });

  // ---- populate every overlay's numbered column guides ----
  var cols = parseInt(getComputedStyle(document.documentElement).getPropertyValue("--cols"), 10) || 16;
  document.querySelectorAll(".guides .cols").forEach(function (h) {
    h.replaceChildren();
    for (var i = 1; i <= cols; i++) {
      var c = document.createElement("div");
      c.className = "col";
      var s = document.createElement("span");
      s.textContent = i;
      c.appendChild(s);
      h.appendChild(c);
    }
  });

  // ---- optical alignment: shift display ink onto its column line ----
  var cvs = document.createElement("canvas"), ctx = cvs.getContext("2d");
  var sel = ".lead, .staff__name";
  function align() {
    document.querySelectorAll(sel).forEach(function (el) {
      el.style.marginLeft = "0px";
      var cs = getComputedStyle(el), ch = (el.textContent || "").trim().charAt(0);
      if (!ch) return;
      if (cs.textTransform === "uppercase") ch = ch.toUpperCase();
      ctx.font = cs.fontStyle + " " + cs.fontWeight + " " + cs.fontSize + " " + cs.fontFamily;
      ctx.textAlign = "left";
      var abl = ctx.measureText(ch).actualBoundingBoxLeft; // +ve = ink overhangs left of box
      if (isFinite(abl)) el.style.marginLeft = abl.toFixed(2) + "px";
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(align);
  window.addEventListener("content-ready", align); // staff names render after content.json loads
  align();
  var t;
  window.addEventListener("resize", function () { clearTimeout(t); t = setTimeout(align, 120); });
})();
