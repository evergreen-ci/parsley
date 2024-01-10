import { MockedProvider } from "@apollo/client/testing";
import { LogTypes } from "constants/enums";
import { evergreenTaskMock, logkeeperMetadataMock } from "test_data/task";
import { render, screen, waitFor } from "test_utils";
import { EvergreenTaskSubHeader } from "./EvergreenTaskSubHeader";

describe("evergreen task subheader", () => {
  it("should only render task status for evergreen test log", async () => {
    render(
      <MockedProvider mocks={[evergreenTaskMock]}>
        <EvergreenTaskSubHeader
          buildID=""
          execution={0}
          logType={LogTypes.EVERGREEN_TEST_LOGS}
          taskID="spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35"
          testID="JustAFakeTestInALonelyWorld"
        />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("spruce")).toBeInTheDocument();
    });
    // check_codegen task should be failing
    expect(screen.getByText("check_codegen")).toBeInTheDocument();
    expect(screen.getByDataCy("task-status-badge").textContent).toContain(
      "Failed",
    );
    // JustAFakeTestInALonelyWorld test should not be in the document
    expect(screen.queryByText("JustAFakeTestInALonelyWorld")).toBeNull();
    expect(screen.queryByText("test-status-badge")).toBeNull();
  });

  it("should render task and test statuses for resmoke test log", async () => {
    render(
      <MockedProvider mocks={[logkeeperMetadataMock]}>
        <EvergreenTaskSubHeader
          buildID="7e208050e166b1a9025c817b67eee48d"
          execution={0}
          logType={LogTypes.RESMOKE_LOGS}
          taskID="mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24"
          testID="1716e11b4f8a4541c5e2faf70affbfab"
        />
      </MockedProvider>,
    );
    await waitFor(() => {
      expect(screen.getByText("mongodb-mongo-master")).toBeInTheDocument();
    });
    // merge-patch task should be succeeding
    expect(screen.getByText("merge-patch")).toBeInTheDocument();
    expect(screen.getByDataCy("task-status-badge").textContent).toContain(
      "Succeeded",
    );
    // ResmokeTest test should be passing
    expect(screen.getByText("ResmokeTest")).toBeInTheDocument();
    expect(screen.getByDataCy("test-status-badge").textContent).toContain(
      "Pass",
    );
  });
});
