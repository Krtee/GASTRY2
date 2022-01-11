import { RecoilState, atom } from "recoil";
import { User, INTOLERANCES, DIETS, TYPES, CUISINES } from "./User.types";

export const userState: RecoilState<User> = atom({
  key: "currentUser",
  default: {
    id: "",
    photo: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    city: "",
    lat: "",
    long: "",
    role: "USER",
    posts: [],
    diets: [] as DIETS[],
    intolerances: [] as INTOLERANCES[],
    types: [] as TYPES[],
    cuisines: [] as CUISINES[],
    favoriteRestaurants: [],
    followers: [],
    followings: [],
  },
});
