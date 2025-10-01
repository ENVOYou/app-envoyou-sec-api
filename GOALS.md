# Envoyou SEC API — Goals & Key Features

This concise document serves as an internal reference to keep the project focused.

## Goals

- Focus on SEC Climate Disclosure compliance (Scope 1 & 2).
- Provide auditable emissions calculation (forensic‑grade traceability).
- Automatic cross-validation with public data (EPA) to detect anomalies.
- Export SEC-ready outputs (10‑K friendly, JSON/CSV).
- Secure, auditable, and easy to operate (CI/CD, versioned migrations).

## Key Features (MVP)

- GHG Emissions Calculator
  - Scope 1 & 2 calculation (initial version; extensible)
  - Emission factor & source management (EPA/EDGAR)
- AuditTrail
  - Store inputs, calculation version, factor sources, timestamps, notes
  - Automatically integrated in compute_ghg
  - CSV/JSON export for auditing
- Cross-Validation Data
  - Compare internal results with EPA data (fallback logics)
  - Flag significant deviations for pre-reporting correction
- SEC Exporter
  - `sec_exporter` module (JSON/CSV)
  - Consistent output structure for 10‑K attachments (extensible)
- Security & Access
  - Supabase JWT middleware (token verification)
  - RBAC via ADMIN_EMAILS/INSPECTOR_EMAILS for `/v1/audit/*`
  - API key + rate limiting for public/restricted endpoints
- Operations
  - Alembic migrations (versioned schema; staging→prod)
  - CI GitHub Actions (Envoyou‑focused tests by default; full regression optional)

## Non‑Goals (initial phase)

- Permit/licensing features (deferred)
- Scope 3 & full ERP integration (next phase)

## Core Deliverables (MVP)

- Calculation endpoint + automatic AuditTrail
- EPA cross-validation + deviation thresholds
- JSON/CSV export for 10‑K
- Authentication & RBAC for audit endpoints
- Production-ready Alembic migration (backup/rollback)

## Repository Envoyou SEC API

[Backend](https://github.com/ENVOYou/envoyou-sec-api) Status: Deploy on Railway (phyton, Fast API)  
[Landing Page](https://github.com/ENVOYou/envoyou-landing) Status: Deploy on Netlify (React, Vite)  
[Dashboard Login/Register](https://github.com/ENVOYou/app-envoyou-sec-api) Status: Deploy on vercel (Next.js, React)  
[Documentation](https://github.com/ENVOYou/envoyou-docs) Status: Deploy on Netlify (React, Docusaurus)


# Metrics of Success (MVP)

Dokumen ini menetapkan metrik yang dipakai untuk menilai keberhasilan MVP Envoyou SEC API.

## 1) Time-to-Value (TTV)

- Definisi: Waktu rata-rata dari input data → kalkulasi → export (JSON/CSV) siap 10-K.
- Target awal: ≤ 30 detik (pada dataset standar, koneksi normal).
- Cara ukur: instrumentasi timing di service (server-side) + log agregasi (p95/p99).

## 2) Validasi Silang (EPA) — Akurasi Deviasi

- Definisi: Persentase hasil internal yang ditandai (flagged) benar saat dibandingkan dengan sumber EPA publik.
- Target awal: ≥ 90% deviasi flagged benar (precision), recall bertahap.
- Cara ukur: set ground-truth kecil dan rutin evaluasi batch.

## 3) SLA Uptime API

- Definisi: Persentase waktu API tersedia dan sehat (health = 200) per bulan.
- Target awal: 99.5% (dev/staging) dan 99.9% (production jangka menengah).
- Cara ukur: healthcheck monitoring + alerting.

## 4) Kualitas Export

- Definisi: Tingkat penerimaan (acceptance) oleh CFO/Legal (tanpa revisi besar) untuk lampiran 10-K.
- Target awal: ≥ 95% acceptance pada pilot.
- Cara ukur: feedback survey + issue tracker.

## 5) Performansi Query

- Definisi: Latensi p95 untuk endpoint kalkulasi dan export.
- Target awal: p95 ≤ 1.5s (tanpa I/O eksternal berat) di staging.

## Operasional & Pelaporan

- Dashboard metrik (Grafana/Dash, dsb.)
- Laporan mingguan: TTV, latensi p95/p99, jumlah export, error rate.
