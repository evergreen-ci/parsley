// This file can be deleted later.

describe("Basic app test", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should be able to see the loading page", () => {
    cy.contains("I am a loading page");
  });
});
