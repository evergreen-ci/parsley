import { forwardRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Overline } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { BaseRowProps } from "../types";

const { gray } = palette;

const SKIP_NUMBER = 5;

const CollapsedRow = forwardRef<any, BaseRowProps>((props, ref) => {
  const { data, listRowProps } = props;
  const { processedLines, expandLines } = data;
  const { index } = listRowProps;

  const line = processedLines[index] as number[];
  const numCollapsed = line.length;
  const start = line[0];
  const end = line[line.length - 1];

  const lineText =
    numCollapsed !== 1 ? `${numCollapsed} lines skipped` : "1 line skipped";

  const expandFive = () => {
    // If expanding above & below is greater than the number of collapsed lines, then expand all.
    if (2 * SKIP_NUMBER > numCollapsed) {
      expandAll();
    } else {
      expandLines([
        [start, start + (SKIP_NUMBER - 1)],
        [end - (SKIP_NUMBER - 1), end],
      ]);
    }
  };

  const expandAll = () => {
    expandLines([[start, end]]);
  };

  return (
    <CollapsedLineWrapper
      {...listRowProps}
      ref={ref}
      data-cy={`collapsed-row-${start}-${end}`}
    >
      <Overline> {lineText} </Overline>
      <StyledButton
        leftGlyph={<Icon glyph="Expand" />}
        onClick={() => expandAll()}
        size="xsmall"
      >
        All
      </StyledButton>
      <StyledButton
        leftGlyph={<Icon glyph="Expand" />}
        onClick={() => expandFive()}
        size="xsmall"
      >
        {SKIP_NUMBER} Above and Below
      </StyledButton>
    </CollapsedLineWrapper>
  );
});

CollapsedRow.displayName = "CollapsedRow";

const CollapsedLineWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${gray.light2}8C;
  padding-top: ${size.xxs};
  padding-bottom: ${size.xxs};
  padding-left: ${size.l};
`;

const StyledButton = styled(Button)`
  margin-left: ${size.xs};
`;

export default CollapsedRow;
