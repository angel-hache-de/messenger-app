import {
  IStatusAction,
  IStatusState,
  STATUS_ACTION_TYPE,
  THEMES,
} from "../types/statusTypes";

const statusState: IStatusState = {
  error: "",
  success: "",
  theme: THEMES.DARK,
};

export const statusReducer = (state = statusState, action: IStatusAction) => {
  const { type, payload } = action;

  switch (type) {
    case STATUS_ACTION_TYPE.SET_ERROR:
      return {
        ...state,
        error: payload.error,
      } as IStatusState;
    case STATUS_ACTION_TYPE.SET_SUCCESS:
      return {
        ...state,
        success: payload.success,
      } as IStatusState;
    case STATUS_ACTION_TYPE.CLEAR_ERROR:
      return {
        ...state,
        error: "",
      } as IStatusState;
    case STATUS_ACTION_TYPE.CLEAR_SUCCESS:
      return {
        ...state,
        success: "",
      } as IStatusState;
    case STATUS_ACTION_TYPE.SET_THEME:
      return {
        ...state,
        theme: payload.theme,
      } as IStatusState;
    default:
      return state;
  }
};
