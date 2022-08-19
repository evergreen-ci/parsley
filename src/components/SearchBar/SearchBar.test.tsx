import { render, screen } from "test_utils";
import SearchBar from ".";

describe("searchbar", () => {
  it("disables properly", async () => {
    render(<SearchBar disabled />);

    expect(screen.getByDataCy("searchbar-select")).toBeDisabled();
    expect(screen.getByDataCy("searchbar-input")).toBeDisabled();
  });
});
