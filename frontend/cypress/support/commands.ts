/**
 * Command to login using cy.request
 */
Cypress.Commands.add("login", (email: string, password: string) => {
  cy.request("POST", "http://localhost:5000/api/messenger/users/login", {
    email,
    password,
  }).then((response) => {
    localStorage.setItem("authToken", response.body.token);

    cy.visit("/");
  });
});

/**
 * To void the isolatedModules error
 */
export {};
