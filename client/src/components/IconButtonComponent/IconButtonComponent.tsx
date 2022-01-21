import "./IconButtonComponent.style.scss";
import { IconButtonComponentProps } from "./IconButtonComponent.types";

const IconButtonComponent: React.FC<IconButtonComponentProps> = ({
  className,
  disabled,
  type = "button",
  value,
  onClick,
  form,
  color,
  filled = false,
  size = "default",
}) => (
  <div
    data-testid="ButtonComponent"
    className={
      className ? `icon-button-component ${className}` : "icon-button-component"
    }
  >
    <button
      className={`
          ${filled ? "filled" : ""} ${size}`}
      disabled={disabled}
      type={type}
      onClick={onClick}
      form={form}
      style={{
        borderColor: color === "primary" ? "#F2594B" : color,
        color: color === "primary" ? "#F2594B" : color,
        fill: color === "primary" ? "#F2594B" : color,
      }}
    >
      {value}
    </button>
  </div>
);

export default IconButtonComponent;
