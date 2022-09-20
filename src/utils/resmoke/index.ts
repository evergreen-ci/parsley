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
} from "./utils";

const processResmokeLine = (line: string) => {
  // First check if it is a resmoke line at all
  const resmokeFunction = getResmokeFunction(line);
  if (!resmokeFunction) {
    return line;
  }
  // Try to get the JSON string in the resmoke line
  // If there is no JSON string, return the line as is
  const json = getJSONString(line);
  if (!json) {
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
