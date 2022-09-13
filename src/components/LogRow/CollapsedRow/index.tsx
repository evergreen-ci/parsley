import { forwardRef } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { palette } from "@leafygreen-ui/palette";
import { Overline } from "@leafygreen-ui/typography";
import { ListRowProps } from "react-virtualized";
import Icon from "components/Icon";
import { size } from "constants/tokens";

const { gray } = palette;

interface CollapsedRowProps extends ListRowProps {
  numCollapsed: number;
}

const CollapsedRow = forwardRef<any, CollapsedRowProps>((props, ref) => {
  const { index, numCollapsed, ...rest } = props;

  const lineText =
    numCollapsed !== 1 ? `${numCollapsed} lines skipped` : "1 line skipped";

  return (
    <RowContainer {...rest} ref={ref} data-cy={`collapsed-row-${index}`}>
      <Overline> {lineText} </Overline>
      <StyledButton leftGlyph={<Icon glyph="Expand" />} size="xsmall">
        All
      </StyledButton>
      <StyledButton leftGlyph={<Icon glyph="Expand" />} size="xsmall">
        5 Above and Below
      </StyledButton>
    </RowContainer>
  );
});

CollapsedRow.displayName = "CollapsedRow";

const RowContainer = styled.div`
  display: flex;
  align-items: center;

  padding-left: ${size.l};
  background-color: ${gray.light2};
`;

const StyledButton = styled(Button)`
  margin-left: ${size.xs};
`;

export default CollapsedRow;
