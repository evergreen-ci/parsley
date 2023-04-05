describe("auth", () => {
  it("unauthenticated user is redirected to login page", () => {
    cy.logout();
    cy.visit("/upload");
    cy.location("pathname").should("equal", "/login");
  });

  it("redirects user to upload page after logging in", () => {
    cy.logout();
    cy.visit("/upload");
    cy.dataCy("login-username").type("admin");
    cy.dataCy("login-password").type("password");
    cy.dataCy("login-submit").click();
    cy.location("pathname").should("equal", "/upload");
  });

  it("automatically authenticates user if they are logged in", () => {
    cy.visit("/upload");
    cy.location("pathname").should("equal", "/upload");
  });

  it("redirects user to upload page if they are already logged in and visit login page", () => {
    cy.visit("/login");
    cy.location("pathname").should("equal", "/upload");
  });
});
