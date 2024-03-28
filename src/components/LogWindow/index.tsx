import styled from "@emotion/styled";
import { BasicEmptyState } from "@leafygreen-ui/empty-state";
import BookmarksBar from "components/BookmarksBar";
import LogPane from "components/LogPane";
import { ParsleyRow } from "components/LogRow/RowRenderer";
import SidePanel from "components/SidePanel";
import SubHeader from "components/SubHeader";
import { useLogContext } from "context/LogContext";

const LogWindow: React.FC = () => {
  const {
    clearExpandedLines,
    collapseLines,
    expandedLines,
    hasLogs,
    lineCount,
    processedLogLines,
    scrollToLine,
  } = useLogContext();

  return (
    <Container data-cy="log-window">
      <SidePanel
        clearExpandedLines={clearExpandedLines}
        collapseLines={collapseLines}
        expandedLines={expandedLines}
      />
      <BookmarksBar
        lineCount={lineCount}
        processedLogLines={processedLogLines}
        scrollToLine={scrollToLine}
      />
      <ColumnContainer>
        <SubHeader />
        <LogPaneContainer>
          {hasLogs && processedLogLines.length && (
            <LogPane
              rowCount={processedLogLines.length}
              rowRenderer={ParsleyRow({
                processedLogLines,
              })}
            />
          )}
          {hasLogs === false && (
            <BasicEmptyState
              description="No logs were found for this resource"
              title="No Logs Found"
            />
          )}
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
  // ColumnContainer should take up the remaining page width after SidePanel & BookmarksBar.
  flex: 1 1 auto;
`;

const LogPaneContainer = styled.div`
  display: flex;
  flex-direction: column;
  // LogPaneContainer should take up the remaining page height after SubHeader.
  flex: 1 1 auto;
`;

export default LogWindow;
