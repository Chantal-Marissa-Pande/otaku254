import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Groq from "groq-sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Groq({ apiKey: process.env.GROQ_API_KEY });
const model = "openai/gpt-oss-120b";
const backendRevision = "tavily-rag-v1";
const systemPrompt = `You are Otaku AI for a Kenyan anime, manga and K-pop community. Answer only from the supplied web evidence. Check Kenyan context before assuming an unfamiliar name is Japanese media. Prefer official, primary, or reputable industry sources. Never invent or silently correct facts. Cite factual claims with markdown links to the supplied URLs. If the evidence is insufficient or conflicting, say so and ask a short clarifying question. Keep answers concise.`;

function buildSearchQuery(message) {
  const query = message.trim();
  const isBroadRequest = /\b(top|best|popular|recommend|recommendations?|suggest|suggestions?)\b/i.test(query) && query.split(/\s+/).length <= 8;
  if (!isBroadRequest) return query;

  const year = new Date().getFullYear();
  let criteria = "recent popularity reputable coverage audience relevance";
  if (/k[- ]?pop/i.test(query)) criteria = "global charts album sales touring impact";
  if (/anime/i.test(query)) criteria = "audience reception popularity legal streaming availability";
  if (/manga/i.test(query)) criteria = "sales critical reception reader popularity";
  return `${query} top 5 ${year} ${criteria}`;
}

async function searchWeb(query) {
  const response = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.TAVILY_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, search_depth: "basic", max_results: 3, include_answer: false, include_raw_content: false, exclude_domains: ["fandom.com"] }),
    signal: AbortSignal.timeout(15000),
  });

  if (!response.ok) {
    const error = new Error(`Tavily search failed with status ${response.status}`);
    error.status = response.status;
    error.service = "Tavily";
    throw error;
  }

  const data = await response.json();
  return Array.isArray(data.results)
    ? data.results.slice(0, 3).map((result) => ({
        title: String(result.title || "Untitled source"),
        url: String(result.url || ""),
        content: String(result.content || "").slice(0, 1400),
      })).filter((result) => result.url && result.content)
    : [];
}

function formatEvidence(results) {
  return results.map((result, index) => `[${index + 1}] ${result.title}\nURL: ${result.url}\nEvidence: ${result.content}`).join("\n\n");
}

app.get("/", (req, res) => res.send("Otaku AI backend is running!"));
app.get("/health", (req, res) => res.json({ status: "ok", model, search: "tavily", revision: backendRevision }));

app.post("/chat", async (req, res) => {
  try {
    const { message } = req.body;
    if (typeof message !== "string" || !message.trim()) return res.status(400).json({ error: "A message is required." });
    if (!process.env.GROQ_API_KEY || !process.env.TAVILY_API_KEY) return res.status(503).json({ error: "Otaku AI search is not configured yet." });

    const query = message.trim();
    const isCasualMessage = /^(hi|hello|hey|thanks|thank you|good (morning|afternoon|evening))[.!\s]*$/i.test(query);
    let sources = [];

    if (!isCasualMessage) {
      sources = await searchWeb(buildSearchQuery(query));
      if (sources.length === 0) return res.json({ reply: "I couldn't find reliable sources for that, so I don't want to guess. Could you add a little more context?", model, searched: true, sources: [] });
    }

    const userPrompt = isCasualMessage
      ? query
      : `Question: ${query}\n\nWeb evidence:\n${formatEvidence(sources)}\n\nAnswer using only this evidence. For a broad ranking or recommendation, give no more than 5 results and mention the criteria. End with a short Sources section containing markdown links.`;

    const completion = await client.chat.completions.create({
      model,
      temperature: 0.1,
      max_completion_tokens: 1200,
      messages: [{ role: "system", content: systemPrompt }, { role: "user", content: userPrompt }],
    });

    res.json({
      reply: completion.choices[0]?.message?.content || "I couldn't produce a verified answer.",
      model,
      searched: !isCasualMessage,
      sources: sources.map(({ title, url }) => ({ title, url })),
    });
  } catch (error) {
    const upstreamStatus = Number(error?.status) || 500;
    const service = error?.service || "Groq";
    console.error(`${service} request failed`, { status: upstreamStatus, message: error?.message, model });
    if (upstreamStatus === 401 || upstreamStatus === 403) return res.status(503).json({ error: `${service} credentials need attention.` });
    if (upstreamStatus === 429) return res.status(503).json({ error: "Otaku AI has reached a temporary search or model limit. Please try again shortly." });
    if (error?.name === "TimeoutError") return res.status(504).json({ error: "Otaku AI search timed out. Please try again." });
    res.status(502).json({ error: "Otaku AI could not answer right now." });
  }
});

const port = Number(process.env.PORT) || 5000;
app.listen(port, () => console.log(`Server running on port ${port}`));
