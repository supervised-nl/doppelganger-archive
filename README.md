# DOPPELGANGER.md

One open Markdown file that teaches any AI your voice.

Paste it, attach it, or `@DOPPELGANGER.md`. No account. No hosted loader.

## Start here

- [Specification](SPEC.md) (`doppelganger-spec: 0.1`)
- [Example voice file](examples/DOPPELGANGER.md) (fictional person)
- Site pages in `docs/` after `node scripts/site.mjs` (Home, Structure, Load, Example, FAQ, Spec)
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

The command builds `docs/` and checks the ship set: CC0, spec marker, example sections, required pages, English `lang`, the home lede, no `AGENTS.md` on the home or load page, and no Supervised or personal-name branding on the site.

## Deploy (when DNS is ready)

Site payload is `docs/` (built by `node scripts/site.mjs`).

1. In the GitHub repo: Settings → Pages → Deploy from a branch → folder `/docs` (or the equivalent Pages “docs folder” source).
2. When `doppelganger.md` DNS is live, add `docs/CNAME` with a single line: `doppelganger.md`
3. Point DNS (A/AAAA or CNAME per GitHub Pages docs) at GitHub Pages.
4. Leave canonicals, `robots.txt`, `sitemap.xml`, and `llms.txt` on `https://doppelganger.md` (already generated that way). Do not rewrite them to a `github.io` host.

Until DNS is ready: `node scripts/site.mjs preview` → http://127.0.0.1:4173/. Pages may stay off. Do not enable Pages or commit `docs/CNAME` until a human says GO for DNS.
