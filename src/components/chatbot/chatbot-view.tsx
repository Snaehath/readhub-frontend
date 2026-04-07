"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeExternalLinks from "rehype-external-links";
import { suggestions } from "@/constants";
import { useChat } from "@/lib/hooks/useChat";
import { Send, Bot, Trash2, Sparkles, Lock, MessageSquare } from "lucide-react";
import Link from "next/link";
import { useUserStore } from "@/lib/store/userStore";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import Typography from "@/components/ui/custom/typography";

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
      <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
        <div className="bg-zinc-100 dark:bg-zinc-900 p-6 rounded-full mb-4 relative group">
          <Lock className="w-8 h-8 text-black dark:text-white relative z-10" />
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

              <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 px-2 lg:px-6">
                {suggestions.map((text, i) => (
                  <button
                    key={i}
                    className="group relative flex items-center text-left p-6 rounded-3xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-sm hover:border-black dark:hover:border-white transition-all duration-300 cursor-pointer overflow-hidden"
                    onClick={() => sendMessage(text)}
                    disabled={loading}
                  >
                    <div className="w-12 h-12 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mr-5 group-hover:bg-black dark:group-hover:bg-white transition-all duration-300">
                      <MessageSquare className="w-6 h-6 text-zinc-400 group-hover:text-white dark:group-hover:text-black transition-colors" />
                    </div>
                    <Typography
                      variant="small"
                      className="text-[11px] font-black uppercase tracking-widest text-zinc-400 group-hover:text-black dark:group-hover:text-white transition-colors line-clamp-2"
                    >
                      {text}
                    </Typography>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-12">
              {chatHistory.map((chat, idx) => (
                <div
                  key={idx}
                  className={`flex gap-4 ${
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
                    className={`flex flex-col max-w-[85%] sm:max-w-[80%] space-y-2 ${chat.sender === "user" ? "items-end text-right" : "items-start text-left"}`}
                  >
                    <Typography
                      variant="muted"
                      className="text-[10px] font-black uppercase tracking-[0.3em] px-3 opacity-40"
                    >
                      {chat.sender === "user"
                        ? user?.username || "Operative"
                        : "AI Assistant"}
                    </Typography>

                    <div
                      className={`relative group p-[1px] rounded-[1.8rem] overflow-hidden ${
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
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex gap-4 items-end animate-in fade-in duration-300">
                  <div className="w-10 h-10 bg-zinc-100 dark:bg-zinc-800 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl flex items-center justify-center shadow-md animate-pulse">
                    <Bot className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div className="bg-zinc-50 dark:bg-zinc-900/10 rounded-[1.5rem] rounded-bl-none p-5 shadow-sm border border-zinc-100 dark:border-zinc-800">
                    <div className="flex gap-2">
                      <span className="w-2 h-2 bg-zinc-800 dark:bg-zinc-200 rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-2 h-2 bg-zinc-800 dark:bg-zinc-200 rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-2 h-2 bg-zinc-800 dark:bg-zinc-200 rounded-full animate-bounce" />
                    </div>
                  </div>
                </div>
              )}
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
                placeholder="Submit inquiry..."
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
