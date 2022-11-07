import { usePreferencesAnalytics } from "analytics";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import BaseToggle from "../BaseToggle";

const ExpandableRowsToggle: React.FC = () => {
  const [expandableRows, setExpandableRows] = useQueryParam(
    QueryParams.Expandable,
    true
  );
  const { sendEvent } = usePreferencesAnalytics();
  return (
    <BaseToggle
      data-cy="expandable-rows-toggle"
      label="Expandable Rows"
      onChange={(value) => {
        setExpandableRows(value);
        sendEvent({ name: "Toggled Expandable Rows", on: value });
      }}
      value={expandableRows}
    />
  );
};

export default ExpandableRowsToggle;
