import React, { useState, useEffect, useRef } from 'react';
import { DashSidebar } from '../Dashboard';
import { resumeAPI } from '../../services/api';
import { DEFAULT_RESUME } from './config/defaultResume';
import { SaveIcon, PrintIcon } from './components/ResumeIcons';
import EditorPanel from './components/EditorPanel';
import ResumePreview from './components/ResumePreview';

export { DEFAULT_RESUME };

export default function ResumeBuilder() {
  const [resume, setResume] = useState(DEFAULT_RESUME);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const previewRef = useRef(null);

  useEffect(() => {
    resumeAPI.get()
      .then((res) => {
        if (res.data.data) setResume({ ...DEFAULT_RESUME, ...res.data.data });
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
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
    setTimeout(() => {
      win.print();
      win.close();
    }, 300);
  };

  if (loading) return (
    <div className="dash-layout">
      <DashSidebar active="resume" />
      <div className="dash-main">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
          Loading resume…
        </div>
      </div>
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
