import { FC } from "react";
import { InputComponentProps } from "./InputComponent.types";
import "./InputComponent.styles.scss";

const InputComponent: FC<InputComponentProps> = ({
  placeholder,
  onChange,
  type = "text",
}) => {
  return (
    <input className="input" placeholder={placeholder} onChange={onChange} type={type} />
  );
};

export default InputComponent;
