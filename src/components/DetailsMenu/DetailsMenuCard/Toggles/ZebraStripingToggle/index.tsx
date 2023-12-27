import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const ZebraStripingToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { setZebraStriping, zebraStriping } = preferences;
  return (
    <BaseToggle
      data-cy="zebra-striping-toggle"
      label="Zebra Striping"
      onChange={(value) => {
        setZebraStriping(value);
        sendEvent({ name: "Toggled Zebra Stripes", on: value });
      }}
      tooltip="Toggle whether zebra striping is enabled in the log file."
      value={zebraStriping}
    />
  );
};

export default ZebraStripingToggle;
