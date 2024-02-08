import { readFileSync } from "fs";
import { join } from "path";
import { getColorMapping, processResmokeLine } from ".";

describe("processResmokeLine", () => {
  it("should transform a simple line to a resmoke line", () => {
    expect(
      processResmokeLine(
        `[js_test:startup_recovery_commit_transaction_before_stable_timestamp] d20540| {"t":{"$date":"2022-09-06T21:21:32.384Z"},"s":"I",  "c":"CONTROL",  "id":5760901, "svc":"S", "ctx":"thread1","msg":"Applied --setParameter options","attr":{"serverParameters":{"backtraceLogFile":{"default":"","value":"\\data\\db\\job2\\mongorunner/gc24ttpdzwpod0v4pib6r1662499291729.stacktrace"},"coordinateCommitReturnImmediatelyAfterPersistingDecision":{"default":false,"value":false},"disableLogicalSessionCacheRefresh":{"default":false,"value":true},"enableDefaultWriteConcernUpdatesForInitiate":{"default":false,"value":true},"enableReconfigRollbackCommittedWritesCheck":{"default":true,"value":false},"enableTestCommands":{"default":false,"value":true},"logComponentVerbosity":{"default":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":-1},"heartbeats":{"verbosity":-1},"initialSync":{"verbosity":-1},"rollback":{"verbosity":-1}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":-1},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":-1},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":-1},"tenantMigration":{"verbosity":-1},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}},"value":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":4},"heartbeats":{"verbosity":2},"initialSync":{"verbosity":2},"rollback":{"verbosity":2}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":2},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":2},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":4},"tenantMigration":{"verbosity":4},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}}},"minNumChunksForSessionsCollection":{"default":1024,"value":1},"numInitialSyncConnectAttempts":{"default":10,"value":60},"oplogApplicationEnforcesSteadyStateConstraints":{"default":false,"value":true},"orphanCleanupDelaySecs":{"default":900,"value":1},"reshardingMinimumOperationDurationMillis":{"default":300000,"value":5000},"shutdownTimeoutMillisForSignaledShutdown":{"default":15000,"value":100},"testingDiagnosticsEnabled":{"default":false,"value":true},"transactionLifetimeLimitSeconds":{"default":60,"value":86400},"writePeriodicNoops":{"default":true,"value":false}}}}`,
      ),
    ).toBe(
      `[js_test:startup_recovery_commit_transaction_before_stable_timestamp] d20540| 2022-09-06T21:21:32.384Z I  CONTROL  [S] 5760901 [thread1] "Applied --setParameter options","attr":{"serverParameters":{"backtraceLogFile":{"default":"","value":"\\data\\db\\job2\\mongorunner/gc24ttpdzwpod0v4pib6r1662499291729.stacktrace"},"coordinateCommitReturnImmediatelyAfterPersistingDecision":{"default":false,"value":false},"disableLogicalSessionCacheRefresh":{"default":false,"value":true},"enableDefaultWriteConcernUpdatesForInitiate":{"default":false,"value":true},"enableReconfigRollbackCommittedWritesCheck":{"default":true,"value":false},"enableTestCommands":{"default":false,"value":true},"logComponentVerbosity":{"default":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":-1},"heartbeats":{"verbosity":-1},"initialSync":{"verbosity":-1},"rollback":{"verbosity":-1}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":-1},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":-1},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":-1},"tenantMigration":{"verbosity":-1},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}},"value":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":4},"heartbeats":{"verbosity":2},"initialSync":{"verbosity":2},"rollback":{"verbosity":2}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":2},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":2},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":4},"tenantMigration":{"verbosity":4},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}}},"minNumChunksForSessionsCollection":{"default":1024,"value":1},"numInitialSyncConnectAttempts":{"default":10,"value":60},"oplogApplicationEnforcesSteadyStateConstraints":{"default":false,"value":true},"orphanCleanupDelaySecs":{"default":900,"value":1},"reshardingMinimumOperationDurationMillis":{"default":300000,"value":5000},"shutdownTimeoutMillisForSignaledShutdown":{"default":15000,"value":100},"testingDiagnosticsEnabled":{"default":false,"value":true},"transactionLifetimeLimitSeconds":{"default":60,"value":86400},"writePeriodicNoops":{"default":true,"value":false}}}`,
    );
    expect(
      processResmokeLine(
        `[js_test:catalog_cache_refresh_counters] d20041| {"t":{"$date":"2022-11-29T12:42:28.889+00:00"},"s":"I",  "c":"NETWORK",  "id":6496702, "ctx":"ConfigServerCatalogCacheLoader::getDatabase","msg":"Acquired connection for remote operation and completed writing to wire","attr":{"durationMicros":73}}`,
      ),
    ).toBe(
      '[js_test:catalog_cache_refresh_counters] d20041| 2022-11-29T12:42:28.889+00:00 I  NETWORK  6496702 [ConfigServerCatalogCacheLoader::getDatabase] "Acquired connection for remote operation and completed writing to wire","attr":{"durationMicros":73}',
    );
  });
  it("should ignore non resmoke lines", () => {
    expect(processResmokeLine("hello")).toBe("hello");
  });
  it("should handle strings with escaped quotes", () => {
    expect(
      processResmokeLine(
        `[j1] {"t":{"$date":"2022-12-15T14:27:56.528+00:00"},"s":"I",  "c":"-",        "id":0,       "ctx":"conn31","msg":"XOXOXO command is setting shard role { isMaster: 1, client: { application: { name: \\"MongoDB Shell\\" }, driver: { name: \\"MongoDB Internal Client\\", version: \\"6.3.0-alpha-520-g20913e4-patch-639b27313627e07bda0ca7db\\" }, os: { type: \\"Linux\\", name: \\"Red Hat Enterprise Linux release 8.0 (Ootpa)\\", architecture: \\"x86_64\\", version: \\"Kernel 4.18.0-80.1.2.el8_0.x86_64\\" } }, $db: \\"admin\\" }"}`,
      ),
    ).toBe(
      `[j1] | 2022-12-15T14:27:56.528+00:00 I  -        0       [conn31] "XOXOXO command is setting shard role { isMaster: 1, client: { application: { name: \\"MongoDB Shell\\" }, driver: { name: \\"MongoDB Internal Client\\", version: \\"6.3.0-alpha-520-g20913e4-patch-639b27313627e07bda0ca7db\\" }, os: { type: \\"Linux\\", name: \\"Red Hat Enterprise Linux release 8.0 (Ootpa)\\", architecture: \\"x86_64\\", version: \\"Kernel 4.18.0-80.1.2.el8_0.x86_64\\" } }, $db: \\"admin\\" }"`,
    );
  });
  it("should ignore resmoke lines that don't have mongo logs", () => {
    expect(
      processResmokeLine(
        "[js_test:startup_recovery_commit_transaction_before_stable_timestamp] MongoDB shell version v6.2.0-alpha-250-g46817bf",
      ),
    ).toBe(
      "[js_test:startup_recovery_commit_transaction_before_stable_timestamp] MongoDB shell version v6.2.0-alpha-250-g46817bf",
    );
  });
  it("should transform a resmoke log", () => {
    resmokeLogFiles.forEach((file) => {
      const resmokeLog = readFileSync(
        join(__dirname, `./testData/${file.input}`),
        "utf8",
      ).split("\n");
      const parsedResmokeLog = readFileSync(
        join(__dirname, `./testData/${file.output}`),
        "utf8",
      ).split("\n");

      expect(resmokeLog).toHaveLength(parsedResmokeLog.length);
      const transformedLines = resmokeLog.map(processResmokeLine);
      expect(transformedLines).toStrictEqual(parsedResmokeLog);
    });
  });
});

