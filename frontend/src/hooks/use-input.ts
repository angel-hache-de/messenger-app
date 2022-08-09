import React, { useState } from "react";

export interface IUseInputReturn {
  value: string;
  isValid: boolean;
  hasError: boolean;
  valueChangeHandler: (ev: React.ChangeEvent<HTMLInputElement>) => void;
  inputBlurHandler: (ev: React.FocusEvent<HTMLInputElement>) => void;
  reset: () => void;
}

export type ValidateValueFunc = (value: string) => boolean;

const useInput = (validateValue: ValidateValueFunc) => {
  const [enteredValue, setEnteredValue] = useState("");
  const [isTouched, setIsTouched] = useState(false);

  const valueIsValid = validateValue(enteredValue);
  const hasError = !valueIsValid && isTouched;

  const valueChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEnteredValue(event.target.value);
  };

  const inputBlurHandler = (event: React.FocusEvent<HTMLInputElement>) => {
    setIsTouched(true);
  };

  const reset = () => {
    setEnteredValue("");
    setIsTouched(false);
  };

  const returnObj: IUseInputReturn = {
    value: enteredValue,
    isValid: valueIsValid,
    hasError,
    valueChangeHandler,
    inputBlurHandler,
    reset,
  };

  return returnObj;
};

export default useInput;
