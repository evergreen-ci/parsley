describe("External Links", () => {
  describe("should render links to external pages when viewing an evergreen task log", () => {
    beforeEach(() => {
      cy.visit(
        "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task",
      );
      cy.toggleDetailsPanel(true);
    });
    it("should disable the link to the job logs page since there are no resmoke logs", () => {
      cy.dataCy("job-logs-button").should("have.attr", "aria-disabled", "true");
    });
    it("should render a link to the Lobster logs in the secondary menu", () => {
      cy.dataCy("lobster-button").should("not.exist");
      cy.dataCy("secondary-links-button").click();
      cy.dataCy("lobster-button").should("be.visible");
      cy.dataCy("lobster-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/lobster/evergreen/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task",
      );
      cy.dataCy("legacy-job-logs-button").should("not.exist");
    });
    it("should render links to the log files", () => {
      cy.dataCy("raw-log-button").should("be.visible");
      cy.dataCy("raw-log-button").should("not.be.disabled");
      cy.dataCy("raw-log-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/task_log_raw/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0?text=true&type=T",
      );
      cy.dataCy("html-log-button").should("be.visible");
      cy.dataCy("html-log-button").should("not.be.disabled");
      cy.dataCy("html-log-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/task_log_raw/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0?text=false&type=T",
      );
    });
  });
  describe("should render links to external pages when viewing an evergreen test log", () => {
    beforeEach(() => {
      cy.visit(
        "/test/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0/JustAFakeTestInALonelyWorld",
      );
      cy.toggleDetailsPanel(true);
    });
    it("should disable the link to the job logs page since there are no resmoke logs", () => {
      cy.dataCy("job-logs-button").should("have.attr", "aria-disabled", "true");
    });
    it("should render a link to the Lobster logs in the secondary menu", () => {
      cy.dataCy("lobster-button").should("not.exist");
      cy.dataCy("secondary-links-button").click();
      cy.dataCy("lobster-button").should("be.visible");
      cy.dataCy("lobster-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/lobster/evergreen/test/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0/JustAFakeTestInALonelyWorld/#shareLine=0",
      );
      cy.dataCy("legacy-job-logs-button").should("not.exist");
    });
    it("should render links to the log files", () => {
      cy.dataCy("raw-log-button").should("be.visible");
      cy.dataCy("raw-log-button").should("not.be.disabled");
      cy.dataCy("raw-log-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/test_log/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0?test_name=JustAFakeTestInALonelyWorld&group_id=&text=true",
      );
      cy.dataCy("html-log-button").should("be.visible");
      cy.dataCy("html-log-button").should("not.be.disabled");
      cy.dataCy("html-log-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/test_log/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0?test_name=JustAFakeTestInALonelyWorld&group_id=#L0",
      );
    });
  });
  describe("should render links to external pages when viewing a resmoke test log", () => {
    beforeEach(() => {
      cy.visit(
        "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab",
      );
      cy.toggleDetailsPanel(true);
    });
    it("should render a link to the job logs page", () => {
      cy.dataCy("job-logs-button").should("be.visible");
      cy.dataCy("job-logs-button").should(
        "have.attr",
        "href",
        `http://localhost:3000/job-logs/7e208050e166b1a9025c817b67eee48d`,
      );
    });
    it("should render a link to the Lobster logs in the secondary menu", () => {
      cy.dataCy("lobster-button").should("not.exist");
      cy.dataCy("secondary-links-button").click();
      cy.dataCy("lobster-button").should("be.visible");
      cy.dataCy("lobster-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/lobster/build/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab",
      );
    });
    it("should render a link to the legacy logkeeper log viewer in the secondary menu", () => {
      cy.dataCy("legacy-job-logs-button").should("not.exist");
      cy.dataCy("secondary-links-button").click();
      cy.dataCy("legacy-job-logs-button").should("be.visible");
      cy.dataCy("legacy-job-logs-button").should(
        "have.attr",
        "href",
        "http://localhost:8080/build/7e208050e166b1a9025c817b67eee48d",
      );
    });
    it("should render links to the log files", () => {
      cy.dataCy("raw-log-button").should("be.visible");
      cy.dataCy("raw-log-button").should("not.be.disabled");
      cy.dataCy("raw-log-button").should(
        "have.attr",
        "href",
        "http://localhost:8080/build/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab?raw=true",
      );
      cy.dataCy("html-log-button").should("be.visible");
      cy.dataCy("html-log-button").should("not.be.disabled");
      cy.dataCy("html-log-button").should(
        "have.attr",
        "href",
        "http://localhost:8080/build/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab?html=true",
      );
    });
  });
  describe("should render links to external pages when viewing an evergreen task uploaded file", () => {
    beforeEach(() => {
      cy.visit(
        "/taskFile/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/sample%20file",
      );
      cy.toggleDetailsPanel(true);
    });
    it("should link to the raw file", () => {
      cy.dataCy("raw-log-button").should("be.visible");
      cy.dataCy("raw-log-button").should("not.be.disabled");
      cy.dataCy("raw-log-button")
        .should("have.attr", "href")
        .and("match", /s3\.amazonaws\.com/);
    });
  });
});
