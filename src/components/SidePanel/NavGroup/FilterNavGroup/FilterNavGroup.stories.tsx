import { useEffect } from "react";
import { actions } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { CaseSensitivity, MatchType } from "constants/enums";
import { useFilterParam } from "hooks/useFilterParam";
import FilterNavGroup from ".";

export default {
  component: FilterNavGroup,
};

const Story = ({ ...args }) => {
  const [, setFilters] = useFilterParam();
  useEffect(() => {
    setFilters([
      {
        caseSensitive: CaseSensitivity.Insensitive,
        matchType: MatchType.Exact,
        name: "newfilter",
        visible: true,
      },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const clearExpandedLines = () => actions("clearExpandedLines");
  return <FilterNavGroup clearExpandedLines={clearExpandedLines} {...args} />;
};

export const Default: StoryObj<typeof FilterNavGroup> = {
  render: (args) => <Story {...args} />,
};
