import { usePreferencesAnalytics } from "analytics";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const WrapToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { wrap, setWrap } = preferences;
  return (
    <BaseToggle
      data-cy="wrap-toggle"
      label="Wrap"
      onChange={(value) => {
        setWrap(value);
        sendEvent({ name: "Toggled Wrap", on: value });
      }}
      value={wrap}
    />
  );
};

export default WrapToggle;
