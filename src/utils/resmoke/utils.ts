/** sdbc following by a 5 digit number
 * @example s12345
 * @example d54321
 */
const portRegex = / ([sdbc]\d{1,5})\|/;

/** `getPort` returns the port associated with a resmoke line */
const getPort = (line: string) => {
  const port = line.match(portRegex)?.[1];
  return port;
};

/** The resmoke function
 * @example [js:test]
 * @example [js:setup]
 */
const resmokeFunctionRegex = /\[.*\]/g;

/** `getResmokeFunction` returns the resmoke function that ran a resmoke line */
const getResmokeFunction = (line: string) => {
  const resmokeFunction = line.match(resmokeFunctionRegex)?.[0];
  return resmokeFunction;
};

/** `getJSONString` returns the json object in a resmoke line */
const getJSONString = (line: string) => {
  // const json = line.match(jsonRegex)?.[0];
  // Lets try to find the json string by finding the first { and the last }
  const openBracketIndex = line.indexOf("{");
  const closeBracketIndex = line.lastIndexOf("}");
  // if we can't find the brackets, return undefined
  if (openBracketIndex === -1 || closeBracketIndex === -1) {
    return undefined;
  }
  // if the open bracket is after the close bracket, return undefined
  if (openBracketIndex > closeBracketIndex) {
    return undefined;
  }
  const json = line.slice(openBracketIndex);

  // If we have a mismatching number of brackets, return undefined
  if (json.match(/{/g)?.length !== json.match(/}/g)?.length) {
    return undefined;
  }
  // If the first character is not a {, return undefined
  if (json[0] !== "{") {
    return undefined;
  }
  // If the last character is not a }, return undefined
  if (json[json.length - 1] !== "}") {
    return undefined;
  }

  // This resulting string should hopefully be a json expression as a string.
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

/** `getTimeStamp` returns the timestamp ran by a resmoke function this is found in the resmoke json  */
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
const shellPrefixRegex = /"s":"([A-Z0-9]+)"/;

/** `getShellPrefix` returns the shell prefix ran by a resmoke function this is found in the resmoke json */
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
const configSrvRegex = /"c":"([a-zA-Z-_]+)"/;
/** `getConfigServer` returns the config server associated with a resmoke function this is found in the resmoke json  */
const getConfigServer = (line: string) => {
  const configSrv = line.match(configSrvRegex)?.[1];
  return configSrv;
};

// regex that matches  "c":"NETWORK" or "c":"STORAGE" or "c":"COMMAND" or "c":"REPL" and nothing else

/** The id
 * @example "id":22900
 * @example "id":22901
 * @example "id":22902
 */
const idRegex = /"id":([0-9]*)/;

/** `getId` returns the process id associated with a mongod instance this is found in the resmoke json  */
const getId = (line: string) => {
  const id = line.match(idRegex)?.[1];
  return id;
};

/** The context
 * @example "ctx":"conn1"
 * @example "ctx":"conn2"
 * @example "ctx":"conn3"
 */
const ctxRegex = /"ctx":"([a-zA-Z0-9-]+)"/;

/** `getContext` returns the ctx associated with a resmoke line this is found in the resmoke json */
const getContext = (line: string) => {
  const ctx = line.match(ctxRegex)?.[1];
  return ctx;
};

/** The message
 * @example "msg":"client metadata"
 */
const msgRegex = /msg":"(.*?)"/;

/** `getMessage` returns the message outputted by resmoke for a given line this is found in the resmoke json */
const getMessage = (line: string) => {
  const msg = line.match(msgRegex)?.[1];
  return msg;
};

/** The attributes
 * @example "attr":{"remote":"
 */
const attrRegex = /("attr":.*)}/;

/** `getAttributes` returns the additional json attributes found in a resmoke line json */
const getAttributes = (line: string) => {
  const attr = line.match(attrRegex)?.[1];
  return attr;
};

export {
  getAttributes,
  getContext,
  getConfigServer,
  getId,
  getJSONString,
  getMessage,
  getPort,
  getResmokeFunction,
  getShellPrefix,
  getTimeStamp,
};
