describe("Basic resmoke log view", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });

  it("should render resmoke lines", () => {
    cy.dataCy("resmoke-row").should("be.visible");
  });
  it("by default should have wrapping turned off and should be able to scroll horizontally", () => {
    cy.dataCy("log-row-16").should("be.visible");
    cy.dataCy("log-row-16").isNotContainedInViewport();
    cy.get(".ReactVirtualized__Grid__innerScrollContainer").should(
      "have.css",
      "overflow",
      "scroll auto"
    );
  });
  it("long lines with wrapping turned on should fit on screen", () => {
    cy.clickToggle("wrap-toggle", true); // Turn wrap on.
    cy.dataCy("log-row-16").should("be.visible");
    cy.dataCy("log-row-16").isContainedInViewport();
  });
});

describe("Resmoke syntax highlighting", () => {
  // Although it isn't ideal to test for a specific color, this helps us ensure that the color is consistent and deterministic.
  const colors = {
    black: "rgb(0, 0, 0)",
    blue: "rgb(8, 60, 144)",
    green: "rgb(0, 163, 92)",
  };
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });
  it("should not color non resmoke log lines", () => {
    cy.dataCy("log-row-0").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.black);
    });
  });
  it("should color similar resmoke lines with the same color", () => {
    cy.dataCy("log-row-20").should("be.visible");
    cy.dataCy("log-row-21").should("be.visible");
    cy.dataCy("log-row-20").should("contain", "[j0:s0:n1]");
    cy.dataCy("log-row-21").should("contain", "[j0:s0:n1]");
    cy.dataCy("log-row-20").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.blue);
    });

    cy.dataCy("log-row-21").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.blue);
    });
  });
  it("should color different resmoke lines with different colors if their resmoke state is different", () => {
    cy.dataCy("log-row-19").should("be.visible");
    cy.dataCy("log-row-20").should("be.visible");
    cy.dataCy("log-row-19").should("contain", "[j0:s0:n0]");
    cy.dataCy("log-row-20").should("contain", "[j0:s0:n1]");
    cy.dataCy("log-row-19").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.green);
    });
    cy.dataCy("log-row-20").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.blue);
    });
  });
});
describe("Bookmarking and selecting lines", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "11079");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,11079");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "4");
    cy.dataCy("sidebar-log-line-container").should("contain", "11079");

    cy.dataCy("log-row-4").dblclick();
    cy.dataCy("sidebar-log-line-container").should("not.contain", "4");
  });

  it("should be able to select and unselect lines", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11079&selectedLine=5");
    cy.dataCy("sidebar-log-line-container").should("contain", "5");

    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("sidebar-log-line-container").should("not.contain", "5");
  });

  it("should be able to copy bookmarks as JIRA format", () => {
    cy.dataCy("log-row-10").dblclick({ scrollBehavior: false });
    cy.dataCy("log-row-11").dblclick({ scrollBehavior: false });

    const logLine0 =
      "[fsm_workload_test:internal_transactions_kill_sessions] Fixture status:";
    const logLine10 =
      "|ShardedClusterFixture:job0:mongos0        |j0:s0   |20009|73157|";
    const logLine11 =
      "|ShardedClusterFixture:job0:mongos1        |j0:s1   |20010|73217|";
    const logLine11079 = `[j0:s1] | 2022-09-21T12:50:28.489+00:00 I  NETWORK  22944   [conn60] "Connection ended","attr":{"remote":"127.0.0.1:47362","uuid":{"uuid":{"$uuid":"b28d7d9f-03b6-4f93-a7cd-5e1948135f69"}},"connectionId":60,"connectionCount":2}`;

    cy.enableClipboard();
    cy.dataCy("details-button").click();
    cy.dataCy("jira-button-wrapper").click();
    cy.window()
      .its("navigator.clipboard")
      .invoke("readText")
      .should(
        "equal",
        `{noformat}\n${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine11079}\n{noformat}`
      );
  });

  it("should be able to clear bookmarks", () => {
    cy.dataCy("clear-bookmarks").click();
    cy.location("search").should("equal", "");
  });
});

