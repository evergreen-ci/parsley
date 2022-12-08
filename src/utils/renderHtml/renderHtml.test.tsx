import { render, screen } from "test_utils";
import renderHtml from ".";
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
    const { rerender } = render(
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
    rerender(
      <>
        {renderHtml("<span data-cy='log-line'>test <mongo::<std:lib >></span>")}
      </>
    );
    expect(screen.queryByDataCy("log-line")).toHaveTextContent(
      "test <mongo::<std:lib >>"
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

describe("escapeTags", () => {
  it("escapes html tags", () => {
    expect(escapeTags("<div withProps='test'>some text</div>", {})).toBe(
      "&lt;div withProps='test'&gt;some text&lt;/div&gt;"
    );
    expect(escapeTags("<script>alert('some alert')</script>")).toBe(
      "&lt;script&gt;alert('some alert')&lt;/script&gt;"
    );
  });
  it("does not escape allowed html tags", () => {
    expect(
      escapeTags("<span>some text</span>", {
        span: [],
      })
    ).toBe("<span>some text</span>");
    expect(
      escapeTags("<span target='test'>some text</span>", {
        span: ["target"],
      })
    ).toBe('<span target="test">some text</span>');
  });
  it("escapes non html tags", () => {
    expect(escapeTags("<nav>", {})).toBe("&lt;nav&gt;");
    expect(
      escapeTags(
        ` /opt/mongodbtoolchain/revisions/549e9c72ce95de436fb83815796d54a47893c049/stow/gcc-v3.SIC/include/c++/8.5.0/thread:196:13: std::thread::_State_impl<std::thread::_Invoker<std::tuple<mongo::stdx::thread::thread<mongo::ThreadPool::Impl::_startWorkerThread_inlock()::'lambda2'(), 0>(mongo::ThreadPool::Impl::_startWorkerThread_inlock()::'lambda2'())::'lambda'()> > >::_M_run()`
      )
    ).toBe(
      ` /opt/mongodbtoolchain/revisions/549e9c72ce95de436fb83815796d54a47893c049/stow/gcc-v3.SIC/include/c++/8.5.0/thread:196:13: std::thread::_State_impl&lt;std::thread::_Invoker&lt;std::tuple&lt;mongo::stdx::thread::thread&lt;mongo::ThreadPool::Impl::_startWorkerThread_inlock()::'lambda2'(), 0&gt;(mongo::ThreadPool::Impl::_startWorkerThread_inlock()::'lambda2'())::'lambda'()&gt; &gt; &gt;::_M_run()`
    );
  });
  it("escapes deeply nested non html tags", () => {
    expect(escapeTags("<some::<nested::tag>>")).toBe(
      "&lt;some::&lt;nested::tag&gt;&gt;"
    );
  });
});
