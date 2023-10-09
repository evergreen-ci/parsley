import { createRef } from "react";
import { VirtuosoMockContext } from "react-virtuoso";
import { LogContextProvider } from "context/LogContext";
import * as logContext from "context/LogContext";
import { renderWithRouterMatch as render, screen } from "test_utils";
import LogPane from ".";

const list = Array.from({ length: 100 }, (_, i) => `${i}`);

const RowRenderer = (index: number) => (
  <pre key={index}>Some Line: {index}</pre>
);

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <VirtuosoMockContext.Provider value={{ itemHeight: 10, viewportHeight: 500 }}>
    <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
  </VirtuosoMockContext.Provider>
);

describe("logPane", () => {
  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it("should render the virtualized list with the passed in row type", () => {
    render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
      wrapper,
    });
    expect(screen.getByText("Some Line: 0")).toBeInTheDocument();
    expect(screen.queryByText("Some Line: 99")).not.toBeInTheDocument();
  });

  it("should execute scroll and wrapping functionality after log pane loads", () => {
    jest.useFakeTimers();
    const mockedLogContext = jest.spyOn(logContext, "useLogContext");
    const mockedSetWrap = jest.fn();
    const mockedScrollToLine = jest.fn();

    // @ts-ignore-error - Only mocking a subset of useLogContext needed for this test.
    mockedLogContext.mockImplementation(() => ({
      listRef: createRef<null>(),
      preferences: {
        setWrap: mockedSetWrap,
      },
      processedLogLines: Array.from(list.keys()),
      scrollToLine: mockedScrollToLine,
    }));

    render(<LogPane rowCount={list.length} rowRenderer={RowRenderer} />, {
      route: "?shareLine=5",
      wrapper,
    });
    jest.advanceTimersByTime(50);
    expect(mockedSetWrap).toHaveBeenCalledTimes(1);
    expect(mockedScrollToLine).toHaveBeenCalledTimes(1);
  });
});
