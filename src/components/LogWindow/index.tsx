import { useEffect, useMemo } from "react";
import styled from "@emotion/styled";
import FiltersDrawer from "components/FiltersDrawer";
import LogPane from "components/LogPane";
import { RowRenderer, cache } from "components/LogRow/RowRenderer";
import SideBar from "components/SideBar";
import SubHeader from "components/SubHeader";
import { LogTypes } from "constants/enums";
import { FilterLogic, QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { filterLogs } from "utils/filter";

interface LogWindowProps {
  logType: LogTypes;
  isUploadedLog: boolean;
}
const LogWindow: React.FC<LogWindowProps> = ({ logType, isUploadedLog }) => {
  const { logLines, scrollIndex, setScrollIndex, hasLogs, getLine } =
    useLogContext();
  const [wrap] = useQueryParam(QueryParams.Wrap, false);
  const [filters] = useQueryParam<string[]>(QueryParams.Filters, []);
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [filterLogic] = useQueryParam(QueryParams.FilterLogic, FilterLogic.And);

  // On page load, scroll to the share line (if it exists).
  useEffect(() => {
    if (selectedLine) {
      setScrollIndex(selectedLine);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // TODO EVG-17537: more advanced filtering
  const processedLogLines = useMemo(
    () => filterLogs(logLines, filters, bookmarks, selectedLine, filterLogic),
    [logLines, filters, bookmarks, selectedLine, filterLogic]
  );

  return (
    <Container data-cy="log-window">
      {hasLogs && <FiltersDrawer />}
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
            filterLogic={filterLogic}
            filters={filters}
            logLines={processedLogLines}
            rowCount={processedLogLines.length}
            rowRenderer={RowRenderer({
              logType,
              wrap,
              getLine,
              setScrollIndex,
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
  display: flex;
  flex-direction: row;
  height: 100%;
  overflow-y: hidden;
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
