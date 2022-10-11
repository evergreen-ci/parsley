import styled from "@emotion/styled";
import FiltersDrawer from "components/FiltersDrawer";
import LogPane from "components/LogPane";
import { RowRenderer, cache } from "components/LogRow/RowRenderer";
import SideBar from "components/SideBar";
import SubHeader from "components/SubHeader";
import { LogTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";

interface LogWindowProps {
  logType: LogTypes;
  isUploadedLog: boolean;
}
const LogWindow: React.FC<LogWindowProps> = ({ logType, isUploadedLog }) => {
  const {
    getLine,
    hasLogs,
    highlightedLine,
    lineCount,
    processedLogLines,
    range,
    scrollToLine,
    searchState,
  } = useLogContext();
  const [wrap] = useQueryParam(QueryParams.Wrap, false);
  const [filters] = useQueryParam<string[]>(QueryParams.Filters, []);

  const { searchTerm } = searchState;

  return (
    <Container data-cy="log-window">
      {hasLogs && <FiltersDrawer />}
      {hasLogs && <SideBar maxLineNumber={lineCount - 1} />}
      <ColumnContainer>
        <SubHeader isUploadedLog={isUploadedLog} logType={logType} />
        <LogPaneContainer>
          <LogPane
            cache={cache}
            filters={filters}
            rowCount={processedLogLines.length}
            rowRenderer={RowRenderer({
              getLine,
              highlightedLine,
              logType,
              processedLines: processedLogLines,
              range,
              scrollToLine,
              searchTerm,
              wrap,
            })}
            wrap={wrap}
          />
        </LogPaneContainer>
      </ColumnContainer>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
  // ColumnContainer should take up the remaining page width after FiltersDrawer & SideBar.
  flex: 1 1 auto;
`;

const LogPaneContainer = styled.div`
  display: flex;
  flex-direction: column;
  // LogPaneContainer should take up the remaining page height after SubHeader.
  flex: 1 1 auto;
`;

export default LogWindow;
