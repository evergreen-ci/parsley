describe("Filtering", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

  describe("Applying filters", () => {
    describe("Basic filtering", () => {
      beforeEach(() => {
        cy.login();
        cy.setCookie("has-opened-drawer", "true");
        cy.visit(logLink);
        cy.get(".ReactVirtualized__Grid").should("be.visible");
      });

      it("should not collapse bookmarks and selected line", () => {
        // Bookmark and select a line, with the expectation that they won't be collapsed by the filter.
        cy.dataCy("log-link-5").click();
        cy.dataCy("log-row-6").dblclick();
        cy.location("search").should(
          "equal",
          "?bookmarks=0,6,297&selectedLine=5"
        );
        // Apply a filter that doesn't satisfy any log line.
        cy.addFilter("notarealfilter");
        // Matched elements should be one of the bookmarked or selected values.
        cy.get("[data-cy^='log-row-']").each(($el) => {
          cy.wrap($el)
            .should("have.attr", "data-cy")
            .and("match", /log-row-(0|5|6|297)/);
        });
      });
    });

    describe("Advanced filtering", () => {
      const filter1 = "Warning";
      const filter2 = "storybook";

      describe("filtering mode is AND", () => {
        beforeEach(() => {
          cy.login();
        });

        it("should be able to apply two default filters (case insensitive, exact match)", () => {
          cy.visit(`${logLink}?filterLogic=and`);
          cy.addFilter(filter1);
          cy.addFilter(filter2);
          cy.location("search").should(
            "contain",
            `filters=100${filter1},100${filter2}`
          );
          cy.get("[data-cy^='log-row-']")
            .not("[data-cy='log-row-0']")
            .not("[data-cy='log-row-297']")
            .each(($el) => {
              cy.wrap($el).contains(filter1, { matchCase: false });
              cy.wrap($el).contains(filter2, { matchCase: false });
            });
        });

        it("should be able to toggle case sensitivity", () => {
          cy.visit(
            `${logLink}?filterLogic=and&filters=100${filter1},100${filter2}`
          );
          cy.dataCy(`filter-${filter1}`).within(() => {
            cy.contains("Sensitive").click();
          });
          cy.location("search").should(
            "contain",
            `filters=110${filter1},100${filter2}`
          );
          cy.get("[data-cy^='log-row-']")
            .not("[data-cy='log-row-0']")
            .not("[data-cy='log-row-297']")
            .each(($el) => {
              cy.wrap($el).contains(filter1, { matchCase: true });
              cy.wrap($el).contains(filter2, { matchCase: false });
            });
        });

        it("should be able to toggle inverse matching", () => {
          cy.visit(
            `${logLink}?filterLogic=and&filters=110${filter1},100${filter2}`
          );
          cy.dataCy(`filter-${filter2}`).within(() => {
            cy.contains("Inverse").click();
          });
          cy.location("search").should(
            "contain",
            `filters=110${filter1},101${filter2}`
          );
          cy.get("[data-cy^='log-row-']")
            .not("[data-cy='log-row-0']")
            .not("[data-cy='log-row-297']")
            .each(($el) => {
              cy.wrap($el).contains(filter1, { matchCase: true });
              cy.wrap($el).should("not.contain.text", filter2);
            });
        });

        it("should be able to toggle visibility", () => {
          cy.visit(
            `${logLink}?filterLogic=and&filters=110${filter1},101${filter2}`
          );
          cy.dataCy(`filter-${filter1}`).within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.dataCy(`filter-${filter2}`).within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.location("search").should(
            "contain",
            `filters=010${filter1},001${filter2}`
          );
          cy.get("[data-cy^='collapsed-row-']").should("not.exist");
        });
      });

      describe("filtering mode is OR", () => {
        beforeEach(() => {
          cy.login();
        });

        it("should be able to apply two default filters (case insensitive, exact match)", () => {
          cy.visit(`${logLink}?filterLogic=or`);
          cy.addFilter(filter1);
          cy.addFilter(filter2);
          cy.location("search").should(
            "contain",
            `filters=100${filter1},100${filter2}`
          );
          cy.get("[data-cy^='log-row-']")
            .not("[data-cy='log-row-0']")
            .not("[data-cy='log-row-297']")
            .each(($el) => {
              cy.wrap($el)
                .invoke("text")
                .should("match", /Warning|storybook/i);
            });
        });

        it("should be able to toggle case sensitivity", () => {
          cy.visit(
            `${logLink}?filterLogic=or&filters=100${filter1},100${filter2}`
          );
          cy.dataCy(`filter-${filter1}`).within(() => {
            cy.contains("Sensitive").click();
          });
          cy.location("search").should(
            "contain",
            `filters=110${filter1},100${filter2}`
          );
          cy.get("[data-cy^='log-row-']")
            .not("[data-cy='log-row-0']")
            .not("[data-cy='log-row-297']")
            .each(($el) => {
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
          cy.visit(
            `${logLink}?filterLogic=or&filters=110${filter1},100${filter2}`
          );
          cy.dataCy(`filter-${filter2}`).within(() => {
            cy.contains("Inverse").click();
          });
          cy.location("search").should(
            "contain",
            `filters=110${filter1},101${filter2}`
          );
          cy.get("[data-cy^='log-row-']")
            .not("[data-cy='log-row-0']")
            .not("[data-cy='log-row-297']")
            .each(($el) => {
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
          cy.visit(
            `${logLink}?filterLogic=or&filters=110${filter1},101${filter2}`
          );
          cy.dataCy(`filter-${filter1}`).within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.dataCy(`filter-${filter2}`).within(() => {
            cy.get(`[aria-label="Hide filter"]`).click();
          });
          cy.location("search").should(
            "contain",
            `filters=010${filter1},001${filter2}`
          );
          cy.get("[data-cy^='collapsed-row-']").should("not.exist");
        });
      });
    });
  });

  describe("Deleting and editing filters", () => {
    beforeEach(() => {
      cy.login();
      cy.visit(logLink);
    });

    it("should be able to edit a filter", () => {
      cy.addFilter("notarealfilter");
      cy.location("search").should("contain", "filters=100notarealfilter");

      cy.get("[data-cy^='log-row-']")
        .not("[data-cy='log-row-0']")
        .not("[data-cy='log-row-297']")
        .should("not.exist");

      cy.dataCy("filter-notarealfilter").within(() => {
        cy.get(`[aria-label="Edit filter"]`).click();
      });
      cy.dataCy("edit-filter-name").clear().type("running");
      cy.contains("button", "Apply").click();
      cy.location("search").should("contain", "filters=100running");

      cy.get("[data-cy^='log-row-']")
        .not("[data-cy='log-row-0']")
        .not("[data-cy='log-row-297']")
        .each(($el) => {
          cy.wrap($el).contains("running", { matchCase: false });
        });
    });

    it("should be able to delete a filter", () => {
      cy.addFilter("running");
      cy.dataCy("filter-running").within(() => {
        cy.get(`[aria-label="Delete filter"]`).click();
      });
      cy.location("search").should("not.contain", "filters");
      cy.get("[data-cy^='collapsed-row-']").should("not.exist");
    });
  });
});
