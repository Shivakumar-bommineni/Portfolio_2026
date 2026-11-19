import React from 'react';

export default function ChatInput({ input, setInput, onSend, onKeyDown, inputRef, busy, online, isCyber = false }) {
  return (
    <div style={{
      padding: '.875rem 1rem',
      borderTop: isCyber ? '1px solid rgba(255, 46, 91, 0.25)' : '1px solid var(--border)',
      background: isCyber ? 'rgba(10, 8, 16, 0.95)' : 'var(--surface)',
      fontFamily: isCyber ? "'JetBrains Mono', monospace" : 'inherit',
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
            border: isCyber ? '1.5px solid rgba(255, 46, 91, 0.35)' : '1.5px solid var(--border)',
            borderRadius: 12,
            background: isCyber ? 'rgba(18, 14, 24, 0.85)' : 'var(--bg-alt)',
            color: isCyber ? '#ffffff' : 'var(--text)',
            fontSize: '.855rem',
            fontFamily: 'inherit', lineHeight: 1.5,
            transition: 'border-color .15s, box-shadow .15s',
            maxHeight: 100, overflowY: 'auto',
            scrollbarWidth: 'none',
            opacity: (busy || online === false) ? .6 : 1,
            outline: 'none',
          }}
          onFocus={(e) => {
            if (isCyber) {
              e.currentTarget.style.borderColor = '#ff2e5b';
              e.currentTarget.style.boxShadow = '0 0 12px rgba(255, 46, 91, 0.4)';
            }
          }}
          onBlur={(e) => {
            if (isCyber) {
              e.currentTarget.style.borderColor = 'rgba(255, 46, 91, 0.35)';
              e.currentTarget.style.boxShadow = 'none';
            }
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
              ? (isCyber ? 'rgba(255,255,255,0.06)' : 'var(--surface-alt)')
              : (isCyber ? 'linear-gradient(135deg, #ff2e5b, #b51239)' : 'linear-gradient(135deg,#3b82f6,#2563eb)'),
            color: !input.trim() || busy || online === false ? 'var(--text-muted)' : '#fff',
            cursor: !input.trim() || busy ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            transition: 'all .15s',
            boxShadow: input.trim() && !busy
              ? (isCyber ? '0 0 15px rgba(255,46,91,0.55)' : '0 4px 12px rgba(37,99,235,.3)')
              : 'none',
          }}
        >
          {busy ? (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ animation: 'spin 1s linear infinite' }}>
              <circle cx="12" cy="12" r="10" strokeDasharray="32" strokeDashoffset="12"/>
            </svg>
          ) : (
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
