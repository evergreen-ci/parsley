import { DIRECTION } from "./types";

/**
 * `getNextPage` returns the next index to paginate to based on the current index and the direction
 * @param index Current index of the row
 * @param range Number of rows that match the search term
 * @param direction Direction of the pagination
 * @returns The next index of the row that matches the search term based off of the direction
 */
const getNextPage = (index: number, range: number, direction: DIRECTION) => {
  let nextPage = index;
  if (direction === DIRECTION.NEXT) {
    if (index + 1 < range) {
      nextPage += 1;
    } else {
      nextPage = 0;
    }
  } else if (index - 1 < 0) {
    nextPage = range - 1;
  } else {
    nextPage -= 1;
  }
  return nextPage;
};

export { getNextPage };
