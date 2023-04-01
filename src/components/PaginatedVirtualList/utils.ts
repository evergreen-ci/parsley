type calculatePageSizeOptions = {
  maxPageSize: number;
  totalItemCount: number;
  currentPage: number;
};
/**
 * `calculatePageSize` is used to calculate the number of items to render on the current page.
 * It takes into account the offset, which is used to render more items than the maxPageSize. The offset is
 * necessary to ensure that the user can scroll to other pages without seeing a pagination event.
 * @param options.maxPageSize - The maximum number of items to render per page
 * @param options.totalItemCount - The total number of items in the list
 * @param options.currentPage - The current page number
 * @returns The number of items to render on the current page
 */
const calculatePageSize = (options: calculatePageSizeOptions) => {
  const { maxPageSize, totalItemCount, currentPage } = options;
  // The first page always has the maxPageSize or totalItemCount, whichever is smaller
  if (currentPage === 0) {
    return Math.min(maxPageSize, totalItemCount);
  }

  const remainingItems = totalItemCount - maxPageSize * currentPage;

  return Math.min(maxPageSize, remainingItems);
};

type CalculateStartingIndexOptions = {
  page: number;
  paginationThreshold: number;
  paginationOffset: number;
};
/**
 * `calculateStartingIndex` is used to calculate the starting index of the items to render on the current page.
 * @param options.page - The current page number
 * @param options.paginationThreshold - The maximum number of items to render per page
 * @param options.paginationOffset - The number of items to render beyond the paginationThreshold to ensure that the user can scroll to other pages without seeing a pagination event.
 * @returns The starting index of the items to render on the current page
 */
const calculateStartingIndex = (options: CalculateStartingIndexOptions) => {
  const { page, paginationThreshold, paginationOffset } = options;
  return page * paginationThreshold - (page > 0 ? paginationOffset : 0);
};

export { calculatePageSize, calculateStartingIndex };