describe("Filtering", () => {
  it("should be able to apply filters", () => {
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("starting{enter}");

    cy.get("[data-cy^='log-row-']").each(($el) => {
      cy.wrap($el).contains("starting", { matchCase: false });
    });
  });

  it("should be able to edit filters", () => {
    cy.toggleDrawer();
    cy.get(`[aria-label="Edit filter"]`).click();
    cy.dataCy("edit-filter-name").clear().type("running");
    cy.contains("button", "OK").click();

    cy.get("[data-cy^='log-row-']").each(($el) => {
      cy.wrap($el).contains("running", { matchCase: false });
    });
  });

  it("should preserve applied bookmarks and selected lines even if they don't match the filters", () => {
    // Delete the filters from the drawer.
    cy.get(`[aria-label="Delete filter"]`).click();

    // Select a line, with the expectation that it won't be collapsed by the filter.
    cy.dataCy("log-link-5").click();
    // Bookmark a line, with the expecation that it won't be collapsed by the filter.
    cy.dataCy("log-row-6").dblclick();

    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("notarealfilter{enter}");

    cy.get("[data-cy^='log-row-']").each(($el) => {
      // Matched elements should be one of the bookmarked or selected values
      cy.wrap($el)
        .should("have.attr", "data-cy")
        .and("match", /log-row-(0|5|6|11079)/);
    });
  });
});

describe("Jump to line", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.visit(logLink);
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "11079");
  });

  it("should be able to use the sidebar to jump to a line when there are no collapsed rows", () => {
    cy.dataCy("log-row-4").dblclick({ force: true });

    cy.dataCy("sidebar-log-line-11079").click();
    cy.dataCy("log-row-11079").should("be.visible");
    cy.dataCy("log-row-56").should("not.exist");

    cy.dataCy("sidebar-log-line-4").click();
    cy.dataCy("log-row-4").should("be.visible");
  });

  it("should be able to use the sidebar to jump to a line when there are collapsed rows", () => {
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("repl_hb{enter}");

    cy.dataCy("log-row-30").dblclick({ force: true });

    cy.dataCy("sidebar-log-line-11079").click();
    cy.dataCy("log-row-11079").should("be.visible");
    cy.dataCy("log-row-30").should("not.exist");

    cy.dataCy("sidebar-log-line-30").click();
    cy.dataCy("log-row-30").should("be.visible");
  });
});

describe("Searching", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";

  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.toggleDrawer();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
  });

  it("searching for a term should highlight matching words ", () => {
    cy.dataCy("searchbar-input").type("ShardedClusterFixture:job0:mongos0 ");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should(
      "contain.text",
      "ShardedClusterFixture:job0:mongos0 "
    );
  });

  it("searching for a term should snap the matching line to the top of the window", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("REPL_HB");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1484");
    cy.get("[data-highlighted='true']").should("contain.text", "REPL_HB");
  });

  it("should be able to specify a range of lines to search", () => {
    cy.editBounds({ upper: "25" });
    cy.dataCy("search-count").should("contain.text", "1/7");

    cy.editBounds({ lower: "25" });
    cy.dataCy("search-count").should("contain.text", "1/1");

    cy.clearBounds();
    cy.dataCy("search-count").should("contain.text", "1/1484");
  });
  it("should be able to toggle case sensitivity", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("Mongos0");
    cy.dataCy("search-count").should("contain.text", "1/1");

    cy.clickToggle("case-sensitive-toggle", true); // Turn case sensitivity on.
    cy.dataCy("search-count").should("contain.text", "No Matches");

    cy.clickToggle("case-sensitive-toggle", false); // Turn case sensitivity off.
    cy.dataCy("search-count").should("contain.text", "1/1");
  });

  it("should be able to paginate through search results", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("conn49");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/8");
    // Click the button 8 times
    for (let i = 1; i <= 7; i++) {
      cy.dataCy("next-button").click();
      cy.dataCy("search-count").should("contain.text", `${i + 1}/8`);
    }
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "1/8");
    for (let i = 7; i >= 0; i--) {
      cy.dataCy("previous-button").click();
      cy.dataCy("search-count").should("contain.text", `${i + 1}/8`);
    }
  });

  it("should be able to search on filtered content", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("conn49");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/8");
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("conn49");
    cy.dataCy("searchbar-input").type("{enter}");
    cy.get("[data-cy^='collapsed-row-']").should("exist");
    cy.get("[data-cy^='collapsed-row-']").should("have.length", 7);
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("NETWORK");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/7");
  });
});

describe("expanding collapsed rows", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });

  it("should be able to expand collapsed rows", () => {
    // Apply a filter.
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("ShardedClusterFixture:job0{enter}");

    cy.dataCy("log-row-1").should("not.exist");
    cy.dataCy("log-row-2").should("not.exist");
    cy.dataCy("log-row-3").should("not.exist");

    cy.dataCy("collapsed-row-1-3").within(() => {
      cy.contains("All").click();
    });

    cy.dataCy("collapsed-row-1-3").should("not.exist");
    cy.dataCy("log-row-1").should("be.visible");
    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-3").should("be.visible");
  });
});
