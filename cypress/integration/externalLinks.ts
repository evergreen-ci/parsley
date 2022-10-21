describe("External Links", () => {
  describe("should render links to external pages when viewing an evergreen task log", () => {
    before(() => {
      cy.login();
      cy.visit(
        "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task"
      );
      cy.toggleDetailsPanel(true);
    });
    it("should render a link to the job logs page", () => {
      cy.dataCy("job-logs-button").should("be.visible");
      cy.dataCy("job-logs-button").should(
        "have.attr",
        "href",
        "http://localhost:3000/job-logs/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0"
      );
    });
    it("should render links to the log files", () => {
      cy.dataCy("raw-log-button").should("be.visible");
      cy.dataCy("raw-log-button").should("not.be.disabled");
      cy.dataCy("raw-log-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/task_log_raw/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0?text=true&type=T"
      );
      cy.dataCy("html-log-button").should("be.visible");
      cy.dataCy("html-log-button").should("not.be.disabled");
      cy.dataCy("html-log-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/task_log_raw/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0?text=false&type=T"
      );
    });
  });
  describe("should render links to external pages when viewing an evergreen test log", () => {
    before(() => {
      cy.login();
      cy.visit(
        "/test/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0/JustAFakeTestInALonelyWorld"
      );
      cy.toggleDetailsPanel(true);
    });
    it("should render a link to the job logs page", () => {
      cy.dataCy("job-logs-button").should("be.visible");
      cy.dataCy("job-logs-button").should(
        "have.attr",
        "href",
        "http://localhost:3000/job-logs/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0"
      );
    });
    it("should render links to the log files", () => {
      cy.dataCy("raw-log-button").should("be.visible");
      cy.dataCy("raw-log-button").should("not.be.disabled");
      cy.dataCy("raw-log-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/test_log/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0?test_name=JustAFakeTestInALonelyWorld&text=true"
      );
      cy.dataCy("html-log-button").should("be.visible");
      cy.dataCy("html-log-button").should("not.be.disabled");
      cy.dataCy("html-log-button").should(
        "have.attr",
        "href",
        "http://localhost:9090/test_log/spruce_ubuntu1604_check_codegen_d54e2c6ede60e004c48d3c4d996c59579c7bbd1f_22_03_02_15_41_35/0?test_name=JustAFakeTestInALonelyWorld&text=false"
      );
    });
  });
  describe("should render links to external pages when viewing a resmoke test log", () => {
    before(() => {
      cy.login();
      cy.visit(
        "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab"
      );
      cy.toggleDetailsPanel(true);
    });
    it("should render links to the log files", () => {
      cy.dataCy("raw-log-button").should("be.visible");
      cy.dataCy("raw-log-button").should("not.be.disabled");
      cy.dataCy("raw-log-button").should(
        "have.attr",
        "href",
        "http://localhost:8080/build/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab?raw=true"
      );
      cy.dataCy("html-log-button").should("be.visible");
      cy.dataCy("html-log-button").should("not.be.disabled");
      cy.dataCy("html-log-button").should(
        "have.attr",
        "href",
        "http://localhost:8080/build/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab?html=true"
      );
    });
  });
});
