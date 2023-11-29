import { useState } from "react";
import Button from "@leafygreen-ui/button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import Tooltip from "@leafygreen-ui/tooltip";
import { usePreferencesAnalytics } from "analytics";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { SentryBreadcrumb, leaveBreadcrumb } from "utils/errorReporting";
import { copyToClipboard, getJiraFormat } from "utils/string";
import { DetailRow } from "../styles";

const ButtonRow: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { getLine, logMetadata } = useLogContext();

  const [hasCopied, setHasCopied] = useState(false);
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);

  const { htmlLogURL, jobLogsURL, legacyJobLogsURL, lobsterURL, rawLogURL } =
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
          <Button
            data-cy="jira-button"
            disabled={!bookmarks.length}
            leftGlyph={<Icon glyph="Copy" />}
            onClick={async () => {
              leaveBreadcrumb(
                "copy-jira",
                { bookmarks },
                SentryBreadcrumb.User
              );
              await copyToClipboard(getJiraFormat(bookmarks, getLine));
              setHasCopied(!hasCopied);
              sendEvent({ name: "Clicked Copy To Jira" });
            }}
          >
            JIRA
          </Button>
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
            onClick={() => sendEvent({ name: "Opened Job Logs" })}
            target="_blank"
          >
            Job logs
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
            onClick={() => sendEvent({ name: "Opened Raw Logs" })}
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
            disabled={!htmlLogURL}
            href={htmlLogURL}
            leftGlyph={<Icon glyph="Export" />}
            onClick={() => sendEvent({ name: "Opened HTML Logs" })}
            target="_blank"
          >
            HTML
          </Button>
        }
      >
        Open log in standard HTML format in a new tab
      </Tooltip>
      <Menu
        trigger={
          <Button
            data-cy="secondary-links-button"
            leftGlyph={<Icon glyph="Ellipsis" />}
          />
        }
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
        {legacyJobLogsURL && (
          <MenuItem
            as="a"
            data-cy="legacy-job-logs-button"
            disabled={!legacyJobLogsURL}
            glyph={<Icon glyph="Export" />}
            href={legacyJobLogsURL}
            onClick={() => sendEvent({ name: "Opened Legacy Job Logs" })}
            target="_blank"
          >
            Legacy job logs
          </MenuItem>
        )}
      </Menu>
    </DetailRow>
  );
};

export default ButtonRow;
