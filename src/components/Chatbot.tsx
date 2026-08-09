import { useEffect, useRef, useState } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

const quickPrompts = ["Recommend anime", "Best manga", "Top K-pop groups", "Anime lore"];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", text: "Hey! I'm Otaku AI. Ask me about anime, manga, K-pop, recommendations, lore, characters or fandom culture." },
  ]);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, loading]);

  const sendMessage = async () => {
    const currentMessage = message.trim();
    if (!currentMessage || loading) return;

    setMessages((previous) => [...previous, { role: "user", text: currentMessage }]);
    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentMessage }),
      });
      const data = await response.json();
      if (!response.ok || !data.reply) throw new Error(data.error || "Chat request failed");
      setMessages((previous) => [...previous, { role: "assistant", text: data.reply }]);
    } catch (error) {
      console.error("Chat error:", error);
      const detail = error instanceof Error ? error.message : "Please try again in a moment.";
      setMessages((previous) => [...previous, { role: "assistant", text: `I couldn't reply just now. ${detail}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!isOpen && (
        <button onClick={() => setIsOpen(true)} className="fixed bottom-5 right-5 z-50 rounded-full bg-purple-600 px-5 py-3 font-medium text-white shadow-2xl transition hover:bg-purple-700">
          Chat with Otaku AI
        </button>
      )}
      {isOpen && (
        <section className="fixed bottom-5 right-5 z-50 flex h-[70vh] max-h-[700px] w-[calc(100vw-2.5rem)] max-w-[380px] flex-col overflow-hidden rounded-2xl border border-purple-500/30 bg-[#111827] shadow-2xl">
          <header className="flex items-center justify-between bg-gradient-to-r from-purple-600 to-pink-500 p-4">
            <div><h2 className="text-lg font-bold">Otaku AI</h2><p className="text-xs opacity-90">Anime · Manga · K-pop</p></div>
            <button onClick={() => setIsOpen(false)} aria-label="Close chat" className="grid h-8 w-8 place-items-center rounded-full bg-white/10 text-xl hover:bg-white/20">×</button>
          </header>
          <div className="flex flex-wrap gap-2 border-b border-white/10 bg-[#0f172a] p-3">
            {quickPrompts.map((prompt) => <button key={prompt} onClick={() => setMessage(prompt)} className="rounded-full bg-white/10 px-3 py-1.5 text-xs transition hover:bg-purple-600">{prompt}</button>)}
          </div>
          <div className="flex-1 space-y-4 overflow-y-auto bg-[#0b1020] p-4">
            {messages.map((item, index) => (
              <div key={`${item.role}-${index}`} className={`flex ${item.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm break-words ${item.role === "user" ? "rounded-br-none bg-purple-600" : "rounded-bl-none bg-white/10 text-gray-200"}`}>
                  <p className="mb-1 text-xs opacity-60">{item.role === "user" ? "You" : "Otaku AI"}</p><p className="whitespace-pre-line">{item.text}</p>
                </div>
              </div>
            ))}
            {loading && <div className="inline-block rounded-2xl rounded-bl-none bg-white/10 p-3 text-sm text-gray-300">Otaku AI is thinking...</div>}
            <div ref={messagesEndRef} />
          </div>
          <div className="border-t border-white/10 bg-[#111827] p-3"><div className="flex gap-2">
            <input value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} className="flex-1 rounded-xl border border-white/10 bg-black/40 p-3 text-sm outline-none focus:border-purple-500" placeholder="Ask Otaku AI..." />
            <button onClick={sendMessage} disabled={loading || !message.trim()} className="rounded-xl bg-purple-600 px-5 font-medium transition hover:bg-purple-700 disabled:opacity-50">Send</button>
          </div></div>
        </section>
      )}
    </>
  );
}
