import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-gray-200 dark:border-gray-700 max-w-md w-full">
            <div className="text-center">
              <div className="mb-4">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full mx-auto flex items-center justify-center">
                  <span className="text-2xl">⚠️</span>
                </div>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Terjadi Kesalahan
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                Aplikasi mengalami error. Silakan refresh halaman.
              </p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Refresh Halaman
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;