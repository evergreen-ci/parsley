import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { fontSize, size, subheaderHeight } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { EvergreenTaskSubHeader } from "./EvergreenTaskSubHeader";

const { gray } = palette;

interface SubHeaderProps {
  isUploadedLog: boolean;
}
const SubHeader: React.FC<SubHeaderProps> = ({ isUploadedLog }) => {
  const { logMetadata } = useLogContext();
  const { execution, fileName, taskID, testID } = logMetadata || {};

  return (
    <Container data-cy="log-header">
      {isUploadedLog ? (
        <Header>
          <Icon glyph="File" size="large" />
          <StyledBody>{fileName}</StyledBody>
        </Header>
      ) : (
        <Header>
          {taskID && execution && (
            <EvergreenTaskSubHeader
              execution={Number(execution)}
              taskID={taskID}
              testID={testID}
            />
          )}
        </Header>
      )}
    </Container>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.s};
`;

const StyledBody = styled(Body)`
  font-size: ${fontSize.m};
`;

const Container = styled.div`
  display: flex;
  align-items: center;
  height: ${subheaderHeight};

  background-color: ${gray.light3};
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.05);
  padding-left: ${size.l};
`;

export default SubHeader;
