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
