import { parse, stringify } from "lossless-json";

/**
 * `findJsonObjects` finds the indices of json objects in a given log line.
 * @param logLine - the log line in which to search for json objects
 * @returns an array of [startIndex, endIndex] representing the position of each json object in the string
 */
export const findJsonObjects = (logLine: string) => {
  let firstIndex;
  let lastIndex;
  let numBraces = 0;
  const jsonIndices: number[][] = [];

  for (let i = 0; i < logLine.length; i++) {
    if (logLine[i] === "{") {
      if (numBraces === 0) {
        firstIndex = i;
      }
      numBraces += 1;
    }
    if (logLine[i] === "}") {
      numBraces -= 1;
      if (numBraces === 0) {
        lastIndex = i;
      }
    }
    if (
      numBraces === 0 &&
      firstIndex !== undefined &&
      lastIndex !== undefined
    ) {
      jsonIndices.push([firstIndex, lastIndex]);
      firstIndex = undefined;
      lastIndex = undefined;
    }
  }
  return jsonIndices;
};

/**
 * `parseJson` parses a given JSON string into the desired pretty print format.
 * @param json - string representing a JSON object
 * @returns parsed JSON
 */
export const parseJson = (json: string) => {
  try {
    const parsedJSON = parse(json);
    const stringifiedJSON = stringify(parsedJSON, undefined, 4) ?? "";
    return stringifiedJSON;
  } catch {
    return json;
  }
};

/**
 * `formatPrettyPrint` pretty prints the JSON objects within a log line.
 * @param logLine - string representing a single log line
 * @returns a string where the JSON objects have been converted to the pretty print format
 */
export const formatPrettyPrint = (logLine: string) => {
  const jsonIndices = findJsonObjects(logLine);

  // No JSON to pretty print if no JSON objects are found.
  if (jsonIndices.length === 0) {
    return logLine;
  }

  let currIndex = 0;
  let formatted = "";

  for (let i = 0; i < jsonIndices.length; i++) {
    // Add any text that lies between JSON objects.
    formatted += logLine.substring(currIndex, jsonIndices[i][0]);
    formatted += "\n";

    // Add prettified JSON, and use regex to remove quotes around fields.
    formatted += parseJson(
      logLine.substring(jsonIndices[i][0], jsonIndices[i][1] + 1),
    ).replace(/"([^"]+)"\s*:/g, "$1:");
    formatted += "\n";

    currIndex = jsonIndices[i][1] + 1;
  }
  if (currIndex !== logLine.length) {
    formatted += logLine.substring(currIndex);
  }

  return formatted;
};
