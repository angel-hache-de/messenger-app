import { Dispatch } from "redux";
import { IImagesAction, IMAGES_ACTION_TYPE } from "../store/types/imagesTypes";
import { IStatusAction, STATUS_ACTION_TYPE } from "../store/types/statusTypes";

// Read the file and save it to store
export const uploadFile = (dispatch: Dispatch, file: File) => {
  if (!file.type.includes("image")) {
    dispatch({
      type: STATUS_ACTION_TYPE.SET_ERROR,
      payload: {
        error: "Only images are supported",
      },
    } as IStatusAction);
    return;
  }
  const reader = new FileReader();

  // Modifies the name

  // When the file is loaded save it to store.
  reader.onloadend = () => {
    const action: IImagesAction = {
      type: IMAGES_ACTION_TYPE.SET_IMAGES,
      payload: {
        imagesToSend: {
          [file.name]: file,
        },
        imagesToShow: {
          [file.name]: reader.result as string,
        },
      },
    };
    dispatch(action);
  };
  reader.readAsDataURL(file);
};
