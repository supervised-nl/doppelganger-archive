#!/usr/bin/env node
import fs from 'node:fs'
import http from 'node:http'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const SECTIONS = [
  {
    level: 'MUST',
    title: 'Meta',
    role: 'name, kind (person or organization), language, version, updated, license',
  },
  {
    level: 'MUST',
    title: 'Identity',
    role: 'Who is speaking, and what they do not do',
  },
  {
    level: 'MUST',
    title: 'Voice fingerprint',
    role: '3 to 7 writing samples',
  },
  {
    level: 'MUST',
    title: 'Tone rules',
    role: 'Concrete instructions, not adjectives',
  },
  {
    level: 'MUST',
    title: 'Hard bans',
    role: 'Words, phrases, and moves the model must not use',
  },
  {
    level: 'MUST',
    title: 'Safety',
    role: 'No secrets. No invented facts, metrics, or clients',
  },
  {
    level: 'SHOULD',
    title: 'Register shifts',
    role: 'How email, social, website, and proposal differ',
  },
  {
    level: 'SHOULD',
    title: 'Before and after',
    role: 'Generic AI copy rewritten in this voice',
  },
  {
    level: 'SHOULD',
    title: 'Facts and claims',
    role: 'Facts the model may treat as true',
  },
  {
    level: 'MAY',
    title: 'How to use',
    role: 'Short pointer to the load guide',
  },
]

const SITE_ORIGIN = 'https://doppelganger.md'
const DISPLAY_NAME = 'DOPPELGANGER.md'
const OG_IMAGE = `${SITE_ORIGIN}/og.png`

const PAGES = [
  {
    id: 'index',
    href: 'index.html',
    title: 'Home',
    nav: 'Home',
    description: 'One open Markdown file that teaches any AI your voice.',
  },
  {
    id: 'structure',
    href: 'structure.html',
    title: 'Structure',
    nav: 'Structure',
    description: 'MUST, SHOULD, and MAY sections of a DOPPELGANGER.md voice file.',
  },
  {
    id: 'load',
    href: 'load.html',
    title: 'How to load',
    nav: 'Load',
    description: 'Paste, attach, or @ a DOPPELGANGER.md in ChatGPT, Claude, Gemini, or Cursor.',
  },
  {
    id: 'example',
    href: 'example.html',
    title: 'Example',
    nav: 'Example',
    description: 'A fictional Mara Ellison DOPPELGANGER.md. Format sample, not a biography.',
  },
  {
    id: 'faq',
    href: 'faq.html',
    title: 'FAQ',
    nav: 'FAQ',
    description: 'Short answers on AGENTS.md, BRAND.md, license, secrets, and why there is no loader.',
  },
  {
    id: 'spec',
    href: 'spec.html',
    title: 'Specification',
    nav: 'Spec',
    description: 'Spec 0.1 for DOPPELGANGER.md: English Markdown that teaches an AI your writing voice.',
  },
]

const BANNED_BRAND = [/supervised/i, /jeroen/i]
const SPEC_MARKER = 'doppelganger-spec: 0.1'
const STARTER_PROMPT =
  'Attach or paste DOPPELGANGER.md, then write as that voice. Follow Hard bans and Safety. Do not invent facts.'

const REQUIRED_TEXT = {
  'docs/index.html': {
    has: [
      '<p class="lede">One open Markdown file that teaches any AI your voice.</p>',
      '<h2>How to load</h2>',
      '<h2>For agents</h2>',
      'Download example',
      'download="DOPPELGANGER.md"',
      'Copy starter prompt',
      STARTER_PROMPT,
      'aria-live',
      '<html lang="en" class="dark">',
      '<meta name="color-scheme" content="dark light">',
      'localStorage',
      'theme-toggle',
      'aria-pressed',
    ],
    lacks: ['AGENTS.md', 'npx'],
  },
  'docs/load.html': {
    has: ['ChatGPT', 'Sources', 'Add files', 'Claude', 'Gemini', 'Cursor', 'Paste', '1,500', '5,000'],
    lacks: ['AGENTS.md'],
  },
  'docs/example.html': { has: ['Mara Ellison'] },
  'docs/structure.html': { has: ['Voice fingerprint', 'How do I make the file accurate?'] },
  'docs/faq.html': {
    has: ['AGENTS.md', 'BRAND.md', 'hosted loader', 'How do I make the file accurate?', 'does not expire'],
  },
  'docs/spec.html': {
    has: ['&lt;!-- doppelganger-spec: 0.1 --&gt;', 'The file does not expire.', 'calendar quota'],
  },
  'docs/styles.css': {
    has: [
      'html {\n  color-scheme: light;',
      'html.dark {\n  color-scheme: dark;\n}',
      '--primary: oklch(0.508 0.118 165.612)',
      '--primary: oklch(0.432 0.095 166.913)',
      '--font-sans: "DM Sans",',
    ],
    lacks: ['240 10%', 'hsl(var('],
  },
}

