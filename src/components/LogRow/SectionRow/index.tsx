import React, { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Body, BodyProps } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { CommandEntry } from "hooks/useSections";
import { RootRowProps } from "../types";

interface SectionRowProps extends RootRowProps, React.PropsWithChildren {
  metadata: CommandEntry[];
  lines: number[];
}

const SectionRow: React.FC<SectionRowProps> = ({
  children,
  lines,
  metadata,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <CollapsedLineWrapper
        data-cy={`section-row-${lines[0]}-${lines[lines.length - 1]}`}
      >
        <StyledBody>{metadata[0].functionName}</StyledBody>
        <ButtonContainer>
          <Button
            leftGlyph={<Icon glyph="UpDownCarets" />}
            onClick={() => {
              setIsOpen(!isOpen);
            }}
            size="xsmall"
          >
            Toggle
          </Button>
        </ButtonContainer>
      </CollapsedLineWrapper>
      <span>{children}</span>
    </>
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
