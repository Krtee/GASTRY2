import { FC } from "react";
import { ButtonProps } from "./Button.types";
import "./ButtonStyles.scss";

const Button: FC<ButtonProps> = ({ label, onClick }) => {
  return (
    <button className="button" onClick={onClick}>
      {label}
    </button>
  );
};

export default Button;
