import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import useInput from "../../hooks/use-input";
import useMounted from "../../hooks/use-mounted";
import { userLogin } from "../../store/actions/authActions";
import { IStoreState } from "../../store/types";
import { AUTH_ACTION_TYPE } from "../../store/types/authTypes";
import { validatePassword, validateEmail } from "../../utils/validations";
import CustomButton from "../../components/custom-button";

import "./sign-in.scss";

const SignIn = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const alert = useAlert();

  const { successMessage, error, authenticated } = useSelector(
    (state: IStoreState) => state.auth
  );

  const [isLoading, setIsLoading] = useState(false);

  const isMounted = useMounted();

  // FORM INPUTS
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

  const handleSubmit = async (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault();

    if (!isValidEmail || !isValidPassword) return;

    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("email", enteredEmail);
      formData.append("password", enteredPassword);
      await dispatch(userLogin(formData));
    } catch (error) {
      // Error are catched in the action
    } finally {
      !!isMounted.current && setIsLoading(false);
    }
  };

  return (
    <div className="login">
      <div className="card">
        <div className="card-header">
          <h3>Login</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                placeholder="email"
                className="form-control"
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
                placeholder="password"
                className="form-control"
                id="form-control-password"
                onChange={passwordChangedHandler}
                onBlur={passwordBlurHandler}
                value={enteredPassword}
              />
              {passwordInputHasError && (
                <span className="invalid-field">Enter a valid password</span>
              )}
            </div>
            <div className="form-group">
              <CustomButton isLoading={isLoading} type="submit">
                Login
              </CustomButton>
            </div>
            <div className="form-group">
              <span>
                <Link to="../register">Create an account</Link>
              </span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
