describe("External Links", () => {
  describe("should render links to external pages when viewing an evergreen task log", () => {
    before(() => {
      cy.login();
      cy.visit(
        "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task"
      );
      cy.toggleDetailsPanel(true);
    });
    it.skip("should render a link to the job logs page", () => {
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
    it.skip("should render a link to the job logs page", () => {
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
    const taskID =
      "mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24";
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
    it("should render a link to the job logs page", () => {
      cy.dataCy("job-logs-button").should("be.visible");
      cy.dataCy("job-logs-button").should(
        "have.attr",
        "href",
        `http://localhost:8080/build/${taskID}/7e208050e166b1a9025c817b67eee48d`
      );
    });
    it("should render a link to the task page", () => {
      cy.contains("Task Page").should("be.visible");
      cy.contains("Task Page").should(
        "have.attr",
        "href",
        `http://localhost:9090/task/${taskID}/0?redirect_spruce_users=true`
      );
    });
  });
});
