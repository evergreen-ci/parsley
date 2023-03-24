import AnsiUp from "ansi_up";
import linkifyHtml from "linkify-html";
import BaseRow from "components/LogRow/BaseRow";
import { LogRowProps } from "../types";

interface AnsiiRowProps extends LogRowProps {}

const AnsiiRow: React.FC<AnsiiRowProps> = ({
  getLine,
  lineNumber,
  ...rest
}) => {
  const ansiUp = new AnsiUp();

  const lineContent = getLine(lineNumber);
  const linkifiedLine = linkifyHtml(ansiUp.ansi_to_html(lineContent ?? ""), {
    validate: {
      url: (value: string) => /^(http)s?:\/\//.test(value),
    },
  });

  return lineContent !== undefined ? (
    <BaseRow data-cy="ansii-row" lineNumber={lineNumber} {...rest}>
      {linkifiedLine}
    </BaseRow>
  ) : null;
};

AnsiiRow.displayName = "AnsiiRow";

export default AnsiiRow;
