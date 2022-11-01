import { usePreferencesAnalytics } from "analytics";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import BaseToggle from "../BaseToggle";

const WrapToggle: React.FC = () => {
  const [wrap, setWrap] = useQueryParam(QueryParams.Wrap, false);
  const { sendEvent } = usePreferencesAnalytics();

  return (
    <BaseToggle
      data-cy="wrap-toggle"
      label="Wrap"
      onChange={(value) => {
        setWrap(value);
        sendEvent({ name: "Toggle Wrap", on: value });
      }}
      value={wrap}
    />
  );
};

export default WrapToggle;
