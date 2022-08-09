import React, { useState } from "react";

import "./right-side.style.scss";
import MessageSend from "../message-send";
import FriendInfo from "../friend-info";

import Messages from "../messages";
import ChatHeader from "../chat-header";
import { Socket } from "socket.io-client";

interface IRightSideProps {
  socket: React.MutableRefObject<Socket | null>;
}

const RightSide = ({ socket }: IRightSideProps) => {
  const [showFriendInfo, setShowFriendInfo] = useState(false);

  const toggleShowFriend = () => {
    setShowFriendInfo(!showFriendInfo);
  };

  const classNameChat = showFriendInfo ? "col-8" : "col-12";

  return (
    <div className="col-9">
      <div className="right-side">
        <div className="row">
          <div className={classNameChat}>
            <div className="message-send-show">
              <ChatHeader onClickFriendInfo={toggleShowFriend} />
              <Messages />
              <MessageSend socket={socket} />
            </div>
          </div>
          {showFriendInfo && (
            <div className="col-4">
              <FriendInfo />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RightSide;
