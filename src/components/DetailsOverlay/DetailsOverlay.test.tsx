// import { getCookie, setCookie } from "typescript-cookie";
// import * as Cookie from "js-cookie";
import Cookie from "js-cookie";
import {
  renderWithRouterMatch as render,
  screen,
  userEvent,
  waitFor,
} from "test_utils";
import DetailsOverlay from ".";

// typescript-cookie problem: https://github.com/carhartl/typescript-cookie/issues/110
// js-cookie problem: stackoverflow.com/questions/65556421/typescript-using-the-incorrect-type-with-jest-when-there-are-multiple-available
jest.mock("js-cookie");
// const { get } = Cookie;
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

// this doesn't work :(
// jest.mock("js-cookie", () => ({
//   get: jest.fn().mockReturnValue("true"),
// }));

describe("detailsOverlay", () => {
  beforeEach(() => {
    console.log("Should be mocked: ", Cookie);
    mockedGet.mockImplementation(() => "true");
    console.log("my cookieeee: ", Cookie.get());
    console.log("my cookieeee: ", Cookie.get("my-cookie"));
    // This doesn't work:
    // jest.mock("js-cookie", () => ({ get: () => "true" }));
  });

  describe("wrap toggle", () => {
    it("should update the URL correctly", async () => {
      const { history } = render(<DetailsOverlay />);
      const { location } = history;

      const wrapToggle = screen.getByDataCy("wrap-toggle");
      expect(wrapToggle).toHaveAttribute("aria-checked", "false");

      userEvent.click(wrapToggle);
      await waitFor(() => {
        expect(wrapToggle).toHaveAttribute("aria-checked", "true");
      });
      await waitFor(() => {
        expect(location.search).toBe("?wrap=true");
      });
    });
  });

  describe("case sensitivity toggle", () => {
    it("should update the URL correctly", () => {
      const { history } = render(<DetailsOverlay />);
      const { location } = history;

      const caseSensitiveToggle = screen.getByDataCy("case-sensitive-toggle");
      expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "false");

      userEvent.click(caseSensitiveToggle);
      expect(caseSensitiveToggle).toHaveAttribute("aria-checked", "true");
      expect(location.search).toBe("?caseSensitive=true");
    });
  });

  describe("logV2 toggle", () => {
    it("should read from the cookie properly", () => {
      render(<DetailsOverlay />);
      const formatV2Toggle = screen.getByDataCy("format-v2-toggle");
      expect(formatV2Toggle).toHaveAttribute("aria-checked", "true");
    });
    it("should not update the URL", () => {
      const { history } = render(<DetailsOverlay />);
      const { location } = history;
      const formatV2Toggle = screen.getByDataCy("format-v2-toggle");
      userEvent.click(formatV2Toggle);
      expect(formatV2Toggle).toHaveAttribute("aria-checked", "false");
      expect(location.search).toBe("");
    });
  });

  describe("filter logic toggle", () => {
    it("should update the URL correctly", () => {
      const { history } = render(<DetailsOverlay />);
      const { location } = history;

      const filterLogicToggle = screen.getByDataCy("filter-logic-toggle");
      expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");

      userEvent.click(filterLogicToggle);
      expect(filterLogicToggle).toHaveAttribute("aria-checked", "true");
      expect(location.search).toBe("?filterLogic=or");

      userEvent.click(filterLogicToggle);
      expect(filterLogicToggle).toHaveAttribute("aria-checked", "false");
      expect(location.search).toBe("?filterLogic=and");
    });
  });

  describe("expandable rows toggle", () => {
    it("should update the URL correctly", () => {
      const { history } = render(<DetailsOverlay />);
      const { location } = history;

      const expandableRowsToggle = screen.getByDataCy("expandable-rows-toggle");
      expect(expandableRowsToggle).toHaveAttribute("aria-checked", "false");

      userEvent.click(expandableRowsToggle);
      expect(expandableRowsToggle).toHaveAttribute("aria-checked", "true");
      expect(location.search).toBe("?expandable=true");
    });
  });

  describe("pretty print toggle", () => {
    it("should read from the cookie properly", () => {
      render(<DetailsOverlay />);
      const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
      expect(prettyPrintToggle).toHaveAttribute("aria-checked", "true");
    });
    it("should not update the URL", () => {
      const { history } = render(<DetailsOverlay />);
      const { location } = history;
      const prettyPrintToggle = screen.getByDataCy("pretty-print-toggle");
      userEvent.click(prettyPrintToggle);
      expect(prettyPrintToggle).toHaveAttribute("aria-checked", "false");
      expect(location.search).toBe("");
    });
  });
});
