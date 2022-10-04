import { DIRECTION } from "./types";

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
