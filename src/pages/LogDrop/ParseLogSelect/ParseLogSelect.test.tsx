import Cookie from "js-cookie";
import { LogTypes } from "constants/enums";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import ParseLogSelect from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

describe("parse log select", () => {
  it("defaults to 'Select...' option if cookie is unset", () => {
    mockedGet.mockImplementation(() => "");
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={jest.fn()}
        onParse={jest.fn()}
      />
    );
    expect(screen.getByText("Select...")).toBeInTheDocument();
    expect(screen.getByDataCy("process-log-button")).toHaveAttribute(
      "aria-disabled",
      "true"
    );
  });

  it("defaults to 'Raw' option if cookie is set to evergreen logs", () => {
    mockedGet.mockImplementation(() => LogTypes.EVERGREEN_TASK_LOGS);
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={jest.fn()}
        onParse={jest.fn()}
      />
    );
    expect(screen.getByText("Raw")).toBeInTheDocument();
    expect(screen.getByDataCy("process-log-button")).toBeEnabled();
  });

  it("defaults to 'Resmoke' option if cookie is set to resmoke logs", () => {
    mockedGet.mockImplementation(() => LogTypes.RESMOKE_LOGS);
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={jest.fn()}
        onParse={jest.fn()}
      />
    );
    expect(screen.getByText("Resmoke")).toBeInTheDocument();
    expect(screen.getByDataCy("process-log-button")).toBeEnabled();
  });

  it("clicking the 'Process Log' button calls the onParse function", async () => {
    mockedGet.mockImplementation(() => LogTypes.RESMOKE_LOGS);
    const onParse = jest.fn();
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={jest.fn()}
        onParse={onParse}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByDataCy("process-log-button"));
    expect(onParse).toHaveBeenCalledTimes(1);
  });

  it("clicking the 'Cancel' button calls the onCancel function", async () => {
    const onCancel = jest.fn();
    render(
      <ParseLogSelect
        fileName="filename.txt"
        onCancel={onCancel}
        onParse={jest.fn()}
      />
    );
    const user = userEvent.setup();
    await user.click(screen.getByRole("button", { name: "Cancel" }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
});
