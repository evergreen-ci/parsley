import { useState } from "react";
import styled from "@emotion/styled";
import { ComponentMeta, ComponentStory } from "@storybook/react";
import LogPane from "components/LogPane";
import { RowRenderer, cache } from "components/LogRow/RowRenderer";
import { LogTypes } from "constants/enums";
import { colorList } from "utils/resmoke";
import ResmokeRow from ".";

export default {
  title: "Components/LogRow/ResmokeRow",
  component: ResmokeRow,
} as ComponentMeta<ResmokeRowProps>;

type ResmokeRowProps = React.FC<
  React.ComponentProps<typeof ResmokeRow>["data"]
>;

// Single ResmokeRow.
const SingleLineTemplate: ComponentStory<ResmokeRowProps> = (args) => (
  <ResmokeRow
    key={logLines[0]}
    data={{
      getLine,
      wrap: args.wrap,
      processedLines: processedLogLines,
      logType: LogTypes.RESMOKE_LOGS,
      range: { lowerRange: 0 },
      scrollToLine: () => {},
      getResmokeLineColor: () => undefined,
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

export const SingleLine = SingleLineTemplate.bind({});

SingleLine.args = {
  wrap: false,
};

// Multiple ResmokeRows.
const MultipleLineTemplate: ComponentStory<ResmokeRowProps> = (args) => {
  const [scrollIndex, setScrollIndex] = useState<number>(-1);
  return (
    <Container>
      <LogPane
        cache={cache}
        filterLogic="and"
        filters={[]}
        initialScrollIndex={-1}
        logLines={processedLogLines}
        rowCount={processedLogLines.length}
        rowRenderer={RowRenderer({
          getLine,
          scrollToLine: setScrollIndex,
          logType: LogTypes.RESMOKE_LOGS,
          processedLines: processedLogLines,
          wrap: args.wrap,
          range: { lowerRange: 0 },
          searchTerm: /mongod/,
          highlightedLine: args.highlightedLine,
          getResmokeLineColor: () => undefined,
        })}
        scrollToIndex={scrollIndex}
        wrap={args.wrap}
      />
    </Container>
  );
};
export const MultipleLines = MultipleLineTemplate.bind({});

MultipleLines.args = {
  wrap: false,
};

const ResmokeHighlightingTemplate: ComponentStory<ResmokeRowProps> = (args) => {
  const [scrollIndex, setScrollIndex] = useState<number>(-1);
  return (
    <Container>
      <LogPane
        cache={cache}
        filterLogic="and"
        filters={[]}
        initialScrollIndex={-1}
        logLines={processedLogLines}
        rowCount={processedLogLines.length}
        rowRenderer={RowRenderer({
          getLine,
          scrollToLine: setScrollIndex,
          logType: LogTypes.RESMOKE_LOGS,
          processedLines: processedLogLines,
          wrap: args.wrap,
          range: { lowerRange: 0 },
          searchTerm: /mongod/,
          highlightedLine: args.highlightedLine,
          getResmokeLineColor: (lineNumber: number) => colorList[lineNumber],
        })}
        scrollToIndex={scrollIndex}
        wrap={args.wrap}
      />
    </Container>
  );
};

export const ResmokeHighlighting = ResmokeHighlightingTemplate.bind({});

ResmokeHighlighting.args = {
  wrap: false,
  highlightedLine: 1,
};
// Multiple ResmokeRows with CollapsedRows.
const CollapsedTemplate: ComponentStory<ResmokeRowProps> = (args) => {
  const [scrollIndex, setScrollIndex] = useState<number>(-1);

  return (
    <Container>
      <LogPane
        cache={cache}
        filterLogic="and"
        filters={[]}
        initialScrollIndex={-1}
        logLines={collapsedProcessedLogLines}
        rowCount={collapsedProcessedLogLines.length}
        rowRenderer={RowRenderer({
          getLine,
          scrollToLine: setScrollIndex,
          logType: LogTypes.RESMOKE_LOGS,
          processedLines: collapsedProcessedLogLines,
          wrap: args.wrap,
          range: { lowerRange: 0 },
          searchTerm: /mongod/,
          highlightedLine: args.highlightedLine,
          getResmokeLineColor: () => undefined,
        })}
        scrollToIndex={scrollIndex}
        wrap={args.wrap}
      />
    </Container>
  );
};

export const Collapsed = CollapsedTemplate.bind({});

Collapsed.args = {
  wrap: false,
  highlightedLine: 1,
};

const logLines = [
  "[js_test:job0_fixture_setup_0] Starting the setup of ReplicaSetFixture (Job #0).",
  "[j0:prim] Starting mongod on port 20000...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin mongod-6.0 --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node0/2c65edd254db4835911f796d7b260455.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node0 --port=20000 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:prim] mongod started on port 20000 with pid 30678.",
  "[j0:sec0] Starting mongod on port 20001...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin /data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin/mongod --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node1/a611b65dce484b7d81b294a7941a2dac.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node1 --port=20001 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:sec0] mongod started on port 20001 with pid 30681.",
  "[j0:sec1] Starting mongod on port 20002...",
  `[j0:s0:n0] | 2022-09-21T12:50:19.923+00:00 D2 REPL_HB  24095   [conn32] "Received heartbeat request","attr":{"from":"localhost:20005","cmdObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":1,"hbv":1,"from":"localhost:20005","fromId":2,"term":1,"primaryId":0,"maxTimeMSOpOnly":10000,"$replData":1,"$clusterTime":{"clusterTime":{"$timestamp":{"t":1663764619,"i":24}},"signature":{"hash":{"$binary":{"base64":"vGCk1d5olY4L+VYegDslPFKywsU=","subType":"0"}},"keyId":7145814532357619736}},"$configTime":{"$timestamp":{"t":1663764618,"i":38}},"$topologyTime":{"$timestamp":{"t":1663764618,"i":6}},"$db":"admin"}}`,
  `[j0:s0:n2] | 2022-09-21T12:50:19.924+00:00 D2 REPL_HB  4615620 [ReplCoord-4] "Received response to heartbeat","attr":{"requestId":150,"target":"localhost:20003","response":{"ok":1,"electionTime":{"$date":{"$numberLong":"7145814558127423490"}},"state":1,"v":5,"configTerm":1,"set":"shard-rs0","term":1,"primaryId":0,"durableOpTime":{"ts":{"$timestamp":{"t":1663764619,"i":24}},"t":1},"durableWallTime":{"$date":"2022-09-21T12:50:19.119Z"},"opTime":{"ts":{"$timestamp":{"t":1663764619,"i":24}},"t":1},"wallTime":{"$date":"2022-09-21T12:50:19.119Z"},"electable":true,"$replData":{"term":1,"lastOpCommitted":{"ts":{"$timestamp":{"t":1663764619,"i":24}},"t":1},"lastCommittedWall":{"$date":"2022-09-21T12:50:19.119Z"},"lastOpVisible":{"ts":{"$timestamp":{"t":1663764619,"i":24}},"t":1},"configVersion":5,"configTerm":1,"replicaSetId":{"$oid":"632b087ba615c7ab564fe2ca"},"syncSourceIndex":-1,"isPrimary":true},"$clusterTime":{"clusterTime":{"$timestamp":{"t":1663764619,"i":24}},"signature":{"hash":{"$binary":{"base64":"AAAAAAAAAAAAAAAAAAAAAAAAAAA=","subType":"0"}},"keyId":0}},"$configTime":{"$timestamp":{"t":1663764618,"i":38}},"$topologyTime":{"$timestamp":{"t":1663764618,"i":6}},"operationTime":{"$timestamp":{"t":1663764619,"i":24}}}}`,
  `[j0:s0:n2] | 2022-09-21T12:50:19.925+00:00 D2 REPL_HB  4615670 [ReplCoord-9] "Sending heartbeat","attr":{"requestId":151,"target":"localhost:20004","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":1,"hbv":1,"from":"localhost:20005","fromId":2,"term":1,"primaryId":0}}`,
];
const processedLogLines = logLines.map((_, index) => index);

const collapsedProcessedLogLines = [0, 1, 2, [3, 4, 5], 6, 7];

const Container = styled.div`
  height: 400px;
  width: 800px;
`;
const getLine = (index: number) => logLines[index];
