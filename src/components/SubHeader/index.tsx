import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Breadcrumbs from "components/Breadcrumbs";
import Icon from "components/Icon";
import { size, subheaderHeight } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { EvergreenTaskSubHeader } from "./EvergreenTaskSubHeader";
import Button from "@leafygreen-ui/button";

const { gray } = palette;

interface SubHeaderProps {}
const SubHeader: React.FC<SubHeaderProps> = () => {
  const { closeAllSections, expandAllSections, logMetadata } = useLogContext();
  const {
    buildID,
    execution,
    fileName,
    isUploadedLog,
    logType,
    taskID,
    testID,
  } = logMetadata || {};

  return (
    <Container data-cy="log-header">
      {isUploadedLog ? (
        <Header>
          <Icon glyph="File" size="large" />
          <Breadcrumbs
            breadcrumbs={
              fileName
                ? [
                    {
                      text: fileName,
                      trimLength: 50,
                    },
                  ]
                : []
            }
          />
        </Header>
      ) : (
        <Header>
          {taskID && (
            <EvergreenTaskSubHeader
              buildID={buildID as string}
              execution={Number(execution)}
              fileName={fileName}
              logType={logType}
              taskID={taskID}
              testID={testID as string}
            />
          )}
        </Header>
      )}
      <Button onClick={() => closeAllSections()} size="xsmall">
        Close all sections
      </Button>
      <Button onClick={() => expandAllSections()} size="xsmall">
        Expand all sections
      </Button>
    </Container>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${size.s};
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
