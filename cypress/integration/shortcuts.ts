// Follow guidance from https://docs.cypress.io/api/commands/type#Global-Shortcuts.
describe("Shortcuts", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should be able to open the modal using keyboard shortcut", () => {
    cy.dataCy("shortcut-modal").should("not.exist");
    cy.get("body").type("{shift}", { release: false }).type("{?}");
    cy.dataCy("shortcut-modal").should("be.visible");
  });

  it("should be able to open the keyboard shortcut modal by clicking navbar icon button", () => {
    cy.get(`[aria-label="Click to open shortcut modal"]`).click();
    cy.dataCy("shortcut-modal").should("be.visible");
  });
});
