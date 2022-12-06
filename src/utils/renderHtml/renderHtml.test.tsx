import { render, screen } from "test_utils";
import renderHtml from ".";
import { escapeHtml } from "./escapeHtml";
import { escapeTags } from "./escapeTags";

describe("renderHtml", () => {
  it("renders a plain string with no html", () => {
    render(<>{renderHtml("test string")}</>);
    expect(screen.getByText("test string")).toBeInTheDocument();
  });
  it("renders a string with html and preserves allowed elements with their props", () => {
    render(<>{renderHtml("test <span data-cy='element'>string</span>")}</>);
    expect(screen.queryByDataCy("element")).toHaveTextContent("string");
  });
  it("renders a string with html and escapes disallowed elements", () => {
    render(
      <>
        {renderHtml(
          "<span data-cy='log-line'>test <script data-cy='should-not-exist'>alert('test')</script></span>"
        )}
      </>
    );
    expect(screen.queryByDataCy("should-not-exist")).toBeNull();
    expect(screen.queryByDataCy("log-line")).toHaveTextContent(
      "test <script data-cy='should-not-exist'>alert('test')</script>"
    );
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
    expect(escapeHtml(`some "string"`)).toBe("some &quot;string&quot;");
  });
});

describe("escapeTags", () => {
  it("escapes html tags", () => {
    expect(escapeTags("<div withProps='test'>some text</div>", ["span"])).toBe(
      "&lt;div withProps='test'&gt;some text&lt;/div&gt;"
    );
    expect(escapeTags("<script>alert('some alert')</script>", ["span"])).toBe(
      "&lt;script&gt;alert('some alert')&lt;/script&gt;"
    );
  });
  it("does not escape allowed html tags", () => {
    expect(escapeTags("<span>some text</span>", ["span"])).toBe(
      "<span>some text</span>"
    );
    expect(
      escapeTags("<span withProps='test'>some text</span>", ["span"])
    ).toBe("<span withProps='test'>some text</span>");
  });
  it("escapes non html tags", () => {
    expect(escapeTags("<nav>", [])).toBe("&lt;nav&gt;");
  });
});
