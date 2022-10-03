import { useState } from "react";
import styled from "@emotion/styled";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import { MemoryRouter } from "react-router-dom";
import LogPane from "components/LogPane";
import { RowRenderer, cache } from "components/LogRow/RowRenderer";
import { LogTypes } from "constants/enums";
import { ExpandedLines } from "types/logs";
import ResmokeRow from ".";

export default {
  title: "Components/LogRow/ResmokeRow",
  component: ResmokeRow,
} as ComponentMeta<ResmokeRowProps>;

type ResmokeRowProps = React.FC<
  React.ComponentProps<typeof ResmokeRow>["data"]
>;

// Single ResmokeRow.
const SingleLineTemplate: ComponentStory<ResmokeRowProps> = (args) => {
  const [, setExpandedLines] = useState<ExpandedLines>([]);

  return (
    <ResmokeRow
      key={logLines[0]}
      data={{
        getLine,
        wrap: args.wrap,
        processedLines: processedLogLines,
        logType: LogTypes.RESMOKE_LOGS,
        expandedLines: [],
        setExpandedLines,
      }}
      listRowProps={{
        index: 2,
        style: {},
        columnIndex: 0,
        isScrolling: false,
        isVisible: true,
        key: getLine(2) || "",
        parent: {} as any,
      }}
    />
  );
};

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

// Multiple ResmokeRows.
const MultipleLineTemplate: ComponentStory<ResmokeRowProps> = (args) => {
  const [, setExpandedLines] = useState<ExpandedLines>([]);

  return (
    <Container>
      <LogPane
        cache={cache}
        expandedLines={[]}
        filters={[]}
        logLines={processedLogLines}
        rowCount={processedLogLines.length}
        rowRenderer={RowRenderer({
          logType: LogTypes.RESMOKE_LOGS,
          wrap: args.wrap,
          getLine,
          processedLines: processedLogLines,
          expandedLines: [],
          setExpandedLines,
        })}
        scrollToIndex={0}
        wrap={args.wrap}
      />
    </Container>
  );
};
export const MultipleLines = MultipleLineTemplate.bind({});

MultipleLines.args = {
  wrap: false,
};
MultipleLines.decorators = [
  (Story) => (
    <MemoryRouter initialEntries={["/"]}>
      <Story />
    </MemoryRouter>
  ),
];

const logLines = [
  "[js_test:job0_fixture_setup_0] Starting the setup of ReplicaSetFixture (Job #0).",
  "[j0:prim] Starting mongod on port 20000...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin mongod-6.0 --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node0/2c65edd254db4835911f796d7b260455.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node0 --port=20000 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:prim] mongod started on port 20000 with pid 30678.",
  "[j0:sec0] Starting mongod on port 20001...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin /data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin/mongod --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node1/a611b65dce484b7d81b294a7941a2dac.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node1 --port=20001 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:sec0] mongod started on port 20001 with pid 30681.",
  "[j0:sec1] Starting mongod on port 20002...",
];
const processedLogLines = logLines.map((_, index) => index);

const Container = styled.div`
  height: 400px;
  width: 800px;
`;
const getLine = (index: number) => logLines[index];
