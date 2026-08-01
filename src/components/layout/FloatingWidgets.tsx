"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { ArrowRight, Brain, Mail, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { siteConfig } from "@/lib/content/site";
import { clsx } from "@/lib/clsx";

const AI_AGENT_ENDPOINT = process.env.NEXT_PUBLIC_AI_AGENT_ENDPOINT ?? "";
const WHATSAPP_LABEL = "Chat on WhatsApp";

type ChatMessage = { role: "user" | "assistant"; text: string };

const QUICK_PROMPTS = [
  "Which service fits?",
  "How fast can we start?",
  "Build a project stack",
  "Show client work",
];

const WELCOME: ChatMessage = {
  role: "assistant",
  text: "Tell me what you are building. I can shape the right Alcon service mix, explain the process, and point you to the fastest next step.",
};

function getStudioReply(message: string) {
  const text = message.toLowerCase();

  if (/brand|identity|logo|position/.test(text)) {
    return "Start with Brand Strategy + Identity. We define the position, audience, verbal direction, and visual system first—then extend it into the touchpoints your launch actually needs.";
  }
  if (/website|web |ui|ux|platform|app|product/.test(text)) {
    return "For a digital build, the strongest stack is UX direction, interface design, responsive development, and launch support. If it is a platform, we begin with workflows and user priorities before visual design.";
  }
  if (/motion|video|animation|film/.test(text)) {
    return "Motion works best when the idea is clear before production. We can combine concept, script, art direction, animation, edit, and rollout versions into one production path.";
  }
  if (/social|campaign|content|marketing/.test(text)) {
    return "For ongoing attention, combine campaign strategy, a flexible creative system, content production, and channel-ready adaptations. That keeps the work recognisable without becoming repetitive.";
  }
  if (/white.?label|agency|partner|overflow/.test(text)) {
    return "Alcon can work quietly behind your agency as a white-label creative and production partner—scoped for a single delivery or set up as ongoing capacity.";
  }
  if (/timeline|how fast|start|how long|when/.test(text)) {
    return "A focused project can usually move into discovery quickly once scope, stakeholders, and timing are clear. Share your target date in the quote builder and the studio can recommend a realistic launch path.";
  }
  if (/budget|cost|price|quote|aed/.test(text)) {
    return "The best estimate depends on the outcome, number of deliverables, and launch window. The quote builder takes about two minutes and sends the studio the details needed for a useful response.";
  }
  if (/work|portfolio|client|case stud/.test(text)) {
    return "The Clients area now shows live platforms and websites with real project covers. Open any card to experience the deployed work, not a mockup.";
  }

  return "A strong starting point is to define the business goal, audience, must-have deliverables, and launch date. Add those four things to the quote builder and Alcon can shape the right team and service mix.";
}

