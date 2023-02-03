import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { StoryObj } from "@storybook/react";
import { Size, glyphs } from "components/Icon";
import { size } from "constants/tokens";
import IconWithTooltip from ".";

const { green } = palette;

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  component: IconWithTooltip,
};

export const Default: StoryObj<typeof IconWithTooltip> = {
  render: (args) => (
    <Container>
      {Object.keys(glyphs).map((name) => (
        <IconContainer key={name}>
          <IconWithTooltip {...args} glyph={name}>
            Some Text
          </IconWithTooltip>
          <span>{name}</span>
        </IconContainer>
      ))}
    </Container>
  ),

  argTypes: {
    color: { control: "color" },
    size: { control: { type: "select", options: Sizes } },
  },

  args: {
    color: green.dark3,
    size: Sizes[Size.XLarge],
  },
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
