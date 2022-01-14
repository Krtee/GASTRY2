import { AxiosInstance } from "axios";
import { Meal } from "./Meal.types";

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
