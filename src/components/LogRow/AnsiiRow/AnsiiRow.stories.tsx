import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import { LogTypes } from "constants/enums";
import { AnsiiRow } from ".";

export default {
  title: "Components/LogRow/AnsiiRow",
  component: AnsiiRow,
} as ComponentMeta<AnsiiRowProps>;

type AnsiiRowProps = React.FC<React.ComponentProps<typeof AnsiiRow>["data"]>;

// Single AnsiiRow.
const SingleLineTemplate: ComponentStory<AnsiiRowProps> = (args) => (
  <AnsiiRow
    key={logLines[0]}
    data={{
      getLine,
      wrap: args.wrap,
      processedLines: processedLogLines,
      logType: LogTypes.EVERGREEN_TASK_LOGS,
    }}
    listRowProps={{
      index: 0,
      style: {},
      columnIndex: 0,
      isScrolling: false,
      isVisible: true,
      key: getLine(0) || "",
      parent: {} as any,
    }}
  />
);

export const SingleLine = SingleLineTemplate.bind({});

SingleLine.args = {
  wrap: false,
};
SingleLine.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];

// Multiple AnsiiRows.
const MultiLineTemplate: ComponentStory<AnsiiRowProps> = (args) => (
  <>
    {logLines.map((_, index) => (
      <AnsiiRow
        key={logLines[index]}
        data={{
          getLine,
          wrap: args.wrap,
          processedLines: processedLogLines,
          logType: LogTypes.EVERGREEN_TASK_LOGS,
        }}
        listRowProps={{
          index,
          style: {},
          columnIndex: 0,
          isScrolling: false,
          isVisible: true,
          key: getLine(index) || "",
          parent: {} as any,
        }}
      />
    ))}
  </>
);

export const MultiLines = MultiLineTemplate.bind({});

MultiLines.args = {
  wrap: false,
};
MultiLines.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];

// Multiple AnsiiRows with CollapsedRows.
const CollapsedTemplate: ComponentStory<AnsiiRowProps> = (args) => (
  <>
    {collapsedProcessedLogLines.map((_, index) => (
      <AnsiiRow
        key={logLines[index]}
        data={{
          getLine,
          wrap: args.wrap,
          processedLines: collapsedProcessedLogLines,
          logType: LogTypes.EVERGREEN_TASK_LOGS,
        }}
        listRowProps={{
          index,
          style: {},
          columnIndex: 0,
          isScrolling: false,
          isVisible: true,
          key: getLine(index),
          parent: {} as any,
        }}
      />
    ))}
  </>
);

export const Collapsed = CollapsedTemplate.bind({});

Collapsed.args = {
  wrap: false,
};
Collapsed.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];

const logLines = [
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [commit='536cdcab21b907c87cd14751ad523ad1d8f23d07' operation='github api query' query='536cdcab21b907c87cd14751ad523ad1d8f23d07' repo='evergreen-ci/evergreen' size='-1' status='200 OK']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='lint' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='osx' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='race-detector' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='ubuntu1604' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='ubuntu1804-arm64' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='windows' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=info]: [hash='536cdcab21b907c87cd14751ad523ad1d8f23d07' message='successfully created version' project='mci' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
];

const processedLogLines = logLines.map((_, index) => index);

const collapsedProcessedLogLines = [0, [1, 2], 3, 4, [5], 6, 7];

const getLine = (index: number) => logLines[index];
