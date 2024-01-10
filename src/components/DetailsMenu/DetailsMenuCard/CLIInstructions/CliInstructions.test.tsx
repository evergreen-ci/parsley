import { act } from "@testing-library/react";
import { LogTypes } from "constants/enums";
import { getResmokeLogURL } from "constants/logURLTemplates";
import { LogContextProvider, useLogContext } from "context/LogContext";
import { renderWithRouterMatch as render, screen } from "test_utils";
import { renderComponentWithHook } from "test_utils/TestHooks";
import CLIInstructions from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("cliInstructions", () => {
  it("should not exist if no task id or build id is provided", () => {
    const { Component } = renderComponentWithHook(
      useLogContext,
      <CLIInstructions />,
    );
    render(<Component />, { wrapper });
    expect(screen.queryByDataCy("cli-instructions")).not.toBeInTheDocument();
  });
  it("should render the task log download command with the appropriate tags if the log is a task log", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CLIInstructions />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        execution: "0",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        origin: "task",
        taskID: "taskId",
      });
    });
    let taskDownloadCommand =
      "evergreen buildlogger fetch --task_id taskId --execution 0 --tags task_log";
    expect(screen.getByText(taskDownloadCommand)).toBeInTheDocument();
    act(() => {
      hook.current.setLogMetadata({
        execution: "0",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        origin: "agent",
        taskID: "taskId",
      });
    });
    taskDownloadCommand =
      "evergreen buildlogger fetch --task_id taskId --execution 0 --tags agent_log";
    expect(screen.getByText(taskDownloadCommand)).toBeInTheDocument();
    act(() => {
      hook.current.setLogMetadata({
        execution: "0",
        logType: LogTypes.EVERGREEN_TASK_LOGS,
        origin: "all",
        taskID: "taskId",
      });
    });
    taskDownloadCommand =
      "evergreen buildlogger fetch --task_id taskId --execution 0";
    expect(screen.getByText(taskDownloadCommand)).toBeInTheDocument();
  });
  it("should render the test log download command if the log is a test log", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CLIInstructions />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        execution: "0",
        logType: LogTypes.EVERGREEN_TEST_LOGS,
        taskID: "taskId",
        testID: "testId",
      });
    });
    const testDownloadCommand =
      "evergreen buildlogger fetch --task_id taskId --execution 0 --test_name testId";
    expect(screen.getByText(testDownloadCommand)).toBeInTheDocument();
  });
  it("should render the logkeeper download command if the log is a resmoke log", () => {
    const { Component, hook } = renderComponentWithHook(
      useLogContext,
      <CLIInstructions />,
    );
    render(<Component />, { wrapper });
    act(() => {
      hook.current.setLogMetadata({
        buildID: "buildId",
        execution: "0",
        logType: LogTypes.RESMOKE_LOGS,
        taskID: "taskId",
        testID: "testId",
      });
    });
    const logkeeperDownloadCommand = `curl "${getResmokeLogURL("buildId", {
      raw: true,
      testID: "testId",
    })}"`;
    expect(screen.getByText(logkeeperDownloadCommand)).toBeInTheDocument();
  });
});
