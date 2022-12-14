import Cookie from "js-cookie";
import { usePreferencesAnalytics } from "analytics";
import { EXPANDABLE_ROWS } from "constants/cookies";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const ExpandableRowsToggle: React.FC = () => {
  const { expandableRows, setExpandableRows } = useLogContext();
  const { sendEvent } = usePreferencesAnalytics();
  return (
    <BaseToggle
      data-cy="expandable-rows-toggle"
      label="Expandable Rows"
      onChange={(value) => {
        Cookie.set(EXPANDABLE_ROWS, value.toString());
        setExpandableRows(value);
        sendEvent({ name: "Toggled Expandable Rows", on: value });
      }}
      value={expandableRows}
    />
  );
};

export default ExpandableRowsToggle;
