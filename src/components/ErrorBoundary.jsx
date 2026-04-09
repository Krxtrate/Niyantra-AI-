import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("[Niyantra] UI Crash caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0A0818] flex items-center justify-center p-6 text-center">
          <div className="max-w-md w-full glass-panel p-8 rounded-3xl border-red-500/20 shadow-[0_0_50px_rgba(255,51,102,0.1)]">
            <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-red-500 border border-red-500/20">
              <AlertTriangle size={32} />
            </div>
            <h1 className="font-display font-bold text-2xl text-white mb-2">Interface Interrupted</h1>
            <p className="text-white/50 text-sm mb-8 leading-relaxed">
              A critical error occurred while rendering the dashboard. This might be due to malformed live data or a connectivity issue.
            </p>
            
            <div className="bg-red-500/5 rounded-xl p-4 mb-8 text-left border border-red-500/10">
              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">Error Trace</p>
              <p className="text-xs font-mono text-red-200/60 break-words">{this.state.error?.message || "Unknown Error"}</p>
            </div>

            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all flex items-center justify-center gap-2 shadow-[0_10px_20px_rgba(255,51,102,0.3)]"
            >
              <RefreshCw size={16} />
              Re-initialize System
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
