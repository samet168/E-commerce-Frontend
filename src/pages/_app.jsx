import React from "react";
import "../styles/globals.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Global Client Exception Caught:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: '#0b0f19',
          color: '#f8fafc',
          padding: '2.5rem',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif'
        }}>
          <div style={{
            maxWidth: '800px',
            margin: '0 auto',
            background: '#131b2e',
            borderRadius: '1.25rem',
            padding: '2rem',
            border: '1px solid #1e293b',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }} />
              <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: 0, color: '#f8fafc' }}>
                Application Error Details / ព័ត៌មានលម្អិតនៃបញ្ហា
              </h2>
            </div>
            
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
              A client-side error occurred during component rendering:
            </p>

            <pre style={{
              background: '#070b14',
              color: '#f87171',
              padding: '1.25rem',
              borderRadius: '0.75rem',
              fontSize: '0.875rem',
              overflowX: 'auto',
              border: '1px solid #991b1b',
              whiteSpace: 'pre-wrap',
              fontWeight: 600
            }}>
              {this.state.error ? this.state.error.toString() : 'Unknown Exception'}
            </pre>

            {this.state.error?.stack && (
              <pre style={{
                background: '#070b14',
                color: '#64748b',
                padding: '1rem',
                borderRadius: '0.75rem',
                fontSize: '0.75rem',
                overflowX: 'auto',
                marginTop: '1rem',
                maxHeight: '220px',
                border: '1px solid #1e293b',
                whiteSpace: 'pre-wrap'
              }}>
                {this.state.error.stack}
              </pre>
            )}

            <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
              <button
                onClick={() => {
                  window.location.reload();
                }}
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Reload Dashboard (ព្យាយាមឡើងវិញ)
              </button>
              <button
                onClick={() => {
                  localStorage.clear();
                  window.location.href = '/login';
                }}
                style={{
                  background: '#334155',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0.625rem 1.25rem',
                  borderRadius: '0.75rem',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  cursor: 'pointer'
                }}
              >
                Clear Cache & Re-login (ចូលគណនីម្តងទៀត)
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App({ Component, pageProps }) {
  return (
    <ErrorBoundary>
      <Component {...pageProps} />
    </ErrorBoundary>
  );
}
