describe("Basic resmoke log view", () => {
  before(() => {
    cy.login();
    cy.visit(
      "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab"
    );
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
  before(() => {
    cy.login();
    cy.visit(
      "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab"
    );
    cy.setCookie("has-opened-drawer", "true");
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,11080");
    cy.dataCy("log-line-container").should("contain", "0");
    cy.dataCy("log-line-container").should("contain", "11080");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,11080");
    cy.dataCy("log-line-container").should("contain", "0");
    cy.dataCy("log-line-container").should("contain", "4");
    cy.dataCy("log-line-container").should("contain", "11080");

    cy.dataCy("log-row-4").dblclick();
    cy.dataCy("log-line-container").should("not.contain", "4");
  });

  it("should be able to select and unselect lines", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11080&selectedLine=5");
    cy.dataCy("log-line-container").should("contain", "5");

    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11080");
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

    cy.get("[data-cy^='log-row-']").each(($el) => {
      cy.wrap($el).contains("starting", { matchCase: false });
    });
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

    cy.get("[data-cy^='log-row-']").each(($el) => {
      // Matched elements should be one of the bookmarked or selected values
      cy.wrap($el)
        .should("have.attr", "data-cy")
        .and("match", /log-row-(0|5|6|11080)/);
    });
  });

  it("should be able to edit filters", () => {
    cy.get(`[aria-label="Edit filter button"]`).click();
    cy.dataCy("edit-filter-name").type("js_test");
    cy.contains("button", "OK").click();
    cy.dataCy("log-row-0").should("be.visible");
  });
});
