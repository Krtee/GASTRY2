import { FC } from "react";
import { InputComponentProps } from "./InputComponent.types";
import "./InputComponent.styles.scss";

const InputComponent: FC<InputComponentProps> = ({
  id,
  placeholder,
  onChange,
  value,
  type = "text",
  onBlur,
  label,
  required,
  errorLabel,
  ref,
}) => {
  return (
    <div className="input-component">
      {label && (
        <div className="input-component--label">
          <p>{label}</p>
        </div>
      )}
      <div className="input">
        {errorLabel && (
          <div className="input-component--error-label">
            <p>{errorLabel}</p>
          </div>
        )}
        <input
          ref={ref}
          type={type}
          placeholder={placeholder}
          onChange={(evt) => {
            evt.preventDefault();
            onChange(evt.target.value);
          }}
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
    </div>
  );
};

export default InputComponent;
