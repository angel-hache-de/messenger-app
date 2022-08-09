import React from "react";
import { BiLogOut, BiMoon, BiSun } from "react-icons/bi";
import { useDispatch, useSelector, useStore } from "react-redux";
import { logout } from "../../store/actions/authActions";
import { setTheme } from "../../store/actions/statusActios";
import { IStoreState } from "../../store/types";
import { THEMES } from "../../store/types/statusTypes";

import "./friend-section-header.styles.scss";

interface IFriendsSectionHeaderProps {
  image: string;
  username: string;
}

const FriendSectionHeader = ({
  image,
  username,
}: IFriendsSectionHeaderProps) => {
  // const [showMenu, setShowMenu] = useState(false);
  const { theme } = useSelector((state: IStoreState) => state.status);
  const dispatch = useDispatch();

  // const toggleShowMenu = () => {
  //   setShowMenu(!showMenu);
  // };

  const logoutUser = () => {
    dispatch(logout());
  };

  const toggleTheme = () => {
    if (theme === THEMES.WHITE) return dispatch(setTheme(THEMES.DARK));

    dispatch(setTheme(THEMES.WHITE));
  };

  return (
    <div className="top">
      <div className="image-name">
        <div className="image">
          <img src={image} alt="This is you" />
        </div>
        <div className="name">
          <h3>{username}</h3>
        </div>
      </div>
      <div className="icons">
        <div className="icon" onClick={logoutUser}>
          <BiLogOut />
        </div>
        <div className="icon" onClick={toggleTheme}>
          {theme === THEMES.WHITE ? <BiMoon /> : <BiSun />}
        </div>
        {/* {showMenu && (
          <div className={`menu ${showMenu && "show"}`}>
            <h3>Dark Mode</h3>
            <div className="on">
              <label htmlFor="dark">ON</label>
              <input
                type="radio"
                name="theme"
                value="dark"
                onChange={() => handleSetTheme(THEMES.DARK)}
              />
            </div>
            <div className="of">
              <label htmlFor="white">Off</label>
              <input
                type="radio"
                name="theme"
                value="white"
                onChange={() => handleSetTheme(THEMES.WHITE)}
              />
            </div>
            <div className="logout" onClick={logoutUser}>
              <FiLogOut /> Logout
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default FriendSectionHeader;
