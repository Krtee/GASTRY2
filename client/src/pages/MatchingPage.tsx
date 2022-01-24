import { useKeycloak } from "@react-keycloak/web";
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
import { ReactComponent as WaitIcon } from "../assets/icons/wait.svg";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import CardComponent from "../components/CardComponent/CardComponent";
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
  updateMatch,
} from "../utils/match/Match.Utils";
import { randomMealsState } from "../utils/meal/Meal.state";
import { Meal } from "../utils/meal/Meal.types";
import { fetchRandomMeals } from "../utils/meal/Meal.utils";
import {
  currentMultiMatchState,
  getUserForMultiMatch,
} from "../utils/multimatch/MultiMatch.state";
import { MultiUserMatch } from "../utils/multimatch/MultiMatch.types";
import { checkIfMultiMatchisFinished } from "../utils/multimatch/MultiMatch.Utils";
import { userState } from "../utils/user/User.state";
import { User } from "../utils/user/User.types";

interface MatchingPageProps {}

enum MatchType {
  SINGLE_MATCH,
  MULTI_MATCH,
}

enum PopUpContent {
  SENDING_MATCH_ERROR,
  NO_LOCATION_ERROR,
  CANCEL_MATCHING,
}
enum SwipeDirection {
  LIKE,
  DISLIKE,
}
const MatchingPage: FC<MatchingPageProps> = () => {
  const navProps = useNavigation(Page.MATCHING);
  const [currentMatch, setCurrentMatch] = useRecoilState<Match | undefined>(
    currentMatchState
  );
  const currentMultiMatch = useRecoilValue<MultiUserMatch | undefined>(
    currentMultiMatchState
  );
  const { t } = useTranslation();
  const user = useRecoilValue(userState);
  const [mealsToSwipe, setMealsToSwipe] =
    useRecoilState<Meal[]>(randomMealsState);
  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef<number>(currentIndex);
  const canGoBack = currentIndex < mealsToSwipe.length - 1;
  const canSwipe = currentIndex >= 0;
  const [disableGoBack, setdisableGoBack] = useState(false);
  const history = useHistory();
  const [showLoadingMatchModal, setShowLoadingMatchModal] =
    useState<MatchType>();
  const { geolocation: location, refreshGeolocation } = useGeoLocation();
  const { axios } = useAxios();
  const multiUserList = useRecoilValue<User[]>(getUserForMultiMatch);
  const { keycloak } = useKeycloak();
  const [showPopUp, setShowPopUp] = useState<PopUpContent>();
  const childRefs: RefObject<any>[] = useMemo(
    () =>
      Array(mealsToSwipe.length)
        .fill(0)
        .map(() => createRef()),
    [mealsToSwipe.length]
  );
  const [showDirOnImage, setShowDirOnImage] = useState<SwipeDirection>();
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
    setShowDirOnImage(undefined);
    switch (direction) {
      case "left":
        setCurrentMatch((lastMatchState) => ({
          ...lastMatchState!,
          unmatchedMeals: [...lastMatchState!.unmatchedMeals, meal],
        }));
        break;
      case "right":
        setCurrentMatch((lastMatchState) => ({
          ...lastMatchState!,
          matchedMeals: [...lastMatchState!.matchedMeals, meal],
        }));
        break;
      default:
    }
    setdisableGoBack(false);
    updateCurrentIndex(index + 1);
    if (index === mealsToSwipe.length - 1) {
      handleSubmitMatch();
    }
  };

  /**
   * handles submit of current match
   */
  const handleSubmitMatch = async (): Promise<void> => {
    setShowPopUp(undefined);
    setShowLoadingMatchModal(MatchType.SINGLE_MATCH);

    if (!axios) {
      setShowPopUp(PopUpContent.SENDING_MATCH_ERROR);
      return;
    }

    if (!location || !location.coordinates || !location.loaded) {
      setShowPopUp(PopUpContent.NO_LOCATION_ERROR);
      refreshGeolocation();
      return;
    }

    let updatedMatch: Match;
    if (user?.id) {
      updatedMatch = await updateMatch(axios, currentMatch!, location);
    } else {
      updatedMatch = await matchRestaurants(axios, currentMatch!, location);
    }
    if (!updatedMatch) {
      setShowLoadingMatchModal(undefined);
      setShowPopUp(PopUpContent.SENDING_MATCH_ERROR);
      return;
    }
    setCurrentMatch(updatedMatch);

    if (
      updatedMatch.partOfGroup &&
      currentMultiMatch &&
      currentMultiMatch.id &&
      !(await checkIfMultiMatchisFinished(axios, currentMultiMatch.id))
    ) {
      setShowLoadingMatchModal(MatchType.MULTI_MATCH);
    } else {
      setTimeout(() => {
        history.push(`/matching/result/${updatedMatch.id}`);
        setShowLoadingMatchModal(undefined);
      }, 1000);
    }
  };

  /**
   * handles meals, that are out of frame
   * @param idx
   * @author Minh
   */
  const outOfFrame = (idx: number) => {
    // handle the case in which go back is pressed before card goes outOfFrame
    currentIndexRef.current <= idx &&
      childRefs[currentIndexRef.current].current.restoreCard();
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
    const newIndex = currentIndex - 1;
    updateCurrentIndex(newIndex);
    setCurrentMatch({
      ...currentMatch!,
      unmatchedMeals: currentMatch!.unmatchedMeals.filter(
        (_, index) => index !== newIndex
      ),
      matchedMeals: currentMatch!.matchedMeals.filter(
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
  const handleRematch = (): void => {
    if (axios && user?.id) {
      fetchRandomMeals(
        axios,
        parseInt(process.env.REACT_APP_DEFAULT_MEAL_COUNT || "15")
      ).then(setMealsToSwipe);
      postNewMatch(axios, createEmptyMatch(user?.id)).then((res) => {
        if (res) {
          updateCurrentIndex(0);
          setCurrentMatch(res);
          setShowPopUp(undefined);
        }
      });
    }
  };

  const getErrorPopUpContent = () => {
    switch (showPopUp) {
      case PopUpContent.NO_LOCATION_ERROR:
        return (
          <CardComponent>
            <p>{t(`match.error.nolocation`)}</p>
            <div>
              <ButtonComponent
                value={t("match.button.rematch")}
                onClick={() => handleRematch()}
                color="transparent"
              />
              <ButtonComponent
                value={t("general.buttons.retry")}
                onClick={() => handleSubmitMatch()}
              />
            </div>
          </CardComponent>
        );
      case PopUpContent.CANCEL_MATCHING:
        return (
          <CardComponent>
            <p>{t(`match.error.cancelMatching`)}</p>
            <div>
              <ButtonComponent
                value={t("match.button.continueMatching")}
                onClick={() => setShowPopUp(undefined)}
              />
              <ButtonComponent
                value={t("match.button.cancelMatching")}
                onClick={() => history.goBack()}
              />
            </div>
          </CardComponent>
        );
      case PopUpContent.SENDING_MATCH_ERROR:
        return (
          <CardComponent>
            <p>{t(`match.error.default`)}</p>
            <div>
              <ButtonComponent
                value={t("general.buttons.retry")}
                onClick={() => handleSubmitMatch()}
              />
              <ButtonComponent
                value={t("match.button.rematch")}
                onClick={() => handleRematch()}
              />
            </div>
          </CardComponent>
        );
      default:
        break;
    }
  };

  /**
   * returns to the starting screen, if no match exist
   * @author Minh
   */
  useEffect(() => {
    if (!currentMatch) {
      history.push("/matching/start");
    }
    // eslint-disable-next-line
  }, [history]);

  return (
    <Layout
      {...navProps}
      className="matching-page"
      header={{
        leftIconButton: {
          value: <ArrowIcon />,
          onClick: () => history.goBack(),
        },
        title: t("general.pages.matching"),
      }}
    >
      <Suspense
        fallback={
          <div>{/** TODO implement loading component */}Loading...</div>
        }
      >
        {currentMultiMatch &&
        showLoadingMatchModal === MatchType.MULTI_MATCH &&
        currentMultiMatch!.matchedRestaurants.length === 0 ? (
          <div className={"multi-user-match-wait-screen"}>
            <p className={"multi-user-match-wait-screen__top-big"}>
              {t("match.multi-user.wait.top-text")}
            </p>
            <WaitIcon />
            <p className={"multi-user-match-wait-screen__top-big"}>
              {t("match.multi-user.wait.center-text")}
            </p>
            {multiUserList.map((friend) => (
              <p key={friend.username}>{friend.username}</p>
            ))}
            <ButtonComponent
              value={t("match.buttons.rematch")}
              onClick={() => handleRematch()}
            />
          </div>
        ) : currentMatch ? (
          <div className="matching-page__content-wrapper">
            <div className="swipeable-card-container">
              {mealsToSwipe.map((meal, index) => (
                <TinderCard
                  ref={childRefs[index]}
                  key={meal.idMeal}
                  onSwipe={(dir) =>
                    swiped(dir as "left" | "right", meal, index)
                  }
                  preventSwipe={["up", "down"]}
                  onCardLeftScreen={() => outOfFrame(index)}
                  className={`container container--${index}`}
                  onSwipeRequirementFulfilled={(dir) => {
                    if (dir === "left") {
                      console.log(dir, currentIndex, index);

                      setShowDirOnImage(SwipeDirection.DISLIKE);
                    }
                    if (dir === "right") {
                      console.log(dir, currentIndex, index);

                      setShowDirOnImage(SwipeDirection.LIKE);
                    }
                  }}
                  onSwipeRequirementUnfulfilled={() =>
                    setShowDirOnImage(undefined)
                  }
                  swipeRequirementType="position"
                  swipeThreshold={200}
                >
                  <img src={meal.strMealThumb} alt={meal.strMeal} />
                  <div className="progressBar">
                    <div
                      className="progressBarStyle"
                      style={{
                        width: ((currentIndex / 15) * 100).toFixed(0) + "%",
                      }}
                    >
                      <span className="progressBarText">
                        {((currentIndex / 15) * 100).toFixed(0) + "%"}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`swipe-gesture-indicator swipe-gesture-indicator__like  ${
                      showDirOnImage === SwipeDirection.LIKE &&
                      currentIndex === index
                        ? "show"
                        : ""
                    }`}
                  >
                    <LikeIcon />
                  </span>
                  <span
                    className={`swipe-gesture-indicator swipe-gesture-indicator__dislike ${
                      showDirOnImage === SwipeDirection.DISLIKE &&
                      currentIndex === index
                        ? "show"
                        : ""
                    }`}
                  >
                    <DislikeIcon />
                  </span>
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
                <GroupAddIcon
                  className="button-small-style"
                  onClick={() =>
                    user
                      ? history.push("/matching/addfriends")
                      : keycloak.login()
                  }
                />
                {multiUserList.length > 0 && (
                  <span className="friend-badge">{multiUserList.length}</span>
                )}
              </span>
            </div>
            {showLoadingMatchModal === MatchType.SINGLE_MATCH && (
              <ModalComponent className="matching-loading">
                {/** TODO implement image and translations */}
                <p>{t("match.loading.top")}</p>
                <p>{t("match.loading.center")}</p>
                <EatableHart />
                <p>{t("match.loading.bottom")}</p>
              </ModalComponent>
            )}
            {showPopUp && (
              <ModalComponent className="matching-page__error-pop-up">
                {getErrorPopUpContent()}
              </ModalComponent>
            )}
          </div>
        ) : (
          <div>Loading</div>
        )}
      </Suspense>
    </Layout>
  );
};

export default MatchingPage;
