import { FC } from "react";
import { useTranslation } from "react-i18next";
import "./UserStatsStyles.scss";
import { UserStatsComponentProps } from "./UserStats.types";
import { Link } from "react-router-dom";

const UserStats: FC<UserStatsComponentProps> = ({
  visitedRestaurants,
  posts,
  followings,
  followers,
}) => {
  const { t } = useTranslation();
  return (
    <div className="user-stats">
      <div className="user-stats-box">
        <p className="user-stats-number">{visitedRestaurants}</p>
        <p>{t("general.pages.profile.restaurants")}</p>
      </div>
      <div className="user-stats-box">
        <p className="user-stats-number">{posts}</p>
        <p>{t("general.pages.profile.posts")}</p>
      </div>
      <Link to={`/followers`} className="user-stats-box">
        <p className="user-stats-number">{followings}</p>
        <p>{t("general.pages.profile.followers")}</p>
      </Link>
      <Link to={`/followings`} className="user-stats-box">
        <p className="user-stats-number">{followers}</p>
        <p>{t("general.pages.profile.followings")}</p>
      </Link>
    </div>
  );
};

export default UserStats;
