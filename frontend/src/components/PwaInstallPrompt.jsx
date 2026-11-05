import { useState, useEffect } from 'react';

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIosGuide, setShowIosGuide] = useState(false);

  useEffect(() => {
    // Check if running in standalone mode (already installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.navigator.standalone === true;

    if (isStandalone) return;

    // Check if dismissed in this session
    if (sessionStorage.getItem('pwa_prompt_dismissed') === 'true') return;

    // Detect iOS
    const ua = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(ua);
    setIsIOS(isIosDevice);

    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      // Reveal prompt after 3s delay for smooth non-intrusive appearance
      setTimeout(() => setIsVisible(true), 3000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // If on iOS and not standalone, reveal prompt after 4 seconds
    if (isIosDevice) {
      const timer = setTimeout(() => setIsVisible(true), 4000);
      return () => clearTimeout(timer);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (isIOS) {
      setShowIosGuide(true);
      return;
    }

    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setIsVisible(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setShowIosGuide(false);
    sessionStorage.setItem('pwa_prompt_dismissed', 'true');
  };

  if (!isVisible) return null;

  return (
    <div
      role="dialog"
      aria-label="Install App"
      style={{
        position: 'fixed',
        bottom: '1.25rem',
        right: '1.25rem',
        zIndex: 9999,
        maxWidth: '380px',
        width: 'calc(100vw - 2.5rem)',
        background: 'var(--surface, #ffffff)',
        border: '1px solid var(--border, #e2e8f0)',
        borderRadius: '16px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.16), 0 2px 8px rgba(0, 0, 0, 0.08)',
        padding: '1rem 1.15rem',
        backdropFilter: 'blur(12px)',
        animation: 'slideUpPrompt .35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '.85rem' }}>
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: 12,
            background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 900,
            fontSize: '1.1rem',
            flexShrink: 0,
            boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
          }}
        >
          SB
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.2rem' }}>
            <span style={{ fontSize: '.88rem', fontWeight: 800, color: 'var(--text, #0f172a)' }}>
              Install ShivaKumar_B App
            </span>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-muted, #94a3b8)',
                cursor: 'pointer',
                padding: '.2rem',
                fontSize: '.9rem',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          <p style={{ margin: 0, fontSize: '.78rem', color: 'var(--text-sec, #64748b)', lineHeight: 1.4, marginBottom: '.75rem' }}>
            Install to your home screen or desktop for fast, offline-ready access to projects & dashboard.
          </p>

          {showIosGuide && (
            <div
              style={{
                background: 'var(--surface-alt, #f8fafc)',
                border: '1px solid var(--border, #e2e8f0)',
                borderRadius: '8px',
                padding: '.6rem .75rem',
                fontSize: '.74rem',
                color: 'var(--text, #0f172a)',
                marginBottom: '.75rem',
                lineHeight: 1.5,
              }}
            >
              Tap the <strong>Share</strong> button <span style={{ fontSize: '1rem' }}>⎋</span> at the bottom of Safari, then choose <strong>&ldquo;Add to Home Screen&rdquo;</strong> <span style={{ fontSize: '1rem' }}>⊞</span>.
            </div>
          )}

          <div style={{ display: 'flex', gap: '.5rem' }}>
            <button
              onClick={handleInstallClick}
              className="btn btn-primary"
              style={{
                flex: 1,
                padding: '.5rem .85rem',
                fontSize: '.78rem',
                fontWeight: 700,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '.4rem',
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {isIOS ? 'Show How to Install' : 'Install App'}
            </button>
            <button
              onClick={handleDismiss}
              style={{
                padding: '.5rem .75rem',
                fontSize: '.78rem',
                fontWeight: 600,
                color: 'var(--text-muted, #94a3b8)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              Later
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

