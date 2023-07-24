import { calculatePageSize } from "./utils";

describe("calculatePageSize", () => {
  it("the first page should have the maxPageSize or totalItemCount, whichever is smaller", () => {
    expect(
      calculatePageSize({
        currentPage: 0,
        maxPageSize: 10,
        totalItemCount: 100,
      })
    ).toBe(10);
    expect(
      calculatePageSize({
        currentPage: 0,
        maxPageSize: 10,
        totalItemCount: 5,
      })
    ).toBe(5);
    expect(
      calculatePageSize({
        currentPage: 0,
        maxPageSize: 10,
        totalItemCount: 0,
      })
    ).toBe(0);
    expect(
      calculatePageSize({
        currentPage: 0,
        maxPageSize: 10,
        totalItemCount: 100,
      })
    ).toBe(10);
    expect(
      calculatePageSize({
        currentPage: 0,
        maxPageSize: 10,
        totalItemCount: 5,
      })
    ).toBe(5);
  });
  it("subsequent pages should have the maxPageSize, or the remaining items, whichever is smaller", () => {
    expect(
      calculatePageSize({
        currentPage: 1,
        maxPageSize: 15,
        totalItemCount: 100,
      })
    ).toBe(15);
    expect(
      calculatePageSize({
        currentPage: 2,
        maxPageSize: 15,
        totalItemCount: 100,
      })
    ).toBe(15);
    expect(
      calculatePageSize({
        currentPage: 3,
        maxPageSize: 15,
        totalItemCount: 100,
      })
    ).toBe(15);
    expect(
      calculatePageSize({
        currentPage: 4,
        maxPageSize: 15,
        totalItemCount: 100,
      })
    ).toBe(15);
    expect(
      calculatePageSize({
        currentPage: 6,
        maxPageSize: 15,
        totalItemCount: 100,
      })
    ).toBe(10);
  });
});
