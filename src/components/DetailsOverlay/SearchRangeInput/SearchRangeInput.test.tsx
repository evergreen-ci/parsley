import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import SearchRangeInput from ".";

describe("range input", () => {
  it("should update the URL correctly", async () => {
    const { history } = render(<SearchRangeInput />);

    const lowerBound = screen.getByDataCy("range-lower-bound");
    await userEvent.type(lowerBound, "99");
    await waitFor(() => {
      expect(history.location.search).toBe("?lower=99");
    });

    const upperBound = screen.getByDataCy("range-upper-bound");
    await userEvent.type(upperBound, "100");
    await waitFor(() => {
      expect(history.location.search).toBe("?lower=99&upper=100");
    });
  });

  it("empty input should not add anything to the URL", async () => {
    const { history } = render(<SearchRangeInput />);

    const lowerBound = screen.getByDataCy("range-lower-bound");
    await userEvent.type(lowerBound, "99");
    await waitFor(() => {
      expect(history.location.search).toBe("?lower=99");
    });

    await userEvent.clear(lowerBound);
    await waitFor(() => {
      expect(history.location.search).toBe("");
    });
  });

  it("should show an error on invalid input", async () => {
    render(<SearchRangeInput />);

    const upperBound = screen.getByDataCy("range-upper-bound");
    await userEvent.type(upperBound, "8");

    const lowerBound = screen.getByDataCy("range-lower-bound");
    await userEvent.type(lowerBound, "9");

    await waitFor(() => {
      expect(screen.getByDataCy("range-error-message")).toBeInTheDocument();
    });
  });
});
