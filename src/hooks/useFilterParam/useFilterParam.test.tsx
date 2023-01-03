import { act, renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { CaseSensitivity, MatchType } from "constants/enums";
import { useQueryParams } from "hooks/useQueryParam";
import { useFilterParam } from ".";

const useFilterJointHook = () => {
  const [filters, setFilters] = useFilterParam();
  const [allQueryParams] = useQueryParams();
  return { filters, setFilters, allQueryParams };
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
        matchType: MatchType.Exact,
        name: "newfilter",
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
        matchType: MatchType.Exact,
        name: "failed",
        visible: true,
      },
      {
        caseSensitive: CaseSensitivity.Sensitive,
        matchType: MatchType.Exact,
        name: "passed",
        visible: true,
      },
    ]);
  });
});
