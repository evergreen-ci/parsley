import { act, renderHook } from "@testing-library/react-hooks";
import { LogTypes } from "constants/enums";
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
      result.current.ingestLines(["foo", "bar"], LogTypes.EVERGREEN_TASK_LOGS);
    });
    expect(result.current.logLines).toStrictEqual(["foo", "bar"]);
    expect(result.current.lineCount).toBe(2);
  });
  it("saving a filename should save it to the context", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LogContextProvider>{children}</LogContextProvider>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    act(() => {
      result.current.setFileName("foo.txt");
    });
    expect(result.current.fileName).toBe("foo.txt");
  });
  it("should be able to clear the list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LogContextProvider initialLogLines={["foo", "bar"]}>
        {children}
      </LogContextProvider>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    expect(result.current.logLines).toStrictEqual(["foo", "bar"]);
    expect(result.current.lineCount).toBe(2);
    act(() => {
      result.current.clearLogs();
    });
    expect(result.current.logLines).toStrictEqual([]);
    expect(result.current.lineCount).toBe(0);
  });
});
