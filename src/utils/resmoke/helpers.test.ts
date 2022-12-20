import {
  getAttributes,
  getConfigServer,
  getContext,
  getJSONString,
  getMessage,
  getPid,
  getPort,
  getResmokeFunction,
  getShellPrefix,
  getState,
  getTimeStamp,
} from "./helpers";

describe("resmoke/helpers", () => {
  describe("getAttributes", () => {
    it("handles empty strings", () => {
      expect(getAttributes("")).toBeUndefined();
    });
    it("returns the attributes", () => {
      let line = `{"t":{"$date":"2021-04-19T21:59:01.816+00:00"},"s":"I",  "c":"NETWORK",  "id":22900,  "ctx":"conn1","msg":"client metadata","attr":{"remote":"something"}}`;
      expect(getAttributes(line)).toBe(`"attr":{"remote":"something"}`);
      line = `{"t":{"$date":"2022-09-08T14:51:21.568+00:00"},"s":"I",  "c":"NETWORK",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"127.0.0.1:52434","uuid":{"uuid":{"$uuid":"38a59b41-765e-40a1-89c1-90e0473d1b27"}},"connectionId":8,"connectionCount":2}}`;
      expect(getAttributes(line)).toBe(
        `"attr":{"remote":"127.0.0.1:52434","uuid":{"uuid":{"$uuid":"38a59b41-765e-40a1-89c1-90e0473d1b27"}},"connectionId":8,"connectionCount":2}`
      );
    });
  });
  describe("getConfigServer", () => {
    it("handles empty strings", () => {
      expect(getConfigServer("")).toBeUndefined();
    });
    it("returns the config server", () => {
      let line = `{"t":{"$date":"2021-04-19T21:59:01.816+00:00"},"s":"I",  "c":"NETWORK",  "id":22900,  "ctx":"conn1","msg":"client metadata","attr":{"remote":"something"}}`;
      expect(getConfigServer(line)).toBe("NETWORK");
      line = `{"t":{"$date":"2022-09-08T14:51:21.568+00:00"},"s":"I",  "c":"COMMAND" }`;
      expect(getConfigServer(line)).toBe("COMMAND");
      line = `[j0:s0:n1] {"t":{"$date":"2022-09-13T16:57:46.852+00:00"},"s":"D2", "c":"REPL_HB",  "id":4615670, "ctx":"ReplCoord-1","msg":"Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}}`;
      expect(getConfigServer(line)).toBe("REPL_HB");
    });
    it("should pad the config server if its value is `-`", () => {
      const line = `{"t":{"$date":"2022-09-08T14:51:21.568+00:00"},"s":"I",  "c":"-" }`;
      expect(getConfigServer(line)).toBe("-");
    });
  });
  describe("getContext", () => {
    it("handles empty strings", () => {
      expect(getContext("")).toBeUndefined();
    });
    it("returns the context", () => {
      let line = `{"t":{"$date":"2021-04-19T21:59:01.816+00:00"},"s":"I",  "c":"NETWORK",  "id":22900,  "ctx":"conn1","msg":"client metadata","attr":{"remote":"something"}}`;
      expect(getContext(line)).toBe("conn1");
      line = `{"t":{"$date":"2022-09-08T14:51:21.568+00:00"},"s":"I",  "c":"COMMAND",  "ctx":"ReplCoord-1" }`;
      expect(getContext(line)).toBe("ReplCoord-1");
      line = `{"t":{"$date":"2022-09-08T14:51:21.568+00:00"},"s":"I",  "c":"-",  "ctx":"-" }`;
      expect(getContext(line)).toBe("-");
    });
  });
  describe("getPid", () => {
    it("handles empty strings", () => {
      expect(getPid("")).toBeUndefined();
    });
    it("returns the id", () => {
      let line = `{"t":{"$date":"2021-04-19T21:59:01.816+00:00"},"s":"I",  "c":"NETWORK",  "id":22900,  "ctx":"conn1","msg":"client metadata","attr":{"remote":"something"}}`;
      expect(getPid(line)).toBe("22900");
      line = `{"t":{"$date":"2022-09-08T14:51:21.568+00:00"},"s":"I",  "c":"COMMAND",  "id":22943,   "ctx":"listener","msg":"Connection accepted","attr":{"remote":"something"}}`;
      expect(getPid(line)).toBe("22943");
    });
  });
  describe("getJSONString", () => {
    const complexJSON = `[j3] {"t":{"$date":"2022-09-08T14:51:20.907+00:00"},"s":"I",  "c":"-",        "id":20883,   "ctx":"conn1","msg":"Interrupted operation as its client disconnected","attr":{"opId":9}}`;
    it("handles empty strings", () => {
      expect(getJSONString("")).toBeUndefined();
    });
    it("handles strings without json", () => {
      expect(getJSONString("hello")).toBeUndefined();
    });
    it("handles strings with simple json", () => {
      const json = JSON.stringify({ a: 1, b: 2, c: 3 });
      expect(getJSONString(json)).toBe(json);
    });
    it("handles strings with complex json", () => {
      expect(getJSONString(complexJSON)).toBe(
        `{"t":{"$date":"2022-09-08T14:51:20.907+00:00"},"s":"I",  "c":"-",        "id":20883,   "ctx":"conn1","msg":"Interrupted operation as its client disconnected","attr":{"opId":9}}`
      );
    });

    it("outputs valid json", () => {
      const json = getJSONString(complexJSON);
      expect(json).toBeDefined();
      // type assert this as a string to satisfy typescript
      expect(() => JSON.parse(json as string)).not.toThrow();
    });
    it("handles strings with broken json", () => {
      expect(getJSONString("hello {")).toBeUndefined();
      expect(getJSONString("hello {a: { b: 1 }")).toBeUndefined();
    });
  });
  describe("getMessage", () => {
    it("handles empty strings", () => {
      expect(getMessage("")).toBeUndefined();
    });
    it("handles strings in complex json", () => {
      expect(
        getMessage(
          '{"t":{"$date":"2022-09-08T14:51:20.907+00:00"},"s":"I",  "c":"-",        "id":20883,   "ctx":"conn1","msg":"Interrupted operation as its client disconnected","attr":{"opId":9}}'
        )
      ).toBe("Interrupted operation as its client disconnected");
    });
    it("handles strings with escaped characters", () => {
      expect(
        getMessage(
          // This test tests a string with escaped characters, so we need to disable the eslint rule
          // eslint-disable-next-line no-useless-escape
          `[j1] {"t":{"$date":"2022-12-15T14:27:56.528+00:00"},"s":"I",  "c":"-",        "id":0,       "ctx":"conn31","msg":"XOXOXO command is setting shard role { isMaster: 1, client: { application: { name: \\\"MongoDB Shell\\\" }, driver: { name: \\"MongoDB Internal Client\\", version: \\"6.3.0-alpha-520-g20913e4-patch-639b27313627e07bda0ca7db\\" }, os: { type: \\"Linux\\", name: \\"Red Hat Enterprise Linux release 8.0 (Ootpa)\\", architecture: \\"x86_64\\", version: \\"Kernel 4.18.0-80.1.2.el8_0.x86_64\\" } }, $db: \\"admin\\" }"}`
        )
      ).toBe(
        `XOXOXO command is setting shard role { isMaster: 1, client: { application: { name: \\"MongoDB Shell\\" }, driver: { name: \\"MongoDB Internal Client\\", version: \\"6.3.0-alpha-520-g20913e4-patch-639b27313627e07bda0ca7db\\" }, os: { type: \\"Linux\\", name: \\"Red Hat Enterprise Linux release 8.0 (Ootpa)\\", architecture: \\"x86_64\\", version: \\"Kernel 4.18.0-80.1.2.el8_0.x86_64\\" } }, $db: \\"admin\\" }`
      );
    });
  });
  describe("getPort", () => {
    it("handles empty strings", () => {
      expect(getPort("")).toBeUndefined();
    });
    it("handles strings without port", () => {
      expect(getPort("hello")).toBeUndefined();
    });
    it("handles strings with port", () => {
      expect(
        getPort(
          `[js_test:startup_recovery_commit_transaction_before_stable_timestamp] d20540| {"t":{"$date":"2022-09-06T21:21:32.384Z"},"s":"I",  "c":"CONTROL",  "id":5760901, "ctx":"thread1","msg":"Applied --setParameter options","attr":{"serverParameters":{"backtraceLogFile":{"default":"","value":"\\data\\db\\job2\\mongorunner/gc24ttpdzwpod0v4pib6r1662499291729.stacktrace"},"coordinateCommitReturnImmediatelyAfterPersistingDecision":{"default":false,"value":false},"disableLogicalSessionCacheRefresh":{"default":false,"value":true},"enableDefaultWriteConcernUpdatesForInitiate":{"default":false,"value":true},"enableReconfigRollbackCommittedWritesCheck":{"default":true,"value":false},"enableTestCommands":{"default":false,"value":true},"logComponentVerbosity":{"default":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":-1},"heartbeats":{"verbosity":-1},"initialSync":{"verbosity":-1},"rollback":{"verbosity":-1}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":-1},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":-1},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":-1},"tenantMigration":{"verbosity":-1},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}},"value":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":4},"heartbeats":{"verbosity":2},"initialSync":{"verbosity":2},"rollback":{"verbosity":2}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":2},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":2},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":4},"tenantMigration":{"verbosity":4},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}}},"minNumChunksForSessionsCollection":{"default":1024,"value":1},"numInitialSyncConnectAttempts":{"default":10,"value":60},"oplogApplicationEnforcesSteadyStateConstraints":{"default":false,"value":true},"orphanCleanupDelaySecs":{"default":900,"value":1},"reshardingMinimumOperationDurationMillis":{"default":300000,"value":5000},"shutdownTimeoutMillisForSignaledShutdown":{"default":15000,"value":100},"testingDiagnosticsEnabled":{"default":false,"value":true},"transactionLifetimeLimitSeconds":{"default":60,"value":86400},"writePeriodicNoops":{"default":true,"value":false}}}}`
        )
      ).toBe("d20540");
    });
  });
  describe("getResmokeFunction", () => {
    it("handles empty strings", () => {
      expect(getResmokeFunction("")).toBeUndefined();
    });
    it("handles strings without resmoke", () => {
      expect(getResmokeFunction("hello")).toBeUndefined();
    });
    it("returns resmoke function on a normal line", () => {
      expect(getResmokeFunction("[j1] hello")).toBe("[j1]");
      expect(getResmokeFunction("[j2] hello")).toBe("[j2]");
      expect(getResmokeFunction("[j0:s0:n2] hello")).toBe("[j0:s0:n2]");
    });
    it("returns a resmoke function correctly", () => {
      expect(getResmokeFunction(`[js_test:fle_agg] `)).toBe(
        `[js_test:fle_agg]`
      );
      expect(getResmokeFunction(`[js_test:fle_agg] sh21666| `)).toBe(
        "[js_test:fle_agg]"
      );
    });
  });
  describe("getShellPrefix", () => {
    it("handles empty strings", () => {
      expect(getShellPrefix("")).toBeUndefined();
    });
    it("handles strings without shell", () => {
      expect(getShellPrefix("hello")).toBeUndefined();
    });
    it("correctly returns shell prefix", () => {
      expect(
        getShellPrefix(
          `{"t":{"$date":"2022-09-06T21:21:32.384Z"},"s":"I",  "c":"CONTROL",  "id":5760901, "ctx":"thread1","msg":"Applied --setParameter options","attr":{"serverParameters":{"backtraceLogFile":{"default":"","value":"\\data\\db\\job2\\mongorunner/gc24ttpdzwpod0v4pib6r1662499291729.stacktrace"},"coordinateCommitReturnImmediatelyAfterPersistingDecision":{"default":false,"value":false},"disableLogicalSessionCacheRefresh":{"default":false,"value":true},"enableDefaultWriteConcernUpdatesForInitiate":{"default":false,"value":true},"enableReconfigRollbackCommittedWritesCheck":{"default":true,"value":false},"enableTestCommands":{"default":false,"value":true},"logComponentVerbosity":{"default":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":-1},"heartbeats":{"verbosity":-1},"initialSync":{"verbosity":-1},"rollback":{"verbosity":-1}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":-1},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":-1},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":-1},"tenantMigration":{"verbosity":-1},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}},"value":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":4},"heartbeats":{"verbosity":2},"initialSync":{"verbosity":2},"rollback":{"verbosity":2}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":2},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":2},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":4},"tenantMigration":{"verbosity":4},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}}},"minNumChunksForSessionsCollection":{"default":1024,"value":1},"numInitialSyncConnectAttempts":{"default":10,"value":60},"oplogApplicationEnforcesSteadyStateConstraints":{"default":false,"value":true},"orphanCleanupDelaySecs":{"default":900,"value":1},"reshardingMinimumOperationDurationMillis":{"default":300000,"value":5000},"shutdownTimeoutMillisForSignaledShutdown":{"default":15000,"value":100},"testingDiagnosticsEnabled":{"default":false,"value":true},"transactionLifetimeLimitSeconds":{"default":60,"value":86400},"writePeriodicNoops":{"default":true,"value":false}}}}`
        )
      ).toBe("I");
      expect(
        getShellPrefix(
          `{"t":{"$date":"2022-09-13T16:57:46.853+00:00"},"s":"D2", "c":"REPL_HB",  "id":4615670, "ctx":"ReplCoord-7","msg":"Sending heartbeat","attr":{"requestId":3706,"target":"localhost:20005","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}}`
        )
      ).toBe("D2");
    });
  });
  describe("getTimeStamp", () => {
    it("handles empty strings", () => {
      expect(getTimeStamp("")).toBeUndefined();
    });
    it("handles strings without timestamp", () => {
      expect(getTimeStamp("hello")).toBeUndefined();
    });
    it("handles strings with timestamp", () => {
      expect(
        getTimeStamp(
          `{"t":{"$date":"2022-09-06T21:21:32.384Z"},"s":"I",  "c":"CONTROL",  "id":5760901, "ctx":"thread1","msg":"Applied --setParameter options","attr":{"serverParameters":{"backtraceLogFile":{"default":"","value":"\\data\\db\\job2\\mongorunner/gc24ttpdzwpod0v4pib6r1662499291729.stacktrace"},"coordinateCommitReturnImmediatelyAfterPersistingDecision":{"default":false,"value":false},"disableLogicalSessionCacheRefresh":{"default":false,"value":true},"enableDefaultWriteConcernUpdatesForInitiate":{"default":false,"value":true},"enableReconfigRollbackCommittedWritesCheck":{"default":true,"value":false},"enableTestCommands":{"default":false,"value":true},"logComponentVerbosity":{"default":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":-1},"heartbeats":{"verbosity":-1},"initialSync":{"verbosity":-1},"rollback":{"verbosity":-1}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":-1},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":-1},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":-1},"tenantMigration":{"verbosity":-1},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}},"value":{"verbosity":0,"accessControl":{"verbosity":-1},"assert":{"verbosity":-1},"command":{"verbosity":-1},"control":{"verbosity":-1},"executor":{"verbosity":-1},"geo":{"verbosity":-1},"globalIndex":{"verbosity":-1},"index":{"verbosity":-1},"network":{"verbosity":-1,"asio":{"verbosity":-1},"bridge":{"verbosity":-1},"connectionPool":{"verbosity":-1}},"processHealth":{"verbosity":-1},"query":{"verbosity":-1},"replication":{"verbosity":-1,"election":{"verbosity":4},"heartbeats":{"verbosity":2},"initialSync":{"verbosity":2},"rollback":{"verbosity":2}},"sharding":{"verbosity":-1,"rangeDeleter":{"verbosity":-1},"shardingCatalogRefresh":{"verbosity":-1},"migration":{"verbosity":2},"reshard":{"verbosity":-1},"migrationPerf":{"verbosity":-1}},"storage":{"verbosity":-1,"recovery":{"verbosity":2},"journal":{"verbosity":-1},"wt":{"verbosity":-1,"wtBackup":{"verbosity":-1},"wtCheckpoint":{"verbosity":-1},"wtCompact":{"verbosity":-1},"wtEviction":{"verbosity":-1},"wtHS":{"verbosity":-1},"wtRecovery":{"verbosity":-1},"wtRTS":{"verbosity":-1},"wtSalvage":{"verbosity":-1},"wtTiered":{"verbosity":-1},"wtTimestamp":{"verbosity":-1},"wtTransaction":{"verbosity":-1},"wtVerify":{"verbosity":-1},"wtWriteLog":{"verbosity":-1}}},"write":{"verbosity":-1},"ftdc":{"verbosity":-1},"tracking":{"verbosity":-1},"transaction":{"verbosity":4},"tenantMigration":{"verbosity":4},"test":{"verbosity":-1},"resourceConsumption":{"verbosity":-1}}},"minNumChunksForSessionsCollection":{"default":1024,"value":1},"numInitialSyncConnectAttempts":{"default":10,"value":60},"oplogApplicationEnforcesSteadyStateConstraints":{"default":false,"value":true},"orphanCleanupDelaySecs":{"default":900,"value":1},"reshardingMinimumOperationDurationMillis":{"default":300000,"value":5000},"shutdownTimeoutMillisForSignaledShutdown":{"default":15000,"value":100},"testingDiagnosticsEnabled":{"default":false,"value":true},"transactionLifetimeLimitSeconds":{"default":60,"value":86400},"writePeriodicNoops":{"default":true,"value":false}}}}`
        )
      ).toBe("2022-09-06T21:21:32.384Z");
      expect(
        getTimeStamp(`{"t":{"$date":"2022-09-13T16:57:46.852+00:00"}`)
      ).toBe("2022-09-13T16:57:46.852+00:00");
    });
    it("handles strings with offset timestamps", () => {
      expect(
        getTimeStamp(`{"t":{"$date":"2022-09-13T16:57:46.852+00:00"}`)
      ).toBe("2022-09-13T16:57:46.852+00:00");
      expect(
        getTimeStamp(`{"t":{"$date":"2022-09-13T16:57:46.852-00:00"}`)
      ).toBe("2022-09-13T16:57:46.852-00:00");
    });
  });
  describe("getState", () => {
    it("correctly returns state", () => {
      const line = `[j0:s0:n1] {"t":{"$date":"2022-09-13T16:57:46.852+00:00"},"s":"D2", "c":"REPL_HB",  "id":4615670, "ctx":"ReplCoord-1","msg":"Sending heartbeat","attr":{"requestId":3705,"target":"localhost:20003","heartbeatObj":{"replSetHeartbeat":"shard-rs0","configVersion":5,"configTerm":3,"hbv":1,"from":"localhost:20004","fromId":1,"term":3,"primaryId":1}}}`;
      expect(getState(line)).toBe(":s0:n1]");
    });
  });
});
