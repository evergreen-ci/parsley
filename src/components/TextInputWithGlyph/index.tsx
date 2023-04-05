import { forwardRef } from "react";
import styled from "@emotion/styled";
import TextInput from "@leafygreen-ui/text-input";
import { size, textInputHeight } from "constants/tokens";

type TextInputWithGlyphProps = {
  icon?: React.ReactElement;
} & React.ComponentProps<typeof TextInput>;

const TextInputWithGlyph: React.FC<TextInputWithGlyphProps> = forwardRef(
  (props, ref) => {
    const { icon, ...rest } = props;

    return (
      <TextInputWrapper>
        <TextInput ref={ref} {...rest} />
        {icon && <IconWrapper>{icon}</IconWrapper>}
      </TextInputWrapper>
    );
  }
);

TextInputWithGlyph.displayName = "TextInputWithGlyph";

const TextInputWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const IconWrapper = styled.div`
  align-items: center;
  display: flex;
  bottom: 0;
  height: ${textInputHeight};
  position: absolute;
  right: ${size.xxs};
  width: ${size.l};
  justify-content: center;
`;

export default TextInputWithGlyph;
