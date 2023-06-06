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

/**
 * `getRegexpError` returns the error message for a given regexp
 * @param regexp - the regexp to test
 * @returns
 */
const getRegexpError = (regexp: string): string => {
  try {
    // eslint-disable-next-line no-new
    new RegExp(regexp);
    return "";
  } catch (e) {
    // Removes the "Invalid regular expression: /.*: " prefix from the error message
    const message = (e as unknown as Error).message.replace(
      /Invalid regular expression: (\/.*\/: )?/gm,
      ""
    );
    return message;
  }
};

export { validateRegexp, getRegexpError };
