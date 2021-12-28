export enum UserRole {
  ADMIN = "ADMIN",
  USER = "USER",
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
  diets: [];
  intolerances: [];
  favoriteRestaurants: [];
  followers: [];
  followings: [];
}
