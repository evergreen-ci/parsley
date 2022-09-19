import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import BaseToggle from "../BaseToggle";

const WrapToggle: React.FC = () => {
  const [wrap, setWrap] = useQueryParam(QueryParams.Wrap, false);
  return (
    <BaseToggle
      data-cy="wrap-toggle"
      label="Wrap"
      onChange={setWrap}
      value={wrap}
    />
  );
};

export default WrapToggle;
