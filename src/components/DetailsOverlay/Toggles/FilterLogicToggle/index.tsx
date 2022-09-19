import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import BaseToggle from "../BaseToggle";

const FilterLogicToggle: React.FC = () => {
  const [filterLogic, setFilterLogic] = useQueryParam(
    QueryParams.FilterLogic,
    "and"
  );
  const isActive = filterLogic !== "and";

  const onChange = (checked: boolean) => {
    if (checked) {
      setFilterLogic("or");
    } else {
      setFilterLogic("and");
    }
  };
  return (
    <BaseToggle
      data-cy="filter-logic-toggle"
      label="Filter Logic"
      leftLabel="AND"
      onChange={onChange}
      rightLabel="OR"
      value={isActive}
    />
  );
};

export default FilterLogicToggle;
