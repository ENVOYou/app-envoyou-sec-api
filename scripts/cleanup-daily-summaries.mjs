#!/usr/bin/env node
import fs from 'fs';
import path from 'path';

// Configuration
const RETENTION_DAYS = parseInt(process.env.RETENTION_DAYS || '30', 10); // default 30 days
const DRY_RUN = process.env.DRY_RUN === '1' || process.env.DRY_RUN === 'true';
const SUMMARY_PREFIX = 'DAILY_SUMMARY_';
const SUMMARY_SUFFIX = '.md';

function log(msg) {
  process.stdout.write(msg + '\n');
}

function parseDateFromFilename(filename) {
  // Expect pattern DAILY_SUMMARY_YYYY-MM-DD.md
  const base = path.basename(filename);
  if (!base.startsWith(SUMMARY_PREFIX) || !base.endsWith(SUMMARY_SUFFIX)) return null;
  const datePart = base.slice(SUMMARY_PREFIX.length, base.length - SUMMARY_SUFFIX.length);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(datePart)) return null;
  const date = new Date(datePart + 'T00:00:00Z');
  return isNaN(date.getTime()) ? null : date;
}

function daysBetween(a, b) {
  return Math.floor((a.getTime() - b.getTime()) / (1000 * 60 * 60 * 24));
}

function main() {
  const cwd = process.cwd();
  const entries = fs.readdirSync(cwd).filter(f => f.startsWith(SUMMARY_PREFIX) && f.endsWith(SUMMARY_SUFFIX));
  const now = new Date();
  const toDelete = [];

  for (const file of entries) {
    const d = parseDateFromFilename(file);
    if (!d) continue;
    const age = daysBetween(now, d);
    if (age > RETENTION_DAYS) {
      toDelete.push({ file, age });
    }
  }

  if (!toDelete.length) {
    log(`No files older than ${RETENTION_DAYS} days.`);
    return;
  }

  log(`Found ${toDelete.length} summary file(s) older than ${RETENTION_DAYS} days:`);
  for (const item of toDelete) {
    log(` - ${item.file} (${item.age} days old)`);
  }

  if (DRY_RUN) {
    log('DRY_RUN enabled; no deletions performed.');
    return;
  }

  for (const { file } of toDelete) {
    try {
      fs.unlinkSync(path.join(cwd, file));
      log(`Deleted ${file}`);
    } catch (err) {
      log(`Error deleting ${file}: ${err.message}`);
    }
  }
}

try {
  main();
} catch (e) {
  console.error('Cleanup failed:', e);
  process.exit(1);
}
