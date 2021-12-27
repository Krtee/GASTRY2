import { CheckboxProps } from "./Checkbox.types";

const Checkbox = ({ label, checked, onChange }: CheckboxProps) => {
  return (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  );
};

export default Checkbox;
