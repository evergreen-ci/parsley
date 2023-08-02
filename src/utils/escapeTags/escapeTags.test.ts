import { escapeTags } from ".";

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
    expect(escapeTags("<nil>", {})).toBe("&lt;nil&gt;");
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
