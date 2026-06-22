# FAI Action — landing site

A single, restrained page for FAI Action (the 501(c)(4) affiliate of the Foundation for American Innovation): a full-screen splash with the drawn **FAI ACTION** lockup, an **About** section, a **Staff** listing, and a contact footer. Static — no build step, no framework.

> Brand: FAI Action sub-brand — Cod Gray ground, Smoke White type, IBM Plex (Serif / Sans Condensed / Mono), the **outlined** double-chevron mark, International Orange as a single ≤4% signal. Designed with the `harmony` engine (FAI overlay, Action variant). "The brand is not online" — this page says who we are and how to reach us, nothing more.

## Structure

```
faiaction/                  (lives under FAI/FAI Sites/)
  index.html        splash + about + staff + footer (spread / wrap / grid / band)
  styles.css        FAI Action tokens + the IBM 2x grid (one source of truth)
  app.js            renders content.json into the page
  grid.js           grid overlay toggle (G key) + optical ink alignment
  content.json      ← the editable content (about, staff, contact)
  admin/index.html  GUI editor: edit + download content.json
  assets/           official lockup + chevron SVGs, favicon
  assets/fonts/     Schmalfette Grotesk (woff2/woff) — wired but dormant
  assets/team/      team + board headshots (sourced from the live site)
```

Content is sourced verbatim from the live faiaction.org (home + about): the Our Vision statement, the Team and Board rosters with real bios/affiliations, headshots, and each person's LinkedIn / X links. Headshots render grayscale (colour on hover) to sit in the dark palette.

The page's **copy is data**: `app.js` fetches `content.json` and renders the About, Staff, and contact. The splash lockup is the official drawn asset (composited, never re-typed — chevron law).

**Grid system.** Built on the IBM 2x grid (16 columns · 32px gutters · 96px margins · 8px baseline), one source of truth in `styles.css :root`. Every block hangs on a column line via subgrid bands; press **`G`** (or the top-right toggle) to reveal the column + baseline overlay. Display ink is optically nudged onto its line at runtime (`grid.js`).

**Schmalfette** is loaded via `@font-face` and exposed as `--font-display` / `.display`, but **not used** — FAI Action has no display face. It's wired in case it's ever needed.

## Editing content (no code)

1. Open **`/admin/`** in a browser (locally: `…/faiaction/admin/`; live: `…/admin/`).
2. It loads the current `content.json`. Edit the About text, add/remove/reorder staff, update contact.
3. Click **Download content.json**.
4. Replace `content.json` in the repo, commit & push — GitHub Pages redeploys automatically.

(Opening over `file://` blocks the auto-load; use **Load file…** to open an existing `content.json`, then Download when done.)

## Run locally

`fetch()` needs http, so use a tiny server rather than opening the file directly:

```sh
cd faiaction && python3 -m http.server 8080
# → http://localhost:8080/  (site)   http://localhost:8080/admin/  (editor)
```

## Deploy (GitHub Pages)

Static root-served site. Push to a `mccaffc/faiaction` repo with Pages on `main`, or drop into the existing FAI Pages setup. Add a `CNAME` with `faiaction.org` when the custom domain is ready. `.nojekyll` is included so files serve as-is.

## Assets

`assets/faiaction-*.svg` are copied from `FAI Action/Brand/Logo-Assets/` (the official drawn lockups). Don't redraw the chevron — always composite the official asset.
