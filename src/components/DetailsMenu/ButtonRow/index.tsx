import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import { usePreferencesAnalytics } from "analytics";
import Icon from "components/Icon";
import { useLogContext } from "context/LogContext";
import { leaveBreadcrumb } from "utils/errorReporting";
import { copyToClipboard, getJiraFormat } from "utils/string";
import { DetailRow } from "../styles";

const ButtonRow: React.FC = () => {
  const [hasCopied, setHasCopied] = useState(false);

  const { getLine, bookmarks, logMetadata } = useLogContext();
  const { sendEvent } = usePreferencesAnalytics();
  const { htmlLogURL, rawLogURL, jobLogsURL, lobsterURL } = logMetadata || {};
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
              onClick={() => {
                leaveBreadcrumb("copy-jira", { bookmarks }, "user");
                copyToClipboard(getJiraFormat(bookmarks, getLine));
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
              Job Logs
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
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <div data-cy="lobster-button-wrapper">
            <Button
              data-cy="lobster-button"
              disabled={!lobsterURL}
              href={lobsterURL}
              leftGlyph={<Icon glyph="Export" />}
              onClick={() => sendEvent({ name: "Opened Lobster Logs" })}
              target="_blank"
            >
              Lobster
            </Button>
          </div>
        }
      >
        View the log using the legacy logviewer in a new tab
      </Tooltip>
    </DetailRow>
  );
};

export default ButtonRow;
