describe("Upload page", () => {
  describe("uploading logs", () => {
    beforeEach(() => {
      cy.login();
      cy.visit("/upload");
      cy.dataCy("upload-zone").should("be.visible");
    });

    it("should be able to drag and drop a file", () => {
      cy.dataCy("upload-zone").selectFile("sample_logs/resmoke.log", {
        force: true,
        action: "drag-drop",
      });
      cy.dataCy("parse-log-select").should("be.visible");
    });
    it("should be able to select a file", () => {
      cy.get("input[type=file]").selectFile("sample_logs/resmoke.log", {
        force: true,
      });
      cy.dataCy("parse-log-select").should("be.visible");
    });
    it("selecting a log type should render the log with the appropriate parser", () => {
      cy.get("input[type=file]").selectFile("sample_logs/resmoke.log", {
        force: true,
      });
      cy.dataCy("parse-log-select").should("be.visible");
      cy.dataCy("parse-log-select").click();
      cy.contains("Resmoke").click();
      cy.dataCy("process-log-button").click();
      cy.dataCy("log-window").should("be.visible");
      cy.dataCy("resmoke-row").should("be.visible");
    });
  });

  describe("navigating away", () => {
    const logLink =
      "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

    beforeEach(() => {
      cy.login();
      cy.setCookie("has-opened-drawer", "true");
      cy.visit(logLink);
      cy.dataCy("log-window").should("be.visible");
    });

    it("trying to navigate away to the upload page should prompt the user", () => {
      cy.dataCy("upload-link").click();
      cy.dataCy("confirmation-modal").should("be.visible");
      cy.contains("button", "Confirm").click();
      cy.dataCy("upload-zone").should("be.visible");
    });
  });
});
