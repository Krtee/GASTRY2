import { FC } from "react";
import { InputComponentProps } from "./InputComponent.types";
import "./InputComponent.styles.scss";

const InputComponent: FC<InputComponentProps> = ({
  placeholder,
  onChange,
  value,
  type = "text",
  required
}) => {
  return (
    <input className="input" placeholder={placeholder} onChange={(evt) => {
      evt.preventDefault();
      onChange(evt.target.value);
    }} type={type} value={value}  required={required}/>
  );
};

export default InputComponent;
