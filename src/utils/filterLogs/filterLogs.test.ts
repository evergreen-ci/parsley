import filterLogs from ".";

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

describe("filterLogs", () => {
  it("should return the log lines as is if matching lines is undefined", () => {
    expect(
      filterLogs({
        logLines,
        matchingLines: undefined,
        bookmarks: [],
        selectedLine: undefined,
        expandedLines: [],
        expandableRows: true,
      })
    ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("should hide collapsed rows if expandableRows is turned off", () => {
    expect(
      filterLogs({
        logLines,
        matchingLines: new Set([1, 2, 3]),
        bookmarks: [],
        selectedLine: undefined,
        expandedLines: [],
        expandableRows: false,
      })
    ).toStrictEqual([1, 2, 3]);
  });

  it("should collapse all of the log lines if there are no matching lines", () => {
    expect(
      filterLogs({
        logLines,
        matchingLines: new Set([]),
        bookmarks: [],
        selectedLine: undefined,
        expandedLines: [],
        expandableRows: true,
      })
    ).toStrictEqual([[0, 1, 2, 3, 4, 5, 6, 7]]);
  });

  describe("with matching lines", () => {
    it("should not collapse bookmarks", () => {
      expect(
        filterLogs({
          logLines,
          matchingLines: new Set([1]),
          bookmarks: [7],
          selectedLine: undefined,
          expandedLines: [],
          expandableRows: true,
        })
      ).toStrictEqual([[0], 1, [2, 3, 4, 5, 6], 7]);
    });

    it("should not collapse selected lines", () => {
      expect(
        filterLogs({
          logLines,
          matchingLines: new Set([1]),
          bookmarks: [],
          selectedLine: 7,
          expandedLines: [],
          expandableRows: true,
        })
      ).toStrictEqual([[0], 1, [2, 3, 4, 5, 6], 7]);
    });

    it("should not collapse expanded lines", () => {
      expect(
        filterLogs({
          logLines,
          matchingLines: new Set([1]),
          bookmarks: [],
          selectedLine: undefined,
          expandedLines: [[4, 6]],
          expandableRows: true,
        })
      ).toStrictEqual([[0], 1, [2, 3], 4, 5, 6, [7]]);
    });
  });
});
