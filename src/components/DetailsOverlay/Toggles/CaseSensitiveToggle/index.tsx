import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const CaseSensitiveToggle: React.FC = () => {
  const { searchState, setCaseSensitive } = useLogContext();
  const { sendEvent } = usePreferencesAnalytics();
  return (
    <BaseToggle
      data-cy="case-sensitive-toggle"
      label="Case Sensitive"
      onChange={(value) => {
        setCaseSensitive(value);
        sendEvent({ name: "Toggle Case Sensitivity", on: value });
      }}
      value={searchState.caseSensitive}
    />
  );
};

export default CaseSensitiveToggle;
