import { useState } from "react";
import styled from "@emotion/styled";
import LogPane from "components/LogPane";
import { ResmokeRow } from "components/LogRow";
import { cache } from "components/LogRow/ResmokeRow";
import SideBar from "components/SideBar";
import SubHeader, { SubHeaderHeight } from "components/SubHeader";
import { LogTypes } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { navbarHeight, size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useQueryParam } from "hooks/useQueryParam";

console.log(cache);
interface LogWindowProps {
  logType: LogTypes;
}
const LogWindow: React.FC<LogWindowProps> = () => {
  const { logLines, lineCount } = useLogContext();
  const [wrap] = useState(false);
  const [scrollToIndex] = useQueryParam(QueryParams.SelectedLine, 0);
  return (
    <Container>
      <SideBar />
      <ColumnContainer>
        <SubHeader />
        <LogPaneContainer wrap={wrap}>
          <LogPane
            allowHorizontalScroll={!wrap}
            cache={cache}
            logLines={logLines}
            maxWidth={1000}
            rowCount={lineCount}
            rowRenderer={ResmokeRow}
            scrollToIndex={scrollToIndex}
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

const LogPaneContainer = styled.div<{ wrap: boolean }>`
  display: flex;
  flex-direction: column;
  height: calc(100vh - ${navbarHeight} - ${SubHeaderHeight});
  width: calc(100vw - ${size.xl});
  ${(props) => props.wrap && "overflow-x: scroll;"}
`;

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
export default LogWindow;
