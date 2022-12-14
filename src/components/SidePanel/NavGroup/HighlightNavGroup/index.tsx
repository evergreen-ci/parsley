import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Overline } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useHighlightParam } from "hooks/useHighlightParam";
import BaseNavGroup from "../BaseNavGroup";

const HighlightNavGroup: React.FC = () => {
  const { sendEvent } = useLogWindowAnalytics();
  const [highlights, setHighlights] = useHighlightParam();

  const deleteHighlight = (highlightName: string) => {
    const newHighlights = highlights.filter((h) => h !== highlightName);
    setHighlights(newHighlights);
    sendEvent({
      name: "Removed Highlight",
      highlightExpression: highlightName,
    });
  };

  return (
    <BaseNavGroup
      data-cy="highlight"
      defaultMessage="No terms have been highlighted."
      glyph="Minus"
      items={highlights}
      navGroupTitle="Highlighted Terms"
    >
      {highlights.map((highlight) => (
        <HighlightedTerm key={`highlight-${highlight}`}>
          <IconButton
            aria-label="Delete highlight"
            data-cy="delete-highlight-button"
            onClick={() => deleteHighlight(highlight)}
          >
            <Icon glyph="X" />
          </IconButton>
          <Overline>{highlight}</Overline>
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

export default HighlightNavGroup;
