import { act } from "@testing-library/react";
import { renderHook } from "@testing-library/react-hooks";
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
        rowCount,
        paginationThreshold,
        paginationOffset,
        ref,
      })
    );
    expect(result.current.startingIndex).toBe(0);
    expect(result.current.pageSize).toBe(5000);
  });

  it("should not perform offset compensation on the first page", () => {
    const { result } = renderHook(() =>
      usePaginatedVirtualList({
        rowCount,
        paginationThreshold,
        paginationOffset,
        ref,
      })
    );
    expect(result.current.pageSize).toBe(paginationThreshold);
  });

  it("page size should not exceed row count", () => {
    const { result } = renderHook(() =>
      usePaginatedVirtualList({
        rowCount: 1000,
        paginationThreshold: 5000,
        paginationOffset: 100,
        ref,
      })
    );
    expect(result.current.pageSize).toBe(1000);
  });

  describe("scrolling to the next page", () => {
    it("should reflect offset when not on the first page and should scroll to compensate for offset", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          rowCount,
          paginationThreshold,
          paginationOffset,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
        })
      );

      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.currentPage).toBe(1);
      expect(result.current.startingIndex).toBe(4900);
      expect(scrollToIndexMock).toHaveBeenCalledWith({
        index: paginationOffset,
        align: "end",
      });
      expect(result.current.pageSize).toBe(
        paginationThreshold + paginationOffset
      );
    });
    it("should not scroll to next page if on last page", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          rowCount,
          paginationThreshold,
          paginationOffset,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
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
          rowCount,
          paginationThreshold,
          paginationOffset,
          ref,
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
          rowCount: 1000,
          paginationThreshold: 5000,
          paginationOffset: 100,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
        })
      );

      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(0);
      expect(scrollToIndexMock).toHaveBeenCalledTimes(0);
    });
  });

  describe("scrolling to the previous page", () => {
    it("should reflect offset when not on the first page and should scroll to compensate for offset", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          rowCount,
          paginationThreshold,
          paginationOffset,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
        })
      );

      // Go to second page
      act(() => {
        result.current.scrollToNextPage();
      });
      expect(result.current.startingIndex).toBe(4900);
      expect(scrollToIndexMock).toHaveBeenCalledWith({
        index: paginationOffset,
        align: "end",
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
        index: paginationOffset,
        align: "end",
      });
    });
    it("should not scroll to previous page if on first page", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          rowCount,
          paginationThreshold,
          paginationOffset,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
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
          rowCount,
          paginationThreshold,
          paginationOffset,
          ref,
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
          rowCount,
          paginationThreshold,
          paginationOffset,
          ref,
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

    it("scrolling to a line on a different page should not trigger a double scroll", () => {
      const scrollToIndexMock = jest.fn();
      const { result } = renderHook(() =>
        usePaginatedVirtualList({
          rowCount,
          paginationThreshold,
          paginationOffset,
          ref: {
            current: {
              scrollToIndex: scrollToIndexMock,
            },
          },
        })
      );
      act(() => {
        result.current.scrollToLine(6000);
      });
      expect(scrollToIndexMock).toHaveBeenCalledTimes(1);
    });
  });
});
