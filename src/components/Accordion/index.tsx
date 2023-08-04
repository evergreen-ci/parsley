import { useEffect, useRef, useState } from "react";
import styled from "@emotion/styled";
import Icon from "@leafygreen-ui/icon";
import { palette } from "@leafygreen-ui/palette";
import { size } from "constants/tokens";

const { gray } = palette;

interface AccordionProps {
  "data-cy"?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
  className?: string;
  onToggle?: (s: { isVisible: boolean }) => void;
  subtitle?: React.ReactNode;
  title: React.ReactNode;
  titleTag?: React.FC;
  toggledTitle?: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({
  children,
  className,
  "data-cy": dataCy,
  defaultOpen = false,
  onToggle = () => {},
  subtitle,
  title,
  titleTag,
  toggledTitle,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(defaultOpen);

  const TitleTag = titleTag ?? "span";
  const titleToShow = toggledTitle && accordionOpen ? toggledTitle : title;
  const titleComp = <TitleTag>{titleToShow}</TitleTag>;

  const childrenRef = useRef<HTMLDivElement>(null);
  const [childrenHeight, setChildrenHeight] = useState(0);

  useEffect(() => {
    if (childrenRef && childrenRef.current) {
      setChildrenHeight(childrenRef.current.offsetHeight);
    }
  }, [children, childrenRef]);

  const toggleAccordionHandler = () => {
    onToggle({ isVisible: !accordionOpen });
    setAccordionOpen(!accordionOpen);
  };

  return (
    <div className={className} data-cy={dataCy}>
      <AccordionToggle
        data-cy="accordion-toggle"
        onClick={toggleAccordionHandler}
        role="button"
      >
        <AccordionIcon
          fill={gray.dark1}
          glyph="ChevronRight"
          open={accordionOpen}
          size="small"
        />
        {titleComp}
      </AccordionToggle>
      {subtitle && <SubtitleContainer>{subtitle}</SubtitleContainer>}
      <AnimatedAccordion
        aria-expanded={accordionOpen}
        data-cy="accordion-collapse-container"
        height={childrenHeight}
        hide={!accordionOpen}
      >
        <ContentsContainer ref={childrenRef}>{children}</ContentsContainer>
      </AnimatedAccordion>
    </div>
  );
};

const AccordionToggle = styled.div`
  display: flex;
  align-items: center;
  gap: 2px;
  :hover {
    cursor: pointer;
  }
`;

const AccordionIcon = styled(Icon)<{ open: boolean }>`
  flex-shrink: 0;
  transform: ${({ open }): string => (open ? "rotate(90deg)" : "unset")};
  transition-property: transform;
  transition-duration: 150ms;
`;

const AnimatedAccordion = styled.div<{
  hide: boolean;
  height: number;
}>`
  /* This is used to calculate a fixed height for the Accordion since height
      transitions require a fixed height for their end height */
  max-height: ${({ height, hide }): string =>
    hide ? "0px" : `${height || 9999}px`};
  transition: max-height 200ms ease-in-out;
  overflow: hidden;
`;

const ContentsContainer = styled.div`
  margin-left: ${size.s};
`;

const SubtitleContainer = styled.div`
  margin-left: ${size.s};
`;

export default Accordion;
