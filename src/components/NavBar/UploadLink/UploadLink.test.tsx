import {
  fireEvent,
  renderWithRouterMatch as render,
  screen,
  waitFor,
} from "test_utils";
import UploadLink from ".";

describe("uploadLink", () => {
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
    fireEvent.click(screen.getByText("Upload"));
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).toBeVisible();
    });
  });
  it("closing the modal does not clear logs", async () => {
    const clearLogs = jest.fn();
    render(<UploadLink clearLogs={clearLogs} hasLogs />);
    fireEvent.click(screen.getByText("Upload"));
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).toBeVisible();
    });
    fireEvent.click(screen.getByText("Cancel"));
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).not.toBeVisible();
    });
    expect(clearLogs).not.toHaveBeenCalled();
  });
  it("confirming the modal clears logs and navigates to /upload", async () => {
    const clearLogs = jest.fn();
    const { history } = render(<UploadLink clearLogs={clearLogs} hasLogs />);
    fireEvent.click(screen.getByText("Upload"));
    await waitFor(() => {
      expect(screen.queryByDataCy("confirmation-modal")).toBeVisible();
    });
    fireEvent.click(screen.getByText("Confirm"));
    await waitFor(() => {
      expect(
        screen.queryByDataCy("confirmation-modal")
      ).not.toBeInTheDocument();
    });
    expect(clearLogs).toHaveBeenCalledWith();
    expect(history.location.pathname).toBe("/upload");
  });
});
