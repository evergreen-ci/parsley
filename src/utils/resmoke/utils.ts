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

const getPort = (line: string) => {
  const port = line.match(portRegex)?.[0];
  return port;
};

/** The resmoke function
 * @example [js:test]
 * @example [js:setup]
 */
const resmokeFunctionRegex = /\[.*\]/g;

const getResmokeFunction = (line: string) => {
  const resmokeFunction = line.match(resmokeFunctionRegex)?.[0];
  return resmokeFunction;
};

/** The json object
 * @example {"t":{"$date":"2021-03-03T20:54:54.000Z"},"s":"I",  "c":"NETWORK",  "id":22900,  "ctx":"conn1","msg":"client metadata","attr":{"remote":"
 */
const jsonRegex = /\{(.*)\}/g;

const getJSONString = (line: string) => {
  const json = line.match(jsonRegex)?.[0];
  return json;
};

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

const getTimeStamp = (line: string) => {
  const timeStamp =
    line.match(timeStampRegex)?.[1] ||
    line.match(timestampWithOffsetRegex)?.[1];
  return timeStamp;
};

/** The shell prefix
 * @example "s":"I"
 * @example "s":"W"
 */
const shellPrefixRegex = /"s":"([A-z])"/;

const getShellPrefix = (line: string) => {
  const shellPrefix = line.match(shellPrefixRegex)?.[1];
  return shellPrefix;
};

/** The config server
 * @example "c":"NETWORK"
 * @example "c":"STORAGE"
 * @example "c":"COMMAND"
 * @example "c":"REPL"
 */
const configSrvRegex = /"c":"([A-z]*)"/;

const getConfigSrv = (line: string) => {
  const configSrv = line.match(configSrvRegex)?.[1];
  return configSrv;
};

/** The id
 * @example "id":22900
 * @example "id":22901
 * @example "id":22902
 */
const idRegex = /"id":([0-9]*)/;

const getId = (line: string) => {
  const id = line.match(idRegex)?.[1];
  return id;
};

/** The context
 * @example "ctx":"conn1"
 * @example "ctx":"conn2"
 * @example "ctx":"conn3"
 */
const ctxRegex = /"ctx":"([A-z0-9]*)"/;

const getCtx = (line: string) => {
  const ctx = line.match(ctxRegex)?.[1];
  return ctx;
};

/** The message
 * @example "msg":"client metadata"
 */
const msgRegex = /msg":"(.*?)"/;

const getMsg = (line: string) => {
  const msg = line.match(msgRegex)?.[1];
  return msg;
};

/** The attributes
 * @example "attr":{"remote":"
 */
const attrRegex = /("attr":.*)}/;

const getAttr = (line: string) => {
  const attr = line.match(attrRegex)?.[1];
  return attr;
};

export {
  getAttr,
  getCtx,
  getConfigSrv,
  getId,
  getJSONString,
  getMsg,
  getPort,
  getResmokeFunction,
  getShellPrefix,
  getTimeStamp,
  conditionallyBuildResmokeLine,
};
