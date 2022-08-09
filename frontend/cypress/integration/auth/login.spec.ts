describe("Testing the Login page..", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  describe("Invalid login", () => {
    it("Should be redirect to login page", () => {
      cy.url().should("contain", "login");

      cy.contains("Login").should("exist");
    });

    it("Should show the error messages", () => {
      cy.get("#form-control-email").type("qw");
      cy.get("#form-control-password").type("qw");
      cy.get("#form-control-password").blur();

      cy.contains("Enter a valid password").should("exist");
      cy.contains("Enter a valid email").should("exist");
    });

    it("Should show the 'invalid credentials' error", () => {
      cy.get("#form-control-email").type("example@de.es");
      cy.get("#form-control-password").type("asdffggf");
      cy.get("button[type=submit]").click();

      cy.contains(/Invalid credentials/);
    });
  });

  describe("Successful login", () => {
    /**
     * Used to catch the CheckFields error that just appears
     * when testing with Cypress
     */
    Cypress.on("uncaught:exception", (err, runnable) => {
      console.log(err);
      // cy.log(err.message);
      // returning false here prevents Cypress from
      // failing the test
      return false;
    });

    it("Should do a Successful login", () => {
      cy.get("#form-control-email").type("angel@de.es");
      cy.get("#form-control-password").type("podemos");
      cy.get("button[type=submit]").click();

      cy.contains(/WELCOME BACK/i).should("exist");
      cy.get("img").should("exist");
      cy.url().should("equal", "http://localhost:3000/");
    });
  });
});

/**
 * Disables the isolatedModules errors
 */
export {};
