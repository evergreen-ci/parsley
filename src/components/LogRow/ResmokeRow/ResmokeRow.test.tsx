import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch, screen } from "test_utils";
import ResmokeRow from ".";

const wrapper = (logs: string[]) => {
  const provider = ({ children }: { children: React.ReactNode }) => (
    <LogContextProvider initialLogLines={logs}>{children}</LogContextProvider>
  );
  return provider;
};

describe("resmokeRow", () => {
  it("does not render a resmoke row if getLine returns undefined", () => {
    renderWithRouterMatch(
      <ResmokeRow
        {...resmokeProps}
        lineNumber={99}
        listRowProps={listRowProps}
      />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.queryByDataCy("resmoke-row")).toBeNull();
  });
  it("renders a resmoke row if getLine returns an empty string", () => {
    renderWithRouterMatch(
      <ResmokeRow
        {...resmokeProps}
        lineNumber={9}
        listRowProps={listRowProps}
      />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByDataCy("resmoke-row")).toBeInTheDocument();
  });
  it("displays a log line and its text for a given index", () => {
    renderWithRouterMatch(
      <ResmokeRow
        {...resmokeProps}
        lineNumber={0}
        listRowProps={listRowProps}
      />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText(logLines[0])).toBeInTheDocument();
    renderWithRouterMatch(
      <ResmokeRow
        {...resmokeProps}
        lineNumber={1}
        listRowProps={{ ...listRowProps, index: 1 }}
      />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.getByText(logLines[1])).toBeInTheDocument();
  });
  it("should apply syntax highlighting to resmoke lines if they have a color", () => {
    const getResmokeLineColor = jest.fn().mockReturnValue("#ff0000");
    renderWithRouterMatch(
      <ResmokeRow
        {...resmokeProps}
        getResmokeLineColor={getResmokeLineColor}
        lineNumber={7}
        listRowProps={{ ...listRowProps, index: 7 }}
      />,
      {
        wrapper: wrapper(logLines),
      }
    );
    expect(getResmokeLineColor).toHaveBeenCalledWith(7);
    expect(screen.getByDataCy("resmoke-row")).toHaveStyle("color: #ff0000");
  });
  it("should highlight matching text if it is within range", () => {
    renderWithRouterMatch(
      <ResmokeRow
        {...resmokeProps}
        lineNumber={7}
        listRowProps={{ ...listRowProps, index: 7 }}
        searchTerm={/mongod/i}
      />,
      {
        route: "?lower=0&upper=8",
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.queryByDataCy("resmoke-row")).toHaveTextContent("mongod");
    expect(screen.getByDataCy("highlight")).toHaveTextContent("mongod");
  });
  it("should not highlight matching text if it is outside of range", () => {
    renderWithRouterMatch(
      <ResmokeRow
        {...resmokeProps}
        lineNumber={7}
        listRowProps={{ ...listRowProps, index: 7 }}
        searchTerm={/mongod/i}
      />,
      {
        route: "?lower=0&upper=6",
        wrapper: wrapper(logLines),
      }
    );
    expect(screen.queryByDataCy("resmoke-row")).toHaveTextContent("mongod");
    expect(screen.queryByDataCy("highlight")).not.toBeInTheDocument();
  });
});

const logLines = [
  "[js_test:job0_fixture_setup_0] Starting the setup of ReplicaSetFixture (Job #0).",
  "[j0:prim] Starting mongod on port 20000...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin mongod-6.0 --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node0/2c65edd254db4835911f796d7b260455.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node0 --port=20000 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:prim] mongod started on port 20000 with pid 30678.",
  "[j0:sec0] Starting mongod on port 20001...",
  `PATH=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src:/data/multiversion:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin:/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/venv/bin:/home/ec2-user/.local/bin:/home/ec2-user/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/opt/node/bin:/opt/node/bin:/data/multiversion INSTALL_DIR=/data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin /data/mci/f99ab8d06437c8a83d4c7356bcd6d965/src/dist-test/bin/mongod --setParameter enableTestCommands=1 --setParameter backtraceLogFile=/data/db/job0/resmoke/node1/a611b65dce484b7d81b294a7941a2dac.stacktrace --setParameter internalQueryFrameworkControl=forceClassicEngine --setParameter 'logComponentVerbosity={'"'"'replication'"'"': {'"'"'election'"'"': 4, '"'"'heartbeats'"'"': 2, '"'"'initialSync'"'"': 2, '"'"'rollback'"'"': 2}, '"'"'sharding'"'"': {'"'"'migration'"'"': 2}, '"'"'storage'"'"': {'"'"'recovery'"'"': 2}, '"'"'transaction'"'"': 4, '"'"'tenantMigration'"'"': 4}' --setParameter disableLogicalSessionCacheRefresh=true --setParameter coordinateCommitReturnImmediatelyAfterPersistingDecision=false --setParameter transactionLifetimeLimitSeconds=86400 --setParameter maxIndexBuildDrainBatchSize=10 --setParameter writePeriodicNoops=false --setParameter shutdownTimeoutMillisForSignaledShutdown=100 --setParameter testingDiagnosticsEnabled=true --oplogSize=511 --replSet=rs --dbpath=/data/db/job0/resmoke/node1 --port=20001 --enableMajorityReadConcern=True --storageEngine=wiredTiger --wiredTigerCacheSizeGB=1`,
  "[j0:sec0] mongod started on port 20001 with pid 30681.",
  "[j0:sec1] Starting mongod on port 20002...",
  `[j0:s0:n0] | 2022-09-21T12:50:19.899+00:00 D2 REPL_HB  4615618 [ReplCoord-0] "Scheduling heartbeat","attr":{"target":"localhost:20004","when":{"$date":"2022-09-21T12:50:21.899Z"}}`,
  "",
];

const listRowProps = {
  key: logLines[0],
  columnIndex: 0,
  index: 0,
  isScrolling: false,
  isVisible: true,
  parent: {} as any,
  style: {},
};

const resmokeProps = {
  getLine: (index: number) => logLines[index],
  getResmokeLineColor: jest.fn(),
  resetRowHeightAtIndex: jest.fn(),
  scrollToLine: jest.fn(),

  prettyPrint: false,
  range: { lowerRange: 0 },
  wrap: false,
};
