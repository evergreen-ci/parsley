import { usePreferencesAnalytics } from "analytics";
import { FilterLogic } from "constants/enums";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import BaseToggle from "../BaseToggle";

const FilterLogicToggle: React.FC = () => {
  const [filterLogic, setFilterLogic] = useQueryParam(
    QueryParams.FilterLogic,
    FilterLogic.And
  );

  const isChecked = filterLogic === FilterLogic.Or;
  const { sendEvent } = usePreferencesAnalytics();

  const onChange = (checked: boolean) => {
    if (checked) {
      setFilterLogic(FilterLogic.Or);
      sendEvent({ name: "Toggle Filter Logic", logic: FilterLogic.Or });
    } else {
      setFilterLogic(FilterLogic.And);
      sendEvent({ name: "Toggle Filter Logic", logic: FilterLogic.And });
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
