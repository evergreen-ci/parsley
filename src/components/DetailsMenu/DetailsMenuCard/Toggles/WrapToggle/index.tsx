import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const WrapToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { setWrap, wrap } = preferences;
  return (
    <BaseToggle
      data-cy="wrap-toggle"
      label="Wrap"
      onChange={(value) => {
        setWrap(value);
        sendEvent({ name: "Toggled Wrap", on: value });
      }}
      tooltip="Toggle line wrapping for overflowing lines"
      value={wrap}
    />
  );
};

export default WrapToggle;
