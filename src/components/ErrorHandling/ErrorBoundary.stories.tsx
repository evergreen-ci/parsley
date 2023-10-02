import { useState } from "react";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import { ErrorBoundary } from ".";
import ErrorFallback from "./ErrorFallback";

export default {
  component: ErrorFallback,
} satisfies CustomMeta<typeof ErrorFallback>;

export const Template: CustomStoryObj<typeof ErrorFallback> = {
  name: "Error Fallback",
  render: () => <ErrorFallback />,
};

export const ErrorBoundaryTemplate: CustomStoryObj<typeof ErrorBoundary> = {
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
