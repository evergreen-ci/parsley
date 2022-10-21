describe("Basic evergreen log view", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });

  const longLogLine = `[2022/03/02 17:02:18.500] warning Pattern ["@apollo/client@latest"] is trying to unpack in the same destination "/home/ubuntu/.cache/yarn/v6/npm-@apollo-client-3.3.7-f15bf961dc0c2bee37a47bf86b8881fdc6183810-integrity/node_modules/@apollo/client" as pattern ["@apollo/client@3.3.7"]. This could result in non-deterministic behavior, skipping.`;
  it("should be able to see log lines", () => {
    cy.dataCy("log-row-0").should("be.visible");
  });
  it("should render ansii lines", () => {
    cy.dataCy("ansii-row").should("be.visible");
  });
  it("by default should have wrapping turned off and should be able to scroll horizontally", () => {
    cy.dataCy("log-row-22").should("be.visible");
    cy.dataCy("log-row-22").should("contain.text", longLogLine);
    cy.dataCy("log-row-22").isNotContainedInViewport();
    cy.get(".ReactVirtualized__Grid__innerScrollContainer").should(
      "have.css",
      "overflow",
      "scroll auto"
    );
  });
  it("long lines with wrapping turned on should fit on screen", () => {
    cy.clickToggle("wrap-toggle", true); // Turn wrap on.
    cy.dataCy("log-row-22").should("be.visible");
    cy.dataCy("log-row-22").should("contain.text", longLogLine);
    cy.dataCy("log-row-22").isContainedInViewport();
  });
});

describe("Bookmarking and selecting lines", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,297");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "297");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,297");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "4");
    cy.dataCy("sidebar-log-line-container").should("contain", "297");

    cy.dataCy("log-row-4").dblclick();
    cy.dataCy("sidebar-log-line-container").should("not.contain", "4");
  });

  it("should be able to select and unselect lines", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,297&selectedLine=5");
    cy.dataCy("sidebar-log-line-container").should("contain", "5");

    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,297");
    cy.dataCy("sidebar-log-line-container").should("not.contain", "5");
  });

  it("should be able to copy bookmarks as JIRA format", () => {
    cy.dataCy("log-row-10").dblclick({ scrollBehavior: false });
    cy.dataCy("log-row-11").dblclick({ scrollBehavior: false });

    const logLine0 =
      "[2022/03/02 17:01:58.587] Task logger initialized (agent version 2022-02-14 from 00a4c8f3e8e4559cc23e04a019b6d1725c40c3e5).";
    const logLine10 =
      "[2022/03/02 17:02:01.610] e391612 EVG-16049 Update spruce project page for admin only variables (#1114)";
    const logLine11 =
      "[2022/03/02 17:02:01.610] 04a52b2 EVG-15959 Fix rerender method in test utils (#1118)";
    const logLine297 =
      "[2022/03/02 17:05:21.050] running setup group because we have a new independent task";

    cy.enableClipboard();
    cy.dataCy("details-button").click();
    cy.dataCy("jira-button-wrapper").click();
    cy.window()
      .its("navigator.clipboard")
      .invoke("readText")
      .should(
        "equal",
        `{noformat}\n${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine297}\n{noformat}`
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

    cy.get("[data-cy^='collapsed-row-']").should("exist");
    cy.get("[data-cy^='log-row-']").each(($el) => {
      cy.wrap($el).contains("starting", { matchCase: false });
    });
  });

  it("should be able to edit filters", () => {
    cy.toggleDrawer();
    cy.get(`[aria-label="Edit filter"]`).click();
    cy.dataCy("edit-filter-name").clear().type("running");
    cy.contains("button", "OK").click();

    // Previous filter should no longer apply.
    cy.contains("starting").should("not.exist");

    cy.get("[data-cy^='log-row-']").each(($el) => {
      cy.wrap($el).contains("running", { matchCase: false });
    });
  });

  it("should be able to delete filters", () => {
    // Delete the filters from the drawer.
    cy.get(`[aria-label="Delete filter"]`).click();
    cy.get("[data-cy^='collapsed-row-']").should("not.exist");
  });

  it("should preserve applied bookmarks and selected lines even if they don't match the filters", () => {
    // Select a line, with the expectation that it won't be collapsed by the filter.
    cy.dataCy("log-link-5").click();
    // Bookmark a line, with the expecation that it won't be collapsed by the filter.
    cy.dataCy("log-row-6").dblclick();

    cy.dataCy("searchbar-input").type("notarealfilter{enter}");
    cy.get("[data-cy^='collapsed-row-']").should("exist");
    cy.get("[data-cy^='log-row-']").each(($el) => {
      // Matched elements should be one of the bookmarked or selected values
      cy.wrap($el)
        .should("have.attr", "data-cy")
        .and("match", /log-row-(0|5|6)/);
    });
  });
});

