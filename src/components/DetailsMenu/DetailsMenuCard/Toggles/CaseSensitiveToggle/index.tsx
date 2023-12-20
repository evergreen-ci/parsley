import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const CaseSensitiveToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { caseSensitive, setCaseSensitive } = preferences;
  return (
    <BaseToggle
      data-cy="case-sensitive-toggle"
      label="Case Sensitive"
      onChange={(value) => {
        setCaseSensitive(value);
        sendEvent({ name: "Toggled Case Sensitivity", on: value });
      }}
      tooltip="Make search terms case sensitive"
      value={caseSensitive}
    />
  );
};

export default CaseSensitiveToggle;
