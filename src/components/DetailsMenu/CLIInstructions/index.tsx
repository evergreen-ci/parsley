import styled from "@emotion/styled";
import Copyable from "@leafygreen-ui/copyable";
import { LogTypes } from "constants/enums";
import { getResmokeLogURL } from "constants/logURLTemplates";
import { useLogContext } from "context/LogContext";
import { LogMetadata } from "context/LogContext/types";

const CLIInstructions = () => {
  const { logMetadata } = useLogContext();

  const command = getCLICommand(logMetadata || {});
  return command !== "" ? (
    <StyledCopyable label="Fetch the log via CLI">{command}</StyledCopyable>
  ) : null;
};

const getCLICommand = (logMetadata: LogMetadata) => {
  const { buildID, execution, logType, origin, taskID, testID } = logMetadata;
  switch (logType) {
    case LogTypes.EVERGREEN_TASK_LOGS: {
      if (!taskID || !execution || !origin) {
        return "";
      }
      const tags = origin === "all" ? "" : `--tags ${origin}_log`;
      return `evergreen buildlogger fetch --task_id ${taskID} --execution ${execution} ${tags}`;
    }
    case LogTypes.EVERGREEN_TEST_LOGS:
      if (!taskID || !execution || !testID) {
        return "";
      }
      return `evergreen buildlogger fetch --task_id ${taskID} --execution ${execution} --test_name ${testID}`;
    case LogTypes.RESMOKE_LOGS:
      if (!buildID) {
        return "";
      }
      return `curl "${getResmokeLogURL(buildID, { testID, raw: true })}"`;
    default:
      return "";
  }
};

const StyledCopyable = styled(Copyable)`
  width: 100%;
`;

export default CLIInstructions;
