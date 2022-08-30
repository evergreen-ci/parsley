import styled from "@emotion/styled";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { ListRowRenderer } from "react-virtualized";
import LogPane from ".";

export default {
  title: "Components/LogPane",
  component: LogPane,
} as ComponentMeta<typeof LogPane>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof LogPane> = (args) => (
  <Container>
    <LogPane
      {...args}
      itemData={list}
      rowCount={list.length}
      rowHeight={15}
      rowRenderer={RowRenderer}
    />
  </Container>
);

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
