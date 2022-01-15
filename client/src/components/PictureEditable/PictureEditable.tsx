import { PictureEditableProps } from "./PictureEditable.types";
import "./PictureEditableStyles.scss";

const PictureEditable = ({ photo, onUpload, styles }: PictureEditableProps) => {
  return (
    <div className="pic-wrapper" style={styles}>
      <img className="user-picture" src={photo} alt="" />
    </div>
  );
};

export default PictureEditable;
