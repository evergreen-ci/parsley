describe("Parsley Routes", () => {
  beforeEach(() => {
    cy.login();
  });

  it("should load task logs when visiting a task log page", () => {
    const logLink =
      "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
    cy.visit(logLink);
    cy.get("[data-cy^='log-row-']").should("be.visible");
    cy.dataCy("ansii-row").should("be.visible");
    cy.dataCy("resmoke-row").should("not.exist");
    cy.contains("Task logger initialized");
  });
  it("should load test results when visiting a test result page", () => {
    const logLink =
      "/test/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0/JustAFakeTestInALonelyWorld";
    const testLogLine =
      "AssertionError: Timed out retrying after 4000ms: Too many elements found. Found '1', expected '0'";
    cy.visit(logLink);
    cy.get("[data-cy^='log-row-']").should("be.visible");
    cy.dataCy("ansii-row").should("be.visible");
    cy.dataCy("resmoke-row").should("not.exist");
    cy.contains(testLogLine);
  });
  it("should load resmoke logs when visiting a resmoke log page", () => {
    const logLink =
      "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
    const resmokeLogLine =
      "fsm_workload_test:internal_transactions_kill_sessions";
    cy.visit(logLink);
    cy.get("[data-cy^='log-row-']").should("be.visible");
    cy.dataCy("ansii-row").should("not.exist");
    cy.dataCy("resmoke-row").should("be.visible");
    cy.contains(resmokeLogLine);
  });
  it("visiting a non existent page should 404", () => {
    cy.visit("/this/is/not/a/real/page");
    cy.contains("404");
  });
});
