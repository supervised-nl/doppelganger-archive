# DOPPELGANGER.md

One open Markdown file that teaches any AI your voice.

Paste it, attach it, or `@DOPPELGANGER.md`. No account. No hosted loader.

## Start here

- [Specification](SPEC.md) (`doppelganger-spec: 0.1`)
- [Example voice file](examples/DOPPELGANGER.md) (fictional person)
- Home Instant Start: **Download example** and **Copy starter prompt**. No account. No hosted loader.
- Site pages in `docs/` after `node scripts/site.mjs` (Home, Structure, Load, Example, FAQ, Spec)
- Canonical site: [https://doppelganger.md](https://doppelganger.md) (DNS may come later)
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

## Deploy

The site payload is `docs/` after `node scripts/site.mjs`. `node scripts/site.mjs verify` builds `docs/` too.

Host it with Cloudflare Workers static assets. The Worker name is `doppelganger-md` in `wrangler.jsonc`. GitHub Pages is not used.

1. Run `node scripts/site.mjs` to build `docs/`.
2. Run `npx wrangler deploy` (Node.js 22 or newer).

To attach `doppelganger.md` later, use the Cloudflare dashboard. Open Workers & Pages, then this Worker, then Settings, Domains & Routes, Add, Custom Domain. Do not add `custom_domain` routes to `wrangler.jsonc` until ops is ready to attach. An apex custom domain needs the zone on Cloudflare nameservers at the registrar. Copy those nameservers from the Cloudflare zone. Do not invent them here.

If you also serve `www`, attach `www.doppelganger.md` or add a www-to-apex redirect. Custom Domains match one hostname.

Leave canonicals, `robots.txt`, `sitemap.xml`, and `llms.txt` on `https://doppelganger.md`. Do not rewrite them to a `github.io` host.

Until DNS is live, preview locally with `node scripts/site.mjs preview` and open http://127.0.0.1:4173/.

Do not enable GitHub Pages. Do not commit `docs/CNAME`.
