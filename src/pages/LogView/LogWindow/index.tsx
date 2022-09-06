import styled from "@emotion/styled";
import LogPane from "components/LogPane";
import { AnsiiRow, ResmokeRow } from "components/LogRow";
import { RowRenderer, cache } from "components/LogRow/RowRenderer";
import SideBar from "components/SideBar";
import SubHeader from "components/SubHeader";
import { LogTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { navbarHeight, size, subheaderHeight } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";

interface LogWindowProps {
  logType: LogTypes;
}
const LogWindow: React.FC<LogWindowProps> = ({ logType }) => {
  const { logLines, lineCount, getLine } = useLogContext();
  const [wrap] = useQueryParam("wrap", false);
  const [scrollToIndex] = useQueryParam(QueryParams.SelectedLine, 0);
  const logRenderer = rowRendererMap[logType];

  // TODO: EVG-17525
  // Do what ever logic to process the lines here
  const processedLogLines = logLines.map((_, index) => index);
  return (
    <Container>
      <SideBar />
      <ColumnContainer>
        <SubHeader />
        <LogPaneContainer>
          <LogPane
            cache={cache}
            logLines={processedLogLines}
            rowCount={lineCount}
            rowRenderer={RowRenderer({ Row: logRenderer, wrap, getLine })}
            scrollToIndex={scrollToIndex}
            wrap={wrap}
          />
        </LogPaneContainer>
      </ColumnContainer>
    </Container>
  );
};

const rowRendererMap = {
  [LogTypes.EVERGREEN_TASK_LOGS]: AnsiiRow,
  [LogTypes.EVERGREEN_TEST_LOGS]: AnsiiRow,
  [LogTypes.RESMOKE_LOGS]: ResmokeRow,
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
  height: calc(100vh - ${navbarHeight} - ${subheaderHeight});
  width: calc(100vw - ${size.xl});
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export default LogWindow;
