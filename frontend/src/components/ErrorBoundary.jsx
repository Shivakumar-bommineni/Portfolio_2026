import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0a0a14',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily: "'JetBrains Mono', monospace",
        }}>
          <div style={{
            maxWidth: '750px',
            width: '100%',
            background: 'rgba(20, 15, 30, 0.95)',
            border: '1px solid #ff2e5b',
            borderRadius: '12px',
            padding: '32px',
            boxShadow: '0 0 40px rgba(255, 46, 91, 0.4)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <span style={{ fontSize: '1.5rem', color: '#ff2e5b' }}>⚠️</span>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ff2e5b', margin: 0 }}>
                CRITICAL APPLICATION ERROR
              </h2>
            </div>
            
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginBottom: '16px', lineHeight: 1.6 }}>
              A runtime exception occurred in the component hierarchy. Error details:
            </p>

            <pre style={{
              background: 'rgba(255, 46, 91, 0.08)',
              border: '1px solid rgba(255, 46, 91, 0.25)',
              padding: '16px',
              borderRadius: '8px',
              color: '#ff4d76',
              fontSize: '0.82rem',
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              marginBottom: '16px',
            }}>
              {this.state.error?.toString()}
            </pre>

            {this.state.errorInfo?.componentStack && (
              <pre style={{
                background: 'rgba(0, 0, 0, 0.5)',
                padding: '14px',
                borderRadius: '8px',
                color: '#64748b',
                fontSize: '0.72rem',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                maxHeight: '200px',
                marginBottom: '20px',
              }}>
                {this.state.errorInfo.componentStack}
              </pre>
            )}

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <button
                onClick={() => {
                  localStorage.removeItem('portfolio_mode');
                  window.location.href = '/';
                }}
                style={{
                  background: 'linear-gradient(135deg, #ff2e5b, #b51239)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  letterSpacing: '0.5px',
                }}
              >
                Reset to Classic Mode
              </button>

              <button
                onClick={() => window.location.reload()}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  padding: '10px 20px',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                }}
              >
                Reload Page
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
