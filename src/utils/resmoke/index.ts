import { palette } from "@leafygreen-ui/palette";
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
  getState,
  getTimeStamp,
} from "./helpers";

const { blue, green, purple, red, yellow } = palette;
/**
 * `processResmokeLine` takes a raw log line and transforms it to a readable resmoke line if it is a resmoke line otherwise it returns the original line
 * @param line log line from resmoke
 * @returns processed resmoke line or original line
 */
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

/**
 * `getColorMapping` returns a mapping of colors to resmoke functions
 * @param logLine a log line from resmoke
 * @param portColors a map of ports to colors for already seen ports
 * @returns a color code for the port or undefined if the line is not a resmoke line
 */
const getColorMapping = (
  logLine: string,
  portColors: Record<string, string>
) => {
  if (!logLine) {
    return;
  }
  const portOrState = getPort(logLine) ?? getState(logLine);
  if (portOrState) {
    if (!portColors[portOrState]) {
      return {
        color: colorList[Object.keys(portColors).length % colorList.length],
        portOrState,
      };
    }
    return {
      color: portColors[portOrState],
      portOrState,
    };
  }
  return undefined;
};

/**
 * colorList is an array of colors that are used to color resmoke lines
 */
const colorList = [
  green.dark1,
  blue.dark2,
  red.dark3,
  yellow.dark2,
  green.dark2,
  purple.dark2,
  blue.base,
  green.dark3,
  red.dark2,
  purple.base,
  yellow.dark3,
];

export { processResmokeLine, getColorMapping, colorList };
