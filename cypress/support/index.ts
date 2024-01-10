import "cypress-real-events";
import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to add a filter.
       * @example cy.addFilter('myFilter')
       */
      addFilter(filter: string): void;
      /**
       * Custom command to add a highlight.
       * @example cy.addHighlight('myHighlight')
       */
      addHighlight(highlight: string): void;
      /**
       * Custom command to add a search.
       * @example cy.addSearch('mySearch')
       */
      addSearch(search: string): void;
      /**
       * Custom command to click one of the toggles in the Details Menu panel.
       * @param toggleDataCy The data-cy attribute of the toggle to click.
       * @param enable Whether the toggle should be enabled or disabled.
       * @param tab The tab to click before clicking the toggle. Defaults to "search-and-filter".
       * @example cy.clickToggle('wrap-toggle', true, 'log-viewing')
       */
      clickToggle(
        toggleDataCy: string,
        enable: boolean,
        tab?: "search-and-filter" | "log-viewing",
      ): void;
      /**
       * Custom command to clear the search range bounds in the Details Menu panel.
       */
      clearBounds(): void;
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
      /**
       * Custom command to edit the search range bounds in the Details Menu panel.
       * @example cy.editBounds({ lower: 5, upper: 10 })
       */
      editBounds(bounds: { upper?: string; lower?: string }): void;
      /** Custom command to determine if an element is not contained in the viewport.
       * @example cy.isNotContainedInViewport()
       * @example cy.isNotContainedInViewport().should('be.visible')
       */
      isNotContainedInViewport(): Chainable<Element>;
      /**
       * Custom command to determine if an element is contained in the viewport.
       * @example cy.isContainedInViewport()
       * @example cy.isContainedInViewport().should('be.visible')
       */
      isContainedInViewport(): Chainable<Element>;
      /**
       * Custom command to enter get an input by its label
       * @example cy.getInputBylabel("Some Label")
       */
      getInputByLabel(label: string): Chainable<Element>;
      /**
       * Custom command to log in to the application.
       * @example cy.login()
       */
      login(): void;
      /**
       * Custom command to log out of the application.
       * @example cy.logout()
       */
      logout(): void;
      /**
       * Custom command to reset the drawer cookie.
       * @example cy.resetDrawerState()
       */
      resetDrawerState(): void;
      /**
       * Custom command to open and close the Details Panel.
       * @example cy.toggleDetailsPanel(true)
       */
      toggleDetailsPanel(open: boolean): void;
      /**
       * Custom command to open and close the Leafygreen SideNav.
       */
      toggleDrawer(): void;
      /**
       * Custom command to validate a toast was rendered
       * @example cy.validateToast("success", "This succeeded")
       * @example cy.validateToast("error", "This failed")
       * @example cy.validateToast("warning", "This is a warning")
       * @example cy.validateToast("info", "This is an info message")
       * @example cy.validateToast("success")
       */
      validateToast(
        type: "success" | "warning" | "error" | "info",
        message?: string,
        shouldClose?: boolean,
      ): void;
      /**
       * Custom command to validate that a value was copied to the clipboard.
       * @example cy.assertValueCopiedToClipboard("This is some text")
       */
      assertValueCopiedToClipboard(text: string): void;
    }
  }
}

beforeEach(() => {
  cy.login();
  cy.setCookie("has-opened-drawer", "true");
  cy.setCookie("has-seen-searchbar-guide-cue", "true");
});
