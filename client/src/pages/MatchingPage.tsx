import {
  createRef,
  FC,
  RefObject,
  Suspense,
  useMemo,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router";
import TinderCard from "react-tinder-card";
import { useRecoilState, useRecoilValue } from "recoil";
import { ReactComponent as ArrowIcon } from "../assets/images/arrow.svg";
import { ReactComponent as DislikeIcon } from "../assets/images/dislike.svg";
import { ReactComponent as GroupAddIcon } from "../assets/images/groupadd.svg";
import { ReactComponent as LikeIcon } from "../assets/images/like.svg";
import { ReactComponent as ResetIcon } from "../assets/images/reset.svg";
import { ReactComponent as SettingIcon } from "../assets/images/settings.svg";
import Layout from "../components/LayoutComponent/Layout";
import ModalComponent from "../components/ModalComponent/ModalComponent";
import "../styles/MatchingPage.styles.scss";
import { useAxios } from "../utils/AxiosUtil";
import useGeoLocation from "../utils/hooks/useGeoLocation";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { currentMatchState } from "../utils/match/Match.state";
import { Match } from "../utils/match/Match.types";
import { matchRestaurants } from "../utils/match/Match.Utils";
import { randomMealsState } from "../utils/meal/Meal.state";
import { Meal } from "../utils/meal/Meal.types";

interface MatchingPageProps {}

const MatchingPage: FC<MatchingPageProps> = () => {
  const { currentLocation, onLocationChange } = useNavigation(Page.MATCHING);
  const [currentMatch, setCurrentMatch] =
    useRecoilState<Match>(currentMatchState);
  const mealsToSwipe = useRecoilValue<Meal[]>(randomMealsState);
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
  const swipeCardRefs: RefObject<any>[] = useMemo(
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
      matchRestaurants(axios, currentMatch, location).then((res) => {
        setCurrentMatch(res);
        setTimeout(() => {
          history.push("/matching/result");
        }, 3000);
      });
    }
  };

  /**
   * handles meals, that are out of frame
   * @param idx
   */
  const outOfFrame = (idx: number) => {
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current >= idx && swipeCardRefs[idx].current.restoreCard();
    // TODO: when quickly swipe and restore multiple times the same card,
    // it happens multiple outOfFrame events are queued and the card disappear
    // during latest swipes. Only the last outOfFrame event should be considered valid
  };

  /**
   * handler if programatically swiped
   * @param dir direction to swipe: either left or right
   */
  const swipe = async (dir: "left" | "right") => {
    if (canSwipe && currentIndex < mealsToSwipe.length) {
      await swipeCardRefs[currentIndex].current.swipe(dir); // Swipe the card!
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
    await swipeCardRefs[newIndex].current.restoreCard();
  };

  return (
    <Layout
      navigationElements={Object.entries(Page).map((page) => ({
        title: page[1],
      }))}
      changeLocation={onLocationChange}
      currentLocation={currentLocation}
      className="matching-page"
    >
      <Suspense
        fallback={
          <div>{/** TODO implement loading component */}Loading...</div>
        }
      >
        <div className="swipeable-card-container">
          {mealsToSwipe.map((meal, index) => (
            <TinderCard
              ref={swipeCardRefs[index]}
              key={meal.idMeal}
              onSwipe={(dir) => swiped(dir as "left" | "right", meal, index)}
              preventSwipe={["up", "down"]}
              onCardLeftScreen={() => outOfFrame(index)}
              className="container"
            >
              <span onClick={() => goBack()} className="back-button">
                <ArrowIcon />
              </span>
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
            <p>Es ist ein ...</p>
            <p>YUMMMMatch</p>
            <p>Und die besten Restaurants in deiner Nähe sind...</p>
          </ModalComponent>
        )}
      </Suspense>
    </Layout>
  );
};

export default MatchingPage;
