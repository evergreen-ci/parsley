import { act, renderHook } from "@testing-library/react-hooks";
import { MemoryRouter } from "react-router-dom";
import { QueryParams } from "constants/queryParams";
import { useQueryParams } from "hooks/useQueryParam";
import useLineRangeSelection from ".";

const useLineRangeSelectionJointHook = () => {
  const [range, setRange] = useLineRangeSelection();
  const [allQueryParams] = useQueryParams();
  return { allQueryParams, range, setRange };
};
const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <MemoryRouter initialEntries={["/?search=test"]}>{children}</MemoryRouter>
);
describe("useLineRangeSelection", () => {
  it("setting a line should not update other values", () => {
    const { result } = renderHook(() => useLineRangeSelectionJointHook(), {
      wrapper,
    });

    expect(result.current.allQueryParams).toMatchObject({ search: "test" });

    act(() => {
      result.current.setRange({ startingLine: 1 });
    });
    expect(result.current.range).toStrictEqual({
      endingLine: null,
      startingLine: 1,
    });
    expect(result.current.allQueryParams).toMatchObject({
      [QueryParams.SelectedLineRange]: "L1",
      search: "test",
    });
  });
  it("setting a range should reflect in the url", () => {
    const { result } = renderHook(() => useLineRangeSelectionJointHook(), {
      wrapper,
    });

    expect(result.current.allQueryParams).toMatchObject({ search: "test" });

    act(() => {
      result.current.setRange({ endingLine: 10, startingLine: 1 });
    });
    expect(result.current.range).toStrictEqual({
      endingLine: 10,
      startingLine: 1,
    });
    expect(result.current.allQueryParams).toMatchObject({
      [QueryParams.SelectedLineRange]: "L1-L10",
      search: "test",
    });
  });
});
