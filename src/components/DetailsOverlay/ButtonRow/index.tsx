import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { leaveBreadcrumb } from "utils/errorReporting";
import { copyToClipboard, getJiraFormat } from "utils/string";
import { DetailRow } from "../styles";

const ButtonRow: React.FC = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const { getLine } = useLogContext();

  const tooltipText = bookmarks.length
    ? "Copy Jira Log Information"
    : "No bookmarks to copy.";

  return (
    <DetailRow>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          // We need to wrap the button in a div because mouse events are not triggered on
          // disabled elements.
          <div data-cy="jira-button-wrapper">
            <Button
              disabled={!bookmarks.length}
              leftGlyph={<Icon glyph="Copy" />}
              onClick={() => {
                leaveBreadcrumb("copy-jira", { bookmarks }, "user");
                copyToClipboard(getJiraFormat(bookmarks, getLine));
                setHasCopied(!hasCopied);
              }}
            >
              JIRA
            </Button>
          </div>
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

export default ButtonRow;
