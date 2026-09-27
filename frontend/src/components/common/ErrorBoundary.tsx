import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught Error in Shyamarks App:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 shadow-glow-amber">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-text-primary mb-2">
            Something Went Wrong
          </h1>
          <p className="text-xs text-text-secondary max-w-md mb-6 font-sans">
            An unforeseen interface error occurred. Don't worry, your evidence dossier and achievements are safe.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-semibold bg-accent text-white shadow-accent-glow hover:brightness-110 transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Reload Experience</span>
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
