import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import Tooltip from "@leafygreen-ui/tooltip";
import { usePreferencesAnalytics } from "analytics";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { leaveBreadcrumb } from "utils/errorReporting";
import { copyToClipboard, getJiraFormat } from "utils/string";
import { DetailRow } from "../styles";

const ButtonRow: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { getLine, logMetadata } = useLogContext();

  const [hasCopied, setHasCopied] = useState(false);
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);

  const { htmlLogURL, rawLogURL, jobLogsURL, legacyJobLogsURL, lobsterURL } =
    logMetadata || {};
  const tooltipText = bookmarks.length
    ? "Copy Bookmarked Lines In Jira Format"
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
              onClick={async () => {
                leaveBreadcrumb("copy-jira", { bookmarks }, "user");
                await copyToClipboard(getJiraFormat(bookmarks, getLine));
                setHasCopied(!hasCopied);
                sendEvent({ name: "Clicked Copy To Jira" });
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
          <div data-cy="job-logs-button-wrapper">
            <Button
              data-cy="job-logs-button"
              disabled={!jobLogsURL}
              href={jobLogsURL}
              leftGlyph={<Icon glyph="Export" />}
              onClick={() => sendEvent({ name: "Opened Job Logs" })}
              target="_blank"
            >
              Job logs
            </Button>
          </div>
        }
      >
        View all logs for this job
      </Tooltip>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <div data-cy="raw-logs-button-wrapper">
            <Button
              data-cy="raw-log-button"
              disabled={!rawLogURL}
              href={rawLogURL}
              leftGlyph={<Icon glyph="Export" />}
              onClick={() => sendEvent({ name: "Opened Raw Logs" })}
              target="_blank"
            >
              Raw
            </Button>
          </div>
        }
      >
        Open Raw log in a new tab
      </Tooltip>
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <div data-cy="html-logs-button-wrapper">
            <Button
              data-cy="html-log-button"
              disabled={!htmlLogURL}
              href={htmlLogURL}
              leftGlyph={<Icon glyph="Export" />}
              onClick={() => sendEvent({ name: "Opened HTML Logs" })}
              target="_blank"
            >
              HTML
            </Button>
          </div>
        }
      >
        Open log in standard HTML format in a new tab
      </Tooltip>
      <Menu
        data-cy="secondary-links-button"
        trigger={<Button leftGlyph={<Icon glyph="Ellipsis" />} />}
      >
        <MenuItem
          as="a"
          data-cy="lobster-button"
          disabled={!lobsterURL}
          glyph={<Icon glyph="Export" />}
          href={lobsterURL || ""}
          onClick={() => sendEvent({ name: "Opened Lobster Logs" })}
          target="_blank"
        >
          Lobster
        </MenuItem>
        <MenuItem
          as="a"
          data-cy="legacy-job-logs-button"
          disabled={!legacyJobLogsURL}
          glyph={<Icon glyph="Export" />}
          href={legacyJobLogsURL || ""}
          onClick={() => sendEvent({ name: "Opened Legacy Job Logs" })}
          target="_blank"
        >
          Legacy job logs
        </MenuItem>
      </Menu>
    </DetailRow>
  );
};

export default ButtonRow;
