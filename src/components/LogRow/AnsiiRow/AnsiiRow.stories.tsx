import { useEffect } from "react";
import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import LogPane from "components/LogPane";
import { LogTypes } from "constants/enums";
import { useLogContext } from "context/LogContext";
import AnsiiRow from ".";
import { ParsleyRow } from "../RowRenderer";

export default {
  component: AnsiiRow,
};

type AnsiiRowProps = React.FC<React.ComponentProps<typeof AnsiiRow>>;

// Single AnsiiRow.
const SingleLineStory = (args: any) => {
  const { ingestLines, resetRowHeightAtIndex, scrollToLine } = useLogContext();

  useEffect(() => {
    ingestLines(logLines, LogTypes.EVERGREEN_TASK_LOGS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AnsiiRow
      key={logLines[0]}
      getLine={() => logLines[0]}
      highlightRegex={undefined}
      lineIndex={0}
      lineNumber={0}
      range={{ lowerRange: 0 }}
      resetRowHeightAtIndex={resetRowHeightAtIndex}
      scrollToLine={scrollToLine}
      searchTerm={undefined}
      wrap={args.wrap}
    />
  );
};

export const SingleLine: StoryObj<AnsiiRowProps> = {
  render: (args) => <SingleLineStory {...args} />,
  args: {
    wrap: false,
  },
};

// Multiple AnsiiRows.
const MultiLineStory = (args: any) => {
  const { ingestLines, processedLogLines, preferences } = useLogContext();
  const { setWrap } = preferences;

  useEffect(() => {
    ingestLines(logLines, LogTypes.EVERGREEN_TASK_LOGS);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setWrap(args.wrap);
  }, [args.wrap, setWrap]);

  return (
    <Container>
      <LogPane
        rowCount={processedLogLines.length}
        rowRenderer={ParsleyRow({
          processedLogLines,
          logType: LogTypes.EVERGREEN_TASK_LOGS,
        })}
      />
    </Container>
  );
};

export const MultiLines: StoryObj<AnsiiRowProps> = {
  render: (args) => <MultiLineStory {...args} />,
  args: {
    wrap: false,
  },
};

const logLines = [
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [commit='536cdcab21b907c87cd14751ad523ad1d8f23d07' operation='github api query' query='536cdcab21b907c87cd14751ad523ad1d8f23d07' repo='evergreen-ci/evergreen' size='-1' status='200 OK']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='lint' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='osx' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='race-detector' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='ubuntu1604' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='ubuntu1804-arm64' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=debug]: [message='created build' name='windows' project='mci' project_identifier='' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "[2022/08/30 14:53:58.774] [grip] 2022/08/30 14:53:17 [p=info]: [hash='536cdcab21b907c87cd14751ad523ad1d8f23d07' message='successfully created version' project='mci' runner='repotracker' version='_536cdcab21b907c87cd14751ad523ad1d8f23d07']",
  "Some line with a url https://www.google.com",
  "[2022/09/09 20:08:18.604] (Use `node --trace-deprecation ...` to show where the warning was created)",

  "┌\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m┐\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mTests:\u001b[39m        \u001b[32m4\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mPassing:\u001b[39m      \u001b[32m4\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mFailing:\u001b[39m      \u001b[32m0\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mPending:\u001b[39m      \u001b[32m0\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mSkipped:\u001b[39m      \u001b[32m0\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mScreenshots:\u001b[39m  \u001b[32m0\u001b[39m                                                                                \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mVideo:\u001b[39m        \u001b[32mtrue\u001b[39m                                                                             \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mDuration:\u001b[39m     \u001b[32m1 second\u001b[39m                                                                         \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mEstimated:\u001b[39m    \u001b[32m12 seconds\u001b[39m                                                                       \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  │\u001b[39m \u001b[90mSpec Ran:\u001b[39m     \u001b[32m\u001b[32mlogView.ts\u001b[32m\u001b[39m                                                                       \u001b[90m│\u001b[39m",
  "[2022/09/09 19:49:46.103] \u001b[90m  └\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m─\u001b[39m\u001b[90m┘\u001b[39m",
  "[2022/09/09 19:49:46.679] \u001b[34m  (\u001b[4m\u001b[1mUploading Results\u001b[22m\u001b[24m)\u001b[39m",
  "[2022/09/09 19:49:46.679]   - Done Uploading \u001b[90m(1/1)\u001b[39m \u001b[34m/data/mci/086da7292b38a2ffb50e7e42f81025f4/parsley/cypress/videos/resmokeLogs/logView.ts.mp4\u001b[39m",
  "[2022/09/09 19:49:46.894] resize:  can't open terminal /dev/tty",
  "[2022/09/09 19:49:46.894] tput: No value for $TERM and no -T specified",
  "[2022/09/09 19:49:46.894] \u001b[90m====================================================================================================\u001b[39m",
  "[2022/09/09 19:49:46.899] \u001b[0m  (\u001b[4m\u001b[1mRun Finished\u001b[22m\u001b[24m)\u001b[0m",
  "[2022/09/09 19:49:46.899] \u001b[90m   \u001b[39m    \u001b[90mSpec\u001b[39m                                              \u001b[90mTests\u001b[39m  \u001b[90mPassing\u001b[39m  \u001b[90mFailing\u001b[39m  \u001b[90mPending\u001b[39m  \u001b[90mSkipped\u001b[39m \u001b[90m \u001b[39m",
];

const Container = styled.div`
  height: 400px;
  width: 800px;
`;
