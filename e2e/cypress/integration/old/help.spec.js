const nextjsBaseUrl = Cypress.env("nextjsBaseUrl");
const graphqlPath = Cypress.env("graphqlPath");
const fbiApiPath = Cypress.env("fbiApiPath");

describe("help", () => {
  it(`Search: should show empty response message`, () => {
    cy.visit("/iframe.html?path=/story/help-search--no-results");
    cy.contains("Din søgning giver ingen resultater");
    cy.get("[data-cy=faq]").should("be.visible");
  });
  it(`Search: should show two results`, () => {
    cy.visit("/iframe.html?path=/story/help-search--show-results");
    cy.get("[data-cy=result-row]").its("length").should("eq", 2);

    // FAQ should be hidden when there are results
    cy.get("[data-cy=faq]").should("not.exist");

    cy.get('[href="/hjaelp/saadan-soeger-du-i-bibliotek-dk/1"]').focus();
    cy.tabs(1);
    cy.focused().should("have.attr", "href", "/hjaelp/om-login/2");
  });
  it(`Search: menu is visible on desktop`, () => {
    cy.visit("/iframe.html?path=/story/help-search--show-results");
    cy.get("[data-cy=help-menu").should("be.visible");
  });
  it(`Search: menu is hidden on mobile`, () => {
    cy.viewport(991, 800);
    cy.visit("/iframe.html?path=/story/help-search--show-results");
    cy.get("[data-cy=help-menu").should("be.hidden");
  });
  it(`Search: filter by language`, () => {
    // Intercept help search requests
    cy.intercept("POST", `${fbiApiPath}`, (req) => {
      if (req.body.query.includes("help(")) {
        req.alias = "apiHelpRequest";
      }
    });

    cy.visit(`${nextjsBaseUrl}/hjaelp`);

    cy.get("[data-cy=cookiebox]").then(($box) => {
      if ($box.is(":visible")) {
        cy.get("[data-cy=button-ok]").click();
      }
    });

    // Default should be danish
    cy.get("#help-suggester-input").type("a");
    cy.wait("@apiHelpRequest").then((interception) => {
      const variables = interception.request.body.variables;
      expect(variables).to.deep.equal({ q: "a", language: "da" });
    });

    // Change language to english
    cy.get("[data-cy=header-menu]").click();

    cy.get("[data-cy=menu-link-language]").click();
    cy.wait("@apiHelpRequest").then((interception) => {
      const variables = interception.request.body.variables;
      expect(variables).to.deep.equal({ q: "a", language: "en" });
    });
  });
});

describe("help menu", () => {
  it(`Help menu - tab & click`, () => {
    cy.visit("/iframe.html?path=/story/help-menu--help-menu");
    cy.get("[data-cy=help-menu]").should("be.visible");
    cy.get("[data-cy=help-menu]").contains("Søgning");
    cy.get("[data-cy=help-menu]").contains("Login");
  });
});
