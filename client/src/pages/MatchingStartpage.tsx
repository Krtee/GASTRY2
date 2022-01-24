import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ButtonComponent from "../components/ButtonComponent/ButtonComponent";
import Layout from "../components/LayoutComponent/Layout";
import { useAxios } from "../utils/AxiosUtil";
import { Page, useNavigation } from "../utils/hooks/useNavigation";
import { currentMatchState } from "../utils/match/Match.state";
import { createEmptyMatch, postNewMatch } from "../utils/match/Match.Utils";
import { randomMealsState } from "../utils/meal/Meal.state";
import { fetchRandomMeals } from "../utils/meal/Meal.utils";
import { userState } from "../utils/user/User.state";
import "./../styles/MatchingStartStyles.scss";

const MatchingStartpage: React.FC<{}> = () => {
  const navProps = useNavigation(Page.MATCHING_START, Page.MATCHING);
  const { t } = useTranslation();
  const { axios } = useAxios();
  const user = useRecoilValue(userState);
  const setMealsToSwipe = useSetRecoilState(randomMealsState);
  const setCurrentMatch = useSetRecoilState(currentMatchState);
  const history = useHistory();

  /**
   *sets current match and routes to the matching page
   *@author Minh
   */
  const handleNewMatch = () => {
    if (axios) {
      fetchRandomMeals(
        axios,
        parseInt(process.env.REACT_APP_DEFAULT_MEAL_COUNT || "15")
      ).then(setMealsToSwipe);
      postNewMatch(axios, createEmptyMatch(user?.id)).then((res) => {
        if (res) {
          setCurrentMatch(res);
          history.push("/matching");
        }
      });
    }
  };

  return (
    <Layout {...navProps} className="matching-start-page">
      <p>{t("match.start.title")}</p>
      <ButtonComponent
        value={t("general.buttons.start")}
        size="big"
        onClick={() => handleNewMatch()}
      />
    </Layout>
  );
};

export default MatchingStartpage;
