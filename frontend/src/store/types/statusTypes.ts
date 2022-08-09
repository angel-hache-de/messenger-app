export enum STATUS_ACTION_TYPE {
  // IMAGES
  SET_ERROR = "SET_ERROR",
  CLEAR_ERROR = "CLEAR_ERROR",
  SET_SUCCESS = "SET_SUCCESS",
  CLEAR_SUCCESS = "CLEAR_SUCCESS",
  SET_THEME = "SET_THEME",
}

export enum THEMES {
  DARK = "dark",
  WHITE = "white",
}

export interface IStatusState {
  error: string;
  success: string;
  theme: THEMES;
}

export interface IStatusPayload {
  error?: string;
  success?: string;
  theme?: THEMES;
}

export type StatusDispatchType = (args: IStatusAction) => IStatusState;

export interface IStatusAction {
  type: STATUS_ACTION_TYPE;
  payload: IStatusPayload;
}

// Error that returns the api when there is
// an invalid field
export interface IMessengerError {
  error: {
    message: string;
  };
}

// Error that returns the api when there is
// an invalid field
export interface IError {
  error: {
    message: string;
  };
}
