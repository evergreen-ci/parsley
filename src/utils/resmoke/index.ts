const processResmokeLine = (line: string) => {
  const port = line.match(portRegex)?.[0];
  const resmokeFunction = line.match(resmokeFunctionRegex)?.[0];
  const json = line.match(jsonRegex)?.[0] || "";
  if (!resmokeFunction || !json) {
    // Its not a resmoke line with json so we can just return it
    return line;
  }

  // Timezones can either include a timezone offset or a timezone name
  const timeStamp =
    json.match(timeStampRegex)?.[1] ||
    json.match(timestampWithOffsetRegex)?.[1];

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

const portRegex = / [sdbc](\d{1,5})/;
const resmokeFunctionRegex = /\[.*\]/gm;
const jsonRegex = /\{(.*)\}/;
const timeStampRegex =
  /\{"t":\{"\$date":"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)"\}/;
const timestampWithOffsetRegex =
  /{"t":{"\$date":"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}\+\d{2}:\d{2})"}/;
const shellPrefixRegex = /"s":"([A-z])"/;
const configSrvRegex = /"c":"([A-z]*)"/;
const idRegex = /"id":([0-9]*)/;
const ctxRegex = /"ctx":"([A-z0-9]*)"/;
const msgRegex = /msg":"(.*?)"/;
const attrRegex = /("attr":.*)}/;

export { processResmokeLine };
