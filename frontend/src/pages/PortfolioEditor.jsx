import { useState, useEffect } from 'react';
import { DashSidebar } from './Dashboard';
import { portfolioAPI } from '../services/api';
import { DEFAULT_CONFIG } from './Portfolio';

const TABS = ['Hero', 'About', 'Skills', 'Experience', 'Projects', 'Contact', 'Appearance'];

const PlusIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>;
const SaveIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const EyeIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>;

const Field = ({ label, children, hint }) => (
  <div className="form-group">
    <label className="form-label">{label}</label>
    {children}
    {hint && <div style={{ fontSize: '.75rem', color: 'var(--text-muted)', marginTop: '.25rem' }}>{hint}</div>}
  </div>
);

/* ─── HERO TAB ─── */
function HeroTab({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <Field label="Full Name"><input className="form-input" value={data.name} onChange={set('name')} placeholder="Shivakumar Bommineni" /></Field>
        <Field label="Title / Role"><input className="form-input" value={data.title} onChange={set('title')} placeholder="Full Stack Developer" /></Field>
        <Field label="Handle (brand name)"><input className="form-input" value={data.handle} onChange={set('handle')} placeholder="shivakumar_dev" /></Field>
        <Field label="Eyebrow Text"><input className="form-input" value={data.eyebrow} onChange={set('eyebrow')} placeholder="Available for freelance & full-time roles" /></Field>
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

/* ─── ABOUT TAB ─── */
function AboutTab({ data, onChange }) {
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

/* ─── SKILLS TAB ─── */
function SkillsTab({ data, onChange }) {
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

/* ─── EXPERIENCE TAB ─── */
function ExperienceTab({ data, onChange }) {
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

/* ─── PROJECTS TAB ─── */
function ProjectsTab({ data, onChange }) {
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

/* ─── CONTACT TAB ─── */
function ContactTab({ data, onChange }) {
  const set = (k) => (e) => onChange({ ...data, [k]: e.target.value });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 500 }}>
      <Field label="Email Address"><input className="form-input" value={data.email} onChange={set('email')} type="email" placeholder="you@example.com" /></Field>
      <Field label="GitHub Profile URL"><input className="form-input" value={data.github} onChange={set('github')} type="url" placeholder="https://github.com/username" /></Field>
      <Field label="LinkedIn Profile URL"><input className="form-input" value={data.linkedin} onChange={set('linkedin')} type="url" placeholder="https://linkedin.com/in/..." /></Field>
    </div>
  );
}

/* ─── APPEARANCE TAB ─── */
function AppearanceTab({ data, onChange }) {
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

/* ─── MAIN ─── */
export default function PortfolioEditor() {
  const [tab, setTab] = useState(0);
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    portfolioAPI.get()
      .then((res) => {
        const merged = res.data.config
          ? { ...DEFAULT_CONFIG, ...res.data.config, hero: { ...DEFAULT_CONFIG.hero, ...res.data.config.hero }, about: { ...DEFAULT_CONFIG.about, ...res.data.config.about }, theme: { ...DEFAULT_CONFIG.theme, ...res.data.config.theme }, contact: { ...DEFAULT_CONFIG.contact, ...res.data.config.contact } }
          : JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        setConfig(merged);
      })
      .catch(() => setConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG))))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      await portfolioAPI.save(config);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const update = (section) => (val) => setConfig((c) => ({ ...c, [section]: val }));

  if (loading) return (
    <div className="dash-layout">
      <DashSidebar active="portfolio-editor" />
      <div className="dash-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>Loading portfolio data…</div>
      </div>
    </div>
  );

  return (
    <div className="dash-layout">
      <DashSidebar active="portfolio-editor" />
      <div className="dash-main">
        <header className="dash-topbar">
          <div className="dash-topbar-title">🎨 Portfolio Editor</div>
          <div className="dash-topbar-right">
            <a href="/" target="_blank" rel="noreferrer" className="btn btn-outline btn-sm">
              <EyeIcon /> Preview
            </a>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : saved ? '✓ Saved!' : <><SaveIcon /> Save All</>}
            </button>
          </div>
        </header>

        <div className="dash-content">
          {error && <div className="alert alert-error" style={{ marginBottom: '1rem' }}>{error}</div>}
          {saved && <div className="alert alert-success" style={{ marginBottom: '1rem' }}>✓ Portfolio saved and live at your domain!</div>}

          <div style={{ display: 'flex', gap: '.25rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', overflowX: 'auto' }}>
            {TABS.map((t, i) => (
              <button key={t} onClick={() => setTab(i)}
                style={{
                  padding: '.75rem 1.125rem', border: 'none', background: 'none',
                  fontWeight: 600, fontSize: '.875rem', cursor: 'pointer', white: 'nowrap',
                  color: tab === i ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: tab === i ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  fontFamily: 'inherit', flexShrink: 0,
                }}>
                {t}
              </button>
            ))}
          </div>

          <div style={{ maxWidth: 860 }}>
            {tab === 0 && config && <HeroTab data={config.hero} onChange={update('hero')} />}
            {tab === 1 && config && <AboutTab data={config.about} onChange={update('about')} />}
            {tab === 2 && config && <SkillsTab data={config.skills} onChange={update('skills')} />}
            {tab === 3 && config && <ExperienceTab data={config.experience || []} onChange={update('experience')} />}
            {tab === 4 && config && <ProjectsTab data={config.projects} onChange={update('projects')} />}
            {tab === 5 && config && <ContactTab data={config.contact} onChange={update('contact')} />}
            {tab === 6 && config && <AppearanceTab data={config.theme} onChange={update('theme')} />}
          </div>
        </div>
      </div>
    </div>
  );
}
