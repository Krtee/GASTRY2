import { SwitchProps } from "./Switch.types";
import "./Switch.styles.scss";

const Switch: React.FC<SwitchProps> = ({ label, checked, onChange }) => {
  return (
    <label className="form-switch">
      <input type="checkbox" checked={checked} onChange={onChange} />
      <i></i>
      {label}
    </label>
  );
};

export default Switch;
