import { useState, useEffect, useRef } from "react";
import { ChatMessage } from "@/types";
import { API_BASE_URL } from "@/constants";
import axios from "axios";

export function useChat(isAuthenticated: boolean) {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // 🛰️ CLOUD SYNC: Fetch history on mount
  useEffect(() => {
    const fetchHistory = async () => {
      if (!isAuthenticated) return;
      try {
        const url = sessionId 
          ? `${API_BASE_URL}/ai/history/${sessionId}` 
          : `${API_BASE_URL}/ai/history`;
        
        const response = await axios.get(url, {
          withCredentials: true,
        });
        
        if (sessionId && response.data.history) {
          setChatHistory(response.data.history);
        } else if (!sessionId && response.data.sessions?.length > 0) {
          // If no sessionId is active, maybe we want to load the latest?
          // For now, let's keep it clean and let the UI set the sessionId.
        }
      } catch (error) {
        console.error("Failed to fetch cloud history:", error);
      }
    };

    fetchHistory();
  }, [isAuthenticated, sessionId]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !isAuthenticated) return;

    // 1. Optimistic Update: Add user message
    const userMsg: ChatMessage = { sender: "user", message };
    setChatHistory((prev) => [...prev, userMsg]);
    setLoading(true);

    // 2. Prepare Placeholder Bot Message for Streaming
    const botPlaceholder: ChatMessage = { 
      sender: "bot", 
      message: "", 
      events: [] 
    };
    setChatHistory((prev) => [...prev, botPlaceholder]);

    const activeSessionId = sessionId || localStorage.getItem("active_session_id") || "";
    const url = `${API_BASE_URL}/ai/chat-stream`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ userMessage: message, sessionId: activeSessionId }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Unable to start the chat stream.");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let receivedFinal = false;

      while (!receivedFinal) {
        const { value, done } = await reader.read();
        buffer += decoder.decode(value, { stream: !done });

        let boundary = /\r?\n\r?\n/.exec(buffer);
        while (boundary) {
          const eventBlock = buffer.slice(0, boundary.index);
          buffer = buffer.slice(boundary.index + boundary[0].length);
          boundary = /\r?\n\r?\n/.exec(buffer);

          const eventData = eventBlock
            .split(/\r?\n/)
            .filter((line) => line.startsWith("data:"))
            .map((line) => line.slice(5).trimStart())
            .join("\n");
          if (!eventData) continue;

          const data = JSON.parse(eventData);
          if (data.type === "final") {
            setChatHistory((prev) => {
              const newHistory = [...prev];
              const lastMsg = newHistory[newHistory.length - 1];
              if (lastMsg && lastMsg.sender === "bot") {
                lastMsg.message = data.reply || data.message;
                lastMsg.thoughts = data.thoughts;
                lastMsg.latency = data.latency;
              }
              return newHistory;
            });
            receivedFinal = true;
            await reader.cancel();
            break;
          }

          setChatHistory((prev) => {
            const newHistory = [...prev];
            const lastMsg = newHistory[newHistory.length - 1];
            if (lastMsg && lastMsg.sender === "bot") {
              const lastEvent = lastMsg.events?.[lastMsg.events.length - 1];
              if (lastEvent?.type === data.type && lastEvent?.message === data.message) return prev;
              lastMsg.events = [...(lastMsg.events || []), data];
            }
            return newHistory;
          });
        }

        if (done) break;
      }

      if (!receivedFinal) {
        throw new Error("The chat stream ended before a response was received.");
      }
    } catch (err) {
      console.error("SSE Streaming Error:", err);
      setChatHistory((prev) => {
        const newHistory = [...prev];
        const lastMsg = newHistory[newHistory.length - 1];
        if (lastMsg && lastMsg.sender === "bot") {
          lastMsg.message = "⚠️ Connection interrupted.";
          lastMsg.status = "error";
        } else {
          newHistory.push({ sender: "bot", message: "⚠️ Connection interrupted.", status: "error" });
        }
        return newHistory;
      });
    } finally {
      setLoading(false);
    }
  };

  const clearChat = async () => {
    setChatHistory([]);
    setSessionId(null);
    localStorage.removeItem("active_session_id");
  };

  const deleteMessage = async (index: number) => {
    // Local delete for UI feel
    setChatHistory((prev) => prev.filter((_, i) => i !== index));
  };

  return { chatHistory, sendMessage, clearChat, deleteMessage, loading, messagesEndRef, sessionId, setSessionId };
}
