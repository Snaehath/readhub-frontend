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
import {
  Send,
  Bot,
  Trash2,
  Sparkles,
  Lock,
  User,
  MessageSquare,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatbotPage() {
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

  const { chatHistory, sendMessage, clearChat, loading, messagesEndRef } =
    useChat(token);

  const [userMessage, setUserMessage] = useState("");

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
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        <div className="max-w-md w-full bg-card border rounded-2xl p-8 shadow-xl text-center space-y-6">
          <div className="bg-indigo-50 dark:bg-indigo-950/30 w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <Lock className="w-10 h-10 text-indigo-600 dark:text-indigo-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              AI Chat is Locked
            </h2>
            <p className="text-muted-foreground">
              Sign in to your ReadHub account to chat with our intelligent AI
              assistant about news, books, and more.
            </p>
          </div>
          <Button
            asChild
            className="w-full rounded-full h-12 text-lg font-medium shadow-lg hover:shadow-indigo-500/20 transition-all cursor-pointer"
          >
            <Link href="/login">
              Explore Now <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100svh-10rem)] max-w-5xl mx-auto p-4 sm:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-indigo-100 dark:border-indigo-900/50">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600 dark:bg-indigo-500 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              ReadHub AI Assistant
            </h1>
            <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              Online
            </div>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          disabled={loading || chatHistory.length === 0}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer transition-colors"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear Chat
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-8 custom-scrollbar scroll-smooth">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[60%] text-center space-y-6 py-12">
            <div className="relative group">
              <div className="absolute -inset-6 bg-indigo-500/20 blur-3xl rounded-full group-hover:bg-indigo-500/30 transition-all duration-500" />
              <div className="relative bg-white dark:bg-zinc-800 p-5 rounded-2xl shadow-xl border border-indigo-50 dark:border-indigo-900/40">
                <Bot className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
                <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-500 animate-pulse drop-shadow-sm" />
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h2 className="text-2xl font-bold tracking-tight">
                Hello {user?.username || "Reader"}! 👋
              </h2>
              <p className="text-muted-foreground leading-relaxed px-4">
                I&apos;m your intelligent reading companion. Ask me anything
                about news, book recommendations, or site features.
              </p>
            </div>

            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-4 px-2">
              {suggestions.map((text, i) => (
                <button
                  key={i}
                  className="group flex items-center text-left p-4 rounded-2xl border-2 border-zinc-100 dark:border-zinc-800 bg-card hover:border-indigo-500/50 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 cursor-pointer"
                  onClick={() => sendMessage(text)}
                  disabled={loading}
                >
                  <div className="w-10 h-10 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-4 group-hover:bg-indigo-100 dark:group-hover:bg-indigo-900 group-hover:scale-110 transition-all">
                    <MessageSquare className="w-5 h-5 text-zinc-500 group-hover:text-indigo-600 dark:group-hover:text-indigo-400" />
                  </div>
                  <span className="text-sm font-semibold group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                    {text}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {chatHistory.map((chat, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  chat.sender === "user" ? "flex-row-reverse" : "flex-row"
                } items-start animate-in fade-in slide-in-from-bottom-4 duration-500`}
              >
                <div className="shrink-0 mt-1">
                  {chat.sender === "user" ? (
                    <Avatar className="w-9 h-9 border-2 border-indigo-200 dark:border-indigo-900 shadow-md">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-indigo-600 text-white font-bold">
                        {user?.username?.[0]?.toUpperCase() || (
                          <User className="w-5 h-5" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-9 h-9 bg-indigo-600 dark:bg-indigo-500 border-2 border-white dark:border-zinc-900 rounded-full flex items-center justify-center shadow-lg transform -translate-y-1">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}
                </div>

                <div
                  className={`flex flex-col max-w-[85%] sm:max-w-[75%] space-y-1.5 ${chat.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`text-[10px] font-bold uppercase tracking-widest text-muted-foreground px-2 ${chat.sender === "user" ? "text-right" : "text-left"}`}
                  >
                    {chat.sender === "user"
                      ? user?.username || "You"
                      : "ReadHub AI"}
                  </div>
                  <Card
                    className={`py-0 gap-0 border-0 shadow-md ${
                      chat.sender === "user"
                        ? "bg-indigo-600 text-white rounded-2xl rounded-tr-none"
                        : "bg-white dark:bg-zinc-800 text-foreground rounded-2xl rounded-tl-none border border-zinc-100 dark:border-zinc-700"
                    }`}
                  >
                    <CardContent className="p-3.5 px-4 text-sm leading-relaxed overflow-hidden prose dark:prose-invert prose-sm max-w-none prose-p:m-0 prose-headings:m-0">
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
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex gap-3 items-start animate-in fade-in duration-300">
                <div className="w-9 h-9 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white dark:bg-zinc-800 rounded-2xl rounded-tl-none p-4 shadow-sm border border-zinc-100 dark:border-zinc-700">
                  <div className="flex gap-1.5 px-1 py-1">
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-auto px-2 pt-4 relative bg-background/80 backdrop-blur-md">
        <div className="bg-white dark:bg-zinc-800 border-2 border-zinc-100 dark:border-zinc-700 rounded-2xl p-2 shadow-2xl focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300">
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-100 dark:bg-zinc-800/50">
              <Sparkles className="w-5 h-5 text-indigo-500" />
            </div>
            <Input
              placeholder="Ask me anything..."
              value={userMessage}
              onChange={handleChange}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-2 h-11 text-base font-medium"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={loading || !userMessage.trim()}
              className="rounded-xl w-11 h-11 shrink-0 cursor-pointer shadow-xl bg-indigo-600 hover:bg-indigo-700 hover:scale-105 active:scale-95 text-white transition-all duration-200 disabled:opacity-50 disabled:scale-100"
            >
              <Send className="w-5 h-5 translate-x-0.5" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-3 uppercase tracking-widest font-bold opacity-60">
          Powered by Gemini
        </p>
      </div>
    </div>
  );
}
