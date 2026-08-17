import { useEffect, useRef, useState } from "react";

interface Message { role: "user" | "assistant"; text: string; }
const quickPrompts = [
  ["✦", "Recommend anime"], ["📖", "Best manga"], ["🎵", "Top K-pop groups"], ["🌐", "Anime lore"],
] as const;

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([{ role: "assistant", text: "Hey! I'm Otaku AI. Ask me about anime, manga, K-pop, recommendations, lore, characters or fandom culture. 🌸" }]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);
  useEffect(() => { if (isOpen) window.setTimeout(() => inputRef.current?.focus(), 250); }, [isOpen]);

  const sendMessage = async (suggestion?: string) => {
    const currentMessage = (suggestion ?? message).trim();
    if (!currentMessage || loading) return;
    setMessages((previous) => [...previous, { role: "user", text: currentMessage }]); setMessage(""); setLoading(true);
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ message: currentMessage }) });
      const data = await response.json();
      if (!response.ok || !data.reply) throw new Error(data.error || "Chat request failed");
      setMessages((previous) => [...previous, { role: "assistant", text: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      const detail = error instanceof Error ? error.message : "Please try again in a moment.";
      setMessages((previous) => [...previous, { role: "assistant", text: `I couldn't reply just now. ${detail}` }]);
    } finally { setLoading(false); }
  };

  return <>
    <section className={`chat-panel ${isOpen ? "open" : ""}`} aria-hidden={!isOpen} aria-label="Otaku AI chat">
      <header className="chat-header"><div className="chat-avatar" aria-hidden="true">✦</div><div className="min-w-0 flex-1"><h2 className="font-extrabold">Otaku AI</h2><p><span className="online-dot" /> Online · Anime · Manga · K-pop</p></div><button onClick={() => setIsOpen(false)} aria-label="Close chat" className="chat-close">×</button></header>
      <div className="chat-suggestions">{quickPrompts.map(([icon, prompt]) => <button key={prompt} onClick={() => sendMessage(prompt)} disabled={loading}><span aria-hidden="true">{icon}</span> {prompt}</button>)}</div>
      <div className="chat-messages" aria-live="polite">{messages.map((item, index) => <div key={`${item.role}-${index}`} className={`chat-message-row ${item.role}`}>
        {item.role === "assistant" && <span className="chat-mini-avatar" aria-hidden="true">✦</span>}
        <div><span className="chat-speaker">{item.role === "user" ? "You" : "Otaku AI"}</span><p className="chat-bubble">{item.text}</p></div>
      </div>)}
      {loading && <div className="chat-message-row assistant"><span className="chat-mini-avatar">✦</span><div className="typing-bubble" aria-label="Otaku AI is typing"><i /><i /><i /></div></div>}<div ref={messagesEndRef} /></div>
      <div className="chat-composer"><div><input ref={inputRef} value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Ask Otaku AI..." aria-label="Message Otaku AI" /><button onClick={() => sendMessage()} disabled={loading || !message.trim()} aria-label="Send message">↑</button></div><p>Powered by Otaku254 AI · Nairobi 🇰🇪</p></div>
    </section>
    <button onClick={() => setIsOpen((open) => !open)} className={`chat-fab ${isOpen ? "open" : ""}`} aria-label={isOpen ? "Close chat" : "Open chat"} aria-expanded={isOpen}>{isOpen ? "×" : <><span aria-hidden="true">✦</span> Chat with Otaku AI</>}</button>
  </>;
}
