import { forwardRef, useTransition } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Overline } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { OverlineType } from "types/leafygreen";
import { BaseRowProps } from "../types";

const { gray } = palette;

const SKIP_NUMBER = 5;

interface CollapsedRowProps extends BaseRowProps {
  collapsedLines: number[];
}

const CollapsedRow = forwardRef<any, CollapsedRowProps>((props, ref) => {
  const { sendEvent } = useLogWindowAnalytics();
  const [, startTransition] = useTransition();

  const { collapsedLines, data, listRowProps } = props;
  const { expandLines } = data;

  const numCollapsed = collapsedLines.length;
  const start = collapsedLines[0];
  const end = collapsedLines[collapsedLines.length - 1];

  const canExpandFive = SKIP_NUMBER * 2 < numCollapsed;
  const lineText =
    numCollapsed !== 1 ? `${numCollapsed} lines skipped` : "1 line skipped";

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
    <CollapsedLineWrapper
      {...listRowProps}
      ref={ref}
      data-cy={`collapsed-row-${start}-${end}`}
    >
      <StyledOverline>{lineText}</StyledOverline>
      <StyledButton
        leftGlyph={<Icon glyph="Expand" />}
        onClick={expandAll}
        size="xsmall"
      >
        All
      </StyledButton>
      <StyledButton
        leftGlyph={<Icon glyph="Expand" />}
        onClick={expandFive}
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
  padding-left: ${size.l};
`;

const StyledOverline = styled<OverlineType>(Overline)`
  width: 150px;
`;

const StyledButton = styled(Button)`
  margin-left: ${size.xs};
  max-height: ${size.s};
  border-radius: ${size.xxs};
  font-size: 12px;
`;

export default CollapsedRow;
