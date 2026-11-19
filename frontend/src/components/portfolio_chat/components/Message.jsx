import React from 'react';
import { BOT_AVATAR } from '../constants';

export default function Message({ msg, isCyber = false }) {
  const isBot = msg.role === 'assistant';
  return (
    <div style={{
      display: 'flex', gap: '.625rem', alignItems: 'flex-start',
      justifyContent: isBot ? 'flex-start' : 'flex-end',
      marginBottom: '.875rem',
      fontFamily: isCyber ? "'JetBrains Mono', monospace" : 'inherit',
    }}>
      {isBot && BOT_AVATAR}
      <div style={{
        maxWidth: '82%',
        background: isBot
          ? (isCyber ? 'rgba(22, 18, 30, 0.9)' : 'var(--surface-alt)')
          : (isCyber ? 'linear-gradient(135deg, #ff2e5b, #b51239)' : 'linear-gradient(135deg,#3b82f6,#2563eb)'),
        color: isBot ? (isCyber ? '#e2e8f0' : 'var(--text)') : '#fff',
        border: isBot && isCyber ? '1px solid rgba(255, 46, 91, 0.2)' : 'none',
        borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        padding: '.625rem .875rem',
        fontSize: '.84rem', lineHeight: 1.65,
        boxShadow: isBot
          ? 'none'
          : (isCyber ? '0 4px 16px rgba(255,46,91,.4)' : '0 4px 14px rgba(37,99,235,.3)'),
        whiteSpace: 'pre-wrap', wordBreak: 'break-word',
      }}>
        {msg.content}
        {msg.streaming && (
          <span style={{
            display: 'inline-block', width: 2, height: '1em',
            background: 'currentColor', marginLeft: 2, verticalAlign: 'text-bottom',
            animation: 'chatCursor .6s step-end infinite',
          }} />
        )}
      </div>
    </div>
  );
}
