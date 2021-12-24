import { useTranslation } from "react-i18next";
import { Redirect, useHistory, useRouteMatch } from "react-router";
import NavLink from "./NavLink/NavLink";
import { ProfileNavProps } from "./ProfileNav.types";
import "./ProfileNavStyles.scss";
import camera from "../../assets/icons/camera.svg";
import star from "../../assets/icons/star.svg";

export const nav_elements: string[] = [
  "posts",
  "settings",
  "favorites",
  "mail",
];

const ProfileNav = ({ selectedPage, setSelectedPage }: ProfileNavProps) => {
  const { t } = useTranslation();
  let { url } = useRouteMatch();

  return (
    <div className="profile-nav">
      <NavLink label={t("posts")} to={`${url}`} icon={camera} />
      <NavLink
        label={t("favorites")}
        to={`${url}/${"favorites"}`}
        icon={star}
      />
    </div>
  );
};

export default ProfileNav;
