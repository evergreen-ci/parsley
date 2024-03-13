xdescribe("Test log rendering type", () => {
  const logLink =
    "/test/evergreen_ubuntu1604_test_model_5e823e1f28baeaa22ae00823d83e03082cd148ab_20_02_20_20_37_06/0/TestHostTaskAuditing";

  beforeEach(() => {
    cy.visit(logLink);
  });

  it("An Evergreen test log with renderingType specified as 'resmoke' implements resmoke rendering logic", () => {
    cy.dataCy("resmoke-row").should("be.visible");
    cy.dataCy("ansi-row").should("not.exist");
  });
});
