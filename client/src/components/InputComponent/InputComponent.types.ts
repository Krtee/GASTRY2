import React from "react";

export interface InputComponentProps {
  id?: string;
  label?: string;
  placeholder?: string;
  value: string;
  onChange(value: string): void;
  required?: boolean;
  onBlur?(value: string): void;
  errorLabel?: string;
  type?: "text" | "password" | "number" | "email";
  ref?: React.RefObject<HTMLInputElement>;
}
