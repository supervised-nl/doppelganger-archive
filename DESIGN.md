---
name: DOPPELGÄNGER.md
description: One open Markdown file that teaches any AI your voice.
colors:
  ground: "oklch(1 0 0)"
  ink: "oklch(0.145 0 0)"
  ink-2: "oklch(0.371 0 0)"
  ink-3: "oklch(0.45 0 0)"
  ink-4: "oklch(0.556 0 0)"
  line: "oklch(0.145 0 0 / 14%)"
  line-2: "oklch(0.145 0 0 / 30%)"
  line-3: "oklch(0.145 0 0 / 45%)"
  wash: "oklch(0.97 0 0)"
  ring: "oklch(0.145 0 0)"
  ground-dark: "oklch(0 0 0)"
  ink-dark: "oklch(1 0 0)"
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
    backgroundColor: "{colors.ink}"
    textColor: "{colors.ground}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, oklch(0.145 0 0) 88%, oklch(1 0 0))"
    textColor: "{colors.ground}"
    rounded: "{rounded.md}"
    height: "2.75rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  nav-link:
    textColor: "{colors.ink-3}"
    height: "2.75rem"
  nav-link-current:
    textColor: "{colors.ink}"
---

# Design System: DOPPELGÄNGER.md

## Overview

**Creative North Star: "The payload guide"**

The site reads as a technical document, not a landing page. Hairlines, dimension lines, and leader lines. Mono for data. The hero on home is a measured drawing of the voice file, generated from the same `SECTIONS` registry as the Structure table.

The mark is a fingerprint ring derived from the example Voice fingerprint. It appears only on the favicon, the apple-touch icon, and the Open Graph image.

This world replaces shadcn preset `b2YPlg` (green, DM Sans, translucent header). No accent color in the interface. Dark ground is true black.

**Key Characteristics:**

- Dark `.dark` by default, light via the header switch. Two states only, stored as `theme` = `dark` or `light` in `localStorage`.
- One reading axis. H1, one sentence, one short why, two buttons, then the drawing.
- Spacing, not cards. Radius 0.
- Mobile-first at 390px. The structure drawing stays visible at every width. Horizontal nav from 1280px.

## Colors

Black, white, and gray. Source of truth is `site/styles.css`. Tokens are oklch. No unused shadcn variable names.

### Neutral, light (`html`)

- **Ground** (`oklch(1 0 0)`): paper.
- **Ink** (`oklch(0.145 0 0)`): body, headings, primary buttons.
- **Ink-2** (`oklch(0.371 0 0)`): secondary table text and wide-figure names.
- **Ink-3** (`oklch(0.45 0 0)`): quiet body, idle nav, dimension label. At least 4.5:1 on ground.
- **Ink-4** (`oklch(0.556 0 0)`): footer, table headers, figure roles.
- **Line / line-2 / line-3**: 14%, 30%, 45% ink for rules, leaders, and contours.
- **Wash** (`oklch(0.97 0 0)`): `pre` background.

### Neutral, dark (`html.dark`)

- **Ground** (`oklch(0 0 0)`): true black, not 0.145.
- **Ink** (`oklch(1 0 0)`): body, headings, primary buttons.
- **Ink-2** (`oklch(0.82 0 0)`), **Ink-3** (`oklch(0.72 0 0)`), **Ink-4** (`oklch(0.64 0 0)`).
- **Line** tokens invert to white at 14%, 22%, 30%.
- **Wash** (`oklch(0.18 0 0)`).

**The No-Accent Rule.** The interface has no accent color. Primary buttons invert ink and ground. The only color in the project is the fingerprint gradient on the favicon and OG image.

## Typography

**Display and body:** Archivo, self-hosted, variable `wdth` and `wght`.
**Data and chrome:** JetBrains Mono, self-hosted, weight 400.

Archivo width is the technical tone: display at `wdth` 112, headlines at 106, titles at 104, body at 100.

### Hierarchy

- **Display** (700, `clamp(2.25rem, 9vw, 4.5rem)`, line-height 1, tracking -0.035em, `wdth` 112): page H1. From 1280, `clamp(2.25rem, 5vw, 3.7rem)` so `DOPPELGÄNGER.md` stays inside the 42rem column at stretch 112%.
- **Headline** (700, 1.5rem, line-height 1.12): section H2.
- **Title** (600, 1.125rem, line-height 1.2): H3 and FAQ questions.
- **Lede** (400, clamp 1.25–1.5rem, line-height 1.35): the one sentence under the H1.
- **Body** (400, 1.0625rem, 1.6): everything else. Measure 65ch inside a 42rem column.
- **Label** (JetBrains Mono, 0.75rem, tracking 0.06em): footer, table headers, RFC 2119 levels, figure roles. Impeccable `wide-tracking` on these labels is expected. Keep 0.06em. Do not tighten tracking to silence the detector.
- **Code** (JetBrains Mono, 0.875rem): filenames, versions, inline code, `pre.file`. Ligatures off.

