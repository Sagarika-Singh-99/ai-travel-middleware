# 🔀 AI Travel Middleware

The Node.js middleware layer for the AI Travel Planner app. Built with Express + TypeScript and deployed on Render.

## Purpose
Acts as a secure bridge between the React frontend and the FastAPI backend.
Receives trip requests from the frontend, forwards them to the FastAPI agent,
and streams the SSE response back to the browser.

## 🌐 Live URL
[https://ai-travel-middleware.onrender.com](https://ai-travel-middleware.onrender.com)

## 📁 Repo Structure
```
ai-travel-middleware/
├── src/
│   └── index.ts               # Express server + /api/plan-trip SSE route
├── package.json
├── tsconfig.json
└── .env                       # FASTAPI_URL, PORT (not committed)
```
## 🛠️ Tech Stack & Libraries

| Library | Purpose |
|---------|---------|
| Node.js | Runtime |
| Express | HTTP server + routing |
| TypeScript | Type safety |
| dotenv | Environment variable management |
| ts-node / tsx | Run TypeScript directly |

## 📄 File Descriptions

| File | Description |
|------|-------------|
| `src/index.ts` | Express server entry point — defines `POST /api/plan-trip`, receives request from frontend, forwards to FastAPI, and pipes the SSE stream back to the client |
| `.env` | Stores `FASTAPI_URL` and `PORT` — never committed to Git |

## 🚀 Install & Run Locally

```bash
# 1. Clone the repo
git clone https://github.com/Sagarika-Singh-99/ai-travel-middleware.git
cd ai-travel-middleware

# 2. Install dependencies
npm install

# 3. Create a .env file
FASTAPI_URL=https://ai-travel-backend-khc0.onrender.com/plan-trip
PORT=4000

# 4. Start the server
npm run dev
```

> The middleware will run on http://localhost:4000
