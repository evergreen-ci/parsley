import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import SearchRangeInput from ".";

describe("search range input", () => {
  it("should update the URL correctly", async () => {
    const user = userEvent.setup();
    const { router } = render(<SearchRangeInput />);

    const lowerBound = screen.getByDataCy("range-lower-bound");
    await user.type(lowerBound, "99");
    expect(router.state.location.search).toBe("?lower=99");

    const upperBound = screen.getByDataCy("range-upper-bound");
    await user.type(upperBound, "100");
    expect(router.state.location.search).toBe("?lower=99&upper=100");
  });

  it("empty input should not add anything to the URL", async () => {
    const user = userEvent.setup();
    const { router } = render(<SearchRangeInput />);

    const lowerBound = screen.getByDataCy("range-lower-bound");
    await user.type(lowerBound, "99");

    expect(router.state.location.search).toBe("?lower=99");

    await user.clear(lowerBound);
    expect(router.state.location.search).toBe("");
  });

  it("should show an error message on invalid input", async () => {
    const user = userEvent.setup();
    render(<SearchRangeInput />);

    const upperBound = screen.getByDataCy("range-upper-bound");
    await user.type(upperBound, "8");

    const lowerBound = screen.getByDataCy("range-lower-bound");
    await user.type(lowerBound, "9");

    expect(screen.getByDataCy("range-error-message")).toBeInTheDocument();
  });
});
