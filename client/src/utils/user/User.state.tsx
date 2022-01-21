import { RecoilState, atom } from "recoil";
import { User, UserRole } from "./User.types";

export const userState: RecoilState<User> = atom<User>({
  key: "currentUser",
  default: {
    id: "",
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    role: UserRole.USER,
    token: ""
  },
});


