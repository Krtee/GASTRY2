import React, { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  GoogleMapsResponseRestaurant,
  MatchRestaurantWrapper,
} from "../../utils/match/Match.types";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import CardComponent from "../CardComponent/CardComponent";
import { ReactComponent as ArrowRightIcon } from "./../../assets/icons/arrow_right.svg";
import "./MatchFoundCardContentStyles.scss";
interface MatchFoundCardContentProps {
  restaurants: MatchRestaurantWrapper[];
  onClick(restaurant: GoogleMapsResponseRestaurant): void;
}

const MatchFoundCardContent: FC<MatchFoundCardContentProps> = ({
  restaurants,
  onClick,
}) => {
  const { t } = useTranslation();
  const [showMore, setShowMore] = useState(false);

  return (
    <CardComponent className={"result-card result-list__wrapper"}>
      {restaurants
        .sort(({ index: a }, { index: b }) => a - b)
        .filter((restaurantWrapper) => showMore || restaurantWrapper.index < 3)
        .map((restaurantWrapper: MatchRestaurantWrapper) => (
          <div className={"result-item"} key={restaurantWrapper.index}>
            <div
              className={`result-index ${
                restaurantWrapper.index === 0 ? "first" : ""
              }`}
            >
              {restaurantWrapper.index + 1}.
            </div>
            <ButtonComponent
              value={
                <div className={"button-content"}>
                  <p>{restaurantWrapper.restaurant.name || ""}</p>
                  <ArrowRightIcon />
                </div>
              }
              onClick={() => onClick(restaurantWrapper.restaurant)}
              color={restaurantWrapper.index !== 0 ? "transparent" : undefined}
              size={restaurantWrapper.index === 0 ? "big" : undefined}
            />
          </div>
        ))}

      <p className="show-more" onClick={() => setShowMore(!showMore)}>
        {showMore
          ? t("general.buttons.showless")
          : t("general.buttons.showmore")}
      </p>
    </CardComponent>
  );
};

export default MatchFoundCardContent;
