import { useEffect, useMemo } from "react";
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
  isUploadedLog: boolean;
}
const LogWindow: React.FC<LogWindowProps> = ({ logType, isUploadedLog }) => {
  const { logLines, scrollIndex, setScrollIndex, hasLogs, getLine } =
    useLogContext();
  const [wrap] = useQueryParam(QueryParams.Wrap, false);
  const [filters] = useQueryParam<string[]>(QueryParams.Filters, []);
  const [selectedLine] = useQueryParam(QueryParams.SelectedLine, 0);

  // On page load, scroll to the share line or the first line (default).
  useEffect(() => {
    setScrollIndex(selectedLine);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO: EVG-17525
  // Do what ever logic to process the lines here
  const processedLogLines = useMemo(
    () => logLines.map((_, index) => index),
    [logLines]
  );

  return (
    <Container data-cy="log-window">
      {hasLogs && (
        <SideBar
          maxLineNumber={logLines.length - 1}
          processedLogLines={processedLogLines}
          setScrollIndex={setScrollIndex}
        />
      )}
      <ColumnContainer>
        <SubHeader isUploadedLog={isUploadedLog} />
        <LogPaneContainer>
          <LogPane
            cache={cache}
            filters={filters}
            logLines={processedLogLines}
            rowCount={processedLogLines.length}
            rowRenderer={RowRenderer({
              logType,
              wrap,
              getLine,
              processedLines: processedLogLines,
            })}
            scrollToIndex={scrollIndex}
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
