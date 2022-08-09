import { Dispatch } from "redux";
import {
  IStatusAction,
  STATUS_ACTION_TYPE,
  THEMES,
} from "../types/statusTypes";

/**
 * Gets the theme from the localStorage
 * Used when the app loads
 * @returns
 */
export const getTheme = () => async (dispatch: Dispatch) => {
  try {
    const theme = localStorage.getItem("theme");

    dispatch({
      type: STATUS_ACTION_TYPE.SET_THEME,
      payload: {
        theme: theme || THEMES.DARK,
      },
    } as IStatusAction);
  } catch (error) {}
};

/**
 * Saves the theme on localStorage
 * Invoked everytime that the user changes the theme
 * @returns
 */
export const setTheme = (theme: THEMES) => async (dispatch: Dispatch) => {
  try {
    localStorage.setItem("theme", theme);

    dispatch({
      type: STATUS_ACTION_TYPE.SET_THEME,
      payload: {
        theme,
      },
    } as IStatusAction);
  } catch (error) {}
};
