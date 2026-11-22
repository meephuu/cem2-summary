// Renders the cheat sheet's print layout to dist/cem2-cheat-sheet.pdf (the file the
// "ดาวน์โหลด PDF" button links to). Run after `npm run build`. Needs Playwright, which is
// not a project dependency; CI installs it with `npm i --no-save playwright`.
import { chromium } from 'playwright'
import { existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { pathToFileURL } from 'node:url'

const html = resolve('dist/index.html')
const out = resolve('dist/cem2-cheat-sheet.pdf')
if (!existsSync(html)) throw new Error('dist/index.html not found: run `npm run build` first')

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1280, height: 900 }, colorScheme: 'light' })
await page.goto(`${pathToFileURL(html).href}#/cheat-sheet`)
await page.waitForSelector('.prose.cheat h2')
await page.evaluate(() => document.fonts.ready)
await page.pdf({ path: out, preferCSSPageSize: true, printBackground: true })
await browser.close()
console.log(`wrote ${out}`)
