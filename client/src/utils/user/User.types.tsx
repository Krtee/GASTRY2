export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum TYPES {
  CAFE = "cafe",
  COLD = "cold",
  WARM = "warm",
  DESSERT = "dessert",
}

export enum DIETS {
  VEGAN = "vegan",
  VEGETARIAN = "vegetarian",
  GLUTENFREE = "glutenFree",
  NOPORK = "noPork",
}

export enum INTOLERANCES {
  PEANUT = "peanut",
  FISH = "fish",
  ONION = "onion",
  GARLIC = "garlic",
  TOMATOE = "tomatoe",
}

export enum CUISINES {
  ITALIAN = "italian",
  ASIAN = "asian",
  GREEK = "greek",
  SOUTHAMERICAN = "southAmerican",
  AFRICAN = "african",
  SPANISH = "spanish",
  FRENCH = "french",
}

export interface User {
  id: string;
  photo: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  city: string;
  lat: string;
  long: string;
  role: UserRole | string;
  password?: string;
  posts: [];
  diets: DIETS[];
  intolerances: INTOLERANCES[];
  cuisines: CUISINES[];
  types: TYPES[];
  favoriteRestaurants: [];
  followers: [];
  followings: [];
}
