describe("Searching", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  beforeEach(() => {
    cy.login();
    cy.setCookie("has-opened-drawer", "true");
    cy.visit(logLink);
  });

  it("searching for a term should highlight matching words ", () => {
    cy.addSearch("Starting");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should("contain.text", "Starting");
  });

  it("searching for a term should snap the matching line to the top of the window", () => {
    cy.addSearch("info");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/4");
    cy.get("[data-highlighted='true']").should("contain.text", "info");
  });

  it("should be able to specify a range of lines to search", () => {
    cy.addSearch("info");
    cy.editBounds({ upper: "25" });
    cy.dataCy("search-count").should("contain.text", "1/2");
    cy.editBounds({ lower: "25" });
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.clearBounds();
    cy.dataCy("search-count").should("contain.text", "1/4");
  });

  it("should be able to toggle case sensitivity", () => {
    cy.addSearch("starting");
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.clickToggle("case-sensitive-toggle", true);
    cy.dataCy("search-count").should("contain.text", "No Matches");
    cy.clickToggle("case-sensitive-toggle", false);
    cy.dataCy("search-count").should("contain.text", "1/1");
  });

  it("should be able to paginate through search results", () => {
    cy.addSearch("info");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "2/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "3/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "4/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "1/4");
    cy.dataCy("previous-button").click();
    cy.dataCy("search-count").should("contain.text", "4/4");
    cy.dataCy("previous-button").click();
    cy.dataCy("search-count").should("contain.text", "3/4");
    cy.dataCy("previous-button").click();
    cy.dataCy("search-count").should("contain.text", "2/4");
    cy.dataCy("previous-button").click();
    cy.dataCy("search-count").should("contain.text", "1/4");
  });

  it("should not reset search index when a bookmark is applied", () => {
    cy.addSearch("info");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/4");
    cy.dataCy("next-button").click();
    cy.dataCy("search-count").should("contain.text", "2/4");
    cy.dataCy("log-row-27").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,27,297");
    cy.dataCy("search-count").should("contain.text", "2/4");
  });

  it("should be able to search on filtered content", () => {
    cy.addFilter("installation");
    cy.get("[data-cy^='collapsed-row-']").should("exist");
    cy.get("[data-cy^='collapsed-row-']").should("have.length", 3);

    cy.addSearch("info");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/2");
  });
});
