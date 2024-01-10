import { renderWithRouterMatch, screen } from "test_utils";
import Highlighter from "./Highlighter";

describe("highlighter", () => {
  it("renders the text color correctly", () => {
    renderWithRouterMatch(
      <Highlighter color="salmon" data-cy="test-row">
        Test blah test blah
      </Highlighter>,
    );
    expect(screen.getByDataCy("test-row")).toHaveStyle(`color: salmon`);
  });

  describe("search", () => {
    it("search term highlights the matching text", () => {
      const regexp = /Test/gi;
      renderWithRouterMatch(
        <Highlighter searchTerm={regexp}>Test blah test blah</Highlighter>,
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(2);
      screen.getAllByDataCy("highlight").forEach((highlight) => {
        expect(highlight).toHaveTextContent(/test/i);
      });
    });
    it("preserves case sensitivity when applying a search", () => {
      const { rerender } = renderWithRouterMatch(
        <Highlighter searchTerm={/test/gi}>Test blah test blah</Highlighter>,
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(2);
      rerender(
        <Highlighter searchTerm={/test/g}>Test blah test blah</Highlighter>,
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(1);
    });
  });

  describe("highlights", () => {
    it("highlighted terms highlight the matching text", () => {
      const regexp = /(Test)|(blah)/gi;
      renderWithRouterMatch(
        <Highlighter highlights={regexp}>Test blah test blah</Highlighter>,
      );
      expect(screen.queryAllByDataCy("highlight")).toHaveLength(4);
      screen.getAllByDataCy("highlight").forEach((highlight) => {
        expect(highlight).toHaveTextContent(/test|blah/i);
      });
    });
  });
});
