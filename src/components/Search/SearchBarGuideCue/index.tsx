import { useRef, useState } from "react";
import styled from "@emotion/styled";
import { GuideCue } from "@leafygreen-ui/guide-cue";
import { palette } from "@leafygreen-ui/palette";
import Cookie from "js-cookie";
import { HAS_SEEN_SEARCHBAR_GUIDE_CUE } from "constants/cookies";
import { size, zIndex } from "constants/tokens";

const { green } = palette;

interface SearchBarGuideCueProps {
  containerRef?: HTMLDivElement | null;
}

const SearchBarGuideCue: React.FC<SearchBarGuideCueProps> = ({
  containerRef,
}) => {
  const triggerRef = useRef<HTMLDivElement | null>(null);

  const [openGuideCue, setOpenGuideCue] = useState(
    Cookie.get(HAS_SEEN_SEARCHBAR_GUIDE_CUE) !== "true"
  );

  const onHideCue = () => {
    Cookie.set(HAS_SEEN_SEARCHBAR_GUIDE_CUE, "true", { expires: 365 });
    setOpenGuideCue(false);
  };

  return (
    <GuideCue
      currentStep={1}
      data-cy="searchbar-guide-cue"
      numberOfSteps={1}
      onPrimaryButtonClick={onHideCue}
      open={openGuideCue}
      popoverZIndex={zIndex.popover}
      portalContainer={containerRef}
      refEl={triggerRef}
      setOpen={setOpenGuideCue}
      title="New functionality!"
      tooltipAlign="bottom"
    >
      <GuideCueText>
        <span>
          We&apos;ve removed the search option. The text input will now perform
          search by default.
        </span>
        <span>
          To submit a filter or highlight, you&apos;ll need to press{" "}
          <CommandText>Cmd + Enter</CommandText> or use the plus button.
        </span>
      </GuideCueText>
    </GuideCue>
  );
};

const GuideCueText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${size.s};
`;

const CommandText = styled.span`
  color: ${green.base};
  font-weight: bold;
`;

export default SearchBarGuideCue;
