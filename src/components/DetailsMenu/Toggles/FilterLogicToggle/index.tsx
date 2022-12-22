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
      sendEvent({ name: "Toggled Filter Logic", logic: FilterLogic.Or });
    } else {
      setFilterLogic(FilterLogic.And);
      sendEvent({ name: "Toggled Filter Logic", logic: FilterLogic.And });
    }
  };
  return (
    <BaseToggle
      data-cy="filter-logic-toggle"
      label="Filter Logic"
      leftLabel="AND"
      onChange={onChange}
      rightLabel="OR"
      value={isChecked}
    />
  );
};

export default FilterLogicToggle;
