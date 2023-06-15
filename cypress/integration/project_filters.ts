describe("project filters", () => {
  const spruceLogLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  const resmokeLogLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";

  beforeEach(() => {
    cy.resetDrawerState();
  });

  it("should show a message if there are no filters", () => {
    cy.visit(spruceLogLink);
    cy.contains("View project filters").click();
    cy.dataCy("project-filter").should("not.exist");
    cy.dataCy("no-filters-message").should("be.visible");
  });

  it("should be able to apply a filter", () => {
    cy.visit(resmokeLogLink);
    cy.contains("View project filters").click();
    cy.getInputByLabel("D\\d").check({ force: true });
    cy.contains("button", "Apply filters").click();
    cy.location("search").should("contain", "111D%255Cd");
    cy.get("[data-cy^='collapsed-row-']").should("exist");
  });

  it("should disable checkbox if filter is already applied", () => {
    cy.visit(`${resmokeLogLink}?filters=100D%255Cd`);
    cy.contains("View project filters").click();
    cy.getInputByLabel("D\\d").should("be.disabled");
  });
});
