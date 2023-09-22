import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";
import { useToastContext } from "context/toast";
import { useQueryParam } from "hooks/useQueryParam";
import { copyToClipboard, getJiraFormat } from "utils/string";

interface SharingMenuProps {
  open: boolean;
  refEl: React.RefObject<HTMLElement>;
}
const SharingMenu: React.FC<SharingMenuProps> = ({ open, refEl }) => {
  const { handleCloseMenu, selectedLines } = useMultiLineSelectContext();
  const { getLine } = useLogContext();
  const [, setLowerRange] = useQueryParam(QueryParams.LowerRange, 0);
  const [, setUpperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined
  );
  const dispatchToast = useToastContext();

  const handleCopySelectedLines = async () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === null || endingLine === null) return;
    // Create an array of line numbers that represent the range in selectedLines
    const bookmarks = Array.from(
      { length: endingLine - startingLine + 1 },
      (_, i) => i + startingLine
    );
    await copyToClipboard(getJiraFormat(bookmarks, getLine));
    dispatchToast.success(`Copied ${bookmarks.length} lines to clipboard`);
  };

  const handleOnlySearchOnRange = () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === null || endingLine === null) return;
    setLowerRange(startingLine);
    setUpperRange(endingLine);
  };

  return (
    <Menu open={open} refEl={refEl} setOpen={handleCloseMenu}>
      <MenuItem onClick={handleCopySelectedLines}>Copy selected lines</MenuItem>
      <MenuItem>Share selected link</MenuItem>
      <MenuItem onClick={handleOnlySearchOnRange}>
        Only search on range
      </MenuItem>
    </Menu>
  );
};

export default SharingMenu;
