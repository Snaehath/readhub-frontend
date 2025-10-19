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
    if (chatHistory.length) localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
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
      const res = await fetch("https://readhub-backend.onrender.com/api/ai/chat", {  //https://readhub-backend.onrender.com/api/ai/chat
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userMessage: message }),
      });

      const data = await res.json();
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: data?.reply?.trim() || "No response." },
      ]);
    } catch (error) {
      console.error(error);
      setChatHistory((prev) => [
        ...prev,
        { sender: "bot", message: "⚠️ Something went wrong. Try again." },
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
