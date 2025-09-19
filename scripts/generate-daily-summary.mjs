#!/usr/bin/env node
/**
 * Daily summary generator.
 * Usage: `node scripts/generate-daily-summary.mjs` or `npm run daily:summary` (after adding script).
 * Will create DAILY_SUMMARY_YYYY-MM-DD.md if not exists, else append an additional section.
 */
import fs from 'fs'
import path from 'path'
import { execSync } from 'child_process'

const root = process.cwd()
const now = new Date()
const yyyy = now.getFullYear()
const mm = String(now.getMonth() + 1).padStart(2, '0')
const dd = String(now.getDate()).padStart(2, '0')
const fileName = `DAILY_SUMMARY_${yyyy}-${mm}-${dd}.md`
const filePath = path.join(root, fileName)

// Simple heuristic: collect today's touched auth files (if git present) for bullets.
function getChangedFiles() {
  try {
    const output = execSync(`git diff --name-only --cached || true`).toString().trim()
    const unstaged = execSync(`git diff --name-only || true`).toString().trim()
    const files = new Set([...output.split('\n'), ...unstaged.split('\n')].filter(Boolean))
    return Array.from(files).filter(f => f.startsWith('src/app/auth') || f.includes('authErrors'))
  } catch {
    return []
  }
}

const changed = getChangedFiles()

const header = `# Daily Summary – ${yyyy}-${mm}-${dd}`

const template = `${header}\n\n## Ringkasan Otomatis\n\nFile terkait auth yang berubah hari ini:\n${changed.length ? changed.map(f => `- ${f}`).join('\n') : '- (Tidak terdeteksi perubahan auth di staging index)'}\n\n## Placeholder Aktivitas\nTuliskan ringkasan manual di sini jika perlu menambah konteks bisnis / keputusan teknis.\n\n## TODO Draft\n- [ ] Tambah poin lanjutan (edit file ini).\n\nGenerated at ${now.toISOString()}\n`

if (!fs.existsSync(filePath)) {
  fs.writeFileSync(filePath, template, 'utf8')
  console.log(`Created ${fileName}`)
} else {
  fs.appendFileSync(filePath, `\n\n---\nAppend Run at ${now.toISOString()}\n`, 'utf8')
  console.log(`Appended timestamp to existing ${fileName}`)
}
