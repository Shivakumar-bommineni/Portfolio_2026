import React from 'react';

export default function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 4, padding: '2px 0' }}>
      {[0, 1, 2].map((i) => (
        <span key={i} style={{
          width: 6, height: 6, borderRadius: '50%',
          background: 'var(--text-muted)',
          animation: `chatDot .9s ease-in-out ${i * .18}s infinite`,
          display: 'inline-block',
        }} />
      ))}
    </div>
  );
}
