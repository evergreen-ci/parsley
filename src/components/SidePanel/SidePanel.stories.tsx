import { useEffect } from "react";
import styled from "@emotion/styled";
import { actions } from "@storybook/addon-actions";
import { StoryObj } from "@storybook/react";
import { userEvent } from "@storybook/testing-library";
import { CaseSensitivity, MatchType } from "constants/enums";
import { useFilterParam } from "hooks/useFilterParam";
import { useHighlightParam } from "hooks/useHighlightParam";
import SidePanel from ".";

export default {
  component: SidePanel,
};
const Story = ({ ...args }) => {
  const [, setFilters] = useFilterParam();
  const [, setHighlights] = useHighlightParam();

  useEffect(() => {
    setHighlights(["highlight", "highlight2"]);
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
  const collapseLines = () => actions("collapseLines");
  return (
    <Container>
      <SidePanel
        {...args}
        clearExpandedLines={clearExpandedLines}
        collapseLines={collapseLines}
        expandedLines={[[1, 10]]}
      />
    </Container>
  );
};
export const Default: StoryObj<typeof SidePanel> = {
  render: (args) => <Story {...args} />,
  play: () => {
    userEvent.keyboard("[[");
  },
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 600px;
`;
