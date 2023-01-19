import { run } from "@memlab/api";
import { existsSync, mkdirSync, rmSync } from "fs";
import scenarios from "./scenarios";

const main = async () => {
  const workDir = "./memlab/workdir";
  //   Check if workDir exists and delete it
  if (existsSync(workDir)) {
    console.log(`Deleting existing workDir: ${workDir}`);
    rmSync(workDir, { recursive: true });
  }
  console.log(`Creating workDir: ${workDir}`);
  // make sure the working directory exists
  mkdirSync(workDir);

  console.log(`Running ${scenarios.length} scenarios...`);
  for (let i = 0; i < scenarios.length; i++) {
    const scenario = scenarios[i];
    console.log(`Running scenario "${scenario.name()}"`);
    console.log("--------------------------------------------------");
    console.log("Scenario URL: ", scenario.url());
    // eslint-disable-next-line no-await-in-loop
    await run({ scenario, workDir });
    console.log(`Finished scenario "${scenario.name()}"`);
    console.log("--------------------------------------------------");
  }
};

main();
