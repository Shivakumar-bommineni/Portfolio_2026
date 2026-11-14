import React from 'react';

export default function ChatHeader({ online, messagesCount, onClear, onClose }) {
  return (
    <div style={{
      padding: '1rem 1.125rem .875rem',
      background: 'linear-gradient(135deg,#1e3a5f,#2d1b69)',
      display: 'flex', alignItems: 'center', gap: '.75rem',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 12,
        background: 'linear-gradient(135deg,#3b82f6,#8b5cf6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '.85rem', fontWeight: 900, color: '#fff', flexShrink: 0,
      }}>SB</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 800, fontSize: '.9rem', color: '#fff', lineHeight: 1.3 }}>
          Shivakumar's AI
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '.375rem', marginTop: '.1rem' }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: online ? '#34d399' : '#f87171',
          }} />
          <span style={{ fontSize: '.7rem', color: 'rgba(255,255,255,.65)', fontWeight: 500 }}>
            {online === null ? 'Connecting…' : online ? 'Online · llama3.2' : 'Offline · Start Ollama'}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
        {messagesCount > 0 && (
          <button onClick={onClear} title="Clear chat" style={{
            background: 'rgba(255,255,255,.1)', border: 'none', cursor: 'pointer',
            width: 30, height: 30, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.7)',
          }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/>
            </svg>
          </button>
        )}
        <button onClick={onClose} title="Close" style={{
          background: 'rgba(255,255,255,.1)', border: 'none', cursor: 'pointer',
          width: 30, height: 30, borderRadius: 8,
          display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,.7)',
        }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
