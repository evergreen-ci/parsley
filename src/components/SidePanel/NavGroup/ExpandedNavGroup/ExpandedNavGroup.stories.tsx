import { useState } from "react";
import { StoryObj } from "@storybook/react";
import { ExpandedLines } from "types/logs";
import ExpandedNavGroup from ".";

export default {
  component: ExpandedNavGroup,
};

const Story = ({ ...args }) => {
  const [expandedLines, setExpandedLines] = useState<ExpandedLines>([
    [0, 10],
    [20, 30],
  ]);
  return (
    <ExpandedNavGroup
      {...args}
      collapseLines={(index) => {
        // delete the expanded lines at index
        const removedLines = [...expandedLines];
        removedLines.splice(index, 1);
        setExpandedLines(removedLines);
      }}
      expandedLines={expandedLines}
    />
  );
};

export const Default: StoryObj<typeof ExpandedNavGroup> = {
  render: (args) => <Story {...args} />,
};
