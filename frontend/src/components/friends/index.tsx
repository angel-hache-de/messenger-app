import React, { useEffect, useState } from "react";
import { getFriends } from "../../store/actions/friendsActions";
import { useDispatch, useSelector } from "react-redux";
import { IStoreState } from "../../store/types";

import {
  FRIENDS_ACTION_TYPE,
  IFriendResponse,
  IFriendsAction,
} from "../../store/types/friendsTypes";
import Friend from "../friend";

import "./friends.style.scss";
import { BiSearch } from "react-icons/bi";

const Friends = () => {
  const dispatch = useDispatch();
  const { friends, currentFriend } = useSelector(
    (state: IStoreState) => state.friends
  );

  const [search, setSearch] = useState("");

  useEffect(() => {
    dispatch(getFriends());
  }, [dispatch]);

  // Updates the current friend
  const handleClickOnFriend = ({ lastMessage, ...friend }: IFriendResponse) => {
    if (friend !== currentFriend)
      dispatch({
        type: FRIENDS_ACTION_TYPE.SET_CURRENT_FRIEND,
        payload: {
          currentFriend: friend,
        },
      } as IFriendsAction);
  };

  const handleChangeSearch = (ev: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(ev.target.value);
  };

  // Filtering the friends...
  const fileteredFriends: IFriendResponse[] = Object.values(friends).filter(
    (friend) => friend.userName.includes(search)
  );

  return (
    <>
      <div className="friend-search">
        <button>
          <BiSearch />
        </button>
        <input
          type="text"
          placeholder="search"
          className="form-control"
          value={search}
          onChange={handleChangeSearch}
        />
      </div>
      <div className="friends">
        {fileteredFriends &&
          fileteredFriends.map((friend: IFriendResponse) => (
            <div
              key={friend.uid}
              className={`hover-friend ${
                currentFriend?.uid === friend.uid && "active"
              }`}
              onClick={() => handleClickOnFriend(friend)}
            >
              <Friend friend={friend} />
            </div>
          ))}
        {/* <div className="hover-friend active">
          <Friend />
        </div>
        <div className="hover-friend">
          <Friend />
        </div>
        <div className="hover-friend">
          <Friend />
        </div>
        <div className="hover-friend">
          <Friend />
        </div>
        <div className="hover-friend">
          <Friend />
        </div>
        <div className="hover-friend">
          <Friend />
        </div> */}
      </div>
    </>
  );
};

export default Friends;
