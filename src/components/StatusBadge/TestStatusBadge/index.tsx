import Badge, { Variant } from "@leafygreen-ui/badge";
import { TestStatus } from "types/test";

const statusToBadgeColor = {
  [TestStatus.Pass]: Variant.Green,
  [TestStatus.Fail]: Variant.Red,
  [TestStatus.SilentFail]: Variant.Blue,
  [TestStatus.Skip]: Variant.Yellow,
};

const statusCopy = {
  [TestStatus.Pass]: "Pass",
  [TestStatus.Fail]: "Fail",
  [TestStatus.Skip]: "Skip",
  [TestStatus.SilentFail]: "Silent Fail",
};

interface TestStatusBadgeProps {
  status?: string;
}

const TestStatusBadge: React.FC<TestStatusBadgeProps> = ({ status }) => {
  if (!status) {
    return null;
  }
  const testStatus = status.toLowerCase() as TestStatus;
  return (
    <Badge
      key={status}
      data-cy="test-status-badge"
      variant={statusToBadgeColor[testStatus] || Variant.LightGray}
    >
      {statusCopy[testStatus] || status}
    </Badge>
  );
};

export default TestStatusBadge;
