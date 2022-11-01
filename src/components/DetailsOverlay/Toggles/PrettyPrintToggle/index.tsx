import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const PrettyPrintToggle: React.FC = () => {
  const { prettyPrint, togglePrettyPrint, logMetadata } = useLogContext();
  const { logType } = logMetadata || {};
  const { sendEvent } = usePreferencesAnalytics();

  const disablePrettyPrint = logType !== LogTypes.RESMOKE_LOGS;

  return (
    <BaseToggle
      data-cy="pretty-print-toggle"
      disabled={disablePrettyPrint}
      label="Pretty Print Bookmarks"
      onChange={(value) => {
        togglePrettyPrint(value);
        sendEvent({ name: "Toggle Pretty Print", on: value });
      }}
      value={prettyPrint}
    />
  );
};

export default PrettyPrintToggle;
