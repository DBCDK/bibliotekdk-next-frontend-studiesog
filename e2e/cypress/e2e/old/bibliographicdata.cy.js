/**
 * @file
 * Test functionality of bibliographic data
 */

describe("bibliographic data", () => {
  it("open edition - check contents", () => {
    cy.visit("/iframe.html?id=work-bibliographic-data--bib-data");
    // get first edition
    cy.get("[data-cy=accordion-item]").first().click();
    cy.get("[data-cy=edition-data-skabere]")
      .find("a")
      .should("have.attr", "href")
      .should("not.be.empty")
      .and("contain", "/find?q.creator=manifestation.creators[0].display");
    cy.get("[data-cy=link-references] p")
      .first()
      .should("have.text", "Download til referencesystemer");
  });

  it("Full manifestation - check localizationlink", () => {
    cy.visit("/iframe.html?id=work-bibliographic-data--full-manifestation");
    cy.get("[data-cy=link-localizations] p").should(
      "have.text",
      "Se om den er hjemme på dit bibliotek"
    );
  });
});