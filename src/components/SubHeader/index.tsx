import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { Body } from "@leafygreen-ui/typography";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { fontSize, size, subheaderHeight, zIndex } from "constants/tokens";
import { useLogContext } from "context/LogContext";

const { gray } = palette;

/** TODO: EVG-17534 */
interface SubHeaderProps {
  isUploadedLog: boolean;
}
const SubHeader: React.FC<SubHeaderProps> = ({ isUploadedLog }) => {
  const { fileName } = useLogContext();

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
          <StyledLink href="/test">Task Page</StyledLink>
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
  z-index: ${zIndex.backdrop};
`;

export default SubHeader;
