import { DIETS, INTOLERANCES } from "../../utils/user/User.types";

export interface UserSettingsProps {}

export const dietsArr: DIETS[] = [
  DIETS.VEGAN,
  DIETS.VEGETARIAN,
  DIETS.GLUTENFREE,
  DIETS.PORK,
];
export const intolerancesArr: INTOLERANCES[] = [
  INTOLERANCES.PEANUT,
  INTOLERANCES.FISH,
  INTOLERANCES.ONION,
  INTOLERANCES.GARLIC,
  INTOLERANCES.TOMATOE,
];
