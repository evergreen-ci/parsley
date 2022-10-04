import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { constructJiraString, copyToClipboard } from "utils/string";
import { DetailRow } from "../styles";

const ButtonRow: React.FC = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const { logLines } = useLogContext();
  const jiraString = constructJiraString(bookmarks, logLines);

  return (
    <DetailRow>
      <StyledTooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            leftGlyph={<Icon glyph="Copy" />}
            onClick={() => {
              copyToClipboard(jiraString);
              setHasCopied(!hasCopied);
            }}
          >
            JIRA
          </Button>
        }
        triggerEvent="hover"
      >
        {hasCopied ? "Copied!" : "Copy Jira Log Information"}
      </StyledTooltip>
      <Button leftGlyph={<Icon glyph="Export" />}>RAW</Button>
      <Button leftGlyph={<Icon glyph="Export" />}>HTML</Button>
    </DetailRow>
  );
};

// @ts-expect-error
const StyledTooltip = styled(Tooltip)`
  max-width: 120px;
`;

export default ButtonRow;
