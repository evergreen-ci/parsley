import { render, screen } from "test_utils";
import renderHtml from ".";
import { escapeHtml } from "./escapeHtml";

describe("renderHtml", () => {
  it("renders a plain string with no html", () => {
    render(<>{renderHtml("test string")}</>);
    expect(screen.getByText("test string")).toBeInTheDocument();
  });
  it("renders a string with html", () => {
    render(<>{renderHtml("test <span data-cy='element'>string</span>")}</>);
    expect(screen.queryByDataCy("element")).toHaveTextContent("string");
  });
  it("replaces a element with a react component if specified", () => {
    const Component = ({ children }: { children: React.ReactElement }) => (
      <div data-cy="component">✨{children}✨</div>
    );
    render(
      <>
        {renderHtml("test <span data-cy='element'>string</span>", {
          // @ts-expect-error - This is expecting a react component but its an Emotion component which are virtually the same thing
          transform: { span: Component },
        })}
      </>
    );
    expect(screen.queryByDataCy("element")).not.toBeInTheDocument();
    expect(screen.getByDataCy("component")).toBeInTheDocument();
    expect(screen.queryByDataCy("component")).toHaveTextContent("✨string✨");
  });
});

describe("escapeHtml", () => {
  it("escapes html", () => {
    expect(escapeHtml("<div>")).toBe("&lt;div&gt;");
    expect(escapeHtml("<span>some text</span>")).toBe(
      "&lt;span&gt;some text&lt;/span&gt;"
    );
    expect(escapeHtml("<preview>")).toBe("&lt;preview&gt;");
  });
});
