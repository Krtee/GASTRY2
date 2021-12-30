import { RecoilState, atom } from "recoil";
import { User, INTOLERANCES, DIETS } from "./User.types";

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
    favoriteRestaurants: [],
    followers: [],
    followings: [],
  },
});
