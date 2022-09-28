import { render, screen, userEvent } from "test_utils";
import SearchBar from ".";

describe("searchbar", () => {
  it("disables properly", async () => {
    render(<SearchBar disabled />);
    expect(screen.getByDataCy("searchbar-select")).toBeDisabled();
    expect(screen.getByDataCy("searchbar-input")).toBeDisabled();
  });
  it("should be able to submit an input by pressing enter", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} />);
    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("search", "test");
  });
  it("should be able to submit an input by clicking the submit button", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} />);
    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.click(screen.getByDataCy("searchbar-submit"));
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("search", "test");
  });
  it("shows a warning icon if input is invalid", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} validator={(i) => i.length > 5} />);
    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    expect(screen.queryByDataCy("searchbar-warning")).toBeVisible();
    expect(screen.queryByDataCy("searchbar-submit")).toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("invalid inputs should not submit", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} validator={(i) => i.length > 5} />);
    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("test");
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("should be able to change the selected option", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} />);
    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.click(screen.getByDataCy("searchbar-select"));
    await user.click(screen.getByDataCy("filter-option"));
    await user.type(input, "{enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");
    await user.click(screen.getByDataCy("searchbar-select"));
    await user.click(screen.getByDataCy("search-option"));
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{enter}");
    expect(onSubmit).toHaveBeenCalledWith("search", "test");
  });
  it("should not clear input if shouldClearOnSubmit is false", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(
      <SearchBar
        onSubmit={onSubmit}
        shouldClearOnSubmit={() => false}
        validator={() => true}
      />
    );
    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    await user.type(input, "{enter}");
    expect(input).toHaveValue("test");
    expect(onSubmit).toHaveBeenCalledWith("search", "test");
  });
  it("should call onChange as input changes", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SearchBar onChange={onChange} />);
    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    expect(onChange).toHaveBeenCalledTimes(4);
    expect(onChange).toHaveBeenCalledWith("search", "t");
    expect(onChange).toHaveBeenCalledWith("search", "te");
    expect(onChange).toHaveBeenCalledWith("search", "test");
  });
  it("should not call onChange if input is invalid", async () => {
    const user = userEvent.setup();
    const onChange = jest.fn();
    render(<SearchBar onChange={onChange} validator={(i) => i.length > 4} />);
    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    expect(onChange).not.toHaveBeenCalled();
    await user.type(input, "1");
    expect(input).toHaveValue("test1");
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("search", "test1");
  });
});
