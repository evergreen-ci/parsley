/**
 * validateRegexp tests if a provided string is a valid regular expression
 * @param regexp - the regexp to test
 */
const validateRegexp = (regexp: string): boolean => {
  try {
    // eslint-disable-next-line no-new
    new RegExp(regexp);
    return true;
  } catch (e) {
    return false;
  }
};

export { validateRegexp };
