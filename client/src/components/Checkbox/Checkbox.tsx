import { CheckboxProps } from "./Checkbox.types";
import "./Checkbox.styles.scss";

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label className="checkbox-label">
      <input className="checkbox-input" type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

export default Checkbox;
