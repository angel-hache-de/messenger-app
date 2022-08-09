import { MESSAGE_STATUS } from "../../../src/store/types/messengerTypes";

const SECOND_USER_USERNAME = "diana";
const SECOND_USER_EMAIL = "diana@de.es";
const SECOND_USER_PASSWORD = "podemos";

/**
 * TO-DO's
 * Test drag and drop images
 * https://glebbahmutov.com/blog/test-socketio-chat-using-cypress/#use-a-random-user-name
 */

describe("Testing the messenger screen", () => {
  /**
   * The login invocation
   */
  beforeEach(() => {
    cy.login("angel@de.es", "podemos");
  });

  /**
   * Connects the second user to chat
   */
  before(() => {
    cy.task("connect", {
      email: SECOND_USER_EMAIL,
      password: SECOND_USER_PASSWORD,
    });
    cy.task("listenForEvents");
  });

  it("Should display the auth user image, the active user image and the friend image", () => {
    cy.get("img").should("be.visible");

    /**
     * 3 images. One the user logged, 1 of the friend and 1 of the
     * active friend
     */
    cy.get("img", { timeout: 8000 }).should("have.length", 3);
  });

  it("Should send a message and show the status updated", () => {
    const messageToSend = "Hello W";
    cy.get(".friend-name").click();
    cy.get("#form-control-message").should("be.enabled");

    cy.get("#form-control-message").type(`${messageToSend}{enter}`);
    /**
     * 1 is the message in messages section
     * and the 2nd is in the last message in friends section
     * IMPORTANT: The messageToSend must be 10 characters or less
     */
    cy.findAllByText(/\bHello W\b/).should("have.length.at.least", 2); // eslint-disable-line

    cy.task("sendMessageStatusUpdate", MESSAGE_STATUS.SEEN);

    cy.findByTestId("message-status").find("img").should("exist"); // eslint-disable-line
  });

  it("should show the isTyping message", () => {
    // Avoid race conditions
    cy.get("img", { timeout: 8000 }).should("have.length", 3);

    cy.task("sendTypingStatus", true);
    cy.contains(/typing/i).should("exist");

    // Hide the message
    cy.task("sendTypingStatus", false);
    cy.contains(/typing/i).should("not.exist");
  });

  it("Should filter the friends", () => {
    cy.contains(SECOND_USER_USERNAME).should("exist");

    cy.get("input").type("qwerty");
    cy.contains(SECOND_USER_USERNAME).should("not.exist");
    cy.get("input").clear().type("diana");
    cy.contains(SECOND_USER_USERNAME).should("exist");
  });

  it("Shoul recieve a message", () => {
    const messageToReceive = "Hello bro";

    // Avoid race conditions
    cy.get("img", { timeout: 8000 }).should("have.length", 3);

    cy.task("sendMessage", messageToReceive);
    /**
     * Should display the "new" message in the friends section
     */
    cy.contains(/new/i).should("exist");
    cy.contains(messageToReceive).should("exist");
    /**
     * Should show the notification
     */
    const notification = `${SECOND_USER_USERNAME} sent you a message`;
    cy.contains(notification).should("exist");
  });
});

/**
 * To void the isolatedModules error
 */
export {};
