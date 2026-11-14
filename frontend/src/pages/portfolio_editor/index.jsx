import React, { useState, useEffect } from 'react';
import { DashSidebar } from '../Dashboard';
import { portfolioAPI } from '../../services/api';
import { DEFAULT_CONFIG } from '../portfolio_view/config/defaultConfig';
import { TABS } from './constants';
import { SaveIcon, EyeIcon } from './components/EditorIcons';

// Tabs
import HeroTab from './tabs/HeroTab';
import AboutTab from './tabs/AboutTab';
import SkillsTab from './tabs/SkillsTab';
import ExperienceTab from './tabs/ExperienceTab';
import ProjectsTab from './tabs/ProjectsTab';
import ContactTab from './tabs/ContactTab';
import AppearanceTab from './tabs/AppearanceTab';

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
          ? {
              ...DEFAULT_CONFIG,
              ...res.data.config,
              hero: { ...DEFAULT_CONFIG.hero, ...res.data.config.hero },
              about: { ...DEFAULT_CONFIG.about, ...res.data.config.about },
              theme: { ...DEFAULT_CONFIG.theme, ...res.data.config.theme },
              contact: { ...DEFAULT_CONFIG.contact, ...res.data.config.contact },
            }
          : JSON.parse(JSON.stringify(DEFAULT_CONFIG));
        setConfig(merged);
      })
      .catch(() => setConfig(JSON.parse(JSON.stringify(DEFAULT_CONFIG))))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSaved(false);
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, color: 'var(--text-muted)' }}>
          Loading portfolio data…
        </div>
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
                  fontWeight: 600, fontSize: '.875rem', cursor: 'pointer', whiteSpace: 'nowrap',
                  color: tab === i ? 'var(--primary)' : 'var(--text-muted)',
                  borderBottom: tab === i ? '2.5px solid var(--primary)' : '2.5px solid transparent',
                  fontFamily: 'inherit', flexShrink: 0,
                }}>
                {t}
              </button>
            ))}
          </div>

          {tab === 0 && <HeroTab data={config.hero} onChange={update('hero')} />}
          {tab === 1 && <AboutTab data={config.about} onChange={update('about')} />}
          {tab === 2 && <SkillsTab data={config.skills || []} onChange={update('skills')} />}
          {tab === 3 && <ExperienceTab data={config.experience || []} onChange={update('experience')} />}
          {tab === 4 && <ProjectsTab data={config.projects || []} onChange={update('projects')} />}
          {tab === 5 && <ContactTab data={config.contact} onChange={update('contact')} />}
          {tab === 6 && <AppearanceTab data={config.theme} onChange={update('theme')} />}
        </div>
      </div>
    </div>
  );
}
