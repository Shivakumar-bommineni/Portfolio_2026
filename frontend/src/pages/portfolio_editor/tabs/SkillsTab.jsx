import React, { useState } from 'react';
import { PlusIcon, TrashIcon } from '../components/EditorIcons';

export default function SkillsTab({ data, onChange }) {
  const [draft, setDraft] = useState({ icon: '', name: '', level: 'Intermediate', cat: 'Frontend' });
  const add = () => {
    if (!draft.name.trim()) return;
    onChange([...data, { ...draft }]);
    setDraft({ icon: '', name: '', level: 'Intermediate', cat: 'Frontend' });
  };
  const remove = (i) => onChange(data.filter((_, j) => j !== i));
  const setSkill = (i, k) => (e) => {
    const updated = [...data];
    updated[i] = { ...updated[i], [k]: e.target.value };
    onChange(updated);
  };

  return (
    <div>
      <div style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '1.25rem' }}>
        <div style={{ fontWeight: 700, fontSize: '.85rem', marginBottom: '.75rem', color: 'var(--text-sec)' }}>Add New Skill</div>
        <div style={{ display: 'grid', gridTemplateColumns: '56px 1fr 110px 110px auto', gap: '.5rem', alignItems: 'end' }}>
          <div>
            <div className="form-label">Icon</div>
            <input className="form-input" value={draft.icon} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} placeholder="🟢" style={{ textAlign: 'center', fontSize: '1.2rem', padding: '.65rem .25rem' }} />
          </div>
          <div>
            <div className="form-label">Name</div>
            <input className="form-input" value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Node.js" onKeyDown={(e) => e.key === 'Enter' && add()} />
          </div>
          <div>
            <div className="form-label">Category</div>
            <select className="filter-select" style={{ width: '100%' }} value={draft.cat} onChange={(e) => setDraft({ ...draft, cat: e.target.value })}>
              {['Frontend', 'Backend', 'Database', 'DevOps'].map((c) => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <div className="form-label">Level</div>
            <select className="filter-select" style={{ width: '100%' }} value={draft.level} onChange={(e) => setDraft({ ...draft, level: e.target.value })}>
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((l) => <option key={l}>{l}</option>)}
            </select>
          </div>
          <button className="btn btn-primary btn-sm" onClick={add}><PlusIcon /> Add</button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '.625rem' }}>
        {data.map((s, i) => (
          <div key={i} style={{ display: 'flex', gap: '.5rem', alignItems: 'center', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '.5rem .75rem' }}>
            <input value={s.icon} onChange={setSkill(i, 'icon')} style={{ width: 30, border: 'none', background: 'none', fontSize: '1.1rem', textAlign: 'center', outline: 'none' }} />
            <input value={s.name} onChange={setSkill(i, 'name')} style={{ flex: 1, border: 'none', background: 'none', fontWeight: 600, fontSize: '.85rem', color: 'var(--text)', outline: 'none' }} />
            <select value={s.cat || 'Frontend'} onChange={setSkill(i, 'cat')} style={{ border: 'none', background: 'none', fontSize: '.72rem', color: 'var(--primary)', fontWeight: 700, outline: 'none', cursor: 'pointer' }}>
              {['Frontend', 'Backend', 'Database', 'DevOps'].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select value={s.level} onChange={setSkill(i, 'level')} style={{ border: 'none', background: 'none', fontSize: '.72rem', color: 'var(--text-muted)', outline: 'none', cursor: 'pointer' }}>
              {['Beginner', 'Intermediate', 'Advanced', 'Expert'].map((l) => <option key={l}>{l}</option>)}
            </select>
            <button onClick={() => remove(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--error)', padding: '.2rem', display: 'flex' }}><TrashIcon /></button>
          </div>
        ))}
      </div>
      <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', marginTop: '.75rem' }}>{data.length} skill{data.length !== 1 ? 's' : ''} total</div>
    </div>
  );
}
