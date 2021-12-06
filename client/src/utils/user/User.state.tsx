import { RecoilState, atom } from "recoil";
import { UserRole, User } from "./User.types";

export const userState: RecoilState<User> = atom({
  key: "currentUser",
  default: {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: "USER",
  },
});
