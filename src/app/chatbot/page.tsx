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
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-5xl mx-auto p-4 sm:p-6 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b">
        <div className="flex items-center gap-3">
          <div className="bg-primary/10 p-2.5 rounded-xl">
            <Bot className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              ReadHub Assistant
            </h1>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={clearChat}
          disabled={loading || chatHistory.length === 0}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-full cursor-pointer transition-colors"
          title="Clear Conversation"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Clear
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-2 space-y-6 pb-8 custom-scrollbar">
        {chatHistory.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-8 py-12">
            <div className="relative">
              <div className="absolute -inset-4 bg-indigo-500/10 blur-2xl rounded-full" />
              <Bot className="w-20 h-20 text-indigo-500 relative" />
              <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-yellow-500 animate-bounce" />
            </div>
            <div className="max-w-md space-y-3">
              <h2 className="text-2xl font-bold">
                Hello {user?.username || "Reader"}!
              </h2>
              <p className="text-muted-foreground">
                I&apos;m your ReadHub AI. I can help you summarize news, recommend
                books, or answer questions about what we offer.
              </p>
            </div>

            <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6">
              {suggestions.map((text, i) => (
                <button
                  key={i}
                  className="group flex items-center text-left p-4 rounded-xl border bg-card hover:border-primary hover:shadow-md transition-all cursor-pointer"
                  onClick={() => sendMessage(text)}
                  disabled={loading}
                >
                  <MessageSquare className="w-4 h-4 mr-3 text-muted-foreground group-hover:text-primary shrink-0" />
                  <span className="text-sm font-medium group-hover:text-primary line-clamp-2">
                    {text}
                  </span>
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
                } items-start animate-in fade-in slide-in-from-bottom-2 duration-300`}
              >
                <div className="shrink-0 mt-1">
                  {chat.sender === "user" ? (
                    <Avatar className="w-8 h-8 border shadow-sm">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback className="bg-indigo-100 text-indigo-600 text-xs">
                        {user?.username?.[0]?.toUpperCase() || (
                          <User className="w-4 h-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                  ) : (
                    <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 border rounded-full flex items-center justify-center shadow-sm">
                      <Bot className="w-5 h-5 text-indigo-500" />
                    </div>
                  )}
                </div>

                <div
                  className={`flex flex-col max-w-[80%] space-y-1 ${chat.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <Card
                    className={`py-0 gap-0 ${
                      chat.sender === "user"
                        ? "bg-indigo-600 text-white border-0 shadow-lg rounded-2xl rounded-tr-none"
                        : "bg-zinc-100 dark:bg-zinc-800 text-foreground border-0 shadow-sm rounded-2xl rounded-tl-none"
                    }`}
                  >
                    <CardContent className="p-2.5 px-3.5 text-sm overflow-hidden prose dark:prose-invert prose-sm max-w-none prose-p:m-0 prose-headings:m-0">
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
                <div className="w-8 h-8 bg-zinc-100 dark:bg-zinc-800 border rounded-full flex items-center justify-center shadow-sm">
                  <Bot className="w-5 h-5 text-indigo-500" />
                </div>
                <div className="bg-zinc-100 dark:bg-zinc-800 rounded-2xl rounded-tl-none p-3 px-4 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="mt-auto pt-4 relative">
        <div className="bg-card border rounded-2xl p-2 shadow-xl focus-within:ring-2 focus-within:ring-primary/20 transition-all">
          <div className="flex items-center gap-2">
            <Input
              placeholder="Ask me anything..."
              value={userMessage}
              onChange={handleChange}
              disabled={loading}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 px-4 h-11"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={loading || !userMessage.trim()}
              className="rounded-xl w-10 h-10 shrink-0 cursor-pointer shadow-md bg-indigo-600 hover:bg-indigo-700 text-white transition-all disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-2">
          ReadHub AI can occasionally provide inaccurate information. Always
          verify important news.
        </p>
      </div>
    </div>
  );
}
