import "./ButtonComponent.style.scss";
import { ButtonComponentProps } from "./ButtonComponent.types";

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
  size = "default",
}) => (
  <div
    data-testid="ButtonComponent"
    className={className ? `button-component ${className}` : "button-component"}
  >
    <button
      className={`
        ${gradient ? "gradient " : " "} ${size} ${
        color === "transparent" ? "border-white" : ""
      }`}
      disabled={disabled}
      type={type}
      onClick={onClick}
      form={form}
      style={{ backgroundColor: color, color: textColor }}
    >
      {value}
    </button>
  </div>
);

export default ButtonComponent;
