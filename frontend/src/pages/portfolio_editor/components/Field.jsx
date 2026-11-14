import React from 'react';

export default function Field({ label, children, hint }) {
  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      {children}
      {hint && (
        <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>
          {hint}
        </div>
      )}
    </div>
  );
}
