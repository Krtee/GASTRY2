import { useTranslation } from "react-i18next";
import PictureEditable from "../PictureEditable/PictureEditable";
import { UserInfoComponentProps } from "./UserInfo.types";
import "./UserInfoStyles.scss";

const UserInfo = ({
  photo,
  name,
  username,
  fav_restaurant,
}: UserInfoComponentProps) => {
  const { t } = useTranslation();

  const onUpload = () => {};

  return (
    <div className="user-info">
      <PictureEditable photo={photo} onUpload={onUpload} />
      <div className="user-info-wrapper">
        <h3 className="user-info-name">{name}</h3>
        <p className="">{username}</p>
        <p className="">
          {t("general.pages.profile.favRestaurant")}: {fav_restaurant}
        </p>
      </div>
    </div>
  );
};

export default UserInfo;
