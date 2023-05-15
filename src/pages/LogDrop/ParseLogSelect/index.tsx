import { useState } from "react";
import styled from "@emotion/styled";
import Button from "@leafygreen-ui/button";
import { Option, Select } from "@leafygreen-ui/select";
import { InlineCode, Label } from "@leafygreen-ui/typography";
import Cookie from "js-cookie";
import { LAST_SELECTED_LOG_TYPE } from "constants/cookies";
import { LogTypes } from "constants/enums";
import { size } from "constants/tokens";

interface ParseLogSelectProps {
  fileName: string | undefined;
  onParse: (logType: LogTypes | undefined) => void;
  onCancel: () => void;
}

const ParseLogSelect: React.FC<ParseLogSelectProps> = ({
  fileName,
  onParse,
  onCancel,
}) => {
  const [logType, setLogType] = useState<LogTypes | undefined>(
    (Cookie.get(LAST_SELECTED_LOG_TYPE) as LogTypes) ?? undefined
  );

  return (
    <ProcessLogsContainer>
      <Label htmlFor="parse-log-select">
        How would you like to parse{" "}
        <StyledInlineCode>{fileName}</StyledInlineCode>?
      </Label>
      <Select
        aria-labelledby="parse-log-select"
        data-cy="parse-log-select"
        onChange={(value) => {
          Cookie.set(LAST_SELECTED_LOG_TYPE, value, { expires: 365 });
          setLogType(value as LogTypes);
        }}
        placeholder="Select..."
        value={logType}
      >
        <Option value={LogTypes.RESMOKE_LOGS}>Resmoke</Option>
        <Option value={LogTypes.EVERGREEN_TASK_LOGS}>Raw</Option>
      </Select>
      <ButtonContainer>
        <Button onClick={onCancel}>Cancel</Button>
        <Button
          data-cy="process-log-button"
          disabled={!logType}
          onClick={() => onParse(logType)}
          variant="primary"
        >
          Process Log
        </Button>
      </ButtonContainer>
    </ProcessLogsContainer>
  );
};

const ProcessLogsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: ${size.xs};
  width: 300px;
`;

const ButtonContainer = styled.div`
  display: flex;
  align-self: flex-end;
  gap: ${size.xs};
`;

const StyledInlineCode = styled(InlineCode)`
  overflow-wrap: anywhere;
`;

export default ParseLogSelect;
