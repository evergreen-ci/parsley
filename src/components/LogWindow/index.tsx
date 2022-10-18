import { useState } from "react";
import styled from "@emotion/styled";
import FiltersDrawer from "components/FiltersDrawer";
import LogPane from "components/LogPane";
import { RowRenderer } from "components/LogRow/RowRenderer";
import SideBar from "components/SideBar";
import SubHeader from "components/SubHeader";
import { LogTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";
import { findLineIndex } from "utils/findLineIndex";

interface LogWindowProps {
  logType: LogTypes;
  isUploadedLog: boolean;
}
const LogWindow: React.FC<LogWindowProps> = ({ logType, isUploadedLog }) => {
  const {
    clearExpandedLines,
    collapseLines,
    expandLines,
    getLine,
    getResmokeLineColor,
    scrollToLine,

    expandedLines,
    hasLogs,
    highlightedLine,
    lineCount,
    processedLogLines,
    range,
    searchState,
  } = useLogContext();
  const [wrap] = useQueryParam(QueryParams.Wrap, false);

  const { searchTerm } = searchState;

  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [initialScrollIndex] = useState(
    findLineIndex(processedLogLines, selectedLine)
  );

  return (
    <Container data-cy="log-window">
      {hasLogs && (
        <FiltersDrawer
          clearExpandedLines={clearExpandedLines}
          collapseLines={collapseLines}
          expandedLines={expandedLines}
        />
      )}
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
            initialScrollIndex={initialScrollIndex}
            rowCount={processedLogLines.length}
            rowRenderer={RowRenderer({
              data: {
                expandLines,
                getLine,
                scrollToLine,
                getResmokeLineColor,
                highlightedLine,
                range,
                searchTerm,
                wrap,
              },
              processedLogLines,
              logType,
            })}
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
