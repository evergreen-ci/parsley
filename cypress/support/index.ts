import './commands';

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Custom command to select DOM element by data-cy attribute.
       * @example cy.dataCy('greeting')
       */
      dataCy(value: string): Chainable<Element>;
      /**
       * Custom command to enter get an input by its label
       * @example cy.getInputBylabel("Some Label")
       */
      getInputByLabel(label: string): Chainable<Element>;
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
    }
  }
  
}