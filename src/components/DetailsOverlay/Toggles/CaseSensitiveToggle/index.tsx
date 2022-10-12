import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const CaseSensitiveToggle: React.FC = () => {
  const { searchState, setCaseSensitive } = useLogContext();
  return (
    <BaseToggle
      data-cy="case-sensitive-toggle"
      label="Case Sensitive"
      onChange={setCaseSensitive}
      value={searchState.caseSensitive}
    />
  );
};

export default CaseSensitiveToggle;
