import { useState } from "react";
import styled from "@emotion/styled";
import FiltersDrawer from "components/FiltersDrawer";
import LogPane from "components/LogPane";
import { RowRenderer, cache } from "components/LogRow/RowRenderer";
import SideBar from "components/SideBar";
import SubHeader from "components/SubHeader";
import { FilterLogic, LogTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useFilterParam, useQueryParam } from "hooks/useQueryParam";
import { findLineIndex } from "utils/findLineIndex";

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
  const [filterLogic] = useQueryParam(QueryParams.FilterLogic, FilterLogic.And);
  const [filters] = useFilterParam();
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );

  const { searchTerm } = searchState;

  const [initialScrollIndex] = useState(
    findLineIndex(processedLogLines, selectedLine)
  );

  return (
    <Container data-cy="log-window">
      {hasLogs && <FiltersDrawer />}
      {hasLogs && (
        <SideBar
          maxLineNumber={lineCount - 1}
          processedLogLines={processedLogLines}
          scrollToLine={scrollToLine}
        />
      )}
      <ColumnContainer>
        <SubHeader isUploadedLog={isUploadedLog} />
        <LogPaneContainer>
          <LogPane
            cache={cache}
            filterLogic={filterLogic}
            filters={filters}
            initialScrollIndex={initialScrollIndex}
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
