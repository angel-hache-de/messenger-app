import { IAuthSate } from "./authTypes";
import { IFriendsState } from "./friendsTypes";
import { IImagesState } from "./imagesTypes";
import { IMessengerState } from "./messengerTypes";
import { IStatusState } from "./statusTypes";

export interface IStoreState {
  auth: IAuthSate;
  messenger: IMessengerState;
  friends: IFriendsState;
  images: IImagesState;
  status: IStatusState;
}
