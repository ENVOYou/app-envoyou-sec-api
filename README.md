# Envoyou Dashboard

A modern SaaS dashboard for environmental data management built with Next.js 15, TypeScript, and Tailwind CSS.

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

2. Update the environment variables:
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

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
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
