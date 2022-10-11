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
    // Turn wrapping on through the Details Overlay.
    cy.dataCy("details-button").click();
    cy.dataCy("wrap-toggle").click();
    cy.dataCy("details-button").click();

    cy.dataCy("log-row-16").should("be.visible");
    cy.dataCy("log-row-16").isContainedInViewport();
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
    cy.dataCy("log-line-container").should("contain", "0");
    cy.dataCy("log-line-container").should("contain", "11079");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,11079");
    cy.dataCy("log-line-container").should("contain", "0");
    cy.dataCy("log-line-container").should("contain", "4");
    cy.dataCy("log-line-container").should("contain", "11079");

    cy.dataCy("log-row-4").dblclick();
    cy.dataCy("log-line-container").should("not.contain", "4");
  });

  it("should be able to select and unselect lines", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11079&selectedLine=5");
    cy.dataCy("log-line-container").should("contain", "5");

    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("log-line-container").should("not.contain", "5");
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

  it("should preserve applied bookmarks and selected lines even if they don't match the filters", () => {
    // Delete the filters from the drawer.
    cy.toggleDrawer();
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

  it("should be able to edit filters", () => {
    // Clear selected line and bookmarks.
    cy.dataCy("log-link-5").click();
    cy.dataCy("clear-bookmarks").click();

    cy.get(`[aria-label="Edit filter"]`).click();
    cy.dataCy("edit-filter-name").clear().type("running");
    cy.contains("button", "OK").click();

    cy.get("[data-cy^='log-row-']").each(($el) => {
      cy.wrap($el).contains("running", { matchCase: false });
    });
  });
});
