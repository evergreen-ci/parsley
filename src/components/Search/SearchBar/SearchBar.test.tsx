import { DIRECTION } from "context/LogContext/types";
import { render, screen, userEvent, waitFor } from "test_utils";
import SearchBar from ".";

describe("searchbar", () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  it("disables properly", () => {
    render(<SearchBar disabled />);
    expect(screen.getByDataCy("searchbar-input")).toBeDisabled();
  });
  it("should be able to paginate forwards by pressing Enter and keep focus", async () => {
    const user = userEvent.setup();
    const paginate = jest.fn();
    render(<SearchBar paginate={paginate} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{enter}");
    expect(paginate).toHaveBeenCalledTimes(1);
    expect(paginate).toHaveBeenCalledWith(DIRECTION.NEXT);
    expect(input).toHaveFocus();
  });
  it("should be able to paginate backwards by pressing Shift + Enter and keep focus", async () => {
    const user = userEvent.setup();
    const paginate = jest.fn();
    render(<SearchBar paginate={paginate} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{Shift>}{enter}");
    expect(paginate).toHaveBeenCalledTimes(1);
    expect(paginate).toHaveBeenCalledWith(DIRECTION.PREVIOUS);
    expect(input).toHaveFocus();
  });
  it("should be able to submit an input by pressing Ctrl + Enter", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{Control>}{enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");
    expect(input).not.toHaveFocus();
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
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");
  });
  it("shows a warning icon if input is invalid", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} validator={(i) => i.length > 5} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    expect(screen.queryByDataCy("searchbar-error")).toBeVisible();
    expect(screen.queryByDataCy("searchbar-submit")).toBeNull();
    expect(onSubmit).not.toHaveBeenCalled();
  });
  it("invalid inputs should not submit", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} validator={(i) => i.length > 5} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    await user.type(input, "{Control>}{enter}");
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
    await user.type(input, "{Control>}{enter}");
    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");

    await user.click(screen.getByDataCy("searchbar-select"));
    await user.click(screen.getByDataCy("highlight-option"));
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    await user.type(input, "{Control>}{enter}");
    expect(onSubmit).toHaveBeenCalledWith("highlight", "test");
  });
  it("should clear input if a user is applying a filter and should reset search", async () => {
    const user = userEvent.setup();
    const onSubmit = jest.fn();
    render(<SearchBar onSubmit={onSubmit} validator={() => true} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.click(screen.getByDataCy("searchbar-select"));
    await user.click(screen.getByDataCy("filter-option"));
    await user.type(input, "test");
    await user.type(input, "{Control>}{enter}");
    expect(input).toHaveValue("");
    expect(onSubmit).toHaveBeenCalledWith("filter", "test");
  });
  it("should call a debounced onChange as input changes", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onChange = jest.fn();
    render(<SearchBar onChange={onChange} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    jest.advanceTimersByTime(1000);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("test");
  });
  it("should not call onChange if input is invalid", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onChange = jest.fn();
    render(<SearchBar onChange={onChange} validator={(i) => i.length > 4} />);

    const input = screen.getByDataCy("searchbar-input");
    await user.type(input, "test");
    expect(input).toHaveValue("test");
    jest.advanceTimersByTime(1000);
    expect(onChange).not.toHaveBeenCalled();
    await user.type(input, "1");
    expect(input).toHaveValue("test1");
    jest.advanceTimersByTime(1000);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("test1");
  });
  it("pressing Control+F puts focus on the input and selects the text content", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSubmit={jest.fn()} />);

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    const inputText = "input text";
    await user.type(input, inputText);
    await user.click(document.body as HTMLElement);
    expect(input).not.toHaveFocus();

    await user.keyboard("{Control>}{f}");
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(inputText.length);
  });
  it("pressing ⌘+F puts focus on the input and selects the text content", async () => {
    const user = userEvent.setup();
    render(<SearchBar onSubmit={jest.fn()} />);

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    const inputText = "input text";
    await user.type(input, inputText);
    await user.click(document.body as HTMLElement);
    expect(input).not.toHaveFocus();

    await user.keyboard("{Meta>}{f}");
    expect(input).toHaveFocus();
    expect(input.selectionStart).toBe(0);
    expect(input.selectionEnd).toBe(inputText.length);
  });
  it("should be possible to select and apply a search suggestion", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onChange = jest.fn();
    render(
      <SearchBar onChange={onChange} searchSuggestions={["apple", "banana"]} />
    );

    await user.click(screen.getByDataCy("search-suggestion-button"));
    await waitFor(() => {
      expect(screen.getByDataCy("search-suggestion-popover")).toBeVisible();
    });
    await user.click(screen.getByText("apple"));

    const input = screen.getByDataCy("searchbar-input") as HTMLInputElement;
    expect(input).toHaveValue("apple");
    expect(input).toHaveFocus();
    jest.advanceTimersByTime(1000);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith("apple");
  });
});
