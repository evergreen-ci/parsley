import { useMemo } from "react";
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
    resetRowHeightAtIndex,
    scrollToLine,

    expandedLines,
    highlightedLine,
    lineCount,
    prettyPrint,
    processedLogLines,
    range,
    searchState,
  } = useLogContext();

  const { searchTerm } = searchState;

  const [wrap] = useQueryParam(QueryParams.Wrap, false);
  const [selectedLine] = useQueryParam<number | undefined>(
    QueryParams.SelectedLine,
    undefined
  );
  const [highlights] = useQueryParam<string[]>(QueryParams.Highlights, []);

  const highlightRegex = highlights.length
    ? new RegExp(highlights.join("|"), "i")
    : undefined;

  const initialScrollIndex = useMemo(
    () => findLineIndex(processedLogLines, selectedLine),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  return (
    <Container data-cy="log-window">
      <FiltersDrawer
        clearExpandedLines={clearExpandedLines}
        collapseLines={collapseLines}
        expandedLines={expandedLines}
      />
      <SideBar
        maxLineNumber={lineCount - 1}
        processedLogLines={processedLogLines}
        scrollToLine={scrollToLine}
      />
      <ColumnContainer>
        <SubHeader isUploadedLog={isUploadedLog} />
        <LogPaneContainer>
          <LogPane
            cache={cache}
            initialScrollIndex={initialScrollIndex}
            rowCount={processedLogLines.length}
            rowRenderer={RowRenderer({
              data: {
                expandLines,
                getLine,
                getResmokeLineColor,
                resetRowHeightAtIndex,
                scrollToLine,
                highlightedLine,
                highlights: highlightRegex,
                prettyPrint,
                range,
                searchTerm,
                wrap,
              },
              processedLogLines,
              logType,
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
