import Cookie from "js-cookie";
import { render, screen, waitFor } from "test_utils";
import SearchBarGuideCue from ".";

jest.mock("js-cookie");
const mockedGet = Cookie.get as unknown as jest.Mock<string>;

describe("search bar guide cue", () => {
  beforeEach(() => {
    mockedGet.mockImplementation(() => "true");
  });

  it("shows the guide cue if the user has not seen it before", async () => {
    mockedGet.mockImplementation(() => "false");
    render(<SearchBarGuideCue />);
    await waitFor(() => {
      expect(screen.getByDataCy("searchbar-guide-cue")).toBeInTheDocument();
    });
  });

  it("does not show the guide cue if the user has seen it before", () => {
    render(<SearchBarGuideCue />);
    expect(screen.queryByDataCy("searchbar-guide-cue")).toBeNull();
  });
});
