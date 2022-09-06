import { useMemo } from "react";
import styled from "@emotion/styled";
import LogPane from "components/LogPane";
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
  const { logLines, getLine } = useLogContext();
  const [wrap] = useQueryParam(QueryParams.Wrap, false);
  const [scrollToIndex] = useQueryParam(QueryParams.SelectedLine, 0);

  // TODO: EVG-17525
  // Do what ever logic to process the lines here
  const processedLogLines = useMemo(
    () => logLines.map((_, index) => index),
    [logLines]
  );
  return (
    <Container>
      <SideBar />
      <ColumnContainer>
        <SubHeader />
        <LogPaneContainer>
          <LogPane
            cache={cache}
            logLines={processedLogLines}
            rowCount={processedLogLines.length}
            rowRenderer={RowRenderer({
              logType,
              wrap,
              getLine,
              processedLines: processedLogLines,
            })}
            scrollToIndex={scrollToIndex}
            wrap={wrap}
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
  height: calc(100vh - ${navbarHeight} - ${subheaderHeight});
  width: calc(100vw - ${size.xl});
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export default LogWindow;
