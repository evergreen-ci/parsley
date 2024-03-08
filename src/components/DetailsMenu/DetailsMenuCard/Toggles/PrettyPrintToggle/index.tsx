import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

interface PrettyPrintToggleProps {
  logType: LogTypes | undefined;
}

const PrettyPrintToggle: React.FC<PrettyPrintToggleProps> = ({ logType }) => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { prettyPrint, setPrettyPrint } = preferences;

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
      tooltip="Toggle pretty printing for bookmarked lines. Only available for resmoke logs."
      value={prettyPrint}
    />
  );
};

export default PrettyPrintToggle;
