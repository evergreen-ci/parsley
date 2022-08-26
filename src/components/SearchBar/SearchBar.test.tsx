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
    expect(onSubmit).toHaveBeenCalledWith("test");
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
    expect(onSubmit).toHaveBeenCalledWith("test");
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
});
