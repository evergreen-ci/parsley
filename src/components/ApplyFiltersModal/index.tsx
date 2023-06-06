import { useQuery } from "@apollo/client";
import { css } from "@emotion/react";
import ConfirmationModal from "@leafygreen-ui/confirmation-modal";
import { Body } from "@leafygreen-ui/typography";
import { zIndex } from "constants/tokens";
import {
  DefaultFiltersForProjectQuery,
  DefaultFiltersForProjectQueryVariables,
} from "gql/generated/types";
import { DEFAULT_FILTERS_FOR_PROJECT } from "gql/queries";
import { useCachedTask } from "hooks/useCachedTask";
import { useFilterParam } from "hooks/useFilterParam";
import DefaultFilter from "./DefaultFilter";

interface ApplyFiltersModalProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const ApplyFiltersModal: React.FC<ApplyFiltersModalProps> = ({
  open,
  setOpen,
}) => {
  const [filters] = useFilterParam();

  const task = useCachedTask();
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

  return (
    <ConfirmationModal
      buttonText="Apply filters"
      css={css`
        z-index: ${zIndex.modal};
      `}
      onCancel={() => setOpen(false)}
      onConfirm={() => setOpen(false)}
      open={open}
      setOpen={setOpen}
      title="Default Filters"
    >
      {parsleyFilters?.map((f) => (
        <DefaultFilter key={f.expression} filter={f} urlFilters={filters} />
      )) ?? (
        <Body data-cy="no-filters">
          No filters have been defined for this project.
        </Body>
      )}
    </ConfirmationModal>
  );
};

export default ApplyFiltersModal;
