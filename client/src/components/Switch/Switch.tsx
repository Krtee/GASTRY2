import { SwitchProps } from "./Switch.types";
import "./Switch.styles.scss";

const Switch = ({ label, checked, onChange }: SwitchProps) => {
  return (
    <label className="form-switch">
      <input type="Switch" checked={checked} onChange={onChange} />
      <i></i>
      {label}
    </label>
  );
};

export default Switch;
