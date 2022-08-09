import React from "react";

import "./custom-button.style.scss";

interface ICustomButtonProps {
  children: JSX.Element | string;
  type: "submit" | "reset" | "button";
  isLoading?: boolean;
  onClick?: (ev: React.MouseEvent<HTMLButtonElement>) => void;
}

const CustomButton = ({
  isLoading,
  children,
  ...props
}: ICustomButtonProps) => {
  return (
    <button className="btn" {...props}>
      {isLoading && <div className="loader" data-testid="loader" />}
      {!isLoading && children}
    </button>
  );
};

export default CustomButton;
