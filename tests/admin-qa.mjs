import { chromium } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const output = join(dirname(fileURLToPath(import.meta.url)), '..', 'test-results')
await mkdir(output, { recursive: true })
const browser = await chromium.launch({ channel: 'msedge', headless: true })
const page = await browser.newPage({ viewport: { width: 1440, height: 950 } })
const errors = []
page.on('console', (message) => message.type() === 'error' && errors.push(message.text()))
page.on('pageerror', (error) => errors.push(error.message))

await page.goto('http://localhost:8080/admin/login', { waitUntil: 'networkidle' })
await page.getByRole('heading', { name: 'Painel administrativo' }).waitFor()
await page.screenshot({ path: join(output, 'admin-login.png'), fullPage: true })
await page.getByRole('button', { name: /Entrar no painel/ }).click()
await page.waitForURL('**/admin/dashboard')
await page.getByRole('heading', { name: 'Bom dia, Bianca' }).waitFor()
await page.screenshot({ path: join(output, 'admin-dashboard.png'), fullPage: true })

await page.goto('http://localhost:8080/admin/contents', { waitUntil: 'networkidle' })
await page.getByRole('heading', { name: 'Conteúdos', exact: true }).waitFor()
await page.screenshot({ path: join(output, 'admin-contents.png'), fullPage: true })
await page.goto('http://localhost:8080/admin/contents/new', { waitUntil: 'networkidle' })
await page.getByRole('heading', { name: 'Criar conteúdo' }).waitFor()
await page.screenshot({ path: join(output, 'admin-content-form.png'), fullPage: true })

await page.goto('http://localhost:8080/admin/clients', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Novo cliente' }).click()
await page.getByRole('heading', { name: 'Novo cliente' }).waitFor()
await page.waitForTimeout(300)
await page.screenshot({ path: join(output, 'admin-client-modal.png'), fullPage: true })
await page.getByRole('button', { name: 'Fechar' }).click()

await page.goto('http://localhost:8080/admin/calendar', { waitUntil: 'networkidle' })
await page.getByRole('heading', { name: 'Calendário editorial' }).waitFor()
await page.screenshot({ path: join(output, 'admin-calendar.png'), fullPage: true })

await page.setViewportSize({ width: 390, height: 844 })
await page.goto('http://localhost:8080/admin/dashboard', { waitUntil: 'networkidle' })
await page.getByRole('heading', { name: 'Bom dia, Bianca' }).waitFor()
await page.screenshot({ path: join(output, 'admin-dashboard-mobile.png'), fullPage: true })
await page.getByRole('button', { name: 'Abrir menu' }).click()
await page.getByRole('link', { name: 'Conteúdos' }).waitFor()
await page.screenshot({ path: join(output, 'admin-menu-mobile.png'), fullPage: true })

await page.goto('http://localhost:8080/admin/clients', { waitUntil: 'networkidle' })
await page.getByRole('button', { name: 'Novo cliente' }).click()
await page.getByRole('heading', { name: 'Novo cliente' }).waitFor()
await page.waitForTimeout(300)
await page.screenshot({ path: join(output, 'admin-client-modal-mobile.png'), fullPage: true })

await browser.close()
if (errors.length) throw new Error(`Erros no navegador:\n${errors.join('\n')}`)
console.log('QA administrativo concluído em desktop e mobile.')
