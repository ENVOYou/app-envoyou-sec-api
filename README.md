# Envoyou Dashboard

A modern SaaS dashboard for environmental data management built with Next.js 15, TypeScript, and Tailwind CSS.

## Theme & Design System

The dashboard uses a semantic HSL token system (no hardcoded colors) and a layered component hierarchy (`Card`, `ElevatedCard`, `DepthCard`) for visual priority.

- Theme usage & hierarchy guide: [THEME_USAGE_GUIDE.md](./THEME_USAGE_GUIDE.md)
- Live component preview (once added): `/design-system` route
- Depth components: prefer smallest depth tier that achieves emphasis

To propose new tokens or patterns, follow the extension workflow in the guide before opening a PR.

## Features

- **Modern UI/UX**: Clean, professional interface with dark/light theme support
- **Authentication**: Supabase integration with Google OAuth
- **API Management**: Create and manage API keys for backend integration
- **Data Visualization**: Interactive charts and analytics for usage tracking
- **Global Environmental Data**: Access to EPA/EIA emissions, EEA indicators, and more
- **Real-time Notifications**: Stay updated with account activities
- **Responsive Design**: Works seamlessly across desktop and mobile devices
- **Consistent Icons**: SVG-based icon system with unified color scheme

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
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
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

1. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```text
src/
├── app/                    # Next.js App Router pages
│   ├── dashboard/         # Dashboard pages
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   ├── icons/            # SVG icon components
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

This dashboard works with the Envoyou API backend located at `/home/husni/PROJECT-ENVOYOU-API/api-envoyou`.

### Key Endpoints Used

- `/v1/auth/supabase/verify` - Supabase token verification
- `/v1/user/*` - User profile and settings
- `/v1/global/*` - Environmental data access
- `/v1/developer/*` - Usage statistics
- `/v1/notifications/*` - Notification management

## Development Guidelines

### Code Style

- Use TypeScript for all components
- Follow React best practices
- Use Tailwind CSS for styling
- Implement proper error handling
- Add loading states for async operations

### Icon System

- Use SVG components from `@/components/icons`
- Maintain consistent stroke width (2px)
- Use `currentColor` for stroke
- Follow the single-color theme approach

## License

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

