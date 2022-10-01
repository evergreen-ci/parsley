import styled from "@emotion/styled";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import {
  CellMeasurer,
  CellMeasurerCache,
  ListRowRenderer,
} from "react-virtualized";
import { LogContextProvider } from "context/LogContext";
import LogPane from ".";

export default {
  title: "Components/LogPane",
  component: LogPane,
} as ComponentMeta<typeof LogPane>;

const Template: ComponentStory<typeof LogPane> = (args) => (
  <Container>
    <LogPane
      {...args}
      cache={cache}
      filters={[]}
      logLines={list}
      rowCount={list.length}
      rowRenderer={RowRenderer}
      wrap={false}
    />
  </Container>
);

const cache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: 16,
});

const list = Array.from({ length: 10000 }, (_, i) => `${i}`);

const RowRenderer: ListRowRenderer = (props) => {
  const { index, key, parent } = props;
  return (
    <CellMeasurer key={key} cache={cache} parent={parent} rowIndex={index}>
      <pre {...props}>{index}</pre>
    </CellMeasurer>
  );
};

const Container = styled.div`
  height: 500px;
  width: 800px;
  border: 1px solid black;
`;
export const Default = Template.bind({});

Default.decorators = [
  (Story) => (
    <LogContextProvider>
      <Story />
    </LogContextProvider>
  ),
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];
Default.args = {};
