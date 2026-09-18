---
name: DOPPELGÄNGER.md
description: One open Markdown file that teaches any AI your voice.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.145 0 0)"
  primary-foreground: "oklch(1 0 0)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.145 0 0)"
  border: "oklch(0.145 0 0 / 14%)"
  ring: "oklch(0.145 0 0)"
  secondary: "oklch(0.97 0 0)"
  secondary-foreground: "oklch(0.145 0 0)"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(2.25rem, 9vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  lede:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "clamp(1.25rem, 0.75rem + 1.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "0"
  body:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "Archivo, Helvetica Neue, Helvetica, Arial, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "0.06em"
  code:
    fontFamily: "JetBrains Mono, ui-monospace, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
rounded:
  sm: "0"
  md: "0"
spacing:
  tap: "2.75rem"
  page-inline: "1.25rem"
  page-block: "3rem"
  desktop-page-block: "6rem"
  heading-gap: "3.5rem"
components:
  button-primary:
    backgroundColor: "{colors.foreground}"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, oklch(0.145 0 0) 88%, oklch(1 0 0))"
    textColor: "{colors.background}"
    rounded: "{rounded.md}"
    height: "2.75rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  nav-link:
    textColor: "oklch(0.556 0 0)"
    height: "2.75rem"
  nav-link-current:
    textColor: "{colors.foreground}"
---

# Design System: DOPPELGÄNGER.md

## Overview

**Creative North Star: "the payload guide"**

The site reads as a technical document, not a landing page. Hairlines, dimension marks, and leader lines. Mono for anything that is data. The home hero is a measured drawing of the voice file, generated from the same `SECTIONS` registry as the Structure table. The mark is a fingerprint ring derived from the example Voice fingerprint. It appears only in the favicon, apple-touch icon, and OG image.

This world replaces shadcn preset `b2YPlg`, action-only green, and DM Sans. No preset. Own oklch tokens. Radius 0. Dark is true black. Light is blueprint on paper.

**Key Characteristics:**

- Dark `.dark` by default on true black. Light `html` is paper. Two states only, stored as `theme` = `dark` or `light` in `localStorage`.
- One reading axis. H1, one sentence, one short why, two buttons, then the structure figure.
- Hairlines and space, not cards.
- Mobile-first at 390px. Horizontal nav from 1280px. The theme switch is visible at both.

## Colors

Black, white, and gray. Tokens live on `html` and `html.dark` in `site/styles.css`. No unused shadcn variable names. Hex next to each token is a check, not a second source.

### Neutral, light (`html`)

