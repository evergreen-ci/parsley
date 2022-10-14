describe("Filtering", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  const comma = "%2C";

  describe("Applying filters", () => {
    describe("Basic filtering", () => {
      before(() => {
        cy.login();
        cy.visit(logLink);
        cy.setCookie("has-opened-drawer", "true");
        cy.get(".ReactVirtualized__Grid").should("be.visible");
        // Bookmark and select a line, with the expectation that they won't be collapsed by the filter.
        cy.dataCy("log-link-5").click();
        cy.dataCy("log-row-6").dblclick();
        cy.location("search").should(
          "equal",
          "?bookmarks=0,6,11079&selectedLine=5"
        );
      });

      it("should not collapse bookmarks and selected line", () => {
        // Apply a filter that doesn't satisfy any log line.
        cy.addFilter("notarealfilter");
        cy.location("search").should(
          "equal",
          "?bookmarks=0,6,11079&filters=100notarealfilter&selectedLine=5"
        );
        // Matched elements should be one of the bookmarked or selected values
        cy.get("[data-cy^='log-row-']").each(($el) => {
          cy.wrap($el)
            .should("have.attr", "data-cy")
            .and("match", /log-row-(0|5|6|11079)/);
        });
      });
    });

    describe("Advanced filtering", () => {
      describe("filtering mode is AND", () => {
        before(() => {
          cy.login();
          cy.visit(logLink);
          cy.setCookie("has-opened-drawer", "true");
          cy.dataCy("clear-bookmarks").click();
          cy.location("search").should("equal", "");
        });

        it("should be able to apply two default filters (case insensitive, exact match)", () => {
          cy.addFilter("NETWORK");
          cy.addFilter("metadata");
          cy.location("search").should(
            "equal",
            `?filters=100NETWORK${comma}100metadata`
          );

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el).contains("NETWORK", { matchCase: false });
            cy.wrap($el).contains("metadata", { matchCase: false });
          });
        });

        it("should be able to toggle case sensitivity", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-NETWORK").within(() => {
            cy.contains("Sensitive").click();
          });
          cy.location("search").should(
            "equal",
            `?filters=110NETWORK${comma}100metadata`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el).contains("NETWORK", { matchCase: true });
            cy.wrap($el).contains("metadata", { matchCase: false });
          });
        });

        it("should be able to toggle inverse matching", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-metadata").within(() => {
            cy.contains("Inverse").click();
          });
          cy.location("search").should(
            "equal",
            `?filters=110NETWORK${comma}101metadata`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el).contains("NETWORK", { matchCase: true });
            cy.wrap($el).should("not.contain.text", "metadata");
          });
        });

        it("should be able to toggle visibility", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-NETWORK").within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.dataCy("filter-metadata").within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.location("search").should(
            "equal",
            `?filters=010NETWORK${comma}001metadata`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='collapsed-row-']").should("not.exist");
        });
      });

      describe("filtering mode is OR", () => {
        before(() => {
          cy.login();
          cy.visit(logLink);
          cy.setCookie("has-opened-drawer", "true");
          cy.dataCy("clear-bookmarks").click();
          cy.location("search").should("equal", "");

          cy.dataCy("details-button").click();
          cy.dataCy("filter-logic-toggle").click();
          cy.dataCy("details-button").click();
        });

        it("should be able to apply two default filters (case insensitive, exact match)", () => {
          cy.addFilter("NETWORK");
          cy.addFilter("metadata");
          cy.location("search").should(
            "equal",
            `?filterLogic=or&filters=100NETWORK${comma}100metadata`
          );

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el)
              .invoke("text")
              .should("match", /NETWORK|metadata/i);
          });
        });

        it("should be able to toggle case sensitivity", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-NETWORK").within(() => {
            cy.contains("Sensitive").click();
          });
          cy.location("search").should(
            "equal",
            `?filterLogic=or&filters=110NETWORK${comma}100metadata`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el)
              .invoke("text")
              .should(
                "satisfy",
                (text: string) =>
                  text.match(/NETWORK/) || text.match(/metadata/i)
              );
          });
        });

        it("should be able to toggle inverse matching", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-metadata").within(() => {
            cy.contains("Inverse").click();
          });
          cy.location("search").should(
            "equal",
            `?filterLogic=or&filters=110NETWORK${comma}101metadata`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el)
              .invoke("text")
              .should(
                "satisfy",
                (text: string) =>
                  text.match(/NETWORK/) || !text.match(/metadata/i)
              );
          });
        });

        it("should be able to toggle visibility", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-NETWORK").within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.dataCy("filter-metadata").within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.location("search").should(
            "equal",
            `?filterLogic=or&filters=010NETWORK${comma}001metadata`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='collapsed-row-']").should("not.exist");
        });
      });
    });
  });

  describe("Deleting and editing filters", () => {
    before(() => {
      cy.login();
      cy.visit(logLink);
      cy.setCookie("has-opened-drawer", "true");
      cy.dataCy("clear-bookmarks").click();
      cy.location("search").should("equal", "");
    });

    it("should be able to edit a filter", () => {
      cy.addFilter("notarealfilter");
      cy.location("search").should("equal", "?filters=100notarealfilter");

      cy.get("[data-cy^='log-row-']").should("not.exist");

      cy.toggleDrawer();
      cy.dataCy("filter-notarealfilter").within(() => {
        cy.get(`[aria-label="Edit filter"]`).click();
      });
      cy.dataCy("edit-filter-name").clear().type("NETWORK");
      cy.contains("button", "OK").click();
      cy.location("search").should("equal", "?filters=100NETWORK");
      cy.toggleDrawer();

      cy.get("[data-cy^='log-row-']").each(($el) => {
        cy.wrap($el).contains("NETWORK", { matchCase: false });
      });
    });

    it("should be able to delete a filter", () => {
      cy.toggleDrawer();
      cy.dataCy("filter-NETWORK").within(() => {
        cy.get(`[aria-label="Delete filter"]`).click();
      });
      cy.location("search").should("equal", "");
      cy.toggleDrawer();

      cy.get("[data-cy^='collapsed-row-']").should("not.exist");
    });
  });
});
