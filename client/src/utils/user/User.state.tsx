import { atom, RecoilState } from "recoil";
import { User } from "./User.types";

export const userState: RecoilState<User | undefined> = atom<User | undefined>({
  key: "currentUser",
  default: undefined,
});
