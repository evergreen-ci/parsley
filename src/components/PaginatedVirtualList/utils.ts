type calculatePageSizeOptions = {
  maxPageSize: number;
  totalItemCount: number;
  currentPage: number;
  offset: number;
};
/**
 * `calculatePageSize` is used to calculate the number of items to render on the current page.
 * It takes into account the offset, which allows us to render more items than the pageSize. This is
 * necessary to ensure that the user can scroll back up without seeing a pagination event.
 * @param maxPageSize - The number of items to render per page
 * @param totalItemCount - The total number of items in the list
 * @param currentPage - The current page number
 * @param offset - The number of items to render beyond the pageSize
 * @returns
 */
const calculatePageSize = (options: calculatePageSizeOptions) => {
  const { maxPageSize, totalItemCount, currentPage, offset } = options;
  // The first page always has the maxPageSize or totalItemCount, whichever is smaller
  if (currentPage === 0) {
    return Math.min(maxPageSize, totalItemCount);
  }

  // The rest of the pages have the pageSize + the offset, or the remaining items, whichever is smaller
  const remainingItems = totalItemCount - maxPageSize * currentPage;
  return Math.min(maxPageSize + offset, remainingItems);
};

export { calculatePageSize };
