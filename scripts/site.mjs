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

const PAGES = [
  { id: 'index', href: 'index.html', title: 'Home', nav: 'Home' },
  { id: 'structure', href: 'structure.html', title: 'Structure', nav: 'Structure' },
  { id: 'load', href: 'load.html', title: 'How to load', nav: 'Load' },
  { id: 'example', href: 'example.html', title: 'Example', nav: 'Example' },
  { id: 'faq', href: 'faq.html', title: 'FAQ', nav: 'FAQ' },
  { id: 'spec', href: 'spec.html', title: 'Specification', nav: 'Spec' },
]

const BANNED_BRAND = [/supervised/i, /jeroen/i]
const SPEC_MARKER = 'doppelganger-spec: 0.1'

const REQUIRED_TEXT = {
  'docs/index.html': {
    has: [
      '<p class="lede">One open Markdown file that teaches any AI your voice.</p>',
      'color-scheme',
    ],
    lacks: ['AGENTS.md'],
  },
  'docs/load.html': {
    has: ['ChatGPT', 'Claude', 'Gemini', 'Cursor', 'Paste', '1,500', '5,000'],
    lacks: ['AGENTS.md'],
  },
  'docs/example.html': { has: ['Mara Ellison'] },
  'docs/structure.html': { has: ['Voice fingerprint'] },
  'docs/faq.html': { has: ['AGENTS.md', 'BRAND.md', 'hosted loader'] },
  'docs/spec.html': { has: ['&lt;!-- doppelganger-spec: 0.1 --&gt;'] },
  'docs/styles.css': { has: ['color-scheme: dark'] },
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
          header.map((cell) => `<th>${inlineMarkdown(cell)}</th>`).join('') +
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
<thead><tr><th>Level</th><th>Section</th><th>In the file</th></tr></thead>
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

function pageHtml(page, content) {
  const template = read('site/template.html')
  return template
    .replaceAll('{{TITLE}}', escapeHtml(page.title))
    .replaceAll('{{NAV}}', navHtml(page.id))
    .replaceAll('{{CONTENT}}', content)
}

function pageContent(page) {
  if (page.id === 'spec') return renderMarkdown(read('SPEC.md'))
  let body = read(`site/pages/${page.id}.html`)
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
    for (const brand of BANNED_BRAND) {
      if (brand.test(html)) fail(failures, `${rel} contains banned brand text ${brand}`)
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
      res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' })
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
