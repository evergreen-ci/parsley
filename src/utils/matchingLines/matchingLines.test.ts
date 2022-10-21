import { CaseSensitivity, FilterLogic, MatchType } from "constants/enums";
import { constructRegexToMatch, getMatchingLines, matchesFilters } from ".";

/**
 * Helper test function for constructing a Filter object.
 */
const makeFilter = (filter: {
  name: string;
  caseSensitive?: CaseSensitivity;
  matchType?: MatchType;
  visible?: boolean;
}) => {
  const {
    name,
    caseSensitive = CaseSensitivity.Insensitive,
    matchType = MatchType.Exact,
    visible = true,
  } = filter;

  return {
    caseSensitive,
    matchType,
    name,
    visible,
  };
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
];

describe("getMatchingLines", () => {
  it("returns undefined if there are no filters", () => {
    expect(getMatchingLines(logLines, [], FilterLogic.And)).toBeUndefined();
  });

  it("returns undefined if there are no visible filters", () => {
    const filter1 = makeFilter({ name: "starting", visible: false });
    const filter2 = makeFilter({ name: "mongod", visible: false });
    expect(
      getMatchingLines(logLines, [filter1, filter2], FilterLogic.And)
    ).toBeUndefined();
  });

  it("returns an empty set if there are no lines that satisfy the filter", () => {
    const filter1 = makeFilter({
      name: "starting",
      caseSensitive: CaseSensitivity.Sensitive,
    });
    const filter2 = makeFilter({ name: "mongod" });
    expect(
      getMatchingLines(logLines, [filter1, filter2], FilterLogic.And)
    ).toStrictEqual(new Set([]));
  });

  it("returns correct set of numbers given applied filters", () => {
    const filter1 = makeFilter({
      name: "starting",
    });
    const filter2 = makeFilter({ name: "mongod" });
    expect(
      getMatchingLines(logLines, [filter1, filter2], FilterLogic.And)
    ).toStrictEqual(new Set([1, 4, 7]));
  });
});

describe("constructRegexToMatch", () => {
  it("properly constructs case sensitive filters", () => {
    const filter1 = makeFilter({
      name: "filter1",
      caseSensitive: CaseSensitivity.Sensitive,
    });
    const filter2 = makeFilter({ name: "filter2" });
    expect(constructRegexToMatch([filter1, filter2])).toStrictEqual([
      { regex: /filter1/, isMatch: true },
      { regex: /filter2/i, isMatch: true },
    ]);
  });

  it("properly constructs inverse match filters", () => {
    const filter1 = makeFilter({
      name: "filter1",
      matchType: MatchType.Inverse,
    });
    const filter2 = makeFilter({ name: "filter2" });
    expect(constructRegexToMatch([filter1, filter2])).toStrictEqual([
      { regex: /filter1/i, isMatch: false },
      { regex: /filter2/i, isMatch: true },
    ]);
  });
});

describe("matchesFilters", () => {
  const logLine =
    "[2022/03/02 17:02:01.610] 04a52b2 EVG-15959 Fix rerender method in test utils (#1118)";

  describe("single filter", () => {
    describe("case sensitivity", () => {
      it("works with case sensitivity off", () => {
        expect(
          matchesFilters(
            logLine,
            [{ regex: /fix/i, isMatch: true }],
            FilterLogic.And
          )
        ).toBe(true);
      });
      it("works with case sensitivity on", () => {
        expect(
          matchesFilters(
            logLine,
            [{ regex: /fix/, isMatch: true }],
            FilterLogic.And
          )
        ).toBe(false);
      });
    });

    describe("match type", () => {
      it("works with match type exact", () => {
        expect(
          matchesFilters(
            logLine,
            [{ regex: /test/, isMatch: true }],
            FilterLogic.And
          )
        ).toBe(true);
      });
      it("works with match type inverse", () => {
        expect(
          matchesFilters(
            logLine,
            [{ regex: /test/, isMatch: false }],
            FilterLogic.And
          )
        ).toBe(false);
      });
    });
  });

  describe("multiple filters", () => {
    describe("filter logic (and)", () => {
      it("should work for condition A and B", () => {
        expect(
          matchesFilters(
            logLine,
            [
              { regex: /rerender/, isMatch: true },
              { regex: /test/, isMatch: true },
            ],
            FilterLogic.And
          )
        ).toBe(true);
      });
      it("should work for condition !A and B / A and !B", () => {
        expect(
          matchesFilters(
            logLine,
            [
              { regex: /rerender/, isMatch: true },
              { regex: /test/, isMatch: false },
            ],
            FilterLogic.And
          )
        ).toBe(false);
      });
      it("should work for condition !A and !B", () => {
        expect(
          matchesFilters(
            logLine,
            [
              { regex: /rerender/, isMatch: false },
              { regex: /test/, isMatch: false },
            ],
            FilterLogic.And
          )
        ).toBe(false);
      });
    });

    describe("filter logic (or)", () => {
      it("should work for condition A or B", () => {
        expect(
          matchesFilters(
            logLine,
            [
              { regex: /rerender/, isMatch: true },
              { regex: /test/, isMatch: true },
            ],
            FilterLogic.Or
          )
        ).toBe(true);
      });
      it("should work for condition !A or B / A or !B", () => {
        expect(
          matchesFilters(
            logLine,
            [
              { regex: /rerender/, isMatch: true },
              { regex: /test/, isMatch: false },
            ],
            FilterLogic.Or
          )
        ).toBe(true);
      });
      it("should work for condition !A or !B", () => {
        expect(
          matchesFilters(
            logLine,
            [
              { regex: /rerender/, isMatch: false },
              { regex: /test/, isMatch: false },
            ],
            FilterLogic.Or
          )
        ).toBe(false);
      });
    });
  });
});
