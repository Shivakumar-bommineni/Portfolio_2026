import React from 'react';

export const FLabel = ({ children }) => (
  <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '.25rem', textTransform: 'uppercase', letterSpacing: '.03em' }}>
    {children}
  </div>
);

export const FInput = ({ value, onChange, placeholder, type = 'text', mono }) => (
  <input
    type={type}
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    style={{
      width: '100%', padding: '.5rem .75rem', border: '1px solid var(--border)',
      borderRadius: 6, background: 'var(--bg-alt)', color: 'var(--text)',
      fontSize: '.82rem', outline: 'none', fontFamily: mono ? 'monospace' : 'inherit',
    }}
    onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
  />
);

export const FTextarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea
    value={value}
    onChange={onChange}
    placeholder={placeholder}
    rows={rows}
    style={{
      width: '100%', padding: '.5rem .75rem', border: '1px solid var(--border)',
      borderRadius: 6, background: 'var(--bg-alt)', color: 'var(--text)',
      fontSize: '.82rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6,
    }}
    onFocus={(e) => (e.target.style.borderColor = 'var(--primary)')}
    onBlur={(e) => (e.target.style.borderColor = 'var(--border)')}
  />
);

export const SLabel = ({ children }) => (
  <div style={{
    fontSize: '.72rem', fontWeight: 800, color: 'var(--text-muted)',
    textTransform: 'uppercase', letterSpacing: '.08em', margin: '1rem 0 .5rem',
    borderBottom: '1px solid var(--border)', paddingBottom: '.4rem',
  }}>
    {children}
  </div>
);

export const G2 = ({ children }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.625rem', marginBottom: '.625rem' }}>
    {children}
  </div>
);
