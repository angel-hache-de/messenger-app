export enum ENDPOINTS {
  LOGIN = "/api/messenger/users/login",
  LOGOUT = "/api/messenger/users/logout",
  SIGNUP = "/api/messenger/users/signup",
  /**Requires the message's id */
  UPDATE_MESSAGE = "/api/messenger/messages/update",
  GET_FRIENDS = "/api/messenger/friends",
  SEND_MESSAGE = "/api/messenger/messages/send",
  /**Requires the friend's id */
  GET_MESSAGES = "/api/messenger/messages/get",
}
