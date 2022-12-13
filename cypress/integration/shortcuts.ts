// Follow guidance from https://docs.cypress.io/api/commands/type#Global-Shortcuts.
describe("Shortcuts", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should be able to open and close the keyboard shortcut modal using keyboard shortcut", () => {
    cy.visit("/");
    cy.dataCy("shortcut-modal").should("not.exist");
    cy.get("body").type("{shift}", { release: false }).type("{?}");
    cy.dataCy("shortcut-modal").should("be.visible");
    cy.get("body").type("{shift}", { release: false }).type("{?}");
    cy.dataCy("shortcut-modal").should("not.exist");
  });

  it("should be able to open the keyboard shortcut modal by clicking navbar icon button", () => {
    cy.get(`[aria-label="Click to open shortcut modal"]`).click();
    cy.dataCy("shortcut-modal").should("be.visible");
  });
});
