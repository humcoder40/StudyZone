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

## Deploy on Render
1. Connect this GitHub repo as a **Web Service** (free)
2. Build: `npm install && npm run build`
3. Start: `npm start`
4. Add env var `GEMINI_API_KEY` in the Render dashboard
