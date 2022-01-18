import {
  createRef,
  FC,
  RefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import TinderCard from "react-tinder-card";
import { useRecoilState, useRecoilValue } from "recoil";
import { ReactComponent as ArrowIcon } from "../assets/icons/arrow_left.svg";
import { ReactComponent as DislikeIcon } from "../assets/icons/dislike.svg";
import { ReactComponent as EatableHart } from "../assets/icons/eatableHeart.svg";
import { ReactComponent as GroupAddIcon } from "../assets/icons/groupadd.svg";
import { ReactComponent as LikeIcon } from "../assets/icons/like.svg";
import { ReactComponent as ResetIcon } from "../assets/icons/reset.svg";
import { ReactComponent as SettingIcon } from "../assets/icons/settings.svg";
import Layout from "../components/LayoutComponent/Layout";
import ModalComponent from "../components/ModalComponent/ModalComponent";
import "../styles/MatchingPage.styles.scss";
import { useAxios } from "../utils/AxiosUtil";
import useGeoLocation from "../utils/hooks/useGeoLocation";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { currentMatchState } from "../utils/match/Match.state";
import { Match } from "../utils/match/Match.types";
import {
  createEmptyMatch,
  matchRestaurants,
  postNewMatch,
} from "../utils/match/Match.Utils";
import { randomMealsState } from "../utils/meal/Meal.state";
import { Meal } from "../utils/meal/Meal.types";
import { fetchRandomMeals } from "../utils/meal/Meal.utils";
import { userState } from "../utils/user/User.state";

interface MatchingPageProps {}

const MatchingPage: FC<MatchingPageProps> = () => {
  const { currentLocation, onLocationChange } = useNavigation(Page.MATCHING);
  const [currentMatch, setCurrentMatch] =
    useRecoilState<Match>(currentMatchState);
  const { t } = useTranslation();
  const user = useRecoilValue(userState);
  const [mealsToSwipe, setMealsToSwipe] =
    useRecoilState<Meal[]>(randomMealsState);
  const [currentIndex, setCurrentIndex] = useState(mealsToSwipe.length - 1);
  const currentIndexRef = useRef(currentIndex);
  const canGoBack = currentIndex < mealsToSwipe.length - 1;
  const canSwipe = currentIndex >= 0;
  const [disableGoBack, setdisableGoBack] = useState(false);
  const history = useHistory();
  const [showLoadingMatchModal, setShowLoadingMatchModal] =
    useState<boolean>(false);
  const location = useGeoLocation();
  const { axios } = useAxios();
  const childRefs: RefObject<any>[] = useMemo(
    () =>
      Array(mealsToSwipe.length)
        .fill(0)
        .map((i) => createRef()),
    [mealsToSwipe.length]
  );

  /**
   * updates current index, and ref for index
   * @param val index
   * @author Minh
   */
  const updateCurrentIndex = (val: number) => {
    setCurrentIndex(val);
    currentIndexRef.current = val;
  };

  // set last direction and decrease current index
  const swiped = (direction: "left" | "right", meal: Meal, index: number) => {
    switch (direction) {
      case "left":
        setCurrentMatch((lastMatchState) => ({
          ...lastMatchState,
          unMatchedMeals: [...lastMatchState.unMatchedMeals, meal],
        }));
        break;
      case "right":
        setCurrentMatch((lastMatchState) => ({
          ...lastMatchState,
          matchedMeals: [...lastMatchState.matchedMeals, meal],
        }));
        break;
      default:
    }
    setdisableGoBack(false);
    updateCurrentIndex(index - 1);
    if (index === 0) {
      setShowLoadingMatchModal(true);
      matchRestaurants(axios, currentMatch, location).then((resultMatch) => {
        setCurrentMatch(resultMatch);
        setTimeout(() => {
          history.push(`/matching/result/${resultMatch.id}`);
          setShowLoadingMatchModal(false);
        }, 1000);
      });
    }
  };

  /**
   * handles meals, that are out of frame
   * @param idx
   * @author Minh
   */
  const outOfFrame = (idx: number) => {
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && childRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  /**
   * handler if programatically swiped
   * @param dir direction to swipe: either left or right
   * @author Minh
   */
  const swipe = async (dir: "left" | "right") => {
    if (canSwipe && currentIndex < mealsToSwipe.length) {
      await childRefs[currentIndex].current.swipe(dir); // Swipe the card!
    }
  };

  // increase current index and show card
  const goBack = async () => {
    if (!canGoBack) return;
    const newIndex = currentIndex + 1;
    updateCurrentIndex(newIndex);
    setCurrentMatch({
      ...currentMatch,
      unMatchedMeals: currentMatch.unMatchedMeals.filter(
        (_, index) => index !== newIndex
      ),
      matchedMeals: currentMatch.matchedMeals.filter(
        (_, index) => index !== newIndex
      ),
    });
    setdisableGoBack(true);
    await childRefs[newIndex].current.restoreCard();
  };

  /**
   * resets meals and currentmatch
   * @author Minh
   */
  useEffect(() => {
    if (
      currentMatch &&
      currentMatch.matchedRestaurants.length > 0 &&
      !showLoadingMatchModal &&
      axios
    ) {
      fetchRandomMeals(
        axios,
        parseInt(process.env.REACT_APP_DEFAULT_MEAL_COUNT || "15")
      ).then(setMealsToSwipe);
      postNewMatch(axios, createEmptyMatch(user?.id)).then(
        (res) => res && setCurrentMatch(res)
      );
    }
    // eslint-disable-next-line
  }, [currentMatch, axios, user?.id, setCurrentMatch, setMealsToSwipe]);

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
      className="matching-page"
      header={{
        leftIconButton: {
          value: <ArrowIcon />,
          onClick: () => {
            /**TODO where to go ? */
          },
        },
        title: t("general.pages.matching"),
      }}
    >
      <Suspense
        fallback={
          <div>{/** TODO implement loading component */}Loading...</div>
        }
      >
        <div className="swipeable-card-container">
          {mealsToSwipe.map((meal, index) => (
            <TinderCard
              ref={childRefs[index]}
              key={meal.idMeal}
              onSwipe={(dir) => swiped(dir as "left" | "right", meal, index)}
              preventSwipe={["up", "down"]}
              onCardLeftScreen={() => outOfFrame(index)}
              className="container"
            >
              <img src={meal.strMealThumb} alt={meal.strMeal} />
              <div className="progressBar">
                <div
                  className="progressBarStyle"
                  style={{
                    width: (((15 - currentIndex) / 15) * 100).toFixed(0) + "%",
                  }}
                >
                  <span className="progressBarText">
                    {(((15 - currentIndex) / 15) * 100).toFixed(0) + "%"}
                  </span>
                </div>
              </div>
            </TinderCard>
          ))}
        </div>

        <div className="matching-buttons">
          <span className="button-small">
            <SettingIcon className="button-small-style" />
          </span>
          <span onClick={() => swipe("left")} className="button-big">
            <DislikeIcon className="button-center" />
          </span>
          <span
            onClick={() => !disableGoBack && goBack()}
            className="button-small"
          >
            <ResetIcon className="button-small-style" />
          </span>
          <span onClick={() => swipe("right")} className="button-big">
            <LikeIcon className="button-center" />
          </span>
          <span className="button-small">
            <GroupAddIcon className="button-small-style" />
          </span>
        </div>
        {showLoadingMatchModal && (
          <ModalComponent className="matching-loading">
            {/** TODO implement image and translations */}
            <p>{t("match.loading.top")}</p>
            <p>{t("match.loading.center")}</p>
            <EatableHart />
            <p>{t("match.loading.bottom")}</p>
          </ModalComponent>
        )}
      </Suspense>
    </Layout>
  );
};

export default MatchingPage;
