import { Component } from "react";
import Bugsnag from "@bugsnag/js";
import { ErrorBoundary as BugsnagErrorBoundary } from "./Bugsnag";
import ErrorFallback from "./ErrorFallback";
import { ErrorBoundary as SentryErrorBoundary, isInitialized } from "./Sentry";

type DefaultErrorBoundaryProps = {
  children: React.ReactNode;
};

// This error boundary is ONLY used during local development. Any changes to this component will not be
// reflected in production.
export class DefaultErrorBoundary extends Component<
  DefaultErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: DefaultErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { children } = this.props;
    if (hasError) {
      return <ErrorFallback />;
    }
    return children;
  }
}

export const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const useBugsnag = Bugsnag.isStarted();
  const useSentry = isInitialized();

  if (!useBugsnag && !useSentry) {
    return <DefaultErrorBoundary>{children}</DefaultErrorBoundary>;
  }

  let errorBoundary = children;

  if (useSentry) {
    errorBoundary = <SentryErrorBoundary>{errorBoundary}</SentryErrorBoundary>;
  }

  if (useBugsnag) {
    errorBoundary = (
      <BugsnagErrorBoundary>{errorBoundary}</BugsnagErrorBoundary>
    );
  }

  return <>{errorBoundary}</>; // eslint-disable-line react/jsx-no-useless-fragment
};