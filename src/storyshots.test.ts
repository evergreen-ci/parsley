import initStoryshots from "@storybook/addon-storyshots";
import { render } from "@testing-library/react";

describe("storyshots", () => {
  // eslint-disable-next-line jest/require-hook
  initStoryshots({
    renderer: render,
    asyncJest: true,
    test: ({ story, context, stories2snapsConverter, done }) => {
      const snapshotFileName =
        stories2snapsConverter.getSnapshotFileName(context);
      // eslint-disable-next-line testing-library/render-result-naming-convention
      const component = story.render();
      const { container } = render(component);
      // wait until the mount is updated
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
