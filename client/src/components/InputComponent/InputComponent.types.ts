export interface InputComponentProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange(value: string): void;
  required?: boolean;
  type?: "text" | "password" | "number"
}
