import { fail } from "assert";

const LOGIN_COOKIE = "mci-token";
const loginURL = "http://localhost:9090/login";
const user = {
  username: "admin",
  password: "password",
};

const toastDataCy = "toast";

Cypress.Commands.add("dataCy", (value: string) => {
  cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add("getInputByLabel", (label: string) => {
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    });
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
    }
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

Cypress.Commands.add("login", () => {
  cy.getCookie(LOGIN_COOKIE).then((c) => {
    if (!c) {
      cy.request("POST", loginURL, { ...user });
    }
  });
});

Cypress.Commands.add("preserveCookies", () => {
  Cypress.Cookies.preserveOnce(LOGIN_COOKIE, "mci-session");
});
