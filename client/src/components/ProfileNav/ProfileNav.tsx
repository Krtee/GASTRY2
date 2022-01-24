import { useRouteMatch } from "react-router";
import NavLink from "./NavLink/NavLink";
import "./ProfileNavStyles.scss";
import camera from "../../assets/icons/camera.svg";
import star from "../../assets/icons/star.svg";
import settings from "../../assets/icons/settings.svg";
import { FC } from "react";
import { ProfileNavProps } from "./ProfileNav.types";

const ProfileNav: FC<ProfileNavProps> = ({ ownsProfile }) => {
  let { url } = useRouteMatch();

  return (
    <div className="profile-nav">
      <NavLink label={""} to={`${url}`} icon={camera} />
      <NavLink label={""} to={`${url}/favorites`} icon={star} />
      {ownsProfile && (
        <NavLink label={""} to={`${url}/settings`} icon={settings} />
      )}
    </div>
  );
};

export default ProfileNav;
