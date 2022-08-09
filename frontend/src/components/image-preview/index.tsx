import React from "react";
import { AiFillCloseCircle } from "react-icons/ai";

import "./image-preview.styles.scss";

interface IImagePreviewProps {
  image?: string;
  onClickHandler?: () => void;
}

const ImagePreview = ({ image, onClickHandler }: IImagePreviewProps) => {
  return (
    <div className="image-preview-container">
      <div className="image">
        <img
          src={
            !!image
              ? image
              : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.OQT9MINVgC2WOXHtYtJzUgHaJ4%26pid%3DApi&f=1"
          }
          alt=""
        />
      </div>
      <div
        className="icon"
        onClick={() => !!onClickHandler && onClickHandler()}
        data-testid="close-icon"
      >
        <AiFillCloseCircle size={20} />
      </div>
    </div>
  );
};

export default ImagePreview;
