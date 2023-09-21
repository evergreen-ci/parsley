import { Menu, MenuItem } from "@leafygreen-ui/menu";
import { useMultiLineSelectContext } from "context/MultiLineSelectContext";

interface SharingMenuProps {
  open: boolean;
  refEl: React.RefObject<HTMLElement>;
}
const SharingMenu: React.FC<SharingMenuProps> = ({ open, refEl }) => {
  const { handleCloseMenu } = useMultiLineSelectContext();

  return (
    <Menu open={open} refEl={refEl} setOpen={handleCloseMenu}>
      <MenuItem>Copy selected lines</MenuItem>
      <MenuItem>Share selected link</MenuItem>
      <MenuItem>Only search on range</MenuItem>
    </Menu>
  );
};

export default SharingMenu;
