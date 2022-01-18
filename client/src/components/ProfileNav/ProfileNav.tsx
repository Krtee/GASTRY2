import { useTranslation } from "react-i18next";
import { useRouteMatch } from "react-router";
import NavLink from "./NavLink/NavLink";
import { ProfileNavProps } from "./ProfileNav.types";
import "./ProfileNavStyles.scss";
import camera from "../../assets/icons/camera.svg";
import mail from "../../assets/icons/mail.svg";
import star from "../../assets/icons/star.svg";
import stop from "../../assets/icons/stop.svg";

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
      <NavLink label={t("posts")} to={`${url}/${"posts"}`} icon={camera} />
      <NavLink label={t("settings")} to={`${url}/${"settings"}`} icon={stop} />
      <NavLink
        label={t("favorites")}
        to={`${url}/${"favorites"}`}
        icon={star}
      />
      <NavLink label={t("mail")} to={`${url}/${"mail"}`} icon={mail} />
    </div>
  );
};

export default ProfileNav;
