import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Overline } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import Icon from "components/Icon";
import { size } from "constants/tokens";
import { ExpandedLines } from "types/logs";
import BaseNavGroup from "../BaseNavGroup";

interface ExpandedNavGroupProps {
  expandedLines: ExpandedLines;
  collapseLines: (idx: number) => void;
}

const ExpandedNavGroup: React.FC<ExpandedNavGroupProps> = ({
  collapseLines,
  expandedLines,
}) => {
  const { sendEvent } = useLogWindowAnalytics();

  return (
    <BaseNavGroup
      data-cy="expanded-lines"
      defaultMessage="No lines have been expanded."
      glyph="Expand"
      items={expandedLines}
      navGroupTitle="Expanded Lines"
    >
      {expandedLines.map((e, idx) => (
        <ExpandedLine
          key={`expanded-row-${e[0]}-to-${e[1]}`}
          data-cy={`expanded-row-${e[0]}-to-${e[1]}`}
        >
          <IconButton
            aria-label="Delete range"
            onClick={() => {
              sendEvent({ name: "Collapsed Lines" });
              collapseLines(idx);
            }}
          >
            <Icon glyph="X" />
          </IconButton>
          <Overline>
            Row {e[0]} to {e[1]}
          </Overline>
        </ExpandedLine>
      ))}
    </BaseNavGroup>
  );
};

const ExpandedLine = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.xxs};
  margin: ${size.xxs} 0;
`;

export default ExpandedNavGroup;
