import { useState } from "react";
import Cookie from "js-cookie";
import { PRETTY_PRINT_BOOKMARKS } from "constants/cookies";
import BaseToggle from "../BaseToggle";

const PrettyPrintToggle: React.FC = () => {
  const [prettyPrint, setPrettyPrint] = useState(
    Cookie.get(PRETTY_PRINT_BOOKMARKS) === "true"
  );
  const onChange = (checked: boolean) => {
    setPrettyPrint(checked);
    Cookie.set(PRETTY_PRINT_BOOKMARKS, checked.toString(), { expires: 365 });
  };
  return (
    <BaseToggle
      data-cy="pretty-print-toggle"
      label="Pretty Print Bookmarks"
      onChange={onChange}
      value={prettyPrint}
    />
  );
};

export default PrettyPrintToggle;
