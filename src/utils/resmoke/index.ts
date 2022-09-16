import {
  getAttributes,
  getConfigServer,
  getContext,
  getId,
  getJSONString,
  getMessage,
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
  const port = getPort(line);
  if (!json) {
    return line;
  }

  const timeStamp = getTimeStamp(json);
  const shellPrefix = getShellPrefix(json);
  const config = getConfigServer(json);
  const id = getId(json);
  const ctx = getContext(json);
  const msg = getMessage(json);
  const attr = getAttributes(json);

  const output = `${resmokeFunction} ${port ?? ""}| ${timeStamp ?? ""} ${
    shellPrefix ?? ""
  }  ${config ?? ""}  ${id ?? ""} [${ctx ?? ""}] "${msg ?? ""}"${
    attr ? `,${attr}` : ""
  }`;
  return output;
};

export { processResmokeLine };

// regex for
