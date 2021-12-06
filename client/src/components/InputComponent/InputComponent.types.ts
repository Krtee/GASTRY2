export interface InputComponentProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange(value: string): void;
  required?: boolean;
  onBlur?(value: string): void;
  error?: string;
  type?: "text" | "password" | "number";
}