- **Ground** (`oklch(1 0 0)`, #ffffff): paper.
- **Ink** (`oklch(0.145 0 0)`, #0a0a0a): text and headings.
- **Ink 2** (`oklch(0.371 0 0)`): labels on the drawing.
- **Ink 3** (`oklch(0.556 0 0)`): body on quiet spots, meta. Contrast on ground is at least 4.5:1.
- **Ink 4** (`oklch(0.708 0 0)`): footnotes, dimension labels.
- **Line** (`oklch(0.145 0 0 / 14%)`): section separators.
- **Line 2** (`oklch(0.145 0 0 / 30%)`): leader lines.
- **Line 3** (`oklch(0.145 0 0 / 45%)`): contour and dimension line.
- **Wash** (`oklch(0.97 0 0)`): `pre` background.
- **Ring** (`oklch(0.145 0 0)`): focus.

### Neutral, dark default (`html.dark`)

- **Ground** (`oklch(0 0 0)`, #000000): true black, not 0.145.
- **Ink** (`oklch(1 0 0)`).
- **Ink 2** (`oklch(0.82 0 0)`).
- **Ink 3** (`oklch(0.64 0 0)`): contrast on ground is at least 4.5:1.
- **Ink 4** (`oklch(0.44 0 0)`).
- **Line** (`oklch(1 0 0 / 14%)`).
- **Line 2** (`oklch(1 0 0 / 22%)`).
- **Line 3** (`oklch(1 0 0 / 30%)`).
- **Wash** (`oklch(0.18 0 0)`).
- **Ring** (`oklch(1 0 0)`).

Primary buttons invert ink and ground. There is no accent color in the interface. The only color in the project is the fingerprint ring gradient in the OG image.

Caret, accent, and selection use `--ink`, not a leftover primary.

## Typography

**Display and body:** Archivo, self-hosted variable (`wdth` and `wght`), latin subset plus `Ä ä · × §`.
**Mono:** JetBrains Mono 400, same subset. Ligatures off.

**Character:** Archivo's width axis gives the heading its technical tone. Stretch 112 on the H1, 106 on H2, 104 on H3, 100 on body.

### Hierarchy

- **Display** (700, stretch 112, `clamp(2.25rem, 9vw, 4.5rem)`, line-height 1, tracking -0.035em): page H1, especially `DOPPELGÄNGER.md`. From 1280 it tightens to `clamp(2.25rem, 6vw, 4rem)`.
- **Headline** (700, stretch 106, 1.5rem, line-height 1.12, tracking -0.025em): section H2.
- **Title** (600, stretch 104, 1.125rem, line-height 1.2, tracking -0.02em): H3.
- **Lede** (400, clamp 1.25–1.5rem, line-height 1.35): the one sentence under the H1.
- **Body** (400, 1.0625rem, 1.6): everything else. Measure 65ch inside a 42rem column.
- **Mono large** (400, 0.875rem, 1.6): brand, nav from 1280, RFC 2119 level, inline code.
- **Mono small** (400, 0.75rem, 1.5, tracking 0.06em): table headers, footer, figure dimension label.

Mono is for filenames, versions, section names on the drawing, table headers, the RFC 2119 level, and code. Nowhere else.

**The Filename-Is-The-Display Rule.** The H1 is the product name. Do not add a kicker above it.

## Layout

Single column. `.page` is `min(42rem, 100% - 2.5rem)`. Direct children except `h1`, `.table-wrap`, and `.figure-structure` cap at `65ch` so the filename and the drawing can run wider than the sentence.

Padding is 3rem 0 5rem at 390, 6rem 0 8rem from 1280.

Header is a 3.5rem solid `--ground` strip with a hairline under it. Brand left in mono 0.875rem, weight 500. Tools right. From 1280 the links sit in mono on `--ink-3`. The current page uses `--ink` and a hairline under the word, not an underline. The tools cluster is a 44px theme toggle and, at 390, a Menu `details` with lucide menu/x. Lucide stroke is 1.5.

Load tools are numbered lists under H2s, stacked. Not a card grid.

The home structure figure is generated by `structureFigure()` from `SECTIONS`. Under 64rem the SVG is hidden and a fallback list with `MUST × n` above it is shown. From 64rem the SVG is shown. Between 64rem and 80rem the role column is hidden.

## Elevation & Depth

Flat. Depth is a 1px hairline and space. The header is opaque `--ground`. No drop shadows. No translucency.

**The Hairline-Or-Space Rule.** Pick a border or a gap. Do not stack both to fake a card.

**The Pointing-Line Rule.** Every line points at something, bounds something, or separates something. If you can remove a line without losing information, remove it.

## Shapes

Radius is 0. Buttons, the toggle, the menu, `pre.file`, and the table wrapper are rectangles. Pills are not used.

## Components

### Buttons

- **Shape:** radius 0, min-height 2.75rem (44px), padding 0 1.25rem.
- **Primary:** `--ink` fill, `--ground` text. Hover mixes 12% of ground into ink. Home uses two primaries: Download example and Copy starter prompt. Success label stays `Copied`.
- **Outline:** transparent fill, hairline `--line-3`, `--ink` text. Hover pulls the border to `--ink`.
- **Focus:** 2px `var(--ring)` offset on every control.

### Cards / Containers

Do not use cards as page structure. FAQ is H3 plus body with a hairline between items. Load is heading plus paragraph plus list.

### Inputs / Fields

None on the marketing pages. No generator, paste box, or upload control.

### Navigation

The wordmark is `DOPPELGÄNGER.md` in mono. Solid bar. Two DOM navs exist so CSS can hide one per breakpoint without JavaScript. `display: none` removes the hidden one from the accessibility tree.

### Theme toggle

A `button.theme-toggle` 44 by 44 with a hairline and no radius. It shows the icon for the theme you would switch to and its `aria-label` says so ("Switch to light theme" in dark). Markup ships `aria-pressed="true"` with the dark default. A head script removes `dark` before first paint when `localStorage.theme` is `light`, then sets the matching `aria-pressed` / `aria-label` on the toggle before paint. Any other stored value keeps the markup default. No extra JS file. No third state.

### Example file

`pre.file` wraps and does not scroll sideways. Monospace ligatures are off so `<!--` stays characters. Background `--wash`, hairline around it, no radius.

### Structure figure

One motion on the whole site: on home load, leader lines draw left to right, band by band, 60ms apart, 240ms each, `cubic-bezier(.2,.8,.2,1)`. Rectangle, type, and dimension line are present immediately. `prefers-reduced-motion: reduce` turns this off.

### Mark

Fingerprint ring from `scripts/mark.mjs`, hashed from `## Voice fingerprint` in `examples/DOPPELGANGER.md`. Favicon is 28 ticks. OG is 216 ticks with the ring gradient. Nowhere else.

## Do's and Don'ts

### Do:

- Do keep the home lede as `One open Markdown file that teaches any AI your voice.`
- Do design 390 first, then 1280.
- Do generate the home figure from `SECTIONS`.
- Do cut a sentence rather than add a section.
- Do keep the theme a two-state machine: the `dark` class on `html`, `theme` in `localStorage` as `dark` or `light`.
- Do honor `prefers-reduced-motion: reduce`.
- Do keep canonical, Open Graph, and sitemap locs on `https://doppelganger.md`. No GitHub Pages URL.

### Don't:

- Don't mention `AGENTS.md` on home or load. FAQ and the spec may.
- Don't restore zinc HSL `240 10%` tokens or `hsl(var(`.
- Don't restore preset `b2YPlg` or `bImeCHq`, DM Sans, or action green.
- Don't add a third theme state or scatter theme booleans outside the `html` class.
- Don't nest cards or add a Why essay.
- Don't put a kicker or eyebrow above the H1.
- Don't put the fingerprint in the header, as a watermark, or behind the hero.
- Don't add a generator, loader, account, or Supervised/Jeroen branding.
- Don't add ratings, reviews, or fake E-E-A-T schema.
