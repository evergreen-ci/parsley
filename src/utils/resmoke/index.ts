const processResmokeLine = (line: string) => {
  const port = line.match(portRegex)?.[0];
  const resmokeFunction = line.match(resmokeFunctionRegex)?.[0];
  const json = line.match(jsonRegex)?.[0] || "";

  const timeStamp = json.match(timeStampRegex)?.[1];
  const shellPrefix = json.match(shellPrefixRegex)?.[1];
  const config = json.match(configSrvRegex)?.[1];
  const id = json.match(idRegex)?.[1];
  const ctx = json.match(ctxRegex)?.[1];
  const msg = json.match(msgRegex)?.[1];
  const attr = json.match(attrRegex)?.[1];
  return `${resmokeFunction}${port} ${timeStamp} ${shellPrefix}  ${config}  ${id} [${ctx}] "${msg}",${attr}`;
};

const portRegex = / [sdbc](\d{1,5})\|/;
const resmokeFunctionRegex = /\[.*\]/gm;
const jsonRegex = /\{(.*)\}/;
const timeStampRegex =
  /\{"t":\{"\$date":"(\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z)"\}/;
const shellPrefixRegex = /"s":"([A-z])"/;
const configSrvRegex = /"c":"([A-z]*)"/;
const idRegex = /"id":([0-9]*)/;
const ctxRegex = /"ctx":"([A-z0-9]*)"/;
const msgRegex = /msg":"(.*?)"/;
const attrRegex = /("attr":.*)}/;

export { processResmokeLine };
