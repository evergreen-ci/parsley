import { act, renderHook } from "@testing-library/react-hooks";
import { LogContextProvider, useLogContext } from ".";

describe("useLogContext", () => {
  it("should initialized with an empty list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LogContextProvider>{children}</LogContextProvider>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    expect(result.current.logLines).toStrictEqual([]);
    expect(result.current.lineCount).toBe(0);
  });
  it("ingesting logs should add them to the list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LogContextProvider>{children}</LogContextProvider>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    act(() => {
      result.current.ingestLines(["foo", "bar"]);
    });
    expect(result.current.logLines).toStrictEqual(["foo", "bar"]);
    expect(result.current.lineCount).toBe(2);
  });
  it("should be able to clear the list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LogContextProvider>{children}</LogContextProvider>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    act(() => {
      result.current.ingestLines(["foo", "bar"]);
    });
    expect(result.current.logLines).toStrictEqual(["foo", "bar"]);
    expect(result.current.lineCount).toBe(2);
    act(() => {
      result.current.clearLines();
    });
    expect(result.current.logLines).toStrictEqual([]);
    expect(result.current.lineCount).toBe(0);
  });
});
