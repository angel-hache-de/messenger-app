import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../store/types";
import {
  IImagesAction,
  IMAGES_ACTION_TYPE,
} from "../../store/types/imagesTypes";
import ImagePreview from "../image-preview";

import "./images-preview.styles.scss";

const ImagesPreview = () => {
  const { imagesToShow } = useSelector((state: IStoreState) => state.images);

  const dispatch = useDispatch();

  const handleClickRemove = (image: string) => {
    dispatch({
      type: IMAGES_ACTION_TYPE.REMOVE_IMAGE,
      payload: {
        key: image,
      },
    } as IImagesAction);
  };

  return (
    <div className="images-container">
      {Object.keys(imagesToShow).map((key) => (
        <ImagePreview
          key={key}
          image={imagesToShow[key]}
          onClickHandler={() => handleClickRemove(key)}
        />
      ))}
    </div>
  );
};

export default ImagesPreview;
