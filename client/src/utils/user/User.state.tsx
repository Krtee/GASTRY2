import { RecoilState, atom } from "recoil";
import { User } from "./User.types";

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
    diets: [],
    intolerances: [],
    favoriteRestaurants: [],
    followers: [],
    followings: [],
  },
});
