import React from 'react';
import Field from '../components/Field';

export default function ContactTab({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500 }}>
      <Field label="Email Address"><input className="form-input" value={data.email} onChange={set('email')} type="email" placeholder="you@example.com" /></Field>
      <Field label="GitHub Profile URL"><input className="form-input" value={data.github} onChange={set('github')} type="url" placeholder="https://github.com/username" /></Field>
      <Field label="LinkedIn Profile URL"><input className="form-input" value={data.linkedin} onChange={set('linkedin')} type="url" placeholder="https://linkedin.com/in/..." /></Field>
    </div>
  );
}
