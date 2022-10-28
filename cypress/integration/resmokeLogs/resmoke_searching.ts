describe("Searching", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";

  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.toggleDrawer();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
  });

  it("searching for a term should highlight matching words ", () => {
    cy.dataCy("searchbar-input").type("ShardedClusterFixture:job0:mongos0 ");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should(
      "contain.text",
      "ShardedClusterFixture:job0:mongos0 "
    );
  });

  it("searching for a term should snap the matching line to the top of the window", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("REPL_HB");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1484");
    cy.get("[data-highlighted='true']").should("contain.text", "REPL_HB");
  });

  it("should be able to specify a range of lines to search", () => {
    cy.toggleDetailsPanel(true);
    cy.dataCy("range-upper-bound").should("be.visible");
    cy.dataCy("range-upper-bound").type("25");
    cy.toggleDetailsPanel(false);
    cy.dataCy("search-count").should("contain.text", "1/7");
    cy.toggleDetailsPanel(true);
    cy.dataCy("range-lower-bound").should("be.visible");
    cy.dataCy("range-lower-bound").type("25");
    cy.toggleDetailsPanel(false);
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.toggleDetailsPanel(true);
    cy.dataCy("range-lower-bound").clear();
    cy.dataCy("range-upper-bound").clear();
    cy.toggleDetailsPanel(false);
    cy.dataCy("search-count").should("contain.text", "1/1484");
  });
  it("should be able to toggle case sensitivity", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("Mongos0");
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.toggleDetailsPanel(true);
    cy.dataCy("case-sensitive-toggle").should("be.visible");
    cy.dataCy("case-sensitive-toggle").should(
      "have.attr",
      "aria-checked",
      "false"
    );
    cy.dataCy("case-sensitive-toggle").click({ force: true });
    cy.dataCy("case-sensitive-toggle").should(
      "have.attr",
      "aria-checked",
      "true"
    );
    cy.toggleDetailsPanel(false);
    cy.dataCy("search-count").should("contain.text", "No Matches");
    cy.toggleDetailsPanel(true);
    cy.dataCy("case-sensitive-toggle").click({ force: true });
    cy.dataCy("case-sensitive-toggle").should(
      "have.attr",
      "aria-checked",
      "false"
    );
    cy.toggleDetailsPanel(false);
    cy.dataCy("search-count").should("contain.text", "1/1");
  });

  it("should be able to paginate through search results", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("conn49");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/8");
    // Click the button 8 times
    for (let i = 1; i <= 7; i++) {
      cy.dataCy("next-button").click();
      cy.dataCy("search-count").should("contain.text", `${i + 1}/8`);
    }
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "1/8");
    for (let i = 7; i >= 0; i--) {
      cy.dataCy("previous-button").click();
      cy.dataCy("search-count").should("contain.text", `${i + 1}/8`);
    }
  });

  it("should be able to search on filtered content", () => {
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("conn49");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/8");
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("conn49");
    cy.dataCy("searchbar-input").type("{enter}");
    cy.get("[data-cy^='collapsed-row-']").should("exist");
    cy.get("[data-cy^='collapsed-row-']").should("have.length", 7);
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("NETWORK");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/7");
  });
});
