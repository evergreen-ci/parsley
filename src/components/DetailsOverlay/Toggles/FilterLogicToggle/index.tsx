import Cookie from "js-cookie";
import { usePreferencesAnalytics } from "analytics";
import { FILTER_LOGIC } from "constants/cookies";
import { FilterLogic } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const FilterLogicToggle: React.FC = () => {
  const { filterLogic, setFilterLogic } = useLogContext();

  const isChecked = filterLogic === FilterLogic.Or;
  const { sendEvent } = usePreferencesAnalytics();

  const onChange = (checked: boolean) => {
    if (checked) {
      Cookie.set(FILTER_LOGIC, FilterLogic.Or, { expires: 365 });
      setFilterLogic(FilterLogic.Or);
      sendEvent({ name: "Toggled Filter Logic", logic: FilterLogic.Or });
    } else {
      Cookie.set(FILTER_LOGIC, FilterLogic.And, { expires: 365 });
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
