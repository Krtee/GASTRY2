import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PictureEditable from "../PictureEditable/PictureEditable";
import { UserInfoComponentProps } from "./UserInfo.types";
import "./UserInfoStyles.scss";

const UserInfo: React.FC<UserInfoComponentProps> = ({
  firstName,
  lastName,
  username,
  setIsEditing,
}) => {
  const { t } = useTranslation();
  const onUpload = () => {};

  return (
    <div className="user-info">
      <div className="user-info-header">
        {/* <div className="user-info-header-background"></div> */}
        <button
          className="user-info-interactions-element user-info-edit-btn"
          onClick={() => setIsEditing(true)}
        >
          <span className="user-info-edit-btn-icon user-info-interactions-element-icon"></span>
          {t("general.pages.profile.editProfile")}
        </button>
        <PictureEditable
          styles={{ background: "black" }}
          photo={""}
          onUpload={onUpload}
        />
        <Link
          className="user-info-interactions-element user-info-search-btn"
          to="/search"
        >
          <span className="user-info-search-btn-icon user-info-interactions-element-icon"></span>
          {t("general.pages.profile.searchFriends")}
        </Link>
      </div>
      <div className="user-info-wrapper">
        <p className="user-info-username">@fadeleus</p>
        <p>0711/Lieblingsrestaurant: Büffel & Koi</p>
      </div>
    </div>
  );
};

export default UserInfo;
