/**
 * @file
 * Test functionality of localizations
 */
describe("Localization link", () => {
  it(`Localization link present`, () => {
    cy.visit("/iframe.html?id=modal-localizations--localization-link");
    cy.get(`[data-cy="link-localizations"]`)
      .should("have.attr", "aria-label")
      .should("equal", "open localizations");
    cy.get(`[data-cy="link-localizations"]`).click();
    cy.on("window:alert", (str) => {
      expect(str).to.equal("localizations");
    });
  });

  it(`Localization link present`, () => {
    cy.visit("/iframe.html?id=modal-localizations--localization-item-loading");
    cy.get(`[data-cy="blinking-0-localizationloader"]`)
      .should("have.attr", "role")
      .should("equal", "progressbar");

    cy.get(`[data-cy="blinking-0-localizationloader"]`)
      .should("have.attr", "aria-live")
      .should("equal", "polite");
  });
});
