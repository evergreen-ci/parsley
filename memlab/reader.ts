import { BrowserInteractionResultReader } from "@memlab/api";

const workDir = "./memlab/workdir";
const result = BrowserInteractionResultReader.from(workDir);

// get absolute paths of all snapshot files
const files = result.getSnapshotFiles();

// print all browser web console output
const metaInfo = result.getRunMetaInfo();
// eslint-disable-next-line no-underscore-dangle
console.log(metaInfo.browserInfo._consoleMessages.join("\n"));
metaInfo.b;

// clean up the results
// result.cleanup();
