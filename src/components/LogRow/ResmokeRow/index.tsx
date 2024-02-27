import BaseRow from "components/LogRow/BaseRow";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import { formatPrettyPrint } from "utils/prettyPrint";
import { LogRowProps } from "../types";

interface ResmokeRowProps extends LogRowProps {
  prettyPrint: boolean;
  getResmokeLineColor: (lineNumber: number) => string | undefined;
}

const ResmokeRow: React.FC<ResmokeRowProps> = ({
  getLine,
  getResmokeLineColor,
  lineNumber,
  prettyPrint = false,
  ...rest
}) => {
  const lineContent = getLine(lineNumber);
  const lineColor = getResmokeLineColor(lineNumber);
  const [bookmarks] = useQueryParam<number[]>(QueryParams.Bookmarks, []);
  const bookmarked = bookmarks.includes(lineNumber);

  return lineContent !== undefined ? (
    <BaseRow
      color={lineColor}
      data-cy="resmoke-row"
      lineNumber={lineNumber}
      {...rest}
    >
      {bookmarked && prettyPrint ? formatPrettyPrint(lineContent) : lineContent}
    </BaseRow>
  ) : null;
};

ResmokeRow.displayName = "ResmokeRow";

export default ResmokeRow;
