import express, { Request, Response } from "express";
import cors from "cors";

const app = express();
const PORT = 4000;
const FASTAPI_URL = process.env.FASTAPI_URL || "http://localhost:8000";

app.use(cors({
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
}));

app.use(express.json());

app.post("/api/plan-trip", async (req: Request, res: Response) => {
  const { destination, days, vibe } = req.body;

  // Basic validation
  if (!destination || !days || !vibe) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }

  try {
    // Forward request to FastAPI
    const fastApiRes = await fetch(`${FASTAPI_URL}/plan-trip`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ destination, days, vibe }),
    });

    if (!fastApiRes.ok) {
      res.status(fastApiRes.status).json({ error: "FastAPI error" });
      return;
    }

    // ✅ Set SSE headers so React knows this is a stream
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");
    res.flushHeaders(); // Send headers immediately

    // ✅ Pipe each chunk from FastAPI straight to React
    const reader = fastApiRes.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      res.write(chunk); // Forward chunk immediately to React
    }

    res.end(); // Close the stream

  } catch (err) {
    console.error("Middleware error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Middleware running on http://localhost:${PORT}`);
});

// FastAPI sends chunk → reader.read() catches it → res.write() forwards it → React receives it instantly

