import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import FiltersOverlay from ".";

describe("filtersOverlay", () => {
  it("filters properly display", () => {
    render(<FiltersOverlay />, {
      route: "?filters=filter1,filter2",
    });
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("should be able to delete filters", async () => {
    const { history } = render(<FiltersOverlay />, {
      route: "?filters=filter1,filter2",
    });
    userEvent.click(screen.getAllByLabelText("X Icon")[0]);

    await waitFor(() => {
      expect(history.location.search).toBe("?filters=filter2");
    });
    expect(history.location.search).toBe("?filters=filter2");
    expect(screen.queryByText("filter1")).not.toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });
});
