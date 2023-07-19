import { act } from "@testing-library/react";
import { LogTypes } from "constants/enums";
import { getResmokeLogURL } from "constants/logURLTemplates";
import { LogContextProvider, useLogContext } from "context/LogContext";
import { mockUseToastContext } from "context/toast/__mocks__";
import { renderWithRouterMatch as render, screen } from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import CLIInstructions from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("cliInstructions", () => {
  beforeEach(() => {
    mockUseToastContext();
  });
  afterEach(() => {
    jest.clearAllMocks();
  });
  it("should not exist if no task id or build id is provided", () => {
    const { Component } = renderComponentWithHook(
      useLogContext,
      <CLIInstructions />
    );
    render(<Component />, { wrapper });
    expect(screen.queryByDataCy("cli-instructions")).not.toBeInTheDocument();
  });
  it("should render the task log download command with the appropriate tags if the log is a task log", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CLIInstructions />
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        taskID: "taskId",
        execution: "0",
        origin: "task",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
      });
    });
    let taskDownloadCommand =
      "evergreen buildlogger fetch --task_id taskId --execution 0 --tags task_log";
    expect(screen.getByText(taskDownloadCommand)).toBeInTheDocument();
    act(() => {
      hook.current.setLogMetadata({
        taskID: "taskId",
        execution: "0",
        origin: "agent",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
      });
    });
    taskDownloadCommand =
      "evergreen buildlogger fetch --task_id taskId --execution 0 --tags agent_log";
    expect(screen.getByText(taskDownloadCommand)).toBeInTheDocument();
    act(() => {
      hook.current.setLogMetadata({
        taskID: "taskId",
        execution: "0",
        origin: "all",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
      });
    });
    taskDownloadCommand =
      "evergreen buildlogger fetch --task_id taskId --execution 0";
    expect(screen.getByText(taskDownloadCommand)).toBeInTheDocument();
  });
  it("should render the test log download command if the log is a test log", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CLIInstructions />
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        taskID: "taskId",
        execution: "0",
        testID: "testId",
        logType: LogTypes.EVERGREEN_TEST_LOGS,
      });
    });
    const testDownloadCommand =
      "evergreen buildlogger fetch --task_id taskId --execution 0 --test_name testId";
    expect(screen.getByText(testDownloadCommand)).toBeInTheDocument();
  });
  it("should render the logkeeper download command if the log is a resmoke log", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CLIInstructions />
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        taskID: "taskId",
        execution: "0",
        testID: "testId",
        buildID: "buildId",
        logType: LogTypes.RESMOKE_LOGS,
      });
    });
    const logkeeperDownloadCommand = `curl "${getResmokeLogURL("buildId", {
      testID: "testId",
      raw: true,
    })}"`;
    expect(screen.getByText(logkeeperDownloadCommand)).toBeInTheDocument();
  });
});
