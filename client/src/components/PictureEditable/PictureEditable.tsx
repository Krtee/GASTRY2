import { useTranslation } from "react-i18next";
import { PictureEditableProps } from "./PictureEditable.types";
import "./PictureEditableStyles.scss";

const PictureEditable = ({ photo, onUpload }: PictureEditableProps) => {
  const { t } = useTranslation();

  return (
    <div className="pic-wrapper">
      <img className="user-picture" src={photo} alt="" />
    </div>
  );
};

export default PictureEditable;
