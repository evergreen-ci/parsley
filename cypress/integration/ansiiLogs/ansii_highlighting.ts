describe("Highlighting", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.toggleDrawer();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("highlight-option").click();
  });
  it("applying a highlight should highlight the matching words", () => {
    cy.dataCy("searchbar-input").type("@bugsnag/plugin-react@");
    cy.dataCy("searchbar-input").type("{enter}");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should("contain.text", "@bugsnag/plugin-react@");
  });
  it("applying a search to a highlighted line should not overwrite an already highlighted term if the search matches the highlight ", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
    cy.dataCy("searchbar-input").type("@bugsnag/plugin-react");
    cy.dataCy("searchbar-input").type("{enter}");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should("contain.text", "@bugsnag/plugin-react");
  });
  it("should highlight other terms in the log if the search term does not match the highlight", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("info");
    cy.dataCy("searchbar-input").type("{enter}");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 5);
    cy.dataCy("highlight").each(($el) => {
      cy.wrap($el)
        .invoke("text")
        .should("match", /@bugsnag\/plugin-react@|info/);
    });
  });
  it("clearing a search should not clear a highlight", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should("contain.text", "@bugsnag/plugin-react@");
  });
  it("removing a highlight from the sidenav should remove the highlight", () => {
    cy.toggleDrawer();
    cy.dataCy("delete-highlight-button").should("be.visible");
    cy.dataCy("delete-highlight-button").click();
    cy.dataCy("highlight").should("not.exist");
  });
});
