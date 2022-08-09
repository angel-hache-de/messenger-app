import React from "react";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { positions, transitions, Provider as AlertProvider } from "react-alert";
import alertTemplate from "react-alert-template-basic";

import store from "./store/";
import SignIn from "./pages/sign-in";
import SignUp from "./pages/sign-up";
import Messenger from "./pages/messenger";

import "./App.scss";

const options = {
  timeout: 5000,
  positions: positions.BOTTOM_CENTER,
  transitions: transitions.SCALE,
};

function App() {
  return (
    <Provider store={store}>
      <AlertProvider template={alertTemplate} {...options}>
        <Router>
          <Routes>
            <Route path="/" element={<Messenger />} />
            <Route path="/messenger">
              <Route path="login" element={<SignIn />} />
              <Route path="register" element={<SignUp />} />
            </Route>
          </Routes>
        </Router>
      </AlertProvider>
    </Provider>
  );
}

export default App;
