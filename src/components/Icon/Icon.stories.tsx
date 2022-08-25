import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { size } from "constants/tokens";
import Icon, { Size, glyphs } from ".";

const { green } = palette;
export default {
  title: "Components/Icon",
  component: Icon,
} as ComponentMeta<typeof Icon>;

// 👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof Icon> = (args) => (
  <Container>
    {Object.keys(glyphs).map((name) => (
      <IconContainer key={name}>
        <Icon {...args} glyph={name} />
        <span>{name}</span>
      </IconContainer>
    ))}
  </Container>
);

export const Default = Template.bind({});

Default.argTypes = {
  color: { control: "color" },
  size: { control: { type: "select", options: Size } },
};
Default.args = {
  color: green.dark3,
  size: Size.XLarge,
};

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const IconContainer = styled.div`
  width: 150px;
  height: 70px;
  flex-shrink: 0;
  text-align: center;
  border: 1px solid #babdbe;
  border-radius: ${size.xxs};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin: 0.5rem;
`;
