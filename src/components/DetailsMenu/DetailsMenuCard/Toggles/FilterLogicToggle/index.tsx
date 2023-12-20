import { usePreferencesAnalytics } from "analytics";
import { FilterLogic } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const FilterLogicToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { filterLogic, setFilterLogic } = preferences;
  const isChecked = filterLogic === FilterLogic.Or;

  const onChange = (checked: boolean) => {
    if (checked) {
      setFilterLogic(FilterLogic.Or);
      sendEvent({ logic: FilterLogic.Or, name: "Toggled Filter Logic" });
    } else {
      setFilterLogic(FilterLogic.And);
      sendEvent({ logic: FilterLogic.And, name: "Toggled Filter Logic" });
    }
  };
  return (
    <BaseToggle
      data-cy="filter-logic-toggle"
      label="Filter Logic"
      leftLabel="AND"
      onChange={onChange}
      rightLabel="OR"
      tooltip="Toggle between AND and OR logic for filtering"
      value={isChecked}
    />
  );
};

export default FilterLogicToggle;
