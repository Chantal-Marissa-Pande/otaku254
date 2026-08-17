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
  defaultHeaders: {
    "Groq-Model-Version": "latest",
  },
});

const model = "groq/compound-mini";

const systemPrompt = `You are Otaku AI, the assistant for Otaku254, a Kenyan and global anime, manga, K-pop and fandom community.

Accuracy rules:
- You MUST use web search before answering any factual question, including questions about names, titles, events, people, organizations, releases, venues, dates, prices, schedules, availability, or news.
- Consider Kenyan and East African fandom context before assuming a term refers to Japanese media.
- Never invent a title, creator, publication, adaptation, date, venue, ticket price, or source.
- If reliable evidence is unavailable, say so plainly and ask a short clarifying question.
- When search is used, identify the supporting sources or links in the answer.
- Separate verified facts from recommendations or inference.

Write welcoming, concise answers. Add detail only when it helps the user.`;

// Test Route
app.get("/", (req, res) => {
  res.send("Otaku AI backend is running!");
});

app.get("/health", (req, res) => {
  res.json({ status: "ok", model });
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
        model,
        compound_custom: {
          tools: {
            enabled_tools: ["web_search"],
          },
        },
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
      });

    const responseMessage = completion.choices[0]?.message;
    const searched = Array.isArray(responseMessage?.executed_tools) &&
      responseMessage.executed_tools.some((tool) => tool?.type === "search");
    const isCasualMessage = /^(hi|hello|hey|thanks|thank you|good (morning|afternoon|evening))[.!\s]*$/i.test(message.trim());

    if (!searched && !isCasualMessage) {
      return res.json({
        reply: "I couldn't verify that with reliable sources, so I don't want to guess. Could you add a little more context or try again?",
        model,
        searched: false,
      });
    }

    res.json({
      reply: responseMessage?.content || "I couldn't produce a verified answer.",
      model,
      searched,
    });
  } catch (error) {
    const upstreamStatus =
      Number(error?.status) || 500;

    console.error("Groq chat request failed", {
      status: upstreamStatus,
      message: error?.message,
      model,
    });

    if (upstreamStatus === 401 || upstreamStatus === 403) {
      return res.status(503).json({
        error: "Otaku AI credentials need attention.",
      });
    }

    if (upstreamStatus === 429 || upstreamStatus === 498) {
      return res.status(503).json({
        error: "Otaku AI is busy right now. Please try again shortly.",
      });
    }

    if (upstreamStatus === 413) {
      return res.status(502).json({
        error: "Otaku AI received too much research context. Please try a more specific question.",
      });
    }

    res.status(502).json({
      error: "Otaku AI could not answer right now.",
    });
  }
});

const port = Number(process.env.PORT) || 5000;

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
