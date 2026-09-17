# Agent notes

This repository is the open DOPPELGANGER.md convention. Voice files only. No hosted loader.

## Verify

```bash
node scripts/site.mjs verify
```

That command must exit 0 before you finish. It builds `docs/` and checks license, spec marker, example sections, required pages, and banned brand strings.

Preview the site with `node scripts/site.mjs preview` and open http://127.0.0.1:4173/. Check home, load, and example in a browser, not only the script.

## Deploy

- Payload: `docs/` after `node scripts/site.mjs` or `node scripts/site.mjs verify`.
- Host: Cloudflare Workers static assets. Worker name `doppelganger-md` in `wrangler.jsonc`. GitHub Pages is not used.
- Build, then deploy: `node scripts/site.mjs` then `npx wrangler deploy` (Node.js 22 or newer).
- Custom domain `doppelganger.md`: attach later in the Cloudflare dashboard (Workers & Pages → this Worker → Settings → Domains & Routes → Add → Custom Domain). Do not add `custom_domain` routes to `wrangler.jsonc` until ops is ready to attach. Apex needs the zone on Cloudflare nameservers at the registrar. Copy nameservers from the Cloudflare zone. Do not invent them here. Optional `www` is a second hostname or a www-to-apex redirect.
- Keep canonicals, sitemap, robots, and llms on `https://doppelganger.md`. Never retarget them to github.io.
- Until DNS is live, preview on :4173 with `node scripts/site.mjs preview`.
- Do not enable GitHub Pages. Do not commit `docs/CNAME`.

## House rules

- English only on the spec, the example, and the site.
- Do not add Supervised, Jeroen, or company branding to `docs/` or `site/`.
- Do not add auth, accounts, a generator UI, or an upload API.
- Do not merge to `main` unless a human says GO.
