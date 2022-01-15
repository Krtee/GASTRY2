export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum TYPES {
  CAFE = "CAFE",
  COLD = "COLD",
  WARM = "WARM",
  DESSERT = "DESSERT",
}

export enum DIETS {
  VEGAN = "VEGAN",
  VEGETARIAN = "VEGETARIAN",
  GLUTENFREE = "GLUTEN_FREE",
  NOPORK = "NO_PORK",
}

export enum INTOLERANCES {
  PEANUT = "PEANUT",
  FISH = "FISH",
  ONION = "ONION",
  GARLIC = "GARLIC",
  TOMATOE = "TOMATOE",
}

export enum CUISINES {
  ITALIAN = "ITALIAN",
  ASIAN = "ASIAN",
  GREEK = "GREEK",
  SOUTHAMERICAN = "SOUTH_AMERICAN",
  AFRICAN = "AFRICAN",
  SPANISH = "SPANISH",
  FRENCH = "FRENCH",
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
