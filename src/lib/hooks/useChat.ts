import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types";

export function useChat(token: string | null) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) setChatHistory(JSON.parse(stored));
  }, []);

  useEffect(() => {
    if (chatHistory.length)
      localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    if (!token) {
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: "🔒 Please log in to use the AI assistant." },
      ]);
      return;
    }

    const updated = [...chatHistory, { sender: "user" as const, message }];
    setChatHistory(updated);
    setLoading(true);

    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_API_BASE_URL ||
        "https://readhub-backend.onrender.com/api";
      const res = await fetch(`${baseUrl}/ai/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userMessage: message }),
      });

      if (!res.ok) {
        throw new Error(`Server responded with ${res.status}`);
      }

      const data = await res.json();
      
      if (!data?.reply) {
        throw new Error("EMPTY_RESPONSE");
      }

      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: data.reply.trim() },
      ]);
    } catch (error: unknown) {
      console.error("[ChatError]:", error);
      let errorMessage =
        "⚠️ I encountered an synchronization error. Please check your connection or try again shortly.";

      if (error instanceof Error) {
        if (error.message === "EMPTY_RESPONSE") {
          errorMessage =
            "😶 My apologies, I couldn't generate a response for that. Could you try rephrasing your request?";
        } else if (
          error.message.includes("401") ||
          error.message.includes("403")
        ) {
          errorMessage =
            "🔒 Your session has expired. Please log in again to continue our briefing.";
        }
      }

      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: errorMessage },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    localStorage.removeItem("chatHistory");
    setChatHistory([]);
  };

  return { chatHistory, sendMessage, clearChat, loading, messagesEndRef };
}
