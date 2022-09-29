import "./commands";

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
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
       * Custom command to open and close the Leafygreen NavBar.
       */
      toggleNavBar(): void;
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
        shouldClose?: boolean
      ): void;
      /**
       * Custom command to login to the application
       * @example cy.login()
       */
      login(): void;
    }
  }
}
