import {
  conditionallyBuildResmokeLine,
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
  const port = getPort(line);
  const resmokeFunction = getResmokeFunction(line);
  const json = getJSONString(line);

  if (!resmokeFunction || !json) {
    // Its not a resmoke line with json so we can just return it
    return line;
  }
  const timeStamp = getTimeStamp(json);

  if (!timeStamp) {
    return line;
  }

  // Timezones can either include a timezone offset or a timezone name

  const shellPrefix = getShellPrefix(json);
  const config = getConfigServer(json);
  const id = getId(json);
  const ctx = getContext(json);
  const msg = getMessage(json);
  const attr = getAttributes(json);

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

export { processResmokeLine };
