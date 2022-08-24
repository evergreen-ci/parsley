// This file can be deleted later.

describe("Basic evergreen test log view", () => {
  beforeEach(() => {
    cy.visit("/test/task_0/0/test_0");
  });

  it("should be able to see the log page", () => {
    cy.contains("EVERGREEN_TEST_LOGS").should("be.visible");
  });
});
