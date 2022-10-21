import React, { Component } from "react";
import Bugsnag from "@bugsnag/js";
import BugsnagPluginReact, {
  BugsnagErrorBoundary,
} from "@bugsnag/plugin-react";
import { EmotionJSX } from "@emotion/react/types/jsx-namespace";
import {
  appVersion,
  bugsnagAPIKey,
  isLocal,
  isProductionBuild,
  releaseStage,
} from "utils/environmentVariables";
import ErrorFallback from "./ErrorFallback";

let bugsnagStarted = false;

type DefaultErrorBoundaryProps = {
  FallbackComponent: () => EmotionJSX.Element;
  children: React.ReactNode;
};

// This error boundary is used during local development
class DefaultErrorBoundary extends Component<
  DefaultErrorBoundaryProps,
  { hasError: boolean }
> {
  constructor(props: DefaultErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
    console.log("DefaultErrorBoundary");
  }

  static getDerivedStateFromError() {
    console.log("getDerivedStateFromError");
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.log("componentDidCatch");
    console.error({ error, errorInfo });
  }

  render() {
    const { hasError } = this.state;
    const { children, FallbackComponent } = this.props;
    if (hasError) {
      return <FallbackComponent />;
    }
    return children;
  }
}

const getBoundary = () => {
  let boundary: typeof DefaultErrorBoundary | BugsnagErrorBoundary =
    DefaultErrorBoundary;
  if (bugsnagStarted) {
    const bugsnagPlugin = Bugsnag.getPlugin("react");

    boundary =
      bugsnagPlugin !== undefined
        ? bugsnagPlugin.createErrorBoundary(React)
        : DefaultErrorBoundary;
  }
  return boundary;
};

const initializeBugsnag = () => {
  // Only need to Bugsnag.start once, will throw console warnings otherwise
  if (bugsnagStarted || !isProductionBuild || isLocal) {
    console.log("Bugsnag started");
    return;
  }

  try {
    Bugsnag.start({
      apiKey: bugsnagAPIKey || "",
      plugins: [new BugsnagPluginReact()],
      appVersion,
      releaseStage,
    });
    bugsnagStarted = true;
  } catch (e) {
    // If bugsnag fails we have no where to log it and we can't do anything about it
    console.error("Failed to initialize Bugsnag", e);
  }
};

const ErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // In some cases we do not want to enable bugsnag (ex: testing environments).
  // In these cases we will return a fallback element
  const ErrorBoundaryComp = getBoundary();
  return (
    <ErrorBoundaryComp FallbackComponent={ErrorFallback}>
      {children}
    </ErrorBoundaryComp>
  );
};

const resetBugsnag = () => {
  bugsnagStarted = false;
};

export { ErrorBoundary, resetBugsnag, initializeBugsnag };
