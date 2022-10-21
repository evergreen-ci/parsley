import { useState } from "react";
import { ComponentStory } from "@storybook/react";
import { ErrorBoundary } from ".";
import ErrorFallback from "./ErrorFallback";

export default {
  title: "Components/ErrorBoundary",
  component: ErrorFallback,
};

export const Template: ComponentStory<typeof ErrorFallback> = () => (
  <ErrorFallback />
);

Template.storyName = "Error Fallback";

export const ErrorBoundaryTemplate: ComponentStory<
  typeof ErrorBoundary
> = () => (
  <ErrorBoundary>
    <div>Test</div>
    <SampleComponent />
  </ErrorBoundary>
);

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

ErrorBoundaryTemplate.storyName = "Error Boundary";
