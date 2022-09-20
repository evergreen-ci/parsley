import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import BaseToggle from "../BaseToggle";

const CaseSensitiveToggle: React.FC = () => {
  const [caseSensitive, setCaseSensitive] = useQueryParam(
    QueryParams.CaseSensitive,
    false
  );
  return (
    <BaseToggle
      data-cy="case-sensitive-toggle"
      label="Case Sensitive"
      onChange={setCaseSensitive}
      value={caseSensitive}
    />
  );
};

export default CaseSensitiveToggle;
