/**
 * `calculatePageSize` is used to calculate the number of items to render on the current page.
 * It takes into account the offset, which allows us to render more items than the pageSize. This is
 * necessary to ensure that the user can scroll back up without seeing a pagination event.
 * @param pageSize - The number of items to render per page
 * @param totalItemCount - The total number of items in the list
 * @param currentPage - The current page number
 * @param offset - The number of items to render beyond the pageSize
 * @returns
 */
const calculatePageSize = (
  pageSize: number,
  totalItemCount: number,
  currentPage: number,
  offset: number
) => {
  // The first page always has the pageSize or totalItemCount, whichever is smaller
  if (currentPage === 0) {
    return Math.min(pageSize, totalItemCount);
  }

  // The rest of the pages have the pageSize + the offset, or the remaining items, whichever is smaller
  const remainingItems = totalItemCount - pageSize * currentPage;
  return Math.min(pageSize + offset, remainingItems);
};

export { calculatePageSize };
