import { LogTypes } from "constants/enums";

interface LogViewProps {
  logType: LogTypes;
}

const LogView: React.FC<LogViewProps> = ({ logType }) => (
  <div>
    <h1>Log View</h1>
    <i>{logType}</i>
  </div>
);

export default LogView;
