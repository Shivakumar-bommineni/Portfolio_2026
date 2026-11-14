import React from 'react';
import { BOT_AVATAR } from '../constants';

export default function Message({ msg }) {
  const isBot = msg.role === 'assistant';
  return (
    <div style={{
      display: 'flex', gap: '.625rem', alignItems: 'flex-start',
      justifyContent: isBot ? 'flex-start' : 'flex-end',
      marginBottom: '.875rem',
    }}>
      {isBot && BOT_AVATAR}
      <div style={{
        maxWidth: '80%',
        background: isBot ? 'var(--surface-alt)' : 'linear-gradient(135deg,#3b82f6,#2563eb)',
        color: isBot ? 'var(--text)' : '#fff',
        borderRadius: isBot ? '4px 14px 14px 14px' : '14px 4px 14px 14px',
        padding: '.625rem .875rem',
        fontSize: '.84rem', lineHeight: 1.65,
        boxShadow: isBot ? 'none' : '0 4px 14px rgba(37,99,235,.3)',
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
