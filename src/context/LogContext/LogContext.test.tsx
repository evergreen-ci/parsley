import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import {
  // Refer to https://reactrouter.com/docs/en/v6/routers/history-router to understand
  // why this import is marked as unstable.
  unstable_HistoryRouter as HistoryRouter,
  Route,
  Routes,
} from "react-router-dom";
import { LogTypes } from "constants/enums";
import { LogContextProvider, useLogContext } from ".";

const Router = ({ children }: { children: React.ReactNode }) => (
  <HistoryRouter history={createMemoryHistory()}>
    <Routes>
      <Route element={children} path="/" />
    </Routes>
  </HistoryRouter>
);

describe("useLogContext", () => {
  it("should initialized with an empty list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <Router>
        <LogContextProvider>{children}</LogContextProvider>
      </Router>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    expect(result.current.processedLogLines).toStrictEqual([]);
    expect(result.current.lineCount).toBe(0);
  });
  it("ingesting logs should add them to the list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <Router>
        <LogContextProvider>{children}</LogContextProvider>
      </Router>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    const lines = ["foo", "bar", "baz"];
    act(() => {
      result.current.ingestLines(lines, LogTypes.EVERGREEN_TASK_LOGS);
    });
    expect(result.current.processedLogLines).toStrictEqual([0, 1, 2]);
    expect(result.current.lineCount).toBe(lines.length);
    for (let i = 0; i < lines.length; i++) {
      const line = result.current.processedLogLines[i];
      // Expect the line not to be an array
      expect(Array.isArray(line)).toBe(false);
      // @ts-expect-error line is not an array we confirmed it above
      expect(result.current.getLine(line)).toStrictEqual(lines[i]);
    }
  });
  it("ingesting a resmoke log should transform it before adding it to the list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <Router>
        <LogContextProvider>{children}</LogContextProvider>
      </Router>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    const lines = [
      `[j0:s0:n1] {"t":{"$date":"2022-09-13T16:57:46.852+00:00"},"s":"D2", "c":"REPL_HB",  "id":4615670, "ctx":"ReplCoord-1","msg":"Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}}`,
      `[j0:s0] {"t":{"$date":"2022-09-13T16:57:46.855+00:00"},"s":"I",  "c":"-",        "id":20883,   "ctx":"conn188","msg":"Interrupted operation as its client disconnected","attr":{"opId":6047}}`,
    ];
    act(() => {
      result.current.ingestLines(lines, LogTypes.RESMOKE_LOGS);
    });
    const resmokeLines = [
      `[j0:s0:n1] | 2022-09-13T16:57:46.852+00:00 D2 REPL_HB  4615670 [ReplCoord-1] "Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}`,
      `[j0:s0] | 2022-09-13T16:57:46.855+00:00 I  -        20883   [conn188] "Interrupted operation as its client disconnected","attr":{"opId":6047}`,
    ];
    expect(result.current.processedLogLines).toStrictEqual([0, 1]);
    for (let i = 0; i < lines.length; i++) {
      const line = result.current.processedLogLines[i];
      // Expect the line not to be an array
      expect(Array.isArray(line)).toBe(false);
      // @ts-expect-error line is not an array we confirmed it above
      expect(result.current.getLine(line)).toStrictEqual(resmokeLines[i]);
    }
  });
  it("saving a filename should save it to the context", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <Router>
        <LogContextProvider>{children}</LogContextProvider>
      </Router>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    act(() => {
      result.current.setFileName("foo.txt");
    });
    expect(result.current.fileName).toBe("foo.txt");
  });
  it("should be able to clear the list of logs", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <Router>
        <LogContextProvider initialLogLines={["foo", "bar"]}>
          {children}
        </LogContextProvider>
      </Router>
    );
    const { result } = renderHook(() => useLogContext(), { wrapper });
    expect(result.current.lineCount).toBe(2);
    act(() => {
      result.current.clearLogs();
    });
    expect(result.current.lineCount).toBe(0);
  });
});
