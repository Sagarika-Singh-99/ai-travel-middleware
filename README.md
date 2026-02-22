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
