import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Here you could log the error to an external service
    console.error('ErrorBoundary caught an error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[calc(100vh-64px)] flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full text-center p-8 bg-white rounded-2xl border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">Ocorreu um erro</h3>
            <p className="text-sm text-gray-600 mt-2">Algo deu errado ao carregar esta página.</p>
            <pre className="mt-4 text-xs text-left text-red-600 overflow-auto p-2 bg-red-50 rounded">{String(this.state.error)}</pre>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}
