/**
 * @file
 * Test functionality of Header
 */
describe("Modal", () => {
  beforeEach(function () {
    cy.visit("/iframe.html?id=modal-menu--show-modal");
  });

  it.skip(`Can show modal with menu template`, () => {
    cy.get("[data-cy=button-toggle-menu]").click();
    cy.get("[data-cy=modal-container]").should("be.visible");
    cy.get("[data-cy=menu-modal]").should("be.visible");
  });

  it.skip(`Can close modal on close button click`, () => {
    cy.get("[data-cy=button-toggle-menu]").click();
    cy.wait(500);
    cy.get("[data-cy=close-modal]").click();
    cy.get("[data-cy=modal-dimmer]").should(
      "have.css",
      "pointer-events",
      "none"
    );
    cy.get("[data-cy=modal-container]").should("not.be.visible");
  });

  // BETA-1 elements removed tab-order fucked up - skip
  // @ TODO enable
  it.skip(`Tab is trapped in Menu modal`, () => {
    cy.get("[data-cy=button-toggle-menu]").click();
    cy.wait(500);

    cy.get("body");
    cy.focused().should("have.attr", "data-cy", "modal-container");

    // Tab to first element in modal
    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "close-modal");

    // Tab to last element in modal
    cy.tabs(10);
    cy.focused().should("have.attr", "data-cy", "menu-link-language");

    // Next tab will send the tab order back to start
    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "close-modal");
  });

  // BETA-1 elements removed tab-order fucked up - skip
  // @ TODO enable
  it.skip(`Tab is trapped in Menu modal`, () => {
    cy.get("[data-cy=button-toggle-menu]").click();
    cy.wait(500);

    cy.focused().should("have.attr", "data-cy", "modal-container");

    // Tab to first element in modal
    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "close-modal");

    // Tab to last element in modal
    cy.tabs(10);
    cy.focused().should("have.attr", "data-cy", "menu-link-language");

    // Next tab will send the tab order back to start
    cy.tabs(1);
    cy.focused().should("have.attr", "data-cy", "close-modal");
  });

  // BETA-1 elements removed, tab-order fucked up - skip
  // @ TODO enable
  it.skip(`Can click and trap Tab in material categories`, () => {
    cy.get("[data-cy=button-toggle-menu]").click();
    cy.wait(500);

    cy.get("[data-cy=menu-link-categories]").click();

    // Tab to first element in modal
    cy.get("body").tab();
    cy.focused().should("have.attr", "data-cy", "close-modal");

    // Tab to last element in modal
    cy.tabs(8);
    cy.focused().should("have.attr", "data-cy", "menu-link-nodes");

    // Next tab will send the tab order back to start
    cy.tab();
    cy.focused().should("have.attr", "data-cy", "close-modal");
  });

  it.skip(`Can click on language`, () => {
    cy.get("[data-cy=button-toggle-menu]").click();
    cy.wait(500);

    cy.get("[data-cy=menu-link-language]").scrollIntoView();

    cy.get("[data-cy=menu-link-language]").should("be.visible");
    cy.get("[data-cy=menu-link-language]").click();

    cy.on("window:alert", (str) => {
      expect(str).to.equal(`Language changed`);
    });
  });
});
