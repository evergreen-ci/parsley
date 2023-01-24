describe("Filtering", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e17b99558fd9c5e2faf70a00d15d";

  describe("Applying filters", () => {
    describe("Basic filtering", () => {
      beforeEach(() => {
        cy.visit(logLink);
        cy.get(".ReactVirtualized__Grid").should("be.visible");
      });

      it("should not collapse bookmarks and share line", () => {
        cy.dataCy("log-link-5").click();
        cy.dataCy("log-row-6").dblclick();
        cy.location("search").should("equal", "?bookmarks=0,6,130&shareLine=5");
        cy.addFilter("doesNotMatchAnything");
        cy.get("[data-cy^='log-row-']").each(($el) => {
          cy.wrap($el)
            .should("have.attr", "data-cy")
            .and("match", /log-row-(0|5|6|130)/);
        });
      });
    });

    describe("Advanced filtering", () => {
      const filter1 = "deleted";
      const filter2 = "session";

      describe("filtering mode is AND", () => {
        beforeEach(() => {
          cy.setCookie("has-opened-drawer", "false");
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
            .not("[data-bookmarked=true]")
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
            .not("[data-bookmarked=true]")
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
            .not("[data-bookmarked='true']")
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
          cy.setCookie("has-opened-drawer", "false");
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
            .not("[data-bookmarked=true]")
            .each(($el) => {
              cy.wrap($el)
                .invoke("text")
                .should("match", /deleted|session/i);
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
            .not("[data-bookmarked=true]")
            .each(($el) => {
              cy.wrap($el)
                .invoke("text")
                .should(
                  "satisfy",
                  (text: string) =>
                    text.match(/deleted/) || text.match(/session/i)
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
            .not("[data-bookmarked=true]")
            .each(($el) => {
              cy.wrap($el)
                .invoke("text")
                .should(
                  "satisfy",
                  (text: string) =>
                    text.match(/deleted/) || !text.match(/session/i)
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
    const filter = "doesNotMatchAnything";

    beforeEach(() => {
      cy.setCookie("has-opened-drawer", "false");
      cy.visit(`${logLink}?filters=100${filter}`);
      cy.get("[data-cy^='collapsed-row-']").should("exist");
    });

    it("should be able to edit a filter", () => {
      cy.dataCy(`filter-${filter}`).within(() => {
        cy.get(`[aria-label="Edit filter"]`).click();
      });
      cy.dataCy("edit-filter-name").clear().type("session");
      cy.contains("button", "Apply").click();
      cy.location("search").should("contain", "filters=100session");
      cy.get("[data-cy^='log-row-']")
        .not("[data-bookmarked=true]")
        .each(($el) => {
          cy.wrap($el).contains("session", { matchCase: false });
        });
    });

    it("should be able to delete a filter", () => {
      cy.dataCy(`filter-${filter}`).within(() => {
        cy.get(`[aria-label="Delete filter"]`).click();
      });
      cy.location("search").should("not.contain", "filters");
      cy.get("[data-cy^='collapsed-row-']").should("not.exist");
    });
  });
});
