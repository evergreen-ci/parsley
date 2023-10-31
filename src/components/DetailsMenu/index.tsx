import { useEffect, useState } from "react";
import PopoverButton from "components/PopoverButton";
import { QueryParams } from "constants/queryParams";
import { useQueryParam } from "hooks/useQueryParam";
import DetailsMenuCard from "./DetailsMenuCard";

interface DetailsMenuProps {
  disabled?: boolean;
}
const DetailsMenu: React.FC<DetailsMenuProps> = ({ disabled, ...rest }) => {
  const [lowerRange] = useQueryParam(QueryParams.LowerRange, 0);
  const [upperRange] = useQueryParam<undefined | number>(
    QueryParams.UpperRange,
    undefined
  );
  const [changeVisible, setChangeVisible] = useState(false);

  useEffect(() => {
    setChangeVisible(true);
    const timer = setTimeout(() => {
      setChangeVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [lowerRange, upperRange]);

  return (
    <PopoverButton
      buttonText="Details"
      disabled={disabled}
      variant={changeVisible ? "primary" : "default"}
      {...rest}
    >
      <DetailsMenuCard data-cy="details-menu" />
    </PopoverButton>
  );
};

export default DetailsMenu;
