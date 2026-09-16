# Agent notes

This repository is the open DOPPELGANGER.md convention. Voice files only. No hosted loader.

## Verify

```bash
node scripts/site.mjs verify
```

That command must exit 0 before you finish. It builds `docs/` and checks license, spec marker, example sections, required pages, and banned brand strings.

Preview the site with `node scripts/site.mjs preview` and open http://127.0.0.1:4173/. Check home, load, and example in a browser, not only the script.

## House rules

- English only on the spec, the example, and the site.
- Do not add Supervised, Jeroen, or company branding to `docs/` or `site/`.
- Do not add auth, accounts, a generator UI, or an upload API.
- Do not merge to `main` unless a human says GO.
