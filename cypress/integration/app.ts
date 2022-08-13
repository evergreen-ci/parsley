// This file can be deleted later.

describe("Basic app test", () => {
  beforeEach(() => {
    cy.visit("/");
  })

  it("allows interacting with the count button", () => {
    cy.contains("count is 0").should("be.visible");
    cy.dataCy("app-button").should("exist").should("not.be.disabled");
    cy.dataCy("app-button").click();
    cy.contains("count is 1").should("be.visible");
  });
})