# Deploy StudyZone on Vercel

1. Open https://vercel.com and sign in with GitHub
2. **Add New… → Project** → import `humcoder40/StudyZone`
3. Keep defaults (Next.js, root of repo)
4. Environment Variables:
   - `GEMINI_API_KEY` = your Google AI Studio key (required for Check with AI)
   - `GEMINI_MODEL` = optional; leave blank for auto fallback chain
5. Click **Deploy**
6. Share the `https://….vercel.app` link

Notes:
- MCQs work without the API key; AI grading needs `GEMINI_API_KEY`
- `/api/grade` allows up to 60 seconds (`maxDuration`)
- Do not commit `.env.local`
