import { Fragment, useEffect, useRef, useState, type ReactNode } from "react";

interface Message { role: "user" | "assistant"; text: string; }
const quickPrompts = [
  ["✦", "Recommend anime"], ["📖", "Best manga"], ["🎵", "Top K-pop groups"], ["🌐", "Anime lore"],
] as const;

function cleanAssistantText(text: string) {
  return text
    .replace(/[【[]\d+†L\d+(?:[-–]L?\d+)?[】\]]/g, "")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function renderInlineMarkdown(text: string): ReactNode[] {
  const pattern = /(\*\*[^*]+\*\*|`[^`]+`|\[[^\]]+\]\(https?:\/\/[^)]+\))/g;
  return text.split(pattern).filter(Boolean).map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) return <strong key={index}>{part.slice(2, -2)}</strong>;
    if (part.startsWith("`") && part.endsWith("`")) return <code key={index}>{part.slice(1, -1)}</code>;
    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^)]+)\)$/);
    if (link) return <a key={index} href={link[2]} target="_blank" rel="noreferrer">{link[1]}</a>;
    return <Fragment key={index}>{part}</Fragment>;
  });
}

function splitTableRow(line: string) {
  return line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
}

function MarkdownContent({ text }: { text: string }) {
  const lines = text.split("\n");
  const blocks: ReactNode[] = [];
  let index = 0;

  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line) { index += 1; continue; }

    const heading = line.match(/^(#{1,3})\s+(.+)$/);
    if (heading) {
      const level = heading[1].length;
      const content = renderInlineMarkdown(heading[2]);
      blocks.push(level === 1 ? <h1 key={index}>{content}</h1> : level === 2 ? <h2 key={index}>{content}</h2> : <h3 key={index}>{content}</h3>);
      index += 1; continue;
    }

    if (/^---+$/.test(line)) { blocks.push(<hr key={index} />); index += 1; continue; }

    if (line.includes("|") && lines[index + 1]?.match(/^\s*\|?\s*:?-+/)) {
      const headers = splitTableRow(line);
      const rows: string[][] = [];
      index += 2;
      while (index < lines.length && lines[index].includes("|") && lines[index].trim()) {
        rows.push(splitTableRow(lines[index])); index += 1;
      }
      blocks.push(<table key={`table-${index}`}><thead><tr>{headers.map((cell, cellIndex) => <th key={cellIndex}>{renderInlineMarkdown(cell)}</th>)}</tr></thead><tbody>{rows.map((row, rowIndex) => <tr key={rowIndex}>{row.map((cell, cellIndex) => <td key={cellIndex}>{renderInlineMarkdown(cell)}</td>)}</tr>)}</tbody></table>);
      continue;
    }

    if (/^[-*]\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^[-*]\s+/.test(lines[index].trim())) { items.push(lines[index].trim().replace(/^[-*]\s+/, "")); index += 1; }
      blocks.push(<ul key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInlineMarkdown(item)}</li>)}</ul>); continue;
    }

    if (/^\d+\.\s+/.test(line)) {
      const items: string[] = [];
      while (index < lines.length && /^\d+\.\s+/.test(lines[index].trim())) { items.push(lines[index].trim().replace(/^\d+\.\s+/, "")); index += 1; }
      blocks.push(<ol key={`list-${index}`}>{items.map((item, itemIndex) => <li key={itemIndex}>{renderInlineMarkdown(item)}</li>)}</ol>); continue;
    }

    const paragraph = [line]; index += 1;
    while (index < lines.length && lines[index].trim() && !/^(#{1,3})\s+|^[-*]\s+|^\d+\.\s+|^---+$/.test(lines[index].trim()) && !(lines[index].includes("|") && lines[index + 1]?.match(/^\s*\|?\s*:?-+/))) {
      paragraph.push(lines[index].trim()); index += 1;
    }
    blocks.push(<p key={`paragraph-${index}`}>{renderInlineMarkdown(paragraph.join(" "))}</p>);
  }

  return <>{blocks}</>;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
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
      setMessages((previous) => [...previous, { role: "assistant", text: cleanAssistantText(data.reply) }]);
    } catch (error) {
      console.error("Chat error:", error);
      const detail = error instanceof Error ? error.message : "Please try again in a moment.";
      setMessages((previous) => [...previous, { role: "assistant", text: `I couldn't reply just now. ${detail}` }]);
    } finally { setLoading(false); }
  };

  return <>
    <section className={`chat-panel ${isOpen ? "open" : ""} ${isExpanded ? "expanded" : ""}`} aria-hidden={!isOpen} aria-label="Otaku AI chat">
      <header className="chat-header"><div className="chat-avatar" aria-hidden="true">✦</div><div className="min-w-0 flex-1"><h2 className="font-extrabold">Otaku AI</h2><p><span className="online-dot" /> Online · Anime · Manga · K-pop</p></div><div className="chat-window-actions"><button onClick={() => setIsOpen(false)} aria-label="Minimize chat" title="Minimize">−</button><button onClick={() => setIsExpanded((expanded) => !expanded)} aria-label={isExpanded ? "Restore chat window" : "Maximize chat window"} title={isExpanded ? "Restore" : "Maximize"}>{isExpanded ? "↙" : "⛶"}</button><button onClick={() => { setIsOpen(false); setIsExpanded(false); }} aria-label="Close chat" title="Close">×</button></div></header>
      <div className="chat-suggestions">{quickPrompts.map(([icon, prompt]) => <button key={prompt} onClick={() => sendMessage(prompt)} disabled={loading}><span aria-hidden="true">{icon}</span> {prompt}</button>)}</div>
      <div className="chat-messages" aria-live="polite">{messages.map((item, index) => <div key={`${item.role}-${index}`} className={`chat-message-row ${item.role}`}>
        {item.role === "assistant" && <span className="chat-mini-avatar" aria-hidden="true">✦</span>}
        <div><span className="chat-speaker">{item.role === "user" ? "You" : "Otaku AI"}</span>{item.role === "assistant" ? <div className="chat-bubble chat-markdown"><MarkdownContent text={item.text} /></div> : <p className="chat-bubble">{item.text}</p>}</div>
      </div>)}
      {loading && <div className="chat-message-row assistant"><span className="chat-mini-avatar">✦</span><div className="typing-bubble" aria-label="Otaku AI is typing"><i /><i /><i /></div></div>}<div ref={messagesEndRef} /></div>
      <div className="chat-composer"><div><input ref={inputRef} value={message} onChange={(event) => setMessage(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") sendMessage(); }} placeholder="Ask Otaku AI..." aria-label="Message Otaku AI" /><button onClick={() => sendMessage()} disabled={loading || !message.trim()} aria-label="Send message">↑</button></div><p>Powered by Otaku254 AI · Nairobi 🇰🇪</p></div>
    </section>
    <button onClick={() => setIsOpen((open) => !open)} className={`chat-fab ${isOpen ? "open" : ""}`} aria-label={isOpen ? "Close chat" : "Open chat"} aria-expanded={isOpen}>{isOpen ? "×" : <><span aria-hidden="true">✦</span> Chat with Otaku AI</>}</button>
  </>;
}
