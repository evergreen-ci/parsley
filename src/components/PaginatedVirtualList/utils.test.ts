import { calculatePageSize } from "./utils";

describe("calculatePageSize", () => {
  it("the first page should have the pageSize or totalItemCount, whichever is smaller", () => {
    expect(calculatePageSize(10, 100, 0, 0)).toBe(10);
    expect(calculatePageSize(10, 5, 0, 0)).toBe(5);
    expect(calculatePageSize(10, 0, 0, 0)).toBe(0);
    expect(calculatePageSize(10, 100, 0, 5)).toBe(10);
    expect(calculatePageSize(10, 5, 0, 5)).toBe(5);
  });
  it("subsequent pages should have the pageSize + the offset, or the remaining items, whichever is smaller", () => {
    expect(calculatePageSize(15, 100, 1, 5)).toBe(20);
    expect(calculatePageSize(15, 100, 2, 5)).toBe(20);
    expect(calculatePageSize(15, 100, 3, 5)).toBe(20);
    expect(calculatePageSize(15, 100, 4, 5)).toBe(20);
    expect(calculatePageSize(15, 100, 6, 5)).toBe(10);
  });
});
