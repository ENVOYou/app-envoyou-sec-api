#!/usr/bin/env node
import { promises as fs } from 'node:fs';
import path from 'node:path';

const legacyTokens = [/--surface-chrome-alpha\b/, /--surface-chrome-alpha-dark\b/];
const rootDirs = ['src', 'app'];
const exts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.css']);

let found = [];

async function walk(dir) {
  let entries;
  try { entries = await fs.readdir(dir, { withFileTypes: true }); } catch { return; }
  for (const e of entries) {
    if (e.name.startsWith('.')) continue;
    const full = path.join(dir, e.name);
    if (e.isDirectory()) {
      await walk(full);
    } else {
      if (!exts.has(path.extname(e.name))) continue;
      const txt = await fs.readFile(full, 'utf8');
      for (const re of legacyTokens) {
        if (re.test(txt)) found.push({ file: full, token: re.source });
      }
    }
  }
}

for (const d of rootDirs) await walk(d);

if (found.length) {
  console.error('\nLegacy chrome alpha tokens detected:');
  for (const f of found) console.error(` - ${f.file} matches ${f.token}`);
  process.exit(1);
}
console.log('No legacy chrome alpha tokens found.');
