import styled from "@emotion/styled";
import BookmarksBar from "components/BookmarksBar";
import LogPane from "components/LogPane";
import { RowRenderer, cache } from "components/LogRow/RowRenderer";
import SidePanel from "components/SidePanel";
import SubHeader from "components/SubHeader";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";

interface LogWindowProps {
  logType: LogTypes;
  isUploadedLog: boolean;
}
const LogWindow: React.FC<LogWindowProps> = ({ logType, isUploadedLog }) => {
  const {
    clearExpandedLines,
    collapseLines,
    scrollToLine,
    expandedLines,
    lineCount,
    processedLogLines,
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
        <SubHeader isUploadedLog={isUploadedLog} />
        <LogPaneContainer>
          <LogPane
            cache={cache}
            rowCount={processedLogLines.length}
            rowRenderer={RowRenderer({
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
