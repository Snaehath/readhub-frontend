import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { API_BASE_URL } from "@/constants";
import { AgentEvent, ChatMessage, ChatSession } from "@/types";

const ACTIVE_SESSION_KEY = "active_session_id";

const storage = {
  get: () => {
    try {
      return localStorage.getItem(ACTIVE_SESSION_KEY);
    } catch {
      return null;
    }
  },
  set: (value: string | null) => {
    try {
      if (value) localStorage.setItem(ACTIVE_SESSION_KEY, value);
      else localStorage.removeItem(ACTIVE_SESSION_KEY);
    } catch {
      // Storage can be unavailable (private mode); the session still works in memory.
    }
  },
};

type StreamEvent = AgentEvent & {
  reply?: string;
  latency?: string;
  sources?: ChatMessage["sources"];
  events?: AgentEvent[];
  sessionId?: string;
  messageId?: string;
};

/** Parse a Server-Sent Events body, calling onEvent for each `data:` payload until it returns true. */
async function readEventStream(body: ReadableStream<Uint8Array>, onEvent: (event: StreamEvent) => boolean) {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  try {
    while (true) {
      const { value, done } = await reader.read();
      buffer += decoder.decode(value, { stream: !done });
      let boundary = /\r?\n\r?\n/.exec(buffer);
      while (boundary) {
        const block = buffer.slice(0, boundary.index);
        buffer = buffer.slice(boundary.index + boundary[0].length);
        boundary = /\r?\n\r?\n/.exec(buffer);
        const data = block.split(/\r?\n/).filter((line) => line.startsWith("data:")).map((line) => line.slice(5).trimStart()).join("\n");
        if (data && onEvent(JSON.parse(data))) return true;
      }
      if (done) return false;
    }
  } finally {
    reader.cancel().catch(() => undefined);
  }
}

/** Replace the last message (the bot reply being streamed) immutably. */
const updateLast = (messages: ChatMessage[], patch: (message: ChatMessage) => ChatMessage) =>
  messages.length && messages[messages.length - 1].sender === "bot"
    ? [...messages.slice(0, -1), patch(messages[messages.length - 1])]
    : messages;

export function useChat(isAuthenticated: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const refreshSessions = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/history`, { credentials: "include", cache: "no-store" });
      if (res.ok) setSessions((await res.json()).sessions || []);
    } catch {
      // The session list is a convenience; the chat still works without it.
    }
  }, []);

  const openSession = useCallback(async (id: string) => {
    abortRef.current?.abort();
    setSessionId(id);
    storage.set(id);
    setHistoryLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/history/${encodeURIComponent(id)}`, { credentials: "include", cache: "no-store" });
      if (!res.ok) throw new Error();
      const history: ChatMessage[] = (await res.json()).history || [];
      if (history.length === 0) {
        // The stored session no longer exists (deleted or trimmed).
        setSessionId(null);
        storage.set(null);
      }
      setMessages(history);
    } catch {
      toast.error("Couldn't load that conversation.");
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setMessages([]);
      setSessions([]);
      setSessionId(null);
      return;
    }
    void refreshSessions();
    const saved = storage.get();
    if (saved) void openSession(saved);
  }, [isAuthenticated, refreshSessions, openSession]);

  useEffect(() => () => abortRef.current?.abort(), []);

  const send = useCallback(async (text: string, options: { regenerate?: boolean } = {}) => {
    const message = text.trim();
    if (!message || !isAuthenticated || loading) return;

    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setMessages((previous) => [
      ...previous,
      { sender: "user", message },
      { sender: "bot", message: "", events: [] },
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/ai/chat-stream`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        signal: controller.signal,
        body: JSON.stringify({ userMessage: message, sessionId: sessionId || undefined, regenerate: options.regenerate || undefined }),
      });
      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || (response.status === 429 ? "You've reached the assistant limit. Please try again in a few minutes." : "The assistant is unavailable right now."));
      }

      let streamError: string | null = null;
      const finished = await readEventStream(response.body, (event) => {
        if (event.type === "final") {
          if (event.sessionId) {
            setSessionId(event.sessionId);
            storage.set(event.sessionId);
          }
          setMessages((previous) => updateLast(previous, (bot) => ({
            ...bot,
            _id: event.messageId,
            message: event.reply || "",
            latency: event.latency,
            sources: Array.isArray(event.sources) ? event.sources : [],
            events: event.events?.length ? event.events : bot.events,
          })));
          return true;
        }
        if (event.type === "error") {
          streamError = event.message;
          return true;
        }
        setMessages((previous) => updateLast(previous, (bot) => {
          const last = bot.events?.[bot.events.length - 1];
          if (last?.type === event.type && last.message === event.message) return bot;
          return { ...bot, events: [...(bot.events || []), { type: event.type, message: event.message, args: event.args }] };
        }));
        return false;
      });
      if (streamError) throw new Error(streamError);
      if (!finished) throw new Error("The connection closed before the answer was ready.");
      void refreshSessions();
    } catch (error) {
      const aborted = error instanceof DOMException && error.name === "AbortError";
      setMessages((previous) => updateLast(previous, (bot) => ({
        ...bot,
        message: aborted ? bot.message || "Response stopped." : error instanceof Error ? error.message : "Connection interrupted.",
        status: aborted ? "neutral" : "error",
      })));
    } finally {
      if (abortRef.current === controller) abortRef.current = null;
      setLoading(false);
    }
  }, [isAuthenticated, loading, sessionId, refreshSessions]);

  const stop = useCallback(() => abortRef.current?.abort(), []);

  const regenerate = useCallback(() => {
    if (loading) return;
    const lastUser = [...messages].reverse().find((item) => item.sender === "user");
    if (!lastUser) return;
    // The server replaces the stored exchange, so drop it locally too.
    setMessages((previous) => previous.slice(0, -2));
    void send(lastUser.message, { regenerate: true });
  }, [loading, messages, send]);

  const newChat = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setSessionId(null);
    storage.set(null);
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/ai/history/${encodeURIComponent(id)}`, { method: "DELETE", credentials: "include" });
      if (!res.ok) throw new Error();
      setSessions((previous) => previous.filter((session) => session.sessionId !== id));
      if (id === sessionId) newChat();
      toast.success("Conversation deleted.");
    } catch {
      toast.error("Couldn't delete that conversation.");
    }
  }, [sessionId, newChat]);

  const submitFeedback = useCallback(async (messageId: string, rating: "helpful" | "not_helpful") => {
    if (!sessionId) return;
    const setRating = (feedback: ChatMessage["feedback"]) =>
      setMessages((previous) => previous.map((item) => (item._id === messageId ? { ...item, feedback } : item)));
    const before = messages.find((item) => item._id === messageId)?.feedback;
    setRating(rating);
    try {
      const res = await fetch(`${API_BASE_URL}/ai/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sessionId, messageId, rating }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setRating(before);
      toast.error("Feedback could not be saved.");
    }
  }, [sessionId, messages]);

  return { messages, sessions, sessionId, loading, historyLoading, send, stop, regenerate, newChat, openSession, deleteSession, submitFeedback };
}
