describe("Basic resmoke log view", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  beforeEach(() => {
    cy.visit(logLink);
  });

  it("should render resmoke lines", () => {
    cy.dataCy("resmoke-row").should("be.visible");
  });
  it("by default should have wrapping turned off and should be able to scroll horizontally", () => {
    cy.dataCy("log-row-16").should("be.visible");
    cy.dataCy("log-row-16").isNotContainedInViewport();

    cy.dataCy("paginated-virtual-list").scrollTo(500, 0, {
      ensureScrollable: true,
    });
  });
  it("long lines with wrapping turned on should fit on screen", () => {
    cy.clickToggle("wrap-toggle", true, "log-viewing");
    cy.dataCy("log-row-16").should("be.visible");
    cy.dataCy("log-row-16").isContainedInViewport();
  });
  it("should still allow horizontal scrolling when there are few logs on screen", () => {
    cy.addFilter("Putting spruce/");

    cy.dataCy("paginated-virtual-list").scrollTo("right");
  });

  it("log header should show breadcrumbs, including one for the test name", () => {
    cy.dataCy("project-breadcrumb").should(
      "contain.text",
      "mongodb-mongo-master",
    );

    cy.dataCy("version-breadcrumb").should("contain.text", "Patch 973");
    cy.dataCy("version-breadcrumb").trigger("mouseover");
    cy.dataCy("breadcrumb-tooltip").should(
      "contain.text",
      "SERVER-45720 Create tests for Atlas Workflows",
    );
    cy.dataCy("version-breadcrumb").trigger("mouseout");

    cy.dataCy("task-breadcrumb")
      .should("contain.text", "merge-patch")
      .should(
        "have.attr",
        "href",
        "http://localhost:9090/task/mongodb_mongo_master_rhel80_debug_v4ubsan_all_feature_flags_experimental_concurrency_sharded_with_stepdowns_and_balancer_4_linux_enterprise_361789ed8a613a2dc0335a821ead0ab6205fbdaa_22_09_21_02_53_24/0?redirect_spruce_users=true",
      );
    cy.dataCy("task-status-badge").should("contain.text", "Succeeded");

    cy.dataCy("test-breadcrumb").should(
      "contain.text",
      "internal_transactions_kill_sessions.js",
    );
    cy.dataCy("test-status-badge").should("contain.text", "Pass");
  });
});

describe("Resmoke syntax highlighting", () => {
  // Although it isn't ideal to test for a specific color, this helps us ensure that the color is consistent and deterministic.
  const colors = {
    black: "rgb(0, 0, 0)",
    blue: "rgb(8, 60, 144)",
    green: "rgb(0, 163, 92)",
  };
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";

  beforeEach(() => {
    cy.visit(logLink);
  });
  it("should not color non-resmoke log lines", () => {
    cy.dataCy("log-row-0").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.black);
    });
  });
  it("should color similar resmoke lines with the same color", () => {
    cy.dataCy("log-row-20").should("be.visible");
    cy.dataCy("log-row-21").should("be.visible");
    cy.dataCy("log-row-20").should("contain", "[j0:s0:n1]");
    cy.dataCy("log-row-21").should("contain", "[j0:s0:n1]");
    cy.dataCy("log-row-20").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.blue);
    });
    cy.dataCy("log-row-21").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.blue);
    });
  });
  it("should color different resmoke lines with different colors if their resmoke state is different", () => {
    cy.dataCy("log-row-19").should("be.visible");
    cy.dataCy("log-row-20").should("be.visible");
    cy.dataCy("log-row-19").should("contain", "[j0:s0:n0]");
    cy.dataCy("log-row-20").should("contain", "[j0:s0:n1]");
    cy.dataCy("log-row-19").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.green);
    });
    cy.dataCy("log-row-20").within(() => {
      cy.dataCy("resmoke-row").should("have.css", "color", colors.blue);
    });
  });
});

