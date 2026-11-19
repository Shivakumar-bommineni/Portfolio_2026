import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatAPI } from '../../services/api';
import { SUGGESTED, BOT_AVATAR } from './constants';
import ChatStyles from './styles/ChatStyles';
import TypingDots from './components/TypingDots';
import Message from './components/Message';
import ChatHeader from './components/ChatHeader';
import ChatInput from './components/ChatInput';

export default function PortfolioChat({ isCyber = false }) {
  const [open, setOpen]         = useState(false);
  const [online, setOnline]     = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput]       = useState('');
  const [busy, setBusy]         = useState(false);
  const [showSugg, setShowSugg] = useState(true);
  const bottomRef               = useRef(null);
  const inputRef                = useRef(null);
  const abortRef                = useRef(null);

  useEffect(() => {
    chatAPI.status()
      .then((r) => setOnline(r.data.online))
      .catch(() => setOnline(false));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
      let assistantText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.replace('data: ', '').trim();
          if (!jsonStr) continue;

          try {
            const parsed = JSON.parse(jsonStr);
            if (parsed.content) {
              assistantText += parsed.content;
              setMessages((prev) => {
                const next = [...prev];
                next[next.length - 1] = {
                  role: 'assistant',
                  content: assistantText,
                  streaming: true,
                };
                return next;
              });
            }
          } catch {
            // ignore partial JSON chunks
          }
        }
      }

      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          content: assistantText || 'Sorry, I could not generate a response.',
          streaming: false,
        };
        return next;
      });
    } catch {
      setMessages((prev) => {
        const next = [...prev];
        next[next.length - 1] = {
          role: 'assistant',
          content: 'Sorry, could not connect to AI service. Please make sure Ollama is running.',
          streaming: false,
        };
        return next;
      });
    } finally {
      setBusy(false);
    }
  }, [input, busy, messages]);

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setShowSugg(true);
    setInput('');
  };

  return (
    <>
      <ChatStyles />

      {/* Floating Action Button with Cyber/Classic Animations */}
      {!open && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={online && !isCyber ? 'chat-fab' : ''}
          onClick={() => setOpen(true)}
          title="Ask AI about Shivakumar"
          style={{
            position: 'fixed',
            bottom: 'clamp(1.5rem, 3vw, 2rem)',
            right: 'clamp(1rem, 3vw, 2rem)',
            zIndex: 300,
            display: 'flex',
            alignItems: 'center',
            gap: '.625rem',
            padding: isCyber ? '.75rem 1.4rem' : '.75rem 1.375rem',
            background: isCyber
              ? 'linear-gradient(135deg, #ff2e5b, #b51239)'
              : 'linear-gradient(135deg,#3b82f6,#2563eb)',
            color: '#fff',
            border: isCyber ? '1px solid rgba(255, 255, 255, 0.3)' : 'none',
            borderRadius: 100,
            fontWeight: 800,
            fontSize: isCyber ? '.82rem' : '.875rem',
            cursor: 'pointer',
            boxShadow: isCyber
              ? '0 0 25px rgba(255, 46, 91, 0.6), inset 0 0 10px rgba(255, 46, 91, 0.2)'
              : '0 8px 32px rgba(37,99,235,.45)',
            fontFamily: isCyber ? "'JetBrains Mono', monospace" : 'inherit',
            letterSpacing: isCyber ? '1px' : 'normal',
          }}
        >
          {isCyber ? (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
              <line x1="8" y1="21" x2="16" y2="21"/>
              <line x1="12" y1="17" x2="12" y2="21"/>
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>
            </svg>
          )}

          {isCyber ? '// AI ASSISTANT' : 'Ask AI'}

          {online !== null && (
            <span style={{
              width: 7, height: 7, borderRadius: '50%', flexShrink: 0,
              background: online ? '#34d399' : '#f87171',
              boxShadow: online ? '0 0 8px #34d399' : 'none',
            }} />
          )}
        </motion.button>
      )}

      {/* Chat Panel with Animated Entrance */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={`chat-panel ${isCyber ? 'cyber-corner-box' : ''}`}
            style={{
              position: 'fixed',
              bottom: 'clamp(1rem, 2.5vw, 1.5rem)',
              right: 'clamp(0.5rem, 2.5vw, 1.5rem)',
              zIndex: 300,
              width: 'min(380px, calc(100vw - 1rem))',
              maxHeight: 'min(580px, 85vh)',
              background: isCyber ? 'rgba(12, 10, 18, 0.95)' : 'var(--surface)',
              backdropFilter: isCyber ? 'blur(24px)' : 'none',
              border: isCyber ? '1px solid rgba(255, 46, 91, 0.45)' : '1px solid var(--border)',
              borderRadius: 20,
              boxShadow: isCyber
                ? '0 25px 65px rgba(0,0,0,0.9), 0 0 35px rgba(255, 46, 91, 0.3)'
                : '0 24px 64px rgba(0,0,0,.22)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            <ChatHeader
              online={online}
              messagesCount={messages.length}
              onClear={clearChat}
              onClose={() => setOpen(false)}
              isCyber={isCyber}
            />

            {/* Messages Container */}
            <div style={{
              flex: 1, overflowY: 'auto', padding: '1rem',
              scrollbarWidth: 'thin', scrollbarColor: isCyber ? 'rgba(255,46,91,0.3) transparent' : 'var(--border) transparent',
              minHeight: 0,
            }}>
              {/* Welcome */}
              {messages.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1rem 0 .5rem' }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14, margin: '0 auto .875rem',
                    background: isCyber
                      ? 'linear-gradient(135deg, #ff2e5b, #960f2d)'
                      : 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
                    boxShadow: isCyber ? '0 0 20px rgba(255, 46, 91, 0.5)' : 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.1rem', fontWeight: 900, color: '#fff',
                  }}>SB</div>
                  <div style={{
                    fontWeight: 800, fontSize: '.95rem', marginBottom: '.375rem',
                    color: isCyber ? '#ffffff' : 'inherit',
                    fontFamily: isCyber ? "'JetBrains Mono', monospace" : 'inherit',
                  }}>
                    {isCyber ? "Hi! I'm Shivakumar's AI Assistant" : "Hi! I'm Shivakumar's AI"}
                  </div>
                  <div style={{
                    fontSize: '.8rem',
                    color: isCyber ? '#94a3b8' : 'var(--text-muted)',
                    lineHeight: 1.6, maxWidth: 260, margin: '0 auto',
                  }}>
                    Ask me anything about Shivakumar's skills, experience, projects, or architecture.
                  </div>
                </div>
              )}

              {/* Suggested questions */}
              {showSugg && messages.length === 0 && (
                <div style={{ marginTop: '.875rem' }}>
                  <div style={{
                    fontSize: '.7rem', fontWeight: 700,
                    color: isCyber ? '#ff4d76' : 'var(--text-muted)',
                    marginBottom: '.5rem', textTransform: 'uppercase', letterSpacing: '.06em',
                    fontFamily: isCyber ? "'JetBrains Mono', monospace" : 'inherit',
                  }}>
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
                          background: isCyber ? 'rgba(255, 255, 255, 0.04)' : 'var(--surface-alt)',
                          border: isCyber ? '1px solid rgba(255, 46, 91, 0.25)' : '1px solid var(--border)',
                          borderRadius: 10, fontSize: '.8rem', fontWeight: 600,
                          color: isCyber ? '#cbd5e1' : 'var(--text-sec)',
                          cursor: 'pointer',
                          fontFamily: isCyber ? "'JetBrains Mono', monospace" : 'inherit',
                          transition: 'all .2s',
                        }}
                      >
                        {isCyber ? `> ${q}` : q}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat messages */}
              {messages.map((msg, i) => {
                if (msg.streaming && msg.content === '') return null;
                return <Message key={i} msg={msg} isCyber={isCyber} />;
              })}

              {/* Typing dots */}
              {busy && messages[messages.length - 1]?.content === '' && (
                <div style={{ display: 'flex', gap: '.625rem', alignItems: 'flex-start', marginBottom: '.875rem' }}>
                  {BOT_AVATAR}
                  <div style={{
                    background: isCyber ? 'rgba(22, 18, 30, 0.85)' : 'var(--surface-alt)',
                    borderRadius: '4px 14px 14px 14px',
                    padding: '.625rem .875rem',
                    border: isCyber ? '1px solid rgba(255, 46, 91, 0.2)' : 'none',
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
              isCyber={isCyber}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
