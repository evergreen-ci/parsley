import { act, renderHook } from "@testing-library/react-hooks";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MultiLineSelectContextProvider, useMultiLineSelectContext } from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <MemoryRouter initialEntries={["/"]}>
    <MultiLineSelectContextProvider>
      <Routes>
        <Route element={undefined} path="/login" />
        <Route element={children} path="/" />
      </Routes>
    </MultiLineSelectContextProvider>
  </MemoryRouter>
);

describe("multiLineSelectContext", () => {
  it("should not have any lines selected by default", () => {
    const { result } = renderHook(useMultiLineSelectContext, { wrapper });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: undefined,
    });
  });
  it("selecting a line should set the starting line", () => {
    const { result } = renderHook(useMultiLineSelectContext, { wrapper });
    act(() => {
      result.current.handleSelectLine(1, false);
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: 1,
    });
  });
  it("selecting a second line should overwrite the starting line", () => {
    const { result } = renderHook(useMultiLineSelectContext, { wrapper });
    act(() => {
      result.current.handleSelectLine(1, false);
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: 1,
    });
    act(() => {
      result.current.handleSelectLine(2, false);
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: 2,
    });
  });
  it("shift+clicking a second line should set the ending line", () => {
    const { result } = renderHook(useMultiLineSelectContext, { wrapper });
    act(() => {
      result.current.handleSelectLine(1, false);
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: 1,
    });
    act(() => {
      result.current.handleSelectLine(2, true);
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: 2,
      startingLine: 1,
    });
  });
  it("shift+clicking the second line should ensure the starting line is the lower line", () => {
    const { result } = renderHook(useMultiLineSelectContext, { wrapper });
    act(() => {
      result.current.handleSelectLine(2, false);
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: 2,
    });
    act(() => {
      result.current.handleSelectLine(1, true);
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: 2,
      startingLine: 1,
    });
  });
  it("menuPosition should be the last selected line", () => {
    const { result } = renderHook(useMultiLineSelectContext, { wrapper });
    act(() => {
      result.current.handleSelectLine(2, false);
    });
    expect(result.current.menuPosition).toBe(2);
    act(() => {
      result.current.handleSelectLine(1, true);
    });
    expect(result.current.menuPosition).toBe(1);
  });
  it("should be able to clear the selection", () => {
    const { result } = renderHook(useMultiLineSelectContext, { wrapper });
    act(() => {
      result.current.handleSelectLine(2, false);
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: 2,
    });
    act(() => {
      result.current.clearSelection();
    });
    expect(result.current.selectedLines).toStrictEqual({
      endingLine: undefined,
      startingLine: undefined,
    });
  });
  it("should auto open the menu when both lines are selected", () => {
    const { result } = renderHook(useMultiLineSelectContext, { wrapper });
    act(() => {
      result.current.handleSelectLine(2, false);
    });
    expect(result.current.openMenu).toBe(false);
    act(() => {
      result.current.handleSelectLine(1, true);
    });
    expect(result.current.openMenu).toBe(true);
  });
});
