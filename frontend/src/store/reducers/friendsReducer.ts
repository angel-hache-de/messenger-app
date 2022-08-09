import {
  FRIENDS_ACTION_TYPE,
  IFriendsAction,
  IFriendsState,
} from "../types/friendsTypes";

const friendsState: IFriendsState = {
  friends: {},
  activeFriends: {},
  currentFriend: null,
  loading: true,
};

export const friendsReducer = (
  state = friendsState,
  action: IFriendsAction
) => {
  const { type, payload } = action;

  switch (type) {
    case FRIENDS_ACTION_TYPE.CLEAR_FRIENDS:
      return {
        ...state,
        friends: {},
        activeFriends: {}
      } as IFriendsState;
    case FRIENDS_ACTION_TYPE.SET_LOADING:
      return {
        ...state,
        loading: payload.loading,
      } as IFriendsState;
    case FRIENDS_ACTION_TYPE.SET_FRIENDS:
      return {
        ...state,
        friends: {
          ...payload.friends,
          ...state.friends,
        },
      } as IFriendsState;
    case FRIENDS_ACTION_TYPE.SET_CURRENT_FRIEND:
      return {
        ...state,
        currentFriend: payload.currentFriend,
      } as IFriendsState;
    case FRIENDS_ACTION_TYPE.SET_ACTIVE_FRIENDS:
      const newState: IFriendsState = {
        ...state,
        activeFriends: {
          ...state.activeFriends,
          ...payload.activeFriends,
        },
      };
      return newState;
    case FRIENDS_ACTION_TYPE.REMOVE_ACTIVE_FRIEND:
      if (!payload.activeFriend) return state;
      delete state.activeFriends[payload.activeFriend];
      return {
        ...state,
        activeFriends: state.activeFriends,
      } as IFriendsState;
    case FRIENDS_ACTION_TYPE.SET_IS_TYPING:
      if (!payload.typing) return state;
      const { friends } = state;
      friends[payload.typing.userId].isTyping = payload.typing.isTyping;
      return {
        ...state,
        friends,
      } as IFriendsState;
    case FRIENDS_ACTION_TYPE.SET_LAST_MESSAGE:
      if (!payload.newMessage) return state;
      const { friendId, message } = payload.newMessage;
      state.friends[friendId].lastMessage = message;
      return {
        ...state,
      } as IFriendsState;
    case FRIENDS_ACTION_TYPE.SET_MESSAGES_STATUS:
      if (!payload.messageStatus) return state;
      const { friendId: fId, status } = payload.messageStatus;

      if (!state.friends[fId].lastMessage) return state;

      state.friends[fId].lastMessage!.status = status;
      return {
        ...state,
      };
    default:
      return state;
  }
};
