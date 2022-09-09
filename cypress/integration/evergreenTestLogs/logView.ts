describe("Basic evergreen test log view", () => {
  before(() => {
    cy.visit("/test/task_0/0/test_0");
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
    cy.visit("/evergreen/task_0/0/tasks?wrap=true");
    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-2").should(
      "contain.text",
      "disableLogicalSessionCacheRefresh"
    );
    cy.dataCy("log-row-2").isContainedInViewport();
  });
});

describe("Log interactions", () => {
  before(() => {
    cy.visit("/test/task_0/0/test_0");
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
