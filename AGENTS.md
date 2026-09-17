# Agent notes

This repository is the open DOPPELGANGER.md convention. Voice files only. No hosted loader.

## Verify

```bash
node scripts/site.mjs verify
```

That command must exit 0 before you finish. It builds `docs/` and checks license, spec marker, example sections, required pages, and banned brand strings.

Preview the site with `node scripts/site.mjs preview` and open http://127.0.0.1:4173/. Check home, load, and example in a browser, not only the script.

## Deploy (Pages + CNAME)

- Payload: `docs/` after `node scripts/site.mjs` or `node scripts/site.mjs verify`.
- Pages source: Settings → Pages → deploy from a branch → `/docs` folder, when a human enables Pages.
- When DNS for doppelganger.md is ready: create `docs/CNAME` with a single line `doppelganger.md`. Point DNS per GitHub Pages docs.
- Keep canonicals, sitemap, robots, and llms on `https://doppelganger.md`. Never retarget them to github.io.
- Do not enable Pages or add CNAME unless a human says GO for DNS. Until then, preview on :4173.

## House rules

- English only on the spec, the example, and the site.
- Do not add Supervised, Jeroen, or company branding to `docs/` or `site/`.
- Do not add auth, accounts, a generator UI, or an upload API.
- Do not merge to `main` unless a human says GO.
