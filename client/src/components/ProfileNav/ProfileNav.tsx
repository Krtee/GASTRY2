import { useRouteMatch } from "react-router";
import NavLink from "./NavLink/NavLink";
import "./ProfileNavStyles.scss";
import camera from "../../assets/icons/camera.svg";
import star from "../../assets/icons/star.svg";
import settings from "../../assets/icons/settings.svg";

export const nav_elements: string[] = [
  "posts",
  "settings",
  "favorites",
  "mail",
];

const ProfileNav = () => {
  let { url } = useRouteMatch();

  return (
    <div className="profile-nav">
      <NavLink label={""} to={`${url}`} icon={camera} />
      <NavLink label={""} to={`${url}/${"favorites"}`} icon={star} />
      <NavLink label={""} to={`${url}/${"settings"}`} icon={settings} />
    </div>
  );
};

export default ProfileNav;
