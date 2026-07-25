"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Brain, MessageCircle, Send, X } from "lucide-react";
import { siteConfig } from "@/lib/content/site";
import { clsx } from "@/lib/clsx";

const WHATSAPP_LABEL = "Chat on WhatsApp";

// Static export has no server, so there's nowhere to run an actual
// Alcon-aware assistant from — that needs a real backend (a hosted LLM
// endpoint, a RAG service over Alcon's content, etc.) which nobody has
// configured yet. Rather than fake a knowledgeable reply, the panel says
// so plainly and hands off to WhatsApp/email. Set NEXT_PUBLIC_AI_AGENT_ENDPOINT
// to a real chat API (POST { message } -> { reply }) to light this up for
// real; until then this is a functional, honest placeholder, not a stub
// pretending to be more than it is.
const AI_AGENT_ENDPOINT = process.env.NEXT_PUBLIC_AI_AGENT_ENDPOINT ?? "";

type ChatMessage = { role: "user" | "assistant"; text: string };

export function FloatingWidgets() {
  const [aiOpen, setAiOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [sending, setSending] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

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

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");

    if (!AI_AGENT_ENDPOINT) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "This assistant isn't connected yet, so I can't answer that reliably — message us on WhatsApp or email and a real person will help.",
        },
      ]);
      return;
    }

    setSending(true);
    try {
      const response = await fetch(AI_AGENT_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: data.reply ?? "Sorry, something went wrong on our end.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Couldn't reach the assistant — try WhatsApp instead.",
        },
      ]);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3 sm:bottom-6 sm:right-6">
      {aiOpen && (
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Alcon AI Assistant"
          className="mb-1 w-[min(22rem,calc(100vw-2.5rem))] overflow-hidden rounded-[7px] border border-border bg-surface-elevated shadow-[0_30px_70px_-25px_rgba(0,0,0,0.9)]"
        >
          <div className="flex items-center justify-between gap-3 border-b border-border bg-surface px-4 py-3">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)]"
              >
                <Brain size={16} strokeWidth={1.75} className="text-white" />
              </span>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Alcon AI Assistant
                </p>
                <p className="text-[11px] text-text-secondary">
                  {AI_AGENT_ENDPOINT ? "Online" : "Not connected yet"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAiOpen(false)}
              aria-label="Close assistant"
              className="flex h-8 w-8 items-center justify-center rounded-[7px] text-text-secondary hover:text-text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
            >
              <X size={16} strokeWidth={1.75} />
            </button>
          </div>

          <div className="max-h-72 min-h-32 overflow-y-auto px-4 py-3">
            {messages.length === 0 ? (
              <p className="text-sm text-text-secondary">
                Ask about Alcon&apos;s services, process, or past work.
                {!AI_AGENT_ENDPOINT &&
                  " (This assistant isn't wired to a live backend in this build — see NEXT_PUBLIC_AI_AGENT_ENDPOINT in the README.)"}
              </p>
            ) : (
              <ul className="space-y-2.5">
                {messages.map((message, i) => (
                  <li
                    key={i}
                    className={clsx(
                      "max-w-[85%] rounded-[7px] px-3 py-2 text-sm",
                      message.role === "user"
                        ? "ml-auto bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] text-text-primary"
                        : "bg-surface text-text-secondary"
                    )}
                  >
                    {message.text}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex items-center gap-2 border-t border-border p-3"
          >
            <label htmlFor="ai-agent-input" className="sr-only">
              Message the Alcon AI Assistant
            </label>
            <input
              id="ai-agent-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask a question…"
              className="min-h-11 flex-1 rounded-[7px] border border-border bg-surface px-3 text-sm text-text-primary placeholder:text-text-secondary/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
            />
            <button
              type="submit"
              disabled={sending || !input.trim()}
              aria-label="Send message"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[7px] bg-[linear-gradient(110deg,#2870FF_0%,#7138FF_52%,#D12DFF_100%)] text-text-primary transition hover:brightness-110 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
            >
              <Send size={16} strokeWidth={1.75} />
            </button>
          </form>
        </div>
      )}

      <a
        href={siteConfig.contact.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={WHATSAPP_LABEL}
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.6)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
        style={{ height: "3.25rem", width: "3.25rem" }}
      >
        <MessageCircle size={24} strokeWidth={1.75} aria-hidden />
      </a>

      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="dialog"
        aria-expanded={aiOpen}
        aria-label={
          aiOpen ? "Close Alcon AI Assistant" : "Open Alcon AI Assistant"
        }
        onClick={() => setAiOpen((v) => !v)}
        className="relative flex items-center justify-center rounded-full bg-surface-elevated text-cyan-accent shadow-[0_12px_30px_-8px_rgba(22,199,255,0.5)] transition hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-accent"
        style={{ height: "3.25rem", width: "3.25rem" }}
      >
        {/* Glowing echo rings — decorative, hidden from assistive tech. */}
        <span
          aria-hidden
          className="absolute inset-0 animate-ping rounded-full bg-cyan-accent/25"
          style={{ animationDuration: "2.4s" }}
        />
        <span
          aria-hidden
          className="absolute inset-0 rounded-full ring-1 ring-cyan-accent/40"
        />
        <Brain size={24} strokeWidth={1.75} aria-hidden className="relative" />
      </button>
    </div>
  );
}
