import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../store/types";
import { IUser } from "../../store/types/authTypes";
import {
  FRIENDS_ACTION_TYPE,
  IFriendsAction,
} from "../../store/types/friendsTypes";
import ActiveFriend from "../active-friend";

import "./active-friends.styles.scss";

const ActiveFriends = () => {
  const dispatch = useDispatch();
  const { activeFriends, friends } = useSelector(
    (state: IStoreState) => state.friends
  );

  const handleClickOnFriend = (friend: IUser) => {
    dispatch({
      type: FRIENDS_ACTION_TYPE.SET_CURRENT_FRIEND,
      payload: {
        currentFriend: friend,
      },
    } as IFriendsAction);
  };

  if (
    Object.values(friends).length === 0 ||
    Object.values(activeFriends).length === 0
  )
    return <></>;

  return (
    <div className="active-friends">
      <div className="image-active-icon">
        {Object.values(activeFriends).map((friend) => {
          const { image, uid, userName } = friends[friend];
          return (
            <ActiveFriend
              handleClick={() => handleClickOnFriend(friends[friend])}
              key={uid}
              image={image}
              name={userName}
            />
          );
        })}
      </div>
    </div>
  );
};

export default ActiveFriends;
