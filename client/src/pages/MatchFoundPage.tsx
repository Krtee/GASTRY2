import { FC, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useHistory, useParams } from "react-router";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ReactComponent as ArrowLeftIcon } from "../assets/icons/arrow_left.svg";
import { ReactComponent as DoneIcon } from "../assets/icons/done.svg";
import { ReactComponent as Add2 } from "../assets/icons/add_2.svg";
import { ReactComponent as ShareIcon } from "../assets/icons/share.svg";
import { ReactComponent as StarIcon } from "../assets/icons/star.svg";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import IconButtonComponent from "../components/IconButtonComponent/IconButtonComponent";
import Layout from "../components/LayoutComponent/Layout";
import MatchFoundCardContent from "../components/MatchFoundCardContent/MatchFoundCardContent";
import RestaurantInfoComponent from "../components/RestaurantInfoComponent/RestaurantInfoComponent";
import { useAxios } from "../utils/AxiosUtil";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { currentMatchState } from "../utils/match/Match.state";
import {
  GoogleMapsResponseRestaurant,
  Match,
  MatchRestaurantWrapper,
} from "../utils/match/Match.types";
import {
  createEmptyMatch,
  fetchMatchForId,
  getRestaurantInfo,
  postNewMatch,
} from "../utils/match/Match.Utils";
import { randomMealsState } from "../utils/meal/Meal.state";
import { Meal } from "../utils/meal/Meal.types";
import { fetchRandomMeals } from "../utils/meal/Meal.utils";
import { userState } from "../utils/user/User.state";
import "./../styles/MatchFoundPageStyles.scss";

interface MatchFoundPageProps {}

const MatchFoundPage: FC<MatchFoundPageProps> = () => {
  const [matchInState, setMatchInState] = useRecoilState(currentMatchState);
  const navProps = useNavigation(Page.MATCH_FOUND, Page.MATCHING);
  const { t } = useTranslation();
  const [restaurantToShow, setRestaurantToShow] =
    useState<GoogleMapsResponseRestaurant>();
  const { axios } = useAxios();
  const [matchToShow, setmatchToShow] = useState<Match | undefined>(
    matchInState
  );
  const params = useParams<{ id?: string }>();
  const history = useHistory();
  const setMealsToSwipe = useSetRecoilState<Meal[]>(randomMealsState);
  const { user } = useRecoilValue(userState);

  /**
   * fetchs meal, if no currentmatch or currentmatch id is different that id in params
   * @author Minh
   */
  useEffect(() => {
    if (
      !!axios &&
      params.id &&
      (!matchToShow || !matchInState || matchInState.id !== params.id)
    ) {
      fetchMatchForId(axios, params.id).then(setmatchToShow);
    }
    // eslint-disable-next-line
  }, [axios, params.id]);

  /**
   * handles click on restaurant
   * @param restaurant restaurant, that was clicked
   * @author Minh
   */
  const handleRestaurantClick = async (
    restaurant: GoogleMapsResponseRestaurant
  ): Promise<void> => {
    if (!axios) return;
    const fetchedRestaurant: GoogleMapsResponseRestaurant =
      await getRestaurantInfo(axios, restaurant.place_id!);
    if (fetchedRestaurant && matchInState?.id === params.id) {
      setMatchInState((outdatedMatch) => ({
        ...outdatedMatch!,
        matchedRestaurants: outdatedMatch!.matchedRestaurants.map(
          (restaurantToUpdate) => {
            if (
              restaurantToUpdate.restaurant.place_id ===
              fetchedRestaurant.place_id
            ) {
              return { ...restaurantToUpdate, restaurant: fetchedRestaurant };
            }
            return restaurantToUpdate;
          }
        ),
      }));
    }
    setRestaurantToShow(fetchedRestaurant);
  };

  /**
   * resets meals and currentmatch
   * @author Minh
   */
  const handleRematch = (): void => {
    fetchRandomMeals(
      axios,
      parseInt(process.env.REACT_APP_DEFAULT_MEAL_COUNT || "15")
    ).then(setMealsToSwipe);
    postNewMatch(axios, createEmptyMatch(user?.id)).then((res) => {
      if (res) {
        setMatchInState(res);
        history.push("/matching");
      }
    });
  };

  return (
    <Layout
      {...navProps}
      header={
        restaurantToShow
          ? {
              leftIconButton: {
                value: <ArrowLeftIcon />,
                onClick: () => setRestaurantToShow(undefined),
              },
              title: restaurantToShow.name || "",
              rightIconButton: {
                value: <StarIcon />,
                onClick: () => {
                  /**TODO implement favorite feature */
                },
              },
            }
          : t("general.pages.matchfound.title")
      }
      className="match-found-page"
    >
      {restaurantToShow ? (
        <RestaurantInfoComponent restaurantToShow={restaurantToShow} />
      ) : (
        matchToShow && (
          <MatchFoundCardContent
            restaurants={matchToShow!.matchedRestaurants.map(
              (restaurantWrapper) => {
                return Object.keys(restaurantWrapper).reduce((newObj, key) => {
                  const value = (restaurantWrapper as any)[key];
                  if (value !== null) {
                    (newObj as any)[key] = value;
                  }
                  return newObj;
                }, {}) as MatchRestaurantWrapper;
              }
            )}
            onClick={handleRestaurantClick}
          />
        )
      )}
      <div className={"center-content"}></div>
      <div className={"bottom-buttons"}>
        {restaurantToShow && (
          <IconButtonComponent value={<ShareIcon />} color="primary" />
        )}
        <ButtonComponent
          value={t("match.button.rematch")}
          className="rematch-button"
          onClick={() => handleRematch()}
        />
        <IconButtonComponent value={<Add2 />} color="primary" />
        {restaurantToShow && (
          <IconButtonComponent value={<DoneIcon />} color="primary" />
        )}
      </div>
    </Layout>
  );
};

export default MatchFoundPage;
