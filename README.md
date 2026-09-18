# StudyZone

An interactive AI-based learning platform to teach students according to their needs and evaluate them using their course material.

Class 10 English practice prototype: MCQs, short questions, translation (simple English or Urdu photo upload), and pair of words — with optional AI feedback.

## Local setup
```bash
npm install
cp .env.example .env.local
# add GEMINI_API_KEY to .env.local
npm run dev
```
Open http://localhost:3000

## Deploy on Vercel (recommended)
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import GitHub repo: `humcoder40/StudyZone`
3. Framework: **Next.js** (auto-detected)
4. Root directory: leave default (repo root)
5. **Environment Variables** → add:
   - `GEMINI_API_KEY` = your Google AI Studio key
   - (optional) `GEMINI_MODEL` = leave empty for auto model chain
6. Deploy → share the `*.vercel.app` URL

`/api/grade` is set to `maxDuration = 60` so AI checks are not cut off early.

## Deploy on Render (optional)
1. Connect this repo as a **Web Service** (free)
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Add env var `GEMINI_API_KEY`
