import { RecoilState, atom } from "recoil";
import { User, UserRole } from "./User.types";

export const userState: RecoilState<User> = atom<User>({
  key: "currentUser",
  default: {
    id: "",
    photo: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: UserRole.USER,
    token: "",
    city: "",
    lat: "",
    long: "",
    bio: "",
    posts: [],
    diets: [],
    intolerances: [],
    types: [],
    cuisines: [] as string[],
    favoriteRestaurants: [],
    visitedRestaurants: [],
    subscribedRestaurants: [],
    buddies: [],
  },
});
