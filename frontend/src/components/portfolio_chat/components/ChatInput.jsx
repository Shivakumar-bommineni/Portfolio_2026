import React from 'react';

export default function ChatInput({ input, setInput, onSend, onKeyDown, inputRef, busy, online }) {
  return (
    <div style={{
      padding: '.875rem 1rem',
      borderTop: '1px solid var(--border)',
      background: 'var(--surface)',
    }}>
      <div style={{ display: 'flex', gap: '.5rem', alignItems: 'flex-end' }}>
        <textarea
          ref={inputRef}
          className="chat-msg-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Ask about Shivakumar…"
          rows={1}
          disabled={busy || online === false}
          style={{
            flex: 1, resize: 'none', padding: '.65rem .875rem',
            border: '1.5px solid var(--border)',
            borderRadius: 12, background: 'var(--bg-alt)',
            color: 'var(--text)', fontSize: '.855rem',
            fontFamily: 'inherit', lineHeight: 1.5,
            transition: 'border-color .15s, box-shadow .15s',
            maxHeight: 100, overflowY: 'auto',
            scrollbarWidth: 'none',
            opacity: (busy || online === false) ? .6 : 1,
          }}
          onInput={(e) => {
            e.target.style.height = 'auto';
            e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
          }}
        />
        <button
          className="chat-send"
          onClick={() => onSend()}
          disabled={!input.trim() || busy || online === false}
          style={{
            width: 40, height: 40, borderRadius: 12, border: 'none',
            background: !input.trim() || busy || online === false
              ? 'var(--surface-alt)' : 'linear-gradient(135deg,#3b82f6,#2563eb)',
            color: !input.trim() || busy || online === false ? 'var(--text-muted)' : '#fff',
            cursor: !input.trim() || busy ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all .15s', boxShadow: input.trim() && !busy ? '0 4px 12px rgba(37,99,235,.3)' : 'none',
          }}
        >
          {busy
            ? <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin .7s linear infinite' }}><circle cx="12" cy="12" r="10" strokeOpacity=".25"/><path d="M12 2a10 10 0 0110 10" /></svg>
            : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          }
        </button>
      </div>
      <div style={{
        fontSize: '.65rem', color: 'var(--text-muted)', textAlign: 'center',
        marginTop: '.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '.3rem',
      }}>
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        Powered by Ollama · Only knows about Shivakumar
      </div>
    </div>
  );
}
