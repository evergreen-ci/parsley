// Follow guidance from https://docs.cypress.io/api/commands/type#Global-Shortcuts.
describe("Shortcuts", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be possible to open and close the keyboard shortcut modal", () => {
    cy.visit("/");
    cy.dataCy("shortcut-modal").should("not.exist");
    cy.get("body").type("{shift}", { release: false }).type("{?}");
    cy.dataCy("shortcut-modal").should("be.visible");
    cy.get("body").type("{shift}", { release: false }).type("{?}");
    cy.dataCy("shortcut-modal").should("not.exist");
  });
});