describe("Bookmarking and selecting lines", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  beforeEach(() => {
    cy.visit(logLink);
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("bookmark-list").should("contain", "0");
    cy.dataCy("bookmark-list").should("contain", "11079");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,11079");
    cy.dataCy("bookmark-list").should("contain", "0");
    cy.dataCy("bookmark-list").should("contain", "4");
    cy.dataCy("bookmark-list").should("contain", "11079");
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("bookmark-list").should("not.contain", "4");
  });

  it("should be able to set and unset the share line", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11079&shareLine=5");
    cy.dataCy("bookmark-list").should("contain", "0");
    cy.dataCy("bookmark-list").should("contain", "5");
    cy.dataCy("bookmark-list").should("contain", "11079");
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("bookmark-list").should("not.contain", "5");
  });

  it("should be able to copy bookmarks as JIRA format", () => {
    cy.dataCy("log-row-10").dblclick({ scrollBehavior: false });
    cy.dataCy("log-row-11").dblclick({ scrollBehavior: false });

    const logLine0 =
      "[fsm_workload_test:internal_transactions_kill_sessions] Fixture status:";
    const logLine10 =
      "|ShardedClusterFixture:job0:mongos0        |j0:s0   |20009|73157|";
    const logLine11 =
      "|ShardedClusterFixture:job0:mongos1        |j0:s1   |20010|73217|";
    const logLine11079 = `[j0:s1] | 2022-09-21T12:50:28.489+00:00 I  NETWORK  22944       [conn60] "Connection ended","attr":{"remote":"127.0.0.1:47362","uuid":{"uuid":{"$uuid":"b28d7d9f-03b6-4f93-a7cd-5e1948135f69"}},"connectionId":60,"connectionCount":2}`;

    cy.dataCy("details-button").click();
    // Need to fire a real click here because the copy to clipboard
    cy.dataCy("jira-button").realClick();
    cy.assertValueCopiedToClipboard(
      `{noformat}\n${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine11079}\n{noformat}`,
    );
  });

  it("should be able to clear bookmarks", () => {
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("clear-bookmarks").click();
    cy.location("search").should("equal", "");
  });
});

describe("Jump to line", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";

  it("should be able to use the bookmarks bar to jump to a line when there are no collapsed rows", () => {
    cy.visit(logLink);
    cy.dataCy("log-row-4").should("be.visible").dblclick({ force: true });
    cy.dataCy("bookmark-4").should("be.visible");

    cy.dataCy("bookmark-11079").click();
    cy.dataCy("log-row-11079").should("be.visible");
    cy.dataCy("log-row-4").should("not.exist");

    cy.dataCy("bookmark-4").click();
    cy.dataCy("log-row-4").should("be.visible");
  });

  it("should be able to use the bookmarks bar to jump to a line when there are collapsed rows", () => {
    cy.visit(`${logLink}?filters=100repl_hb`);
    cy.dataCy("log-row-30").should("be.visible").dblclick({ force: true });
    cy.url().should("include", "bookmarks=0,30,11079");
    cy.dataCy("bookmark-30").should("be.visible");
    cy.dataCy("bookmark-11079").click();
    cy.dataCy("log-row-11079").should("be.visible");
    cy.dataCy("log-row-30").should("not.exist");

    cy.dataCy("bookmark-30").click();
    cy.dataCy("log-row-30").should("be.visible");
  });

  it("visiting a log with a share line should jump to that line on page load", () => {
    cy.visit(`${logLink}?shareLine=200`);
    cy.dataCy("log-row-200").should("be.visible");
  });
});

