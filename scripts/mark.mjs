#!/usr/bin/env node
import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const read = (rel) => fs.readFileSync(path.join(root, rel), 'utf8')

const FILE_NAME = 'DOPPELGANGER.md'
const DISPLAY_NAME = 'DOPPELG\u00c4NGER.md'
const LEDE = ['One open Markdown file', 'that teaches any AI', 'your voice.']
const STAMP = 'Spec 0.1 \u00b7 CC0 1.0 \u00b7 no account, no loader'

const MARK = { a: '#ffffff', b: '#c7cbe8', c: '#6e7bff' }
const FINE = { n: 216, rIn: 86, cx: 200, cy: 200 }
const COARSE = { n: 28, rIn: 5.2, cx: 16, cy: 16 }

function seedText(src) {
  const m = src.match(/^## Voice fingerprint\n([\s\S]*?)(?=^## )/m)
  return m ? m[1] : src
}

function prng(seed) {
  let a = seed >>> 0
  return function () {
    a = (a + 0x6d2b79f5) >>> 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a) >>> 0
    t = (t + (Math.imul(t ^ (t >>> 7), 61 | t) >>> 0)) >>> 0
    t = (t ^ (t >>> 14)) >>> 0
    return t / 4294967296
  }
}

function hashParams(text) {
  const h = crypto.createHash('sha256').update(text, 'utf8').digest()
  return {
    h,
    seed: (h[0] << 24) | (h[1] << 16) | (h[2] << 8) | h[3],
    k1: 2 + (h[4] % 4),
    k2: 5 + (h[5] % 5),
    p1: (h[6] / 255) * Math.PI * 2,
    p2: (h[7] / 255) * Math.PI * 2,
  }
}

function sampleFine(rnd, a, { k1, k2, p1, p2 }) {
  let v =
    0.3 +
    0.3 * Math.abs(Math.sin(a * k1 + p1)) +
    0.2 * Math.abs(Math.sin(a * k2 + p2)) +
    0.42 * rnd()
  if (rnd() > 0.96) v += 0.5
  return Math.max(0, Math.min(v, 1.35))
}

function sampleCoarse(rnd, a, { k1, p1 }) {
  return 0.34 + 0.34 * Math.abs(Math.sin(a * k1 + p1)) + 0.32 * rnd()
}

function drawRing(text, { n, rIn, cx, cy }, sample, toTick) {
  const params = hashParams(text)
  const rnd = prng(params.seed)
  const ticks = []
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 - Math.PI / 2
    ticks.push(toTick(sample(rnd, a, params), a, { rIn, cx, cy }))
  }
  return { ticks, id: params.h.subarray(0, 8).toString('hex'), params }
}

function fingerprint(text, geom = FINE) {
  return drawRing(text, geom, sampleFine, (v, a, { rIn, cx, cy }) => {
    const len = 10 + v * 46
    return {
      x1: cx + Math.cos(a) * rIn,
      y1: cy + Math.sin(a) * rIn,
      x2: cx + Math.cos(a) * (rIn + len),
      y2: cy + Math.sin(a) * (rIn + len),
      opacity: +(0.3 + 0.62 * Math.min(v / 1.2, 1)).toFixed(3),
      width: v > 0.95 ? 1.6 : 1.15,
    }
  })
}

function coarseFingerprint(text, geom = COARSE) {
  return drawRing(text, geom, sampleCoarse, (v, a, { rIn, cx, cy }) => {
    const len = 2.6 + Math.min(v, 1) * 6.2
    return {
      x1: cx + Math.cos(a) * rIn,
      y1: cy + Math.sin(a) * rIn,
      x2: cx + Math.cos(a) * (rIn + len),
      y2: cy + Math.sin(a) * (rIn + len),
    }
  })
}

const round = (v) => Number(v.toFixed(1))

function ticksSvg(ticks, { scale = 1, dx = 0, dy = 0 } = {}) {
  return ticks
    .map(
      (t) =>
        `<line x1="${round(t.x1 * scale + dx)}" y1="${round(t.y1 * scale + dy)}"` +
        ` x2="${round(t.x2 * scale + dx)}" y2="${round(t.y2 * scale + dy)}"` +
        ` stroke-opacity="${t.opacity}" stroke-width="${(t.width * scale).toFixed(2)}"/>`,
    )
    .join('\n')
}

const gradient =
  `<linearGradient id="fpg" x1="0" y1="0" x2="1" y2="1">` +
  `<stop offset="0" stop-color="${MARK.a}"/>` +
  `<stop offset="0.55" stop-color="${MARK.b}"/>` +
  `<stop offset="1" stop-color="${MARK.c}"/>` +
  `</linearGradient>`

function faviconSvg(text) {
  const { ticks } = coarseFingerprint(text)
  const lines = ticks.map(
    (t) =>
      `<line x1="${round(t.x1)}" y1="${round(t.y1)}"` +
      ` x2="${round(t.x2)}" y2="${round(t.y2)}"/>`,
  )
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
<rect width="32" height="32" fill="#000000"/>
<g stroke="#ffffff" stroke-width="1.5" stroke-linecap="butt">
${lines.join('\n')}
</g>
</svg>
`
}

function ogSvg(ticks) {
  const scale = 0.7
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
<defs>${gradient}
<radialGradient id="bgw" cx="0.76" cy="0.48" r="0.62">
<stop offset="0" stop-color="#131320"/><stop offset="0.55" stop-color="#050507"/><stop offset="1" stop-color="#000000"/>
</radialGradient></defs>
<rect width="1200" height="630" fill="url(#bgw)"/>
<rect x="48" y="48" width="1104" height="534" fill="none" stroke="rgba(255,255,255,.14)"/>
<g stroke="url(#fpg)" stroke-linecap="butt">
${ticksSvg(ticks, { scale, dx: 930 - 200 * scale, dy: 315 - 200 * scale })}
</g>
<text x="96" y="140" font-family="Archivo" font-weight="700" font-size="28" fill="#ffffff" letter-spacing="1">${DISPLAY_NAME}</text>
${LEDE.map(
  (line, i) =>
    `<text x="96" y="${296 + i * 60}" font-family="Archivo" font-weight="700" font-size="57" fill="#ffffff" letter-spacing="-2">${line}</text>`,
).join('\n')}
<text x="96" y="530" font-family="JetBrains Mono" font-size="16" fill="#55555b" letter-spacing="1.2">${STAMP}</text>
</svg>
`
}

const source = read(`examples/${FILE_NAME}`)
const seed = seedText(source)
const { ticks, id } = fingerprint(seed)

const outputs = {
  'site/favicon.svg': faviconSvg(seed),
  'site/og.svg': ogSvg(ticks),
}

const check = process.argv.includes('--check')
let stale = 0

for (const [rel, text] of Object.entries(outputs)) {
  const abs = path.join(root, rel)
  const current = fs.existsSync(abs) ? fs.readFileSync(abs, 'utf8') : null
  if (check) {
    if (current !== text) {
      console.error(`stale: ${rel}`)
      stale++
    }
    continue
  }
  fs.writeFileSync(abs, text)
  console.log(`wrote ${rel}`)
}

if (check) {
  if (stale) {
    console.error('run: node scripts/mark.mjs')
    process.exit(1)
  }
  console.log('mark is current')
} else {
  console.log(`mark id ${id}`)
  console.log('site/og.png is not generated here. Rasterise site/og.svg at 1200x630 and commit it.')
}
