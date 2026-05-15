import { useState, useRef, useEffect } from "react";

interface Message {
  role: "user" | "assistant";
  text: string;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      text: "Hey 👋 I'm Otaku AI! Ask me about anime, manga, K-pop, recommendations, lore, characters or fandom culture.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // AUTO SCROLL
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // SEND MESSAGE
  const sendMessage = async () => {
    if (!message.trim()) return;

    const currentMessage = message;

    const userMessage: Message = {
      role: "user",
      text: currentMessage,
    };

    // ADD USER MESSAGE
    setMessages((prev) => [...prev, userMessage]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/chat",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: currentMessage,
          }),
        }
      );

      const data = await response.json();

      const botReply: Message = {
        role: "assistant",
        text: data.reply,
      };

      // ADD AI RESPONSE
      setMessages((prev) => [...prev, botReply]);

    } catch (error) {
      console.error(error);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Something went wrong 😢",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ENTER KEY SUPPORT
  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // QUICK PROMPTS
  const quickPrompts = [
    "Recommend anime",
    "Best manga",
    "Top K-pop groups",
    "Anime lore",
  ];

  return (
    <>
      {/* CHAT OPEN BUTTON */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="
            fixed
            bottom-5
            right-5
            bg-purple-600
            hover:bg-purple-700
            text-white
            px-5
            py-3
            rounded-full
            shadow-2xl
            z-50
            transition
            font-medium
          "
        >
          💬 Otaku AI
        </button>
      )}

      {/* CHAT WINDOW */}
      {isOpen && (
        <div
          className="
            fixed
            bottom-5
            right-5
            w-[340px]
            sm:w-[380px]
            h-[70vh]
            max-h-[700px]
            bg-[#111827]
            border
            border-purple-500/30
            rounded-2xl
            shadow-2xl
            flex
            flex-col
            overflow-hidden
            z-50
            backdrop-blur-xl
          "
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-4 flex items-center justify-between">

            <div>
              <h2 className="font-bold text-lg">
                Otaku AI
              </h2>

              <p className="text-xs opacity-90">
                Anime • Manga • K-pop
              </p>
            </div>

            {/* CLOSE BUTTON */}
            <button
              onClick={() => setIsOpen(false)}
              className="
                bg-white/10
                hover:bg-white/20
                w-8
                h-8
                rounded-full
                flex
                items-center
                justify-center
                transition
              "
            >
              ✕
            </button>
          </div>

          {/* QUICK PROMPTS */}
          <div className="p-3 border-b border-white/10 flex flex-wrap gap-2 bg-[#0f172a]">

            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => setMessage(prompt)}
                className="
                  text-xs
                  px-3
                  py-1.5
                  rounded-full
                  bg-white/10
                  hover:bg-purple-600
                  transition
                "
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* MESSAGES AREA */}
          <div
            className="
              flex-1
              overflow-y-auto
              p-4
              space-y-4
              bg-[#0b1020]
            "
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`
                    max-w-[80%]
                    p-3
                    rounded-2xl
                    text-sm
                    whitespace-pre-line
                    break-words
                    ${
                      msg.role === "user"
                        ? "bg-purple-600 text-white rounded-br-none"
                        : "bg-white/10 text-gray-200 rounded-bl-none"
                    }
                  `}
                >
                  <p className="text-xs opacity-60 mb-1">
                    {msg.role === "user"
                      ? "You"
                      : "Otaku AI"}
                  </p>

                  <p>{msg.text}</p>
                </div>
              </div>
            ))}

            {/* LOADING */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white/10 p-3 rounded-2xl rounded-bl-none text-sm flex gap-1">

                  <span className="animate-bounce">
                    .
                  </span>

                  <span
                    className="animate-bounce"
                    style={{
                      animationDelay: "0.2s",
                    }}
                  >
                    .
                  </span>

                  <span
                    className="animate-bounce"
                    style={{
                      animationDelay: "0.4s",
                    }}
                  >
                    .
                  </span>

                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* INPUT AREA */}
          <div className="p-3 border-t border-white/10 bg-[#111827]">

            <div className="flex gap-2">

              <input
                value={message}
                onChange={(e) =>
                  setMessage(e.target.value)
                }
                onKeyDown={handleKeyDown}
                className="
                  flex-1
                  p-3
                  bg-black/40
                  border
                  border-white/10
                  rounded-xl
                  outline-none
                  focus:border-purple-500
                  text-sm
                "
                placeholder="Ask Otaku AI..."
              />

              <button
                onClick={sendMessage}
                disabled={loading}
                className="
                  bg-purple-600
                  hover:bg-purple-700
                  disabled:opacity-50
                  px-5
                  rounded-xl
                  transition
                  font-medium
                "
              >
                Send
              </button>

            </div>
          </div>
        </div>
      )}
    </>
  );
}