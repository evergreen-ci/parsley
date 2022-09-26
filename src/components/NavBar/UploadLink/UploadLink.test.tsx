import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import UploadLink from ".";

describe("uploadLink", () => {
  const user = userEvent.setup();

  it("links to /upload page when there are no logs", () => {
    const clearLogs = jest.fn();
    render(<UploadLink clearLogs={clearLogs} hasLogs={false} />);
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.queryByDataCy("upload-link")).toHaveAttribute(
      "href",
      "/upload"
    );
  });

  it("opens a confirmation modal when there are logs", async () => {
    const clearLogs = jest.fn();
    render(<UploadLink clearLogs={clearLogs} hasLogs />);
    expect(screen.getByText("Upload")).toBeInTheDocument();
    expect(screen.queryByDataCy("upload-link")).toHaveAttribute("href", "/");
    await user.click(screen.getByText("Upload"));
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).toBeVisible();
    });
  });

  it("closing the modal does not clear logs", async () => {
    const clearLogs = jest.fn();
    render(<UploadLink clearLogs={clearLogs} hasLogs />);
    await user.click(screen.getByText("Upload"));
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).toBeVisible();
    });

    const cancelButton = screen.getByRole("button", {
      name: "Cancel",
    });
    await user.click(cancelButton);
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).not.toBeVisible();
    });
    expect(clearLogs).not.toHaveBeenCalled();
  });

  it("confirming the modal clears logs and navigates to /upload", async () => {
    const clearLogs = jest.fn();
    const { history } = render(<UploadLink clearLogs={clearLogs} hasLogs />);
    await user.click(screen.getByText("Upload"));
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).toBeVisible();
    });

    const confirmButton = screen.getByRole("button", {
      name: "Confirm",
    });
    await user.click(confirmButton);
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).toBeNull();
    });
    expect(history.location.pathname).toBe("/upload");
    expect(clearLogs).toHaveBeenCalledTimes(1);
  });
});
