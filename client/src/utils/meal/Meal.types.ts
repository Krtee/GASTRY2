export interface Meal {
  idMeal: string;
  strMeal: string;
  strCategory: string;
  strArea: string;
  strInstructions?: string;
  strMealThumb?: string;
  strTags?: string;
  strYoutube?: string;
}

export enum Category {
  BEEF = "BEEF",
  CHICKEN = "CHICKEN",
  DESSERT = "DESSERT",
  GOAT = "GOAT",
  LAMB = "LAMB",
  MISCELLANEOUS = "MISCELLANEOUS",
  PASTA = "PASTA",
  PORK = "PORK",
  SEAFOOD = "SEAFOOD",
  SIDE = "SIDE",
  STARTER = "STARTER",
  VEGAN = "VEGAN",
  VEGETARIAN = "VEGETARIAN",
}
