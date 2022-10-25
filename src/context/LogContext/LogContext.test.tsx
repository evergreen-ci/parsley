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
import { isCollapsedRow } from "utils/collapsedRow";
import { LogContextProvider, useLogContext } from ".";
import { DIRECTION } from "./types";

const Router = ({
  children,
  route = "/",
}: {
  children: React.ReactNode;
  route?: string;
}) => (
  <HistoryRouter history={createMemoryHistory({ initialEntries: [route] })}>
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
      expect(isCollapsedRow(line)).toBe(false);
      // line is not an array we confirmed it above
      expect(result.current.getLine(line as number)).toStrictEqual(lines[i]);
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
    expect(result.current.logMetadata?.fileName).toBe("foo.txt");
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
  describe("resmoke logs", () => {
    it("ingesting a resmoke log should transform it before adding it to the list of logs", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
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
        // Expect the line not to be a collapsed row
        expect(isCollapsedRow(line)).toBe(false);
        expect(result.current.getLine(line as number)).toStrictEqual(
          resmokeLines[i]
        );
      }
    });
    it("ingesting a resmoke log should return a color for syntax highlighting", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
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
      expect(result.current.getResmokeLineColor(0)).toBe("#00A35C");
      expect(result.current.getResmokeLineColor(1)).toBeUndefined();
    });
  });
  describe("filters", () => {
    it("applying a filter should filter the list of logs and collapse unmatching ones", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router route="?filters=100bar">
          <LogContextProvider initialLogLines={["foo", "bar", "baz"]}>
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);

      expect(result.current.processedLogLines).toHaveLength(3);
      expect(result.current.processedLogLines).toStrictEqual([[0], 1, [2]]);
    });
    it("non matching filters should collapse all of the logs", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router route="?filters=100wrong">
          <LogContextProvider initialLogLines={["foo", "bar", "baz"]}>
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);

      expect(result.current.processedLogLines).toHaveLength(1);
      expect(result.current.processedLogLines).toStrictEqual([[0, 1, 2]]);
    });
    describe("applying multiple filters should filter the list of logs and collapse unmatching ones", () => {
      it("should `AND` filters by default", () => {
        const wrapper: React.FC<{ children: React.ReactNode }> = ({
          children,
        }) => (
          <Router route="?filters=100A,1003">
            <LogContextProvider
              initialLogLines={["A line 1", "B line 2", "C line 3"]}
            >
              {children}
            </LogContextProvider>
          </Router>
        );
        const { result } = renderHook(() => useLogContext(), { wrapper });
        expect(result.current.lineCount).toBe(3);
        expect(result.current.processedLogLines).toHaveLength(1);
        expect(result.current.processedLogLines).toStrictEqual([[0, 1, 2]]);
      });
      it("should `AND` filters if the query param specifies it", () => {
        const wrapper: React.FC<{ children: React.ReactNode }> = ({
          children,
        }) => (
          <Router route="?filters=100A,1003&filterLogic=and">
            <LogContextProvider
              initialLogLines={["A line 1", "B line 2", "C line 3"]}
            >
              {children}
            </LogContextProvider>
          </Router>
        );
        const { result } = renderHook(() => useLogContext(), { wrapper });
        expect(result.current.lineCount).toBe(3);
        expect(result.current.processedLogLines).toHaveLength(1);
        expect(result.current.processedLogLines).toStrictEqual([[0, 1, 2]]);
      });
      it("should `OR` filters if the query param specifies it", () => {
        const wrapper: React.FC<{ children: React.ReactNode }> = ({
          children,
        }) => (
          <Router route="?filters=100A,1003&filterLogic=or">
            <LogContextProvider
              initialLogLines={["A line 1", "B line 2", "C line 3"]}
            >
              {children}
            </LogContextProvider>
          </Router>
        );
        const { result } = renderHook(() => useLogContext(), { wrapper });
        expect(result.current.lineCount).toBe(3);
        expect(result.current.processedLogLines).toHaveLength(3);
        expect(result.current.processedLogLines).toStrictEqual([0, [1], 2]);
      });
    });
  });

  describe("search", () => {
    it("shouldn't return any matching searches if a search hasn't been placed", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router>
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      expect(result.current.searchState.searchRange).toBeUndefined();
      expect(result.current.searchState.hasSearch).toBe(false);
    });
    it("should return the correct number of matching searches", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router>
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("A line");
      });
      expect(result.current.searchState.searchRange).toBe(1);
      expect(result.current.searchState.hasSearch).toBe(true);
    });
    it("should allow regex searches", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router>
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("[a-b] line");
      });
      expect(result.current.searchState.searchRange).toBe(2);
      expect(result.current.searchState.hasSearch).toBe(true);
    });
    it("should allow case insensitive searches", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router>
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.searchState.caseSensitive).toBeFalsy();
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("a line");
      });
      expect(result.current.searchState.searchRange).toBe(1);
      expect(result.current.searchState.hasSearch).toBe(true);
    });
    it("should allow case sensitive searches", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router>
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.searchState.caseSensitive).toBeFalsy();
      expect(result.current.lineCount).toBe(3);
      act(() => {
        result.current.setSearch("a line");
      });
      act(() => {
        result.current.setCaseSensitive(true);
      });
      expect(result.current.searchState.searchRange).toBeUndefined();
      expect(result.current.searchState.hasSearch).toBe(true);
    });
    it("should only search non filtered out lines", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router route="?filters=100A,1003&filterLogic=or">
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("A line");
      });
      expect(result.current.searchState.searchRange).toBe(1);
      act(() => {
        result.current.setSearch("B line");
      });
      expect(result.current.searchState.searchRange).toBeUndefined();
    });
    it("should only search within our bounds", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router route="?upper=1">
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("line");
      });
      expect(result.current.searchState.searchRange).toBe(2);
    });
  });
  describe("pagination", () => {
    it("should reset search index to 0 when a new search is applied", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router>
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("line");
      });
      expect(result.current.searchState.hasSearch).toBe(true);
      expect(result.current.searchState.searchRange).toBe(3);
      expect(result.current.searchState.searchIndex).toBe(0);
    });
    it("paginating should increment and decrement the search index", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router>
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("line");
      });
      expect(result.current.searchState.searchIndex).toBe(0);
      act(() => {
        result.current.paginate(DIRECTION.NEXT);
      });
      expect(result.current.searchState.searchIndex).toBe(1);
      act(() => {
        result.current.paginate(DIRECTION.PREVIOUS);
      });
      expect(result.current.searchState.searchIndex).toBe(0);
    });
    it("paginating past the searchRange should jump to the opposite end", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <Router>
          <LogContextProvider
            initialLogLines={["A line 1", "B line 2", "C line 3"]}
          >
            {children}
          </LogContextProvider>
        </Router>
      );
      const { result } = renderHook(() => useLogContext(), { wrapper });
      expect(result.current.lineCount).toBe(3);
      expect(result.current.processedLogLines).toHaveLength(3);
      act(() => {
        result.current.setSearch("line");
      });
      expect(result.current.searchState.searchIndex).toBe(0);
      act(() => {
        result.current.paginate(DIRECTION.PREVIOUS);
      });
      expect(result.current.searchState.searchIndex).toBe(2);
      act(() => {
        result.current.paginate(DIRECTION.NEXT);
      });
      expect(result.current.searchState.searchIndex).toBe(0);
    });
  });
});
