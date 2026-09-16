---
name: doppelganger.md
description: One open Markdown file that teaches any AI your voice.
colors:
  background: "oklch(1 0 0)"
  foreground: "oklch(0.145 0 0)"
  primary: "oklch(0.508 0.118 165.612)"
  primary-foreground: "oklch(0.979 0.021 166.113)"
  muted: "oklch(0.97 0 0)"
  muted-foreground: "oklch(0.556 0 0)"
  accent: "oklch(0.97 0 0)"
  accent-foreground: "oklch(0.205 0 0)"
  border: "oklch(0.922 0 0)"
  ring: "oklch(0.708 0 0)"
  secondary: "oklch(0.967 0.001 286.375)"
  secondary-foreground: "oklch(0.21 0.006 285.885)"
typography:
  display:
    fontFamily: "DM Sans, DM Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 9vw, 5rem)"
    fontWeight: 550
    lineHeight: 1
    letterSpacing: "-0.035em"
  headline:
    fontFamily: "DM Sans, DM Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  lede:
    fontFamily: "DM Sans, DM Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(1.25rem, 0.75rem + 1.5vw, 1.5rem)"
    fontWeight: 400
    lineHeight: 1.35
    letterSpacing: "-0.01em"
  body:
    fontFamily: "DM Sans, DM Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
  title:
    fontFamily: "DM Sans, DM Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 550
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  label:
    fontFamily: "DM Sans, DM Sans Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.9375rem"
    fontWeight: 500
    lineHeight: 1.4
  code:
    fontFamily: "ui-monospace, SF Mono, Menlo, Consolas, Liberation Mono, monospace"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.55
rounded:
  sm: "4px"
  md: "0.625rem"
spacing:
  tap: "2.75rem"
  page-inline: "1.25rem"
  page-block: "3rem"
  desktop-page-block: "6rem"
  heading-gap: "3.5rem"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  button-primary-hover:
    backgroundColor: "color-mix(in oklch, oklch(0.508 0.118 165.612) 88%, black)"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.md}"
    height: "2.75rem"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.foreground}"
    rounded: "{rounded.md}"
    padding: "0 1.25rem"
    height: "2.75rem"
  nav-link:
    textColor: "{colors.muted-foreground}"
    height: "2.75rem"
  nav-link-current:
    textColor: "{colors.foreground}"
---

# Design System: doppelganger.md

## Overview

**Creative North Star: "The catalog call slip"**

The site is a slip that names one file and tells you how to load it. Huge type, short lines, almost no prose. Materials are shadcn preset `bImeCHq` (vega, emerald on neutral, DM Sans, lucide, default radius, subtle translucent menu). Dark is the default: `<html class="dark">` selects the preset's `.dark` block, so a visit with no JavaScript is still dark. The light `:root` block is one switch away in the header. Emerald is only for the action you can press, in either theme.

This world replaces the rejected zinc dark docs wiki. No sticky glass, no nested cards, no Why essays, no AGENTS.md on home or load.

**Key Characteristics:**

- Dark `.dark` by default, light `:root` via the header switch. Two states only, stored as `theme` = `dark` or `light` in `localStorage`.
- One reading axis. H1, one sentence, one short why, two buttons.
- Spacing, not cards.
- Mobile-first at 390px. Horizontal nav from 1280px. The theme switch is visible at both.

## Colors

Restrained neutrals plus one emerald accent. Source of truth is `site/preset-bImeCHq.css`, copied into `site/styles.css`. Every component reads the same token names; the theme picks the block.

### Primary

- **Emerald action** (`oklch(0.508 0.118 165.612)` light, `oklch(0.432 0.095 166.913)` dark): primary buttons only. Not headings, not rules, not decorative bars.

### Neutral, dark default (`.dark`)

- **Ground** (`oklch(0.145 0 0)`): page ground.
- **Chalk** (`oklch(0.985 0 0)`): body and headings.
- **Quiet chalk** (`oklch(0.708 0 0)`): footer, meta, idle nav.
- **Hairline** (`oklch(1 0 0 / 10%)`): header rule, table rows, outline buttons, the toggle and Menu chrome.
- **Wash** (`oklch(0.269 0 0)`): code chips, pre backgrounds, hover on the toggle and Menu.

### Neutral, light (`:root`, via the switch)

- **Paper** (`oklch(1 0 0)`): page ground.
- **Ink** (`oklch(0.145 0 0)`): body and headings.
- **Quiet ink** (`oklch(0.556 0 0)`): footer, meta, idle nav.
- **Hairline** (`oklch(0.922 0 0)`): header rule, table rows, outline buttons.
- **Wash** (`oklch(0.97 0 0)`): code chips and pre backgrounds.

**The Action-Only Emerald Rule.** If it is not pressable, it is not emerald.

