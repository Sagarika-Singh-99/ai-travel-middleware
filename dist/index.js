"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = parseInt(process.env.PORT || '3001', 10);
const FASTAPI_URL = process.env.FASTAPI_URL || 'https://your-fastapi-app.onrender.com/plan-trip';
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Health check — visiting the URL in browser hits this
app.get('/', (req, res) => {
    res.json({ status: 'Middleware is running OK' });
});
// Main route — React frontend calls this
app.post('/api/plan-trip', async (req, res) => {
    try {
        console.log('Received request:', req.body);
        const fastapiRes = await fetch(FASTAPI_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(req.body)
        });
        if (!fastapiRes.ok) {
            throw new Error(`FastAPI returned ${fastapiRes.status}`);
        }
        // Stream SSE back to frontend
        res.writeHead(200, {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive'
        });
        const reader = fastapiRes.body?.getReader();
        if (reader) {
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                res.write(Buffer.from(value));
            }
        }
        res.end();
    }
    catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error.message });
    }
});
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
