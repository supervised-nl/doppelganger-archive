# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

delegated: static HTML and CSS built by `scripts/site.mjs` into `docs/`. Inferred from the existing V1 repo. No framework. Preview is `node scripts/site.mjs preview` on port 4173.

## Users

People who write in public and want any chat model to sound like them instead of generic AI copy. They already use ChatGPT, Claude, Gemini, Cursor, or paste-into-a-new-chat. They will not create an account.

Coding-agent authors are a secondary audience. They keep a voice file next to repo instructions.

## Product Purpose

Ship an open convention: one English Markdown file named `DOPPELGANGER.md` that teaches any AI a person's or company's writing voice.

Success is a first-time visitor who, in seconds, knows what the file is and how to load it. They do not need a generator, a loader, or a signup.

## Positioning

One portable Markdown file. Paste it, attach it, or `@DOPPELGANGER.md`. Any model that can read a file can use it. There is no hosted service.

Inferred from the 2026-09-16 redesign brief. Home copy must never compare the file to `AGENTS.md`. That comparison lives in the FAQ only, if at all.

## Operating Context

Writers keep `DOPPELGANGER.md` on disk or in a repo. They load it in the tools they already use. The spec (`doppelganger-spec: 0.1`) is the source of truth. The site is a landing plus load guide plus one fictional example. Canonical host is `https://doppelganger.md`. DNS may come later. Until then, `docs/` is the Cloudflare Workers static-assets payload.

## Capabilities and Constraints

- Filename is `DOPPELGANGER.md`. Spec 0.1 is English only.
- MUST sections: Meta, Identity, Voice fingerprint (3 to 7 samples), Tone rules, Hard bans, Safety.
- No hosted generator, loader, auth, or upload API.
- License of the spec, example, and site is CC0 1.0. A person's own voice file may use another license.
- Site and docs must not mention Supervised or Jeroen.
- Keep the fictional Mara Ellison example.
- Site pages: home, structure, load, example, FAQ, spec.
- Visual system is shadcn preset `b2YPlg` (nova, green on neutral, DM Sans, lucide, default radius, subtle translucent menu). Not zinc.
- Mobile-first: 390px, then 1280px.

## Brand Commitments

- File name: DOPPELGANGER.md. Host: doppelganger.md.
- Voice: short, plain English. Cut copy to the bone. No essays. Home carries one short why paragraph under the lede, not a Why section.
- Home lead: one open Markdown file that teaches any AI your voice. Never `AGENTS.md` on the home lead.
- Theme: dark by default from the preset's `.dark` block. A header switch to light persists as `theme` in `localStorage`.
- Instant start: Download example (the Mara file) and Copy starter prompt. No npx.
- Inspiration for rhythm, not assets: agents.md, impeccable.style, terafab.ai. Sparse, huge type, almost no prose.
- No company branding on the site.

## Evidence on Hand

- `SPEC.md` is the 0.1 specification.
- `examples/DOPPELGANGER.md` is a fictional Mara Ellison voice file. Not a biography.
- `LICENSE` is CC0 1.0.
- No customer quotes, press, or usage metrics exist. Do not invent them.

## Product Principles

1. The file is the product. The site explains how to use the file.
2. Portable beats hosted. Paste, attach, or `@`.
3. Voice only. Not coding instructions, not a visual brand kit, not secrets.
4. Seconds to understand. Almost no prose on the landing.
5. Spec stays complete. Marketing pages stay brief.

## Accessibility & Inclusion

WCAG-minded static pages. English `lang`. Skip link. Visible focus. Touch targets at 390px. Body text contrast at least 4.5:1. Inferred from the existing verify suite and the mobile-first brief.
