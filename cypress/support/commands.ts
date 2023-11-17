import { fail } from "assert";

const user = {
  username: "admin",
  password: "password",
};
const toastDataCy = "toast";

Cypress.Commands.add("addFilter", (filter: string) => {
  cy.dataCy("searchbar-select").click();
  cy.dataCy("filter-option").click();
  cy.dataCy("searchbar-input")
    .type(`${filter}`)
    .type("{ctrl}", { release: false })
    .type("{enter}");
});

Cypress.Commands.add("addHighlight", (highlight: string) => {
  cy.dataCy("searchbar-select").click();
  cy.dataCy("highlight-option").click();
  cy.dataCy("searchbar-input")
    .type(`${highlight}`)
    .type("{ctrl}", { release: false })
    .type("{enter}");
});

Cypress.Commands.add("addSearch", (search: string) => {
  cy.dataCy("searchbar-input").type(`${search}`);
});

Cypress.Commands.add("clearBounds", () => {
  cy.toggleDetailsPanel(true);

  cy.dataCy("range-lower-bound").clear();
  cy.dataCy("range-upper-bound").clear();

  cy.toggleDetailsPanel(false);
});

Cypress.Commands.add(
  "clickToggle",
  (toggleDataCy: string, enabled: boolean) => {
    cy.toggleDetailsPanel(true);
    cy.dataCy(toggleDataCy).click();
    cy.dataCy(toggleDataCy).should("have.attr", "aria-checked", `${enabled}`);
    cy.toggleDetailsPanel(false);
  }
);

Cypress.Commands.add("dataCy", (value: string) => {
  cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add(
  "editBounds",
  (bounds: { upper: string; lower: string }) => {
    cy.toggleDetailsPanel(true);

    if (bounds.upper !== undefined) {
      cy.dataCy("range-upper-bound").should("be.visible");
      cy.dataCy("range-upper-bound").type(bounds.upper);
    }

    if (bounds.lower !== undefined) {
      cy.dataCy("range-lower-bound").should("be.visible");
      cy.dataCy("range-lower-bound").type(bounds.lower);
    }

    cy.toggleDetailsPanel(false);
  }
);

Cypress.Commands.add(
  "isContainedInViewport",
  { prevSubject: true },
  (subject) => {
    // @ts-ignore - Cypress.state is not typed
    const window = Cypress.$(cy.state("window"));
    const bottom = window.height();
    const right = window.width();
    const rect = subject[0].getBoundingClientRect();

    // All corners of the element must be in the viewport
    expect(rect.top).not.to.be.greaterThan(bottom);
    expect(rect.bottom).not.to.be.greaterThan(bottom);
    expect(rect.left).not.to.be.greaterThan(right);
    expect(rect.right).not.to.be.greaterThan(right);

    return subject;
  }
);

Cypress.Commands.add(
  "isNotContainedInViewport",
  { prevSubject: true },
  (subject) => {
    // @ts-ignore - Cypress.state is not typed
    const window = Cypress.$(cy.state("window"));
    const bottom = window.height();
    const right = window.width();
    const rect = subject[0].getBoundingClientRect();

    // At least one corner of the element must be outside the viewport
    const condition = [
      rect.top < bottom,
      rect.bottom < bottom,
      rect.left < right,
      rect.right < right,
    ];
    let hasOutOfBoundsValue = false;
    for (let i = 0; i < condition.length; i++) {
      if (!condition[i]) {
        hasOutOfBoundsValue = true;
        cy.log(`Out of bounds value: ${i} ${condition[i]}`);
      }
    }
    if (!hasOutOfBoundsValue) {
      fail("Element is contained in the viewport");
    }
  }
);

Cypress.Commands.add("getInputByLabel", (label: string) => {
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    });
});

Cypress.Commands.add("login", () => {
  const args = { ...user };
  cy.session(
    // Username & password can be used as the cache key too
    args,
    () => {
      cy.origin("http://localhost:9090", { args }, ({ password, username }) => {
        cy.request("POST", "/login", { username, password });
      });
    }
  );
});

Cypress.Commands.add("logout", () => {
  cy.origin("http://localhost:9090", () => {
    cy.request({ url: "/logout", followRedirect: false });
  });
});

Cypress.Commands.add("resetDrawerState", () => {
  cy.clearCookie("has-opened-drawer");
});

Cypress.Commands.add("toggleDetailsPanel", (open: boolean) => {
  cy.dataCy("details-button").should("not.have.attr", "aria-disabled", "true");
  if (open) {
    cy.dataCy("details-menu").should("not.exist");
    cy.dataCy("details-button").click();
    cy.dataCy("details-menu").should("be.visible");
  } else {
    cy.dataCy("details-menu").should("be.visible");
    cy.dataCy("details-button").click();
    cy.dataCy("details-menu").should("not.exist");
  }
});

Cypress.Commands.add("toggleDrawer", () => {
  cy.get(`[aria-label="Collapse navigation"]`).click();
});

Cypress.Commands.add(
  "validateToast",
  (status: string, message?: string, shouldClose?: boolean) => {
    cy.dataCy(toastDataCy).should("be.visible");
    cy.dataCy(toastDataCy).should("have.attr", "data-variant", status);
    if (message) {
      cy.dataCy(toastDataCy).contains(message);
    }
    if (shouldClose) {
      cy.dataCy(toastDataCy).within(() => {
        cy.get("button[aria-label='Close Message']").click();
      });
      cy.dataCy(toastDataCy).should("not.exist");
    }
  }
);

Cypress.Commands.add("assertValueCopiedToClipboard", (value: string) => {
  cy.window().then((win) => {
    win.navigator.clipboard.readText().then((text) => {
      expect(text).to.eq(value);
    });
  });
  // This wait is necessary to ensure the clipboard has time to be read
  // eslint-disable-next-line cypress/no-unnecessary-waiting
  cy.wait(50);
});
