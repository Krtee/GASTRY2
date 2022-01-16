import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import PictureEditable from "../PictureEditable/PictureEditable";
import "./UserInfoStyles.scss";

const UserInfo: React.FC<{}> = () => {
  const { t } = useTranslation();
  const onUpload = () => {};

  return (
    <div className="user-info">
      <div className="user-info-header">
        <Link
          className="user-info-interactions-element user-info-search-btn"
          to="/edit"
        >
          <span className="user-info-edit-btn-icon user-info-interactions-element-icon"></span>
          {t("general.pages.profile.editProfile")}
        </Link>
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
