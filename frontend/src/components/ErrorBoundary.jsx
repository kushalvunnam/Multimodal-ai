import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '40px', background: '#f8fafc', fontFamily: 'sans-serif', minHeight: '100vh' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e293b', marginBottom: '16px' }}>Something went wrong</h1>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
            <button 
              onClick={() => window.location.reload()} 
              style={{ padding: '10px 20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Reload OmniSense
            </button>
            <button 
              onClick={() => window.location.href = '/dashboard'} 
              style={{ padding: '10px 20px', background: 'white', color: '#4f46e5', border: '1px solid #4f46e5', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              Return to Dashboard
            </button>
          </div>
          
          <div style={{ background: 'white', padding: '20px', borderRadius: '8px', border: '1px solid #f1f5f9', overflow: 'auto' }}>
            <h3 style={{ color: '#ef4444', fontWeight: 'bold' }}>Error Details (Dev Only)</h3>
            <p style={{ fontFamily: 'monospace', fontWeight: 'bold', marginTop: '10px' }}>
              {this.state.error && this.state.error.toString()}
            </p>
            <pre style={{ fontSize: '12px', color: '#64748b', marginTop: '10px', whiteSpace: 'pre-wrap' }}>
              {this.state.errorInfo && this.state.errorInfo.componentStack}
            </pre>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
