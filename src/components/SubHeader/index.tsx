import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import { useParams } from "react-router-dom";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { LogTypes } from "constants/enums";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import { slugs } from "constants/routes";
import { fontSize, size, subheaderHeight } from "constants/tokens";
import { useLogContext } from "context/LogContext";

const { gray } = palette;

/** TODO: EVG-17534 */
interface SubHeaderProps {
  isUploadedLog: boolean;
  logType: LogTypes;
}
const SubHeader: React.FC<SubHeaderProps> = ({ isUploadedLog, logType }) => {
  const { fileName } = useLogContext();
  const {
    // [slugs.buildID]: buildID,
    // [slugs.origin]: origin,
    // [slugs.testID]: testID,
    [slugs.taskID]: taskID,
    [slugs.execution]: execution,
  } = useParams();
  let url = "";
  if (!isUploadedLog) {
    switch (logType) {
      case LogTypes.RESMOKE_LOGS: {
        break;
      }
      case LogTypes.EVERGREEN_TASK_LOGS:
      case LogTypes.EVERGREEN_TEST_LOGS: {
        if (!taskID || !execution) {
          break;
        }
        url = getEvergreenTaskURL(taskID, execution);
        break;
      }
      default:
        break;
    }
  }
  return (
    <Container>
      {isUploadedLog ? (
        <Header>
          <IconWrapper>
            <Icon glyph="File" size="large" />
          </IconWrapper>
          <StyledBody>{fileName}</StyledBody>
        </Header>
      ) : (
        <Header>
          <IconWrapper>
            <Icon glyph="EvergreenLogo" />
          </IconWrapper>
          <StyledLink href={url}>Task Page</StyledLink>
        </Header>
      )}
    </Container>
  );
};

const Header = styled.div`
  display: flex;
  align-items: center;
`;

const IconWrapper = styled.div`
  padding-right: ${size.s};
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
