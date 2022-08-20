// This file can be deleted later.

describe("Basic app test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should be able to see the search bar", () => {
    cy.dataCy("searchbar-select").should("exist");
    cy.dataCy("searchbar-input").should("exist");
  });
});