## Typography

**Display Font:** DM Sans (Google Fonts, optical size 9..40, weight 100..1000)
**Body Font:** DM Sans, same family
**Label/Mono Font:** ui-monospace / SF Mono / Menlo / Consolas, ligatures off

**Character:** A workhorse sans at display scale. Weight 550, tracking down to -0.035em on the H1. No second display face.

### Hierarchy

- **Display** (550, `clamp(2.25rem, 9vw, 5rem)`, line-height 1): page H1, especially `DOPPELGANGER.md`. From 1280 it tightens to `clamp(2.25rem, 6vw, 4.25rem)` so the filename measure stays short.
- **Headline** (550, 1.5rem): section H2.
- **Title** (550, 1.125rem): H3 and the open mobile menu links.
- **Lede** (400, clamp 1.25–1.5rem): the one sentence under the H1.
- **Body** (400, 1.0625rem, 1.6): everything else. Measure 65ch inside a 42rem column.
- **Label** (500, 0.9375rem): footer and `.meta`.
- **Code** (400, 0.875rem, ui-monospace including SF Mono): the example file and inline code. Ligatures off.

**The Filename-Is-The-Display Rule.** The H1 is the product name. Do not add a kicker above it.

## Layout

Single column. `.page` is `min(42rem, 100% - 2.5rem)`. Direct children except `h1` and `.table-wrap` cap at `65ch` so the filename can run wider than the sentence.

Padding is 3rem 0 5rem at 390, 6rem 0 8rem from 1280.

Header is a 3.5rem translucent strip. Brand left, tools right. The tools cluster is a 44px theme toggle (lucide sun in dark, moon in light) and, at 390, a 44px Menu `details` with lucide menu/x on the same row. From 1280 the Menu hides and muted text links sit in a row ahead of the toggle.

Load tools are numbered lists under H2s, stacked. Not a card grid.

## Elevation & Depth

Flat. Depth is a 1px border and space. The header uses `color-mix(in oklch, var(--background) 86%, transparent)` with no blur. No drop shadows.

**The Hairline-Or-Space Rule.** Pick a border or a gap. Do not stack both to fake a card.

## Shapes

Radius is the preset default, 0.625rem. Buttons and the Menu summary use it. Tables and the example `pre.file` use it on the pre, not on nested shells. Pills are not used.

## Components

### Buttons

- **Shape:** 0.625rem, min-height 2.75rem (44px).
- **Primary:** emerald fill, light emerald-tinted text. Hover mixes 12% black into primary.
- **Outline:** transparent fill, hairline border, ink text. Hover uses the muted wash.
- **Focus:** 2px `var(--ring)` offset on every control.

### Cards / Containers

Do not use cards as page structure. FAQ and Load are heading plus paragraph plus list.

### Inputs / Fields

None on the marketing pages. If one appears, use `--input` and `--ring` from the preset.

### Navigation

Wordmark left. Subtle translucent bar. Idle links use quiet ink. Current page uses ink and, from 1280, an underline. Two DOM navs exist so CSS can hide one per breakpoint without JavaScript. `display: none` removes the hidden one from the accessibility tree.

### Theme toggle

A `button.theme-toggle` with the Menu chrome: hairline border, 0.625rem radius, 44px square. It shows the icon for the theme you would switch to and its `aria-label` says so ("Switch to light theme" in dark). Markup ships `aria-pressed="true"` with the dark default. A head script removes `dark` before first paint when `localStorage.theme` is `light`, then sets the matching `aria-pressed` / `aria-label` on the toggle before paint. Any other stored value keeps the markup default. No extra JS file.

### Example file

`pre.file` wraps and does not scroll sideways. Monospace ligatures are off so `<!--` stays characters.

## Do's and Don'ts

### Do:

- Do keep the home lede as `One open Markdown file that teaches any AI your voice.`
- Do design 390 first, then 1280.
- Do keep emerald on the primary action only.
- Do cut a sentence rather than add a section.
- Do keep the theme a two-state machine: the `dark` class on `html`, `theme` in `localStorage` as `dark` or `light`.
- Do honor `prefers-reduced-motion: reduce`.
- Do keep canonical, Open Graph, and sitemap locs on `https://doppelganger.md`. No GitHub Pages URL.

### Don't:

- Don't mention `AGENTS.md` on home or load. FAQ and the spec may.
- Don't restore zinc HSL `240 10%` tokens or `hsl(var(`.
- Don't add a third theme state or scatter theme booleans outside the `html` class.
- Don't nest cards or add a Why essay.
- Don't put a kicker or eyebrow above the H1.
- Don't add a generator, loader, account, or Supervised/Jeroen branding.
- Don't add ratings, reviews, or fake E-E-A-T schema.
