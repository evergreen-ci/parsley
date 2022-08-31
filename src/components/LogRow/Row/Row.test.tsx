import React from "react";
import { LogContextProvider } from "context/LogContext";
import { renderWithRouterMatch, screen, userEvent, waitFor } from "test_utils";
import Row from ".";

describe("row", () => {
  it("renders a log line and its line number", () => {
    renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>
    );
    expect(screen.getByText(0)).toBeVisible();
    expect(screen.getByText(testLog)).toBeVisible();
  });
  it("double clicking a log line updates the url and selects it", async () => {
    const { history } = renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>
    );
    userEvent.dblClick(screen.getByText(testLog));
    await waitFor(() => {
      expect(history.location.search).toBe("?selectedLine=0");
    });
  });
  it("double clicking on a selected log line unselects it", async () => {
    const { history } = renderWithRouterMatch(
      <Row
        key={testLog}
        columnIndex={0}
        index={0}
        isScrolling={false}
        isVisible
        parent={{} as any}
        style={{}}
        wrap={false}
      >
        {testLog}
      </Row>,
      {
        route: "?selectedLine=0",
      }
    );
    userEvent.dblClick(screen.getByText(testLog));
    await waitFor(() => {
      expect(history.location.search).toBe("");
    });
  });
});

const testLog = "Test Log";
