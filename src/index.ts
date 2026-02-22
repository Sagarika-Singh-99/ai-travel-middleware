import express, { Request, Response } from 'express';
import cors from 'cors';

const app = express();
const PORT = parseInt(process.env.PORT || '3001', 10);
const FASTAPI_URL = process.env.FASTAPI_URL || 'https://ai-travel-backend-khc0.onrender.com/plan-trip';

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ status: 'Middleware is running OK' });
});

app.post('/api/plan-trip', async (req: Request, res: Response) => {
  try {
    const { destination, days, vibe } = req.body;

    if (!destination || !days || !vibe) {
      res.status(400).json({ error: 'Missing fields: destination, days, vibe are required' });
      return;
    }

    console.log(`Planning trip to ${destination} for ${days} days, vibe: ${vibe}`);

    const fastapiRes = await fetch(FASTAPI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ destination, days, vibe })
    });

    if (!fastapiRes.ok) {
      throw new Error(`FastAPI returned ${fastapiRes.status}`);
    }

    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    });

    const reader = fastapiRes.body?.getReader();
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        res.write(Buffer.from(value));
      }
      reader.releaseLock();
    }

    res.end();

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: (error as Error).message });
  }
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
