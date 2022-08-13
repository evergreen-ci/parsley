const LOGIN_COOKIE = "parsley-token";
const toastDataCy = "toast";
const loginURL = "http://localhost:5173/login";
const user = {
  username: "admin",
  password: "password",
};

Cypress.Commands.add("dataCy", (value: string) => {
  cy.get(`[data-cy=${value}]`);
});

Cypress.Commands.add("getInputByLabel", (label: string) => {
  cy.contains("label", label)
    .invoke("attr", "for")
    .then((id) => {
      cy.get(`#${id}`);
    })
  }
);

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
