import styled from "@emotion/styled";
import LogPane from "components/LogPane";
import { AnsiiRow, ResmokeRow } from "components/LogRow";
import { cache as AnsiiRowCache } from "components/LogRow/AnsiiRow";
import { cache as ResmokeRowCache } from "components/LogRow/ResmokeRow";
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
  const logRenderer = rowRendererMap[logType];
  return (
    <Container>
      <SideBar />
      <ColumnContainer>
        <SubHeader />
        <LogPaneContainer scrollX={!wrap}>
          <LogPane
            cache={logRenderer.cache}
            logLines={logLines}
            rowCount={lineCount}
            rowRenderer={logRenderer.renderer}
            scrollToIndex={scrollToIndex}
            wrap={wrap}
          />
        </LogPaneContainer>
      </ColumnContainer>
    </Container>
  );
};

const rowRendererMap = {
  [LogTypes.EVERGREEN_TASK_LOGS]: {
    renderer: AnsiiRow,
    cache: AnsiiRowCache,
  },
  [LogTypes.EVERGREEN_TEST_LOGS]: { renderer: AnsiiRow, cache: AnsiiRowCache },
  [LogTypes.RESMOKE_LOGS]: { renderer: ResmokeRow, cache: ResmokeRowCache },
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
