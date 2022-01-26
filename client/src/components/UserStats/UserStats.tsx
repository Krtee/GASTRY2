import { FC } from "react";
import { useTranslation } from "react-i18next";
import "./UserStatsStyles.scss";
import { UserStatsComponentProps } from "./UserStats.types";
import { Link } from "react-router-dom";

const UserStats: FC<UserStatsComponentProps> = ({
  visitedRestaurants,
  posts,
  subscribedRestaurants,
  buddies,
}) => {
  const { t } = useTranslation();
  return (
    <div className="user-stats">
      <div className="user-stats-box">
        <p className="user-stats-number">{visitedRestaurants}</p>
        <p>{t("general.pages.profile.visitedRestaurants")}</p>
      </div>
      <div className="user-stats-box">
        <p className="user-stats-number">{posts}</p>
        <p>{t("general.pages.profile.posts")}</p>
      </div>
      {/* TODO: add the right path when this feature is ready */}
      <Link to={`/profile`} className="user-stats-box">
        <p className="user-stats-number">{subscribedRestaurants}</p>
        <p>{t("general.pages.profile.subscribedRestaurants")}</p>
      </Link>
      <Link to={`/buddies`} className="user-stats-box">
        <p className="user-stats-number">{buddies}</p>
        <p>{t("general.pages.profile.friends")}</p>
      </Link>
    </div>
  );
};

export default UserStats;
