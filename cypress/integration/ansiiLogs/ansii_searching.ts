describe("Searching", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  beforeEach(() => {
    cy.login();
    cy.setCookie("has-opened-drawer", "true");
    cy.visit(logLink);
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
  });

  it("searching for a term should highlight matching words ", () => {
    cy.dataCy("searchbar-input").type("Starting");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should("contain.text", "Starting");
  });

  it("searching for a term should snap the matching line to the top of the window", () => {
    cy.dataCy("searchbar-input").type("info");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/4");
    cy.get("[data-highlighted='true']").should("contain.text", "info");
  });

  it("should be able to specify a range of lines to search", () => {
    cy.dataCy("searchbar-input").type("info");

    cy.toggleDetailsPanel(true);
    cy.dataCy("range-upper-bound").should("be.visible");
    cy.dataCy("range-upper-bound").type("25");
    cy.toggleDetailsPanel(false);
    cy.dataCy("search-count").should("contain.text", "1/2");
    cy.toggleDetailsPanel(true);
    cy.dataCy("range-lower-bound").should("be.visible");
    cy.dataCy("range-lower-bound").type("25");
    cy.toggleDetailsPanel(false);
    cy.dataCy("search-count").should("contain.text", "1/1");
    cy.toggleDetailsPanel(true);
    cy.dataCy("range-lower-bound").clear();
    cy.dataCy("range-upper-bound").clear();
    cy.toggleDetailsPanel(false);
    cy.dataCy("search-count").should("contain.text", "1/4");
  });

  it("should be able to toggle case sensitivity", () => {
    cy.dataCy("searchbar-input").type("starting");
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
    cy.dataCy("searchbar-input").type("info");
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

  it("should be able to search on filtered content", () => {
    cy.dataCy("searchbar-input").type("spruce");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/27");
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("Starting");
    cy.dataCy("searchbar-input").type("{enter}");
    cy.get("[data-cy^='collapsed-row-']").should("exist");
    cy.get("[data-cy^='collapsed-row-']").should("have.length", 1);
    cy.dataCy("searchbar-select").click();
    cy.dataCy("search-option").click();
    cy.dataCy("searchbar-input").clear();
    cy.dataCy("searchbar-input").type("Spruce");
    cy.dataCy("search-count").should("be.visible");
    cy.dataCy("search-count").should("contain.text", "1/1");
  });
});
