// This file can be deleted later.

describe("Basic evergreen log view", () => {
  beforeEach(() => {
    cy.visit("/evergreen/task_0/0/tasks");
  });

  it("should be able to see the log page", () => {
    cy.contains("EVERGREEN_TASK_LOGS").should("be.visible");
  });
});
