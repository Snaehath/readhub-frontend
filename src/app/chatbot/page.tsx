"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import { ChatMessage as ChatMessageType } from "@/types";

export default function ChatbotPage() {
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessageType[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const sendMessage = async () => {
    if (!userMessage.trim()) return;

    // Add user message to chat history
    const updatedHistory = [
      ...chatHistory,
      { sender: "user", message: userMessage },
    ];
    setChatHistory(updatedHistory);
    setUserMessage("");
    setLoading(true);

    try {
      const res = await fetch("https://readhub-backend.onrender.com/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userMessage }),
      });

      const data = await res.json();
      setChatHistory([
        ...updatedHistory,
        { sender: "bot", message: data.reply || "No response." },
      ]);
    } catch (error) {
      console.error("Chat error:", error);
      setChatHistory([
        ...updatedHistory,
        { sender: "bot", message: "Something went wrong. Please try again." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🤖 AI Chat Assistant</h2>
      <p className="text-muted-foreground mb-4">
        Ask anything about the latest news!
      </p>
      <div className="mb-4 border rounded-md p-3 max-h-[400px] overflow-y-auto">
        <div className="space-y-4">
          {chatHistory.map((chat, idx) => (
            <Card
              key={idx}
              className={`${
                chat.sender === "user" ? "bg-blue-50 ml-auto" : "bg-gray-100"
              } max-w-sm`}
            >
              <CardContent className="p-3 text-sm whitespace-pre-line">
                <ReactMarkdown
                  rehypePlugins={[
                    rehypeRaw,
                    [
                      rehypeExternalLinks,
                      { target: "_blank", rel: "noopener noreferrer" },
                    ],
                  ]}
                >
                  {chat.message}
                </ReactMarkdown>
              </CardContent>
            </Card>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Input
          placeholder="Ask something like 'Summarize the news'"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />
        <Button onClick={sendMessage} disabled={loading}>
          {loading ? "Thinking..." : "Send"}
        </Button>
      </div>
    </div>
  );
}
