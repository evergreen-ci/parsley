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
  it("ingesting a resmoke log should transform it before adding it to the list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LogContextProvider>{children}</LogContextProvider>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    act(() => {
      result.current.ingestLines(
        [
          `[j0:s0:n1] {"t":{"$date":"2022-09-13T16:57:46.852+00:00"},"s":"D2", "c":"REPL_HB",  "id":4615670, "ctx":"ReplCoord-1","msg":"Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}}`,
          `[j0:s0] {"t":{"$date":"2022-09-13T16:57:46.855+00:00"},"s":"I",  "c":"-",        "id":20883,   "ctx":"conn188","msg":"Interrupted operation as its client disconnected","attr":{"opId":6047}}`,
        ],
        LogTypes.RESMOKE_LOGS
      );
    });
    expect(result.current.logLines).toStrictEqual([
      `[j0:s0:n1] | 2022-09-13T16:57:46.852+00:00 D2 REPL_HB  4615670 [ReplCoord-1] "Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}`,
      `[j0:s0] | 2022-09-13T16:57:46.855+00:00 I  -        20883   [conn188] "Interrupted operation as its client disconnected","attr":{"opId":6047}`,
    ]);
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
  it("should be able to set a scroll index", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <LogContextProvider>{children}</LogContextProvider>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    expect(result.current.scrollIndex).toBeUndefined();
    act(() => {
      result.current.setScrollIndex(13);
    });
    expect(result.current.scrollIndex).toBe(13);
  });
});
