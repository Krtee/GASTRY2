import { CSSProperties } from "react";

export interface PictureEditableProps {
  photo: string;
  onUpload?: () => void;
  styles?: CSSProperties;
}
