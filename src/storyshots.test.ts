import initStoryshots, {
  snapshotWithOptions,
} from "@storybook/addon-storyshots";

describe("storyshots", () => {
  // eslint-disable-next-line jest/require-hook
  initStoryshots({
    test: ({ story, context, renderTree, stories2snapsConverter }) => {
      const snapshotFileName =
        stories2snapsConverter.getSnapshotFileName(context);
      return snapshotWithOptions({})({
        story,
        context,
        renderTree,
        snapshotFileName: snapshotFileName.replace("src", "."),
      });
    },
  });
});
