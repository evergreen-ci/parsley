import { act } from "@testing-library/react-hooks";
import Cookie from "js-cookie";
import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import PrettyPrintToggle from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

const renderComponentWithHook = () => {
  const hook: { current: ReturnType<typeof useLogContext> } = {
    current: {} as ReturnType<typeof useLogContext>,
  };
  const Component: React.FC = () => {
    hook.current = useLogContext();
    return <PrettyPrintToggle />;
  };
  return {
    Component,
    hook,
  };
};

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("pretty print toggle", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("should read from the cookie properly", () => {
    render(<PrettyPrintToggle />, { wrapper });
    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should disable the toggle if the logType is not resmoke", () => {
    const { Component, hook } = renderComponentWithHook();
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.EVERGREEN_TASK_LOGS });
    });

    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-disabled", "true");
  });

  it("should not disable the toggle if the logType is resmoke", () => {
    const { Component, hook } = renderComponentWithHook();
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.RESMOKE_LOGS });
    });

    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    expect(prettyPrintToggle).toHaveAttribute("aria-disabled", "false");
  });

  it("should not update the URL", async () => {
    const { Component, hook } = renderComponentWithHook();
    const { history } = render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({ logType: LogTypes.RESMOKE_LOGS });
    });

    const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
    await userEvent.click(prettyPrintToggle);
    expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
    expect(history.location.search).toBe("");
  });
});
