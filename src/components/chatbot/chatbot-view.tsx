"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeExternalLinks from "rehype-external-links";
import { formatDistanceToNow } from "date-fns";
import {
  Bot,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  History,
  MessageSquarePlus,
  RotateCcw,
  Search,
  Send,
  Square,
  ThumbsDown,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Item, ItemContent, ItemDescription, ItemGroup, ItemMedia, ItemTitle } from "@/components/ui/item";
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "@/components/ui/input-group";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolTip from "../ui/custom/tooltip";
import { suggestions } from "@/constants";
import { useChat } from "@/lib/hooks/useChat";
import { useUserStore } from "@/lib/store/userStore";
import { cn, linkCitations, safeHttpUrl } from "@/lib/utils";
import { ChatMessagesSkeleton, ChatSkeleton } from "@/components/misc/skeletons";
import { AgentEvent, ChatMessage, ChatSourceReference } from "@/types";

// Older messages stored a text log instead of structured events.
const legacyEvents = (thoughts: string[] = []): AgentEvent[] =>
  thoughts.map((thought) => ({ type: /Action|Invoking/.test(thought) ? "tool_call" : "status", message: thought.replace(/^[^\w]*(Strategy|Action):\s*/u, "") }));

function ActivityLog({ events, active, latency }: { events: AgentEvent[]; active: boolean; latency?: string }) {
  const [open, setOpen] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const steps = events.filter((event) => event.type === "tool_call" || event.type === "tool_result" || active);

  useEffect(() => {
    if (!active) return;
    const started = Date.now();
    const timer = setInterval(() => setElapsed((Date.now() - started) / 1000), 200);
    return () => clearInterval(timer);
  }, [active]);

  if (!active && steps.length === 0) return null;
  const current = events[events.length - 1]?.message;

  return (
    <Collapsible open={open || active} onOpenChange={setOpen} className="mb-2 w-full max-w-2xl">
      <CollapsibleTrigger
        disabled={active || steps.length === 0}
        className="flex items-center gap-2 rounded-full px-1 py-1 text-xs text-muted-foreground hover:text-foreground disabled:cursor-default"
      >
        {active ? <Spinner className="size-3.5 text-primary" /> : <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />}
        <span className="font-medium">{active ? current || "Thinking" : `Researched in ${latency || "—"}s`}</span>
        {active && <span className="tabular-nums">{elapsed.toFixed(1)}s</span>}
        {!active && steps.length > 0 && <ChevronDown className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`} />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ol className="ml-[7px] mt-1 space-y-1.5 border-l pl-4 text-xs text-muted-foreground">
          {steps.map((event, index) => (
            <li key={index} className="flex items-start gap-2">
              {event.type === "tool_call" ? <Search className="mt-0.5 h-3 w-3 shrink-0 text-primary" /> : <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground/50" />}
              <span>{event.message}</span>
            </li>
          ))}
        </ol>
      </CollapsibleContent>
    </Collapsible>
  );
}

function SourceList({ sources, idPrefix }: { sources: ChatSourceReference[]; idPrefix: string }) {
  const safeSources = sources.flatMap((source) => {
    const url = safeHttpUrl(source.url);
    return url ? [{ ...source, href: url.toString(), host: url.hostname.replace(/^www\./, "") }] : [];
  });
  if (safeSources.length === 0) return null;

  return (
    <section aria-label="Sources" className="mt-3 w-full max-w-2xl">
      <p className="mb-2 px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Sources</p>
      <div className="grid gap-2 sm:grid-cols-2">
        {safeSources.map((source) => (
          <a
            key={`${source.citationNumber}-${source.href}`}
            id={`${idPrefix}-${source.citationNumber}`}
            href={source.href}
            target="_blank"
            rel="noopener noreferrer"
            className="group scroll-mt-24 rounded-xl border bg-card px-3 py-2.5 text-left transition-colors hover:border-primary/50 target:ring-2 target:ring-primary"
          >
            <span className="mb-0.5 flex items-center justify-between gap-2 text-[11px]">
              <span className="truncate font-semibold text-primary">[{source.citationNumber}] {source.publisher || source.host}</span>
              <span className="shrink-0 text-muted-foreground">{source.host}</span>
            </span>
            <span className="line-clamp-2 text-xs font-medium leading-snug group-hover:text-primary">{source.title}</span>
          </a>
        ))}
      </div>
    </section>
  );
}

function BotMessage({
  chat,
  index,
  isLast,
  loading,
  onRegenerate,
  onFeedback,
}: {
  chat: ChatMessage;
  index: number;
  isLast: boolean;
  loading: boolean;
  onRegenerate: () => void;
  onFeedback: (messageId: string, rating: "helpful" | "not_helpful") => void;
}) {
  const [copied, setCopied] = useState(false);
  const active = loading && isLast;
  const sources = chat.sources || [];
  const anchor = `message-${index}-source`;
  const events = chat.events?.length ? chat.events : legacyEvents(chat.thoughts);

  const copy = () => {
    void navigator.clipboard.writeText(chat.message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }).catch(() => undefined);
  };

  return (
    <div className="flex w-full flex-col items-start">
      <ActivityLog events={events} active={active} latency={chat.latency} />
      {chat.message && (
        <div className={`w-full max-w-2xl rounded-2xl border px-5 py-4 ${chat.status === "error" ? "border-destructive/40 bg-destructive/5" : "bg-card"}`}>
          <div className="prose prose-sm max-w-none dark:prose-invert sm:prose-base prose-p:my-2 prose-headings:mt-4 prose-headings:mb-2 prose-li:my-0.5">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[[rehypeExternalLinks, { target: "_blank", rel: ["noopener", "noreferrer"] }]]}
              components={{
                a: ({ href, children, target, rel }) =>
                  href?.startsWith(`#${anchor}-`) ? (
                    <a href={href} aria-label={`Source ${children}`} className="font-semibold text-primary no-underline hover:underline">[{children}]</a>
                  ) : (
                    <a href={href} target={target} rel={rel}>{children}</a>
                  ),
              }}
            >
              {linkCitations(chat.message, sources.map((source) => source.citationNumber), anchor)}
            </ReactMarkdown>
          </div>
        </div>
      )}
      <SourceList sources={sources} idPrefix={anchor} />

      {chat.message && !active && (
        <div className="mt-1.5 flex items-center gap-0.5">
          <ToolTip content={copied ? "Copied" : "Copy"}>
            <Button variant="ghost" size="icon-sm" onClick={copy} aria-label="Copy response" className="rounded-full text-muted-foreground">
              {copied ? <Check className="size-3.5 text-emerald-600" /> : <Copy className="size-3.5" />}
            </Button>
          </ToolTip>
          {isLast && (
            <ToolTip content="Regenerate">
              <Button variant="ghost" size="icon-sm" onClick={onRegenerate} aria-label="Regenerate response" className="rounded-full text-muted-foreground">
                <RotateCcw className="size-3.5" />
              </Button>
            </ToolTip>
          )}
          {chat._id && chat.status !== "error" && (
            <>
              <ToolTip content="Helpful">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onFeedback(chat._id!, "helpful")}
                  aria-pressed={chat.feedback === "helpful"}
                  aria-label="Helpful"
                  className={cn("rounded-full", chat.feedback === "helpful" ? "text-emerald-600" : "text-muted-foreground")}
                >
                  <ThumbsUp className={cn("size-3.5", chat.feedback === "helpful" && "fill-current")} />
                </Button>
              </ToolTip>
              <ToolTip content="Not helpful">
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => onFeedback(chat._id!, "not_helpful")}
                  aria-pressed={chat.feedback === "not_helpful"}
                  aria-label="Not helpful"
                  className={cn("rounded-full", chat.feedback === "not_helpful" ? "text-rose-600" : "text-muted-foreground")}
                >
                  <ThumbsDown className={cn("size-3.5", chat.feedback === "not_helpful" && "fill-current")} />
                </Button>
              </ToolTip>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export const ChatbotView = () => {
  const status = useUserStore((state) => state.status);
  const user = useUserStore((state) => state.user);
  const isAuthenticated = status === "authenticated";
  const chat = useChat(isAuthenticated);
  const [draft, setDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // App-like layout: the chat owns the viewport, so hide the site footer.
  useEffect(() => {
    const footer = document.querySelector("footer");
    const previousOverflow = document.body.style.overflow;
    if (footer) footer.hidden = true;
    document.body.style.overflow = "hidden";
    return () => {
      if (footer) footer.hidden = false;
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const lastMessage = chat.messages[chat.messages.length - 1];
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chat.messages.length, lastMessage?.message, lastMessage?.events?.length]);

  // Grow the composer with its content, up to a cap.
  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;
    input.style.height = "auto";
    input.style.height = `${Math.min(input.scrollHeight, 160)}px`;
  }, [draft]);

  const submit = () => {
    if (!draft.trim() || chat.loading) return;
    void chat.send(draft);
    setDraft("");
  };

  if (status === "loading") return <ChatSkeleton />;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
        <span className="mb-4 rounded-full bg-muted p-5"><Bot className="h-8 w-8" aria-hidden="true" /></span>
        <h1 className="mb-2 text-2xl font-bold">AI Assistant</h1>
        <p className="mb-6 max-w-sm text-sm text-muted-foreground">
          Sign in to ask about current news with cited sources, get context on a story, or find your next book.
        </p>
        <Button asChild className="rounded-full px-8"><Link href="/login?next=/chatbot">Sign in to continue</Link></Button>
        <Link href="/register" className="mt-4 text-sm font-medium text-primary underline-offset-4 hover:underline">Create a free account</Link>
      </div>
    );
  }

  return (
    <div className="mx-auto flex h-[calc(100svh-4rem)] max-w-4xl flex-col px-4">
      <div className="flex items-center justify-between gap-2 py-3">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground">
              <History className="h-4 w-4" /> History
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="max-h-96 w-72 overflow-y-auto">
            <DropdownMenuLabel>Recent conversations</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {chat.sessions.length === 0 ? (
              <p className="px-2 py-3 text-sm text-muted-foreground">No saved conversations yet.</p>
            ) : (
              chat.sessions.map((session) => (
                <DropdownMenuItem
                  key={session.sessionId}
                  onSelect={() => void chat.openSession(session.sessionId)}
                  className={`group flex items-start justify-between gap-2 ${session.sessionId === chat.sessionId ? "bg-accent" : ""}`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-sm">{session.title || "Untitled"}</span>
                    <span className="block text-xs text-muted-foreground">{formatDistanceToNow(new Date(session.updatedAt), { addSuffix: true })}</span>
                  </span>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    aria-label={`Delete conversation: ${session.title}`}
                    onClick={(event) => {
                      event.stopPropagation();
                      event.preventDefault();
                      void chat.deleteSession(session.sessionId);
                    }}
                    className="text-muted-foreground opacity-60 hover:bg-destructive/10 hover:text-destructive group-hover:opacity-100"
                  >
                    <Trash2 className="size-3.5" />
                  </Button>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <Button variant="ghost" size="sm" onClick={chat.newChat} disabled={chat.messages.length === 0 && !chat.sessionId} className="gap-2 text-muted-foreground">
          <MessageSquarePlus className="h-4 w-4" /> New chat
        </Button>
      </div>

      <div ref={scrollRef} className="min-h-0 flex-1 overflow-y-auto pb-6">
        {chat.historyLoading ? (
          <div role="status" aria-label="Loading conversation"><ChatMessagesSkeleton /></div>
        ) : chat.messages.length === 0 ? (
          <div className="flex min-h-full flex-col items-center justify-center gap-8 py-8 text-center">
            <div className="space-y-3">
              <h1 className="text-3xl font-black tracking-tight sm:text-5xl">Hello, {user?.username || "there"}</h1>
              <p className="mx-auto max-w-md text-sm text-muted-foreground">
                Ask about a current story and get an answer with sources, or tell me what you like to read.
              </p>
            </div>
            <ItemGroup className="grid w-full grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestions.map((suggestion) => (
                <Item key={suggestion.label} variant="outline" size="sm" asChild className="bg-card text-left hover:border-foreground/30">
                  <button type="button" onClick={() => void chat.send(suggestion.query)}>
                    <ItemMedia variant="icon" className="text-lg" aria-hidden="true">{suggestion.icon}</ItemMedia>
                    <ItemContent className="min-w-0">
                      <ItemTitle className="text-xs">{suggestion.label}</ItemTitle>
                      <ItemDescription className="truncate text-xs">{suggestion.query}</ItemDescription>
                    </ItemContent>
                  </button>
                </Item>
              ))}
            </ItemGroup>
          </div>
        ) : (
          <div className="space-y-6 pt-2">
            {chat.messages.map((message, index) =>
              message.sender === "user" ? (
                <div key={index} className="flex items-end justify-end gap-2">
                  <div className="max-w-[85%] whitespace-pre-wrap rounded-2xl bg-primary px-4 py-2.5 text-sm text-primary-foreground sm:text-base">
                    {message.message}
                  </div>
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar} alt="" />
                    <AvatarFallback className="text-xs">{user?.username?.[0]?.toUpperCase() || "U"}</AvatarFallback>
                  </Avatar>
                </div>
              ) : (
                <BotMessage
                  key={index}
                  chat={message}
                  index={index}
                  isLast={index === chat.messages.length - 1}
                  loading={chat.loading}
                  onRegenerate={chat.regenerate}
                  onFeedback={(id, rating) => void chat.submitFeedback(id, rating)}
                />
              ),
            )}
          </div>
        )}
      </div>

      <div className="pb-4 pt-2">
        <p className="sr-only" role="status" aria-live="polite">{chat.loading ? "ReadHub is researching your question." : ""}</p>
        <form
          onSubmit={(event) => {
            event.preventDefault();
            submit();
          }}
        >
          <InputGroup className="h-auto items-end rounded-2xl border-2 bg-card p-1">
          <InputGroupTextarea
            ref={inputRef}
            rows={1}
            value={draft}
            maxLength={4000}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault();
                submit();
              }
            }}
            placeholder="Ask about the news or books…"
            aria-label="Message the assistant"
            className="max-h-40 min-h-11 px-3 py-2.5 text-base md:text-base"
          />
          <InputGroupAddon align="inline-end" className="self-end pb-0.5 pr-0.5">
            {chat.loading ? (
              <InputGroupButton variant="outline" onClick={chat.stop} aria-label="Stop generating" className="size-11 rounded-xl p-0">
                <Square className="size-4 fill-current" />
              </InputGroupButton>
            ) : (
              <InputGroupButton type="submit" variant="default" disabled={!draft.trim()} aria-label="Send message" className="size-11 rounded-xl p-0">
                <Send className="size-4" />
              </InputGroupButton>
            )}
          </InputGroupAddon>
          </InputGroup>
        </form>
        <p className="mt-2 text-center text-[11px] text-muted-foreground">AI can make mistakes. Check important facts against the cited sources.</p>
      </div>
    </div>
  );
};

export default ChatbotView;
