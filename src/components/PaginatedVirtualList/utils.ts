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

export { calculatePageSize };
