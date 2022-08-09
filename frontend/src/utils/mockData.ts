import { IStoreState } from "../store/types";
import { IAuthSate } from "../store/types/authTypes";
import { IFriendResponse, IFriendsState } from "../store/types/friendsTypes";
import { IImagesState } from "../store/types/imagesTypes";
import {
  IMessage,
  IMessengerState,
  MESSAGE_STATUS,
} from "../store/types/messengerTypes";
import { IStatusState, THEMES } from "../store/types/statusTypes";

/**
 * Mocking all the data of the store
 */

export const MOCK_USER_ID = "user-id";
export const MOCK_USER_ID2 = "user-id2";

export const mockMessage: IMessage = {
  emitterId: MOCK_USER_ID,
  id: "some-id",
  receptorId: "receptor-id",
  message: {
    text: "Hey bro!",
  },
  createdAt: new Date(),
  status: MESSAGE_STATUS.DELIVERED,
};

export const mockFriend: IFriendResponse = {
  email: "angel@new.es",
  image: "./image",
  lastMessage: mockMessage,
  uid: MOCK_USER_ID,
  userName: "Angel",
  isTyping: true,
};

export const mockFriend2: IFriendResponse = {
  ...mockFriend,
  userName: "diana",
  uid: MOCK_USER_ID2,
  lastMessage: null,
};

export const mockReduxStatusState: IStatusState = {
  error: "",
  success: "",
  theme: THEMES.DARK,
};

export const mockReduxMessengerState: IMessengerState = {
  messageSentSuccessfully: false,
  messages: [mockMessage],
};

export const mockReduxImagesState: IImagesState = {
  imagesToSend: {},
  imagesToShow: {
    one: `fondo.jpg`,
    two: `pic.jpg`,
  },
};

export const mockReduxAuthState: IAuthSate = {
  authenticated: true,
  error: "",
  isLoading: false,
  successMessage: "",
  userInf: mockFriend,
};

export const mockReduxFriendsState: IFriendsState = {
  friends: {
    [MOCK_USER_ID]: mockFriend,
    [MOCK_USER_ID2]: mockFriend2,
  },
  activeFriends: {
    [MOCK_USER_ID]: MOCK_USER_ID,
  },
  currentFriend: mockFriend,
  loading: false,
};

export const mockStoreState: IStoreState = {
  auth: mockReduxAuthState,
  friends: mockReduxFriendsState,
  images: mockReduxImagesState,
  messenger: mockReduxMessengerState,
  status: mockReduxStatusState,
};
