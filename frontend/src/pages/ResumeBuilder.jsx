import { useState, useEffect, useRef } from 'react';
import { DashSidebar } from './Dashboard';
import { resumeAPI } from '../services/api';

const DEFAULT_RESUME = {
  header: { name: 'Shivakumar Bommineni', title: 'Full Stack Developer', email: 'xrdashboard.chrp@gmail.com', phone: '+91 79912 34567', location: 'Hyderabad, India', linkedin: 'linkedin.com/in/shivakumar', github: 'github.com/Shivakumar-dev9177', website: '' },
  summary: 'Full Stack Developer with hands-on experience building enterprise web applications with React.js, Node.js, Express.js, SQL/PostgreSQL, and REST APIs. Proven experience in enterprise LMS, internal HRIS & ATS platforms, and high-performance customer-facing applications.',
  experience: [
    { company: 'CHRP-INDIA', role: 'Full Stack Developer', startDate: '2026', endDate: 'Present', location: 'Hyderabad', bullets: ['Project: Schneider Electric – LMS: Developed & maintained enterprise LMS using React.js, Node.js, Express.js, SQL/PostgreSQL, and REST APIs for Admin, Trainer, Learner, and Super Admin modules.', 'Engineered backend APIs for courses, assessments, trainer management, notifications, feedback, reporting, dynamic analytics dashboards, and RBAC with data isolation.', 'Project: Internal HRIS Application: Built full-stack features using React.js & Node.js for Employee Management, Appraisals, Interview Scheduling, and responsive search/filtering interfaces.', 'Project: Internal Applicant Tracking System (ATS): Developed recruitment modules covering candidate management, walk-in validation, interview scheduling, inline DOCX/PDF preview, and RBAC visibility.'] },
    { company: 'Perennial Code IT & Consultant Pvt. Ltd.', role: 'Full Stack Web Developer', startDate: '2025', endDate: '2026', location: 'Hyderabad', bullets: ['Developed full-stack web applications using React.js, Node.js, Express.js, SQL, MongoDB, HTML, CSS, and JavaScript.', 'Developed responsive and reusable frontend components using React.js and Bootstrap; integrated frontend with backend REST APIs.', 'Implemented secure authentication, CRUD operations, form validation, and complex SQL/MySQL and MongoDB queries.', 'Collaborated on production web platforms including hospital booking systems (BookMyOT) and e-commerce applications, deploying on Hostinger and cloud platforms.'] },
  ],
  education: [
    { school: 'B.Tech / University', degree: 'Bachelor of Technology', startDate: 'Completed', endDate: '', gpa: '' },
  ],
  skills: { languages: 'JavaScript, TypeScript, SQL, HTML5, CSS3', frameworks: 'React.js, Next.js, Node.js, Express.js, Bootstrap, Tailwind CSS', databases: 'PostgreSQL, MySQL, MongoDB, SQL', tools: 'Git, GitHub, Docker, Postman, Hostinger, VS Code' },
  projects: [
    { name: 'BookMyOT – Hospital Booking Platform', desc: 'Hospital booking platform to streamline scheduling of anesthetists and surgeons with responsive dashboards and Hostinger deployment', tech: 'React.js, SQL, Node.js, Hostinger', link: '' },
    { name: 'Giivv – E-Commerce Website (PWA)', desc: 'Responsive e-commerce platform with progressive web app (PWA) features, dynamic shopping cart, product wishlist, category filters', tech: 'React.js, PWA, JavaScript, REST APIs', link: '' },
    { name: 'Smart Visitor Management System with QR Code', desc: 'Contactless visitor management system utilizing dynamic QR code passes delivered via WhatsApp and Email for instant check-in', tech: 'React.js, Node.js, Express.js, SQL, QR Code, WhatsApp API', link: '' },
  ],
};

const SaveIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M19 21H5a2 2 0 01-2-2V5a2 2 0 012-2h11l5 5v11a2 2 0 01-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>;
const PrintIcon = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>;
const PlusIcon = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>;
const TrashIcon = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/></svg>;

