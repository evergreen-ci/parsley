describe("Basic evergreen log view", () => {
  before(() => {
    cy.visit("/evergreen/task_0/0/tasks");
  });

  it("should be able to see log lines", () => {
    cy.dataCy("log-row-0").should("be.visible");
  });
  it("should render ansii lines", () => {
    cy.dataCy("ansii-row").should("be.visible");
  });
  it("by default should have wrapping turned off and should be able to scroll horizontally", () => {
    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-2").should(
      "contain.text",
      "disableLogicalSessionCacheRefresh"
    );
    cy.dataCy("log-row-2").isNotContainedInViewport();
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

    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-2").should(
      "contain.text",
      "disableLogicalSessionCacheRefresh"
    );
    cy.dataCy("log-row-2").isContainedInViewport();
  });
});

describe("Bookmarking and selecting lines", () => {
  before(() => {
    cy.visit("/evergreen/task_0/0/tasks");
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,7");
    cy.dataCy("log-line-container").should("contain", "0");
    cy.dataCy("log-line-container").should("contain", "7");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,7");
    cy.dataCy("log-line-container").should("contain", "0");
    cy.dataCy("log-line-container").should("contain", "4");
    cy.dataCy("log-line-container").should("contain", "7");

    cy.dataCy("log-row-7").dblclick();
    cy.dataCy("log-line-container").should("not.contain", "7");
  });

  it("should be able to select and unselect lines", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,4&selectedLine=5");
    cy.dataCy("log-line-container").should("contain", "5");

    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,4");
    cy.dataCy("log-line-container").should("not.contain", "5");
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

    cy.dataCy("log-row-0").should("be.visible");
    cy.dataCy("log-row-1").should("be.visible");
    cy.dataCy("log-row-2").should("not.exist");
    cy.dataCy("log-row-3").should("not.exist");
    cy.dataCy("log-row-4").should("be.visible");
    cy.dataCy("log-row-5").should("not.exist");
    cy.dataCy("log-row-6").should("not.exist");
    cy.dataCy("log-row-7").should("be.visible");
  });

  it("should preserve applied bookmarks and selected lines even if they don't match the filters", () => {
    // Delete the filters from the drawer.
    cy.toggleNavBar();
    cy.get(`[aria-label="Delete filter button"]`).click();

    // Select a line, with the expectation that it won't be collapsed by the filter.
    cy.dataCy("log-link-5").click();
    // Bookmark a line, with the expecation that it won't be collapsed by the filter.
    cy.dataCy("log-row-6").dblclick();

    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("notarealfilter{enter}");

    cy.dataCy("log-row-0").should("not.exist");
    cy.dataCy("log-row-1").should("not.exist");
    cy.dataCy("log-row-2").should("not.exist");
    cy.dataCy("log-row-3").should("not.exist");
    cy.dataCy("log-row-4").should("not.exist");
    cy.dataCy("log-row-5").should("be.visible");
    cy.dataCy("log-row-6").should("be.visible");
    cy.dataCy("log-row-7").should("not.exist");
  });

  it("should be able to edit filters", () => {
    cy.get(`[aria-label="Edit filter button"]`).click();
    cy.dataCy("edit-filter-name").type("js_test");
    cy.contains("button", "OK").click();
    cy.dataCy("log-row-0").should("be.visible");
  });
});