describe("Jump to line", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  before(() => {
    cy.login();
    cy.visit(logLink);
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,297");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "297");
  });

  it("should be able to use the sidebar to jump to a line when there are no collapsed rows", () => {
    cy.dataCy("log-row-4").dblclick({ force: true });

    cy.dataCy("sidebar-log-line-297").click();
    cy.dataCy("log-row-297").should("be.visible");
    cy.dataCy("log-row-56").should("not.exist");

    cy.dataCy("sidebar-log-line-4").click();
    cy.dataCy("log-row-4").should("be.visible");
  });

  it("should be able to use the sidebar to jump to a line when there are collapsed rows", () => {
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("pass{enter}");

    cy.dataCy("log-row-56").dblclick({ force: true });

    cy.dataCy("sidebar-log-line-297").click();
    cy.dataCy("log-row-297").should("be.visible");
    cy.dataCy("log-row-56").should("not.exist");

    cy.dataCy("sidebar-log-line-56").click();
    cy.dataCy("log-row-56").should("be.visible");
  });
});

describe("Searching", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.toggleDrawer();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
  });

  it("searching for a term should highlight matching words ", () => {
    cy.dataCy("searchbar-input").type("Starting");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should("contain.text", "Starting");
  });

  it("searching for a term should snap the matching line to the top of the window", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("info");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/4");
    cy.get("[data-highlighted='true']").should("contain.text", "info");
  });

  it("should be able to specify a range of lines to search", () => {
    cy.editBounds({ upper: "25" });
    cy.dataCy("search-count").should("contain.text", "1/2");

    cy.editBounds({ lower: "25" });
    cy.dataCy("search-count").should("contain.text", "1/1");

    cy.clearBounds();
    cy.dataCy("search-count").should("contain.text", "1/4");
  });

  it("should be able to toggle case sensitivity", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("starting");
    cy.dataCy("search-count").should("contain.text", "1/1");

    cy.clickToggle("case-sensitive-toggle", true); // Turn case sensitivity on.
    cy.dataCy("search-count").should("contain.text", "No Matches");

    cy.clickToggle("case-sensitive-toggle", false); // Turn case sensitivity off.
    cy.dataCy("search-count").should("contain.text", "1/1");
  });

  it("should be able to paginate through search results", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("info");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "2/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "3/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "4/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "1/4");
    cy.dataCy("previous-button").click();
    cy.dataCy("search-count").should("contain.text", "4/4");
    cy.dataCy("previous-button").click();
    cy.dataCy("search-count").should("contain.text", "3/4");
    cy.dataCy("previous-button").click();
    cy.dataCy("search-count").should("contain.text", "2/4");
    cy.dataCy("previous-button").click();
    cy.dataCy("search-count").should("contain.text", "1/4");
  });

  it("should be able to search on filtered content", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("spruce");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/27");
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("Starting");
    cy.dataCy("searchbar-input").type("{enter}");
    cy.get("[data-cy^='collapsed-row-']").should("exist");
    cy.get("[data-cy^='collapsed-row-']").should("have.length", 1);
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("Spruce");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1");
  });
});

describe("expanding collapsed rows", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });

  it("should be able to expand collapsed rows", () => {
    // Apply a filter.
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("evg{enter}");

    cy.dataCy("log-row-1").should("not.exist");
    cy.dataCy("log-row-2").should("not.exist");
    cy.dataCy("log-row-3").should("not.exist");
    cy.dataCy("log-row-4").should("not.exist");

    cy.dataCy("collapsed-row-1-4").within(() => {
      cy.contains("All").click();
    });

    cy.dataCy("collapsed-row-1-4").should("not.exist");
    cy.dataCy("log-row-1").should("be.visible");
    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-3").should("be.visible");
    cy.dataCy("log-row-4").should("be.visible");
  });
});
