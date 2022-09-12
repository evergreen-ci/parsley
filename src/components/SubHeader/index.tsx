import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import Icon from "components/Icon";
import { StyledLink } from "components/styles";
import { size, subheaderHeight } from "constants/tokens";
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
        <span>File name: {fileName}</span>
      ) : (
        <>
          <IconWrapper>
            <Icon glyph="EvergreenLogo" />
          </IconWrapper>
          <StyledLink href="/test">Task Page</StyledLink>
        </>
      )}
    </Container>
  );
};

const IconWrapper = styled.div`
  padding-right: ${size.l};
`;

const Container = styled.div`
  background-color: ${gray.light3};
  width: calc(100vw - ${size.xl});
  box-shadow: 0 ${size.xxs} ${size.xxs} rgba(0, 0, 0, 0.05);
  height: ${subheaderHeight};
  display: flex;
  align-items: center;
  padding-left: ${size.l};
`;

export default SubHeader;
