import React, { Component, ErrorInfo, ReactNode } from "react";
import { TempoDevtools } from "tempo-devtools";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Log the error to console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-alphadark text-white p-4">
          <div className="max-w-md w-full bg-alphadarkblue/80 backdrop-blur-md p-6 rounded-lg border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-alphagreen">
              Something went wrong
            </h2>
            <p className="mb-4">
              The application encountered an unexpected error.
            </p>
            <pre className="bg-black/30 p-4 rounded overflow-auto text-sm mb-4">
              {this.state.error?.message || "Unknown error"}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="bg-alphagreen hover:bg-alphagreen/80 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
