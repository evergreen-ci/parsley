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
    // Turn wrapping on through the Details Overlay.
    cy.clickToggle("wrap-toggle");

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
    cy.dataCy("log-line-container").should("contain", "0");
    cy.dataCy("log-line-container").should("contain", "297");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,297");
    cy.dataCy("log-line-container").should("contain", "0");
    cy.dataCy("log-line-container").should("contain", "4");
    cy.dataCy("log-line-container").should("contain", "297");

    cy.dataCy("log-row-4").dblclick();
    cy.dataCy("log-line-container").should("not.contain", "4");
  });

  it("should be able to select and unselect lines", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,297&selectedLine=5");
    cy.dataCy("log-line-container").should("contain", "5");

    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,297");
    cy.dataCy("log-line-container").should("not.contain", "5");
  });

  it("should be able to clear bookmarks", () => {
    cy.dataCy("clear-bookmarks").click();
    cy.location("search").should("equal", "");
  });
});

describe("Filtering", () => {
  before(() => {
    // Turn expandable rows on through the Details Overlay.
    cy.clickToggle("expandable-rows-toggle");
  });

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

    cy.dataCy("searchbar-input").type("notarealfilter{enter}");

    cy.get("[data-cy^='log-row-']").each(($el) => {
      // Matched elements should be one of the bookmarked or selected values
      cy.wrap($el)
        .should("have.attr", "data-cy")
        .and("match", /log-row-(0|5|6)/);
    });
  });
});

describe("expanding collapsed rows", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");

    // Turn expandable rows on through the Details Overlay.
    cy.clickToggle("expandable-rows-toggle");
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
      cy.contains("5 Above and Below").click();
    });

    cy.dataCy("collapsed-row-1-4").should("not.exist");
    cy.dataCy("log-row-1").should("be.visible");
    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-3").should("be.visible");
    cy.dataCy("log-row-4").should("be.visible");
  });
});