const FLabel = ({ children }) => <div style={{ fontSize: '.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '.25rem', textTransform: 'uppercase', letterSpacing: '.03em' }}>{children}</div>;
const FInput = ({ value, onChange, placeholder, type = 'text', mono }) => (
  <input type={type} value={value} onChange={onChange} placeholder={placeholder}
    style={{ width: '100%', padding: '.5rem .75rem', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-alt)', color: 'var(--text)', fontSize: '.82rem', outline: 'none', fontFamily: mono ? 'monospace' : 'inherit' }}
    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
  />
);
const FTextarea = ({ value, onChange, placeholder, rows = 3 }) => (
  <textarea value={value} onChange={onChange} placeholder={placeholder} rows={rows}
    style={{ width: '100%', padding: '.5rem .75rem', border: '1px solid var(--border)', borderRadius: 6, background: 'var(--bg-alt)', color: 'var(--text)', fontSize: '.82rem', outline: 'none', resize: 'vertical', fontFamily: 'inherit', lineHeight: 1.6 }}
    onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
    onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
  />
);
const SLabel = ({ children }) => (
  <div style={{ fontSize: '.72rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '.08em', margin: '1rem 0 .5rem', borderBottom: '1px solid var(--border)', paddingBottom: '.4rem' }}>
    {children}
  </div>
);
const G2 = ({ children }) => <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '.625rem', marginBottom: '.625rem' }}>{children}</div>;

/* ─────────────────────────────
   LEFT PANEL — EDITOR
───────────────────────────── */
function EditorPanel({ resume, setResume }) {
  const set = (section, key) => (e) => setResume((r) => ({ ...r, [section]: { ...r[section], [key]: e.target.value } }));
  const setExp = (i, key) => (e) => {
    const exp = [...resume.experience];
    exp[i] = { ...exp[i], [key]: e.target.value };
    setResume((r) => ({ ...r, experience: exp }));
  };
  const setBullet = (i, j) => (e) => {
    const exp = [...resume.experience];
    const bullets = [...exp[i].bullets];
    bullets[j] = e.target.value;
    exp[i] = { ...exp[i], bullets };
    setResume((r) => ({ ...r, experience: exp }));
  };
  const addBullet = (i) => { const exp = [...resume.experience]; exp[i] = { ...exp[i], bullets: [...exp[i].bullets, ''] }; setResume((r) => ({ ...r, experience: exp })); };
  const removeBullet = (i, j) => { const exp = [...resume.experience]; exp[i] = { ...exp[i], bullets: exp[i].bullets.filter((_, k) => k !== j) }; setResume((r) => ({ ...r, experience: exp })); };
  const addExp = () => setResume((r) => ({ ...r, experience: [...r.experience, { company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''] }] }));
  const removeExp = (i) => setResume((r) => ({ ...r, experience: r.experience.filter((_, j) => j !== i) }));

  const setEdu = (i, key) => (e) => {
    const edu = [...resume.education];
    edu[i] = { ...edu[i], [key]: e.target.value };
    setResume((r) => ({ ...r, education: edu }));
  };
  const addEdu = () => setResume((r) => ({ ...r, education: [...r.education, { school: '', degree: '', startDate: '', endDate: '', gpa: '' }] }));
  const removeEdu = (i) => setResume((r) => ({ ...r, education: r.education.filter((_, j) => j !== i) }));

  const setProj = (i, key) => (e) => {
    const proj = [...resume.projects];
    proj[i] = { ...proj[i], [key]: e.target.value };
    setResume((r) => ({ ...r, projects: proj }));
  };
  const addProj = () => setResume((r) => ({ ...r, projects: [...r.projects, { name: '', desc: '', tech: '', link: '' }] }));
  const removeProj = (i) => setResume((r) => ({ ...r, projects: r.projects.filter((_, j) => j !== i) }));

  const ed = resume.editor_style || {};
  const setStyle = (key) => (e) => setResume((r) => ({ ...r, editor_style: { ...r.editor_style, [key]: e.target.value } }));

  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto', height: '100%' }}>

      <SLabel>Header</SLabel>
      <G2>
        <div><FLabel>Full Name</FLabel><FInput value={resume.header.name} onChange={set('header','name')} placeholder="Your Name" /></div>
        <div><FLabel>Job Title</FLabel><FInput value={resume.header.title} onChange={set('header','title')} placeholder="Full Stack Developer" /></div>
        <div><FLabel>Email</FLabel><FInput value={resume.header.email} onChange={set('header','email')} placeholder="you@example.com" /></div>
        <div><FLabel>Phone</FLabel><FInput value={resume.header.phone} onChange={set('header','phone')} placeholder="+91 ..." /></div>
        <div><FLabel>Location</FLabel><FInput value={resume.header.location} onChange={set('header','location')} placeholder="Hyderabad, India" /></div>
        <div><FLabel>Website (optional)</FLabel><FInput value={resume.header.website} onChange={set('header','website')} placeholder="yoursite.com" /></div>
        <div><FLabel>LinkedIn</FLabel><FInput value={resume.header.linkedin} onChange={set('header','linkedin')} placeholder="linkedin.com/in/..." /></div>
        <div><FLabel>GitHub</FLabel><FInput value={resume.header.github} onChange={set('header','github')} placeholder="github.com/..." /></div>
      </G2>

      <SLabel>Summary</SLabel>
      <FTextarea value={resume.summary} onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))} placeholder="Professional summary..." rows={3} />

      <SLabel>Experience <button onClick={addExp} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', verticalAlign: 'middle', padding: '0 .25rem' }}><PlusIcon /></button></SLabel>
      {resume.experience.map((exp, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '.875rem', marginBottom: '.75rem', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Job #{i + 1}</span>
            <button onClick={() => removeExp(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--error)' }}><TrashIcon /></button>
          </div>
          <G2>
            <div><FLabel>Company</FLabel><FInput value={exp.company} onChange={setExp(i,'company')} placeholder="Company Name" /></div>
            <div><FLabel>Role</FLabel><FInput value={exp.role} onChange={setExp(i,'role')} placeholder="Full Stack Developer" /></div>
            <div><FLabel>Start Date</FLabel><FInput value={exp.startDate} onChange={setExp(i,'startDate')} placeholder="Jan 2022" /></div>
            <div><FLabel>End Date</FLabel><FInput value={exp.endDate} onChange={setExp(i,'endDate')} placeholder="Present" /></div>
            <div><FLabel>Location</FLabel><FInput value={exp.location} onChange={setExp(i,'location')} placeholder="Remote" /></div>
          </G2>
          <FLabel>Bullet Points <button onClick={() => addBullet(i)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', padding: '0 .25rem', verticalAlign: 'middle' }}><PlusIcon /></button></FLabel>
          {exp.bullets.map((b, j) => (
            <div key={j} style={{ display: 'flex', gap: '.375rem', marginBottom: '.3rem' }}>
              <FInput value={b} onChange={setBullet(i, j)} placeholder="Achievement or responsibility..." />
              <button onClick={() => removeBullet(i, j)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--error)', flexShrink: 0 }}><TrashIcon /></button>
            </div>
          ))}
        </div>
      ))}

      <SLabel>Education <button onClick={addEdu} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', verticalAlign: 'middle', padding: '0 .25rem' }}><PlusIcon /></button></SLabel>
      {resume.education.map((edu, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '.875rem', marginBottom: '.75rem', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Edu #{i + 1}</span>
            <button onClick={() => removeEdu(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--error)' }}><TrashIcon /></button>
          </div>
          <G2>
            <div style={{ gridColumn: '1/-1' }}><FLabel>School / University</FLabel><FInput value={edu.school} onChange={setEdu(i,'school')} placeholder="University Name" /></div>
            <div style={{ gridColumn: '1/-1' }}><FLabel>Degree</FLabel><FInput value={edu.degree} onChange={setEdu(i,'degree')} placeholder="B.Tech in Computer Science" /></div>
            <div><FLabel>Start Year</FLabel><FInput value={edu.startDate} onChange={setEdu(i,'startDate')} placeholder="2018" /></div>
            <div><FLabel>End Year</FLabel><FInput value={edu.endDate} onChange={setEdu(i,'endDate')} placeholder="2022" /></div>
            <div><FLabel>GPA (optional)</FLabel><FInput value={edu.gpa} onChange={setEdu(i,'gpa')} placeholder="8.5/10" /></div>
          </G2>
        </div>
      ))}

      <SLabel>Skills</SLabel>
      {[['languages','Languages / Tools'],['frameworks','Frameworks'],['databases','Databases'],['tools','Dev Tools']].map(([k,label]) => (
        <div key={k} style={{ marginBottom: '.5rem' }}>
          <FLabel>{label}</FLabel>
          <FInput value={resume.skills[k]} onChange={(e) => setResume((r) => ({ ...r, skills: { ...r.skills, [k]: e.target.value } }))} placeholder="JavaScript, TypeScript..." />
        </div>
      ))}

      <SLabel>Projects <button onClick={addProj} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', verticalAlign: 'middle', padding: '0 .25rem' }}><PlusIcon /></button></SLabel>
      {resume.projects.map((p, i) => (
        <div key={i} style={{ border: '1px solid var(--border)', borderRadius: 8, padding: '.875rem', marginBottom: '.75rem', background: 'var(--surface)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '.5rem' }}>
            <span style={{ fontSize: '.78rem', fontWeight: 700, color: 'var(--text-muted)' }}>Project #{i + 1}</span>
            <button onClick={() => removeProj(i)} style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--error)' }}><TrashIcon /></button>
          </div>
          <G2>
            <div><FLabel>Name</FLabel><FInput value={p.name} onChange={setProj(i,'name')} placeholder="Project Name" /></div>
            <div><FLabel>Tech Stack</FLabel><FInput value={p.tech} onChange={setProj(i,'tech')} placeholder="React, Node.js" /></div>
            <div style={{ gridColumn: '1/-1' }}><FLabel>Description</FLabel><FInput value={p.desc} onChange={setProj(i,'desc')} placeholder="Short description..." /></div>
            <div><FLabel>Link (optional)</FLabel><FInput value={p.link} onChange={setProj(i,'link')} placeholder="github.com/..." /></div>
          </G2>
        </div>
      ))}
    </div>
  );
}

/* ─────────────────────────────
   RIGHT PANEL — RESUME PREVIEW
───────────────────────────── */
function ResumePreview({ resume, previewRef }) {
  const H = resume.header;
  const contacts = [H.email, H.phone, H.location, H.website, H.linkedin, H.github].filter(Boolean);

  const SecHead = ({ children }) => (
    <div style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#1e293b', borderBottom: '1.5px solid #1e293b', paddingBottom: 4, marginTop: 14, marginBottom: 6 }}>
      {children}
    </div>
  );

  return (
    <div ref={previewRef} id="resume-preview" style={{ background: '#fff', width: '100%', maxWidth: 720, minHeight: 1000, margin: '0 auto', padding: '40px 48px', fontFamily: '"Times New Roman", Georgia, serif', fontSize: 11, lineHeight: 1.5, color: '#0f172a', boxShadow: '0 4px 32px rgba(0,0,0,.15)', borderRadius: 4 }}>

      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: 12, borderBottom: '2px solid #1e293b', paddingBottom: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.3px', color: '#0f172a', fontFamily: 'Arial, sans-serif', marginBottom: 2 }}>{H.name || 'Your Name'}</div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', fontFamily: 'Arial, sans-serif', marginBottom: 6 }}>{H.title || 'Your Title'}</div>
        <div style={{ fontSize: 10, color: '#475569', display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '8px' }}>
          {contacts.map((c, i) => (
            <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {i > 0 && <span style={{ color: '#94a3b8' }}>·</span>}
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* SUMMARY */}
      {resume.summary && (
        <>
          <SecHead>Professional Summary</SecHead>
          <p style={{ fontSize: 11, lineHeight: 1.6, color: '#334155', margin: 0 }}>{resume.summary}</p>
        </>
      )}

      {/* EXPERIENCE */}
      {resume.experience?.filter((e) => e.company).length > 0 && (
        <>
          <SecHead>Experience</SecHead>
          {resume.experience.filter((e) => e.company).map((exp, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <span style={{ fontWeight: 700, fontSize: 12, fontFamily: 'Arial, sans-serif' }}>{exp.role}</span>
                  {exp.company && <span style={{ color: '#475569' }}> — {exp.company}</span>}
                </div>
                <span style={{ fontSize: 10, color: '#64748b', flexShrink: 0 }}>{exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}{exp.location ? ` · ${exp.location}` : ''}</span>
              </div>
              {exp.bullets?.filter(Boolean).length > 0 && (
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
                  {exp.bullets.filter(Boolean).map((b, j) => <li key={j} style={{ fontSize: 10.5, color: '#334155', marginBottom: 2 }}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </>
      )}

      {/* EDUCATION */}
      {resume.education?.filter((e) => e.school).length > 0 && (
        <>
          <SecHead>Education</SecHead>
          {resume.education.filter((e) => e.school).map((edu, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 12, fontFamily: 'Arial, sans-serif' }}>{edu.degree}</div>
                <div style={{ color: '#475569', fontSize: 10.5 }}>{edu.school}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}</div>
              </div>
              <div style={{ fontSize: 10, color: '#64748b' }}>{edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}</div>
            </div>
          ))}
        </>
      )}

      {/* SKILLS */}
      {Object.values(resume.skills).some(Boolean) && (
        <>
          <SecHead>Skills</SecHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
            {[['languages','Languages'], ['frameworks','Frameworks'], ['databases','Databases'], ['tools','Dev Tools']].filter(([k]) => resume.skills[k]).map(([k, label]) => (
              <div key={k} style={{ fontSize: 10.5 }}>
                <span style={{ fontWeight: 700 }}>{label}: </span>
                <span style={{ color: '#334155' }}>{resume.skills[k]}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* PROJECTS */}
      {resume.projects?.filter((p) => p.name).length > 0 && (
        <>
          <SecHead>Projects</SecHead>
          {resume.projects.filter((p) => p.name).map((p, i) => (
            <div key={i} style={{ marginBottom: 7 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, fontSize: 11.5, fontFamily: 'Arial, sans-serif' }}>{p.name}</span>
                {p.link && <span style={{ fontSize: 9.5, color: '#64748b' }}>{p.link}</span>}
              </div>
              {p.desc && <div style={{ fontSize: 10.5, color: '#334155' }}>{p.desc}</div>}
              {p.tech && <div style={{ fontSize: 10, color: '#475569', fontStyle: 'italic' }}>Tech: {p.tech}</div>}
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ─── MAIN PAGE ─── */
export default function ResumeBuilder() {
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef(null);

  useEffect(() => {
    resumeAPI.get()
      .then((res) => { if (res.data.data) setResume({ ...DEFAULT_RESUME, ...res.data.data }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true); setError(''); setSaved(false);
    try {
      await resumeAPI.save(resume);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      setError('Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    const el = previewRef.current;
    if (!el) return;
    const win = window.open('', '_blank', 'width=900,height=1100');
    win.document.write(`<!DOCTYPE html><html><head><title>Resume — ${resume.header.name}</title><style>
      @page { margin: 0; size: A4; }
      body { margin: 0; padding: 0; background: white; font-family: "Times New Roman", Georgia, serif; }
      #resume-preview { box-shadow: none !important; border-radius: 0 !important; margin: 0 !important; max-width: 100% !important; }
    </style></head><body>${el.outerHTML}</body></html>`);
    win.document.close();
    win.focus();
    setTimeout(() => { win.print(); win.close(); }, 300);
  };

  if (loading) return (
    <div className="dash-layout">
      <DashSidebar active="resume" />
      <div className="dash-main"><div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>Loading resume…</div></div>
    </div>
  );

  return (
    <div className="dash-layout">
      <DashSidebar active="resume" />
      <div className="dash-main" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <header className="dash-topbar">
          <div className="dash-topbar-title">📄 Resume Builder</div>
          <div className="dash-topbar-right">
            {error && <span style={{ fontSize: '.8rem', color: 'var(--error)' }}>{error}</span>}
            {saved && <span style={{ fontSize: '.8rem', color: 'var(--success)', fontWeight: 600 }}>✓ Saved!</span>}
            <button className="btn btn-outline btn-sm" onClick={handlePrint}>
              <PrintIcon /> Print / PDF
            </button>
            <button className="btn btn-primary btn-sm" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : <><SaveIcon /> Save</>}
            </button>
          </div>
        </header>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '380px 1fr', overflow: 'hidden' }}>
          {/* Left: Editor */}
          <div style={{ borderRight: '1px solid var(--border)', overflowY: 'auto', background: 'var(--surface)' }}>
            <EditorPanel resume={resume} setResume={setResume} />
          </div>
          {/* Right: Preview */}
          <div style={{ overflowY: 'auto', padding: '2rem', background: 'var(--bg-alt)' }}>
            <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '1rem', fontWeight: 500 }}>
              Live Preview · Click "Print / PDF" to download
            </div>
            <ResumePreview resume={resume} previewRef={previewRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
