# Envoyou SEC API Frontend

A modern SaaS frontend for SEC Climate Disclosure compliance built with Next.js 15, TypeScript, and Tailwind CSS. This frontend connects to the Envoyou SEC API backend for greenhouse gas emissions calculation, EPA validation, and SEC filing export.

## Theme & Design System

The dashboard uses a semantic HSL token system (no hardcoded colors) and a layered component hierarchy (`Card`, `ElevatedCard`, `DepthCard`) for visual priority.

- Theme usage & hierarchy guide: [THEME_USAGE_GUIDE.md](./THEME_USAGE_GUIDE.md)
- Live component preview (once added): `/design-system` route
- Depth components: prefer smallest depth tier that achieves emphasis

To propose new tokens or patterns, follow the extension workflow in the guide before opening a PR.

## Features

- **SEC Calculator**: Interactive form for Scope 1 & 2 emissions calculation
- **EPA Validation**: Cross-validation against EPA data with deviation detection
- **SEC Export**: Generate complete SEC filing packages (JSON/CSV)
- **Audit Trail**: Forensic-grade traceability for all calculations
- **Modern UI/UX**: Clean, minimal corporate design inspired by modern SaaS platforms
- **Authentication**: Supabase integration with role-based access control
- **API Integration**: Full integration with production Envoyou SEC API backend
- **Responsive Design**: Works seamlessly across desktop and mobile devices

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom design system
- **Authentication**: Supabase Auth
- **UI Components**: Custom components with Radix UI patterns
- **Charts**: Recharts for data visualization
- **Icons**: Custom SVG icon components
- **State Management**: React Context (Auth, Theme)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase project

### Environment Setup

1. Copy the environment example file:

```bash
cp .env.local.example .env.local
```

1. Update the environment variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
NEXT_PUBLIC_API_BASE_URL=https://api.envoyou.com
```

### Installation

1. Install dependencies:

```bash
npm install
```

1. Run the development server:

```bash
npm run dev
```

1. Open [http://localhost:3001](http://localhost:3001) in your browser.

## Project Structure

```text
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── sec-calculator/    # SEC Calculator page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── icons/            # SVG icon components
│   ├── sec-calculator.tsx # SEC Calculator component
│   ├── sidebar.tsx       # Navigation sidebar
│   ├── header.tsx        # Page header
│   └── theme-provider.tsx # Theme management
├── hooks/                 # Custom React hooks
│   └── useAuth.tsx       # Authentication hook
├── lib/                  # Utility functions
│   ├── api.ts            # API client
│   └── utils.ts          # Common utilities
└── types/                # TypeScript type definitions
    └── index.ts          # Shared types
```

## Backend Integration

This frontend integrates with the Envoyou SEC API backend deployed at `https://api.envoyou.com`.

### Key Endpoints Used

- `POST /v1/emissions/calculate` - Calculate Scope 1 & 2 emissions with audit trail
- `POST /v1/validation/epa` - Cross-validate against EPA data
- `POST /v1/export/sec/package` - Generate complete SEC filing package
- `GET /v1/export/sec/cevs` - Export CEVS data (JSON/CSV)
- `GET /v1/export/sec/audit` - Export audit trail (CSV)
- `POST /v1/admin/mappings` - Company-facility mapping (admin)
- `GET /v1/audit` - Audit trail access (premium)

## Development Guidelines

### Code Style

- Use TypeScript for all components
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

### SEC Calculator Integration

- Use TypeScript interfaces for emission data
- Implement proper error handling for API calls
- Maintain audit trail for all calculations
- Follow SEC compliance requirements for data handling

## License

## Visual Regression Tests

Playwright is configured to capture light + dark snapshots of the design system showcase.

### Install Browsers (first time)
```bash
npx playwright install --with-deps
```

### Run Visual Tests
```bash
pnpm run test:visual
```

### Update Baselines
```bash
pnpm run test:visual:update
```

Baseline snapshots are stored under `tests/visual/__screenshots__/`. Commit updated baselines only when intentional UI changes occur and reference them in the PR description.

Private project - All rights reserved.

## Daily Summaries & Retention

Automated daily development summaries are generated via a GitHub Action (`.github/workflows/daily-summary.yml`). Each run creates or appends a file named `DAILY_SUMMARY_YYYY-MM-DD.md` in the repository root of the dashboard.

### Manual Generation

```bash
npm run daily:summary
```

### Scheduled Generation

The workflow runs daily at `23:50 UTC` (see `cron` line). Adjust schedule by editing the `cron` expression:

```yaml
schedule:
    - cron: '50 23 * * *'
```

### Retention Cleanup

Old summary files are pruned automatically after generation using `scripts/cleanup-daily-summaries.mjs`.

Run manually:

```bash
RETENTION_DAYS=45 npm run daily:cleanup
```

Default retention: `30` days. Configure via the `RETENTION_DAYS` environment variable. To preview deletions without removing files:

```bash
DRY_RUN=1 RETENTION_DAYS=60 npm run daily:cleanup
```

### Workflow Steps Overview

1. Install dependencies
1. Generate (or update) today's summary file
1. Cleanup old summaries (`RETENTION_DAYS=30` by default in workflow)
1. Commit + push if changes exist

### Customizing

- Change retention: edit `RETENTION_DAYS` env in workflow step
- Disable cleanup: remove or comment out the cleanup step
- Extend content: modify `scripts/generate-daily-summary.mjs`

### Notes

- Files are only committed when content changes
- Filenames must match `DAILY_SUMMARY_YYYY-MM-DD.md` pattern for cleanup

