import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { useLogWindowAnalytics } from "analytics";
import Highlight, { highlightColorList } from "components/Highlight";
import Icon from "components/Icon";
import { fontSize, size } from "constants/tokens";
import { useHighlightParam } from "hooks/useHighlightParam";
import BaseNavGroup from "../BaseNavGroup";

const HighlightNavGroup: React.FC = () => {
  const { sendEvent } = useLogWindowAnalytics();
  const [highlights, setHighlights] = useHighlightParam();

  const deleteHighlight = (highlightName: string) => {
    const newHighlights = highlights.filter((h) => h !== highlightName);
    setHighlights(newHighlights);
    sendEvent({
      highlightExpression: highlightName,
      name: "Removed Highlight",
    });
  };

  return (
    <BaseNavGroup
      data-cy="highlight"
      defaultMessage="No terms have been highlighted."
      glyph="Highlight"
      items={highlights}
      navGroupTitle="Highlighted Terms"
    >
      {highlights.map((highlight, index) => (
        <HighlightedTerm key={`highlight-${highlight}`}>
          <IconButton
            aria-label="Delete highlight"
            data-cy="delete-highlight-button"
            onClick={() => deleteHighlight(highlight)}
          >
            <Icon glyph="X" />
          </IconButton>
          <StyledHighlight
            color={highlightColorList[index % highlightColorList.length]}
            data-cy="side-nav-highlight"
          >
            {highlight}
          </StyledHighlight>
        </HighlightedTerm>
      ))}
    </BaseNavGroup>
  );
};

const HighlightedTerm = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
  margin: ${size.xxs} 0;
`;

const StyledHighlight = styled(Highlight)`
  font-size: ${fontSize.m};
`;

export default HighlightNavGroup;
