import { RecoilState, atom } from "recoil";
import { User } from "./User.types";

export const userState: RecoilState<User> = atom({
  key: "currentUser",
  default: {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "USER",
    posts: [],
  },
});
