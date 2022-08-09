import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

import authReducer from "./reducers/authReducer";
import { IStoreState } from "./types";
import { messengerReducer } from "./reducers/messengerReducer";
import { imagesReducer } from "./reducers/imagesReducer";
import { statusReducer } from "./reducers/statusReducer";
import { friendsReducer } from "./reducers/friendsReducer";

const initialState = {};

const rootReducer = combineReducers({
  auth: authReducer,
  messenger: messengerReducer,
  images: imagesReducer,
  status: statusReducer,
  friends: friendsReducer,
});

const middlewares = [thunkMiddleware];
const middlewareEnhancer = applyMiddleware(...middlewares);
const enhancers = [middlewareEnhancer];

const store = createStore(
  rootReducer,
  initialState as IStoreState,
  composeWithDevTools(...enhancers)
);

export default store;
