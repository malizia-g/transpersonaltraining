# Colour Planner

A live copy of the home page with a colour switcher on it, so a scheme can be
judged against the real photographs and the real type instead of a swatch card.

**https://malizia-g.github.io/transpersonaltraining/color-planner/**

It is a preview, not the site. It is marked `noindex` and excluded by
`robots.txt`, so it will not show up in search results or compete with the live
pages it copies. Nothing you do in it changes the live site — your choices are
saved in your own browser only, and nobody else sees them.

Open it, then click **Colours** in the bottom-right corner.

---

## How to use it

### 1. Pick a category

Along the top of the panel: **Nature**, **Earth**, **Spiritual**.

**Hybrids** shows the six schemes that belong to two families at once — a green
ground with clay gradients, warm clay under amethyst shadows, and so on. Those
also appear under both of their own families, so a hybrid of Nature and Earth
turns up whichever of the two you are browsing.

**All** shows the whole set of 22. **Classic** is the one scheme the site
currently uses, kept as a reference to compare the rest against.

### 2. Choose a scheme

Click any row. The whole page retints at once — header, buttons, headings,
card borders, links, the bands over the photographs, and the footer.

Scroll the page while a scheme is on. The opening video, the light cards, the
quote band, the photo strip and the contact form all react differently to a
palette, and a scheme that works at the top can fall apart further down.

The small swatch on each row previews that scheme's three main colours, so the
list reads as a set of options rather than 22 copies of whatever is on screen.

### 3. Adjust the tones

Under **Tune this scheme**, five roles:

| Role | Where it shows |
|---|---|
| **Deep** | the dark ground — hero, quote band, contact section, footer |
| **Paper** | the light section backgrounds |
| **Accent** | buttons, kickers, hairlines |
| **Second** | card borders, drop caps, section kickers |
| **Dusk** | the second dark the gradients drift towards |

Each has three sliders — **H** hue, **S** saturation, **L** lightness. Moving one
retints everything that role touches at once, because the rest of the page's
colours are derived from these five rather than set individually.

To set a colour exactly rather than by feel, use either:

- the **swatch** to the left of the role name — click it to open your system
  colour picker, and drag inside it to watch the page follow live; or
- the **hex field** to the right — type something like `#2F6B3A` and press Enter.

Both write the same three numbers the sliders do, so whichever you use, the
sliders move to match.

### 4. Adjust the colour over the video

Under **Veil over the photographs**, four sliders. The hero, the quote band and
the contact band are photographs with a wash of palette colour laid over them,
and each wash has its own control:

| Slider | What it covers |
|---|---|
| **Hero** | the opening video |
| **Sunset glow** | the warm light rising off the bottom of the hero |
| **Quote band** | the mandala collection behind the quotation |
| **Contact band** | the fire-pit photograph behind the contact form |

100% is the weight the design ships with. Lower it to let more of the picture
through; raise it past 100% to bury the picture further under colour. At 0% the
photograph is bare — useful for seeing what the wash is actually doing, though
the logo and navigation become hard to read, which is the trade-off the slider
exists to let you judge.

### Finishing up

- **Reset scheme** undoes your changes to the scheme you are on. Every other
  scheme keeps its own tuning, so you can leave several part-tuned and come back.
- **Copy CSS** puts the finished numbers on your clipboard, ready to be pasted
  back into the project (see below).
- Your scheme, your tuning and the category filter are remembered in your
  browser, so closing the tab does not lose your work. A different browser, a
  different device or a private window starts fresh.

---

## For whoever implements the choice

Once a scheme is settled on:

1. In the planner, press **Copy CSS**. You get a block like

   ```css
   [data-palette="green"] {
       --deep-h: 155; --deep-s: 45%; --deep-l: 13%;
       ...
       --veil-hero: 0.8;
   }
   ```

2. Put those numbers into the matching entry in
   [`scripts/design/palettes.js`](../scripts/design/palettes.js) — that table is
   the single source of truth.

3. Re-run the generator:

   ```bash
   node scripts/design/build-palettes.js
   ```

   It rewrites both the CSS block in `src/styles/main.css` and the switcher's
   catalogue in `src/scripts/modules/palette-catalogue.js`, so the two cannot
   drift apart.

The generator will refuse to write anything unless every palette clears
fourteen WCAG contrast pairs and every derived tone stays inside 0–100%. If a
hand-tuned scheme fails, `node scripts/design/build-palettes.js --tune` prints
the smallest lightness change that would fix it.

One palette is exempt: `blue` reproduces what is live today, including a
terracotta kicker on cream at 4.06:1 — below the 4.5:1 that small text needs.
It is reported on every run but never blocked or "corrected", because its whole
job is to be a faithful reference for judging the alternatives. If that
shortfall is worth fixing on the live site, darkening its `sec` lightness from
48 to about 45 clears it — but that is a change to the current design, so it is
a decision, not a cleanup.

## How it gets published

[`.github/workflows/deploy-color-planner.yml`](../.github/workflows/deploy-color-planner.yml)
runs on every push to `new_color_scheme`. It verifies the palette catalogue,
builds with `PATH_PREFIX=/transpersonaltraining/color-planner/`, marks every
page `noindex`, and publishes into the `color-planner/` subfolder of the
`deploy` branch. The main site deploys with `keep_files: true`, so the two live
side by side without overwriting each other.
