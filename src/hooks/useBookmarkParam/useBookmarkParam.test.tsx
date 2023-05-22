import { act, renderHook } from "@testing-library/react-hooks";
import { createMemoryHistory } from "history";
import {
  // This is okay as long as there is only one version of history
  // https://reactrouter.com/docs/en/v6/routers/history-router
  unstable_HistoryRouter as HistoryRouter,
} from "react-router-dom";
import { useQueryParams } from "hooks/useQueryParam";
import { useBookmarkParam } from ".";

const useFilterJointHook = () => {
  const [bookmarks, setBookmarks] = useBookmarkParam();
  const [allQueryParams] = useQueryParams();
  return { bookmarks, setBookmarks, allQueryParams };
};

const generateWrapper = (initialEntries: string) => {
  const history = createMemoryHistory({ initialEntries: [initialEntries] });
  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <HistoryRouter history={history}>{children}</HistoryRouter>
  );
  return { wrapper, history };
};

describe("useBookmarkParam", () => {
  it("should default to empty array if not in URL", () => {
    const { wrapper } = generateWrapper("");
    const { result } = renderHook(() => useFilterJointHook(), {
      wrapper,
    });

    expect(result.current.bookmarks).toStrictEqual([]);
  });
  it("should properly process bookmarks from URL", () => {
    const { wrapper } = generateWrapper("/?bookmarks=0,1");
    const { result } = renderHook(() => useFilterJointHook(), {
      wrapper,
    });

    expect(result.current.bookmarks).toStrictEqual([0, 1]);
  });
  it("should update bookmarks in URL", async () => {
    const { wrapper, history } = generateWrapper("/?bookmarks=0,1");
    const { result } = renderHook(() => useFilterJointHook(), {
      wrapper,
    });

    expect(result.current.bookmarks).toStrictEqual([0, 1]);
    act(() => {
      result.current.setBookmarks([1, 2, 3]);
    });
    expect(result.current.bookmarks).toStrictEqual([1, 2, 3]);
    expect(history.location.search).toBe("?bookmarks=1,2,3");
  });

  it("should not modify other query params", () => {
    const { wrapper, history } = generateWrapper("/?bookmarks=0,1&search=test");
    const { result } = renderHook(() => useFilterJointHook(), {
      wrapper,
    });

    expect(result.current.allQueryParams).toMatchObject({
      search: "test",
      bookmarks: [0, 1],
    });

    act(() => {
      result.current.setBookmarks([1, 2, 3]);
    });

    expect(result.current.allQueryParams).toMatchObject({
      search: "test",
      bookmarks: [1, 2, 3],
    });
    expect(history.location.search).toBe("?bookmarks=1,2,3&search=test");
  });

  it.skip("should not corrupt other complex query params", () => {
    const { wrapper, history } = generateWrapper(
      "/?bookmarks=0,1&filters=100%2522CMD%253A%2520drop%2522%252C%2522attr%2522%253A%257B%2522namespace%2522%253A%2522drop_database_sharded_DB_0.sharded_coll,100test"
    );
    const { result } = renderHook(() => useFilterJointHook(), {
      wrapper,
    });

    expect(result.current.allQueryParams).toMatchObject({
      bookmarks: [0, 1],
      filters: [
        '100"CMD: drop","attr":{"namespace":"drop_database_sharded_DB_0.sharded_coll',
        "100test",
      ],
    });

    act(() => {
      result.current.setBookmarks([1, 2, 3]);
    });
    expect(result.current.bookmarks).toStrictEqual([1, 2, 3]);
    expect(result.current.allQueryParams).toMatchObject({
      bookmarks: [1, 2, 3],
      filters: [
        '100"CMD: drop","attr":{"namespace":"drop_database_sharded_DB_0.sharded_coll',
        "100test",
      ],
    });
    expect(history.location.search).toBe(
      "?bookmarks=1,2,3&filters=100%2522CMD%253A%2520drop%2522%252C%2522attr%2522%253A%257B%2522namespace%2522%253A%2522drop_database_sharded_DB_0.sharded_coll,100test"
    );
  });
});
