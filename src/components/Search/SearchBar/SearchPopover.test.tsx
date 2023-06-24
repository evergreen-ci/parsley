import { render, screen, userEvent, waitFor } from "test_utils";
import SearchPopover from "./SearchPopover";

describe("search popover", () => {
  it("disables properly", () => {
    render(<SearchPopover disabled searchSuggestions={[]} />);
    expect(screen.getByDataCy("search-suggestion-button")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("should call onClick when option is clicked", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={["apple", "banana"]}
      />
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    await user.click(screen.getByText("apple"));
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("apple");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should be able to submit an option with enter", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={["apple", "banana"]}
      />
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    const button = screen.getByRole("button", { name: "apple" });
    button.focus();
    expect(button).toHaveFocus();
    await user.keyboard("{Enter}");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("apple");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should be able to submit an option with spacebar", async () => {
    const user = userEvent.setup();
    const onClick = jest.fn();
    render(
      <SearchPopover
        onClick={onClick}
        searchSuggestions={["apple", "banana"]}
      />
    );
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    const button = screen.getByRole("button", { name: "apple" });
    button.focus();
    expect(button).toHaveFocus();
    await user.keyboard(" ");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith("apple");
    expect(screen.getByDataCy("search-suggestion-popover")).not.toBeVisible();
  });

  it("should indicate if there are no search suggestions", async () => {
    const user = userEvent.setup();
    render(<SearchPopover searchSuggestions={[]} />);
    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    expect(screen.getByText(/No suggestions/)).toBeVisible();
  });
});
