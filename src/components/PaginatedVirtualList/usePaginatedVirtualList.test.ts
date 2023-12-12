import { act, renderHook, waitFor } from "test_utils";
import usePaginatedVirtualList from "./usePaginatedVirtualList";

describe("usePaginatedVirtualList", () => {
  const rowCount = 11500;
  const paginationThreshold = 5000;
  const paginationOffset = 100;
  const ref = {
    current: null,
  };
  it("should return correct startingIndex and page size on the first page", () => {
    const { result } = renderHook(() =>
      usePaginatedVirtualList({
        paginationOffset,
        paginationThreshold,
        ref,
        rowCount,
      })
    );
    expect(result.current.startingIndex).toBe(0);
    expect(result.current.pageSize).toBe(5000);
  });

  it("should not perform offset compensation on the first page", () => {
    const { result } = renderHook(() =>
      usePaginatedVirtualList({
        paginationOffset,
        paginationThreshold,
        ref,
        rowCount,
      })
    );
    expect(result.current.pageSize).toBe(paginationThreshold);
  });

  it("page size should not exceed row count", () => {
    const { result } = renderHook(() =>
      usePaginatedVirtualList({
        paginationOffset: 100,
        paginationThreshold: 5000,
        ref,
        rowCount: 1000,
      })
    );
    expect(result.current.pageSize).toBe(1000);
  });

  describe("scrolling to the next page", () => {
    it("should reflect offset when not on the first page and should scroll to compensate for offset", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
          rowCount,
        })
      );

      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.currentPage).toBe(1);
      expect(result.current.startingIndex).toBe(4900);
      expect(scrollToIndexMock).toHaveBeenCalledWith({
        align: "end",
        index: paginationOffset,
      });
      expect(result.current.pageSize).toBe(
        paginationThreshold + paginationOffset
      );
    });
    it("should not scroll to next page if on last page", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
          rowCount,
        })
      );

      // Go to last page
      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(4900);
      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(9900);
      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(9900);
      expect(scrollToIndexMock).toHaveBeenCalledTimes(2);
      expect(result.current.currentPage).toBe(2);
    });
    it("last page should have the remaining rows", () => {
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref,
          rowCount,
        })
      );
      // Go to last page
      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(4900);
      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(9900);
      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(9900);
      expect(result.current.pageSize).toBe(1600);
      expect(result.current.currentPage).toBe(2);
    });
    it("should not scroll to next page if there is only one page", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset: 100,
          paginationThreshold: 5000,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
          rowCount: 1000,
        })
      );

      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(0);
      expect(scrollToIndexMock).toHaveBeenCalledTimes(0);
    });
  });

  it("should reset the page to 0 if the row count is less than the page size", () => {
    const { rerender, result } = renderHook(
      ({ overrideRowCount }) =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref,
          rowCount: overrideRowCount,
        }),
      { initialProps: { overrideRowCount: rowCount } }
    );
    act(() => {
      result.current.scrollToNextPage();
    });
    expect(result.current.currentPage).toBe(1);
    rerender({ overrideRowCount: 1000 });
    expect(result.current.currentPage).toBe(0);
  });

  describe("scrolling to the previous page", () => {
    it("should reflect offset when not on the first page and should scroll to compensate for offset", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
          rowCount,
        })
      );

      // Go to second page
      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(4900);
      expect(scrollToIndexMock).toHaveBeenCalledWith({
        align: "end",
        index: paginationOffset,
      });
      expect(result.current.pageSize).toBe(
        paginationThreshold + paginationOffset
      );

      // Go to first page
      act(() => {
        result.current.scrollToPrevPage();
      });
      expect(result.current.startingIndex).toBe(0);
      expect(scrollToIndexMock).toHaveBeenCalledWith({
        align: "end",
        index: paginationOffset,
      });
    });
    it("should not scroll to previous page if on first page", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
          rowCount,
        })
      );
      expect(result.current.currentPage).toBe(0);
      act(() => {
        result.current.scrollToPrevPage();
      });
      expect(result.current.startingIndex).toBe(0);
      expect(scrollToIndexMock).not.toHaveBeenCalled();
      expect(result.current.currentPage).toBe(0);
    });
  });

  describe("scrolling to a line", () => {
    it("scrolling to a line on the current page should not change the page", () => {
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref,
          rowCount,
        })
      );
      act(() => {
        result.current.scrollToLine(1000);
      });
      expect(result.current.startingIndex).toBe(0);
      expect(result.current.pageSize).toBe(paginationThreshold);
      expect(result.current.currentPage).toBe(0);
    });
    it("scrolling to a line on a different page should change the page", () => {
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref,
          rowCount,
        })
      );
      act(() => {
        result.current.scrollToLine(5000);
      });
      expect(result.current.startingIndex).toBe(4900);
      expect(result.current.pageSize).toBe(
        paginationThreshold + paginationOffset
      );
      expect(result.current.currentPage).toBe(1);
      act(() => {
        result.current.scrollToLine(11500);
      });
      expect(result.current.currentPage).toBe(2);
      act(() => {
        result.current.scrollToLine(0);
      });
      expect(result.current.currentPage).toBe(0);
    });

    it("scrolling to a line on a different page should not trigger a double scroll", async () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          paginationOffset,
          paginationThreshold,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
          rowCount,
        })
      );
      act(() => {
        result.current.scrollToLine(6000);
      });
      await waitFor(() => {
        expect(scrollToIndexMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
