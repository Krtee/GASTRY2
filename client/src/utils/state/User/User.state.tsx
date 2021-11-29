import { RecoilState, atom } from "recoil";
import { UserRole, UserType } from "./User.types";

export const userState: RecoilState<UserType> = atom({
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
