import { MemoryRouter, useLocation } from "react-router-dom";
import { CaseSensitivity, MatchType } from "constants/enums";
import { useQueryParams } from "hooks/useQueryParam";
import { act, renderHook } from "test_utils";
import { useFilterParam } from ".";

const useFilterJointHook = () => {
  const [filters, setFilters] = useFilterParam();
  const [allQueryParams] = useQueryParams();
  return { allQueryParams, filters, setFilters };
};

describe("useFilterParam", () => {
  it("setting a filter param should not update other values", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useFilterJointHook(), { wrapper });

    expect(result.current.allQueryParams).toMatchObject({ search: "test" });
    const newFilter = [
      {
        caseSensitive: CaseSensitivity.Insensitive,
        expression: "newfilter",
        matchType: MatchType.Exact,
        visible: true,
      },
    ];
    act(() => {
      result.current.setFilters(newFilter);
    });
    expect(result.current.filters).toStrictEqual(newFilter);
    expect(result.current.allQueryParams).toMatchObject({
      filters: "100newfilter",
      search: "test",
    });
  });

  it("should default to empty array if not in URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useFilterJointHook(), { wrapper });
    expect(result.current.filters).toStrictEqual([]);
  });

  it("should properly process filters from URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?filters=100failed,110passed"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useFilterJointHook(), { wrapper });
    expect(result.current.filters).toStrictEqual([
      {
        caseSensitive: CaseSensitivity.Insensitive,
        expression: "failed",
        matchType: MatchType.Exact,
        visible: true,
      },
      {
        caseSensitive: CaseSensitivity.Sensitive,
        expression: "passed",
        matchType: MatchType.Exact,
        visible: true,
      },
    ]);
  });

  it("should properly encode filters in URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(
      () => ({
        ...useFilterJointHook(),
        location: useLocation(),
      }),
      { wrapper }
    );
    act(() => {
      result.current.setFilters([
        {
          caseSensitive: CaseSensitivity.Insensitive,
          expression: "something,else",
          matchType: MatchType.Exact,
          visible: true,
        },
        {
          caseSensitive: CaseSensitivity.Insensitive,
          expression: "failed",
          matchType: MatchType.Exact,
          visible: true,
        },
      ]);
    });
    expect(result.current.allQueryParams).toMatchObject({
      filters: ["100something,else", "100failed"],
    });
    expect(result.current.location.search).toBe(
      "?filters=100something%252Celse,100failed"
    );
  });

  it("should properly decode filters from URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter
        initialEntries={["/?filters=100something%252Celse,100failed"]}
      >
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useFilterJointHook(), { wrapper });
    expect(result.current.filters).toStrictEqual([
      {
        caseSensitive: CaseSensitivity.Insensitive,
        expression: "something,else",
        matchType: MatchType.Exact,
        visible: true,
      },
      {
        caseSensitive: CaseSensitivity.Insensitive,
        expression: "failed",
        matchType: MatchType.Exact,
        visible: true,
      },
    ]);
  });

  it("should not corrupt large numerical values when decoding filters from URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?filters=1001234567890123456789"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useFilterJointHook(), { wrapper });
    expect(result.current.filters).toStrictEqual([
      {
        caseSensitive: CaseSensitivity.Insensitive,
        expression: "1234567890123456789",
        matchType: MatchType.Exact,
        visible: true,
      },
    ]);
  });
});
