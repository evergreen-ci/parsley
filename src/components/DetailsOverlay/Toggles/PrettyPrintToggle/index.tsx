import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const PrettyPrintToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences, logMetadata } = useLogContext();

  const { prettyPrint, setPrettyPrint } = preferences;
  const { logType } = logMetadata || {};
  const disablePrettyPrint = logType !== LogTypes.RESMOKE_LOGS;

  return (
    <BaseToggle
      data-cy="pretty-print-toggle"
      disabled={disablePrettyPrint}
      label="Pretty Print Bookmarks"
      onChange={(value) => {
        setPrettyPrint(value);
        sendEvent({ name: "Toggled Pretty Print", on: value });
      }}
      value={prettyPrint}
    />
  );
};

export default PrettyPrintToggle;
