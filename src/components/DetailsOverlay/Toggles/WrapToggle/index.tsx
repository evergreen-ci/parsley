import Cookie from "js-cookie";
import { usePreferencesAnalytics } from "analytics";
import { WRAP } from "constants/cookies";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const WrapToggle: React.FC = () => {
  const { wrap, setWrap } = useLogContext();
  const { sendEvent } = usePreferencesAnalytics();

  return (
    <BaseToggle
      data-cy="wrap-toggle"
      label="Wrap"
      onChange={(value) => {
        Cookie.set(WRAP, value.toString());
        setWrap(value);
        sendEvent({ name: "Toggled Wrap", on: value });
      }}
      value={wrap}
    />
  );
};

export default WrapToggle;
