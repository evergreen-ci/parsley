import Cookie from "js-cookie";
import { LogContextProvider, useLogContext } from "context/LogContext";
import {
  act,
  renderWithRouterMatch as render,
  screen,
  userEvent,
} from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import WordWrapFormatToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("word wrap format toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "standard");
  });

  it("should be disabled if word wrap is disabled", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    render(<Component />, { wrapper });
    expect(hook.current.preferences.wrap).toBe(false);
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    act(() => {
      hook.current.preferences.setWrap(true);
    });
    expect(wordWrapFormatToggle).not.toBeDisabled();
  });
  it("defaults to 'standard' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    render(<Component />, { wrapper });
    expect(hook.current.preferences.wordWrapFormat).toBe("standard");
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    const { Component } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    render(<Component />, { wrapper });
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should not update the URL", async () => {
    const user = userEvent.setup();
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <WordWrapFormatToggle />,
    );
    const { router } = render(<Component />, { wrapper });
    act(() => {
      hook.current.preferences.setWrap(true);
    });
    const wordWrapFormatToggle = screen.getByDataCy("word-wrap-format-toggle");

    await user.click(wordWrapFormatToggle);
    expect(wordWrapFormatToggle).toHaveAttribute("aria-checked", "true");
    expect(router.state.location.search).toBe("");
  });
});
