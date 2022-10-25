import { renderWithRouterMatch, screen } from "test_utils";
import { ErrorBoundary } from ".";

describe("errorBoundary", () => {
  it("renders children", () => {
    renderWithRouterMatch(
      <ErrorBoundary>
        <div data-cy="test">Test</div>
      </ErrorBoundary>
    );
    expect(screen.getByDataCy("test")).toBeVisible();
  });
  it("renders error fallback", () => {
    const SampleComponent = () => {
      throw new Error("Error");
    };
    renderWithRouterMatch(
      <ErrorBoundary>
        <SampleComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText("Error")).toBeVisible();
  });
});
