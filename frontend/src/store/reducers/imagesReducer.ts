import {
  IImagesAction,
  IImagesState,
  IMAGES_ACTION_TYPE,
} from "../types/imagesTypes";

const imagesState: IImagesState = {
  imagesToSend: {},
  imagesToShow: {},
};

export const imagesReducer = (state = imagesState, action: IImagesAction) => {
  const { type, payload } = action;

  switch (type) {
    case IMAGES_ACTION_TYPE.SET_IMAGES:
      return {
        imagesToShow: {
          ...state.imagesToShow,
          ...payload.imagesToShow,
        },
        imagesToSend: {
          ...payload.imagesToSend,
          ...state.imagesToSend,
        },
      } as IImagesState;
    case IMAGES_ACTION_TYPE.REMOVE_IMAGE:
      //   Removes the key from the images object
      const newImagesSendObj = state.imagesToSend;
      const newImagesShowObj = state.imagesToShow;
      //   The key is the same (the file name)
      delete newImagesSendObj[payload.key!];
      delete newImagesShowObj[payload.key!];
      return {
        imagesToSend: newImagesSendObj,
        imagesToShow: newImagesShowObj,
      } as IImagesState;
    case IMAGES_ACTION_TYPE.CLEAR_IMAGES:
      return {
        imagesToShow: {},
        imagesToSend: {},
      } as IImagesState;
    default:
      return state;
  }
};
