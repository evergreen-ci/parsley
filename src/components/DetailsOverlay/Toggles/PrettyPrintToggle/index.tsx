import { useLogContext } from "context/LogContext";
import BaseToggle from "../BaseToggle";

const PrettyPrintToggle: React.FC = () => {
  const { prettyPrint, togglePrettyPrint } = useLogContext();
  return (
    <BaseToggle
      data-cy="pretty-print-toggle"
      label="Pretty Print Bookmarks"
      onChange={togglePrettyPrint}
      value={prettyPrint}
    />
  );
};

export default PrettyPrintToggle;
