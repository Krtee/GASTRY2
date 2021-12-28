import { ChangeEvent } from "react";

export interface SearchbarProps {
  value: string;
  placeholder: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
