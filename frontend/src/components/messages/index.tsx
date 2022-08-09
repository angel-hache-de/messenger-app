import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessages } from "../../store/actions/messengerActions";
import { IStoreState } from "../../store/types";
import { IMessage } from "../../store/types/messengerTypes";
import ImageModal from "../image-modal";
import { Message } from "../message";

import "./messages.style.scss";

const Messages = () => {
  // Modal to show an image
  const [imageInModal, setImageInModal] = useState<string | null>(null);

  const dispatch = useDispatch();
  // Helps that the scroll is already in the bottom
  const scrollRef = useRef<HTMLDivElement>(null);
  const { messages, currentFriend } = useSelector((state: IStoreState) => ({
    currentFriend: state.friends.currentFriend,
    messages: state.messenger.messages,
  }));

  // Puts on view the last message
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Gets the messages
  useEffect(() => {
    const fetchMessages = async () => {
      dispatch(getMessages(currentFriend!));
    };

    fetchMessages();
  }, [dispatch, currentFriend]);

  // Open the modal to show the image clicked
  const handleClickImage = (image: string | null) => {
    setImageInModal(image);
  };

  return (
    <div className="message-show">
      {messages.map((message) => (
        <Message
          message={message}
          onClick={handleClickImage}
          key={message.id}
          ref={scrollRef}
          emitterImg={
            message.emitterId === currentFriend!.uid
              ? currentFriend!.image
              : undefined
          }
        />
      ))}
      {/* Is typing message */}
      {!!currentFriend?.isTyping && (
        <Message
          message={{} as IMessage}
          onClick={handleClickImage}
          // ref={null}
          emitterImg={currentFriend!.image}
          typingMessage={true}
        />
      )}
      {/* Modal to display image clicked */}
      {!!imageInModal && (
        <ImageModal
          image={imageInModal}
          onClickShadow={() => setImageInModal(null)}
        />
      )}
    </div>
  );
};

export default Messages;
