import React from "react";

import "./active-friend.styles.scss";

export interface IActiveFriendProps {
  image: string;
  name: string;
  handleClick: () => void;
}

const ActiveFriend = ({ image, name, handleClick }: IActiveFriendProps) => {
  return (
    <div className="image" onClick={handleClick}>
      <img
        title={name}
        src={
          image
            ? image
            : "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.OQT9MINVgC2WOXHtYtJzUgHaJ4%26pid%3DApi&f=1"
        }
        alt={name}
      />
      <div className="active-icon" />
    </div>
  );
};

export default ActiveFriend;
