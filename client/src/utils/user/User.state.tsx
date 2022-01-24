import { RecoilState, atom } from "recoil";
import { User, UserRole } from "./User.types";

export const userState: RecoilState<User | undefined> = atom<User | undefined>({
  key: "currentUser",
  default: undefined,
});
