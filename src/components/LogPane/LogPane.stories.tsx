import styled from "@emotion/styled";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { CellMeasurerCache, ListRowRenderer } from "react-virtualized";
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
      itemData={list}
      rowCount={list.length}
      rowHeight={15}
      rowRenderer={RowRenderer}
    />
  </Container>
);

const cache = new CellMeasurerCache({
  fixedWidth: true,
  minHeight: 15,
});

const list = Array.from({ length: 10000 }, (_, i) => i);

const RowRenderer: ListRowRenderer = ({ index, key, style }) => (
  <div key={key} style={style}>
    {index}
  </div>
);

const Container = styled.div`
  height: 500px;
  width: 800px;
  border: 1px solid black;
`;
export const Default = Template.bind({});

Default.args = {};
