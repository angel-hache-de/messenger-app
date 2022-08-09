import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAlert } from "react-alert";

import useInput from "../../hooks/use-input";
// import useMounted from "../../hooks/use-mounted";
import {
  validateEmail,
  validatePassword,
  validateUsername,
} from "../../utils/validations";

import { userRegister } from "../../store/actions/authActions";
import { IStoreState } from "../../store/types";
import { AUTH_ACTION_TYPE } from "../../store/types/authTypes";
import useMounted from "../../hooks/use-mounted";
import CustomButton from "../../components/custom-button";

import "./sign-up.scss";

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const alert = useAlert();
  const { successMessage, error, authenticated } = useSelector(
    (state: IStoreState) => state.auth
  );
  const [isLoading, setIsLoading] = useState(false);
  const isMounted = useMounted();

  // const isMounted = useMounted();
  const [enteredImage, setEnteredImage] = useState<File | null>(null);
  const [loadImage, setLoadImage] = useState<string | null>(null);

  // FORM INPUTS
  const {
    value: enteredUsername,
    hasError: usernameInputHasError,
    isValid: isValidUsername,
    valueChangeHandler: usernameChangedHandler,
    inputBlurHandler: usernameBlurHandler,
    // reset: resetUsernameInput,
  } = useInput(validateUsername);

  const {
    value: enteredEmail,
    hasError: emailInputHasError,
    isValid: isValidEmail,
    valueChangeHandler: emailChangedHandler,
    inputBlurHandler: emailBlurHandler,
    // reset: resetEmailInput,
  } = useInput(validateEmail);

  const {
    value: enteredPassword,
    hasError: passwordInputHasError,
    isValid: isValidPassword,
    valueChangeHandler: passwordChangedHandler,
    inputBlurHandler: passwordBlurHandler,
    // reset: resetPasswordInput,
  } = useInput(validatePassword);

  const {
    value: enteredPasswordConf,
    hasError: passwordConfInputHasError,
    isValid: isValidPasswordConf,
    valueChangeHandler: passwordConfChangedHandler,
    inputBlurHandler: passwordConfBlurHandler,
    // reset: resetPasswordConfInput,
  } = useInput((value: string) => value === enteredPassword);

  /**
   * Handles the auth state
   */
  useEffect(() => {
    if (authenticated) navigate("/");
  }, [authenticated, navigate]);

  /**
   * Handles the alerts
   */
  useEffect(() => {
    if (!!successMessage) {
      alert.success(successMessage);
      dispatch({ type: AUTH_ACTION_TYPE.SUCESSS_MESSAGE_CLEAR });
    }

    if (!!error) {
      alert.error(error);
      dispatch({ type: AUTH_ACTION_TYPE.ERROR_CLEAR });
    }
  }, [alert, successMessage, error, dispatch]);

  const fileHandle = (ev: React.ChangeEvent<HTMLInputElement>) => {
    if (ev.target.files !== null && ev.target.files.length !== 0) {
      setEnteredImage(ev.target.files[0]);

      const reader = new FileReader();

      reader.onload = () => {
        setLoadImage(reader.result as string | null);
      };
      reader.readAsDataURL(ev.target.files[0]);
    }
  };

  // Handles the form submition
  const handleSubmit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (
      !isValidEmail ||
      !isValidPassword ||
      !isValidUsername ||
      !isValidPasswordConf
    )
      return;

    if (!enteredImage) return alert.error("You must upload an image!");

    try {
      setIsLoading(true);
      const formData = new FormData();

      formData.append("userName", enteredUsername);
      formData.append("email", enteredEmail);
      formData.append("password", enteredPassword);
      formData.append("passwordConf", enteredPasswordConf);
      formData.append("file", enteredImage as string | Blob);

      dispatch(userRegister(formData));
    } catch (error) {
      // Error is catched in action
    } finally {
      !!isMounted.current && setIsLoading(false);
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="card-header">
          <h3>Register</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                className="form-control"
                placeholder="Username"
                id="form-control-username"
                onChange={usernameChangedHandler}
                onBlur={usernameBlurHandler}
                value={enteredUsername}
              />
              {usernameInputHasError && (
                <span className="invalid-field">Enter a valid username</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                id="form-control-email"
                onChange={emailChangedHandler}
                onBlur={emailBlurHandler}
                value={enteredEmail}
              />
              {emailInputHasError && (
                <span className="invalid-field">Enter a valid email</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                id="form-control-password"
                onChange={passwordChangedHandler}
                onBlur={passwordBlurHandler}
                value={enteredPassword}
              />
              {passwordInputHasError && (
                <span className="invalid-field">Min password length is 6</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="passwordConf">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                placeholder="Confirm Password"
                id="form-control-passwordConf"
                onChange={passwordConfChangedHandler}
                onBlur={passwordConfBlurHandler}
                value={enteredPasswordConf}
              />
              {passwordConfInputHasError && (
                <span className="invalid-field">Passwords must be equal</span>
              )}
            </div>
            <div className="form-group">
              <div className="file-image">
                <div className="image">
                  {loadImage && (
                    <img src={loadImage} alt="You will look like this!" />
                  )}
                </div>
                <div className="file">
                  <label htmlFor="form-control-image">Select Image</label>
                  <input
                    type="file"
                    className="form-control"
                    id="form-control-image"
                    onChange={fileHandle}
                  />
                </div>
              </div>
            </div>
            <div className="form-group">
              <CustomButton isLoading={isLoading} type="submit">
                Register
              </CustomButton>
            </div>
            <div className="form-group">
              <span>
                <Link to={"../login"}>I already have an account</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
