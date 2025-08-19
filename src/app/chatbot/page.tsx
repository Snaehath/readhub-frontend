"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import { suggestions } from "@/constants";
import { useChat } from "@/lib/hooks/useChat";

export default function ChatbotPage() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    setToken(localStorage.getItem("jwt"));
  }, []);

  const { chatHistory, sendMessage, clearChat, loading, messagesEndRef } =
    useChat(token);

  const [userMessage, setUserMessage] = useState("");

  const hnadleSendMessage = (message: string) => {
    sendMessage(message);
    setUserMessage("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">🤖 AI Chat Assistant</h2>
      <p className="text-muted-foreground mb-4">
        Ask anything about the latest news!
      </p>

      {/* Chat history */}
      <div className="mb-4 border rounded-md p-3 h-[400px] overflow-y-auto bg-background">
        <div className="space-y-4">
          {chatHistory.map((chat, idx) => (
            <Card
              key={idx}
              className={`${
                chat.sender === "user"
                  ? "bg-blue-200 dark:bg-blue-800 ml-auto text-right"
                  : "bg-gray-200 dark:bg-gray-800 text-left"
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

      {/* Input + Send */}
      <div className="flex items-center gap-2 mb-2">
        <Input
          placeholder="Ask something like 'Summarize the news'"
          value={userMessage}
          onChange={(e) => setUserMessage(e.target.value)}
          disabled={loading}
          onKeyDown={(e) => e.key === "Enter" && sendMessage(userMessage)}
        />
        <Button onClick={() => hnadleSendMessage(userMessage)} disabled={loading}>
          Send
        </Button>
      </div>

      {/* Suggestions */}
      <div className="mb-4">
        <p className="text-sm text-muted-foreground mb-2">Try one of these:</p>
        <div className="flex flex-wrap gap-2">
          {suggestions.map((text, i) => (
            <button
              key={i}
              className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300"
              onClick={() => hnadleSendMessage(text)}
              disabled={loading}
            >
              {text}
            </button>
          ))}
        </div>
      </div>

      {/* Clear Chat */}
      <div className="text-right">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          disabled={loading}
        >
          Clear Chat
        </Button>
      </div>
    </div>
  );
}
