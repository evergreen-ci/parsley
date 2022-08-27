import React from "react";
import { act, renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { useQueryParam, useQueryString } from ".";

describe("useQueryString", () => {
  it("should return the correct query string", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );

    const { result } = renderHook(() => useQueryString(), {
      wrapper,
    });
    expect(result.current[0].get("search")).toBe("test");
  });
  it("setting a query string should update the query string", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useQueryString(), {
      wrapper,
    });
    act(() => {
      result.current[1]({ search: "test2" });
    });
    expect(result.current[0].get("search")).toBe("test2");
  });
});

const useJointHook = (param: string, def: any) => {
  const queryParam = useQueryParam(param, def);
  const queryString = useQueryString();
  return { queryParam, queryString };
};
describe("useQueryParam", () => {
  it("setting a query param value should not update other values", () => {
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
    );
    const { result } = renderHook(() => useJointHook("other", ""), {
      wrapper,
    });
    expect(result.current.queryString[0].toString()).toBe("search=test");
    act(() => {
      result.current.queryParam[1]("test2");
    });
    expect(result.current.queryParam[0]).toBe("test2");
    expect(result.current.queryString[0].toString()).toBe(
      "other=test2&search=test"
    );
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
});
