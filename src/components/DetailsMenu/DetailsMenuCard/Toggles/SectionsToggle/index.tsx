import { usePreferencesAnalytics } from "analytics";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import { ParsleySettingsInput } from "gql/generated/types";
import BaseToggle from "../BaseToggle";

interface SectionsToggleProps {
  checked: boolean;
  updateSettings: (parsleySettings: ParsleySettingsInput) => void;
}

const SectionsToggle: React.FC<SectionsToggleProps> = ({
  checked,
  updateSettings,
}) => {
  const { sendEvent } = usePreferencesAnalytics();
  const { logMetadata } = useLogContext();
  const { logType } = logMetadata || {};

  const isTaskLog = logType === LogTypes.EVERGREEN_TASK_LOGS;

  return (
    <BaseToggle
      data-cy="sections-toggle"
      disabled={!isTaskLog}
      label="Sections"
      onChange={(value) => {
        updateSettings({
          sectionsEnabled: value,
        });
        sendEvent({ name: "Toggled Sections", on: value });
      }}
      tooltip="Toggle sections. Only available for Evergreen task logs."
      value={checked}
    />
  );
};

export default SectionsToggle;
