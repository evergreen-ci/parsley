import { useState } from "react";
import Button from "@leafygreen-ui/button";
import Tooltip from "@leafygreen-ui/tooltip";
import Icon from "components/Icon";
import { LogTypes } from "constants/enums";
import { getSpruceJobLogsURL } from "constants/externalURLTemplates";
import {
  getEvergreenTaskLogURL,
  getEvergreenTestLogURL,
  getResmokeLogURL,
} from "constants/logURLTemplates";
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

  const { logType, taskID, execution, buildID, testID, origin } =
    logMetadata || {};
  let jobLogsURL = "";
  let rawLogURL = "";
  let htmlLogURL = "";
  switch (logType) {
    case LogTypes.RESMOKE_LOGS: {
      if (buildID && testID) {
        rawLogURL = getResmokeLogURL(buildID, { testID, raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { testID, html: true });
      } else if (buildID) {
        rawLogURL = getResmokeLogURL(buildID, { raw: true });
        htmlLogURL = getResmokeLogURL(buildID, { html: true });
      }
      break;
    }
    case LogTypes.EVERGREEN_TASK_LOGS:
      if (!taskID || !execution || !origin) {
        break;
      }
      jobLogsURL = getSpruceJobLogsURL(taskID, execution);

      rawLogURL = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        text: true,
      });
      htmlLogURL = getEvergreenTaskLogURL(taskID, execution, origin as any, {
        text: false,
      });
      break;
    case LogTypes.EVERGREEN_TEST_LOGS: {
      if (!taskID || !execution || !testID) {
        break;
      }
      jobLogsURL = getSpruceJobLogsURL(taskID, execution);
      rawLogURL = getEvergreenTestLogURL(taskID, execution, testID, {
        text: true,
      });
      htmlLogURL = getEvergreenTestLogURL(taskID, execution, testID, {
        text: false,
      });
      break;
    }
    default:
      break;
  }
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
      {jobLogsURL && (
        <Tooltip
          align="top"
          justify="middle"
          trigger={
            <Button
              as="a"
              href={jobLogsURL}
              leftGlyph={<Icon glyph="Export" />}
              target="_blank"
            >
              JOB LOGS
            </Button>
          }
        >
          View all logs for this job
        </Tooltip>
      )}
      <Tooltip
        align="top"
        justify="middle"
        trigger={
          <Button
            as="a"
            disabled={!rawLogURL}
            href={rawLogURL}
            leftGlyph={<Icon glyph="Export" />}
            target="_blank"
          >
            RAW
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
            as="a"
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
