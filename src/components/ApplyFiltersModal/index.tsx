import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import styled from "@emotion/styled";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import { Body } from "@leafygreen-ui/typography";
import { useLogWindowAnalytics } from "analytics";
import { zIndex } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import {
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables,
} from "gql/generated/types";
import { DEFAULT_FILTERS_FOR_PROJECT } from "gql/queries";
import { useFilterParam } from "hooks/useFilterParam";
import { useTaskQuery } from "hooks/useTaskQuery";
import { Filter } from "types/logs";
import { leaveBreadcrumb } from "utils/errorReporting";
import DefaultFilter from "./DefaultFilter";
import useSelectedFiltersState from "./state";

interface ApplyFiltersModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ApplyFiltersModal: React.FC<ApplyFiltersModalProps> = ({
  open,
  setOpen,
}) => {
  const { sendEvent } = useLogWindowAnalytics();
  const { state, dispatch } = useSelectedFiltersState();
  const [filters, setFilters] = useFilterParam();

  const { logMetadata } = useLogContext();
  const { logType, taskID, execution, buildID } = logMetadata ?? {};

  const { task } = useTaskQuery({ logType, taskID, execution, buildID });
  const { versionMetadata } = task ?? {};
  const { projectIdentifier = "" } = versionMetadata ?? {};

  const { data } = useQuery<
    DefaultFiltersForProjectQuery,
    DefaultFiltersForProjectQueryVariables
  >(DEFAULT_FILTERS_FOR_PROJECT, {
    variables: { projectIdentifier },
    skip: !projectIdentifier,
  });
  const { project } = data || {};
  const { parsleyFilters } = project || {};

  const onConfirm = () => {
    // Apply selected filters.
    const newFilters = filters.concat(state.selectedFilters);
    setFilters(newFilters);

    // Send relevant tracking events.
    leaveBreadcrumb(
      "applied-default-filters",
      { filters: state.selectedFilters },
      "user"
    );
    sendEvent({
      name: "Applied Default Filters",
      filters: state.selectedFilters,
    });
    setOpen(false);
    dispatch({ type: "RESET" });
  };

  const onCancel = () => {
    setOpen(false);
    dispatch({ type: "RESET" });
  };

  return (
    <ConfirmationModal
      buttonText="Apply filters"
      css={css`
        z-index: ${zIndex.modal};
      `}
      data-cy="apply-filters-modal"
      onCancel={onCancel}
      onConfirm={onConfirm}
      open={open}
      setOpen={setOpen}
      submitDisabled={state.selectedFilters.length === 0}
      title="Default Filters"
    >
      <Scrollable>
        {parsleyFilters?.map((f) => (
          <DefaultFilter
            key={f.expression}
            activeFilters={filters}
            addFilter={(filterToAdd: Filter) =>
              dispatch({ type: "ADD_FILTER", filterToAdd })
            }
            filter={f}
            removeFilter={(filterToRemove: string) => {
              dispatch({ type: "REMOVE_FILTER", filterToRemove });
            }}
            selectedFilters={state.selectedFilters}
          />
        )) ?? (
          <Body data-cy="no-filters-message">
            No filters have been defined for this project.
          </Body>
        )}
      </Scrollable>
    </ConfirmationModal>
  );
};

const Scrollable = styled.div`
  max-height: 60vh;
  overflow-y: scroll;
`;

export default ApplyFiltersModal;
