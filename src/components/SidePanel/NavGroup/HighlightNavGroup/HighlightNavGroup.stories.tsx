import { useEffect } from "react";
import { StoryObj } from "@storybook/react";

import { useHighlightParam } from "hooks/useHighlightParam";

import HighlightNavGroup from ".";

export default {
  component: HighlightNavGroup,
};

const Story = ({ ...args }) => {
  const [, setHighlights] = useHighlightParam();
  useEffect(() => {
    setHighlights(["highlight", "highlight2"]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <HighlightNavGroup {...args} />;
};

export const Default: StoryObj<typeof HighlightNavGroup> = {
  render: (args) => <Story {...args} />,
};
