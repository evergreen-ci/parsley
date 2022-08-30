import styled from "@emotion/styled";
import LogPane from "components/LogPane";
import { ResmokeRow } from "components/LogRow";
import SideBar from "components/SideBar";
import SubHeader, { SubHeaderHeight } from "components/SubHeader";
import { LogTypes } from "constants/enums";
import { navbarHeight, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";

interface LogWindowProps {
  logType: LogTypes;
}
const LogWindow: React.FC<LogWindowProps> = () => {
  const { logLines, lineCount } = useLogContext();
  return (
    <Container>
      <SideBar />
      <ColumnContainer>
        <SubHeader />
        <LogPaneContainer>
          <LogPane
            logLines={logLines}
            rowCount={lineCount}
            rowHeight={16}
            rowRenderer={ResmokeRow}
          />
        </LogPaneContainer>
      </ColumnContainer>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const LogPaneContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${navbarHeight} - ${SubHeaderHeight});
  width: calc(100vw - ${size.xl});
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export default LogWindow;
