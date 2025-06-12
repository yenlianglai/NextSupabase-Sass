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

### 3. Environment Setup

Copy the environment variables template:

```bash
cp .env.example .env.local
```

Update `.env.local` with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

DATABASE_URL=postgres_url
NEXT_PUBLIC_PADDLE_ENV=sandbox_or_production
NEXT_PUBLIC_PADDLE_CLIENT_TOKEN=client_side_token_for_paddle
PADDLE_WEBHOOK_SECRET_KEY=webhook_secret_to_listen_to_paddle_notification
PADDLE_API_KEY=server_side_api_key_for_paddle
API_ROUTE_SECRET=weobhook_secrete_for_supabase_trigger_function
```

### 4. Start Supabase Locally (Optional)

For local development with Supabase:

```bash
# Start Supabase services
supabase start

# This will provide you with local URLs and keys
# Update your .env.local with the local credentials
```

### 5. Database Setup

Run migrations and seed data with drizzle-kit:

```bash
npm run generate

npm run migrate

```

### 6. Start the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📦 Available Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Supabase
supabase start       # Start local Supabase
supabase stop        # Stop local Supabase
supabase status      # Check Supabase status
supabase db reset    # Reset local database
supabase gen types   # Generate TypeScript types
```

## 🗄️ Database & Supabase

### Key Features

- **Authentication**: Built-in auth with email/password, OAuth providers
- **Real-time subscriptions**: Live data updates
- **Row Level Security (RLS)**: Secure data access
- **Edge Functions**: Serverless functions
- **Storage**: File uploads and management

### Database Schema

The project includes:

- `users` table with profile information
- Authentication tables (managed by Supabase)
- Custom tables for your application data

### Generating Types

To generate TypeScript types from your Supabase schema:

```bash
supabase gen types typescript --local > types/supabase.ts
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

## 📁 Key Directories

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=your_production_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key
```

## 🧪 Testing
