export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum DIETS {
  VEGAN = "VEGAN",
  VEGETARIAN = "VEGETARIAN",
  GLUTENFREE = "GLUTENFREE",
  PORK = "PORK",
}

export enum INTOLERANCES {
  PEANUT = "PEANUT",
  FISH = "FISH",
  ONION = "ONION",
  GARLIC = "GARLIC",
  TOMATOE = "TOMATOE",
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
  favoriteRestaurants: [];
  followers: [];
  followings: [];
}
