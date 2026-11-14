import React from 'react';
import { FLabel, FInput, FTextarea, SLabel, G2 } from './FormControls';
import { PlusIcon, TrashIcon } from './ResumeIcons';

export default function EditorPanel({ resume, setResume }) {
  const set = (section, key) => (e) =>
    setResume((r) => ({
      ...r,
      [section]: { ...r[section], [key]: e.target.value },
    }));

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

  const addBullet = (i) => {
    const exp = [...resume.experience];
    exp[i] = { ...exp[i], bullets: [...exp[i].bullets, ''] };
    setResume((r) => ({ ...r, experience: exp }));
  };

  const removeBullet = (i, j) => {
    const exp = [...resume.experience];
    exp[i] = { ...exp[i], bullets: exp[i].bullets.filter((_, k) => k !== j) };
    setResume((r) => ({ ...r, experience: exp }));
  };

  const addExp = () =>
    setResume((r) => ({
      ...r,
      experience: [
        ...r.experience,
        { company: '', role: '', startDate: '', endDate: '', location: '', bullets: [''] },
      ],
    }));

  const removeExp = (i) =>
    setResume((r) => ({
      ...r,
      experience: r.experience.filter((_, j) => j !== i),
    }));

  const setEdu = (i, key) => (e) => {
    const edu = [...resume.education];
    edu[i] = { ...edu[i], [key]: e.target.value };
    setResume((r) => ({ ...r, education: edu }));
  };

  const addEdu = () =>
    setResume((r) => ({
      ...r,
      education: [...r.education, { school: '', degree: '', startDate: '', endDate: '', gpa: '' }],
    }));

  const removeEdu = (i) =>
    setResume((r) => ({
      ...r,
      education: r.education.filter((_, j) => j !== i),
    }));

  const setProj = (i, key) => (e) => {
    const proj = [...resume.projects];
    proj[i] = { ...proj[i], [key]: e.target.value };
    setResume((r) => ({ ...r, projects: proj }));
  };

  const addProj = () =>
    setResume((r) => ({
      ...r,
      projects: [...r.projects, { name: '', desc: '', tech: '', link: '' }],
    }));

  const removeProj = (i) =>
    setResume((r) => ({
      ...r,
      projects: r.projects.filter((_, j) => j !== i),
    }));

  return (
    <div style={{ padding: '1.25rem', overflowY: 'auto', height: '100%' }}>
      <SLabel>Header</SLabel>
      <G2>
        <div><FLabel>Full Name</FLabel><FInput value={resume.header.name} onChange={set('header', 'name')} placeholder="Your Name" /></div>
        <div><FLabel>Job Title</FLabel><FInput value={resume.header.title} onChange={set('header', 'title')} placeholder="Full Stack Developer" /></div>
        <div><FLabel>Email</FLabel><FInput value={resume.header.email} onChange={set('header', 'email')} placeholder="you@example.com" /></div>
        <div><FLabel>Phone</FLabel><FInput value={resume.header.phone} onChange={set('header', 'phone')} placeholder="+91 ..." /></div>
        <div><FLabel>Location</FLabel><FInput value={resume.header.location} onChange={set('header', 'location')} placeholder="Hyderabad, India" /></div>
        <div><FLabel>LinkedIn</FLabel><FInput value={resume.header.linkedin} onChange={set('header', 'linkedin')} placeholder="linkedin.com/in/..." /></div>
        <div><FLabel>GitHub</FLabel><FInput value={resume.header.github} onChange={set('header', 'github')} placeholder="github.com/..." /></div>
        <div><FLabel>Website / Portfolio</FLabel><FInput value={resume.header.website} onChange={set('header', 'website')} placeholder="https://..." /></div>
      </G2>

      <SLabel>Professional Summary</SLabel>
      <div style={{ marginBottom: '.625rem' }}>
        <FTextarea value={resume.summary} onChange={(e) => setResume((r) => ({ ...r, summary: e.target.value }))} rows={4} placeholder="Brief summary of your expertise..." />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SLabel>Work Experience</SLabel>
        <button className="btn btn-outline btn-sm" onClick={addExp} style={{ padding: '.25rem .6rem', fontSize: '.75rem' }}><PlusIcon /> Add</button>
      </div>
      {resume.experience.map((exp, i) => (
        <div key={i} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 8, padding: '.875rem', marginBottom: '.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '.8rem' }}>Role #{i + 1}</span>
            <button onClick={() => removeExp(i)} style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}><TrashIcon /></button>
          </div>
          <G2>
            <div><FLabel>Company</FLabel><FInput value={exp.company} onChange={setExp(i, 'company')} placeholder="Company" /></div>
            <div><FLabel>Role</FLabel><FInput value={exp.role} onChange={setExp(i, 'role')} placeholder="Full Stack Developer" /></div>
            <div><FLabel>Start Date</FLabel><FInput value={exp.startDate} onChange={setExp(i, 'startDate')} placeholder="Jan 2022" /></div>
            <div><FLabel>End Date</FLabel><FInput value={exp.endDate} onChange={setExp(i, 'endDate')} placeholder="Present" /></div>
            <div style={{ gridColumn: 'span 2' }}><FLabel>Location</FLabel><FInput value={exp.location} onChange={setExp(i, 'location')} placeholder="City, Country" /></div>
          </G2>
          <div style={{ marginTop: '.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.3rem' }}>
              <FLabel>Bullet Points</FLabel>
              <button onClick={() => addBullet(i)} style={{ border: 'none', background: 'none', color: 'var(--primary)', cursor: 'pointer', fontSize: '.73rem', fontWeight: 700 }}>+ Add Bullet</button>
            </div>
            {exp.bullets.map((b, j) => (
              <div key={j} style={{ display: 'flex', gap: '.35rem', marginBottom: '.35rem' }}>
                <FInput value={b} onChange={setBullet(i, j)} placeholder={`Bullet ${j + 1}...`} />
                <button onClick={() => removeBullet(i, j)} style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer', flexShrink: 0 }}><TrashIcon /></button>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SLabel>Education</SLabel>
        <button className="btn btn-outline btn-sm" onClick={addEdu} style={{ padding: '.25rem .6rem', fontSize: '.75rem' }}><PlusIcon /> Add</button>
      </div>
      {resume.education.map((edu, i) => (
        <div key={i} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 8, padding: '.875rem', marginBottom: '.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '.8rem' }}>Degree #{i + 1}</span>
            <button onClick={() => removeEdu(i)} style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}><TrashIcon /></button>
          </div>
          <G2>
            <div><FLabel>Degree</FLabel><FInput value={edu.degree} onChange={setEdu(i, 'degree')} placeholder="B.Tech Computer Science" /></div>
            <div><FLabel>School / College</FLabel><FInput value={edu.school} onChange={setEdu(i, 'school')} placeholder="University Name" /></div>
            <div><FLabel>Year / Dates</FLabel><FInput value={edu.startDate} onChange={setEdu(i, 'startDate')} placeholder="2018 – 2022" /></div>
            <div><FLabel>GPA / Grade</FLabel><FInput value={edu.gpa} onChange={setEdu(i, 'gpa')} placeholder="8.5 / 10" /></div>
          </G2>
        </div>
      ))}

      <SLabel>Skills</SLabel>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '.625rem', marginBottom: '.625rem' }}>
        <div><FLabel>Languages</FLabel><FInput value={resume.skills.languages} onChange={set('skills', 'languages')} placeholder="JavaScript, Python..." /></div>
        <div><FLabel>Frameworks & Libraries</FLabel><FInput value={resume.skills.frameworks} onChange={set('skills', 'frameworks')} placeholder="React.js, Node.js, Express..." /></div>
        <div><FLabel>Databases</FLabel><FInput value={resume.skills.databases} onChange={set('skills', 'databases')} placeholder="PostgreSQL, MongoDB..." /></div>
        <div><FLabel>Dev Tools & Cloud</FLabel><FInput value={resume.skills.tools} onChange={set('skills', 'tools')} placeholder="Git, Docker, AWS..." /></div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <SLabel>Projects</SLabel>
        <button className="btn btn-outline btn-sm" onClick={addProj} style={{ padding: '.25rem .6rem', fontSize: '.75rem' }}><PlusIcon /> Add</button>
      </div>
      {resume.projects.map((proj, i) => (
        <div key={i} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', borderRadius: 8, padding: '.875rem', marginBottom: '.75rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '.5rem' }}>
            <span style={{ fontWeight: 700, fontSize: '.8rem' }}>Project #{i + 1}</span>
            <button onClick={() => removeProj(i)} style={{ border: 'none', background: 'none', color: 'var(--error)', cursor: 'pointer' }}><TrashIcon /></button>
          </div>
          <G2>
            <div><FLabel>Project Name</FLabel><FInput value={proj.name} onChange={setProj(i, 'name')} placeholder="Project Title" /></div>
            <div><FLabel>Link / URL</FLabel><FInput value={proj.link} onChange={setProj(i, 'link')} placeholder="github.com/... or live URL" /></div>
          </G2>
          <div style={{ marginBottom: '.5rem' }}><FLabel>Tech Used</FLabel><FInput value={proj.tech} onChange={setProj(i, 'tech')} placeholder="React, Node.js, PostgreSQL" /></div>
          <div><FLabel>Description</FLabel><FTextarea value={proj.desc} onChange={setProj(i, 'desc')} rows={2} placeholder="Brief summary of what this project does..." /></div>
        </div>
      ))}
    </div>
  );
}
