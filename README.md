# Next.js + Supabase Project

A modern full-stack application built with Next.js and Supabase, featuring authentication, real-time data, and a clean project structure.

## 🚀 Project Structure

```
next-supabase/
├── app/                    # Next.js 13+ App Router
│   ├── (auth)/            # Auth route group
│   ├── dashboard/         # Protected dashboard pages
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable React components
│   ├── ui/               # UI components (buttons, forms, etc.)
│   └── layout/           # Layout components (header, footer, etc.)
├── lib/                  # Utility functions and configurations
│   ├── supabase/         # Supabase client and utilities
│   ├── utils.ts          # General utility functions
│   └── validations.ts    # Form validation schemas
├── types/                # TypeScript type definitions
├── public/               # Static assets
├── supabase/            # Supabase configuration
│   ├── config.toml      # Supabase CLI configuration
│   ├── migrations/      # Database migrations
│   └── seed.sql         # Database seed data
├── .env.local           # Environment variables (local)
├── .env.example         # Environment variables template
└── package.json         # Dependencies and scripts
```

## 🛠️ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18 or higher)
- **npm** or **yarn** or **pnpm**
- **Supabase CLI** (for local development)

### Install Supabase CLI

````bash
# macOS
brew install supabase/tap/supabase


## 🏃‍♂️ Getting Started

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd next-supabase
````

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Dev Environment Setup

download supabase cli

#### 1. Start supabase locally

```
supabase start
supabase db reset
```

Update `.env.development` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_API_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
DATABASE_URL=your_supabase_DB_URL
```

## 🔐 Authentication

The project includes:

- Sign up / Sign in forms
- Protected routes
- User session management
- OAuth providers (configurable)

## 🎨 Styling

- **Tailwind CSS** for utility-first styling
- **CSS Modules** support
- **Component-based** styling approach
