# Essay Auditor - AI-Powered Writing Analysis Platform

A comprehensive SaaS platform built with Next.js and Supabase that provides AI-powered essay analysis and feedback for students preparing for standardized tests like TOEFL and IELTS.

## ✨ Features

### 🎯 Core Functionality

- **AI-Powered Essay Analysis** - Comprehensive feedback on grammar, vocabulary, coherence, and structure
- **Exam-Specific Guidance** - Tailored feedback for TOEFL, IELTS, and other standardized tests
- **Real-time Grading** - Instant scoring and detailed analysis reports
- **Writing Progress Tracking** - Monitor improvement over time with detailed analytics

### 🔐 Authentication & User Management

- Complete authentication system with Supabase Auth
- Protected routes with middleware-based session management
- User profiles with customizable settings
- Social authentication support (Google, etc.)

### 💳 Subscription Management

- **Paddle Integration** - Secure payment processing
- **Flexible Pricing Tiers** - Multiple subscription plans with different quotas
- **Real-time Subscription Updates** - Instant plan changes and cancellations
- **Usage Quotas** - Track and limit essay submissions based on plan

### 🎨 Modern UI/UX

- **Dark/Light Mode** - Full theme switching support
- **Responsive Design** - Optimized for desktop, tablet, and mobile
- **Component Library** - Built with Radix UI and Tailwind CSS
- **Toast Notifications** - Real-time user feedback with Sonner

## 🏗️ Architecture & Tech Stack

### Frontend

- **Next.js 15** - App Router with React 19
- **TypeScript** - Full type safety
- **Tailwind CSS** - Utility-first styling
- **Radix UI** - Accessible component primitives
- **TanStack Query** - Server state management
- **Lucide React** - Beautiful icons

### Backend & Database

- **Supabase** - PostgreSQL database with real-time subscriptions
- **Drizzle ORM** - Type-safe database queries
- **Next.js API Routes** - Server-side logic
- **Edge Runtime** - Optimized performance

### Payment & Analytics

- **Paddle** - Subscription billing and payments
- **Webhook Handlers** - Automated subscription management

## 📁 Project Structure

```
├── app/                     # Next.js 15 App Router
│   ├── api/                # API routes
│   │   ├── subscription/   # Subscription management
│   │   ├── userProfile/    # User profile endpoints
│   │   ├── userQuota/      # Usage quota tracking
│   │   └── webhook/        # Payment webhooks
│   ├── auth/               # Authentication pages
│   ├── essay-auditor/      # Main application pages
│   │   ├── exam-hall/      # Essay submission interface
│   │   ├── grading/        # Analysis results
│   │   ├── results/        # Historical results
│   │   └── topic/          # Essay topics
│   ├── pricing/            # Subscription plans
│   └── protected/          # Protected user dashboard
├── components/             # Reusable React components
│   ├── ui/                # UI component library
│   └── Navbar/            # Navigation components
├── db/                    # Database schema and configuration
├── lib/                   # Utilities and configurations
│   ├── supabase/          # Supabase client setup
│   ├── paddle/            # Payment integration
│   └── errors/            # Error handling
├── hooks/                 # Custom React hooks
├── types/                 # TypeScript type definitions
└── supabase/             # Database migrations and functions
```

## Getting Started

### Prerequisites

- **Bun** (recommended) or **Node.js** 18+
- **Supabase CLI** for local development
- **Paddle Account** for payment processing

### Installation

1. **Clone the repository**

```bash
git clone <repository-url>
cd next-supabase
```

2. **Install dependencies**

```bash
bun install
# or
npm install
```

3. **Set up Supabase locally**

prerequisite: download supabase cli
https://supabase.com/docs/guides/local-development

```bash
supabase start
supabase link
supabase db reset
```

4. **Configure environment variables for local development**

1. Create `.env.development`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Database
DATABASE_URL=your_database_url
```

2. (Optional) Create `/supabse/.env` to use auth locally:

```env
SUPABASE_AUTH_GOOGLE_CLIENT_ID=your_google_oauth2.0_client_id
SUPABASE_AUTH_GOOGLE_SECRET=your_google_oauth2.0_secret
```

3. **Run the development server**

```bash
bun dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.
