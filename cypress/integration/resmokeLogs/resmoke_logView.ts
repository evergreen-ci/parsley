describe("Basic resmoke log view", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });

  it("should render resmoke lines", () => {
    cy.dataCy("resmoke-row").should("be.visible");
  });
  it("by default should have wrapping turned off and should be able to scroll horizontally", () => {
    cy.dataCy("log-row-16").should("be.visible");
    cy.dataCy("log-row-16").isNotContainedInViewport();
    cy.get(".ReactVirtualized__Grid__innerScrollContainer").should(
      "have.css",
      "overflow-x",
      "visible"
    );
  });
  it("long lines with wrapping turned on should fit on screen", () => {
    cy.clickToggle("wrap-toggle", true); // Turn wrap on.
    cy.dataCy("log-row-16").should("be.visible");
    cy.dataCy("log-row-16").isContainedInViewport();
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
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });
  it("should not color non resmoke log lines", () => {
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
  before(() => {
    cy.login();
    cy.visit(logLink);
    cy.setCookie("has-opened-drawer", "true");
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "11079");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,11079");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "4");
    cy.dataCy("sidebar-log-line-container").should("contain", "11079");

    cy.dataCy("log-row-4").dblclick();
    cy.dataCy("sidebar-log-line-container").should("not.contain", "4");
  });

  it("should be able to select and unselect lines", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11079&selectedLine=5");
    cy.dataCy("sidebar-log-line-container").should("contain", "5");

    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("sidebar-log-line-container").should("not.contain", "5");
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
    const logLine11079 = `[j0:s1] | 2022-09-21T12:50:28.489+00:00 I  NETWORK  22944   [conn60] "Connection ended","attr":{"remote":"127.0.0.1:47362","uuid":{"uuid":{"$uuid":"b28d7d9f-03b6-4f93-a7cd-5e1948135f69"}},"connectionId":60,"connectionCount":2}`;

    cy.enableClipboard();
    cy.dataCy("details-button").click();
    cy.dataCy("jira-button-wrapper").click();
    cy.window()
      .its("navigator.clipboard")
      .invoke("readText")
      .should(
        "equal",
        `{noformat}\n${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine11079}\n{noformat}`
      );
  });

  it("should be able to clear bookmarks", () => {
    cy.dataCy("clear-bookmarks").click();
    cy.location("search").should("equal", "");
  });
});

describe("Jump to line", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.visit(logLink);
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,11079");
    cy.dataCy("sidebar-log-line-container").should("contain", "0");
    cy.dataCy("sidebar-log-line-container").should("contain", "11079");
  });

  it("should be able to use the sidebar to jump to a line when there are no collapsed rows", () => {
    cy.dataCy("log-row-4").dblclick({ force: true });

    cy.dataCy("sidebar-log-line-11079").click();
    cy.dataCy("log-row-11079").should("be.visible");
    cy.dataCy("log-row-56").should("not.exist");

    cy.dataCy("sidebar-log-line-4").click();
    cy.dataCy("log-row-4").should("be.visible");
  });

  it("should be able to use the sidebar to jump to a line when there are collapsed rows", () => {
    cy.addFilter("repl_hb");

    cy.dataCy("log-row-30").dblclick({ force: true });

    cy.dataCy("sidebar-log-line-11079").click();
    cy.dataCy("log-row-11079").should("be.visible");
    cy.dataCy("log-row-30").should("not.exist");

    cy.dataCy("sidebar-log-line-30").click();
    cy.dataCy("log-row-30").should("be.visible");
  });
  it("visiting a log with a selected line should jump to that line on page load", () => {
    cy.visit(`${logLink}?selectedLine=200`);
    cy.dataCy("log-row-200").should("be.visible");
  });
});

describe("expanding collapsed rows", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.setCookie("has-opened-drawer", "true");
    cy.visit(logLink);
  });

  it("should be able to expand collapsed rows", () => {
    // Apply a filter.
    cy.dataCy("searchbar-select").click();
    cy.dataCy("filter-option").click();
    cy.dataCy("searchbar-input").type("ShardedClusterFixture:job0{enter}");

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
    cy.toggleDrawer();
    cy.dataCy("expanded-row-1-to-3").should("be.visible");
  });

  it("should be possible to re-collapse rows through the drawer", () => {
    cy.dataCy("log-row-1").should("be.visible");
    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-3").should("be.visible");

    cy.dataCy("expanded-row-1-to-3").within(() => {
      cy.get(`[aria-label="Delete range"]`).click();
    });
    cy.dataCy("collapsed-row-1-3").should("exist");
  });
});

describe("pretty print", () => {
  const logLink =
    "/resmoke/7e208050e166b1a9025c817b67eee48d/test/1716e11b4f8a4541c5e2faf70affbfab";
  before(() => {
    cy.login();
    cy.setCookie("has-opened-drawer", "true");
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
