import { useRef } from "react";
import { act } from "@testing-library/react-hooks";
import { LogContextProvider } from "context/LogContext";
import {
  MultiLineSelectContextProvider,
  useMultiLineSelectContext,
} from "context/MultiLineSelectContext";
import { RenderFakeToastContext } from "context/toast/__mocks__";
import { renderWithRouterMatch, screen, userEvent } from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import SharingMenu from ".";

const SharingMenuComponent: React.FC<
  Omit<React.ComponentProps<typeof SharingMenu>, "refEl">
> = ({ ...props }) => {
  const ref = useRef(null);
  return (
    <>
      <div ref={ref} />
      <SharingMenu {...props} refEl={ref} />
    </>
  );
};
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
describe("sharingMenu", () => {
  it("should render an open menu", () => {
    const { Component: MenuComponent } = renderComponentWithHook(
      useMultiLineSelectContext,
      <SharingMenuComponent open />
    );
    const { Component } = RenderFakeToastContext(<MenuComponent />);
    renderWithRouterMatch(<Component />, { wrapper });
    expect(screen.getByText("Copy selected lines")).toBeInTheDocument();
    expect(
      screen.getByText("Share link to selected lines")
    ).toBeInTheDocument();
    expect(screen.getByText("Only search on range")).toBeInTheDocument();
  });
  it("clicking copy selected lines should copy the line range to the clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { Component: MenuComponent, hook } = renderComponentWithHook(
      useMultiLineSelectContext,
      <SharingMenuComponent open />
    );
    const { Component } = RenderFakeToastContext(<MenuComponent />);
    renderWithRouterMatch(<Component />, { wrapper });
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Copy selected lines")).toBeInTheDocument();
    await user.click(screen.getByText("Copy selected lines"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe(
      "{noformat}\nline 2\nline 3\nline 4\n{noformat}"
    );
    //
  });
  it("clicking share link to selected lines should copy the link to the clipboard", async () => {
    const user = userEvent.setup({ writeToClipboard: true });

    const { Component: MenuComponent, hook } = renderComponentWithHook(
      useMultiLineSelectContext,
      <SharingMenuComponent open />
    );
    const { Component } = RenderFakeToastContext(<MenuComponent />);
    renderWithRouterMatch(<Component />, { wrapper });
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(
      screen.getByText("Share link to selected lines")
    ).toBeInTheDocument();
    await user.click(screen.getByText("Share link to selected lines"));
    const clipboardText = await navigator.clipboard.readText();
    expect(clipboardText).toBe("http://localhost/");
  });
  it("clicking only search on range should update the url with the range", async () => {
    const { Component: MenuComponent, hook } = renderComponentWithHook(
      useMultiLineSelectContext,
      <SharingMenuComponent open />
    );
    const { Component } = RenderFakeToastContext(<MenuComponent />);
    const { router } = renderWithRouterMatch(<Component />, { wrapper });
    act(() => {
      hook.current.handleSelectLine(1, false);
    });
    act(() => {
      hook.current.handleSelectLine(3, true);
    });
    expect(screen.getByText("Only search on range")).toBeInTheDocument();
    await userEvent.click(screen.getByText("Only search on range"));
    expect(router.state.location.search).toBe("?lower=1&upper=3");
  });
});
