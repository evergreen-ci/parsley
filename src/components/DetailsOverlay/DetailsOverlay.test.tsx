import Cookie from "js-cookie";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import DetailsOverlay from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

describe("detailsOverlay", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  describe("range input", () => {
    it("should update the URL correctly", async () => {
      const { history } = render(<DetailsOverlay />);

      const lowerBound = screen.getByDataCy("range-lower-bound");
      await userEvent.type(lowerBound, "99");
      await waitFor(() => {
        expect(history.location.search).toBe("?lower=99");
      });

      const upperBound = screen.getByDataCy("range-upper-bound");
      await userEvent.type(upperBound, "100");
      await waitFor(() => {
        expect(history.location.search).toBe("?lower=99&upper=100");
      });
    });

    it("empty input should not add anything to the URL", async () => {
      const { history } = render(<DetailsOverlay />);

      const lowerBound = screen.getByDataCy("range-lower-bound");
      await userEvent.type(lowerBound, "99");
      await waitFor(() => {
        expect(history.location.search).toBe("?lower=99");
      });

      await userEvent.clear(lowerBound);
      await waitFor(() => {
        expect(history.location.search).toBe("");
      });
    });

    it("should show an error on invalid input", async () => {
      render(<DetailsOverlay />);

      const upperBound = screen.getByDataCy("range-upper-bound");
      await userEvent.type(upperBound, "8");

      const lowerBound = screen.getByDataCy("range-lower-bound");
      await userEvent.type(lowerBound, "9");

      await waitFor(() => {
        expect(screen.getByDataCy("range-error-message")).toBeInTheDocument();
      });
    });
  });

  describe("wrap toggle", () => {
    it("should update the URL correctly", async () => {
      const { history } = render(<DetailsOverlay />);

      const wrapToggle = screen.getByDataCy("wrap-toggle");
      expect(wrapToggle).toHaveAttribute("aria-checked", "false");

      userEvent.click(wrapToggle);
      await waitFor(() => {
        expect(wrapToggle).toHaveAttribute("aria-checked", "true");
      });
      expect(history.location.search).toBe("?wrap=true");
    });
  });

  describe("case sensitivity toggle", () => {
    it("should update the URL correctly", async () => {
      const { history } = render(<DetailsOverlay />);

      const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
      expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");

      userEvent.click(caseSensitiveToggle);
      await waitFor(() => {
        expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "true");
      });
      expect(history.location.search).toBe("?caseSensitive=true");
    });
  });

  describe("filter logic toggle", () => {
    it("should update the URL correctly", async () => {
      const { history } = render(<DetailsOverlay />);

      const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
      expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");

      userEvent.click(filterLogicToggle);
      await waitFor(() => {
        expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
      });
      expect(history.location.search).toBe("?filterLogic=or");

      userEvent.click(filterLogicToggle);
      await waitFor(() => {
        expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
      });
      expect(history.location.search).toBe("?filterLogic=and");
    });
  });

  describe("expandable rows toggle", () => {
    it("should update the URL correctly", async () => {
      const { history } = render(<DetailsOverlay />);

      const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
      expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");

      userEvent.click(expandableRowsToggle);
      await waitFor(() => {
        expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
      });
      expect(history.location.search).toBe("?expandable=true");
    });
  });

  describe("pretty print toggle", () => {
    it("should read from the cookie properly", () => {
      render(<DetailsOverlay />);
      const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
      expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
    });
    it("should not update the URL", async () => {
      const { history } = render(<DetailsOverlay />);

      const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
      userEvent.click(prettyPrintToggle);
      await waitFor(() => {
        expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
      });
      expect(history.location.search).toBe("");
    });
  });
});
