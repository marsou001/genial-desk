# 🚀 GenialDesk Quick Start

## Phase 1 MVP - Ready to Demo!

### What's Included

✅ **CSV Upload** - Upload feedback files with automatic AI analysis  
✅ **AI Tagging** - Automatic topic clustering and sentiment analysis  
✅ **Dashboard** - Visual analytics with charts and trends  
✅ **Weekly Insights** - AI-generated summaries of what changed  
✅ **Feedback List** - Browse and filter all feedback items  
✅ **Clean UI** - Modern, responsive design

### Setup (5 minutes)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up Supabase:**
   - Create account at [supabase.com](https://supabase.com)
   - Create new project
   - Run SQL from `supabase/schema.sql` in SQL Editor
   - Copy your URL and keys

3. **Get OpenAI API key:**
   - Sign up at [platform.openai.com](https://platform.openai.com)
   - Create API key

4. **Create `.env.local`:**
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key_here
   SUPABASE_SERVICE_ROLE_KEY=your_service_key_here
   OPENAI_API_KEY=your_openai_key_here
   ```

5. **Run the app:**
   ```bash
   npm run dev
   ```

6. **Test it:**
   - Go to Upload tab
   - Download sample CSV from the link
   - Upload it
   - Check Dashboard and Weekly Insights!

### CSV Format

Your CSV needs a column with one of these names:
- `feedback`
- `comment`
- `text`
- `message`

Example:
```csv
feedback,source
"Great product!","Survey"
"Needs improvement","Support"
```

### Features Overview

**Dashboard:**
- Total feedback count
- Sentiment breakdown (positive/neutral/negative)
- Volume over time chart
- Top topics bar chart
- Sentiment distribution pie chart

**Upload:**
- Drag & drop CSV files
- Automatic AI analysis
- Real-time processing status
- Error handling

**Feedback:**
- View all feedback items
- Filter by topic and sentiment
- See AI-generated summaries and keywords

**Weekly Insights:**
- AI-generated weekly summary
- Highlights trends and patterns
- Actionable insights

### Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API Routes
- **Database:** Supabase (PostgreSQL)
- **AI:** OpenAI GPT-4o-mini
- **Charts:** Recharts

### Next Steps (Phase 2+)

- Multi-tenancy (organizations & workspaces)
- User authentication
- Role-based permissions
- Stripe subscriptions
- API/webhook integrations
- PDF/Excel exports
- Scheduled reports

---

**Ready to demo!** 🎉
