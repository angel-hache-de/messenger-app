import { applyMiddleware, combineReducers, createStore } from "redux";
import thunkMiddleware from "redux-thunk";

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
const devEnhancers = [middlewareEnhancer];

let enhancer;

if (process.env.NODE_ENV === "development") {
  console.log("DENTRO DEL DEV");
  const { composeWithDevTools } = require("redux-devtools-extension");
  enhancer = composeWithDevTools(...devEnhancers);
} else {
  console.log("FUERA DEL DEV");
  enhancer = middlewareEnhancer;
}

const store = createStore(rootReducer, initialState as IStoreState, enhancer);

export default store;
