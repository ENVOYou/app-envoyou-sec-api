#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-unused-vars */
import { readdirSync, readFileSync } from 'fs';
import { join, extname } from 'path';

const ROOT = process.cwd();
// Directories to scan (add more if needed)
const SCAN_DIRS = ['src'];
// File extensions to include
const INCLUDE_EXT = new Set(['.tsx', '.ts', '.jsx', '.js', '.css']);

// Patterns that indicate a hardcoded color instead of token usage
// Explanation:
// 1. Hex colors: #abc, #aabbcc, #RGBA forms (#aabbccdd) -> discourage
// 2. rgb()/rgba()/hsl()/hsla() with numeric values (allow 0 0% 100% tokens not present)
// 3. oklch( usage (legacy) outside globals.css
// 4. Direct color names (limited list) can be optionally added later
const patterns = [
  { name: 'hex', regex: /#[0-9a-fA-F]{3,8}\b/g },
  { name: 'rgb', regex: /\brgba?\s*\(/g },
  { name: 'hsl', regex: /\bhsla?\s*\(/g },
  { name: 'oklch', regex: /oklch\s*\(/g },
];

// After purge: no allowlist; all occurrences are violations
const ALLOW_FILES = new Set([]);

let violations = [];

function scanFile(filePath) {
  const rel = filePath.replace(ROOT + '/', '');
  const content = readFileSync(filePath, 'utf8');
  for (const p of patterns) {
    let match;
    while ((match = p.regex.exec(content)) !== null) {
      // Skip allowed files for specific patterns
      if (ALLOW_FILES.has(rel) && p.name !== 'hex') continue;
      // Ignore occurrences that reference CSS vars (e.g., rgba(var(--something)))
      if (/var\(--/.test(content.slice(match.index, match.index + 40))) continue;
      violations.push({ file: rel, index: match.index, snippet: content.slice(match.index, match.index + 60).replace(/\n/g, ' ') });
    }
  }
}

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
    } else if (INCLUDE_EXT.has(extname(entry.name))) {
      scanFile(full);
    }
  }
}

for (const base of SCAN_DIRS) {
  walk(join(ROOT, base));
}

// Additional pass: forbid transitional *Hsl utility remnants
const hslUtilityRegex = /(?:bg|text|ring|border|placeholder|shadow|from|to|via)-[a-zA-Z]*Hsl\b/;
for (const base of SCAN_DIRS) {
  // quick scan all files again for class token remnants
  // (reuse previous walk but simpler: we already loaded content in scanFile; to avoid complexity we rescan)
}
const fileList = [];
function collect(dir){
  for (const entry of readdirSync(dir,{withFileTypes:true})){
    if(entry.name.startsWith('.')) continue;
    const full = join(dir, entry.name);
    if(entry.isDirectory()) collect(full); else if(INCLUDE_EXT.has(extname(entry.name))) fileList.push(full);
  }
}
collect(join(ROOT,'src'));
let hslRemnants = [];
for (const f of fileList){
  const rel = f.replace(ROOT + '/','');
  const c = readFileSync(f,'utf8');
  if (hslUtilityRegex.test(c)) {
    hslRemnants.push(rel);
  }
}

if (violations.length || hslRemnants.length) {
  if (violations.length) {
    console.error('\nHardcoded color violations found (avoid hex/rgb/hsl/oklch literals):');
    for (const v of violations) console.error(`- ${v.file} :: ${v.snippet}`);
    console.error(`Total color literal issues: ${violations.length}`);
  }
  if (hslRemnants.length) {
    console.error('\nTransitional *Hsl utility remnants detected (should be removed):');
    for (const f of hslRemnants) console.error('- ' + f);
  }
  process.exit(1);
} else {
  console.log('No hardcoded color issues or transitional *Hsl remnants found.');
}
