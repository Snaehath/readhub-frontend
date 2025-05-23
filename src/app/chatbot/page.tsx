"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import { ChatMessage } from "@/types";

export default function ChatbotPage() {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) {
      setChatHistory(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
  }, [chatHistory]);

  const sendMessage = async (messageOverride?: string) => {
  const messageToSend = messageOverride ?? userMessage;
  if (!messageToSend.trim()) return;

  const updatedHistory: ChatMessage[] = [
    ...chatHistory,
    { sender: "user" as const, message: messageToSend },
  ];
  setChatHistory(updatedHistory);
  setUserMessage("");
  setLoading(true);

  try {
    const res = await fetch("https://readhub-backend.onrender.com/api/ai/chat", { //local testing --- "http://localhost:5000/api/ai/chat" ---
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userMessage: messageToSend }),
    });

    const data = await res.json();
    const reply = data?.reply?.trim() || "No response.";

    setChatHistory([
      ...updatedHistory,
      { sender: "bot" as const, message: reply },
    ]);
  } catch (error) {
    console.error("Chat error:", error);
    setChatHistory([
      ...updatedHistory,
      { sender: "bot" as const, message: "Something went wrong. Please try again." },
    ]);
  } finally {
    setLoading(false);
  }
};

  const clearChat = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  };

  const suggestions = [
    "Summarize the latest news",
    "Today's top news in india",
    "Latest news in India",
    "Children's books",
    "Horror books",
    "What's trending in technology?",
    "Give me a fun fact from today's news",
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🤖 AI Chat Assistant</h2>
      <p className="text-muted-foreground mb-4">
        Ask anything about the latest news!
      </p>

      <div className="mb-4 border rounded-md p-3 h-[400px] overflow-y-auto bg-background" aria-live="polite">
        <div className="space-y-4">
          {chatHistory.map((chat, idx) => (
            <Card
              key={idx}
              className={`${
                chat.sender === "user"
                  ? "bg-blue-50 dark:bg-blue-900 ml-auto text-right"
                  : "bg-gray-100 dark:bg-gray-800 text-left"
              } max-w-sm`}
            >
              <CardContent className="p-3 text-sm whitespace-pre-line">
                <ReactMarkdown
                  rehypePlugins={[
                    rehypeRaw,
                    [rehypeExternalLinks, { target: "_blank", rel: "noopener noreferrer" }],
                  ]}
                >
                  {chat.message}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}

          {loading && (
            <Card className="bg-gray-100 dark:bg-gray-800 max-w-sm text-left">
              <CardContent className="p-3 text-sm italic text-muted-foreground">
                Thinking...
              </CardContent>
            </Card>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="Ask something like 'Summarize the news'"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button onClick={() => sendMessage()} disabled={loading}>
          Send
        </Button>
      </div>

      {/* 🔹 Suggestions Section */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((text, i) => (
            <Button
              key={i}
              variant="outline"
              size="sm"
              className="text-xs"
              onClick={() => sendMessage(text)}
              disabled={loading}
            >
              {text}
            </Button>
          ))}
        </div>
      </div>

      <div className="text-right">
        <Button variant="ghost" size="sm" onClick={clearChat} disabled={loading}>
          Clear Chat
        </Button>
      </div>
    </div>
  );
}
