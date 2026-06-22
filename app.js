/* FAI Action — render content.json into the page. No framework, no build. */
(function () {
  "use strict";

  const $ = (id) => document.getElementById(id);
  const el = (tag, props = {}, kids = []) => {
    const n = document.createElement(tag);
    Object.assign(n, props);
    for (const k of [].concat(kids)) if (k) n.append(k);
    return n;
  };

  function person(p) {
    const item = el("div", { className: "staff__item" });
    if (p.photo) item.append(el("img", { className: "staff__photo", src: p.photo, alt: p.name || "", loading: "lazy", decoding: "async" }));
    const c = el("div", { className: "staff__content" });
    c.append(el("h3", { className: "staff__name", textContent: p.name || "" }));
    if (p.title) c.append(el("p", { className: "staff__title", textContent: p.title }));
    if (p.org) c.append(el("p", { className: "staff__org", textContent: p.org }));
    const bioParas = Array.isArray(p.bio) ? p.bio : (p.bio ? String(p.bio).split(/\n{2,}/) : []);
    bioParas.forEach((para) => { const t = String(para).trim(); if (t) c.append(el("p", { className: "staff__bio", textContent: t })); });
    const links = el("div", { className: "staff__links" });
    if (p.linkedin) links.append(el("a", { href: p.linkedin, target: "_blank", rel: "noopener", textContent: "LinkedIn" }));
    if (p.twitter) links.append(el("a", { href: p.twitter, target: "_blank", rel: "noopener", textContent: "X" }));
    if (links.childNodes.length) c.append(links);
    item.append(c);
    return item;
  }

  function render(c) {
    if (c.splash && c.splash.subtitle) $("subtitle").textContent = c.splash.subtitle;

    if (c.about) {
      if (c.about.label) $("about-label").textContent = c.about.label;
      $("about-lead").textContent = c.about.lead || "";
      const body = $("about-body");
      body.replaceChildren();
      (c.about.body || []).forEach((para) => body.append(el("p", { textContent: para })));
    }

    const groups = c.groups || [];
    groups.forEach((g, i) => {
      const sec = $("group-" + i);
      if (!sec) return;
      const label = $("group-" + i + "-label");
      if (label && g.label) label.textContent = g.label;
      const list = $("group-" + i + "-list");
      if (!list) return;
      list.replaceChildren();
      (g.people || []).forEach((p) => list.append(person(p)));
    });
    for (let i = groups.length; $("group-" + i); i++) $("group-" + i).style.display = "none";

    const f = c.contact || {};
    const fc = $("footer-contact");
    fc.replaceChildren();
    if (f.email) fc.append(el("div", {}, el("a", { href: "mailto:" + f.email, textContent: f.email })));
    if (f.x || f.location) {
      const line = el("div");
      if (f.x) line.append(el("a", { href: f.xUrl || "#", target: "_blank", rel: "noopener", textContent: f.x }));
      if (f.x && f.location) line.append(document.createTextNode("  ·  "));
      if (f.location) line.append(document.createTextNode(f.location));
      fc.append(line);
    }
    if (f.copyright) fc.append(el("div", { className: "footer__copy", textContent: f.copyright }));
  }

  function reveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((n) => n.classList.add("is-in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); } }),
      { rootMargin: "0px 0px -10% 0px" }
    );
    items.forEach((n) => io.observe(n));
  }

  fetch("./content.json", { cache: "no-cache" })
    .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then((c) => { render(c); reveal(); window.dispatchEvent(new Event("content-ready")); })
    .catch((err) => { console.error("content.json failed to load:", err); reveal(); });
})();
