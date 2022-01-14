import { AxiosInstance } from "axios";
import { Meal } from "./Meal.types";

/**
 * GET API - to fetch random meals
 * @param axios axios Instance
 * @param count how many meals should be fetched
 * @returns list of meals
 * @author Minh
 */
export const fetchRandomMeals = (
  axios: AxiosInstance,
  count: number
): Promise<Meal[]> =>
  axios
    .get("/data/meal/random", { params: { count: count } })
    .then((res) => res.data as Meal[])
    .catch(() => {
      console.log("dang");
      return [];
    });
