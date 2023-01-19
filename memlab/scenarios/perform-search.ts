import { IScenario } from "@memlab/core";
import { routes, selectors } from "../constants";

const scenario: IScenario = {
  name: () => "Perform Search",
  url: () => routes.resmokeLogURL,
  action: async (page) => {
    await page.click(selectors.searchBar);
    await page.type(selectors.searchBar, "REPL_HB");
    // wait for the search results to load
    await page.waitForSelector(selectors.searchCount);
  },
  back: async (page) => {
    // await page.click('[aria-label="Clear search"]');
    await page.click(selectors.searchBar);
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");
    await page.keyboard.press("Backspace");

    // wait for the search results to not exist
    await page.waitForSelector(selectors.searchCount, { hidden: true });
  },
};

export default scenario;
