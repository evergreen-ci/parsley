import { LogTypes } from "constants/enums";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import SectionsToggle from ".";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <LogContextProvider initialLogLines={[]}>{children}</LogContextProvider>
);

describe("sections toggle", () => {
  it("should render as checked based on props", () => {
    render(
      <SectionsToggle
        checked
        logType={LogTypes.EVERGREEN_TASK_LOGS}
        updateSettings={jest.fn()}
      />,
      {
        wrapper,
      },
    );
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-checked", "true");
  });

  it("should render as unchecked based on props", () => {
    render(
      <SectionsToggle
        checked={false}
        logType={LogTypes.EVERGREEN_TASK_LOGS}
        updateSettings={jest.fn()}
      />,
      {
        wrapper,
      },
    );
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-checked", "false");
  });

  it("should disable the toggle if the logType is not task", () => {
    render(
      <SectionsToggle
        checked={false}
        logType={LogTypes.RESMOKE_LOGS}
        updateSettings={jest.fn()}
      />,
      {
        wrapper,
      },
    );
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-disabled", "true");
  });

  it("should not disable the toggle if the logType is task", () => {
    render(
      <SectionsToggle
        checked={false}
        logType={LogTypes.EVERGREEN_TASK_LOGS}
        updateSettings={jest.fn()}
      />,
      {
        wrapper,
      },
    );
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    expect(sectionsToggle).toHaveAttribute("aria-disabled", "false");
  });

  it("should call the update functions with correct parameters & should not update the URL", async () => {
    const user = userEvent.setup();
    const updateSettings = jest.fn();
    const { router } = render(
      <SectionsToggle
        checked
        logType={LogTypes.EVERGREEN_TASK_LOGS}
        updateSettings={updateSettings}
      />,
      {
        wrapper,
      },
    );
    const sectionsToggle = screen.getByDataCy("sections-toggle");
    await user.click(sectionsToggle);
    expect(updateSettings).toHaveBeenCalledTimes(1);
    expect(updateSettings).toHaveBeenCalledWith({
      sectionsEnabled: false,
    });
    expect(router.state.location.search).toBe("");
  });
});
