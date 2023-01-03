import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import {
  // This is okay as long as there is only one version of history
  // https://reactrouter.com/docs/en/v6/routers/history-router
  unstable_HistoryRouter as HistoryRouter,
  MemoryRouter,
} from "react-router-dom";
import { useQueryParams } from "hooks/useQueryParam";
import { useHighlightParam } from ".";

const useHighlightJointHook = () => {
  const [highlights, setHighlights] = useHighlightParam();
  const [allQueryParams] = useQueryParams();
  return { highlights, setHighlights, allQueryParams };
};

describe("useHighlightParam", () => {
  it("setting a highlight param should not update other values", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useHighlightJointHook(), { wrapper });

    expect(result.current.allQueryParams).toMatchObject({ search: "test" });
    const newHighlight = ["newHighlight"];
    act(() => {
      result.current.setHighlights(newHighlight);
    });
    expect(result.current.highlights).toStrictEqual(newHighlight);
    expect(result.current.allQueryParams).toMatchObject({
      highlights: "newHighlight",
      search: "test",
    });
  });

  it("should default to empty array if not in URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useHighlightJointHook(), { wrapper });
    expect(result.current.highlights).toStrictEqual([]);
  });

  it("should properly process highlights from URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?highlights=failed,passed"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useHighlightJointHook(), { wrapper });
    expect(result.current.highlights).toStrictEqual(["failed", "passed"]);
  });
  it("should properly encode highlights in URL", () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <HistoryRouter history={history}>{children}</HistoryRouter>
    );
    const { result } = renderHook(() => useHighlightJointHook(), { wrapper });
    act(() => {
      result.current.setHighlights(["something,else", "failed"]);
    });
    expect(result.current.allQueryParams).toMatchObject({
      highlights: ["something%2Celse", "failed"],
    });
    expect(history.location.search).toBe(
      "?highlights=something%25252Celse,failed"
    );
  });
  it("should properly decode highlights from URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?highlights=something%252Celse,failed"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useHighlightJointHook(), { wrapper });
    expect(result.current.highlights).toStrictEqual([
      "something,else",
      "failed",
    ]);
  });
});
