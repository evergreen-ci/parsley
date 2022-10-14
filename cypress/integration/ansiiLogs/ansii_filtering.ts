describe("Filtering", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
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
          "?bookmarks=0,6,297&selectedLine=5"
        );
      });

      it("should not collapse bookmarks and selected line", () => {
        // Apply a filter that doesn't satisfy any log line.
        cy.addFilter("notarealfilter");
        cy.location("search").should(
          "equal",
          "?bookmarks=0,6,297&filters=100notarealfilter&selectedLine=5"
        );
        // Matched elements should be one of the bookmarked or selected values
        cy.get("[data-cy^='log-row-']").each(($el) => {
          cy.wrap($el)
            .should("have.attr", "data-cy")
            .and("match", /log-row-(0|5|6|297)/);
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
          cy.addFilter("Warning");
          cy.addFilter("storybook");
          cy.location("search").should(
            "equal",
            `?filters=100Warning${comma}100storybook`
          );

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el).contains("Warning", { matchCase: false });
            cy.wrap($el).contains("storybook", { matchCase: false });
          });
        });

        it("should be able to toggle case sensitivity", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-Warning").within(() => {
            cy.contains("Sensitive").click();
          });
          cy.location("search").should(
            "equal",
            `?filters=110Warning${comma}100storybook`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el).contains("Warning", { matchCase: true });
            cy.wrap($el).contains("storybook", { matchCase: false });
          });
        });

        it("should be able to toggle inverse matching", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-storybook").within(() => {
            cy.contains("Inverse").click();
          });
          cy.location("search").should(
            "equal",
            `?filters=110Warning${comma}101storybook`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el).contains("Warning", { matchCase: true });
            cy.wrap($el).should("not.contain.text", "storybook");
          });
        });

        it("should be able to toggle visibility", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-Warning").within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.dataCy("filter-storybook").within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.location("search").should(
            "equal",
            `?filters=010Warning${comma}001storybook`
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
          cy.addFilter("Warning");
          cy.addFilter("storybook");
          cy.location("search").should(
            "equal",
            `?filterLogic=or&filters=100Warning${comma}100storybook`
          );

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el)
              .invoke("text")
              .should("match", /Warning|storybook/i);
          });
        });

        it("should be able to toggle case sensitivity", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-Warning").within(() => {
            cy.contains("Sensitive").click();
          });
          cy.location("search").should(
            "equal",
            `?filterLogic=or&filters=110Warning${comma}100storybook`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el)
              .invoke("text")
              .should(
                "satisfy",
                (text: string) =>
                  text.match(/Warning/) || text.match(/storybook/i)
              );
          });
        });

        it("should be able to toggle inverse matching", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-storybook").within(() => {
            cy.contains("Inverse").click();
          });
          cy.location("search").should(
            "equal",
            `?filterLogic=or&filters=110Warning${comma}101storybook`
          );
          cy.toggleDrawer();

          cy.get("[data-cy^='log-row-']").each(($el) => {
            cy.wrap($el)
              .invoke("text")
              .should(
                "satisfy",
                (text: string) =>
                  text.match(/Warning/) || !text.match(/storybook/i)
              );
          });
        });

        it("should be able to toggle visibility", () => {
          cy.toggleDrawer();
          cy.dataCy("filter-Warning").within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.dataCy("filter-storybook").within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.location("search").should(
            "equal",
            `?filterLogic=or&filters=010Warning${comma}001storybook`
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
      cy.dataCy("edit-filter-name").clear().type("running");
      cy.contains("button", "OK").click();
      cy.location("search").should("equal", "?filters=100running");
      cy.toggleDrawer();

      cy.get("[data-cy^='log-row-']").each(($el) => {
        cy.wrap($el).contains("running", { matchCase: false });
      });
    });

    it("should be able to delete a filter", () => {
      cy.toggleDrawer();
      cy.dataCy("filter-running").within(() => {
        cy.get(`[aria-label="Delete filter"]`).click();
      });
      cy.location("search").should("equal", "");
      cy.toggleDrawer();

      cy.get("[data-cy^='collapsed-row-']").should("not.exist");
    });
  });
});
