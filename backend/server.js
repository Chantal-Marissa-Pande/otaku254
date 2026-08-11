import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Test Route
app.get("/", (req, res) => {
  res.send("Otaku AI backend is running!");
});

// Chat Route
app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;

    if (typeof message !== "string" || !message.trim()) {
      return res.status(400).json({ error: "A message is required." });
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(503).json({ error: "Otaku AI is not configured yet." });
    }

    const completion =
      await client.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content:
              "You are Otaku AI, a helpful, concise assistant for anime, manga and K-pop fans. Be welcoming to Kenyan and global fandom audiences. Do not invent current news; say when you are unsure.",
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

    res.json({
      reply:
        completion.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Otaku AI could not answer right now.",
    });
  }
});

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
