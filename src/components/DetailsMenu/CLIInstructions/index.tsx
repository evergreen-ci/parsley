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
  const { taskID, execution, testID, logType, origin, buildID } = logMetadata;
  if (!taskID || !execution || !testID || !logType || !origin) return "";
  switch (logType) {
    case LogTypes.EVERGREEN_TASK_LOGS:
      return `evergreen buildlogger fetch --task_id ${taskID} --execution ${execution} --tags ${origin}_log`;
    case LogTypes.EVERGREEN_TEST_LOGS:
      return `evergreen buildlogger fetch --task_id ${taskID} --execution ${execution} --test_name ${testID}`;
    case LogTypes.RESMOKE_LOGS:
      return `curl ${getResmokeLogURL(buildID || "", { testID, raw: true })}`;
    default:
      return "";
  }
};

const StyledCopyable = styled(Copyable)`
  width: 100%;
`;

export default CLIInstructions;
