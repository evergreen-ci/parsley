import initStoryshots from "@storybook/addon-storyshots";
import { render } from "@testing-library/react";

describe("storyshots", () => {
  // eslint-disable-next-line jest/require-hook
  initStoryshots({
    asyncJest: true,
    renderer: render,
    test: ({ context, done, stories2snapsConverter, story }) => {
      const snapshotFileName =
        stories2snapsConverter.getSnapshotFileName(context);
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const component = story.render();
      const { container } = render(component);
      // Mount components asynchronously to allow for initial state to be set
      // Some components have a loading state that is set on mount we should wait for it to finish
      // before taking a snapshot
      const waitTime = 1;
      setTimeout(() => {
        if (snapshotFileName) {
          expect(container).toMatchSpecificSnapshot(snapshotFileName);
        }

        done?.();
      }, waitTime);
    },
  });
});
