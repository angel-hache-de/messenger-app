import React, { useState } from "react";

import "./friend-info.style.scss";
import { BsChevronDown } from "react-icons/bs";
import { useSelector } from "react-redux";
import { IStoreState } from "../../store/types";

// interface IFriendInfo {
//   currentFriend: IUser;
// }

const FriendInfo = () => {
  const [showGallery, setShowGallery] = useState(false);
  const { currentFriend, activeFriends } = useSelector(
    (state: IStoreState) => state.friends
  );

  const toggleGallery = () => {
    setShowGallery(!showGallery);
  };

  return (
    <div className="friend-info">
      <div className="image-name">
        <div className="image">
          <img src={currentFriend?.image} alt="" />
        </div>
        <div className="active-user">
          {!!currentFriend && !!activeFriends[currentFriend.uid] && "Active"}
        </div>
        <div className="name">
          <h4>{currentFriend?.userName}</h4>
        </div>
      </div>
      <div className="others">
        <div className="custom-chat">
          <h3>Customise Chat</h3>
          <BsChevronDown />
        </div>
        <div className="privacy">
          <h3>Privacy And Support</h3>
          <BsChevronDown />
        </div>
        <div className="media" onClick={toggleGallery}>
          <h3>Shared Media</h3>
          <BsChevronDown />
        </div>
      </div>
      {showGallery && (
        <div className="gallery">
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
          <img
            src="https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.thetab.com%2Fblogs.dir%2F192%2Ffiles%2F2016%2F10%2Ftumblr-oae0xntlsg1s6c97mo3-1280.png&f=1&nofb=1"
            alt=""
          />
        </div>
      )}
    </div>
  );
};

export default FriendInfo;
