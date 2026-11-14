import React from 'react';
import { PlusIcon, TrashIcon } from '../components/EditorIcons';

export default function AboutTab({ data, onChange }) {
  const setPara = (i) => (e) => {
    const paras = [...data.paragraphs];
    paras[i] = e.target.value;
    onChange({ ...data, paragraphs: paras });
  };
  const addPara = () => onChange({ ...data, paragraphs: [...data.paragraphs, ''] });
  const removePara = (i) => onChange({ ...data, paragraphs: data.paragraphs.filter((_, j) => j !== i) });

  const setHL = (i, k) => (e) => {
    const hl = [...data.highlights];
    hl[i] = { ...hl[i], [k]: e.target.value };
    onChange({ ...data, highlights: hl });
  };
  const addHL = () => onChange({ ...data, highlights: [...data.highlights, { icon: '⭐', title: '', desc: '' }] });
  const removeHL = (i) => onChange({ ...data, highlights: data.highlights.filter((_, j) => j !== i) });

  return (
    <div>
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
          <div className="form-label" style={{ margin: 0 }}>About Paragraphs</div>
          <button className="btn btn-outline btn-sm" onClick={addPara}><PlusIcon /> Add Paragraph</button>
        </div>
        {data.paragraphs.map((p, i) => (
          <div key={i} style={{ display: 'flex', gap: '.5rem', marginBottom: '.75rem' }}>
            <textarea className="form-textarea" value={p} onChange={setPara(i)} rows={3} placeholder={`Paragraph ${i + 1}...`} style={{ flex: 1 }} />
            <button className="btn btn-danger btn-sm" onClick={() => removePara(i)} style={{ flexShrink: 0, alignSelf: 'flex-start' }}><TrashIcon /></button>
          </div>
        ))}
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.75rem' }}>
          <div className="form-label" style={{ margin: 0 }}>Highlight Cards</div>
          <button className="btn btn-outline btn-sm" onClick={addHL}><PlusIcon /> Add Card</button>
        </div>
        {data.highlights.map((h, i) => (
          <div key={i} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '1rem', marginBottom: '.75rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr auto', gap: '.75rem', alignItems: 'start' }}>
              <input className="form-input" value={h.icon} onChange={setHL(i, 'icon')} placeholder="⚡" style={{ width: 56, textAlign: 'center', fontSize: '1.2rem' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}>
                <input className="form-input" value={h.title} onChange={setHL(i, 'title')} placeholder="Card Title" />
                <input className="form-input" value={h.desc} onChange={setHL(i, 'desc')} placeholder="Short description..." />
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => removeHL(i)}><TrashIcon /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
