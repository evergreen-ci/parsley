/**
 * `arraySymmetricDifference` takes in two arrays and returns only the elements not in common between the two arrays.
 * @example arraySymmetricDifference([1, 2, 3], [2, 3, 4]) // [1, 4]
 */
const arraySymmetricDifference = <T>(a: T[], b: T[]) => {
  if (typeof a[0] === "object" || typeof b[0] === "object") {
    throw new TypeError("arraySymmetricDifference does not support objects");
  }
  const setA = new Set(a);
  const setB = new Set(b);
  const difference = Array.from(
    new Set(a.concat(b).filter((x) => !setA.has(x) || !setB.has(x)))
  );

  return difference;
};

/** `conditionalToArray` takes in a value and transforms it into an array if it is not one and should be */
const conditionalToArray = <T>(value: T, shouldBeArray: boolean) => {
  if (shouldBeArray) {
    return Array.isArray(value) ? value : [value];
  }
  return value;
};

export { arraySymmetricDifference, conditionalToArray };
