import React from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { CommandEntry } from "hooks/useSections";
import { RootRowProps } from "../types";

interface SectionRowProps extends RootRowProps {
  metadata: CommandEntry[];
}

const SectionRow: React.FC<SectionRowProps> = ({ metadata }) => {
  const {
    closeAllSectionsButOne,
    setVisibleSectionLines,
    visibleSectionLines,
  } = useLogContext();
  const { functionName } = metadata[0];
  const onClick = () => {
    const nextSet = new Set(visibleSectionLines);
    if (nextSet.has(functionName)) {
      nextSet.delete(metadata[0].functionName);
    } else {
      nextSet.add(functionName);
    }
    setVisibleSectionLines(nextSet);
  };

  const isOpen = visibleSectionLines.has(functionName);
  return (
    <CollapsedLineWrapper data-cy={`${functionName}-section-row`}>
      <StyledBody>{metadata[0].functionName}</StyledBody>
      <ButtonContainer>
        <Button
          leftGlyph={<Icon glyph={isOpen ? "CaretDown" : "CaretRight"} />}
          onClick={onClick}
          size="xsmall"
        >
          {isOpen ? "Close" : "Open"}
        </Button>
        <Button
          onClick={() => closeAllSectionsButOne(functionName)}
          size="xsmall"
        >
          Focus
        </Button>
      </ButtonContainer>
    </CollapsedLineWrapper>
  );
};

SectionRow.displayName = "SectionRow";

const CollapsedLineWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: #f4f5f5; // Custom gray background color.
  padding: 2px 0;
  padding-left: ${size.l};
`;

const StyledBody = styled(Body)<BodyProps>`
  width: 150px;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: ${size.xs};
`;

export default SectionRow;
