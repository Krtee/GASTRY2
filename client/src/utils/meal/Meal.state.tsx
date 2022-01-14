import { atom, RecoilState, selector } from "recoil";
import { axiosState } from "../Axios.state";
import { Meal } from "./Meal.types";
import { fetchRandomMeals } from "./Meal.utils";

export const randomMealsSelector = selector<Meal[]>({
  key: "randomMealsSelector",
  get: async ({ get }) => {
    const { instance: axios } = get(axiosState);

    if (!axios || axios === null) {
      return [];
    }
    const randomMeals = await fetchRandomMeals(
      axios,
      parseInt(process.env.REACT_APP_DEFAULT_MEAL_COUNT || "15")
    );

    if (randomMeals) {
      return randomMeals;
    }
    return [];
  },
});
export const randomMealsState: RecoilState<Meal[]> = atom<Meal[]>({
  key: "randomMealState",
  default: randomMealsSelector,
});
