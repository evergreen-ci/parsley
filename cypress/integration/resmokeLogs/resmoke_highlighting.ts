describe("Highlighting", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";

  beforeEach(() => {
    cy.visit(logLink);
  });

  it("applying a highlight should highlight matching words ", () => {
    cy.addHighlight("ShardedClusterFixture:job0:mongos0 ");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should(
      "contain.text",
      "ShardedClusterFixture:job0:mongos0 "
    );
  });

  it("applying a search to a highlighted line should not overwrite an already highlighted term if the search matches the highlight", () => {
    cy.addHighlight("ShardedClusterFixture:job0:mongos0 ");
    cy.addSearch("ShardedClusterFixture:job0:mongos0 ");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 1);
    cy.dataCy("highlight").should(
      "contain.text",
      "ShardedClusterFixture:job0:mongos0 "
    );
  });
  it("should highlight other terms in the log if the search term does not match the highlight", () => {
    cy.addHighlight("ShardedClusterFixture:job0:mongos0 ");
    cy.addSearch("ShardedClusterFixture:job0:shard0:node1");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 2);
    cy.dataCy("highlight").each(($el) => {
      cy.wrap($el)
        .invoke("text")
        .should(
          "match",
          /ShardedClusterFixture:job0:mongos0|ShardedClusterFixture:job0:shard0:node1/
        );
    });
  });
  it("removing a highlight from the side panel should remove the highlight", () => {
    cy.addHighlight("ShardedClusterFixture:job0:shard0:node1");
    cy.dataCy("highlight").should("exist");
    cy.toggleDrawer();
    cy.dataCy("delete-highlight-button").should("be.visible");
    cy.dataCy("delete-highlight-button").click();
    cy.dataCy("highlight").should("not.exist");
  });
  it("applying multiple highlights should use different colors", () => {
    cy.addHighlight("ShardedClusterFixture:job0:mongos0 ");
    cy.addHighlight("ShardedClusterFixture:job0:shard0:node1");
    cy.dataCy("highlight").should("exist");
    cy.dataCy("highlight").should("have.length", 2);
    cy.dataCy("highlight").each(($el) => {
      cy.wrap($el)
        .invoke("text")
        .should(
          "match",
          /ShardedClusterFixture:job0:mongos0|ShardedClusterFixture:job0:shard0:node1/
        );
    });
    const colors = new Set();
    cy.dataCy("highlight")
      .each(($el) => {
        cy.log("el", $el);
        cy.wrap($el).then(($e) => {
          colors.add($e.css("background-color"));
        });
      })
      .then(() => {
        expect(colors.size).to.eq(2);
      });
  });
});
