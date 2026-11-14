import React from 'react';
import Field from '../components/Field';

export default function HeroTab({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Full Name"><input className="form-input" value={data.name} onChange={set('name')} placeholder="Shivakumar Bommineni" /></Field>
        <Field label="Title / Role"><input className="form-input" value={data.title} onChange={set('title')} placeholder="Full Stack Developer" /></Field>
        <Field label="Handle (brand name)"><input className="form-input" value={data.handle} onChange={set('handle')} placeholder="ShivaKumar_B" /></Field>
        <Field label="Eyebrow Text"><input className="form-input" value={data.eyebrow} onChange={set('eyebrow')} placeholder="Available to Work" /></Field>
      </div>
      <Field label="Bio (hero description)">
        <textarea className="form-textarea" value={data.bio} onChange={set('bio')} rows={3} placeholder="Short description about yourself..." />
      </Field>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Avatar Initials" hint="Shown when no image URL is set">
          <input className="form-input" value={data.avatarText} onChange={set('avatarText')} placeholder="SB" maxLength={3} />
        </Field>
        <Field label="Avatar Image URL" hint="Direct URL to your photo (optional)">
          <input className="form-input" value={data.avatarUrl} onChange={set('avatarUrl')} placeholder="https://..." type="url" />
        </Field>
      </div>
      {data.avatarUrl && (
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '.5rem' }}>
          <img src={data.avatarUrl} alt="Avatar preview" onError={(e) => e.target.style.display = 'none'}
            style={{ width: 80, height: 80, borderRadius: 14, objectFit: 'cover', border: '2px solid var(--border)' }} />
          <span style={{ fontSize: '.8rem', color: 'var(--text-muted)' }}>Avatar preview</span>
        </div>
      )}
    </div>
  );
}
