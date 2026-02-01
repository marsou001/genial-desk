# GenialDesk Setup Guide

## 🚀 Phase 1 MVP - Demo Setup

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- An OpenAI API key

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run the schema from `supabase/schema.sql`
3. Copy your project URL and anon key from Settings > API

### Step 3: Configure Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

### Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📊 CSV Upload Format

Your CSV file should have a column named one of:
- `feedback`
- `comment`
- `text`
- `message`

Example CSV:
```csv
feedback,source
"Love the new feature!","Survey"
"The app is too slow","Support Ticket"
```

## 🎯 Features

- **CSV Upload**: Upload feedback files and get instant AI analysis
- **Dashboard**: View feedback volume, sentiment trends, and top topics
- **Weekly Insights**: AI-generated summaries of what changed this week

## 🔧 Tech Stack

- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase (Database)
- OpenAI API (AI Analysis)
- Recharts (Data Visualization)
