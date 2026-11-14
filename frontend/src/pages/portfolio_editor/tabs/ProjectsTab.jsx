import React from 'react';
import Field from '../components/Field';
import { PlusIcon, TrashIcon } from '../components/EditorIcons';

export default function ProjectsTab({ data, onChange }) {
  const add = () => onChange([...data, { num: String(data.length + 1).padStart(2, '0'), title: '', desc: '', tags: [], github: '', live: '' }]);
  const remove = (i) => onChange(data.filter((_, j) => j !== i).map((p, j) => ({ ...p, num: String(j + 1).padStart(2, '0') })));
  const setP = (i, k) => (e) => { const updated = [...data]; updated[i] = { ...updated[i], [k]: e.target.value }; onChange(updated); };
  const setTags = (i) => (e) => {
    const updated = [...data];
    updated[i] = { ...updated[i], tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) };
    onChange(updated);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn btn-outline btn-sm" onClick={add}><PlusIcon /> Add Project</button>
      </div>
      {data.map((p, i) => (
        <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '.9rem' }}>Project #{p.num}</div>
            <button className="btn btn-danger btn-sm" onClick={() => remove(i)}><TrashIcon /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '.75rem' }}>
            <Field label="Project Title"><input className="form-input" value={p.title} onChange={setP(i, 'title')} placeholder="Real-Time Chat App" /></Field>
            <Field label="Tags (comma-separated)"><input className="form-input" value={p.tags?.join(', ')} onChange={setTags(i)} placeholder="React, Node.js, Socket.io" /></Field>
            <Field label="GitHub URL"><input className="form-input" value={p.github} onChange={setP(i, 'github')} placeholder="https://github.com/..." type="url" /></Field>
            <Field label="Live Demo URL"><input className="form-input" value={p.live} onChange={setP(i, 'live')} placeholder="https://..." type="url" /></Field>
          </div>
          <Field label="Description">
            <textarea className="form-textarea" value={p.desc} onChange={setP(i, 'desc')} rows={3} placeholder="What does this project do?" />
          </Field>
        </div>
      ))}
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No projects added yet.</div>}
    </div>
  );
}
