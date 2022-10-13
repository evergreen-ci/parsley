import { FilterLogic } from "constants/enums";
import { filterLogs, matchesFilter } from ".";

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

describe("matchesFilter", () => {
  it("works with AND condition (case insensitive)", () => {
    expect(
      matchesFilter(logLines[7], ["starting", "port"], FilterLogic.And)
    ).toBe(true);
    expect(
      matchesFilter(logLines[7], ["running", "port"], FilterLogic.And)
    ).toBe(false);
  });

  it("works with OR condition (case insensitive)", () => {
    expect(
      matchesFilter(logLines[7], ["starting", "port"], FilterLogic.Or)
    ).toBe(true);
    expect(
      matchesFilter(logLines[7], ["running", "port"], FilterLogic.Or)
    ).toBe(true);
  });
});

describe("filterLogs", () => {
  it("should not apply any processing if there are no filters applied", () => {
    expect(
      filterLogs({
        logLines,
        filters: [],
        bookmarks: [],
        selectedLine: undefined,
        expandedLines: [],
        filterLogic: FilterLogic.And,
        expandableRows: true,
      })
    ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  it("should not apply any processing if expandable rows are not enabled", () => {
    expect(
      filterLogs({
        logLines,
        filters: ["starting"],
        bookmarks: [],
        selectedLine: undefined,
        expandedLines: [],
        filterLogic: FilterLogic.And,
        expandableRows: false,
      })
    ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7]);
  });

  describe("filtering (AND)", () => {
    it("works with only filters", () => {
      expect(
        filterLogs({
          logLines,
          filters: ["starting", "port"],
          bookmarks: [],
          selectedLine: undefined,
          expandedLines: [],
          filterLogic: FilterLogic.And,
          expandableRows: true,
        })
      ).toStrictEqual([[0], 1, [2, 3], 4, [5, 6], 7]);
    });

    it("works with filters and expandedLines", () => {
      expect(
        filterLogs({
          logLines,
          filters: ["starting", "port"],
          bookmarks: [],
          selectedLine: undefined,
          expandedLines: [[0, 4]],
          filterLogic: FilterLogic.And,
          expandableRows: true,
        })
      ).toStrictEqual([0, 1, 2, 3, 4, [5, 6], 7]);
    });

    it("works with filters and bookmarks", () => {
      expect(
        filterLogs({
          logLines,
          filters: ["starting", "port"],
          bookmarks: [2],
          selectedLine: undefined,
          expandedLines: [],
          filterLogic: FilterLogic.And,
          expandableRows: true,
        })
      ).toStrictEqual([[0], 1, 2, [3], 4, [5, 6], 7]);
    });

    it("works with filters, bookmarks, and selected line", () => {
      expect(
        filterLogs({
          logLines,
          filters: ["starting", "port"],
          bookmarks: [2],
          selectedLine: 0,
          expandedLines: [],
          filterLogic: FilterLogic.And,
          expandableRows: true,
        })
      ).toStrictEqual([0, 1, 2, [3], 4, [5, 6], 7]);
    });
  });

  describe("filtering (OR)", () => {
    it("works with only filters", () => {
      expect(
        filterLogs({
          logLines,
          filters: ["starting", "pid"],
          bookmarks: [],
          selectedLine: undefined,
          expandedLines: [],
          filterLogic: FilterLogic.Or,
          expandableRows: true,
        })
      ).toStrictEqual([0, 1, [2], 3, 4, [5], 6, 7]);
    });

    it("works with filters and expanded lines", () => {
      expect(
        filterLogs({
          logLines,
          filters: ["starting", "pid"],
          bookmarks: [],
          selectedLine: undefined,
          expandedLines: [[0, 4]],
          filterLogic: FilterLogic.Or,
          expandableRows: true,
        })
      ).toStrictEqual([0, 1, 2, 3, 4, [5], 6, 7]);
    });

    it("works with filters and bookmarks", () => {
      expect(
        filterLogs({
          logLines,
          filters: ["starting", "pid"],
          bookmarks: [5],
          selectedLine: undefined,
          expandedLines: [],
          filterLogic: FilterLogic.Or,
          expandableRows: true,
        })
      ).toStrictEqual([0, 1, [2], 3, 4, 5, 6, 7]);
    });

    it("works with filters, bookmarks, and selectedLine", () => {
      expect(
        filterLogs({
          logLines,
          filters: ["starting", "pid"],
          bookmarks: [5],
          selectedLine: 2,
          expandedLines: [],
          filterLogic: FilterLogic.Or,
          expandableRows: true,
        })
      ).toStrictEqual([0, 1, 2, 3, 4, 5, 6, 7]);
    });
  });
});
