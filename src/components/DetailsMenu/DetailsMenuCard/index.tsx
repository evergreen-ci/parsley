import { forwardRef, useState } from "react";
import styled from "@emotion/styled";
import { Tab, Tabs } from "@leafygreen-ui/tabs";
import { H3 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import ButtonRow from "./ButtonRow";
import CLIInstructions from "./CLIInstructions";
import SearchRangeInput from "./SearchRangeInput";
import {
  CaseSensitiveToggle,
  ExpandableRowsToggle,
  FilterLogicToggle,
  PrettyPrintToggle,
  WrapToggle,
} from "./Toggles";
import ZebraStripingToggle from "./Toggles/ZebraStripingToggle";

interface DetailsMenuProps {
  "data-cy"?: string;
}

const DetailsMenuCard = forwardRef<HTMLDivElement, DetailsMenuProps>(
  ({ "data-cy": dataCy }, ref) => {
    const [selectedTab, setSelectedTab] = useState(0);
    return (
      <Container ref={ref} data-cy={dataCy}>
        <H3>Parsley Settings</H3>
        <Tabs
          aria-label="Details Card Tabs"
          selected={selectedTab}
          setSelected={setSelectedTab}
        >
          <Tab data-cy="search-and-filter-tab" name="Search & Filter">
            <Row>
              <Column>
                <SearchRangeInput />
                <CaseSensitiveToggle />
                <FilterLogicToggle />
              </Column>
            </Row>
            <ButtonRow />
            <CLIInstructions />
          </Tab>
          <Tab data-cy="log-viewing-tab" name="Log Viewing">
            <Row>
              <Column>
                <WrapToggle />
                <PrettyPrintToggle />
                <ExpandableRowsToggle />
                <ZebraStripingToggle />
              </Column>
            </Row>
          </Tab>
        </Tabs>
      </Container>
    );
  },
);
DetailsMenuCard.displayName = "DetailsMenuCard";

const Container = styled.div`
  padding: ${size.xs};
  display: flex;
  flex-direction: column;
  width: 500px;
`;

const Row = styled.div`
  padding-top: ${size.s};
`;
const Column = styled.div`
  width: 100%;
`;

export default DetailsMenuCard;
