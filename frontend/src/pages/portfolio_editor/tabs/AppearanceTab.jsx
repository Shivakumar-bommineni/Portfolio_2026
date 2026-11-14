import React from 'react';
import Field from '../components/Field';

export default function AppearanceTab({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });

  const presets = [
    { label: 'Blue + Purple', primary: '#2563eb', accent: '#7c3aed' },
    { label: 'Teal + Cyan', primary: '#0891b2', accent: '#06b6d4' },
    { label: 'Orange + Red', primary: '#ea580c', accent: '#dc2626' },
    { label: 'Green + Teal', primary: '#16a34a', accent: '#0891b2' },
    { label: 'Pink + Purple', primary: '#db2777', accent: '#9333ea' },
    { label: 'Slate + Blue', primary: '#475569', accent: '#2563eb' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '1.75rem' }}>
        <div className="form-label">Color Presets</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '.625rem', marginBottom: '1.5rem' }}>
          {presets.map((p) => (
            <button key={p.label} onClick={() => onChange({ primary: p.primary, accent: p.accent })}
              style={{
                display: 'flex', alignItems: 'center', gap: '.5rem',
                padding: '.5rem .875rem', borderRadius: 'var(--radius-sm)',
                border: `2px solid ${data.primary === p.primary ? p.primary : 'var(--border)'}`,
                background: 'var(--surface)', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '.8rem', fontWeight: 600,
              }}>
              <span style={{ display: 'flex', gap: 3 }}>
                <span style={{ width: 14, height: 14, borderRadius: 3, background: p.primary }} />
                <span style={{ width: 14, height: 14, borderRadius: 3, background: p.accent }} />
              </span>
              {p.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', maxWidth: 400 }}>
          <Field label="Primary Color">
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <input type="color" value={data.primary} onChange={set('primary')} style={{ width: 42, height: 42, border: '1.5px solid var(--border)', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
              <input className="form-input" value={data.primary} onChange={set('primary')} style={{ fontFamily: 'monospace', fontSize: '.85rem' }} />
            </div>
          </Field>
          <Field label="Accent Color">
            <div style={{ display: 'flex', gap: '.5rem', alignItems: 'center' }}>
              <input type="color" value={data.accent} onChange={set('accent')} style={{ width: 42, height: 42, border: '1.5px solid var(--border)', borderRadius: 8, cursor: 'pointer', padding: 2 }} />
              <input className="form-input" value={data.accent} onChange={set('accent')} style={{ fontFamily: 'monospace', fontSize: '.85rem' }} />
            </div>
          </Field>
        </div>
      </div>

      <div>
        <div className="form-label">Gradient Preview</div>
        <div style={{
          height: 64, borderRadius: 'var(--radius)',
          background: `linear-gradient(135deg, ${data.primary}, ${data.accent})`,
          boxShadow: `0 4px 20px ${data.primary}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: '1rem',
        }}>
          shivakumar_dev
        </div>
      </div>
    </div>
  );
}
