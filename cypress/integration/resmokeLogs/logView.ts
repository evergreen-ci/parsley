// This file can be deleted later.

describe("Basic resmoke log view", () => {
  beforeEach(() => {
    cy.visit("/resmoke/build_0/test_0");
  });

  it("should be able to see the log page", () => {
    cy.contains("RESMOKE_LOGS").should("be.visible");
  });
});
