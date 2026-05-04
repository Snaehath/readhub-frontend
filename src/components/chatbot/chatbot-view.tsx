"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import { suggestions } from "@/constants";
import { useChat } from "@/lib/hooks/useChat";
import remarkGfm from "remark-gfm";
import {
  Send,
  Trash2,
  Copy,
  Check,
  CheckCircle2,
  BrainCircuit,
  ChevronDown,
  Search,
  Terminal,
  Bot,
  Sparkles,
} from "lucide-react";

import { AgentEvent } from "@/types";

// --- 🧠 AGENTIC UI: REAL-TIME ACTIVITY SYSTEM ---
const ThinkingContext = ({
  events = [],
  thoughts = [],
  latency: externalLatency,
  status = "finished",
}: {
  events?: AgentEvent[];
  thoughts?: string[];
  latency?: string;
  status?: "active" | "finished";
}) => {
  const isFinished = status === "finished";
  const [isOpen, setIsOpen] = useState(true); // Always open during investigation
  const [seconds, setSeconds] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (status === "active") {
      timer = setInterval(() => setSeconds((prev) => +(prev + 0.1).toFixed(1)), 100);
    }
    return () => clearInterval(timer!);
  }, [status]);

  const latency = isFinished ? externalLatency : seconds.toString();

  // Combine legacy thoughts (for history) and new events (for live)
  const displayLogs: AgentEvent[] = events.length > 0 ? events : thoughts.map(t => {
    if (t.includes("🎯 Strategy:")) return { type: 'llm_step', message: t.replace("🎯 Strategy:", "").trim() };
    if (t.includes("🛠️ Action")) return { type: 'tool_call', message: t.replace(/🛠️ Action \(Turn \d+\):/, "").trim() };
    if (t.includes("📝 Observation:")) return { type: 'tool_result', message: t.replace("📝 Observation:", "").trim() };
    return { type: 'status', message: t };
  });

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [events, thoughts]);

  return (
    <div className="mb-4 animate-in fade-in slide-in-from-top-2 duration-700">
      <div className="group relative overflow-hidden rounded-2xl border border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-900/40 backdrop-blur-xl transition-all duration-500 hover:shadow-lg hover:shadow-indigo-500/5 hover:border-indigo-500/20">
        {/* Subtle Ambient Glow */}
        <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-indigo-500/5 blur-3xl transition-opacity group-hover:opacity-100" />

        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-full flex items-center justify-between p-3.5 px-5 transition-colors"
        >
          <div className="flex items-center gap-3.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500">
              {isFinished ? (
                <CheckCircle2 className="w-3.5 h-3.5" />
              ) : (
                <Terminal className="w-3.5 h-3.5 animate-pulse" />
              )}
            </div>
            <div className="flex flex-col items-start leading-none">
              <span className="text-[13px] font-black uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
                {isFinished ? "Investigative Report" : "Processing Intelligence..."}
              </span>
              <span className="mt-1 text-[10px] font-bold text-zinc-400 dark:text-zinc-500">
                {isFinished ? "DATA READY" : "ACTIVE SEARCH"} • {latency || "0.0"}s
              </span>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
        </button>

        <div className={`overflow-hidden transition-all duration-700 ${isOpen ? "max-h-[500px] border-t border-zinc-100/50 dark:border-zinc-800/50 opacity-100" : "max-h-0 opacity-0"}`}>
          <div ref={scrollRef} className="p-5 space-y-3.5 max-h-[400px] overflow-y-auto scrollbar-none font-mono selection:bg-indigo-500/30">
            {displayLogs.length === 0 && !isFinished && (
              <div className="flex items-center gap-2 text-[11px] text-zinc-400 animate-pulse p-2">
                <Sparkles className="w-3 h-3" />
                <span>Initializing agent nodes...</span>
              </div>
            )}
            {displayLogs.map((log: AgentEvent, idx) => {
              const type = log.type || 'status';
              const isLast = idx === displayLogs.length - 1;
              const isActive = !isFinished && isLast;

              return (
                <div key={idx} className={`flex flex-col gap-2 p-3 rounded-xl transition-all duration-300 ${type === 'llm_step' ? "bg-amber-50/30 dark:bg-amber-950/10 border border-amber-100/50 dark:border-amber-900/20" : type === 'tool_result' ? "bg-blue-50/30 dark:bg-blue-950/10 border border-blue-100/50 dark:border-blue-900/20" : "bg-transparent"}`}>
                  <div className="flex items-start gap-3 text-[11px] leading-relaxed">
                    <div className="mt-1 flex shrink-0 items-center justify-center">
                      {type === 'tool_call' ? <Terminal className="h-3.5 w-3.5 text-indigo-500" /> :
                       type === 'tool_result' ? <Search className="h-3.5 w-3.5 text-blue-500" /> :
                       type === 'llm_step' ? <BrainCircuit className="h-3.5 w-3.5 text-amber-500" /> :
                       <div className="h-1.5 w-1.5 rounded-full bg-zinc-300 dark:bg-zinc-700" />}
                    </div>
                    <div className="flex-1 flex flex-col gap-1">
                      <div className="flex items-center justify-between">
                        <span className={`font-black uppercase tracking-widest text-[9px] ${type === 'llm_step' ? "text-amber-500" : type === 'tool_call' ? "text-indigo-500" : type === 'tool_result' ? "text-blue-500" : "text-zinc-400"}`}>
                          {type === 'tool_call' ? "Action" : type === 'tool_result' ? "Results" : type === 'llm_step' ? "Strategy" : "Status"}
                        </span>
                        {isActive && <span className="h-1.5 w-1.5 rounded-full bg-indigo-500 animate-ping" />}
                      </div>
                      <span className={`tracking-tight ${type === 'llm_step' ? "italic text-zinc-600 dark:text-zinc-300" : "font-medium text-zinc-500 dark:text-zinc-400"}`}>
                      {log.message}
                      </span>
                      
                      {log.sources && log.sources.length > 0 && (
                        <div className="mt-3 p-3 rounded-xl bg-indigo-500/5 border border-indigo-500/10 animate-in fade-in slide-in-from-bottom-2">
                          <div className="flex items-center gap-2 mb-2">
                            <Sparkles className="w-3 h-3 text-indigo-500" />
                            <span className="text-[9px] font-black uppercase tracking-widest text-indigo-500">Cross-Referenced Sources</span>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {log.sources.map((url: string, i: number) => (
                              <ToolTip key={i} content={url}>
                                <a
                                  href={url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1.5 p-1.5 px-2.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[9px] font-mono text-zinc-500 hover:text-indigo-500 hover:border-indigo-500 transition-all group/link"
                                >
                                  <Terminal className="w-3 h-3 opacity-40 group-hover/link:opacity-100" />
                                  <span className="max-w-[120px] truncate">{new URL(url).hostname}</span>
                                </a>
                              </ToolTip>
                            ))}
                          </div>
                        </div>
                      )}

                      {log.args && <div className="mt-1 p-2 bg-zinc-100/50 dark:bg-zinc-800/50 rounded text-[9px] opacity-60 font-mono overflow-hidden text-ellipsis">args: {JSON.stringify(log.args)}</div>}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Typography from "@/components/ui/custom/typography";
import ToolTip from "../ui/custom/tooltip";

const DynamicThinkingDisplay = ({ events = [] }: { events?: AgentEvent[] }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setSeconds((prev) => +(prev + 0.1).toFixed(1)), 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <ThinkingContext
      events={events}
      latency={seconds.toString()}
      status="active"
    />
  );
};

export const ChatbotView = () => {
  const [token, setToken] = useState<string | null>(null);
  const user = useUserStore((state) => state.user);

  useEffect(() => {
    setToken(localStorage.getItem("jwt"));

    // Hide footer and disable body scroll for app-like feel
    const footer = document.querySelector("footer");
    if (footer) footer.style.display = "none";
    document.body.style.overflow = "hidden";

    return () => {
      if (footer) footer.style.display = "block";
      document.body.style.overflow = "auto";
    };
  }, []);

  const {
    chatHistory,
    sendMessage,
    clearChat,
    deleteMessage,
    loading,
    messagesEndRef,
  } = useChat(token);

  const [userMessage, setUserMessage] = useState("");
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  const handleSendMessage = () => {
    if (!userMessage.trim() || loading) return;
    sendMessage(userMessage);
    setUserMessage("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserMessage(e.target.value);
  };

  if (!token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-full mb-4 relative group">
          <Bot className="w-8 h-8 text-black dark:text-white relative z-10" />
        </div>
        <Typography
          variant="h2"
          className="mb-3 font-black uppercase tracking-tight"
        >
          Restricted Access
        </Typography>
        <Typography
          variant="muted"
          className="text-[10px] font-black uppercase tracking-[0.2em] max-w-sm mb-8 leading-relaxed opacity-60"
        >
          Sign in to your ReadHub account to unlock your AI investigative
          assistant.
        </Typography>
        <Button
          asChild
          className="rounded-full px-8 h-12 bg-black dark:bg-white text-white dark:text-black font-black uppercase tracking-widest shadow-xl transition-all hover:scale-105 active:scale-95"
        >
          <Link href="/login">Authenticate to Access</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-[calc(100svh-4rem)] max-w-6xl mx-auto p-4 sm:p-6 overflow-hidden">
      {/* Persistent Reset Action (Minimal) */}
      <div className="absolute top-6 right-6 z-30">
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          disabled={loading || chatHistory.length === 0}
          className="h-9 px-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/30 hover:text-black dark:hover:text-white transition-all cursor-pointer"
          title="Clear Conversation"
        >
          <Trash2 className="w-3.5 h-3.5 mr-2" />
          Clear
        </Button>
      </div>

      {/* Immersive Chat Canvas */}
      <ScrollArea className="flex-1 px-4 mb-2 mt-4">
        <div className="max-w-4xl mx-auto space-y-10 pb-12 scroll-smooth">
          {chatHistory.length === 0 ? (
            <div className="flex flex-col items-center justify-center min-h-[400px] text-center space-y-10">
              <div className="max-w-xl space-y-4">
                <Typography
                  variant="h1"
                  className="text-4xl sm:text-6xl font-black tracking-tighter leading-tight text-zinc-900 dark:text-white mb-2"
                >
                  Hello, {user?.username || "Guest"}
                </Typography>
              </div>

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3 px-2 lg:px-6">
                {suggestions.map((s, i) => (
                  <button
                    key={i}
                    className="group relative flex items-center text-left p-4 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:border-black dark:hover:border-white hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                    onClick={() => sendMessage(s.query)}
                    disabled={loading}
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mr-4 text-xl shrink-0 group-hover:scale-110 transition-transform duration-200">
                      {s.icon}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors">
                        {s.label}
                      </span>
                      <span className="text-xs text-zinc-500 dark:text-zinc-400 line-clamp-1 mt-0.5">
                        {s.query}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${
                    chat.sender === "user" ? "flex-row-reverse" : "flex-row"
                  } items-end animate-in fade-in slide-in-from-bottom-6 duration-700`}
                >
                  <div className="shrink-0 mb-1">
                    {chat.sender === "user" ? (
                      <Avatar className="w-10 h-10 border-2 border-zinc-100 dark:border-zinc-800 shadow-lg grayscale">
                        <AvatarImage src={user?.avatar} />
                        <AvatarFallback className="bg-zinc-900 text-white font-black text-xs uppercase px-1">
                          {user?.username?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="w-10 h-10 bg-black dark:bg-zinc-100 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center shadow-lg animate-in zoom-in duration-500">
                        <Bot className="w-6 h-6 text-white dark:text-black" />
                      </div>
                    )}
                  </div>

                  <div
                    className={`flex flex-col max-w-[85%] sm:max-w-[80%] space-y-1.5 ${chat.sender === "user" ? "items-end text-right" : "items-start text-left"}`}
                  >
                    <Typography
                      variant="muted"
                      className="text-[10px] font-black uppercase tracking-[0.3em] px-3 opacity-40"
                    >
                      {chat.sender === "user"
                        ? user?.username || "You"
                        : "ReadHub AI"}
                    </Typography>

                    <div className="group/msg flex flex-col">
                      {/* 🧠 Collapsible Thinking Context — Perplexity/ChatGPT style */}
                      {chat.sender === "bot" &&
                        ((chat.thoughts && chat.thoughts.length > 0) || (chat.events && chat.events.length > 0)) && (
                          <ThinkingContext
                            thoughts={chat.thoughts}
                            events={chat.events}
                            latency={chat.latency}
                            status={loading && idx === chatHistory.length - 1 ? "active" : "finished"}
                          />
                        )}

                      {chat.message && (
                        <>
                          <div
                            className={`relative p-[1px] rounded-[1.8rem] overflow-hidden ${
                              chat.sender === "user"
                                ? "bg-zinc-200 dark:bg-zinc-800"
                                : "bg-zinc-300 dark:bg-zinc-700"
                            }`}
                          >
                            <div
                              className={`p-4 px-6 text-base leading-relaxed rounded-[1.75rem] bg-white dark:bg-zinc-950 text-foreground`}
                            >
                              <div
                                className={`prose dark:prose-invert max-w-none prose-sm sm:prose-base leading-relaxed prose-p:m-0 prose-headings:font-black`}
                              >
                                <ReactMarkdown
                                  remarkPlugins={[remarkGfm]}
                                  rehypePlugins={[
                                    rehypeRaw,
                                    [
                                      rehypeExternalLinks,
                                      {
                                        target: "_blank",
                                        rel: "noopener noreferrer",
                                      },
                                    ],
                                  ]}
                                >
                                  {chat.message}
                                </ReactMarkdown>
                              </div>
                            </div>
                          </div>

                          {/* Bot Message Action Bar */}
                          {chat.sender === "bot" && (
                            <div className="flex items-center gap-1 mt-1.5 ml-2">
                              {/* 🗑️ DELETE INTERACTION BUTTON */}
                              <ToolTip content="Delete interaction">
                                <button
                                  onClick={() => deleteMessage(idx)}
                                  className="p-1.5 rounded-full transition-all duration-200 cursor-pointer text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </ToolTip>

                              {/* 📋 COPY BUTTON */}
                              <ToolTip
                                content={
                                  copiedIdx === idx ? "Copied!" : "Copy response"
                                }
                              >
                                <button
                                  onClick={() => handleCopy(chat.message, idx)}
                                  className={`p-1.5 rounded-full transition-all duration-200 cursor-pointer ${
                                    copiedIdx === idx
                                      ? "text-green-500 bg-green-50 dark:bg-green-950/30"
                                      : "text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800"
                                  }`}
                                >
                                  {copiedIdx === idx ? (
                                    <Check className="w-3.5 h-3.5" />
                                  ) : (
                                    <Copy className="w-3.5 h-3.5" />
                                  )}
                                </button>
                              </ToolTip>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Futuristic Command Interface */}
      <div className="mt-auto px-4 pt-6 pb-2 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="relative group transition-all duration-300">
            <div className="relative bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-[2rem] p-2 pr-3 flex items-center gap-3 transition-all duration-300 focus-within:border-black dark:focus-within:border-white">
              <div className="pl-4 text-zinc-400 opacity-40 group-focus-within:opacity-100 transition-opacity">
                <Sparkles className="w-5 h-5" />
              </div>
              <Input
                placeholder="Ask me anything about news or books..."
                value={userMessage}
                onChange={handleChange}
                disabled={loading}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-12 text-base placeholder:text-zinc-400 dark:placeholder:text-zinc-600 shadow-none font-medium"
              />
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={loading || !userMessage.trim()}
                className="rounded-2xl w-12 h-12 shrink-0 cursor-pointer bg-black dark:bg-white text-white dark:text-black hover:scale-105 active:scale-95 transition-all duration-300 shadow-lg disabled:opacity-30 disabled:scale-100"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-6 mt-5">
            <Typography
              variant="muted"
              className="text-[10px] font-black uppercase tracking-[0.5em] opacity-30"
            >
              Intelligence Node • ReadHub AI
            </Typography>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotView;
