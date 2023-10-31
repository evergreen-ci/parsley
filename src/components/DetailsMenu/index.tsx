import PopoverButton from "components/PopoverButton";
import DetailsMenuCard from "./DetailsMenuCard";

interface DetailsMenuProps {
  disabled?: boolean;
}
const DetailsMenu: React.FC<DetailsMenuProps> = ({ disabled, ...rest }) => (
  <PopoverButton buttonText="Details" disabled={disabled} {...rest}>
    <DetailsMenuCard data-cy="details-menu" />
  </PopoverButton>
);

export default DetailsMenu;
