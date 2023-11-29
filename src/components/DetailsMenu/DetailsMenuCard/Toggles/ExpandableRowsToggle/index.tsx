import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const ExpandableRowsToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { expandableRows, setExpandableRows } = preferences;
  return (
    <BaseToggle
      data-cy="expandable-rows-toggle"
      label="Expandable Rows"
      onChange={(value) => {
        setExpandableRows(value);
        sendEvent({ name: "Toggled Expandable Rows", on: value });
      }}
      tooltip="Toggle whether filtered out rows are visible"
      value={expandableRows}
    />
  );
};

export default ExpandableRowsToggle;
