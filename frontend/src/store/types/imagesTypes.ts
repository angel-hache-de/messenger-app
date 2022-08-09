export enum IMAGES_ACTION_TYPE {
  // IMAGES
  SET_IMAGES = "SET_IMAGES",
  CLEAR_IMAGES = "CLEAR_IMAGES",
  REMOVE_IMAGE = "REMOVE_IMAGE",
}

export interface IImageObj<T> {
  [name: string]: T;
}

export interface IImagesState {
  // Images that will be send to api
  imagesToSend: IImageObj<File>;
  //   Images to display in the images component
  imagesToShow: IImageObj<string>;
}

export interface IImagesPayload {
  imagesToSend?: IImageObj<File>;
  imagesToShow?: IImageObj<string>;
  //Used to remove the key from the images object
  key?: string;
}

export type ImagesDispatchType = (args: IImagesAction) => IImagesState;

export interface IImagesAction {
  type: IMAGES_ACTION_TYPE;
  payload: IImagesPayload;
}
