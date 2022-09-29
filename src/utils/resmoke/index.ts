import {
  getAttributes,
  getConfigServer,
  getContext,
  getJSONString,
  getMessage,
  getPid,
  getPort,
  getResmokeFunction,
  getShellPrefix,
  getTimeStamp,
} from "./helpers";

const processResmokeLine = (line: string) => {
  let logParts = line.split("|"); // in many cases mongod will insert a pipe between the metadata and json logs
  if (logParts.length !== 2) {
    const startOfJson = line.indexOf("{"); // if not, attempt to find the first occurrence of a json document and attempt to parse as a log
    if (startOfJson > -1) {
      logParts = [line.substring(0, startOfJson), line.substring(startOfJson)];
    } else {
      return line;
    }
  }

  // First check if it is a resmoke line at all
  const resmokeFunction = getResmokeFunction(logParts[0]);
  if (!resmokeFunction) {
    return line;
  }
  // Try to get the JSON string in the resmoke line
  // If there is no JSON string, return the line as is
  const json = getJSONString(logParts[1]);
  if (!json) {
    return line;
  }

  // Sometimes a line may have some json but it isn't a resmoke line so we need to check to see if it has the following resmoke fields
  if (!(getPid(json) && getShellPrefix(json) && getContext(json))) {
    return line;
  }

  const port = getPort(line) ?? "";
  const timeStamp = getTimeStamp(json) ?? "";
  const shellPrefix = getShellPrefix(json)?.padEnd(2, " ") ?? "";
  const configSrv = getConfigServer(json)?.padEnd(8, " ") ?? "";
  const pid = getPid(json)?.padEnd(7, " ") ?? "";
  const ctx = getContext(json) ?? "";
  const msg = getMessage(json) ?? "";
  const attr = getAttributes(json) ?? "";

  const output = `${resmokeFunction} ${port}| ${timeStamp} ${shellPrefix} ${configSrv} ${pid} [${ctx}] "${msg}"${
    attr ? `,${attr}` : ""
  }`;
  return output;
};

export { processResmokeLine };
