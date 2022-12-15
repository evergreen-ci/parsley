describe("log uploading", () => {
  it("Trying to upload a log prompts the user to select a log type", () => {
    cy.visit("/upload");
    cy.dataCy("upload-zone").should("be.visible");
    cy.get("input[type=file]").selectFile("sample_logs/resmoke.log", {
      force: true,
    });
    cy.dataCy("parse-log-select").should("be.visible");
  });
  it("Selecting a logtype should render the log with the appropriate parser", () => {
    cy.dataCy("parse-log-select").click();
    cy.contains("Resmoke").click();
    cy.dataCy("process-log-button").click();
    cy.dataCy("log-window").should("be.visible");
    cy.dataCy("resmoke-row").should("be.visible");
  });
  it("trying to navigate away to the upload page should prompt the user", () => {
    cy.dataCy("upload-link").click();
    cy.dataCy("confirmation-modal").should("be.visible");
  });
  it("navigating away clears the logs and returns the user to the upload prompt", () => {
    cy.contains("Confirm").click();
    cy.dataCy("upload-zone").should("be.visible");
  });
  it("should be able to drag and drop a file", () => {
    cy.dataCy("upload-zone").selectFile("sample_logs/resmoke.log", {
      force: true,
      action: "drag-drop",
    });
    cy.dataCy("parse-log-select").should("be.visible");
  });
});
