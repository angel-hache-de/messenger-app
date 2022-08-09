import React, { useEffect, useState } from "react";
import { BiMessageAltEdit } from "react-icons/bi";
import { BsPlusCircle } from "react-icons/bs";
import { RiGalleryLine } from "react-icons/ri";
import { AiFillGift } from "react-icons/ai";

import "./message-send.styles.scss";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../store/types";
import { IoMdSend } from "react-icons/io";
import {
  IMessengerAction,
  MESSAGES_SOCKET_EVENTS,
  MESSENGER_ACTION_TYPE,
} from "../../store/types/messengerTypes";
import { sendMessage } from "../../store/actions/messengerActions";
import DropFilesSection from "../drop-files-section";

import {
  IImagesAction,
  IMAGES_ACTION_TYPE,
} from "../../store/types/imagesTypes";

import { Socket } from "socket.io-client";

import { ITypingMessageRequest } from "../../store/types/socketTypes";
import {
  FRIENDS_ACTION_TYPE,
  IFriendsAction,
} from "../../store/types/friendsTypes";
import { uploadFile } from "../../utils/functions";

const emojis = [
  "🤦",
  "😋",
  "😱",
  "😘",
  "😓",
  "🤠",
  "🤫",
  "🤕",
  "😤",
  "😷",
  "🧐",
  "🙅",
  "😻",
  "👍",
  "👀",
  "🧟",
];

interface IMessageSendProps {
  socket: React.MutableRefObject<Socket | null>;
}

const MessageSend = ({ socket }: IMessageSendProps) => {
  const [showEmojis, setShowEmojis] = useState(false);
  const { currentFriend } = useSelector((state: IStoreState) => state.friends);
  const { imagesToSend } = useSelector((state: IStoreState) => state.images);
  const { messageSentSuccessfully, messages } = useSelector(
    (state: IStoreState) => state.messenger
  );
  const [message, setMessage] = useState<string>("");
  const dispatch = useDispatch();

  // Emits the isTyping event
  useEffect(() => {
    const { uid } = currentFriend!;
    socket.current?.emit(MESSAGES_SOCKET_EVENTS.NOTIFY_TYPING, {
      isTyping: !!message,
      receptorId: uid,
    } as ITypingMessageRequest);
  }, [message, socket, currentFriend]);

  // Cleans the state when the current friend changes
  useEffect(() => {
    setMessage("");
  }, [currentFriend]);

  // If the message was send successfully, then it send the
  // message with the socket
  useEffect(() => {
    if (messageSentSuccessfully) {
      const message = messages[messages.length - 1];
      console.log("EMITTING....");

      socket.current?.emit(MESSAGES_SOCKET_EVENTS.SEND_MESSAGE, message);

      dispatch({
        type: MESSENGER_ACTION_TYPE.CLEAR_MESSAGE_SUCCESS,
        payload: {},
      } as IMessengerAction);

      dispatch({
        type: FRIENDS_ACTION_TYPE.SET_LAST_MESSAGE,
        payload: {
          newMessage: {
            friendId: message.receptorId,
            message: message,
          },
        },
      } as IFriendsAction);
    }
  }, [messageSentSuccessfully, dispatch, messages, socket]);

  // Input handler
  const handleOnChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(ev.target.value);
  };

  // Show/Hide the emojis
  const toggleShowEmojis = (ev: React.MouseEvent<HTMLLabelElement>) => {
    setShowEmojis(!showEmojis);
  };

  // Add an emoji to text in input
  const handleClickOnEmoji = (emoji: string) => {
    setMessage(message + emoji);
  };

  // Controls when the user add a file
  const handleChangeFileInput = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files && ev.target.files.length > 0)
      uploadFile(dispatch, ev.target.files[0]);
  };

  // Send a message when enter is pressed
  const handleKeyPress = (ev: React.KeyboardEvent) => {
    if (ev.key === "Enter") submitMessage(message);
  };

  // Send a message
  const submitMessage = (text: string) => {
    if (!text.trim().length && !Object.keys(imagesToSend).length) return;

    const formData = new FormData();
    formData.append("receptorId", currentFriend!.uid);
    formData.append("text", text);
    const images: File[] = [];

    // If there are images to be send
    if (!!Object.keys(imagesToSend).length) {
      Object.keys(imagesToSend).forEach((key) => {
        formData.append("file", imagesToSend[key]);
        images.push(imagesToSend[key]);
      });
    }

    // Send message
    dispatch(sendMessage(formData));

    // Clean the input
    setMessage("");
    dispatch({
      type: IMAGES_ACTION_TYPE.CLEAR_IMAGES,
      payload: {},
    } as IImagesAction);
  };

  return (
    <div className="send-message">
      <DropFilesSection>
        <div className="message-send-section">
          <div className="file hover-attachment">
            <div className="add-attachment">Add Attachment</div>
            <BsPlusCircle />
          </div>
          <div className="file hover-image">
            <div className="add-image">Add Image </div>
            <input
              type="file"
              className="form-control"
              id="pic"
              onChange={handleChangeFileInput}
            />
            <label htmlFor="pic">
              <RiGalleryLine />
            </label>
            {/* <div className="files_quantity">
            <span>3</span>
          </div> */}
          </div>
          <div className="file">
            <BiMessageAltEdit />
          </div>
          <div className="file hover-gift">
            <div className="add-gift">Add Gift</div>
            <AiFillGift />
          </div>
          <div className="message-type">
            <input
              type="text"
              className="form-control"
              placeholder="Aa"
              id="form-control-message"
              value={message}
              onChange={handleOnChange}
              onKeyPress={handleKeyPress}
            />
            <label onClick={toggleShowEmojis}>😄</label>
          </div>
          {!!message.trim().length && (
            <div
              data-testid="send-icon"
              className="file"
              onClick={() => submitMessage(message)}
            >
              <IoMdSend />
            </div>
          )}
          {!message.trim().length && (
            <div className="file" onClick={() => submitMessage("💓")}>
              💓
            </div>
          )}
          {showEmojis && (
            <div className="emoji-section">
              <div className="emoji">
                {emojis.map((emoji, i) => (
                  <span key={i} onClick={() => handleClickOnEmoji(emoji)}>
                    {emoji}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </DropFilesSection>
    </div>
  );
};

export default MessageSend;
