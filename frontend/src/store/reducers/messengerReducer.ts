import {
  IMessengerAction,
  IMessengerState,
  MESSENGER_ACTION_TYPE,
} from "../types/messengerTypes";

const messengerState: IMessengerState = {
  messages: [],
  messageSentSuccessfully: false,
};

export const messengerReducer = (
  state = messengerState,
  action: IMessengerAction
) => {
  const { type, payload } = action;

  switch (type) {
    case MESSENGER_ACTION_TYPE.CLEAR_MESSAGES:
      return {
        ...state,
        messages: [],
      } as IMessengerState;
    case MESSENGER_ACTION_TYPE.SET_MESSAGES:
      return {
        ...state,
        messages: payload.messages,
      } as IMessengerState;
    case MESSENGER_ACTION_TYPE.ADD_MESSAGE:
      return {
        ...state,
        messages: [...state.messages, payload.message],
      } as IMessengerState;
    case MESSENGER_ACTION_TYPE.SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        messageSentSuccessfully: true,
        messages: [...state.messages, payload.message],
      } as IMessengerState;
    case MESSENGER_ACTION_TYPE.CLEAR_MESSAGE_SUCCESS:
      return {
        ...state,
        messageSentSuccessfully: false,
      } as IMessengerState;
    default:
      return state;
  }
};
