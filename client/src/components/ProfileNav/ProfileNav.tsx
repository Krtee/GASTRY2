import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router";
import NavLink from "./NavLink/NavLink";
import "./ProfileNavStyles.scss";
import camera from "../../assets/icons/camera.svg";
import star from "../../assets/icons/star.svg";
import allergies from "../../assets/icons/allergies.svg";

export const nav_elements: string[] = [
  "posts",
  "settings",
  "favorites",
  "mail",
];

const ProfileNav = () => {
  const { t } = useTranslation();
  let { url } = useRouteMatch();

  return (
    <div className="profile-nav">
      <NavLink label={t("posts")} to={`${url}`} icon={camera} />
      <NavLink
        label={t("settings")}
        to={`${url}/${"settings"}`}
        icon={allergies}
      />
      <NavLink
        label={t("favorites")}
        to={`${url}/${"favorites"}`}
        icon={star}
      />
    </div>
  );
};

export default ProfileNav;
