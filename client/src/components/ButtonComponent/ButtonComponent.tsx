import { ButtonComponentProps } from "./ButtonComponent.types";

import "./ButtonComponent.style.scss";
const ButtonComponent: React.FC<ButtonComponentProps> = ({
  className,
  disabled,
  type = "button",
  value,
  onClick,
  form,
  color,
  textColor,
  gradient,
}) => (
  <div
    data-testid="ButtonComponent"
    className={className ? `button-component ${className}` : "button-component"}
  >
    <button
      className={gradient ? "gradient" : ""}
      disabled={disabled}
      type={type}
      onClick={onClick}
      form={form}
      style={{ backgroundColor: color, borderColor: color, color: textColor }}
    >
      {value}
    </button>
  </div>
);

export default ButtonComponent;
