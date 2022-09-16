import { act, renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { useQueryParam, useQueryParams } from ".";

describe("useQueryParams", () => {
  it("should return the correct query string", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useQueryParams(), {
      wrapper,
    });
    expect(result.current[0].search).toBe("test");
  });
  it("setting a query string should update the query string", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useQueryParams(), {
      wrapper,
    });
    act(() => {
      result.current[1]({ search: "test2" });
    });
    expect(result.current[0].search).toBe("test2");
  });
});

const useJointHook = (param: string, def: any) => {
  const queryParam = useQueryParam(param, def);
  const queryParams = useQueryParams();
  return { queryParam, queryParams };
};
describe("useQueryParam", () => {
  it("setting a query param value should not update other values", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useJointHook("other", ""), {
      wrapper,
    });
    expect(result.current.queryParams[0]).toMatchObject({ search: "test" });
    act(() => {
      result.current.queryParam[1]("test2");
    });
    expect(result.current.queryParam[0]).toBe("test2");
    expect(result.current.queryParams[0]).toMatchObject({
      other: "test2",
      search: "test",
    });
  });
  it("query param should be the default value if not set", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useJointHook("other", "default"), {
      wrapper,
    });
    expect(result.current.queryParam[0]).toBe("default");
  });
  it("query param should not be default if it exists", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?other=something"]}>
        {children}
      </MemoryRouter>
    );
    const { result } = renderHook(() => useJointHook("other", "default"), {
      wrapper,
    });
    expect(result.current.queryParam[0]).toBe("something");
  });

  describe("should handle strings", () => {
    it("when a default is provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MemoryRouter initialEntries={["/?search=test"]}>
          {children}
        </MemoryRouter>
      );
      const { result } = renderHook(() => useJointHook("search", "test"), {
        wrapper,
      });
      expect(result.current.queryParam[0]).toBe("test");
      act(() => {
        result.current.queryParam[1]("test2");
      });
      expect(result.current.queryParam[0]).toBe("test2");
    });
    it("when a default is not provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
      const { result } = renderHook(() => useJointHook("search", "test"), {
        wrapper,
      });
      expect(result.current.queryParam[0]).toBe("test");
      act(() => {
        result.current.queryParam[1]("test2");
      });
      expect(result.current.queryParam[0]).toBe("test2");
    });
  });
  describe("should handle numbers", () => {
    it("when a default is provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MemoryRouter initialEntries={["/?search=1"]}>{children}</MemoryRouter>
      );
      const { result } = renderHook(() => useJointHook("search", 1), {
        wrapper,
      });
      expect(result.current.queryParam[0]).toBe(1);
      act(() => {
        result.current.queryParam[1](2);
      });
      expect(result.current.queryParam[0]).toBe(2);
    });
    it("when a default is not provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
      const { result } = renderHook(() => useJointHook("search", 1), {
        wrapper,
      });
      expect(result.current.queryParam[0]).toBe(1);
      act(() => {
        result.current.queryParam[1](2);
      });
      expect(result.current.queryParam[0]).toBe(2);
    });
  });
  describe("should handle booleans", () => {
    it("when a default is provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MemoryRouter initialEntries={["/?search=true"]}>
          {children}
        </MemoryRouter>
      );
      const { result } = renderHook(() => useJointHook("search", true), {
        wrapper,
      });
      expect(result.current.queryParam[0]).toBe(true);
      act(() => {
        result.current.queryParam[1](false);
      });
      expect(result.current.queryParam[0]).toBe(false);
    });
    it("when a default is not provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
      const { result } = renderHook(() => useJointHook("search", true), {
        wrapper,
      });
      expect(result.current.queryParam[0]).toBe(true);
      act(() => {
        result.current.queryParam[1](false);
      });
      expect(result.current.queryParam[0]).toBe(false);
    });
  });
  describe("should handle arrays", () => {
    it("when a default is provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => (
        <MemoryRouter initialEntries={["/?search=1"]}>{children}</MemoryRouter>
      );
      const { result } = renderHook(() => useJointHook("search", [1]), {
        wrapper,
      });
      expect(result.current.queryParam[0]).toStrictEqual([1]);
      act(() => {
        result.current.queryParam[1]([2]);
      });
      expect(result.current.queryParam[0]).toStrictEqual([2]);
      act(() => {
        result.current.queryParam[1]([3, 4]);
      });
      expect(result.current.queryParam[0]).toStrictEqual([3, 4]);
    });
    it("when a default is not provided", () => {
      const wrapper: React.FC<{ children: React.ReactNode }> = ({
        children,
      }) => <MemoryRouter initialEntries={["/"]}>{children}</MemoryRouter>;
      const { result } = renderHook(() => useJointHook("search", [1]), {
        wrapper,
      });
      expect(result.current.queryParam[0]).toStrictEqual([1]);
      act(() => {
        result.current.queryParam[1]([2]);
      });
      expect(result.current.queryParam[0]).toStrictEqual([2]);
      act(() => {
        result.current.queryParam[1]([3, 4]);
      });
      expect(result.current.queryParam[0]).toStrictEqual([3, 4]);
    });
  });
});
