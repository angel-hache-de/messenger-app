import React from "react";
import { BsCameraVideoFill } from "react-icons/bs";
import { IoMdCall } from "react-icons/io";
import { HiDotsCircleHorizontal } from "react-icons/hi";
import { useSelector } from "react-redux";
import { IStoreState } from "../../store/types";

import "./chat-header.styles.scss";

interface IChatHeaaderProps {
  onClickFriendInfo: () => void;
}

const ChatHeader = ({ onClickFriendInfo }: IChatHeaaderProps) => {
  const { currentFriend, activeFriends } = useSelector(
    (state: IStoreState) => state.friends
  );

  return (
    <div className="header">
      <div className="image-name">
        <div className="image">
          <img src={currentFriend?.image} alt="Your friend" />
          {!!currentFriend && !!activeFriends[currentFriend.uid] && (
            <div className="active-icon" data-testid="active-icon" />
          )}
        </div>
        <div className="name">
          <h3>{currentFriend?.userName}</h3>
          {!!currentFriend?.isTyping && <p>Typing...</p>}
        </div>
      </div>
      <div className="icons">
        <div className="icon">
          <IoMdCall />
        </div>
        <div className="icon">
          <BsCameraVideoFill />
        </div>
        <div className="icon" onClick={onClickFriendInfo}>
          <HiDotsCircleHorizontal />
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;
