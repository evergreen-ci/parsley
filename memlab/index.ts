import { run } from "@memlab/api";
import { IScenario } from "@memlab/core";
import { existsSync, mkdirSync, rmSync } from "fs";

const scenario: IScenario = {
  name: () => "my-scenario",
  url: () =>
    "http://localhost:4173/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab?bookmarks=0,11079",
  action: async (page) => {
    await page.click("[data-cy=searchbar-input");
    await page.type("[data-cy=searchbar-input", "REPL_HB");
    // wait for the search results to load
    await page.waitForSelector("[data-cy=search-count");
  },
  back: async (page) => {
    // await page.click('[aria-label="Clear search"]');
    await page.click("[data-cy=searchbar-input");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");

    // wait for the search results to not exist
    await page.waitForSelector("[data-cy=search-count", { hidden: true });
  },
};

(async function () {
  const workDir = "./memlab/workdir";
  //   Check if workDir exists and delete it
  if (existsSync(workDir)) {
    rmSync(workDir, { recursive: true });
  }
  // make sure the working directory exists
  mkdirSync(workDir);
  const result = await run({ scenario, workDir });
})();
