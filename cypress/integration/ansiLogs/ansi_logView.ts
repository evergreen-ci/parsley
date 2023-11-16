describe("Basic evergreen log view", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  const longLogLine = `[2022/03/02 17:02:18.500] warning Pattern ["@apollo/client@latest"] is trying to unpack in the same destination "/home/ubuntu/.cache/yarn/v6/npm-@apollo-client-3.3.7-f15bf961dc0c2bee37a47bf86b8881fdc6183810-integrity/node_modules/@apollo/client" as pattern ["@apollo/client@3.3.7"]. This could result in non-deterministic behavior, skipping.`;

  beforeEach(() => {
    cy.visit(logLink);
  });
  it("should render ansi lines", () => {
    cy.dataCy("ansi-row").should("be.visible");
  });
  it("by default should have wrapping turned off and should be able to scroll horizontally", () => {
    cy.dataCy("log-row-22").should("be.visible");
    cy.dataCy("log-row-22").should("contain.text", longLogLine);
    cy.dataCy("log-row-22").isNotContainedInViewport();

    cy.dataCy("paginated-virtual-list").scrollTo(500, 0, {
      ensureScrollable: true,
    });
  });
  it("long lines with wrapping turned on should fit on screen", () => {
    cy.clickToggle("wrap-toggle", true);
    cy.dataCy("log-row-22").should("be.visible");
    cy.dataCy("log-row-22").should("contain.text", longLogLine);
    cy.dataCy("log-row-22").isContainedInViewport();
  });
  it("should still allow horizontal scrolling when there are few logs on screen", () => {
    cy.addFilter("Putting spruce/");

    cy.dataCy("paginated-virtual-list").scrollTo("right");
  });

  it("log header should show the task breadcrumbs and status and link to Spruce", () => {
    cy.dataCy("project-breadcrumb").should("contain.text", "spruce");

    cy.dataCy("version-breadcrumb").should("contain.text", "2c9056d");
    cy.dataCy("version-breadcrumb").trigger("mouseover");
    cy.dataCy("breadcrumb-tooltip")
      .should("be.visible")
      .should(
        "contain.text",
        "EVG-14749: Add loading state for JIRA Issues and Suspected Issues (#1120)"
      );
    cy.dataCy("version-breadcrumb").trigger("mouseout");

    cy.dataCy("task-breadcrumb")
      .should("contain.text", "test")
      .should(
        "have.attr",
        "href",
        "http://localhost:9090/task/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0?redirect_spruce_users=true"
      );
    cy.dataCy("task-status-badge").should("contain.text", "Succeeded");
    cy.dataCy("test-breadcrumb").should("not.exist");
  });
});

describe("Bookmarking and selecting lines", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  beforeEach(() => {
    cy.visit(logLink);
  });

  it("should default to bookmarking 0 and the last log line on load", () => {
    cy.location("search").should("equal", "?bookmarks=0,297");
    cy.dataCy("bookmark-list").should("contain", "0");
    cy.dataCy("bookmark-list").should("contain", "297");
  });

  it("should be able to bookmark and unbookmark log lines", () => {
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,4,297");
    cy.dataCy("bookmark-list").should("contain", "0");
    cy.dataCy("bookmark-list").should("contain", "4");
    cy.dataCy("bookmark-list").should("contain", "297");
    cy.dataCy("log-row-4").dblclick();
    cy.location("search").should("equal", "?bookmarks=0,297");
    cy.dataCy("bookmark-list").should("not.contain", "4");
  });

  it("should be able to set and unset the share line", () => {
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,297&shareLine=5");
    cy.dataCy("bookmark-list").should("contain", "0");
    cy.dataCy("bookmark-list").should("contain", "5");
    cy.dataCy("bookmark-list").should("contain", "297");
    cy.dataCy("log-link-5").click();
    cy.location("search").should("equal", "?bookmarks=0,297");
    cy.dataCy("bookmark-list").should("not.contain", "5");
  });

  it("should be able to copy bookmarks as JIRA format", () => {
    cy.dataCy("log-row-10").dblclick({ scrollBehavior: false });
    cy.dataCy("log-row-11").dblclick({ scrollBehavior: false });

    const logLine0 =
      "[2022/03/02 17:01:58.587] Task logger initialized (agent version 2022-02-14 from 00a4c8f3e8e4559cc23e04a019b6d1725c40c3e5).";
    const logLine10 =
      "[2022/03/02 17:02:01.610] e391612 EVG-16049 Update spruce project page for admin only variables (#1114)";
    const logLine11 =
      "[2022/03/02 17:02:01.610] 04a52b2 EVG-15959 Fix rerender method in test utils (#1118)";
    const logLine297 =
      "[2022/03/02 17:05:21.050] running setup group because we have a new independent task";

    cy.dataCy("details-button").click();
    // Need to fire a real click here because the copy to clipboard
    cy.dataCy("jira-button").realClick();
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq(
          `{noformat}\n${logLine0}\n...\n${logLine10}\n${logLine11}\n...\n${logLine297}\n{noformat}`
        );
      });
    });
  });

  it("should be able to clear bookmarks", () => {
    cy.dataCy("clear-bookmarks").click();
    cy.location("search").should("equal", "");
  });
});

