describe("project filters", () => {
  const spruceLogLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  const resmokeLogLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e17b99558fd9c5e2faf70a00d15d";

  beforeEach(() => {
    cy.resetDrawerState();
  });

  it("should show a message if there are no filters", () => {
    cy.visit(spruceLogLink);
    cy.contains("View project filters").click();
    cy.dataCy("project-filters-modal").should("be.visible");
    cy.dataCy("project-filter").should("not.exist");
    cy.dataCy("no-filters-message").should("be.visible");
  });

  it("should be able to apply a filter", () => {
    cy.visit(resmokeLogLink);
    cy.contains("View project filters").click();
    cy.dataCy("project-filters-modal").should("be.visible");
    cy.getInputByLabel("(NETWORK|ASIO|EXECUTOR|CONNPOOL|REPL_HB)").check({
      force: true,
    });
    cy.contains("button", "Apply filters").click();
    cy.location("search").should(
      "contain",
      "111%28NETWORK%257CASIO%257CEXECUTOR%257CCONNPOOL%257CREPL_HB%29",
    );
    cy.get("[data-cy^='collapsed-row-']").should("exist");
  });

  it("should disable checkbox if filter is already applied", () => {
    cy.visit(`${resmokeLogLink}?filters=100D%255Cd`);
    cy.contains("View project filters").click();
    cy.dataCy("project-filters-modal").should("be.visible");
    cy.getInputByLabel("D\\d").should("be.disabled");
  });
});
