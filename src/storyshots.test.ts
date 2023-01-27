import initStoryshots, {
  snapshotWithOptions,
} from "@storybook/addon-storyshots";
import { render } from "@testing-library/react";

describe("storyshots", () => {
  // eslint-disable-next-line jest/require-hook
  initStoryshots({
    renderer: render,
    test: ({ story, context, renderTree, stories2snapsConverter }) => {
      const snapshotFileName =
        stories2snapsConverter.getSnapshotFileName(context);
      return snapshotWithOptions({})({
        story,
        context,
        renderTree,
        snapshotFileName,
      });
    },
  });
});
