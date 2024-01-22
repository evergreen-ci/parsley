import { usePreferencesAnalytics } from "analytics";
import { WordWrapFormat } from "constants/enums";
import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const WordWrapFormatToggle: React.FC = () => {
  const { sendEvent } = usePreferencesAnalytics();
  const { preferences } = useLogContext();
  const { setWordWrapFormat, wordWrapFormat } = preferences;
  const isChecked = wordWrapFormat === WordWrapFormat.Aggressive;

  const onChange = (checked: boolean) => {
    if (checked) {
      setWordWrapFormat(WordWrapFormat.Aggressive);
      sendEvent({
        format: WordWrapFormat.Aggressive,
        name: "Toggled Word Wrap Format",
      });
    } else {
      setWordWrapFormat(WordWrapFormat.Standard);
      sendEvent({
        format: WordWrapFormat.Standard,
        name: "Toggled Word Wrap Format",
      });
    }
  };
  return (
    <BaseToggle
      data-cy="word-wrap-format-toggle"
      label="Wrap Format"
      leftLabel="Standard"
      onChange={onChange}
      rightLabel="Aggressive"
      tooltip="Aggressive wrapping will wrap on any character, while standard wrapping will only wrap on whitespace."
      value={isChecked}
    />
  );
};

export default WordWrapFormatToggle;
