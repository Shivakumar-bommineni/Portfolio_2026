import React from 'react';
import Field from '../components/Field';
import { PlusIcon, TrashIcon } from '../components/EditorIcons';

export default function ExperienceTab({ data, onChange }) {
  const add = () => onChange([...data, { company: '', role: '', startDate: '', endDate: 'Present', location: '', bullets: [''] }]);
  const remove = (i) => onChange(data.filter((_, j) => j !== i));
  const setExp = (i, k) => (e) => { const updated = [...data]; updated[i] = { ...updated[i], [k]: e.target.value }; onChange(updated); };
  const setBullet = (i, j) => (e) => {
    const updated = [...data];
    const bullets = [...updated[i].bullets];
    bullets[j] = e.target.value;
    updated[i] = { ...updated[i], bullets };
    onChange(updated);
  };
  const addBullet = (i) => { const updated = [...data]; updated[i] = { ...updated[i], bullets: [...updated[i].bullets, ''] }; onChange(updated); };
  const removeBullet = (i, j) => { const updated = [...data]; updated[i] = { ...updated[i], bullets: updated[i].bullets.filter((_, k) => k !== j) }; onChange(updated); };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
        <button className="btn btn-outline btn-sm" onClick={add}><PlusIcon /> Add Experience</button>
      </div>
      {data.map((exp, i) => (
        <div key={i} style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ fontWeight: 700, fontSize: '.9rem' }}>Experience #{i + 1}</div>
            <button className="btn btn-danger btn-sm" onClick={() => remove(i)}><TrashIcon /></button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.75rem', marginBottom: '.75rem' }}>
            <Field label="Company"><input className="form-input" value={exp.company} onChange={setExp(i, 'company')} placeholder="Company Name" /></Field>
            <Field label="Role / Title"><input className="form-input" value={exp.role} onChange={setExp(i, 'role')} placeholder="Full Stack Developer" /></Field>
            <Field label="Start Date"><input className="form-input" value={exp.startDate} onChange={setExp(i, 'startDate')} placeholder="Jan 2022" /></Field>
            <Field label="End Date"><input className="form-input" value={exp.endDate} onChange={setExp(i, 'endDate')} placeholder="Present" /></Field>
            <Field label="Location" hint="e.g. Remote, Hyderabad"><input className="form-input" value={exp.location} onChange={setExp(i, 'location')} placeholder="Remote" /></Field>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
              <div className="form-label" style={{ margin: 0 }}>Bullet Points</div>
              <button className="btn btn-outline btn-sm" onClick={() => addBullet(i)}><PlusIcon /> Add Bullet</button>
            </div>
            {exp.bullets?.map((b, j) => (
              <div key={j} style={{ display: 'flex', gap: '.5rem', marginBottom: '.4rem' }}>
                <span style={{ color: 'var(--primary)', fontWeight: 700, fontSize: '1rem', flexShrink: 0, marginTop: '.7rem' }}>•</span>
                <input className="form-input" value={b} onChange={setBullet(i, j)} placeholder="Bullet point..." style={{ flex: 1 }} />
                <button className="btn btn-danger btn-sm" onClick={() => removeBullet(i, j)} style={{ flexShrink: 0 }}><TrashIcon /></button>
              </div>
            ))}
          </div>
        </div>
      ))}
      {data.length === 0 && <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No experience added yet.</div>}
    </div>
  );
}
