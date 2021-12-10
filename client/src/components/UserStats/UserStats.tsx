import { FC } from "react";
import { useTranslation } from "react-i18next";
import "./UserStatsStyles.scss";

import { UserStatsComponentProps } from "./UserStats.types";

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
        <p className="user-stats-label">
          {t("general.pages.profile.visitedRestaurants")}
        </p>
      </div>
      <div className="user-stats-box">
        <p className="user-stats-number">{posts}</p>
        <p className="user-stats-label">{t("general.pages.profile.posts")}</p>
      </div>
      <div className="user-stats-box">
        <p className="user-stats-number">{followings}</p>
        <p className="user-stats-label">
          {t("general.pages.profile.followers")}
        </p>
      </div>
      <div className="user-stats-box">
        <p className="user-stats-number">{followers}</p>
        <p className="user-stats-label">
          {t("general.pages.profile.followings")}
        </p>
      </div>
    </div>
  );
};

export default UserStats;
