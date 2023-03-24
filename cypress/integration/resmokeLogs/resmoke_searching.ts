describe("Searching", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";

  beforeEach(() => {
    cy.visit(logLink);
  });

  it("searching for a term should highlight matching words ", () => {
    cy.addSearch("ShardedClusterFixture:job0:mongos0 ");
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
    cy.addSearch("REPL_HB");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1484");
    cy.get("[data-highlighted='true']").should("contain.text", "REPL_HB");
  });

  it("should be able to specify a range of lines to search", () => {
    cy.addSearch("REPL_HB");
    cy.editBounds({ upper: "25" });
    cy.dataCy("search-count").should("contain.text", "1/7");
    cy.editBounds({ lower: "25" });
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.clearBounds();
    cy.dataCy("search-count").should("contain.text", "1/1484");
  });

  it("should be able to toggle case sensitivity", () => {
    cy.addSearch("Mongos0");
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.clickToggle("case-sensitive-toggle", true);
    cy.dataCy("search-count").should("contain.text", "No Matches");
    cy.clickToggle("case-sensitive-toggle", false);
    cy.dataCy("search-count").should("contain.text", "1/1");
  });

  it("should be able to paginate through search results", () => {
    cy.addSearch("conn49");
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

  it.skip("should not reset search index when a bookmark is applied", () => {
    cy.addSearch("conn49");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/8");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "2/8");
    cy.dataCy("log-row-112").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,112,11079");
    cy.dataCy("search-count").should("contain.text", "2/8");
  });

  it("should be able to search on filtered content", () => {
    cy.addFilter("conn49");
    cy.get("[data-cy^='collapsed-row-']").should("exist");
    cy.get("[data-cy^='collapsed-row-']").should("have.length", 7);

    cy.addSearch("NETWORK");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/7");
  });
});