describe("Jump to line", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

  it("should be able to use the bookmarks bar to jump to a line when there are no collapsed rows", () => {
    cy.visit(logLink);
    cy.dataCy("log-row-4").should("be.visible").dblclick({ force: true });
    cy.dataCy("bookmark-4").should("be.visible");

    cy.dataCy("bookmark-297").click();
    cy.dataCy("log-row-297").should("be.visible");
    cy.dataCy("log-row-4").should("not.exist");
    cy.dataCy("bookmark-4").click();
    cy.dataCy("log-row-4").should("be.visible");
  });

  it("should be able to use the bookmarks bar to jump to a line when there are collapsed rows", () => {
    cy.visit(`${logLink}?filters=100pass`);
    cy.dataCy("log-row-56").dblclick({ force: true });
    cy.dataCy("bookmark-56").should("be.visible");

    cy.dataCy("bookmark-297").click();
    cy.dataCy("log-row-297").should("be.visible");
    cy.dataCy("log-row-56").should("not.exist");
    cy.dataCy("bookmark-56").click();
    cy.dataCy("log-row-56").should("be.visible");
  });

  it("visiting a log with a share line should jump to that line on page load", () => {
    cy.visit(`${logLink}?shareLine=200`);
    cy.dataCy("log-row-200").should("be.visible");
  });
});

describe("expanding collapsed rows", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task?bookmarks=0,297&filters=100evg";

  beforeEach(() => {
    cy.visit(logLink);
  });

  it("should be able to expand collapsed rows", () => {
    cy.dataCy("log-row-1").should("not.exist");
    cy.dataCy("log-row-2").should("not.exist");
    cy.dataCy("log-row-3").should("not.exist");
    cy.dataCy("log-row-4").should("not.exist");

    cy.dataCy("collapsed-row-1-4").within(() => {
      cy.contains("All").click();
    });

    cy.dataCy("collapsed-row-1-4").should("not.exist");
    cy.dataCy("log-row-1").should("be.visible");
    cy.dataCy("log-row-2").should("be.visible");
    cy.dataCy("log-row-3").should("be.visible");
    cy.dataCy("log-row-4").should("be.visible");
  });

  it("should be able to see what rows have been expanded in the drawer", () => {
    cy.dataCy("collapsed-row-1-4").within(() => {
      cy.contains("All").click();
    });
    cy.toggleDrawer();
    cy.dataCy("expanded-row-1-to-4").should("be.visible");
  });

  it("should be possible to re-collapse rows through the drawer", () => {
    cy.dataCy("collapsed-row-1-4").within(() => {
      cy.contains("All").click();
    });
    cy.dataCy("collapsed-row-1-4").should("not.exist");

    cy.toggleDrawer();
    cy.dataCy("expanded-row-1-to-4").within(() => {
      cy.get(`[aria-label="Delete range"]`).click();
    });
    cy.dataCy("collapsed-row-1-4").should("exist");
  });
});

describe("Sharing lines", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";

  beforeEach(() => {
    cy.visit(logLink);
    cy.dataCy("line-index-1").should("exist").should("be.visible");
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
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq(
          `{noformat}\n[2022/03/02 17:01:58.587] Task logger initialized (agent version 2022-02-14 from 00a4c8f3e8e4559cc23e04a019b6d1725c40c3e5).\n...\n[2022/03/02 17:02:01.610] e391612 EVG-16049 Update spruce project page for admin only variables (#1114)\n[2022/03/02 17:02:01.610] 04a52b2 EVG-15959 Fix rerender method in test utils (#1118)\n...\n[2022/03/02 17:05:21.050] running setup group because we have a new independent task\n{noformat}`
        );
      });
    });
  });
  it("should be able to copy a link to the selected lines", () => {
    cy.dataCy("line-index-1").click();
    cy.dataCy("line-index-2").click({ shiftKey: true });
    cy.dataCy("sharing-menu").should("be.visible");
    cy.contains("Copy share link to selected lines").should("be.visible");
    // Need to fire a real click here because the copy to clipboard
    cy.contains("Copy share link to selected lines").realClick();
    cy.validateToast("success", "Copied link to clipboard", true);
    cy.window().then((win) => {
      win.navigator.clipboard.readText().then((text) => {
        expect(text).to.eq(
          "http://localhost:4173/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task?bookmarks=0%2C297&selectedLineRange=L1-L2&shareLine=1"
        );
      });
    });
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
