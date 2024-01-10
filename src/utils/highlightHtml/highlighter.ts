type replaceFunction = (match: string, matchIndex: number) => string;

/**
 * `highlighter` is a function that takes a regular expression, a string, and a function that
 * returns a string with the function applied to the matching elements.
 * @param regexp - the regular expression to match
 * @param text - the text to match the regular expression against
 * @param replaceFunction - the function to apply to the matching elements
 * @returns a string with the matching elements replaced by the function
 */
export const highlighter = (
  regexp: RegExp,
  text: string,
  replaceFunction: replaceFunction,
) =>
  text.replace(regexp, (match, ...groups) => {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i] !== undefined) {
        return replaceFunction(match, i);
      }
    }
    return match;
  });
