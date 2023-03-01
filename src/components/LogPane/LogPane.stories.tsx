import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";

import LogPane from ".";

export default {
  component: LogPane,
};

const list = Array.from({ length: 10000 }, (_, i) => `${i}`);

const RowRenderer = (index: number) => <pre key={index}>{index}</pre>;

const Container = styled.div`
  height: 500px;
  width: 800px;
  border: 1px solid black;
`;

export const Default: StoryObj<typeof LogPane> = {
  render: (args) => (
    <Container>
      <LogPane {...args} rowCount={list.length} rowRenderer={RowRenderer} />
    </Container>
  ),
  args: {},
};
