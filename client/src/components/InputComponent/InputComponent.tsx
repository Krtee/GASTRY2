import { FC } from "react";
import { InputComponentProps } from "./InputComponent.types";
import "./InputComponent.styles.scss";

const InputComponent: FC<InputComponentProps> = ({
  placeholder,
  onChange,
  value,
  type = "text",
  required,
  onBlur,
  label,
  error,
}) => {
  return (
    <div className="input-component">
      {label && (
        <div className="input-component--label">
          <p>
            {label}
            {error && <span>{error}</span>}
          </p>
        </div>
      )}
      <input
        className="input"
        placeholder={placeholder}
        onChange={(evt) => {
          evt.preventDefault();
          onChange(evt.target.value);
        }}
        type={type}
        value={value}
        required={required}
        onBlur={
          onBlur
            ? (evt) => {
                evt.preventDefault();
                onBlur(evt.target.value);
              }
            : () => {}
        }
      />
    </div>
  );
};

export default InputComponent;