describe("expanding collapsed rows", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab?bookmarks=0,11079&filters=100ShardedClusterFixture%253Ajob0";
  beforeEach(() => {
    cy.visit(logLink);
  });

  it("should be able to expand collapsed rows", () => {
    cy.dataCy("log-row-1").should("not.exist");
    cy.dataCy("log-row-2").should("not.exist");
    cy.dataCy("log-row-3").should("not.exist");

    cy.dataCy("collapsed-row-1-3").within(() => {
      cy.contains("All").click();
    });

    cy.dataCy("collapsed-row-1-3").should("not.exist");
    cy.dataCy("log-row-1").should("be.visible");
    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-3").should("be.visible");
  });

  it("should be able to see what rows have been expanded in the drawer", () => {
    cy.dataCy("collapsed-row-1-3").within(() => {
      cy.contains("All").click();
    });
    cy.toggleDrawer();
    cy.dataCy("expanded-row-1-to-3").should("be.visible");
  });

  it("should be possible to re-collapse rows through the drawer", () => {
    cy.dataCy("collapsed-row-1-3").within(() => {
      cy.contains("All").click();
    });
    cy.dataCy("collapsed-row-1-3").should("not.exist");

    cy.toggleDrawer();
    cy.dataCy("expanded-row-1-to-3").within(() => {
      cy.get(`[aria-label="Delete range"]`).click();
    });
    cy.dataCy("collapsed-row-1-3").should("exist");
  });
});

describe("pretty print", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  beforeEach(() => {
    cy.setCookie("pretty-print-bookmarks", "true");
    cy.visit(logLink);
  });

  it("should pretty print bookmarks if pretty print is enabled", () => {
    const defaultRowHeight = 18;

    cy.dataCy("log-row-19").dblclick({ force: true });
    cy.dataCy("log-row-19")
      .invoke("height")
      .should("be.greaterThan", defaultRowHeight);
  });
});

describe("Sharing lines", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";

  beforeEach(() => {
    cy.visit(logLink);
  });

  it("should present a share button with a menu when a line is selected", () => {
    cy.dataCy("line-index-1").click();
    cy.dataCy("sharing-menu-button").should("be.visible");
    cy.dataCy("sharing-menu-button").click();
    cy.dataCy("sharing-menu").should("be.visible");
  });
  it("shift+click selecting a range of lines should automatically open the sharing menu", () => {
    cy.dataCy("line-index-1").click();
    cy.dataCy("line-index-10").click({ shiftKey: true });
    cy.dataCy("sharing-menu").should("be.visible");
  });
  it("should be able to copy the selected lines as JIRA format", () => {
    cy.dataCy("line-index-1").click();
    cy.dataCy("line-index-2").click({ shiftKey: true });
    cy.dataCy("sharing-menu").should("be.visible");
    cy.contains("Copy selected contents").should("be.visible");
    // Need to fire a real click here because the copy to clipboard
    cy.contains("Copy selected contents").realClick();
    cy.validateToast("success", "Copied 2 lines to clipboard", true);
    cy.assertValueCopiedToClipboard(
      `{noformat}\n+------------------------------------------+--------+-----+-----+\n|full_name                                 |name    |port |pid  |\n{noformat}`,
    );
  });
  it("should be able to copy a link to the selected lines", () => {
    cy.dataCy("line-index-1").click();
    cy.dataCy("line-index-2").click({ shiftKey: true });
    cy.dataCy("sharing-menu").should("be.visible");
    cy.contains("Copy share link to selected lines").should("be.visible");
    // Need to fire a real click here because the copy to clipboard
    cy.contains("Copy share link to selected lines").realClick();
    cy.validateToast("success", "Copied link to clipboard", true);
    cy.assertValueCopiedToClipboard(
      "http://localhost:4173/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab?bookmarks=0%2C11079&selectedLineRange=L1-L2&shareLine=1",
    );
  });
  it("should be able to limit the search range to the selected lines", () => {
    cy.dataCy("line-index-1").click();
    cy.dataCy("line-index-2").click({ shiftKey: true });
    cy.dataCy("sharing-menu").should("be.visible");
    cy.contains("Only search on range").should("be.visible");
    cy.contains("Only search on range").click();
    cy.toggleDetailsPanel(true);
    cy.dataCy("range-lower-bound").should("have.value", "1");
    cy.dataCy("range-upper-bound").should("have.value", "2");
  });
});