export function FloatingWidgets() {
  const [aiOpen, setAiOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [sending, setSending] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!aiOpen) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setAiOpen(false);
        triggerRef.current?.focus();
      }
    }
    function onPointerDown(event: MouseEvent) {
      if (
        panelRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !triggerRef.current?.contains(event.target as Node)
      ) {
        setAiOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("mousedown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("mousedown", onPointerDown);
    };
  }, [aiOpen]);

  useEffect(() => {
    if (aiOpen) messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [aiOpen, messages]);

  async function sendMessage(rawMessage: string) {
    const text = rawMessage.trim();
    if (!text || sending) return;

    setMessages((previous) => [...previous, { role: "user", text }]);
    setInput("");
    setSending(true);

    if (!AI_AGENT_ENDPOINT) {
      await new Promise((resolve) => window.setTimeout(resolve, 520));
      setMessages((previous) => [
        ...previous,
        { role: "assistant", text: getStudioReply(text) },
      ]);
      setSending(false);
      return;
    }

    try {
      const response = await fetch(AI_AGENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!response.ok) throw new Error("Assistant unavailable");
      const data = (await response.json()) as { reply?: string };
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: data.reply ?? getStudioReply(text),
        },
      ]);
    } catch {
      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          text: `${getStudioReply(text)} If you want a studio response now, use WhatsApp below.`,
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void sendMessage(input);
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {aiOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Alcon Creative Concierge"
          className="mb-1 flex max-h-[min(720px,calc(100svh-7rem))] w-[min(26rem,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-white/10 bg-[#08090d]/95 shadow-[0_35px_100px_-30px_rgba(0,0,0,0.95),0_0_50px_-25px_rgba(22,199,255,0.7)] backdrop-blur-2xl"
        >
          <div className="relative overflow-hidden border-b border-white/10 px-4 py-4">
            <div aria-hidden className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(22,199,255,0.22),transparent_48%),radial-gradient(circle_at_90%_100%,rgba(209,45,255,0.18),transparent_42%)]" />
            <div className="relative flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#16C7FF_0%,#7138FF_52%,#D12DFF_100%)] shadow-[0_0_28px_-8px_rgba(22,199,255,0.8)]">
                  <Brain size={21} strokeWidth={1.65} className="text-white" aria-hidden />
                  <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-[#08090d] bg-emerald-400" />
                </span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-heading text-sm font-medium text-text-primary">Alcon Creative Concierge</p>
                    <span className="rounded-full border border-cyan-accent/25 bg-cyan-accent/10 px-2 py-0.5 font-mono text-[8px] uppercase tracking-[0.14em] text-cyan-accent">AI-guided</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-text-secondary">
                    <Sparkles size={11} aria-hidden className="text-fuchsia-400" />
                    {AI_AGENT_ENDPOINT ? "Live studio intelligence" : "Instant guidance · human handoff"}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setAiOpen(false)}
                aria-label="Close creative concierge"
                className="flex h-9 w-9 items-center justify-center rounded-lg text-text-secondary transition hover:bg-white/5 hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
              >
                <X size={17} strokeWidth={1.75} />
              </button>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4">
            <ul className="space-y-3" aria-live="polite">
              {messages.map((message, index) => (
                <li
                  key={`${message.role}-${index}`}
                  className={clsx(
                    "max-w-[88%] rounded-2xl px-3.5 py-3 text-sm leading-6",
                    message.role === "user"
                      ? "ml-auto rounded-br-md bg-[linear-gradient(120deg,#2870FF_0%,#7138FF_55%,#B22DFF_100%)] text-white"
                      : "rounded-bl-md border border-white/8 bg-white/[0.045] text-text-secondary"
                  )}
                >
                  {message.text}
                </li>
              ))}
              {sending && (
                <li className="flex w-fit items-center gap-1.5 rounded-2xl rounded-bl-md border border-white/8 bg-white/[0.045] px-4 py-3" aria-label="Concierge is thinking">
                  {[0, 1, 2].map((dot) => (
                    <span key={dot} className="h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-accent" style={{ animationDelay: `${dot * 140}ms` }} />
                  ))}
                </li>
              )}
            </ul>
            <div ref={messageEndRef} />

            {messages.length < 4 && (
              <div className="mt-4 grid grid-cols-2 gap-2">
                {QUICK_PROMPTS.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    disabled={sending}
                    onClick={() => void sendMessage(prompt)}
                    className="rounded-xl border border-white/10 bg-white/[0.025] px-3 py-2 text-left text-[11px] leading-4 text-text-secondary transition hover:border-cyan-accent/35 hover:bg-cyan-accent/[0.06] hover:text-text-primary disabled:opacity-50"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="border-t border-white/10 p-3">
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] p-1.5 focus-within:border-cyan-accent/45">
              <label htmlFor="ai-agent-input" className="sr-only">Message the Alcon Creative Concierge</label>
              <input
                id="ai-agent-input"
                type="text"
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="What are you looking to create?"
                className="min-h-10 min-w-0 flex-1 bg-transparent px-2.5 text-sm text-text-primary placeholder:text-text-secondary/55 focus:outline-none"
              />
              <button
                type="submit"
                disabled={sending || !input.trim()}
                aria-label="Send message"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[linear-gradient(120deg,#2870FF_0%,#7138FF_55%,#D12DFF_100%)] text-white transition hover:brightness-110 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
              >
                <Send size={16} strokeWidth={1.75} />
              </button>
            </div>
          </form>

          <div className="grid grid-cols-3 border-t border-white/10 bg-black/20">
            <Link href="/get-quote" onClick={() => setAiOpen(false)} className="flex min-h-11 items-center justify-center gap-1.5 border-r border-white/10 px-2 text-[10px] font-medium text-text-secondary transition hover:bg-white/[0.04] hover:text-cyan-accent">
              Build quote <ArrowRight size={12} aria-hidden />
            </Link>
            <a href={siteConfig.contact.whatsapp} target="_blank" rel="noopener noreferrer" className="flex min-h-11 items-center justify-center gap-1.5 border-r border-white/10 px-2 text-[10px] font-medium text-text-secondary transition hover:bg-white/[0.04] hover:text-[#25D366]">
              <MessageCircle size={12} aria-hidden /> WhatsApp
            </a>
            <a href={`mailto:${siteConfig.contact.email}`} className="flex min-h-11 items-center justify-center gap-1.5 px-2 text-[10px] font-medium text-text-secondary transition hover:bg-white/[0.04] hover:text-fuchsia-400">
              <Mail size={12} aria-hidden /> Email
            </a>
          </div>
        </div>
      )}

      <a
        href={siteConfig.contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={WHATSAPP_LABEL}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition hover:scale-105 hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
        style={{ height: "3.25rem", width: "3.25rem" }}
      >
        <MessageCircle size={24} strokeWidth={1.75} aria-hidden />
      </a>

      <div className="group relative flex items-center">
        <span className="pointer-events-none absolute right-[calc(100%+0.75rem)] whitespace-nowrap rounded-lg border border-white/10 bg-black/85 px-3 py-2 text-xs text-text-primary opacity-0 shadow-xl backdrop-blur-md transition group-hover:opacity-100">Ask Alcon AI</span>
        <button
          ref={triggerRef}
          type="button"
          aria-haspopup="dialog"
          aria-expanded={aiOpen}
          aria-label={aiOpen ? "Close Alcon Creative Concierge" : "Open Alcon Creative Concierge"}
          onClick={() => setAiOpen((value) => !value)}
          className="relative flex items-center justify-center rounded-full bg-[#0c0f15] text-cyan-accent shadow-[0_12px_35px_-8px_rgba(22,199,255,0.6)] transition hover:scale-105 hover:brightness-125 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
          style={{ height: "3.25rem", width: "3.25rem" }}
        >
          <span aria-hidden className="absolute inset-0 animate-ping rounded-full bg-cyan-accent/20" style={{ animationDuration: "2.8s" }} />
          <span aria-hidden className="absolute inset-0 rounded-full ring-1 ring-cyan-accent/45" />
          <Brain size={24} strokeWidth={1.65} aria-hidden className="relative" />
          <span className="absolute -right-1 -top-1 rounded-full border-2 border-[#08090d] bg-[linear-gradient(120deg,#2870FF,#D12DFF)] px-1.5 py-0.5 font-mono text-[7px] uppercase tracking-wide text-white">AI</span>
        </button>
      </div>
    </div>
  );
}