const PORT = 4173

function read(rel) {
  return fs.readFileSync(path.join(root, rel), 'utf8')
}

function write(rel, text) {
  const abs = path.join(root, rel)
  fs.mkdirSync(path.dirname(abs), { recursive: true })
  fs.writeFileSync(abs, text)
}

function copyFile(fromRel, toRel) {
  const toAbs = path.join(root, toRel)
  fs.mkdirSync(path.dirname(toAbs), { recursive: true })
  fs.copyFileSync(path.join(root, fromRel), toAbs)
}

function escapeHtml(text) {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function inlineMarkdown(text) {
  let out = escapeHtml(text)
  out = out.replace(/`([^`]+)`/g, '<code>$1</code>')
  out = out.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
  out = out.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  return out
}

function renderMarkdown(src) {
  const body = src.replace(/^\s*<!--[\s\S]*?-->\s*/, '').trim()
  const lines = body.split('\n')
  const html = []
  let i = 0

  const flushPara = (chunk) => {
    const text = chunk.join(' ').trim()
    if (text) html.push(`<p>${inlineMarkdown(text)}</p>`)
  }

  while (i < lines.length) {
    const line = lines[i]
    if (line.trim() === '') {
      i += 1
      continue
    }
    if (line.startsWith('```')) {
      const fence = []
      i += 1
      while (i < lines.length && !lines[i].startsWith('```')) {
        fence.push(lines[i])
        i += 1
      }
      i += 1
      html.push(`<pre><code>${escapeHtml(fence.join('\n'))}\n</code></pre>`)
      continue
    }
    const heading = line.match(/^(#{1,6})\s+(.*)$/)
    if (heading) {
      const level = heading[1].length
      html.push(
        `<h${level} id="${slug(heading[2])}">${inlineMarkdown(heading[2])}</h${level}>`,
      )
      i += 1
      continue
    }
    if (line.includes('|') && lines[i + 1] && /^\s*\|?\s*:?-{3,}/.test(lines[i + 1])) {
      const rows = []
      while (i < lines.length && lines[i].includes('|')) {
        rows.push(lines[i])
        i += 1
      }
      const parseRow = (row) =>
        row
          .replace(/^\||\|$/g, '')
          .split('|')
          .map((cell) => cell.trim())
      const header = parseRow(rows[0])
      const bodyRows = rows.slice(2).map(parseRow)
      html.push('<table>')
      html.push(
        '<thead><tr>' +
          header.map((cell) => `<th scope="col">${inlineMarkdown(cell)}</th>`).join('') +
          '</tr></thead>',
      )
      html.push('<tbody>')
      for (const row of bodyRows) {
        html.push(
          '<tr>' + row.map((cell) => `<td>${inlineMarkdown(cell)}</td>`).join('') + '</tr>',
        )
      }
      html.push('</tbody></table>')
      continue
    }
    if (/^\s*[-*]\s+/.test(line)) {
      html.push('<ul>')
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        html.push(`<li>${inlineMarkdown(lines[i].replace(/^\s*[-*]\s+/, ''))}</li>`)
        i += 1
      }
      html.push('</ul>')
      continue
    }
    if (/^\s*\d+\.\s+/.test(line)) {
      html.push('<ol>')
      while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
        html.push(`<li>${inlineMarkdown(lines[i].replace(/^\s*\d+\.\s+/, ''))}</li>`)
        i += 1
      }
      html.push('</ol>')
      continue
    }
    const para = [line]
    i += 1
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !/^\s*[-*]\s+/.test(lines[i]) &&
      !/^\s*\d+\.\s+/.test(lines[i])
    ) {
      para.push(lines[i])
      i += 1
    }
    flushPara(para)
  }
  return html.join('\n')
}

