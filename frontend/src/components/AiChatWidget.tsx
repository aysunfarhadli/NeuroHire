import { useEffect, useRef, useState } from 'react';
import { MessageSquare, Send, Sparkles, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/store/auth';
import { sendChat, type ChatMessage } from '@/api/chat';

function audienceForUser(role: string | undefined): 'GUEST' | 'CANDIDATE' | 'HR' | 'SUPER_ADMIN' {
  if (!role) return 'GUEST';
  if (role === 'SUPER_ADMIN') return 'SUPER_ADMIN';
  if (role === 'CANDIDATE') return 'CANDIDATE';
  return 'HR';
}

export default function AiChatWidget() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [pending, setPending] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const audience = audienceForUser(user?.role);
  const welcomeKey =
    audience === 'GUEST' ? 'ai.welcomeGuest'
    : audience === 'CANDIDATE' ? 'ai.welcomeCandidate'
    : audience === 'SUPER_ADMIN' ? 'ai.welcomeSuper'
    : 'ai.welcomeHr';
  const quickActionsKey =
    audience === 'GUEST' ? 'ai.quickActionsGuest'
    : audience === 'CANDIDATE' ? 'ai.quickActionsCandidate'
    : audience === 'SUPER_ADMIN' ? 'ai.quickActionsSuper'
    : 'ai.quickActionsHr';

  const initialQuickActions = t(quickActionsKey, { returnObjects: true }) as unknown as string[];

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'assistant', content: t(welcomeKey) }]);
      setSuggestions(initialQuickActions);
    }
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, pending]);

  const send = async (text: string) => {
    if (!text.trim() || pending) return;
    const userMsg: ChatMessage = { role: 'user', content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setPending(true);
    setSuggestions([]);
    try {
      const reply = await sendChat(next, audience);
      setMessages((m) => [...m, { role: 'assistant', content: reply.reply }]);
      setSuggestions(reply.suggestedActions ?? []);
    } catch {
      setMessages((m) => [
        ...m,
        { role: 'assistant', content: '(The AI is offline right now — try again in a moment.)' },
      ]);
    } finally {
      setPending(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-5 right-5 z-40 h-14 w-14 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow hover:shadow-pop hover:-translate-y-0.5 transition-all flex items-center justify-center group"
        aria-label="Open assistant"
      >
        {open ? <X className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
        <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-bg" />
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 w-[min(380px,calc(100vw-2.5rem))] h-[min(540px,calc(100vh-7.5rem))] rounded-2xl border border-border bg-surface shadow-pop overflow-hidden flex flex-col animate-fade-in-up">
          <header className="px-4 py-3 border-b border-border bg-gradient-to-br from-brand-500/10 to-transparent">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <div className="text-sm font-semibold leading-tight">{t('ai.widgetTitle')}</div>
                <div className="text-[11px] text-subtle truncate">{t('ai.widgetSub')}</div>
              </div>
            </div>
          </header>

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3 text-sm">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                  m.role === 'assistant'
                    ? 'bg-fg/[0.05] text-fg rounded-tl-sm'
                    : 'bg-brand-500 text-white ml-auto rounded-tr-sm'
                }`}
              >
                {m.content}
              </div>
            ))}
            {pending && (
              <div className="bg-fg/[0.05] rounded-2xl rounded-tl-sm px-3 py-2 max-w-[60%] inline-flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-subtle animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-subtle animate-pulse [animation-delay:120ms]" />
                <span className="h-1.5 w-1.5 rounded-full bg-subtle animate-pulse [animation-delay:240ms]" />
              </div>
            )}
          </div>

          {suggestions.length > 0 && (
            <div className="px-3 pb-2 flex flex-wrap gap-1.5">
              {suggestions.slice(0, 3).map((s) => (
                <button
                  key={s}
                  onClick={() => send(s)}
                  className="text-xs px-2 h-7 rounded-md bg-brand-500/10 text-brand-700 dark:text-brand-300 hover:bg-brand-500/20 transition-colors truncate max-w-full"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          <form
            onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="p-3 border-t border-border flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t('ai.placeholder')}
              className="flex-1 h-10 px-3 rounded-lg bg-bg/60 border border-border text-fg placeholder:text-subtle focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 text-sm"
            />
            <button
              type="submit"
              disabled={pending || !input.trim()}
              className="h-10 w-10 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 text-white flex items-center justify-center disabled:opacity-40"
              aria-label="Send"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
