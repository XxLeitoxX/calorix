import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { foodsSEO } from '../src/data/foodsSEO.js'
import { SEO_KEYWORDS } from '../src/utils/seoKeywords.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const publicDir = path.join(root, 'public')

const SITE_URL = (process.env.SITE_URL || 'https://calorix.app').replace(/\/+$/, '')

const staticPaths = ['/', '/privacy', '/disclaimer', '/cookies']
const foodPaths = foodsSEO.flatMap((f) => [`/food/${f.slug}`, `/food/${f.slug_es}`])
const keywordPaths = SEO_KEYWORDS.map((k) => `/${k.slug}`)

const allPaths = [...new Set([...staticPaths, ...foodPaths, ...keywordPaths])]

function buildSitemapXml(paths) {
  const urls = paths
    .map(
      (p) => `  <url>
    <loc>${SITE_URL}${p}</loc>
    <changefreq>weekly</changefreq>
    <priority>${p === '/' ? '1.0' : '0.7'}</priority>
  </url>`,
    )
    .join('\n')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`
}

function buildRobotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`
}

async function main() {
  await mkdir(publicDir, { recursive: true })
  await writeFile(path.join(publicDir, 'sitemap.xml'), buildSitemapXml(allPaths), 'utf8')
  await writeFile(path.join(publicDir, 'robots.txt'), buildRobotsTxt(), 'utf8')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
