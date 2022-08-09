describe("Testing the Sign Up page..", () => {
  beforeEach(() => {
    cy.visit("/messenger/register");
  });

  describe("Invalid SignUp", () => {
    it("Should be redirect to login page", () => {
      cy.contains("Register").should("exist");
    });

    it("Should show the error messages for invalid inputs", () => {
      cy.get("#form-control-username").type("t{backspace}");
      cy.get("#form-control-email").type("qw");
      cy.get("#form-control-password").type("qw");
      cy.get("#form-control-passwordConf").type("qwert");
      cy.get("#form-control-passwordConf").blur();

      cy.contains("Min password length is 6").should("exist");
      cy.contains("Enter a valid email").should("exist");
      cy.contains("Enter a valid username").should("exist");
      cy.contains("Passwords must be equal").should("exist");
    });

    it("Should show the 'img required' error", () => {
      cy.get("#form-control-username").type("angel");
      cy.get("#form-control-email").type("example@de.es");
      cy.get("#form-control-password").type("1234567");
      cy.get("#form-control-passwordConf").type("1234567");

      cy.get("button[type=submit]").click();
      cy.contains(/You must upload an image/);
    });
  });

  describe("Successful login", () => {
    before(() => {
      // spying and response stubbing
      cy.intercept("POST", `/api/messenger/users/signup`, {
        statusCode: 201,
        body: {
          /**
           * Token encoded with the jwt page, totally independant of
           * the backend implementation
           */
          token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiIxMjM0NTY3ODkwIiwidXNlck5hbWUiOiJBbmdlbCIsImVtYWlsIjoiYW5nZWxAZGUuZXMiLCJpbWFnZSI6ImZvbmRvLmpwZyIsImlhdCI6MTUxNjIzOTAyMn0.5zBAy0q0r5pvqtBtq8ABJZYWvDc_VlHmBe2oChEVBH0",
          successMessage: "Account Created!",
        },
      }).as("signup");

      /**
       * Expected to be an error  because the token is invalid
       */
      Cypress.on("uncaught:exception", (err, runnable) => {
        console.log(err);
        // cy.log(err.message);
        // returning false here prevents Cypress from
        // failing the test
        return false;
      });
    });

    it("Should do a Successful login", () => {
      cy.get("input[type=file]").selectFile(
        "cypress/fixtures/images/fondo.jpg",
        {
          force: true,
        }
      );
      cy.get("#form-control-username").type("angel");
      cy.get("#form-control-email").type("example@de.es");
      cy.get("#form-control-password").type("1234567");
      cy.get("#form-control-passwordConf").type("1234567");
      cy.get("button[type=submit]").click();

      cy.wait("@signup").then((interception) => {
        cy.log(JSON.stringify(interception));
      });

      cy.contains(/ACCOUNT CREATED/i).should("exist");
      cy.url().should("equal", "http://localhost:3000/");
    });
  });
});

/**
 * Disables the isolatedModules errors
 */
export {};
