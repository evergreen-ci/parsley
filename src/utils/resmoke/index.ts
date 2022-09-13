const processResmokeLine = (line: string) => {
  const port = line.match(portRegex)?.[0];
  const resmokeFunction = line.match(resmokeFunctionRegex)?.[0];
  const json = line.match(jsonRegex)?.[0];

  if (!resmokeFunction || !json) {
    // Its not a resmoke line with json so we can just return it
    return line;
  }
  const timeStamp =
    json.match(timeStampRegex)?.[1] ||
    json.match(timestampWithOffsetRegex)?.[1];

  if (!timeStamp) {
    return line;
  }

  // Timezones can either include a timezone offset or a timezone name

  const shellPrefix = json.match(shellPrefixRegex)?.[1];
  const config = json.match(configSrvRegex)?.[1];
  const id = json.match(idRegex)?.[1];
  const ctx = json.match(ctxRegex)?.[1];
  const msg = json.match(msgRegex)?.[1];
  const attr = json.match(attrRegex)?.[1];

  let result = conditionallyBuildResmokeLine("", resmokeFunction);
  result = conditionallyBuildResmokeLine(result, port);
  result = conditionallyBuildResmokeLine(
    result,
    timeStamp,
    (value) => `| ${value}`
  );
  result = conditionallyBuildResmokeLine(
    result,
    shellPrefix,
    (value) => ` ${value} `
  );
  result = conditionallyBuildResmokeLine(
    result,
    config,
    (value) => ` ${value} `
  );
  result = conditionallyBuildResmokeLine(result, id, (value) => ` ${value}`);
  result = conditionallyBuildResmokeLine(result, ctx, (value) => ` [${value}]`);
  result = conditionallyBuildResmokeLine(result, msg, (value) => ` "${value}"`);
  result = conditionallyBuildResmokeLine(result, attr, (value) => `,${value}`);
  return result;
};

/**
 * `conditionallyBuildResmokeLine` will only add the value to the result if the value is not undefined
 * @param line The line to process
 * @param value The value to null check
 * @param formatting The formatting to apply to the value
 * @returns string The processed line
 */
const conditionallyBuildResmokeLine = (
  line: string,
  value: string | undefined,
  formatting?: (value: string) => string
) => {
  if (value) {
    return `${line}${formatting ? formatting(value) : value}`;
  }
  return line;
};

/** sdbc following by a 5 digit number
 * @example s12345
 * @example d54321
 */
const portRegex = / [sdbc](\d{1,5})/g;

/** The resmoke function
 * @example [js:test]
 * @example [js:setup]
 */
const resmokeFunctionRegex = /\[.*\]/g;

/** The json object
 * @example {"t":{"$date":"2021-03-03T20:54:54.000Z"},"s":"I",  "c":"NETWORK",  "id":22900,  "ctx":"conn1","msg":"client metadata","attr":{"remote":"
 */
const jsonRegex = /\{(.*)\}/g;

/** The timestamp
 * @example "t":{"$date":"2021-03-03T20:54:54.000Z"}
 * @example "t":{"$date":"2021-03-03T20:54:54.000Z"}
 */
const timeStampRegex =
  /\{"t":\{"\$date":"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)"\}/;

/** The timestamp with offset
 * @example "t":{"$date":"2021-03-03T20:54:54.000-0400"}
 * @example "t":{"$date":"2021-03-03T20:54:54.000+0400"}
 */
const timestampWithOffsetRegex =
  /{"t":{"\$date":"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2})"}/;

/** The shell prefix
 * @example "s":"I"
 * @example "s":"W"
 */
const shellPrefixRegex = /"s":"([A-z])"/;

/** The config server
 * @example "c":"NETWORK"
 * @example "c":"STORAGE"
 * @example "c":"COMMAND"
 * @example "c":"REPL"
 */
const configSrvRegex = /"c":"([A-z]*)"/;

/** The id
 * @example "id":22900
 * @example "id":22901
 * @example "id":22902
 */
const idRegex = /"id":([0-9]*)/;

/** The context
 * @example "ctx":"conn1"
 * @example "ctx":"conn2"
 * @example "ctx":"conn3"
 */
const ctxRegex = /"ctx":"([A-z0-9]*)"/;

/** The message
 * @example "msg":"client metadata"
 */
const msgRegex = /msg":"(.*?)"/;

/** The attributes
 * @example "attr":{"remote":"
 */
const attrRegex = /("attr":.*)}/;

export { processResmokeLine };