describe("getColorMapping", () => {
  it("should return a color for a port", () => {
    const portColors: Record<string, string> = {};
    const color = getColorMapping(
      `[j0:s0:n0] | 2022-09-21T12:59:01.277+00:00 I  -        20883   [conn1690] "Interrupted operation as its client disconnected","attr":{"opId":172754}`,
      portColors,
    );
    expect(color).toStrictEqual({ color: "#00A35C", portOrState: ":s0:n0]" });
  });
  it("should return the same color for the same port", () => {
    const portColors: Record<string, string> = {};
    const color1 = getColorMapping(
      `[j0:s0:n0] | 2022-09-21T12:59:01.277+00:00 I  -        20883   [conn1690] "Interrupted operation as its client disconnected","attr":{"opId":172754}`,
      portColors,
    );
    const color2 = getColorMapping(
      `[j0:s0:n0] | 2022-09-21T12:59:01.277+00:00 I  NETWORK  22944   [conn1691] "Connection ended","attr":{"remote":"127.0.0.1:43266","uuid":{"uuid":{"$uuid":"14dcb2b1-d53b-498a-b251-caa843cf2559"}},"connectionId":1691,"connectionCount":53}`,
      portColors,
    );
    expect(color1).toStrictEqual(color2);
  });

  it("should return a different color for a different port", () => {
    let portColors: Record<string, string> = {};
    const color1 = getColorMapping(
      `[j0:s0:n0] | 2022-09-21T12:59:01.277+00:00 I  -        20883   [conn1690] "Interrupted operation as its client disconnected","attr":{"opId":172754}`,
      portColors,
    );
    portColors = { ...portColors, ...color1 };
    const color2 = getColorMapping(
      `[j0:s0:n1] | 2022-09-21T12:59:01.284+00:00 I  -        20883   [conn1299] "Interrupted operation as its client disconnected","attr":{"opId":163850}`,
      portColors,
    );
    portColors = { ...portColors, ...color2 };
    expect(color1).not.toStrictEqual(color2);
    expect(color2).toStrictEqual({ color: "#5B0000", portOrState: ":s0:n1]" });
  });

  it("should return different colors for different port combinations", () => {
    let portColors: Record<string, string> = {};
    const color1 = getColorMapping(
      '[js_test:catalog_cache_refresh_counters] sh12345| d20041| 2022-11-29T12:42:28.889+00:00 I  NETWORK  6496702 [ConfigServerCatalogCacheLoader::getDatabase] "Acquired connection for remote operation and completed writing to wire","attr":{"durationMicros":73}',
      portColors,
    );
    portColors = { ...portColors, ...color1 };
    const color2 = getColorMapping(
      '[js_test:catalog_cache_refresh_counters] sh12345| d20042| 2022-11-29T12:42:28.889+00:00 I  NETWORK  6496702 [ConfigServerCatalogCacheLoader::getDatabase] "Acquired connection for remote operation and completed writing to wire","attr":{"durationMicros":73}',
      portColors,
    );
    portColors = { ...portColors, ...color2 };
    expect(color1).not.toStrictEqual(color2);
    expect(color1).toStrictEqual({
      color: "#00A35C",
      portOrState: "sh12345| d20041",
    });
    expect(color2).toStrictEqual({
      color: "#5B0000",
      portOrState: "sh12345| d20042",
    });
  });
});

const resmokeLogFiles = [
  {
    input: "resmoke_sample_1.txt",
    output: "parsedResmoke_sample_1.txt",
  },
  {
    input: "resmoke_sample_2.txt",
    output: "parsedResmoke_sample_2.txt",
  },
];
