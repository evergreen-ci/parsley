import { useState } from "react";
import styled from "@emotion/styled";
import IconButton from "@leafygreen-ui/icon-button";
import { Menu, MenuItem } from "@leafygreen-ui/menu";
import pluralize from "pluralize";
import Icon from "components/Icon";
import { QueryParams } from "constants/queryParams";
import { size } from "constants/tokens";
import { useLogContext } from "context/LogContext";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";
import { useToastContext } from "context/toast";
import { useQueryParams } from "hooks/useQueryParam";
import { copyToClipboard, getJiraFormat } from "utils/string";
import { getLinesInProcessedLogLinesFromSelectedLines } from "./utils";

interface SharingMenuProps {
  defaultOpen: boolean;
}

const SharingMenu: React.FC<SharingMenuProps> = ({ defaultOpen }) => {
  const { selectedLines } = useMultiLineSelectContext();
  const { getLine, processedLogLines } = useLogContext();
  const [params, setParams] = useQueryParams();
  const dispatchToast = useToastContext();
  const [open, setOpen] = useState(defaultOpen);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setOpen((o) => !o);
  };

  const handleCopySelectedLines = async () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === undefined || endingLine === undefined) return;
    // Create an array of line numbers that represent the range in selectedLines
    const lineNumbers = getLinesInProcessedLogLinesFromSelectedLines(
      processedLogLines,
      selectedLines
    );

    await copyToClipboard(getJiraFormat(lineNumbers, getLine));
    setOpen(false);
    dispatchToast.success(`Copied ${lineNumbers.length} lines to clipboard`);
  };

  const handleOnlySearchOnRange = () => {
    const { endingLine, startingLine } = selectedLines;
    if (startingLine === undefined || endingLine === undefined) return;
    setParams({
      ...params,
      [QueryParams.LowerRange]: startingLine,
      [QueryParams.UpperRange]: endingLine,
    });
    setOpen(false);
  };

  const handleShareLinkToSelectedLines = async () => {
    const { startingLine } = selectedLines;
    if (startingLine === undefined) return;
    // Take the current URL and add the shareLine query param
    const url = new URL(window.location.href);
    url.searchParams.set(QueryParams.ShareLine, startingLine.toString());

    await copyToClipboard(url.toString());
    setOpen(false);

    dispatchToast.success(`Copied link to clipboard`);
  };

  const lineCount =
    selectedLines.endingLine === undefined ||
    selectedLines.startingLine === undefined
      ? 1
      : selectedLines.endingLine - selectedLines.startingLine + 1;

  return (
    <Menu
      open={open}
      trigger={
        <MenuIcon aria-label="Expand share menu" onClick={handleToggleMenu}>
          <Icon glyph="Ellipsis" />
        </MenuIcon>
      }
    >
      <MenuItem
        onClick={handleCopySelectedLines}
        title={`Copy the selected ${pluralize(
          "line",
          lineCount
        )} to your clipboard with Jira formatting.`}
      >
        Copy selected {pluralize("line", lineCount)}
      </MenuItem>
      <MenuItem
        onClick={handleShareLinkToSelectedLines}
        title={`Copy a link to ${pluralize("this", lineCount)} ${pluralize(
          "line",
          lineCount
        )}.`}
      >
        Share link to selected {pluralize("line", lineCount)}
      </MenuItem>
      <MenuItem
        disabled={lineCount === 1}
        onClick={handleOnlySearchOnRange}
        title="Limit the range Parsley will search to only these lines."
      >
        Only search on range
      </MenuItem>
    </Menu>
  );
};

const MenuIcon = styled(IconButton)`
  height: 16px;
  width: 16px;
  margin-left: ${size.xxs};
`;

export default SharingMenu;
