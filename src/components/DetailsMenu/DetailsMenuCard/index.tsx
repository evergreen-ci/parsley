import { forwardRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import styled from "@emotion/styled";
import { Tab, Tabs } from "@leafygreen-ui/tabs";
import { H3 } from "@leafygreen-ui/typography";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useToastContext } from "context/toast";
import {
  ParsleySettingsInput,
  ParsleySettingsQuery,
  ParsleySettingsQueryVariables,
  UpdateParsleySettingsMutation,
  UpdateParsleySettingsMutationVariables,
} from "gql/generated/types";
import { UPDATE_PARSLEY_SETTINGS } from "gql/mutations";
import { PARSLEY_SETTINGS } from "gql/queries";
import ButtonRow from "./ButtonRow";
import CLIInstructions from "./CLIInstructions";
import SearchRangeInput from "./SearchRangeInput";
import {
  CaseSensitiveToggle,
  ExpandableRowsToggle,
  FilterLogicToggle,
  PrettyPrintToggle,
  SectionsToggle,
  WrapToggle,
} from "./Toggles";
import WordWrapFormatToggle from "./Toggles/WordWrapFormatToggle";
import ZebraStripingToggle from "./Toggles/ZebraStripingToggle";

interface DetailsMenuProps {
  "data-cy"?: string;
}

const DetailsMenuCard = forwardRef<HTMLDivElement, DetailsMenuProps>(
  ({ "data-cy": dataCy }, ref) => {
    const dispatchToast = useToastContext();
    const { logMetadata } = useLogContext();
    const { logType } = logMetadata || {};

    const [selectedTab, setSelectedTab] = useState(0);

    const { data } = useQuery<
      ParsleySettingsQuery,
      ParsleySettingsQueryVariables
    >(PARSLEY_SETTINGS);
    const { user } = data || {};
    const { parsleySettings } = user || {};
    const { sectionsEnabled = true } = parsleySettings || {};

    const [updateParsleySettings] = useMutation<
      UpdateParsleySettingsMutation,
      UpdateParsleySettingsMutationVariables
    >(UPDATE_PARSLEY_SETTINGS, {
      onError: (err) => {
        dispatchToast.error(
          `Error while updating Parsley settings: '${err.message}'`,
        );
      },
      refetchQueries: ["ParsleySettings"],
    });

    const updateSettings = (newSettings: ParsleySettingsInput) => {
      updateParsleySettings({
        variables: {
          opts: {
            parsleySettings: newSettings,
          },
        },
      });
    };

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
                <SectionsToggle
                  checked={sectionsEnabled}
                  logType={logType}
                  updateSettings={updateSettings}
                />
                <WrapToggle />
                <WordWrapFormatToggle />
                <PrettyPrintToggle logType={logType} />
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
