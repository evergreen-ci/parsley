import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { copyToClipboard, getJiraFormat } from "utils/string";
import { DetailRow } from "../styles";

const ButtonRow: React.FC = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const { logLines } = useLogContext();

  const tooltipText = bookmarks.length
    ? "Copy Jira Log Information"
    : "No bookmarks to copy.";

  return (
    <DetailRow>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <ButtonWrapper data-cy="jira-button-wrapper">
            <Button
              disabled={!bookmarks.length}
              leftGlyph={<Icon glyph="Copy" />}
              onClick={() => {
                copyToClipboard(getJiraFormat(bookmarks, logLines));
                setHasCopied(!hasCopied);
              }}
            >
              JIRA
            </Button>
          </ButtonWrapper>
        }
        triggerEvent="hover"
      >
        {hasCopied ? "Copied!" : tooltipText}
      </Tooltip>
      <Button leftGlyph={<Icon glyph="Export" />}>RAW</Button>
      <Button leftGlyph={<Icon glyph="Export" />}>HTML</Button>
    </DetailRow>
  );
};

// We need to wrap the button in a dummy div because mouse events are not triggered on
// disabled elements.
const ButtonWrapper = styled.div``;

export default ButtonRow;
