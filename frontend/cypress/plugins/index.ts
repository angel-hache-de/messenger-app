/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

// Socket.io client to allow Cypress itself
// to connect from the plugin file to the chat app
// to play the role of another user
import { io } from "socket.io-client";
import axios from "axios";
import jwtDecode from "jwt-decode";

import {
  IMessage,
  MESSAGES_SOCKET_EVENTS,
  MESSAGE_STATUS,
} from "../../src/store/types/messengerTypes";

import { IFriendsObj } from "../../src/store/types/friendsTypes";
import { IJWTDecoded, IUser } from "../../src/store/types/authTypes";

const decodeJWT = (jwt?: string): string | null => {
  if (!jwt) return null;
  const { iat, exp, ...user } = jwtDecode(jwt) as IJWTDecoded;
  const expTime = new Date(exp * 1000);

  if (new Date() > expTime) return null;

  return user.uid;
};

/**
 * @type {Cypress.PluginConfig}
 */
const plugins = (on: any, config: any) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

  let socket;
  let lastMessageReceived: IMessage = {} as IMessage;
  let friendId;
  let myId;

  on("task", {
    async connect({ email, password }: { email: string; password: string }) {
      try {
        const resp = await axios.post(
          "http://localhost:5000/api/messenger/users/login",
          {
            email,
            password,
          }
        );

        console.log(
          "Cypress is connecting to socket server under name %s",
          email
        );

        socket = io("ws://localhost:5000", {
          auth: {
            token: resp.data.token,
          },
        });

        myId = decodeJWT(resp.data.token);
      } catch (error) {
        console.log(error);
      }
      return null;
    },

    listenForEvents() {
      socket.on(
        MESSAGES_SOCKET_EVENTS.PRIVATE_MESSAGE_RECEIVED,
        (message: IMessage) => {
          lastMessageReceived = message;
        }
      );

      socket.on(
        MESSAGES_SOCKET_EVENTS.GET_USERS,
        (usersId: IFriendsObj<string>) => {
          Object.keys(usersId).forEach((key) => {
            friendId = key;
          });
        }
      );

      socket.on(MESSAGES_SOCKET_EVENTS.USER_CONNECTED, (user: IUser) => {
        console.log("Connecting", user.userName);

        friendId = user.uid;
      });

      return null;
    },

    sendMessage(message: string) {
      socket.emit(MESSAGES_SOCKET_EVENTS.SEND_MESSAGE, {
        emitterId: myId,
        id: "asfdadsdf123132312",
        message: {
          text: message,
        },
        receptorId: friendId,
        createdAt: new Date(),
      } as IMessage);

      return null;
    },

    sendTypingStatus(isTyping: boolean) {
      socket.emit(MESSAGES_SOCKET_EVENTS.NOTIFY_TYPING, {
        isTyping,
        receptorId: friendId,
      });

      return null;
    },

    sendMessageStatusUpdate(status: MESSAGE_STATUS) {
      socket.emit(MESSAGES_SOCKET_EVENTS.UPDATE_MESSAGE_STATUS_REQUEST, {
        receptorId: friendId,
        status: status,
      });

      return null;
    },

    disconnectFromChat() {
      socket.disconnect();

      return null;
    },
  });
};

export default plugins;
