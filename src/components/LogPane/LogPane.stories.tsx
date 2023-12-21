import { useEffect } from "react";
import styled from "@emotion/styled";
import { VirtuosoMockContext } from "react-virtuoso";
import { useLogContext } from "context/LogContext";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import LogPane from ".";

export default {
  component: LogPane,
} satisfies CustomMeta<typeof LogPane>;

const list = Array.from({ length: 10000 }, (_, i) => `${i}`);

const RowRenderer = (index: number) => <pre key={index}>{index}</pre>;

const Container = styled.div`
  height: 500px;
  width: 800px;
  border: 1px solid black;
`;

export const Default: CustomStoryObj<typeof LogPane> = {
  args: {},
  render: (args) => (
    <VirtuosoMockContext.Provider
      value={{ itemHeight: 18, viewportHeight: 500 }}
    >
      <Container>
        <LogPane {...args} rowCount={list.length} rowRenderer={RowRenderer} />
      </Container>
    </VirtuosoMockContext.Provider>
  ),
};

const LogPaneWithZebraStriping = (args: any) => {
  const { preferences } = useLogContext();
  const { setZebraStriping } = preferences;
  useEffect(() => {
    setZebraStriping(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <LogPane {...args} rowCount={list.length} rowRenderer={RowRenderer} />;
};

export const ZebraStriping: CustomStoryObj<typeof LogPane> = {
  args: {},
  render: (args) => (
    <VirtuosoMockContext.Provider
      value={{ itemHeight: 18, viewportHeight: 500 }}
    >
      <Container>
        <LogPaneWithZebraStriping
          {...args}
          rowCount={list.length}
          rowRenderer={RowRenderer}
        />
      </Container>
    </VirtuosoMockContext.Provider>
  ),
};
