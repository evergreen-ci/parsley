import { VirtuosoMockContext } from "react-virtuoso";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen } from "test_utils";
import LogPane from ".";

describe("logPane", () => {
  it("should render the virtualized list with the passed in row type", () => {
    const list = Array.from({ length: 10000 }, (_, i) => `${i}`);

    const RowRenderer = (index: number) => (
      <pre key={index}>Some Line: {index}</pre>
    );

    render(
      <VirtuosoMockContext.Provider
        value={{ itemHeight: 10, viewportHeight: 500 }}
      >
        <LogContextProvider initialLogLines={list}>
          <LogPane rowCount={list.length} rowRenderer={RowRenderer} />
        </LogContextProvider>
      </VirtuosoMockContext.Provider>
    );

    expect(screen.getByText("Some Line: 0")).toBeInTheDocument();
    expect(screen.queryByText("Some Line: 9999")).not.toBeInTheDocument();
  });
});