function sectionsTable() {
  const rows = SECTIONS.map(
    (section) =>
      `<tr><td>${escapeHtml(section.level)}</td><td>${escapeHtml(section.title)}</td><td>${escapeHtml(section.role)}</td></tr>`,
  ).join('')
  return `<table>
<thead><tr><th scope="col">Level</th><th scope="col">Section</th><th scope="col">In the file</th></tr></thead>
<tbody>${rows}</tbody>
</table>`
}

function slug(text) {
  return text
    .toLowerCase()
    .replace(/`/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function navHtml(current) {
  const items = PAGES.map((page) => {
    const currentAttr = page.id === current ? ' aria-current="page"' : ''
    return `<li><a class="nav-link" href="${page.href}"${currentAttr}>${page.nav}</a></li>`
  })
  return `<ul>${items.join('')}</ul>`
}

function canonicalUrl(page) {
  return `${SITE_ORIGIN}/${page.href}`
}

function htmlToText(html) {
  return html
    .replace(/<code>([\s\S]*?)<\/code>/g, '$1')
    .replace(/<[^>]+>/g, '')
    .replaceAll('&quot;', '"')
    .replaceAll('&#39;', "'")
    .replaceAll('&amp;', '&')
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>')
    .replace(/\s+/g, ' ')
    .trim()
}

function faqPairs() {
  const src = read('site/pages/faq.html')
  return src
    .split(/<h2>/)
    .slice(1)
    .map((chunk) => {
      const qEnd = chunk.indexOf('</h2>')
      return {
        q: htmlToText(chunk.slice(0, qEnd)),
        a: htmlToText(chunk.slice(qEnd + 5)),
      }
    })
    .filter((pair) => pair.q && pair.a)
}

function jsonLdBlock(page) {
  let data
  if (page.id === 'index') {
    data = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: DISPLAY_NAME,
      url: `${SITE_ORIGIN}/`,
      description: page.description,
    }
  } else if (page.id === 'faq') {
    const pairs = faqPairs()
    data = {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: pairs.map((pair) => ({
        '@type': 'Question',
        name: pair.q,
        acceptedAnswer: { '@type': 'Answer', text: pair.a },
      })),
    }
  } else {
    return ''
  }
  return `  <script type="application/ld+json">\n${JSON.stringify(data, null, 2)}\n  </script>\n`
}

function robotsTxt() {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_ORIGIN}/sitemap.xml\n`
}

function sitemapXml() {
  const urls = PAGES.map(
    (page) =>
      `  <url>\n    <loc>${canonicalUrl(page)}</loc>\n  </url>`,
  ).join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}

function pageHtml(page, content) {
  const template = read('site/template.html')
  return template
    .replaceAll('{{TITLE}}', () => escapeHtml(page.title))
    .replaceAll('{{DESCRIPTION}}', () => escapeHtml(page.description))
    .replaceAll('{{CANONICAL}}', () => canonicalUrl(page))
    .replaceAll('{{OG_IMAGE}}', () => OG_IMAGE)
    .replaceAll('{{JSON_LD}}', () => jsonLdBlock(page))
    .replaceAll('{{NAV}}', () => navHtml(page.id))
    .replaceAll('{{CONTENT}}', () => content)
}

function llmsTxt() {
  return read('site/llms.txt').replaceAll('{{STARTER_PROMPT}}', () => STARTER_PROMPT)
}

function pageContent(page) {
  if (page.id === 'spec') return renderMarkdown(read('SPEC.md'))
  let body = read(`site/pages/${page.id}.html`)
  if (page.id === 'index') {
    body = body.replaceAll('{{STARTER_PROMPT}}', () => escapeHtml(STARTER_PROMPT))
  }
  if (page.id === 'structure') body = body.replace('{{SECTIONS_TABLE}}', sectionsTable())
  if (page.id === 'example') {
    const example = read('examples/DOPPELGANGER.md')
    body = body.replace(
      '{{EXAMPLE_FILE}}',
      `<pre class="file"><code>${escapeHtml(example)}</code></pre>`,
    )
  }
  return body
}

export function build() {
  const docs = path.join(root, 'docs')
  fs.mkdirSync(docs, { recursive: true })
  for (const page of PAGES) {
    write(`docs/${page.href}`, pageHtml(page, pageContent(page)))
  }
  write('docs/styles.css', read('site/styles.css'))
  write('docs/favicon.svg', read('site/favicon.svg'))
  write('docs/og.svg', read('site/og.svg'))
  copyFile('site/og.png', 'docs/og.png')
  write('docs/llms.txt', llmsTxt())
  write('docs/robots.txt', robotsTxt())
  write('docs/sitemap.xml', sitemapXml())
  write('docs/SPEC.md', read('SPEC.md'))
  write('docs/LICENSE', read('LICENSE'))
  write('docs/DOPPELGANGER.md', read('examples/DOPPELGANGER.md'))
  write('docs/.nojekyll', '')
}

function fail(failures, message) {
  failures.push(message)
}

export function verify() {
  build()
  const failures = []
  if (!PAGES.length) fail(failures, 'PAGES registry is empty')
  if (!SECTIONS.length) fail(failures, 'SECTIONS registry is empty')
  const license = read('LICENSE')
  if (!license.includes('CC0 1.0')) fail(failures, 'LICENSE is missing CC0 1.0')

  const spec = read('SPEC.md')
  if (!spec.includes(SPEC_MARKER)) fail(failures, `SPEC.md is missing ${SPEC_MARKER}`)
  for (const section of SECTIONS.filter((item) => item.level === 'MUST')) {
    if (!spec.includes(`#### ${section.title}`) && !spec.includes(`## ${section.title}`)) {
      fail(failures, `SPEC.md is missing section ${section.title}`)
    }
  }

  const example = read('examples/DOPPELGANGER.md')
  if (!example.startsWith('---\n')) {
    fail(failures, 'examples/DOPPELGANGER.md YAML frontmatter must start at byte 0')
  }
  if (!example.includes(SPEC_MARKER)) {
    fail(failures, `examples/DOPPELGANGER.md is missing ${SPEC_MARKER}`)
  }
  for (const title of [
    '## Meta',
    '## Identity',
    '## Voice fingerprint',
    '## Tone rules',
    '## Hard bans',
    '## Safety',
  ]) {
    if (!example.includes(title)) {
      fail(failures, `examples/DOPPELGANGER.md is missing ${title}`)
    }
  }
  const samples = example.match(/^### /gm) || []
  if (samples.length < 3 || samples.length > 7) {
    fail(failures, `examples/DOPPELGANGER.md needs 3 to 7 voice samples, found ${samples.length}`)
  }
  if (example.includes('https://doppelganger.md/load.html')) {
    fail(failures, 'examples/DOPPELGANGER.md must use a relative load.html link')
  }
  if (spec.includes('https://doppelganger.md/load.html')) {
    fail(failures, 'SPEC.md must use a relative load.html link')
  }

  const descriptions = []
  for (const page of PAGES) {
    const rel = `docs/${page.href}`
    if (!fs.existsSync(path.join(root, rel))) {
      fail(failures, `${rel} was not built`)
      continue
    }
    const html = read(rel)
    if (!html.includes('lang="en"')) fail(failures, `${rel} is missing lang="en"`)
    if (!html.includes('<h1')) fail(failures, `${rel} is missing h1`)
    if (!html.includes('Skip to content')) fail(failures, `${rel} is missing skip link`)
    if (!html.includes(`<a class="brand" href="index.html">${DISPLAY_NAME}</a>`)) {
      fail(failures, `${rel} is missing brand ${DISPLAY_NAME}`)
    }
    if (!html.includes(` · ${DISPLAY_NAME}`)) {
      fail(failures, `${rel} title must include · ${DISPLAY_NAME}`)
    }
    const desc = html.match(/<meta name="description" content="([^"]*)">/)
    if (!desc) fail(failures, `${rel} is missing meta description`)
    else descriptions.push({ rel, text: desc[1] })
    if (!html.includes(`rel="canonical" href="${canonicalUrl(page)}"`)) {
      fail(failures, `${rel} is missing canonical ${canonicalUrl(page)}`)
    }
    if (!html.includes('property="og:type" content="website"')) {
      fail(failures, `${rel} is missing og:type=website`)
    }
    if (!html.includes(`property="og:image" content="${OG_IMAGE}"`)) {
      fail(failures, `${rel} is missing og:image ${OG_IMAGE}`)
    }
    if (!html.includes(`name="twitter:image" content="${OG_IMAGE}"`)) {
      fail(failures, `${rel} is missing twitter:image ${OG_IMAGE}`)
    }
    if (!html.includes('name="twitter:card" content="summary_large_image"')) {
      fail(failures, `${rel} is missing twitter:card=summary_large_image`)
    }
    if (/github\.io/i.test(html)) fail(failures, `${rel} must not cite a GitHub Pages URL`)
    if (/AggregateRating/i.test(html)) fail(failures, `${rel} must not include AggregateRating`)
    for (const brand of BANNED_BRAND) {
      if (brand.test(html)) fail(failures, `${rel} contains banned brand text ${brand}`)
    }
  }

  for (const name of fs.readdirSync(path.join(root, 'docs'))) {
    if (!name.endsWith('.html')) continue
    const rel = `docs/${name}`
    const remainder = read(rel).replaceAll(SITE_ORIGIN, '')
    if (remainder.includes('doppelganger.md')) {
      fail(
        failures,
        `${rel} contains lowercase doppelganger.md outside ${SITE_ORIGIN} URLs`,
      )
    }
  }

  const seenDesc = new Map()
  for (const item of descriptions) {
    if (seenDesc.has(item.text)) {
      fail(
        failures,
        `shared meta description on ${seenDesc.get(item.text)} and ${item.rel}: "${item.text}"`,
      )
    } else {
      seenDesc.set(item.text, item.rel)
    }
  }

  for (const [rel, rule] of Object.entries(REQUIRED_TEXT)) {
    const text = read(rel)
    for (const needle of rule.has || []) {
      if (!text.includes(needle)) fail(failures, `${rel} is missing "${needle}"`)
    }
    for (const needle of rule.lacks || []) {
      if (text.includes(needle)) fail(failures, `${rel} must not contain "${needle}"`)
    }
  }
  if (!read('docs/example.html').includes(escapeHtml(example))) {
    fail(failures, 'docs/example.html did not inline examples/DOPPELGANGER.md')
  }
  if (!fs.existsSync(path.join(root, 'docs/SPEC.md'))) {
    fail(failures, 'docs/SPEC.md was not copied')
  }
  if (read('docs/SPEC.md') !== spec) {
    fail(failures, 'docs/SPEC.md is not a byte copy of SPEC.md')
  }
  if (!fs.existsSync(path.join(root, 'docs/LICENSE'))) {
    fail(failures, 'docs/LICENSE was not copied')
  }
  if (read('docs/LICENSE') !== license) {
    fail(failures, 'docs/LICENSE is not a byte copy of LICENSE')
  }
  if (read('docs/DOPPELGANGER.md') !== example) {
    fail(failures, 'docs/DOPPELGANGER.md is not a byte copy of examples/DOPPELGANGER.md')
  }

  const discovery = {
    'docs/robots.txt': robotsTxt(),
    'docs/sitemap.xml': sitemapXml(),
    'docs/llms.txt': llmsTxt(),
    'docs/favicon.svg': read('site/favicon.svg'),
    'docs/og.svg': read('site/og.svg'),
  }
  for (const [rel, expected] of Object.entries(discovery)) {
    if (!fs.existsSync(path.join(root, rel))) {
      fail(failures, `${rel} is missing`)
      continue
    }
    if (read(rel) !== expected) fail(failures, `${rel} is stale`)
    if (/github\.io/i.test(expected)) fail(failures, `${rel} must not cite a GitHub Pages URL`)
  }
  const robots = read('docs/robots.txt')
  if (!robots.includes('Allow: /')) fail(failures, 'docs/robots.txt must Allow /')
  if (!robots.includes(`Sitemap: ${SITE_ORIGIN}/sitemap.xml`)) {
    fail(failures, 'docs/robots.txt must point Sitemap at doppelganger.md')
  }
  const sitemap = read('docs/sitemap.xml')
  for (const page of PAGES) {
    if (!sitemap.includes(`<loc>${canonicalUrl(page)}</loc>`)) {
      fail(failures, `docs/sitemap.xml is missing ${canonicalUrl(page)}`)
    }
  }
  const llms = read('docs/llms.txt')
  if (!llms.startsWith(`# ${DISPLAY_NAME}`)) {
    fail(failures, `docs/llms.txt must start with # ${DISPLAY_NAME}`)
  }
  if (!llms.includes('CC0')) fail(failures, 'docs/llms.txt must state CC0')
  if (!llms.includes('no account') && !llms.includes('No account')) {
    fail(failures, 'docs/llms.txt must say there is no account')
  }
  if (!llms.includes('## Install for agents')) {
    fail(failures, 'docs/llms.txt is missing ## Install for agents')
  }
  if (!llms.includes(`${SITE_ORIGIN}/DOPPELGANGER.md`)) {
    fail(failures, 'docs/llms.txt must fetch the example at doppelganger.md/DOPPELGANGER.md')
  }
  if (!llms.includes(STARTER_PROMPT)) {
    fail(failures, 'docs/llms.txt must include the starter prompt')
  }
  if (llms.includes('npx')) fail(failures, 'docs/llms.txt must not mention npx')
  const home = read('docs/index.html')
  if (!home.includes(STARTER_PROMPT)) {
    fail(failures, 'docs/index.html must include the starter prompt')
  }
  if (!home.includes('href="DOPPELGANGER.md"') || !home.includes('download="DOPPELGANGER.md"')) {
    fail(failures, 'docs/index.html must offer a real download of DOPPELGANGER.md')
  }
  const faqHtml = read('docs/faq.html')
  if (!faqHtml.includes('"@type": "FAQPage"')) fail(failures, 'docs/faq.html is missing FAQPage JSON-LD')
  if (!faqHtml.includes('"name": "How do I make the file accurate?"')) {
    fail(failures, 'docs/faq.html FAQPage JSON-LD is missing the accuracy question')
  }
  if (/AggregateRating/i.test(faqHtml)) fail(failures, 'docs/faq.html must not include AggregateRating')
  if (!read('docs/index.html').includes('"@type": "WebSite"')) {
    fail(failures, 'docs/index.html is missing WebSite JSON-LD')
  }
  if (!read('docs/index.html').includes(`"name": "${DISPLAY_NAME}"`)) {
    fail(failures, `docs/index.html JSON-LD must include "name": "${DISPLAY_NAME}"`)
  }
  if (!read('docs/styles.css').includes('prefers-reduced-motion: reduce')) {
    fail(failures, 'docs/styles.css is missing prefers-reduced-motion')
  }
  if (!read('docs/structure.html').includes('scope="col"')) {
    fail(failures, 'docs/structure.html tables must use scope="col"')
  }
  if (!read('docs/spec.html').includes('scope="col"')) {
    fail(failures, 'docs/spec.html tables must use scope="col"')
  }

  if (!fs.existsSync(path.join(root, 'wrangler.jsonc'))) {
    fail(failures, 'wrangler.jsonc is missing')
  } else {
    const wranglerRaw = read('wrangler.jsonc')
    if (wranglerRaw.includes('custom_domain')) {
      fail(failures, 'wrangler.jsonc must not attach custom_domain routes')
    }
    const wrangler = JSON.parse(wranglerRaw)
    if (wrangler.name !== 'doppelganger-md') {
      fail(failures, 'wrangler.jsonc name must be doppelganger-md')
    }
    if (wrangler.compatibility_date !== '2026-09-17') {
      fail(failures, 'wrangler.jsonc compatibility_date must be 2026-09-17')
    }
    const assetDir = wrangler.assets && wrangler.assets.directory
    if (assetDir !== 'docs' && assetDir !== './docs') {
      fail(failures, 'wrangler.jsonc assets.directory must be docs or ./docs')
    }
  }

  const readme = read('README.md')
  if (!readme.includes('SPEC.md')) {
    fail(failures, 'README.md must link SPEC.md')
  }
  if (!readme.includes('examples/DOPPELGANGER.md')) {
    fail(failures, 'README.md must link examples/DOPPELGANGER.md')
  }
  if (!readme.includes('https://doppelganger.md')) {
    fail(failures, 'README.md must link https://doppelganger.md')
  }
  if (!readme.includes('Download example')) {
    fail(failures, 'README.md must name Download example')
  }
  if (!readme.includes('Copy starter prompt')) {
    fail(failures, 'README.md must name Copy starter prompt')
  }
  if (!readme.includes('MUST') || !readme.includes('SHOULD') || !readme.includes('MAY')) {
    fail(failures, 'README.md must name MUST, SHOULD, and MAY')
  }
  if (!readme.includes('node scripts/site.mjs verify')) {
    fail(failures, 'README.md must document node scripts/site.mjs verify')
  }
  if (!readme.includes('CC0')) {
    fail(failures, 'README.md must name CC0')
  }
  if (!readme.includes('docs/') || !readme.includes('anywhere')) {
    fail(failures, 'README.md must say the static site in docs/ can be hosted anywhere')
  }
  if (readme.includes('## Deploy')) {
    fail(failures, 'README.md must not include ## Deploy')
  }
  if (/Cloudflare|wrangler|github\.io|CNAME|custom_domain|GitHub Pages|nameserver|DNS may come later|until ops/i.test(readme)) {
    fail(failures, 'README.md must not include Cloudflare, wrangler, DNS, or GitHub Pages ops')
  }
  const agents = read('AGENTS.md')
  if (!agents.includes('## Deploy')) {
    fail(failures, 'AGENTS.md is missing ## Deploy')
  }
  if (!agents.includes('Cloudflare Workers')) {
    fail(failures, 'AGENTS.md must name Cloudflare Workers')
  }
  if (!agents.includes('wrangler.jsonc')) {
    fail(failures, 'AGENTS.md must name wrangler.jsonc')
  }
  if (!agents.includes('npx wrangler deploy') && !agents.includes('wrangler deploy')) {
    fail(failures, 'AGENTS.md must document wrangler deploy')
  }
  if (!agents.includes('node scripts/site.mjs')) {
    fail(failures, 'AGENTS.md must build with node scripts/site.mjs')
  }
  if (!agents.includes('doppelganger.md')) {
    fail(failures, 'AGENTS.md must name custom domain doppelganger.md')
  }
  if (!agents.includes('github.io')) {
    fail(failures, 'AGENTS.md must warn not to retarget to github.io')
  }
  if (fs.existsSync(path.join(root, 'docs/CNAME'))) {
    fail(failures, 'docs/CNAME must not be committed')
  }
  const ogSrc = path.join(root, 'site/og.png')
  const ogOut = path.join(root, 'docs/og.png')
  if (!fs.existsSync(ogSrc)) fail(failures, 'site/og.png is missing')
  if (!fs.existsSync(ogOut)) fail(failures, 'docs/og.png is missing')
  if (!fs.readFileSync(ogSrc).equals(fs.readFileSync(ogOut))) {
    fail(failures, 'docs/og.png is not a byte copy of site/og.png')
  }
  if (!fs.readFileSync(ogOut).subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    fail(failures, 'docs/og.png must be a PNG')
  }

  if (failures.length) {
    const text = failures.map((item) => `FAIL ${item}`).join('\n')
    throw new Error(text)
  }
}

function preview() {
  build()
  const docs = path.join(root, 'docs')
  const types = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
  }
  const server = http.createServer((req, res) => {
    const url = new URL(req.url || '/', 'http://127.0.0.1')
    let rel = decodeURIComponent(url.pathname)
    if (rel === '/') rel = '/index.html'
    const file = path.normalize(path.join(docs, rel))
    if (!file.startsWith(docs)) {
      res.writeHead(403)
      res.end('Forbidden')
      return
    }
    fs.readFile(file, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        res.end('Not found')
        return
      }
      const type = types[path.extname(file)] || 'application/octet-stream'
      const headers = { 'Content-Type': type }
      if (path.basename(file) === 'DOPPELGANGER.md') {
        headers['Content-Disposition'] = 'attachment; filename="DOPPELGANGER.md"'
      }
      res.writeHead(200, headers)
      res.end(data)
    })
  })
  server.listen(PORT, '127.0.0.1', () => {
    process.stdout.write(`preview http://127.0.0.1:${PORT}/\n`)
  })
}

const command = process.argv[2] || 'build'
try {
  if (command === 'build') {
    build()
    process.stdout.write('built docs/\n')
  } else if (command === 'verify') {
    verify()
    process.stdout.write('verify ok\n')
  } else if (command === 'preview') {
    preview()
  } else {
    process.stderr.write(`unknown command ${command}\n`)
    process.exitCode = 2
  }
} catch (err) {
  process.stderr.write(`${err.message || err}\n`)
  process.exitCode = 1
}
