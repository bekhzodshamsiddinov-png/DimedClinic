import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X, Sparkles } from "lucide-react";
import { DICT, type Lang } from "./content";
import { localAnswer } from "./kb";
import { API_BASE } from "./config";

type Msg = { role: "user" | "assistant"; content: string };

export function ChatWidget({ lang, open, setOpen }: { lang: Lang; open: boolean; setOpen: (v: boolean) => void }) {
  const t = DICT[lang].chat;
  const [msgs, setMsgs] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" });
  }, [msgs, typing, open]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  async function send(text: string) {
    const q = text.trim();
    if (!q || typing) return;
    const next: Msg[] = [...msgs, { role: "user", content: q }];
    setMsgs(next);
    setInput("");
    setTyping(true);
    let answer = "";
    try {
      const ctrl = new AbortController();
      const timer = setTimeout(() => ctrl.abort(), 20000);
      const r = await fetch(`${API_BASE}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next.slice(-12), lang }),
        signal: ctrl.signal,
      });
      clearTimeout(timer);
      if (r.ok) {
        const data = await r.json();
        answer = (data.reply || "").trim();
      }
    } catch {
      /* zaxira javobga o'tamiz */
    }
    if (!answer) {
      await new Promise((res) => setTimeout(res, 500));
      answer = localAnswer(q, lang);
    }
    setMsgs((m) => [...m, { role: "assistant", content: answer }]);
    setTyping(false);
  }

  return (
    <>
      {/* Panel */}
      <div
        className={`fixed z-50 bottom-24 right-4 sm:right-6 w-[calc(100vw-2rem)] sm:w-[400px] max-h-[min(640px,calc(100vh-8rem))] flex flex-col overflow-hidden rounded-3xl bg-white shadow-[0_24px_80px_-12px_rgba(17,17,17,0.35)] ring-1 ring-black/5 origin-bottom-right transition-all duration-300 ${
          open ? "opacity-100 scale-100 translate-y-0" : "pointer-events-none opacity-0 scale-95 translate-y-4"
        }`}
        role="dialog"
        aria-label={t.title}
      >
        <div className="relative overflow-hidden bg-gradient-to-br from-[#E30613] to-[#7A0008] px-5 py-4 text-white">
          <div className="absolute -right-10 -top-10 h-32 w-32 rotate-12 bg-white/10" />
          <div className="absolute right-10 -bottom-12 h-24 w-48 -rotate-12 bg-black/10" />
          <div className="relative flex items-center gap-3">
            <div className="relative grid h-11 w-11 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/25">
              <Bot className="h-6 w-6" />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#B5040F]" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-[15px] font-semibold leading-tight">{t.title}</p>
              <p className="truncate text-xs text-white/80">{t.status}</p>
            </div>
            <button onClick={() => setOpen(false)} className="grid h-9 w-9 place-items-center rounded-xl hover:bg-white/15 transition" aria-label="Close">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto bg-[#F6F6F7] px-4 py-5 min-h-[280px]">
          <Bubble role="assistant" content={t.hello} />
          {msgs.map((m, i) => (
            <Bubble key={i} role={m.role} content={m.content} />
          ))}
          {typing && (
            <div className="flex items-end gap-2">
              <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#E30613] text-white"><Sparkles className="h-3.5 w-3.5" /></div>
              <div className="flex gap-1 rounded-2xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
                {[0, 1, 2].map((i) => (
                  <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-[#E30613]/60" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-black/5 bg-white px-3 pt-3 pb-2">
          {msgs.length === 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {t.chips.map((c) => (
                <button
                  key={c}
                  onClick={() => send(c)}
                  className="rounded-full border border-[#E30613]/25 bg-[#E30613]/5 px-3 py-1.5 text-xs font-medium text-[#B5040F] hover:bg-[#E30613] hover:text-white transition"
                >
                  {c}
                </button>
              ))}
            </div>
          )}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.ph}
              maxLength={500}
              className="h-12 flex-1 rounded-2xl bg-[#F3F3F4] px-4 text-sm outline-none ring-[#E30613]/40 placeholder:text-neutral-400 focus:ring-2"
            />
            <button
              type="submit"
              disabled={!input.trim() || typing}
              className="grid h-12 w-12 place-items-center rounded-2xl bg-[#E30613] text-white shadow-lg shadow-[#E30613]/30 transition hover:bg-[#B5040F] disabled:opacity-40 disabled:shadow-none"
              aria-label="Send"
            >
              <Send className="h-5 w-5" />
            </button>
          </form>
          <p className="mt-2 text-center text-[11px] text-neutral-400">{t.disclaimer}</p>
        </div>
      </div>

      {/* Launcher */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-4 sm:right-6 z-50 grid h-16 w-16 place-items-center rounded-full bg-gradient-to-br from-[#E30613] to-[#8A0009] text-white shadow-[0_12px_32px_-6px_rgba(227,6,19,0.6)] transition hover:scale-105 active:scale-95"
        aria-label={t.open}
      >
        {!open && <span className="absolute inset-0 animate-ping rounded-full bg-[#E30613]/40" />}
        <span className="relative">{open ? <X className="h-7 w-7" /> : <MessageCircle className="h-7 w-7" />}</span>
        {!open && <span className="absolute right-0.5 top-0.5 h-4 w-4 rounded-full bg-emerald-400 ring-[3px] ring-white" />}
      </button>
    </>
  );
}

function Bubble({ role, content }: Msg) {
  if (role === "user")
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] whitespace-pre-line rounded-2xl rounded-br-md bg-[#111] px-4 py-2.5 text-sm leading-relaxed text-white">{content}</div>
      </div>
    );
  return (
    <div className="flex items-end gap-2">
      <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-[#E30613] text-white">
        <Sparkles className="h-3.5 w-3.5" />
      </div>
      <div className="max-w-[82%] whitespace-pre-line rounded-2xl rounded-bl-md bg-white px-4 py-2.5 text-sm leading-relaxed text-neutral-800 shadow-sm">{content}</div>
    </div>
  );
}
