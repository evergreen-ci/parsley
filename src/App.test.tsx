import App from "App";
import { render, screen, userEvent, waitFor } from "test_utils";

describe("app", () => {
  it("renders without crashing", async () => {
    expect.hasAssertions();
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("Vite + React")).toBeInTheDocument();
    });
  });

  it("reacts to user input", async () => {
    render(<App />);

    expect(screen.getByText("count is 0")).toBeInTheDocument();
    const button = screen.getByDataCy("app-button");
    userEvent.click(button);
    await waitFor(() => {
      expect(screen.getByText("count is 1")).toBeInTheDocument();
    });
  });
});
