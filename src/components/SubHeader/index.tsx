import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { getEvergreenTaskURL } from "constants/externalURLTemplates";
import { fontSize, size, subheaderHeight } from "constants/tokens";
import { useLogContext } from "context/LogContext";

const { gray } = palette;

interface SubHeaderProps {
  isUploadedLog: boolean;
}
const SubHeader: React.FC<SubHeaderProps> = ({ isUploadedLog }) => {
  const { logMetadata } = useLogContext();
  const { fileName, taskID, execution } = logMetadata || {};
  const taskLink =
    taskID !== undefined && execution !== undefined
      ? getEvergreenTaskURL(taskID, execution)
      : "";

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
          <StyledLink href={taskLink} target="_blank">
            Task Page
          </StyledLink>
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