**The Filename-Is-The-Display Rule.** The H1 is the product name. Do not add a kicker above it.

Mono is for data: filenames, versions, section names on the drawing, table headers, RFC 2119 levels, and code. Nowhere else.

## Layout

Single column. `.page` is `min(42rem, 100% - 2.5rem)`. Direct children except `h1`, `.table-wrap`, and `.figure-structure` cap at `65ch`.

Padding is 3rem 0 5rem at 390, 6rem 0 8rem from 1280.

Header is a 3.5rem solid `--ground` strip with a hairline underneath. Brand left in mono 0.875rem, weight at most 500. Tools right. From 1280, muted mono links sit in a row ahead of the toggle. The current page uses ink and a hairline under the link.

The home drawing is two SVGs from `SECTIONS`: compact `viewBox="0 0 480 380"` with names in the bands below 80rem, wide `viewBox="0 0 1200 380"` with leaders and roles from 80rem. A fallback `ol` stays visually hidden. Never hide every SVG under 64rem.

## Elevation & Depth

Flat. Depth is a 1px hairline and space. The header is opaque `--ground`. No drop shadows. No blur.

**The Hairline-Or-Space Rule.** Pick a border or a gap. Do not stack both to fake a card.

**The Every-Line-Means-Something Rule.** A line points, bounds, or separates. If you can delete it without losing information, delete it.

## Shapes

Radius is 0. Buttons, the toggle, the menu, `pre.file`, and the table wrapper are rectangles.

## Components

### Buttons

- **Shape:** square corners, min-height 2.75rem (44px).
- **Primary:** `--ink` fill, `--ground` text. Hover mixes 12% ground into ink. Home uses two primaries: Download example and Copy starter prompt.
- **Outline:** transparent fill, `--line-3` hairline, `--ink` text. Hover draws the edge to `--ink`.
- **Focus:** 2px `var(--ring)` offset on every control.
- **Copy starter prompt** becomes **Copied** on success. Do not change those strings.

### Cards / Containers

Do not use cards as page structure. FAQ is heading plus body plus a hairline between items. Load is heading plus list.

### Structure figure

Generated by `structureFigure()` in `scripts/site.mjs` from MUST rows in `SECTIONS`. Compact labels sit in the bands so "Voice fingerprint" stays inside the column at 390. Wide labels sit to the right of the file rectangle, with roles from x=770. Leader lines draw once on load, 60ms apart, 240ms each, unless `prefers-reduced-motion: reduce`.

### Navigation

The wordmark is `DOPPELGÄNGER.md` in mono. Idle links use `--ink-3`. Two DOM navs exist so CSS can hide one per breakpoint without JavaScript.

### Theme toggle

A `button.theme-toggle`, 44px square, hairline, radius 0. Lucide sun and moon at `stroke-width` 1.5. Markup ships `aria-pressed="true"` with the dark default. A head script removes `dark` before first paint when `localStorage.theme` is `light`. No extra JS file. No third state.

### Example file

`pre.file` wraps and does not scroll sideways. Monospace ligatures are off so `<!--` stays characters. Background `--wash`, hairline, no radius.

## Do's and Don'ts

### Do:

- Do keep the home lede as `One open Markdown file that teaches any AI your voice.`
- Do design 390 first, then 1280.
- Do keep the structure SVG visible at every width.
- Do cut a sentence rather than add a section.
- Do keep the theme a two-state machine: the `dark` class on `html`, `theme` in `localStorage` as `dark` or `light`.
- Do honor `prefers-reduced-motion: reduce`.
- Do keep canonical, Open Graph, and sitemap locs on `https://doppelganger.md`. No GitHub Pages URL.

### Don't:

- Don't mention `AGENTS.md` on home or load. FAQ and the spec may.
- Don't restore zinc HSL `240 10%` tokens, `hsl(var(`, DM Sans, or preset `b2YPlg`.
- Don't add a third theme state or scatter theme booleans outside the `html` class.
- Don't nest cards or add a Why essay.
- Don't put a kicker or eyebrow above the H1.
- Don't add a generator, loader, account, or Supervised/Jeroen branding.
- Don't put the fingerprint anywhere except favicon, apple-touch, and OG.
- Don't add ratings, reviews, or fake E-E-A-T schema.
- Don't hide the structure SVG with `display: none` under 64rem as the only mobile UI.
