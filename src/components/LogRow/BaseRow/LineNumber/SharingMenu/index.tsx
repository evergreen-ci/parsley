import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { QueryParams } from "constants/queryParams";
import { useLogContext } from "context/LogContext";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";
import { useToastContext } from "context/toast";
import { useQueryParams } from "hooks/useQueryParam";
import { copyToClipboard, getJiraFormat } from "utils/string";

interface SharingMenuProps {
  open: boolean;
  refEl: React.RefObject<HTMLElement>;
}
const SharingMenu: React.FC<SharingMenuProps> = ({ open, refEl }) => {
  const { handleCloseMenu, selectedLines } = useMultiLineSelectContext();
  const { getLine } = useLogContext();
  const [params, setParams] = useQueryParams();
  const dispatchToast = useToastContext();

  const handleCopySelectedLines = async () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === undefined || endingLine === undefined) return;
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
    if (startingLine === undefined || endingLine === undefined) return;
    setParams({
      ...params,
      [QueryParams.LowerRange]: startingLine,
      [QueryParams.UpperRange]: endingLine,
    });
  };

  const handleShareLinkToSelectedLines = async () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === null || endingLine === null) return;
    await copyToClipboard(`${window.location.href}`);
    dispatchToast.success(`Copied link to clipboard`);
  };

  return (
    <Menu open={open} refEl={refEl} setOpen={handleCloseMenu}>
      <MenuItem onClick={handleCopySelectedLines}>Copy selected lines</MenuItem>
      <MenuItem onClick={handleShareLinkToSelectedLines}>
        Share link to selected lines
      </MenuItem>
      <MenuItem onClick={handleOnlySearchOnRange}>
        Only search on range
      </MenuItem>
    </Menu>
  );
};

export default SharingMenu;
