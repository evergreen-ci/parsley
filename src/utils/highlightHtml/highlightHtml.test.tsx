import { render, screen } from "test_utils";
import highlightHtml from ".";

describe("highlightHtml", () => {
  it("does not corrupt the content within valid HTML tags/attributes", () => {
    render(
      <>
        {highlightHtml(
          "<a href='https://donthighlightme.com'>highlight me</a> highlight me <span data-cy='dont-highlight-me'>highlight me</span>",
          /highlight/gi,
        )}
      </>,
    );
    expect(screen.queryAllByDataCy("highlight")).toHaveLength(3);
    expect(screen.getByDataCy("dont-highlight-me")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "highlight me" })).toHaveAttribute(
      "href",
      "https://donthighlightme.com",
    );
  });
  it("can highlight < or > without corrupting valid HTML tags/attributes", () => {
    render(
      <>
        {highlightHtml(
          "<blah blah> <span data-cy='dont-highlight-me'>blah blah</span>",
          /</gi,
        )}
      </>,
    );
    expect(screen.queryAllByDataCy("highlight")).toHaveLength(1);
    expect(screen.queryByDataCy("highlight")).toHaveTextContent("<");
    expect(screen.getByDataCy("dont-highlight-me")).toBeInTheDocument();
  });
  it("highlights the content inside of <> if it's not a valid HTML tag", () => {
    render(<>{highlightHtml("<Downloading package...>", /Downloading/gi)}</>);
    expect(screen.queryAllByDataCy("highlight")).toHaveLength(1);
    expect(screen.getByDataCy("highlight")).toHaveTextContent("Downloading");
  });
  it("applies multiple highlights with different colors", () => {
    render(
      <>
        {highlightHtml(
          "Downloading node package...",
          undefined,
          /(Downloading)|(node)|(package)/gi,
        )}
      </>,
    );
    expect(screen.queryAllByDataCy("highlight")).toHaveLength(3);
    const colors = new Set();
    colors.add(
      getComputedStyle(screen.queryAllByDataCy("highlight")[0]).backgroundColor,
    );
    colors.add(
      getComputedStyle(screen.queryAllByDataCy("highlight")[1]).backgroundColor,
    );
    colors.add(
      getComputedStyle(screen.queryAllByDataCy("highlight")[2]).backgroundColor,
    );
    expect(colors.size).toBe(3);
  });
  it("should deduplicate highlights and searches", () => {
    const regexp = /test/i;
    render(<>{highlightHtml("This is a test", regexp, regexp)}</>);
    expect(screen.queryAllByDataCy("highlight")).toHaveLength(1);
    expect(screen.getByDataCy("highlight")).toHaveTextContent("test");
  });
  it("should show both highlights and searches if they are on the same line", () => {
    render(
      <>
        {highlightHtml(
          "building for production...",
          /building/i,
          /(production)/i,
        )}
      </>,
    );
    expect(screen.queryAllByDataCy("highlight")).toHaveLength(2);
    screen.getAllByDataCy("highlight").forEach((highlight) => {
      expect(highlight).toHaveTextContent(/building|production/i);
    });
  });
});
