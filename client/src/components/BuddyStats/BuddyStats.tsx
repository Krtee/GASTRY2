import { FC } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useRouteMatch } from "react-router";
import { BuddyStatsProps } from "./BuddyStats.types";
import "./BuddyStats.styles.scss";

const BuddyStats: FC<BuddyStatsProps> = ({
  visitedRestaurants,
  posts,
  subscribedRestaurants,
  buddies,
}) => {
  const { t } = useTranslation();
  let { url } = useRouteMatch();

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
      <Link to={`${url}`} className="user-stats-box">
        <p className="user-stats-number">{subscribedRestaurants}</p>
        <p>{t("general.pages.profile.subscribedRestaurants")}</p>
      </Link>
      <Link to={`${url}`} className="user-stats-box">
        <p className="user-stats-number">{buddies}</p>
        <p>{t("general.pages.profile.friends")}</p>
      </Link>
    </div>
  );
};

export default BuddyStats;
