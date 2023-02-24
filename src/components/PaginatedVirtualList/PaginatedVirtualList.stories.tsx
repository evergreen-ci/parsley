import styled from "@emotion/styled";
import { StoryObj } from "@storybook/react";
import PaginatedVirtualList from ".";

export default {
  component: PaginatedVirtualList,
};

const line = `[js_test:startup_recovery_commit_transaction_before_stable_timestamp] d20540| 2022-09-06T21:21:32.384Z I  CONTROL  5760901 [thread1] "Applied --setParameter options","attr":{"serverParameters":{"backtraceLogFile":{"default":"","value":"\\data\\db\\job2\\mongorunner/gc24ttpdzwpod0v4pib6r1662499291729.stacktrace"},"coordinateCommitReturnImmediatelyAfterPersistingDecision":{"default":false,"value":false},"disableLogicalSessionCacheRefresh":{"default":false,"value":true},"enableDefaultWriteConcernUpdatesForInitiate":{"default":false,"value":true},"enableReconfigRollbackCommittedWritesCheck":{"default":true,"value":false},"enableTestCommands":{"default":false,"value":true},"logComponentVerbosity":{"default":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":-1},"heartbeats":{"verbosity":-1},"initialSync":{"verbosity":-1},"rollback":{"verbosity":-1}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":-1},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":-1},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":-1},"tenantMigration":{"verbosity":-1},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}},"value":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":4},"heartbeats":{"verbosity":2},"initialSync":{"verbosity":2},"rollback":{"verbosity":2}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":2},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":2},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":4},"tenantMigration":{"verbosity":4},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}}},"minNumChunksForSessionsCollection":{"default":1024,"value":1},"numInitialSyncConnectAttempts":{"default":10,"value":60},"oplogApplicationEnforcesSteadyStateConstraints":{"default":false,"value":true},"orphanCleanupDelaySecs":{"default":900,"value":1},"reshardingMinimumOperationDurationMillis":{"default":300000,"value":5000},"shutdownTimeoutMillisForSignaledShutdown":{"default":15000,"value":100},"testingDiagnosticsEnabled":{"default":false,"value":true},"transactionLifetimeLimitSeconds":{"default":60,"value":86400},"writePeriodicNoops":{"default":true,"value":false}}}`;
export const Default: StoryObj<typeof PaginatedVirtualList> = {
  render: (args) => (
    <Container>
      <PaginatedVirtualList {...args} row={row} />
    </Container>
  ),
};

const row = (i: number) => (
  <div style={{}}>
    <pre>
      {i}
      {line}
    </pre>
  </div>
);

Default.args = {
  count: 50000,
  paginationThreshold: 100,
};

const Container = styled.div`
  height: 500px;
  width: 500px;
`;
