import { useState } from "react";
import { StoryObj } from "@storybook/react";
import { ErrorBoundary } from ".";
import ErrorFallback from "./ErrorFallback";

export default {
  title: "Components/ErrorBoundary",
  component: ErrorFallback,
};

export const Template: StoryObj<typeof ErrorFallback> = {
  render: () => <ErrorFallback />,
  name: "Error Fallback",
};

export const ErrorBoundaryTemplate: StoryObj<typeof ErrorBoundary> = {
  render: () => (
    <ErrorBoundary>
      <div>Test</div>
      <SampleComponent />
    </ErrorBoundary>
  ),

  name: "Error Boundary",
};

const SampleComponent = () => {
  const [hasError, setHasError] = useState(false);
  // Can't throw an error from an event handler in React
  // so we update the state and have the conditional throw the error
  if (hasError) {
    throw new Error("Error");
  }
  const throwError = () => {
    setHasError(true);
  };
  return (
    <div>
      <button onClick={throwError} type="button">
        Click me!
      </button>
    </div>
  );
};
