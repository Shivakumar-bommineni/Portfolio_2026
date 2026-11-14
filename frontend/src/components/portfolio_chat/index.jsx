import React, { useState, useEffect, useRef, useCallback } from 'react';
import { chatAPI } from '../../services/api';
import { SUGGESTED, BOT_AVATAR } from './constants';
import ChatStyles from './styles/ChatStyles';
import TypingDots from './components/TypingDots';
import Message from './components/Message';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';

export default function PortfolioChat() {
  const [open, setOpen]         = useState(false);
  const [online, setOnline]     = useState(null);   // null=checking, true/false
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);
  const abortRef                = useRef(null);

  // Check Ollama status once on mount
  useEffect(() => {
    chatAPI.status()
      .then((r) => setOnline(r.data.online))
      .catch(() => setOnline(false));
  }, []);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 150);
  }, [open]);

  const sendMessage = useCallback(async (text) => {
    const userText = (text || input).trim();
    if (!userText || busy) return;

    setInput('');
    setShowSugg(false);
    setBusy(true);

    const userMsg = { role: 'user', content: userText };
    const history = [...messages, userMsg];
    setMessages([...history, { role: 'assistant', content: '', streaming: true }]);

    try {
      const res = await chatAPI.stream(
        history.map((m) => ({ role: m.role, content: m.content }))
      );

      if (!res.ok) {
        throw new Error('AI service error');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = '';

      abortRef.current = reader;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n').filter(Boolean);

        for (const line of lines) {
          try {
            const data = JSON.parse(line);
            if (data.message?.content) {
              full += data.message.content;
              setMessages((prev) => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                  role: 'assistant', content: full, streaming: !data.done,
                };
                return updated;
              });
            }
          } catch { /* partial JSON line — skip */ }
        }
      }

      // Final — remove streaming cursor
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = { role: 'assistant', content: full, streaming: false };
        return updated;
      });
    } catch {
      setMessages((prev) => {
        const updated = [...prev];
        updated[updated.length - 1] = {
          role: 'assistant',
          content: online === false
            ? '⚠️ AI service is offline. Please make sure Ollama is running locally with llama3.2.'
            : '⚠️ Something went wrong. Please try again.',
          streaming: false,
        };
        return updated;
      });
    } finally {
      setBusy(false);
      abortRef.current = null;
    }
  }, [input, messages, busy, online]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  const clearChat = () => {
    setMessages([]);
    setShowSugg(true);
    setInput('');
  };

  return (
    <>
      <ChatStyles />

      {/* Floating Action Button */}
      {!open && (
        <button
          className={online ? 'chat-fab' : ''}
          onClick={() => setOpen(true)}
          title="Ask about Shivakumar"
          style={{
            position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 300,
            display: 'flex', alignItems: 'center', gap: '.625rem',
            padding: '.75rem 1.375rem',
            background: 'linear-gradient(135deg,#3b82f6,#2563eb)',
            color: '#fff', border: 'none', borderRadius: 100,
            fontWeight: 700, fontSize: '.875rem', cursor: 'pointer',
            boxShadow: '0 8px 32px rgba(37,99,235,.45)',
            fontFamily: 'inherit', transition: 'all .2s',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
          </svg>
          Ask AI
          {online !== null && (
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: online ? '#34d399' : '#f87171',
            }} />
          )}
        </button>
      )}

      {/* Chat Panel */}
      {open && (
        <div
          className="chat-panel"
          style={{
            position: 'fixed', bottom: '1.5rem', right: '1.5rem', zIndex: 300,
            width: 380, maxHeight: 580,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 20,
            boxShadow: '0 24px 64px rgba(0,0,0,.22)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
        >
          <ChatHeader
            online={online}
            messagesCount={messages.length}
            onClear={clearChat}
            onClose={() => setOpen(false)}
          />

          {/* Messages Container */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: '1rem',
            scrollbarWidth: 'thin', scrollbarColor: 'var(--border) transparent',
            minHeight: 0,
          }}>
            {/* Welcome */}
            {messages.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1rem 0 .5rem' }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, margin: '0 auto .875rem',
                  background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.1rem', fontWeight: 900, color: '#fff',
                }}>SB</div>
                <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: '.375rem' }}>
                  Hi! I'm Shivakumar's AI
                </div>
                <div style={{ fontSize: '.8rem', color: 'var(--text-muted)', lineHeight: 1.6, maxWidth: 260, margin: '0 auto' }}>
                  Ask me anything about Shivakumar's skills, experience, projects, or availability.
                </div>
              </div>
            )}

            {/* Suggested questions */}
            {showSugg && messages.length === 0 && (
              <div style={{ marginTop: '.875rem' }}>
                <div style={{ fontSize: '.7rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.06em' }}>
                  Suggested questions
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '.375rem' }}>
                  {SUGGESTED.map((q) => (
                    <button
                      key={q}
                      className="sugg-chip"
                      onClick={() => sendMessage(q)}
                      style={{
                        textAlign: 'left', padding: '.5rem .75rem',
                        background: 'var(--surface-alt)', border: '1px solid var(--border)',
                        borderRadius: 10, fontSize: '.8rem', fontWeight: 600,
                        color: 'var(--text-sec)', cursor: 'pointer', fontFamily: 'inherit',
                        transition: 'all .15s',
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat messages */}
            {messages.map((msg, i) => {
              if (msg.streaming && msg.content === '') return null;
              return <Message key={i} msg={msg} />;
            })}

            {/* Typing dots */}
            {busy && messages[messages.length - 1]?.content === '' && (
              <div style={{ display: 'flex', gap: '.625rem', alignItems: 'flex-start', marginBottom: '.875rem' }}>
                {BOT_AVATAR}
                <div style={{
                  background: 'var(--surface-alt)', borderRadius: '4px 14px 14px 14px',
                  padding: '.625rem .875rem',
                }}>
                  <TypingDots />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <ChatInput
            input={input}
            setInput={setInput}
            onSend={sendMessage}
            onKeyDown={handleKey}
            inputRef={inputRef}
            busy={busy}
            online={online}
          />
        </div>
      )}
    </>
  );
}
