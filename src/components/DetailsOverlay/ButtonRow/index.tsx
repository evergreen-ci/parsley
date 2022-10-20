import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { LogMetadata } from "context/LogContext/types";
import { useQueryParam } from "hooks/useQueryParam";
import { copyToClipboard, getJiraFormat } from "utils/string";
import { DetailRow } from "../styles";

interface ButtonRowProps {
  logMetadata?: LogMetadata;
}
const ButtonRow: React.FC<ButtonRowProps> = ({ logMetadata }) => {
  const [hasCopied, setHasCopied] = useState(false);

  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const { getLine } = useLogContext();

  const { htmlLogURL, rawLogURL, jobLogsURL } = logMetadata || {};
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

      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            data-cy="job-logs-button"
            disabled={!jobLogsURL}
            href={jobLogsURL}
            leftGlyph={<Icon glyph="Export" />}
            target="_blank"
          >
            Job Logs
          </Button>
        }
      >
        View all logs for this job
      </Tooltip>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            data-cy="raw-log-button"
            disabled={!rawLogURL}
            href={rawLogURL}
            leftGlyph={<Icon glyph="Export" />}
            target="_blank"
          >
            Raw
          </Button>
        }
      >
        Open Raw log in a new tab
      </Tooltip>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            data-cy="html-log-button"
            href={htmlLogURL}
            leftGlyph={<Icon glyph="Export" />}
            target="_blank"
          >
            HTML
          </Button>
        }
      >
        Open log in standard HTML format in a new tab
      </Tooltip>
    </DetailRow>
  );
};

export default ButtonRow;
