import React from 'react';

export default function ResumePreview({ resume, previewRef }) {
  const H = resume.header;
  const contacts = [H.email, H.phone, H.location, H.website, H.linkedin, H.github].filter(Boolean);

  const SecHead = ({ children }) => (
    <div style={{
      fontSize: 11, fontWeight: 800, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: '#1e293b', borderBottom: '1.5px solid #1e293b',
      paddingBottom: 4, marginTop: 14, marginBottom: 6,
    }}>
      {children}
    </div>
  );

  return (
    <div
      ref={previewRef}
      id="resume-preview"
      style={{
        background: '#fff', width: '100%', maxWidth: 720, minHeight: 1000,
        margin: '0 auto', padding: '40px 48px', fontFamily: '"Times New Roman", Georgia, serif',
        fontSize: 11, lineHeight: 1.5, color: '#0f172a',
        boxShadow: '0 4px 32px rgba(0,0,0,.15)', borderRadius: 4,
      }}
    >
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: 12, borderBottom: '2px solid #1e293b', paddingBottom: 10 }}>
        <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-.3px', color: '#0f172a', fontFamily: 'Arial, sans-serif', marginBottom: 2 }}>
          {H.name || 'Your Name'}
        </div>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#475569', fontFamily: 'Arial, sans-serif', marginBottom: 6 }}>
          {H.title || 'Your Title'}
        </div>
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
          <p style={{ fontSize: 11, lineHeight: 1.6, color: '#334155', margin: 0 }}>
            {resume.summary}
          </p>
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
                  <span style={{ fontWeight: 700, fontSize: 12, fontFamily: 'Arial, sans-serif' }}>
                    {exp.role}
                  </span>
                  {exp.company && <span style={{ color: '#475569' }}> — {exp.company}</span>}
                </div>
                <span style={{ fontSize: 10, color: '#64748b', flexShrink: 0 }}>
                  {exp.startDate}{exp.endDate ? ` – ${exp.endDate}` : ''}{exp.location ? ` · ${exp.location}` : ''}
                </span>
              </div>
              {exp.bullets?.filter(Boolean).length > 0 && (
                <ul style={{ margin: '4px 0 0 0', paddingLeft: 16 }}>
                  {exp.bullets.filter(Boolean).map((b, j) => (
                    <li key={j} style={{ fontSize: 10.5, color: '#334155', marginBottom: 2 }}>
                      {b}
                    </li>
                  ))}
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
                <div style={{ fontWeight: 700, fontSize: 12, fontFamily: 'Arial, sans-serif' }}>
                  {edu.degree}
                </div>
                <div style={{ color: '#475569', fontSize: 10.5 }}>
                  {edu.school}{edu.gpa ? ` · GPA: ${edu.gpa}` : ''}
                </div>
              </div>
              <div style={{ fontSize: 10, color: '#64748b' }}>
                {edu.startDate}{edu.endDate ? ` – ${edu.endDate}` : ''}
              </div>
            </div>
          ))}
        </>
      )}

      {/* SKILLS */}
      {Object.values(resume.skills || {}).some(Boolean) && (
        <>
          <SecHead>Skills</SecHead>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px 24px' }}>
            {[['languages', 'Languages'], ['frameworks', 'Frameworks'], ['databases', 'Databases'], ['tools', 'Dev Tools']]
              .filter(([k]) => resume.skills[k])
              .map(([k, label]) => (
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
                <span style={{ fontWeight: 700, fontSize: 11.5, fontFamily: 'Arial, sans-serif' }}>
                  {p.name}
                </span>
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
