import React from "react";
import moment from "moment";
import { BsImageFill } from "react-icons/bs";
import { IFriendResponse } from "../../store/types/friendsTypes";

import "./friend.styles.scss";
import { AiFillCheckCircle, AiOutlineCheckCircle } from "react-icons/ai";
import { MESSAGE_STATUS } from "../../store/types/messengerTypes";

interface IFriendProps {
  friend: IFriendResponse;
}

const Friend = ({ friend }: IFriendProps) => {
  const getMessageStatus = () => {
    if (!friend?.lastMessage) return;

    const { lastMessage } = friend;

    if (
      lastMessage.emitterId === friend.uid &&
      lastMessage.status !== MESSAGE_STATUS.SEEN
    )
      return <span>New</span>;
    /**
     * If the message has been seen
     */
    if (lastMessage.emitterId === friend.uid) return;

    if (lastMessage.status === MESSAGE_STATUS.SEEN)
      return (
        <div className="image-container">
          <img src={friend.image} alt="Your friend" />
        </div>
      );

    if (lastMessage.status === MESSAGE_STATUS.DELIVERED)
      return <AiFillCheckCircle />;

    if (lastMessage.status === MESSAGE_STATUS.SENT)
      return <AiOutlineCheckCircle />;
  };

  return (
    <div className="friend">
      <div className="friend-image item">
        <div className="image">
          {!!friend && <img src={friend?.image} alt="" />}
        </div>
      </div>
      <div className="friend-name item">
        <h4>{friend.userName}</h4>
        {/* If is typing */}
        {!!friend.isTyping && <p>typing...</p>}

        {!friend.isTyping && !!friend.lastMessage && (
          <div className="message-info">
            {friend.lastMessage.emitterId !== friend.uid && <span>You:</span>}
            {!!friend.lastMessage.message.images?.length && (
              <span>{<BsImageFill />}</span>
            )}
            <span>{friend.lastMessage?.message.text.slice(0, 10)}...</span>
            <span className="moment-time">
              {moment(friend.lastMessage.createdAt)
                .startOf("seconds")
                .fromNow()}
            </span>
          </div>
        )}
        {!friend.isTyping && !friend.lastMessage && <p>Start a conversation</p>}
      </div>
      <div className="message-label item" data-testid="message-status">
        {getMessageStatus()}
      </div>
    </div>
  );
};

export default Friend;
