import styled from "@emotion/styled";
import LogPane from "components/LogPane";
import { AnsiiRow, ResmokeRow } from "components/LogRow";
import { cache } from "components/LogRow/ResmokeRow";
import SideBar from "components/SideBar";
import SubHeader, { SubHeaderHeight } from "components/SubHeader";
import { LogTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { navbarHeight, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";

interface LogWindowProps {
  logType: LogTypes;
}
const LogWindow: React.FC<LogWindowProps> = ({ logType }) => {
  const { logLines, lineCount } = useLogContext();
  const [wrap] = useQueryParam("wrap", false);
  const [scrollToIndex] = useQueryParam(QueryParams.SelectedLine, 0);
  return (
    <Container>
      <SideBar />
      <ColumnContainer>
        <SubHeader />
        <LogPaneContainer scrollX={!wrap}>
          <LogPane
            cache={cache}
            logLines={logLines}
            rowCount={lineCount}
            rowRenderer={rowRendererMap[logType]}
            scrollToIndex={scrollToIndex}
            wrap={wrap}
          />
        </LogPaneContainer>
      </ColumnContainer>
    </Container>
  );
};

const rowRendererMap = {
  [LogTypes.EVERGREEN_TASK_LOGS]: ResmokeRow,
  [LogTypes.EVERGREEN_TEST_LOGS]: AnsiiRow,
  [LogTypes.RESMOKE_LOGS]: ResmokeRow,
};
const Container = styled.div`
  width: 100vw;
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const LogPaneContainer = styled.div<{ scrollX: boolean }>`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${navbarHeight} - ${SubHeaderHeight});
  width: calc(100vw - ${size.xl});
  ${(props) => props.scrollX && "overflow-x: scroll;"}
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export default LogWindow;
