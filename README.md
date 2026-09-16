# DOPPELGANGER.md

DOPPELGANGER.md is the AGENTS.md of a person or company. It is one open Markdown file that teaches any AI to write in your voice, not generic AI slop.

Paste it, attach it, or `@DOPPELGANGER.md`. There is no hosted loader and no account.

## Start here

- [Specification](SPEC.md) (`doppelganger-spec: 0.1`)
- [Example voice file](examples/DOPPELGANGER.md) (fictional person)
- Site pages in `docs/` after `node scripts/site.mjs` (What, Structure, Load, Example, FAQ)
- Canonical name: [doppelganger.md](https://doppelganger.md) (DNS may come later)
- Local preview: `node scripts/site.mjs preview` then open http://127.0.0.1:4173/
- License: [CC0 1.0](LICENSE)

## What belongs in the file

MUST: Meta, Identity, Voice fingerprint (3 to 7 samples), Tone rules, Hard bans, Safety.

SHOULD: Register shifts, Before and after, Facts and claims.

MAY: A short How to use pointer. The full load guide lives on the site.

Voice only. Not coding instructions, not a visual brand kit, not secrets.

## Verify

```bash
node scripts/site.mjs verify
```

The command builds `docs/` and checks the ship set: CC0, spec marker, example sections, required pages, English `lang`, and no Supervised or personal-name branding on the site.
