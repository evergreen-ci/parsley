import { calculatePageSize } from "./utils";

describe("calculatePageSize", () => {
  it("the first page should have the maxPageSize or totalItemCount, whichever is smaller", () => {
    expect(
      calculatePageSize({
        maxPageSize: 10,
        totalItemCount: 100,
        currentPage: 0,
        offset: 0,
      })
    ).toBe(10);
    expect(
      calculatePageSize({
        maxPageSize: 10,
        totalItemCount: 5,
        currentPage: 0,
        offset: 0,
      })
    ).toBe(5);
    expect(
      calculatePageSize({
        maxPageSize: 10,
        totalItemCount: 0,
        currentPage: 0,
        offset: 0,
      })
    ).toBe(0);
    expect(
      calculatePageSize({
        maxPageSize: 10,
        totalItemCount: 100,
        currentPage: 0,
        offset: 5,
      })
    ).toBe(10);
    expect(
      calculatePageSize({
        maxPageSize: 10,
        totalItemCount: 5,
        currentPage: 0,
        offset: 5,
      })
    ).toBe(5);
  });
  it("subsequent pages should have the maxPageSize + the offset, or the remaining items, whichever is smaller", () => {
    expect(
      calculatePageSize({
        maxPageSize: 15,
        totalItemCount: 100,
        currentPage: 1,
        offset: 5,
      })
    ).toBe(20);
    expect(
      calculatePageSize({
        maxPageSize: 15,
        totalItemCount: 100,
        currentPage: 2,
        offset: 5,
      })
    ).toBe(20);
    expect(
      calculatePageSize({
        maxPageSize: 15,
        totalItemCount: 100,
        currentPage: 3,
        offset: 5,
      })
    ).toBe(20);
    expect(
      calculatePageSize({
        maxPageSize: 15,
        totalItemCount: 100,
        currentPage: 4,
        offset: 5,
      })
    ).toBe(20);
    expect(
      calculatePageSize({
        maxPageSize: 15,
        totalItemCount: 100,
        currentPage: 6,
        offset: 5,
      })
    ).toBe(10);
  });
});
