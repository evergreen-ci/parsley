describe("Basic evergreen log view", () => {
  const logLink =
    "/evergreen/spruce_ubuntu1604_test_2c9056df66d42fb1908d52eed096750a91f1f089_22_03_02_16_45_12/0/task";
  const longLogLine = `[2022/03/02 17:02:18.500] warning Pattern ["@apollo/client@latest"] is trying to unpack in the same destination "/home/ubuntu/.cache/yarn/v6/npm-@apollo-client-3.3.7-f15bf961dc0c2bee37a47bf86b8881fdc6183810-integrity/node_modules/@apollo/client" as pattern ["@apollo/client@3.3.7"]. This could result in non-deterministic behavior, skipping.`;

  beforeEach(() => {
    cy.visit(logLink);
  });

  it("should render ansii lines", () => {
    cy.dataCy("ansii-row").should("be.visible");
  });
  it("by default should have wrapping turned off and should be able to scroll horizontally", () => {
    cy.dataCy("log-row-22").should("be.visible");
    cy.dataCy("log-row-22").should("contain.text", longLogLine);
    cy.dataCy("log-row-22").isNotContainedInViewport();
    cy.get(".ReactVirtualized__Grid__innerScrollContainer").should(
      "have.css",
      "overflow-x",
      "visible"
    );
    cy.get(".ReactVirtualized__Grid").scrollTo(500, 0, {
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
    cy.get(".ReactVirtualized__Grid").should(
      "have.css",
      "overflow-x",
      "scroll"
    );
    cy.get(".ReactVirtualized__Grid").scrollTo("right");
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

    cy.enableClipboard();
    cy.dataCy("details-button").click();
    cy.dataCy("jira-button-wrapper").click();
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
    cy.visit(`${logLink}?bookmarks=0,297`);
    cy.dataCy("log-row-4").dblclick({ force: true });

    cy.dataCy("bookmark-297").click();
    cy.dataCy("log-row-297").should("be.visible");
    cy.dataCy("log-row-4").should("not.exist");
    cy.dataCy("bookmark-4").click();
    cy.dataCy("log-row-4").should("be.visible");
  });

  it("should be able to use the bookmarks bar to jump to a line when there are collapsed rows", () => {
    cy.visit(`${logLink}?bookmarks=0,297&filters=100pass`);
    cy.dataCy("log-row-56").dblclick({ force: true });

    cy.dataCy("bookmark-297").click();
    cy.dataCy("log-row-297").should("be.visible");
    cy.dataCy("log-row-56").should("not.exist");
    cy.dataCy("bookmark-56").click();
    cy.dataCy("log-row-56").should("be.visible");
  });

  it("visiting a log with a share line should jump to that line on page load", () => {
    cy.visit(`${logLink}?bookmarks=0,297&shareLine=200`);
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
