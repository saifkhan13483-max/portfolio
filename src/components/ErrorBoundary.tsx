import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: { componentStack: string }) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-bold text-foreground mb-3">Something went wrong</h1>
            <p className="text-muted-foreground text-sm mb-6">
              An unexpected error occurred. Please refresh the page — if the problem persists,{" "}
              <a href="/contact" className="text-primary underline underline-offset-2">get in touch</a>.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Refresh page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
