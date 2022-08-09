import React from "react";
import { createPortal } from "react-dom";

import "./image-modal.styles.scss";

interface IImageModalProps {
  image: string;
  onClickShadow: () => void;
}

const ImageModal = ({ image, onClickShadow }: IImageModalProps) => {
  return createPortal(
    <>
      <div className="modal-shadow" onClick={onClickShadow} />
      <div className="modal">
        <img
          src={image}
          // src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.OQT9MINVgC2WOXHtYtJzUgHaJ4%26pid%3DApi&f=1"
          alt=""
        />
      </div>
    </>,
    document.getElementById("app-modal")!
  );
};

export default ImageModal;
