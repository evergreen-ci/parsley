import { MemoryRouter, useLocation } from "react-router-dom";
import { useQueryParams } from "hooks/useQueryParam";
import { act, renderHook } from "test_utils";
import { useHighlightParam } from ".";

const useHighlightJointHook = () => {
  const [highlights, setHighlights] = useHighlightParam();
  const [allQueryParams] = useQueryParams();
  return { allQueryParams, highlights, setHighlights };
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
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(
      () => ({
        ...useHighlightJointHook(),
        location: useLocation(),
      }),
      { wrapper },
    );
    act(() => {
      result.current.setHighlights(["something,else", "failed"]);
    });
    expect(result.current.allQueryParams).toMatchObject({
      highlights: ["something,else", "failed"],
    });
    expect(result.current.location.search).toBe(
      "?highlights=something%252Celse,failed",
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
  it("should not corrupt large numerical values when decoding highlights from URL", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?highlights=1234567890123456789"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useHighlightJointHook(), { wrapper });
    expect(result.current.highlights).toStrictEqual(["1234567890123456789"]);
  });
  it("should encode special values when there are multiple highlights", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={[""]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useHighlightJointHook(), { wrapper });
    expect(result.current.highlights).toStrictEqual([]);
    act(() => {
      result.current.setHighlights(["something,else", "failed"]);
    });
    expect(result.current.allQueryParams).toMatchObject({
      highlights: ["something,else", "failed"],
    });
  });
});
