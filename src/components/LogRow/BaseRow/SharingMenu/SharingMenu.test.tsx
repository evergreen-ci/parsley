import { act } from "@testing-library/react-hooks";
import { LogContextProvider, useLogContext } from "context/LogContext";
import {
  MultiLineSelectContextProvider,
  useMultiLineSelectContext,
} from "context/MultiLineSelectContext";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import SharingMenu from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={logs}>
    <MultiLineSelectContextProvider>{children}</MultiLineSelectContextProvider>
  </LogContextProvider>
);

const logs = [
  "line 1",
  "line 2",
  "line 3",
  "line 4",
  "line 5",
  "line 6",
  "line 7",
];

/**
 * `renderSharingMenu` renders the sharing menu with the default open prop
 * @returns - hook and utils
 */
const renderSharingMenu = () => {
  const { Component: MenuComponent, hook } = renderComponentWithHook(
    useMultiLineSelectContext,
    <SharingMenu defaultOpen />
  );
  const { Component } = RenderFakeToastContext(<MenuComponent />);
  const utils = renderWithRouterMatch(<Component />, { wrapper });
  return {
    hook,
    utils,
  };
};

describe("sharingMenu", () => {
  it("should render an open menu", () => {
    renderSharingMenu();
    expect(screen.getByText("Copy selected contents")).toBeInTheDocument();
    expect(
      screen.getByText("Copy share link to selected line")
    ).toBeInTheDocument();
    expect(screen.getByText("Only search on range")).toBeInTheDocument();
  });
  it("clicking `copy selected contents` should copy the line range to the clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Copy selected contents")).toBeInTheDocument();
    await user.click(screen.getByText("Copy selected contents"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe(
      "{noformat}\nline 2\nline 3\nline 4\n{noformat}"
    );
  });
  it("clicking `copy selected contents` should copy a single selected line to the clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });

    expect(screen.getByText("Copy selected contents")).toBeInTheDocument();
    await user.click(screen.getByText("Copy selected contents"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("{noformat}\nline 2\n{noformat}");
  });
  it("clicking `share link to selected lines` should copy the link to the clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(
      screen.getByText("Copy share link to selected lines")
    ).toBeInTheDocument();
    await user.click(screen.getByText("Copy share link to selected lines"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("http://localhost/?shareLine=1");
  });
  it("clicking `only search on range` should update the url with the range", async () => {
    const { hook, utils } = renderSharingMenu();
    const { router } = utils;
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Only search on range")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Only search on range"));
    expect(router.state.location.search).toBe(
      "?lower=1&selectedLineRange=L1-L3&upper=3"
    );
  });
  it("clicking `clear selection` should clear the selected line range", () => {
    const { hook } = renderSharingMenu();
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Clear selection")).toBeInTheDocument();
    act(() => {
      hook.current.clearSelection();
    });
    expect(hook.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: undefined,
    });
  });
  it("should not show a share link button if this is a locally uploaded log", () => {
    const useSpecialHook = () => {
      const useLogContextHook = useLogContext();
      const useMultiLineSelectContextHook = useMultiLineSelectContext();
      return {
        useLogContextHook,
        useMultiLineSelectContextHook,
      };
    };
    const { Component: MenuComponent, hook } = renderComponentWithHook(
      useSpecialHook,
      <SharingMenu defaultOpen />
    );
    const { Component } = RenderFakeToastContext(<MenuComponent />);
    renderWithRouterMatch(<Component />, {
      route: "?selectedLineRange=L1-L3",
      wrapper,
    });
    act(() => {
      hook.current.useLogContextHook.setLogMetadata({
        isUploadedLog: true,
      });
    });
    expect(screen.queryByText("Share link to selected lines")).toBeNull();
  });
});
