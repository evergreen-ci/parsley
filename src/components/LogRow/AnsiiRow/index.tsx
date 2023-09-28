import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";
import { getSeverityMapping, mapLogLevelToColor } from "./utils";
import { LogRowProps } from "../types";

interface AnsiiRowProps extends LogRowProps {}

const AnsiiRow: React.FC<AnsiiRowProps> = ({
  getLine,
  lineNumber,
  ...rest
}) => {
  const ansiUp = new AnsiUp();

  let lineContent = getLine(lineNumber);

  if (lineContent === undefined) {
    return null;
  }

  const severity = lineContent.startsWith("[P: ")
    ? getSeverityMapping(Number(lineContent.substring(3, 6)))
    : null;

  if (severity) {
    // Trim "[P: NN] " priority prefix
    lineContent = lineContent.substring(8);
  }

  const linkifiedLine = linkifyHtml(ansiUp.ansi_to_html(lineContent ?? ""), {
    validate: {
      url: (value: string) => /^(http)s?:\/\//.test(value),
    },
  });

  return (
    <BaseRow
      color={severity ? mapLogLevelToColor[severity] : undefined}
      data-cy="ansii-row"
      lineNumber={lineNumber}
      {...rest}
    >
      {linkifiedLine}
    </BaseRow>
  );
};

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
