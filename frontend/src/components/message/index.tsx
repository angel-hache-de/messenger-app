import React, { LegacyRef } from "react";
import { IMessage } from "../../store/types/messengerTypes";

import "./message.style.scss";

interface IMessageProps {
  // Message to display
  message: IMessage;
  // Image of the person who sent the message. (Current friend)
  emitterImg?: string;
  onClick: (image: string | null) => void;
  // Indicates if the current message must show the typing animation
  typingMessage?: boolean;
}

export const Message = React.forwardRef(
  (
    { message, onClick, emitterImg, typingMessage }: IMessageProps,
    ref: LegacyRef<HTMLDivElement>
  ) => {
    const className = emitterImg ? "received" : "sent";
    return (
      <div className={`message-container ${className}`} ref={ref}>
        <div className="message-image">
          {!!emitterImg && <img src={emitterImg} alt="Your friend" />}
          <div className="content-container">
            {!typingMessage && (
              <>
                <div className="images-container">
                  {!!message.message.images &&
                    message.message.images.length > 0 &&
                    message.message.images.map((image) => {
                      // This was used when the socket was
                      // sending images as buffer array
                      // let src = `/messages/${image}`;
                      // if (typeof image === "object") {
                      //   const blob = new Blob([image]);
                      //   src = URL.createObjectURL(blob);
                      // } else src = `/messages/${image}`;
                      return (
                        <img
                          src={image as string}
                          key={image as string}
                          alt="Content shared"
                          onClick={() => onClick(image as string)}
                        />
                      );
                    })}
                </div>
                <p>{message.message.text}</p>
              </>
            )}
            {!!typingMessage && (
              <div className="dot-elastic" data-testid="typing" />
            )}
          </div>
        </div>
        {!typingMessage && (
          <div className="time">
            {message.createdAt && new Date(message.createdAt).toLocaleString()}
          </div>
        )}
      </div>
    );
  }
);
