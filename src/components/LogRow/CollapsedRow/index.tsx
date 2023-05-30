import { useTransition } from "react";
import styled, { StyledComponent } from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { ExpandedLines } from "types/logs";
import { RootRowProps } from "../types";

const SKIP_NUMBER = 5;

interface CollapsedRowProps extends RootRowProps {
  collapsedLines: number[];
  expandLines: (expandedLines: ExpandedLines) => void;
}

const CollapsedRow: React.FC<CollapsedRowProps> = ({
  collapsedLines,
  expandLines,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const [, startTransition] = useTransition();

  const numCollapsed = collapsedLines.length;
  const start = collapsedLines[0];
  const end = collapsedLines[collapsedLines.length - 1];

  const canExpandFive = SKIP_NUMBER * 2 < numCollapsed;
  const lineText =
    numCollapsed !== 1 ? `${numCollapsed} Lines Skipped` : "1 Line Skipped";

  const expandFive = () => {
    if (canExpandFive) {
      startTransition(() =>
        expandLines([
          [start, start + (SKIP_NUMBER - 1)],
          [end - (SKIP_NUMBER - 1), end],
        ])
      );
    } else {
      startTransition(() => expandLines([[start, end]]));
    }
    sendEvent({
      name: "Expanded Lines",
      lineCount: canExpandFive ? SKIP_NUMBER * 2 : numCollapsed,
      option: "Five",
    });
  };

  const expandAll = () => {
    startTransition(() => expandLines([[start, end]]));
    sendEvent({
      name: "Expanded Lines",
      lineCount: numCollapsed,
      option: "All",
    });
  };

  return (
    <CollapsedLineWrapper data-cy={`collapsed-row-${start}-${end}`}>
      <StyledBody>{lineText}</StyledBody>
      <ButtonContainer>
        <Button
          leftGlyph={<Icon glyph="UpDownCarets" />}
          onClick={expandAll}
          size="xsmall"
        >
          All
        </Button>
        <Button
          leftGlyph={<Icon glyph="UpDownCarets" />}
          onClick={expandFive}
          size="xsmall"
        >
          {SKIP_NUMBER} Above & Below
        </Button>
      </ButtonContainer>
    </CollapsedLineWrapper>
  );
};

CollapsedRow.displayName = "CollapsedRow";

const CollapsedLineWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f4f5f5; // Custom gray background color.
  padding: 2px 0;
  padding-left: ${size.l};
`;

const StyledBody = styled(Body)`
  width: 150px;
` as StyledComponent<BodyProps>;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;

export default CollapsedRow;
