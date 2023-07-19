import { act } from "@testing-library/react-hooks";
import Cookie from "js-cookie";
import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import { mockUseToastContext } from "context/toast/__mocks__";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import PrettyPrintToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("pretty print toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
    mockUseToastContext();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("defaults to 'false' if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(<PrettyPrintToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should read from the cookie properly", () => {
    render(<PrettyPrintToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should disable the toggle if the logType is not resmoke", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <PrettyPrintToggle />
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    });

    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-disabled", "true");
  });

  it("should not disable the toggle if the logType is resmoke", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <PrettyPrintToggle />
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.RESMOKE_LOGS });
    });

    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-disabled", "false");
  });

  it("should not update the URL", async () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <PrettyPrintToggle />
    );
    const { router } = render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.RESMOKE_LOGS });
    });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");

    const user = userEvent.setup();
    await user.click(prettyPrintToggle);
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
    expect(router.state.location.search).toBe("");
  });
});
