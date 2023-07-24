import styled from "@emotion/styled";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";
import { CustomMeta, CustomStoryObj } from "test_utils/types";
import Icon, { Size, glyphs } from ".";

const { green } = palette;

const Sizes = {
  [Size.Small]: 14,
  [Size.Default]: 16,
  [Size.Large]: 20,
  [Size.XLarge]: 24,
};

export default {
  component: Icon,
} satisfies CustomMeta<typeof Icon>;

export const Default: CustomStoryObj<typeof Icon> = {
  render: (args) => (
    <Container>
      {Object.keys(glyphs).map((name) => (
        <IconContainer key={name}>
          <Icon {...args} glyph={name} />
          <span>{name}</span>
        </IconContainer>
      ))}
    </Container>
  ),

  argTypes: {
    color: { control: "color" },
    size: { control: { options: Sizes, type: "select" } },
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
