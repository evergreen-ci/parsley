import { renderWithRouterMatch as render, screen, userEvent } from "test_utils";
import FiltersOverlay from ".";

describe("filtersOverlay", () => {
  it("filters should properly display based on URL", () => {
    render(<FiltersOverlay />, {
      route: "?filters=filter1,filter2",
    });
    expect(screen.getByText("filter1")).toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });

  it("deleting filters should modify the URL correctly", async () => {
    const { history } = render(<FiltersOverlay />, {
      route: "?filters=filter1,filter2",
    });
    await userEvent.click(screen.getAllByLabelText("X Icon")[0]);

    expect(history.location.search).toBe("?filters=filter2");
    expect(history.location.search).toBe("?filters=filter2");
    expect(screen.queryByText("filter1")).not.toBeInTheDocument();
    expect(screen.getByText("filter2")).toBeInTheDocument();
  });
});
